package com.upbest.web;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.beanutils.ConvertUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.pagehelper.PageInfo;
import com.upbest.filter.utils.MD5Util;
import com.upbest.model.SysRole;
import com.upbest.model.SysUser;
import com.upbest.service.IManageService;
import com.upbest.service.ISysUserService;
import com.upbest.utils.Constant;
import com.upbest.utils.DataTableModel;
import com.upbest.utils.DateUtils;
import com.upbest.utils.RespJson;
import com.upbest.utils.ResultCode;

/***
 * 用户控制器
 * 
 * @Description
 * @date 2017年3月23日 下午2:33:37
 */
@Controller
@RequestMapping(value = "/user")
public class UserController {

	private static final Logger logger = LoggerFactory
			.getLogger(UserController.class);

	@Autowired
	ISysUserService userService;
	
	@Autowired
	IManageService manageService;

	/**
	 * @Title: listUser  
	 * @Description: 获取用户分页列表
	 * @author: hanpp
	 * @param session
	 * @param response
	 * @param draw
	 * @param start
	 * @param length
	 * @param roleId
	 * @param userName
	 * @return DataTableModel<?>
	 * @date 2018年9月30日 下午2:36:41  
	 * @throws
	 */
	@ResponseBody
	@RequestMapping(value = "/page/list")
	public DataTableModel<?> listUser(HttpSession session,
			HttpServletResponse response, int draw, int start, int length,
			@RequestParam(value = "role_id",required = false) Integer roleId,
			@RequestParam(value = "user_name",required = false) String userName) {
		DataTableModel<SysUser> result = new DataTableModel<SysUser>();
		result.setDraw(draw);
		HashMap<String, Object> search = new HashMap<String, Object>();
		if (StringUtils.isNotBlank(userName)) {
			search.put("userName", userName);
		}
		if (roleId != null && roleId != -1) {
			search.put("roleId", roleId);
		}
		try {
			PageInfo<SysUser> pageValue = userService
					.listPageUserByCondition(search, start / length + 1, length);
			if (pageValue != null && pageValue.getEndRow() > 0) {
				result.setData(pageValue.getList());
				result.setRecordsFiltered(new Long(pageValue.getTotal())
						.intValue());
				result.setRecordsTotal(new Long(pageValue.getTotal())
						.intValue());
			}
		} catch (Exception ex) {
			ex.getStackTrace();
		}

		return result;
	}

	/**
	 * @Title: userUpdatePage  
	 * @Description: 获取用户详情
	 * @author: hanpp
	 * @param response
	 * @param request
	 * @param session
	 * @param userId
	 * @return RespJson
	 * @date 2018年9月30日 下午4:51:03  
	 * @throws
	 */
	@ResponseBody
	@RequestMapping(value = "/detail")
	public RespJson userUpdatePage(HttpServletResponse response,HttpServletRequest request,
			HttpSession session,
			@RequestParam(value = "user_id", required = true) Integer userId) {
		response.setHeader("Access-Control-Allow-Origin", "*");
		SysUser user = getUser(request, session);
		if(null == user){
			return new RespJson(false, "请您登陆后再进行该操作！", ResultCode.TOKEN_NOT_EXIST, null);
		}
		try {
			SysUser userdl = userService.getUserById(userId);
			userdl.setUserPwd("");
			return new RespJson(true, "操作成功！", ResultCode.SUCCESS, userdl);
		} catch (Exception e) {
			e.printStackTrace();
			return new RespJson(false, "操作失败！", ResultCode.ERROR, "");
		}
		
	}

	/**
	 * @Title: updateUser  
	 * @Description: 操作用户
	 * @author: hanpp
	 * @param response
	 * @param request
	 * @param session
	 * @param userId
	 * @param userName
	 * @param realName
	 * @param userPwd
	 * @param roleId
	 * @return RespJson
	 * @date 2018年9月30日 下午5:25:51  
	 * @throws
	 */
	@ResponseBody
	@RequestMapping(value = "/operate", method = RequestMethod.POST)
	public RespJson updateUser(HttpServletResponse response,
			HttpServletRequest request,HttpSession session,
			@RequestParam(value = "user_id", required = true) Integer userId,
			@RequestParam(value = "user_name", required = true) String userName,
			@RequestParam(value = "real_name", required = true) String realName,
			@RequestParam(value = "user_pwd", required = true) String userPwd,
			@RequestParam(value = "role_id", required = true) Integer roleId) {
		response.setHeader("Access-Control-Allow-Origin", "*");
		SysUser user = getUser(request, session);
		if(null == user){
			return new RespJson(false, "请您登陆后再进行该操作！", ResultCode.TOKEN_NOT_EXIST, null);
		}
		try {
			if(userId == null){
				HashMap<String, Object> map = new HashMap<String, Object>();
				map.put("userName", userName);
				SysUser u1 = userService.getUserInfo(map);
				if (u1 != null) {
					return new RespJson(false, "该用户名称已存在！", ResultCode.ERROR, "");
				} else {
					u1 = new SysUser();
					u1.setUserName(userName);
					u1.setStatus(Constant.CommonStatus.normal.getCode());
					u1.setRealName(realName);
					u1.setCreateTime(DateUtils.formateDate(new Date(), DateUtils.YMDHMS));
					u1.setRoleId(roleId);
					if (StringUtils.isNotBlank(userPwd)) {// 密码为空时不许改密码
						u1.setUserPwd(MD5Util.md5(userPwd));
					}
					userService.insertUser(u1);
				}
			} else {
				HashMap<String, Object> map = new HashMap<String, Object>();
				map.put("id", userId);
				SysUser u1 = userService.getUserInfo(map);
				if (u1 != null) {
					HashMap<String, Object> param = new HashMap<String, Object>();
					param.put("userName", userName);
					SysUser u2 = userService.getUserInfo(param);
					if (u2 != null && u2.getId() != u1.getId()) {
						return new RespJson(false, "该用户名称已存在！", ResultCode.ERROR, "");
					} else {
						u1.setUserName(userName);
						u1.setStatus(Constant.CommonStatus.normal.getCode());
						u1.setRealName(realName);
						u1.setRoleId(roleId);
						u1.setCreateTime(DateUtils.formateDate(new Date(), DateUtils.YMDHMS));
						if (StringUtils.isNotBlank(userPwd)) {// 密码为空时不许改密码
							u1.setUserPwd(MD5Util.md5(userPwd));
						}
						userService.updateUserById(u1);
					}
				}
			}
			return new RespJson(true, "操作成功！", ResultCode.SUCCESS, "");
		} catch (Exception e) {
			e.printStackTrace();
			return new RespJson(false, "操作失败！", ResultCode.ERROR, "");
		}
	}
	
	/**
	 * @Title: deleteUsers  
	 * @Description: 批量删除用户
	 * @author: hanpp
	 * @param request
	 * @param session
	 * @param response
	 * @param ids
	 * @return RespJson
	 * @date 2018年9月30日 下午5:52:33  
	 * @throws
	 */
	@ResponseBody
	@RequestMapping(value = "/delete", method = RequestMethod.POST)
	public RespJson deleteUsers(HttpServletRequest request, HttpSession session,
			HttpServletResponse response,
			@RequestParam(value = "ids", required = true) String ids) {
		response.setHeader("Access-Control-Allow-Origin", "*");
		SysUser user = getUser(request,session);
		if (null == user) {
			return new RespJson(false, "请您登陆后在进行该操作！", ResultCode.TOKEN_NOT_EXIST, null);
		}
		String [] deleteIds = ids.split(",");
		Integer [] list = (Integer[]) ConvertUtils.convert(deleteIds, Integer.class);
		//平台展示站点信息  0表示不选中 1表示选中展示该平台数据
		HashMap<String, Object> map = new HashMap<String,Object>();
		map.put("status", Constant.CommonStatus.delete.getCode());
		map.put("deleteIds", list);
		userService.updataUserStatus(map);
		return new RespJson(true,"删除成功", ResultCode.SUCCESS, null);
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

}
