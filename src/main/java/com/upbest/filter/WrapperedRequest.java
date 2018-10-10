package com.upbest.filter;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.upbest.filter.utils.AESUtil;
import com.upbest.filter.utils.JSONUtil;
import com.upbest.filter.utils.SqlInjection;

/***
 * @Package: com.upbest.filter
 * @Description: 请求包装类
 * @author zhoujian
 * @date 2018年3月8日 下午8:04:30
 */
public class WrapperedRequest extends HttpServletRequestWrapper {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(WrapperedRequest.class);

	public WrapperedRequest(HttpServletRequest servletRequest) {
		super(servletRequest);
	}

	/***
	 * @Package: com.upbest.filter
	 * @Description: 重写父类方法
	 * @author zhoujian
	 * @date 2018年3月8日 下午8:04:30
	 */
	@Override
	public String[] getParameterValues(String parameter) {
		// 请求参数json字符串 已加密
		String values = super.getParameter("params");
		if (StringUtils.isBlank(values)) {
			return super.getParameterValues(parameter);
		}
		String[] encodedValues = new String[1];
		// 解密
		if (isEncrypt()) {
			try {
				values = AESUtil.decrypt(values);
				if (StringUtils.isBlank(values) || values.equals("null")) {
					values = "";
				}
			} catch (Exception e) {
				e.printStackTrace();
				LOGGER.error("getParameterValues Decrypt" + e);
			}
		}
		// 将jsonStr转换为map
		Map<String, Object> map = JSONUtil.parseMap(values);
		// 如果包含则进行取值处理
		if (null != map && map.containsKey(parameter)) {
			values = StringUtils.isBlank(String.valueOf(map.get(parameter))) ? ""
					: String.valueOf(map.get(parameter));
		} else {
			return super.getParameterValues(parameter);
		}
		Matcher mat = SqlInjection.HasInjectionData(values);
		if (!mat.find()) {
			encodedValues[0] = stripXSS(values, parameter);
			// encodedValues[i] = value;
		}
		return encodedValues;
	}

	/***
	 * @Package: com.upbest.filter
	 * @Description: 是否是加密请求
	 * @author zhoujian
	 * @date 2018年3月8日 下午8:04:30
	 */
	public boolean isEncrypt() {
		boolean isEncrypt = false;
		Map map = this.getParameterMap();
		if (map != null && map.size() > 0) {
			Set set = map.keySet();
			if (set.contains("encryptFlag")) {
				isEncrypt = true;
			}
		}
		return isEncrypt;
	}

	/***
	 * @Package: com.upbest.filter
	 * @Description: 重写父类方法
	 * @author zhoujian
	 * @date 2018年3月8日 下午8:03:03
	 */
	@Override
	public String getHeader(String name) {
		String value = super.getHeader(name);
		return stripXSS(value, name);
	}

	/***
	 * 特殊字符
	 */
	private static List<Pattern> patterns = null;

	private static List<Object[]> getXssPatternList() {
		List<Object[]> ret = new ArrayList<Object[]>();

		ret.add(new Object[] { "<(no)?script[^>]*>.*?</(no)?script>",
				Pattern.CASE_INSENSITIVE });
		ret.add(new Object[] { "eval\\((.*?)\\)",
				Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL });
		ret.add(new Object[] { "expression\\((.*?)\\)",
				Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL });
		ret.add(new Object[] { "(javascript:|vbscript:|view-source:)*",
				Pattern.CASE_INSENSITIVE });
		ret.add(new Object[] { "<(\"[^\"]*\"|\'[^\']*\'|[^\'\">])*>",
				Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL });
		ret.add(new Object[] {
				"(window\\.location|window\\.|\\.location|document\\.cookie|document\\.|alert\\(.*?\\)|window\\.open\\()*",
				Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL });
		ret.add(new Object[] {
				"<+\\s*\\w*\\s*(oncontrolselect|oncopy|oncut|ondataavailable|ondatasetchanged|ondatasetcomplete|ondblclick|ondeactivate|ondrag|ondragend|ondragenter|ondragleave|ondragover|ondragstart|ondrop|onerror=|onerroupdate|onfilterchange|onfinish|onfocus|onfocusin|onfocusout|onhelp|onkeydown|onkeypress|onkeyup|onlayoutcomplete|onload|onlosecapture|onmousedown|onmouseenter|onmouseleave|onmousemove|onmousout|onmouseover|onmouseup|onmousewheel|onmove|onmoveend|onmovestart|onabort|onactivate|onafterprint|onafterupdate|onbefore|onbeforeactivate|onbeforecopy|onbeforecut|onbeforedeactivate|onbeforeeditocus|onbeforepaste|onbeforeprint|onbeforeunload|onbeforeupdate|onblur|onbounce|oncellchange|onchange|onclick|oncontextmenu|onpaste|onpropertychange|onreadystatechange|onreset|onresize|onresizend|onresizestart|onrowenter|onrowexit|onrowsdelete|onrowsinserted|onscroll|onselect|onselectionchange|onselectstart|onstart|onstop|onsubmit|onunload)+\\s*=+",
				Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL });
		return ret;
	}

	private static List<Pattern> getPatterns() {
		if (patterns == null) {
			List<Pattern> list = new ArrayList<Pattern>();
			String regex = null;
			Integer flag = null;
			int arrLength = 0;
			for (Object[] arr : getXssPatternList()) {
				arrLength = arr.length;
				for (int i = 0; i < arrLength; i++) {
					regex = (String) arr[0];
					flag = (Integer) arr[1];
					list.add(Pattern.compile(regex, flag));
				}
			}
			patterns = list;
		}
		return patterns;
	}

	/***
	 * @Package: com.upbest.filter
	 * @Description: 过滤参数
	 * @author zhoujian
	 * @date 2018年3月16日 下午5:29:22
	 */
	public String stripXSS(String value, String name) {
		//getNoCheckParameter不需要过滤的参数
		if (getNoCheckParameter(name) && StringUtils.isNotBlank(value)) {
			Matcher matcher = null;
			for (Pattern pattern : getPatterns()) {
				matcher = pattern.matcher(value);
				// 匹配
				if (matcher.find()) {
					// 删除相关字符串
					value = matcher.replaceAll("");
				}
			}
			value = value.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
		}
		return value;
	}

	/***
	 * @Package: com.upbest.filter
	 * @Description: 过滤参数 back
	 * @author zhoujian
	 * @date 2018年3月8日 下午8:03:03
	 */
	private String stripXSSBack(String value, String parameter) {
		String valueNew = value;

		if ("keyWords".equals(parameter)) {
			System.out.println("==========================");
		}
		if (getNoCheckParameter(parameter) && valueNew != null) {
			valueNew = valueNew.replaceAll("", "");
			// 清除掉所有特殊字符
			String regEx = "[`~!@#$%^&*()+=|{}':;',\\[\\].<>/?~！@#￥%……&*（）_——+|{}【】‘；：”“’。，、？]";
			Pattern p = Pattern.compile(regEx);
			Matcher m = p.matcher(valueNew);
			valueNew = p.matcher(valueNew).replaceAll("");
			// 清除掉所有特殊字符（不包含空格）
			Pattern pt = Pattern.compile("((?=[\\x21-\\x7e]+)[^A-Za-z0-9])");
			Matcher mc = pt.matcher(valueNew);
			valueNew = pt.matcher(valueNew).replaceAll("");

			// 去除空格、回车、换行符、制表符
			Pattern ph = Pattern.compile("(^\\s*|\\s*|\\s*|\\t|\\r|\\n$)");
			Matcher mh = ph.matcher(valueNew);
			valueNew = ph.matcher(valueNew).replaceAll("");

			Pattern scriptPattern = Pattern.compile("<script>(.*?)</script>",
					Pattern.CASE_INSENSITIVE);
			valueNew = scriptPattern.matcher(valueNew).replaceAll("");

			scriptPattern = Pattern.compile("[%<>\"]+");
			valueNew = scriptPattern.matcher(valueNew).replaceAll("");

			// Avoid anything in a src='...' type of e­xpression
			scriptPattern = Pattern.compile("src[\r\n]*=[\r\n]*\\\'(.*?)\\\'",
					Pattern.CASE_INSENSITIVE | Pattern.MULTILINE
							| Pattern.DOTALL);
			valueNew = scriptPattern.matcher(valueNew).replaceAll("");

			scriptPattern = Pattern.compile("src[\r\n]*=[\r\n]*\\\"(.*?)\\\"",
					Pattern.CASE_INSENSITIVE | Pattern.MULTILINE
							| Pattern.DOTALL);
			valueNew = scriptPattern.matcher(valueNew).replaceAll("");

			// Remove any lonesome </script> tag
			scriptPattern = Pattern.compile("</script>",
					Pattern.CASE_INSENSITIVE);
			valueNew = scriptPattern.matcher(valueNew).replaceAll("");

			// Remove any lonesome <script ...> tag
			scriptPattern = Pattern.compile("<script(.*?)>",
					Pattern.CASE_INSENSITIVE | Pattern.MULTILINE
							| Pattern.DOTALL);
			valueNew = scriptPattern.matcher(valueNew).replaceAll("");

			// Avoid eval(...) e­xpressions
			scriptPattern = Pattern.compile("eval\\((.*?)\\)",
					Pattern.CASE_INSENSITIVE | Pattern.MULTILINE
							| Pattern.DOTALL);
			valueNew = scriptPattern.matcher(valueNew).replaceAll("");

			// Avoid e­xpression(...) e­xpressions
			scriptPattern = Pattern.compile("e­xpression\\((.*?)\\)",
					Pattern.CASE_INSENSITIVE | Pattern.MULTILINE
							| Pattern.DOTALL);
			valueNew = scriptPattern.matcher(valueNew).replaceAll("");

			// Avoid javascript:... e­xpressions
			scriptPattern = Pattern.compile("javascript:",
					Pattern.CASE_INSENSITIVE);
			valueNew = scriptPattern.matcher(valueNew).replaceAll("");

			// Avoid vbscript:... e­xpressions
			scriptPattern = Pattern.compile("vbscript:",
					Pattern.CASE_INSENSITIVE);
			valueNew = scriptPattern.matcher(valueNew).replaceAll("");

			// Avoid onload= e­xpressions
			scriptPattern = Pattern.compile("onload(.*?)=",
					Pattern.CASE_INSENSITIVE | Pattern.MULTILINE
							| Pattern.DOTALL);
			valueNew = scriptPattern.matcher(valueNew).replaceAll("");

			// 采用正则表达式将包含有 单引号(')，分号(;) 和 注释符号(--)的语句给替换掉来防止SQL注入
			scriptPattern = Pattern.compile(".*([';]+|(--)+).*");
			valueNew = scriptPattern.matcher(valueNew).replaceAll("");
		}

		return valueNew;
	}

	/***
	 * @Package: com.upbest.filter
	 * @Description: 判断name是否应该拦截 不拦截返回true，拦截返回false
	 * @author zhoujian
	 * @date 2018年3月8日 下午8:02:30
	 */
	private boolean getNoCheckParameter(String parameter) {
		String[] noFilterURLs = new String[] {};
		for (String parameters : noFilterURLs) {
			if (parameter.equals(parameters)) {
				return false;
			}
		}
		return true;
	}
}