package com.upbest.web;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.upbest.filter.utils.AESUtil;
import com.upbest.filter.utils.MD5Util;
import com.upbest.filter.utils.TokenUtil;
import com.upbest.model.SysUser;
import com.upbest.service.IManageService;
import com.upbest.utils.ConfigUtil;
import com.upbest.utils.DateUtils;
import com.upbest.utils.RespJson;
import com.upbest.utils.ResultCode;
import com.upbest.utils.UploadFileUtils;
import com.upbest.utils.UploadState;
import com.upbest.utils.VerifyCodeUtils;

@Controller
@RequestMapping(value = "/manage")
public class ManageController {

	private Logger logger = Logger.getLogger(ManageController.class);

	@Autowired
	IManageService manageService;
	

	@RequestMapping(value = { "/login", "/" })
	public String login(HttpSession session, Model model) {
		return "manage/login";
	}

	@RequestMapping(value = "/index")
	public String index(HttpSession session, Model model) {
		return "manage/index";
	}

	@ResponseBody
	@RequestMapping(value = "/logining", method = RequestMethod.POST)
	public RespJson logining(HttpSession session, HttpServletRequest request,
			HttpServletResponse response,
			String userName, String password, String verifyCode, Model model) {
		response.setHeader("Access-Control-Allow-Origin", "*");
		String trueCode = (String) session.getAttribute("code");
		// TODO 暂时去掉 开发阶段 登录方便
		if (StringUtils.isEmpty(verifyCode)
				|| !trueCode.equals(verifyCode.toLowerCase())) {
			return new RespJson(false, "验证码错误！", ResultCode.USER_NOT_EXIST,
					null);
		}
		try {
			// 校验用户名和密码，校验失败，返回登录页面
			if (StringUtils.isEmpty(userName) || StringUtils.isEmpty(password)) {
				return new RespJson(false, "用户不存在！", ResultCode.USER_NOT_EXIST,
						null);
			}
			return logining(session, request, userName, password);
		} catch (Exception e) {
			logger.error("未知错误,请联系管理员:" + e);
			return new RespJson(false, "未知错误,请联系管理员！", ResultCode.ERROR, null);
		}
	}
	
	private RespJson logining(HttpSession session, HttpServletRequest request,
			String name, String password) throws Exception {
		HashMap<String, Object> param = new HashMap<String, Object>();
		param.put("userName", name);
		SysUser user = manageService.queryUserByLoginName(param);
		if (null == user) {
			logger.error("login failed........登录失败，用户不存在");
			return new RespJson(false, "用户不存在", ResultCode.USER_NOT_EXIST, null);
		}
		password = MD5Util.md5(password);

		if (user.getUserPwd().equals(password)) {
			if (user.getStatus() == 0) {
				String access_token = TokenUtil.generateToken(user.getUserName());
				session.setAttribute(access_token,user.getId());
			    HashMap<String, Object> result = new HashMap<String, Object>();
			    result.put("access_token", access_token);
			    result.put("loginName", user.getUserName());
				logger.debug("login successful........");
				return new RespJson(true, "登录成功", ResultCode.SUCCESS, result);
			} else {
				logger.error("login failed........登录失败，用户停用或锁定");
				return new RespJson(false, "登录失败，用户尚未审批通过或被删除",
						ResultCode.USER_NOT_EXIST, null);
			}

		} else {
			logger.error("login failed........登录失败，密码错误");
			return new RespJson(false, "密码错误", ResultCode.USER_PWD_ERROR, null);
		}
	}
	
	@RequestMapping(value = "/code", method = RequestMethod.GET, produces = "text/html; charset=utf-8")
	@ResponseBody
	public void getCode(HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		response.setHeader("Access-Control-Allow-Origin", "*");
		// 禁止图像缓存。
		response.setHeader("Pragma", "no-cache");
		response.setHeader("Cache-Control", "no-cache");
		response.setDateHeader("Expires", 0);

		response.setContentType("image/jpeg");

		// 生成随机字串
		String verifyCode = VerifyCodeUtils.generateVerifyCode(4);

		// 存入会话session
		HttpSession session = request.getSession(true);
		session.setAttribute("code", verifyCode.toLowerCase());
		// System.out.println("---生成的CODE---" + verifyCode.toLowerCase());
		// 生成图片
		int w = 100, h = 44;
		VerifyCodeUtils.outputImage(w, h, response.getOutputStream(),
				verifyCode);
	} 

	/**
	 * @Title logout
	 * @Description 退出登录
	 * @author 韩鹏鹏
	 * @param request
	 * @param response
	 * @param session
	 *            void
	 * @date 2018年7月23日 上午11:38:58
	 * @throws
	 */
	@RequestMapping(value = "logout")
	public RespJson logout(HttpServletRequest request,
			HttpServletResponse response, HttpSession session) {
		SysUser user = getUser(request, session);
		if(null == user){
			return new RespJson(false, "请您登陆后再进行该操作！", ResultCode.TOKEN_NOT_EXIST, null);
		}
		String token = request.getHeader("token");
		response.setHeader("Access-Control-Allow-Origin", "*");
		session.removeAttribute(token);
		return new RespJson(true, "退出成功", ResultCode.SUCCESS, null);
//		try {
//			String url = "http://" + request.getServerName() + ":"
//					+ request.getServerPort() + "/manage/login.html";
//			response.sendRedirect(url);
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
	}
	
	/**
	 * @Title: validateToken  
	 * @Description: 判断后台是否还在执行 缓存是否存在
	 * @author: hanpp
	 * @param request
	 * @param response
	 * @param session
	 * @return RespJson
	 * @date 2018年9月29日 上午11:53:12  
	 * @throws
	 */
	@ResponseBody
	@RequestMapping(value = "/validate/token")
	public RespJson validateToken(HttpServletRequest request,
			HttpServletResponse response, HttpSession session) {
		String token = request.getHeader("token");
		response.setHeader("Access-Control-Allow-Origin", "*");
		if (null == session.getAttribute(token)) {
			return new RespJson(false, "请您登陆后再进行该操作！", ResultCode.TOKEN_NOT_EXIST, null);
		}
		return new RespJson(true, "在线状态！", ResultCode.SUCCESS, null);
	}
	
	@RequestMapping(value = "/config")
	public String name(HttpSession session, Model model) {
		model.addAttribute("currentPage", "areaConfig");
		model.addAttribute("currentPage", "cityConfig");
		return "manage/areaConfig";
	}
	
	public SysUser getUser(HttpServletRequest request,HttpSession session) {
		String token = request.getHeader("token");
		Integer userId = (Integer)session.getAttribute(token);
		if (null == userId) {
			return null;
		}
		HashMap<String, Object> param = new HashMap<String, Object>();
		param.put("id", userId);
		SysUser user = manageService.queryUserByLoginName(param);
		return user;
	}
	
	/**
	 * @Title: uploadFile  
	 * @Description: 图片上传
	 * @author: hanpp
	 * @param request
	 * @param session
	 * @return RespJson
	 * @date 2018年9月29日 上午11:00:58  
	 * @throws
	 */
	@ResponseBody
	@RequestMapping(value = "/file/upload")
	public RespJson uploadFile(HttpServletRequest request, HttpSession session){
		SysUser user = getUser(request, session);
		if(null == user){
			return new RespJson(false, "请您登陆后再进行该操作！", ResultCode.TOKEN_NOT_EXIST, null);
		}
		MultipartHttpServletRequest mHttpServletRequest = (MultipartHttpServletRequest)request;
		MultipartFile file = mHttpServletRequest.getFile("file");
		String name = file.getOriginalFilename();
		HashMap<String, Object> result = uploadFileType(file, name);
		if ("true".equals(result.get("isTrue").toString())) {
			result.put("imgUrl", ConfigUtil.get("url")
					+ result.get("imgUrl").toString());
			return new RespJson(true, "", ResultCode.SUCCESS, AESUtil.encrypt(result, 1));
		}
		return new RespJson(false, "文件上传失败", ResultCode.ERROR, null);
	}
	
	public HashMap<String, Object> uploadFileType(MultipartFile file,
			String FileName) {
		HashMap<String, Object> result = new HashMap<>();
		int end = FileName.lastIndexOf(".");
		String fn = FileName.substring(end);
		String name = DateUtils.formateDate(new Date(),
				DateUtils.YYYYMMDDHHMMSS) + fn;
		InputStream is = null;
		if (file != null) {
			// name = file.getOriginalFilename();
			try {
				is = file.getInputStream();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		String path = getFilePath();
		String filepath = ConfigUtil.get("upload.path")+path;
		UploadState record = null;
		try {
			record = UploadFileUtils.upload4Stream(name, filepath, is);
			result.put("isTrue", "true");
			result.put("imgUrl", path+"/"+name);
			result.put("path", path+"/"+name);
		} catch (Exception e) {
			e.printStackTrace();
			result.put("isTrue", "false");
		}
		return result;
	}

	private  String getFilePath() {
		long time = System.currentTimeMillis();
		String value = String.valueOf(time);
		String sub = value.substring(value.length()-4);
		String s1 = sub.substring(0,2);
		String s2 = sub.substring(2);
		return s1+"/"+s2;
	}
}
