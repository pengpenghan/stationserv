package com.upbest.filter;

import java.io.IOException;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashSet;
import java.util.Locale;
import java.util.Map;
import java.util.TreeMap;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.upbest.filter.utils.AESUtil;
import com.upbest.filter.utils.MD5Util;
import com.upbest.filter.utils.RequestIp;

/***
 * @Package: com.upbest.filter
 * @Description: 请求过滤器
 * @author zhoujian
 * @date 2018年3月8日 下午1:43:47
 */
public class SecurityFilter implements Filter {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(SecurityFilter.class);

	@Override
	public void destroy() {
	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		request.setCharacterEncoding("utf-8");
		HttpServletRequest req = (HttpServletRequest) request;
		HttpServletResponse resp = (HttpServletResponse) response;
		String method = req.getMethod();// 请求方式
		String path = req.getServletPath();
		// 拦截除POST及GET外的请求
		if (!StringUtils.isEmpty(method)
				&& ("post".equals(method.toLowerCase(Locale.ENGLISH)) || "get"
						.equals(method.toLowerCase(Locale.ENGLISH)))) {
			try {
				if (checkChange(request) || isAgain(request)) {
					toError(request, response, req, resp);
					return;
				}
				if (!isDataTabelsRequest(path)) {
					// DDOS
					if (!isDDOSRequest(req, path)) {
						toError(request, response, req, resp);
						return;
					}
				}
			} catch (Exception e) {
				toError(request, response, req, resp);
				return;
			}
			chain.doFilter(new WrapperedRequest(req), response);
		}
	}

	/***
	 * @Package: com.upbest.filter
	 * @Description: 跳转错误页面
	 * @author zhoujian
	 * @date 2018年3月8日 下午6:52:37
	 */
	private void toError(ServletRequest request, ServletResponse response,
			HttpServletRequest httpRequest, HttpServletResponse httpResponse)
			throws ServletException, IOException {
		String basePath = httpRequest.getScheme() + "://"
				+ httpRequest.getServerName() + ":"
				+ httpRequest.getServerPort() + httpRequest.getContextPath()
				+ "/error.htm";
		if (httpRequest.getHeader("x-requested-with") != null
				&& "XMLHttpRequest".equalsIgnoreCase(httpRequest
						.getHeader("x-requested-with"))) {
			// 向http头添加 状态 sessionstatus
			httpResponse.setHeader("SESSIONSTATUS", "TIMEOUT");
			httpResponse.setStatus(HttpServletResponse.SC_FORBIDDEN);
			// 向http头添加登录的url
			httpResponse.addHeader("CONTEXTPATH", basePath);
		} else {
			request.getRequestDispatcher("/error").forward(request, response);
		}
	}

	/***
	 * @Package: com.upbest.filter
	 * @Description: 防篡改
	 * @author zhoujian
	 * @date 2018年3月8日 下午6:52:23
	 */
	private boolean checkChange(ServletRequest request) throws Exception {
		boolean isChanged = false;
		Map<String, String> map = new TreeMap<String, String>();
		if (request.getParameter("encryptFlag") != null
				&& request.getParameter("sign") != null) {
			String sign = request.getParameter("sign");
			Enumeration enu = request.getParameterNames();
			while (enu.hasMoreElements()) {
				String paraName = (String) enu.nextElement();
				if (!paraName.equals("sign") && !paraName.equals("_")) {
					if (request.getParameterValues(paraName).length > 1) {
						StringBuilder sb = new StringBuilder();
						for (int i = 0; i < request
								.getParameterValues(paraName).length; i++) {
							sb.append(AESUtil.decrypt(request
									.getParameterValues(paraName)[i]));
						}
						map.put(paraName, sb.toString());
						continue;
					}
					String paraValue = AESUtil.decrypt(request
							.getParameter(paraName));
					map.put(paraName, paraValue);
				}
			}
			StringBuilder sb = new StringBuilder();
			for (String key : map.keySet()) {
				// 过滤分页内容
				if (!key.contains("[") && !"start".equals(key)
						&& !"length".equals(key) && !"draw".equals(key)) {
					sb.append(key);
					sb.append("=");
					sb.append(map.get(key));
					sb.append("&");
				}
			}
			String newSign = sb.substring(0, sb.length() - 1);
			String md5Sign = MD5Util.md5Hex(newSign, "utf-8");
			LOGGER.info("参数解密前:" + request.getParameter("params"));
			LOGGER.info("参数解密后:" + newSign);
			LOGGER.info("参数MD5签名:" + request.getParameter("sign"));
			LOGGER.info("参数组合MD5签名:=" + md5Sign);
			if (!sign.equals(md5Sign)) {
				isChanged = true;
			}
		}
		return isChanged;
	}

	/***
	 * @Package: com.upbest.filter
	 * @Description: 重放攻击
	 * @author zhoujian
	 * @date 2018年3月8日 下午6:53:11
	 */
	private boolean isAgain(ServletRequest request) {
		boolean isAgain = false;
		if (request.getParameter("timestamp") != null) {
			try {
				String paraValue = AESUtil.decrypt(request
						.getParameter("timestamp"));
				Long preTime = Long.valueOf(paraValue.substring(0, 13));
				Long backTime = new Date().getTime();
				// 请求时间与服务器时间相差超过2分钟算篡改
				if (backTime > (preTime + 120000)) {
					return true;
				}
				HttpServletRequest httpRequest = (HttpServletRequest) request;
				HashSet usedSigns = (HashSet) httpRequest.getSession()
						.getAttribute("timestampIsAgain");
				if (usedSigns != null) {
					Integer signNums = usedSigns.size();
					usedSigns.add(paraValue);
					if (usedSigns.size() == signNums) {
						isAgain = true;
					}
				} else {
					putSignsToSession(paraValue, httpRequest);
				}
				// 单session中存储标签超过200个时清零
				if (usedSigns != null && usedSigns.size() > 200) {
					putSignsToSession(paraValue, httpRequest);
					usedSigns = null;
				}
			} catch (Exception e) {
				isAgain = true;
			}
		}
		return isAgain;
	}

	private void putSignsToSession(String paraValue,
			HttpServletRequest httpRequest) {
		HashSet newUsedSigns = new HashSet(205);
		newUsedSigns.add(paraValue);
		httpRequest.getSession().setAttribute("timestampIsAgain", newUsedSigns);
	}

	/***
	 * @Package: com.upbest.filter
	 * @Description: 防止DDOS 攻击 一个ip 某一时间内多次请求
	 * @author zhoujian
	 * @date 2018年3月9日 下午4:50:54
	 */
	public boolean isDDOSRequest(HttpServletRequest request, String url) {
		String ip = request.getHeader("x-forwarded-for");
		if (ip == null || ip.length() == 0 || " unknown ".equalsIgnoreCase(ip)) {
			ip = request.getHeader(" Proxy-Client-IP ");
		}
		if (ip == null || ip.length() == 0 || " unknown ".equalsIgnoreCase(ip)) {
			ip = request.getHeader(" WL-Proxy-Client-IP ");
		}
		if (ip == null || ip.length() == 0 || " unknown ".equalsIgnoreCase(ip)) {
			ip = request.getRemoteAddr();
		}

		// 取session中的IP对象
		RequestIp re = (RequestIp) request.getSession().getAttribute(ip);
		if (null == re) {
			// 放入到session中
			RequestIp reIp = new RequestIp();
			reIp.setCreateTime(System.currentTimeMillis());
			reIp.setReCount(1);
			reIp.setUrl(url);
			request.getSession().setAttribute(ip, reIp);
			return true;
		} else {
			Long createTime = re.getCreateTime();
			if (null == createTime) {
				LOGGER.debug("请求太快请稍后再试：时间为空");
				return false;
			} else {
				if (((System.currentTimeMillis() - createTime) / 1000) > 5) {
					// 当前时间离上一次请求时间大于5秒，可以直接通过,保存这次的请求
					RequestIp reIp = new RequestIp();
					reIp.setCreateTime(System.currentTimeMillis());
					reIp.setReCount(1);
					reIp.setUrl(url);
					request.getSession().setAttribute(ip, reIp);
					return true;
				} else {
					// 小于5秒，并且5秒之内请求了10次，返回提示
					if (re.getUrl().equals(url)) {
						if (re.getReCount() > 10) {
							LOGGER.debug("请求太快请稍后再试:次数过多!");
							return false;
						} else {
							// 小于5秒，但请求数小于10次，给对象添加
							re.setCreateTime(System.currentTimeMillis());
							re.setReCount(re.getReCount() + 1);
							re.setUrl(url);
							request.getSession().setAttribute(ip, re);
							return true;
						}
					}
					return true;
				}
			}
		}
	}

	/**
	 * 
	 * @Title isDataTabelsRequest
	 * @Description
	 * @author 韩鹏鹏
	 * @param reqUrl
	 * @return boolean
	 * @date 2018年3月27日 上午9:55:06
	 * @throws
	 */
	private boolean isDataTabelsRequest(String reqUrl) {
		String[] noFilterURLs = new String[] {
				// 不需要过滤的分页请求
				"/system/web/querySdmpayList", "/system/web/queryJpushInfo" };
		for (String str : noFilterURLs) {
			if (str.equals(reqUrl)) {
				return true;
			}
		}
		return false;
	}
}