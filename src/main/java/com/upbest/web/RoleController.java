package com.upbest.web;

import java.util.List;
import java.util.Date;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.beanutils.ConvertUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.pagehelper.PageInfo;
import com.upbest.model.SysRole;
import com.upbest.model.SysUser;
import com.upbest.service.IManageService;
import com.upbest.service.ISysRoleService;
import com.upbest.utils.Constant;
import com.upbest.utils.DataTableModel;
import com.upbest.utils.RespJson;
import com.upbest.utils.ResultCode;

@Controller
@RequestMapping(value = "/role")
public class RoleController {
	
	@Autowired
	ISysRoleService roleService;
	
	@Autowired
	IManageService manageService;
	
	/**
	 * @Title: listRole  
	 * @Description: 获取角色分页列表
	 * @author: hanpp
	 * @param session
	 * @param response
	 * @param draw
	 * @param start
	 * @param length
	 * @param roleName
	 * @return DataTableModel<?>
	 * @date 2018年9月30日 上午10:30:21  
	 * @throws
	 */
	@ResponseBody
	@RequestMapping(value = "/page/list")
	public DataTableModel<?> listRole(HttpSession session,
			HttpServletResponse response, int draw, int start, int length,
			@RequestParam(value = "role_name",required = false) String roleName) {
		DataTableModel<SysRole> result = new DataTableModel<SysRole>();
		result.setDraw(draw);
		HashMap<String, Object> search = new HashMap<String, Object>();
		if (StringUtils.isNotBlank(roleName)) {
			search.put("roleName", roleName);
		}
		search.put("status", Constant.CommonStatus.normal.getCode());
		try {
			PageInfo<SysRole> pageValue = roleService
					.listPageRoleByCondition(search, start / length + 1, length);
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
	 * @Title: roleList  
	 * @Description: 获取角色列表
	 * @author: hanpp
	 * @param response
	 * @param request
	 * @param session
	 * @return RespJson
	 * @date 2018年9月30日 下午2:06:03  
	 * @throws
	 */
	@ResponseBody
	@RequestMapping(value = "/list",method = RequestMethod.POST)
	public RespJson roleList(HttpServletResponse response,
			HttpServletRequest request,HttpSession session){
		SysUser user = getUser(request, session);
		if(null == user){
			return new RespJson(false, "请您登陆后再进行该操作！", ResultCode.TOKEN_NOT_EXIST, null);
		}
		try {
			HashMap<String, Object> map = new HashMap<String, Object>();
			map.put("status", Constant.CommonStatus.normal.getCode());
			List<SysRole> list = roleService.getRoleList(map);
			return new RespJson(true, "操作成功！", ResultCode.SUCCESS, list);
		} catch (Exception e) {
			e.printStackTrace();
			return new RespJson(false, "操作失败！", ResultCode.ERROR, "");
		}
		
	}
	
	/**
	 * @Title: operateStation  
	 * @Description: 操作角色对象
	 * @author: hanpp
	 * @param response
	 * @param request
	 * @param session
	 * @param roleId
	 * @param roleName
	 * @param roleDesc
	 * @return RespJson
	 * @date 2018年9月30日 上午10:49:56  
	 * @throws
	 */
	@ResponseBody
	@RequestMapping(value = "/operate",method = RequestMethod.POST)
	public RespJson operateRole(HttpServletResponse response,
			HttpServletRequest request,HttpSession session,
			@RequestParam(value = "role_id",required = false)Integer roleId,
			@RequestParam(value = "role_name",required = true)String roleName,
			@RequestParam(value = "role_desc",required = false)String roleDesc){
		SysUser user = getUser(request, session);
		if(null == user){
			return new RespJson(false, "请您登陆后再进行该操作！", ResultCode.TOKEN_NOT_EXIST, null);
		}
		if (null == roleId) {
			HashMap<String, Object> map = new HashMap<String, Object>();
			map.put("roleName", roleName);
			SysRole role = roleService.getRoleInfo(map);
			if (role != null) {
				return new RespJson(false, "该角色名称已存在！", ResultCode.ERROR, "");
			} else {
				SysRole role_add = new SysRole();
				role_add.setRoleName(roleName);
				if (StringUtils.isNotBlank(roleDesc)) {
					role_add.setRoleDesc(roleDesc);
				}
				role_add.setStatus(Constant.CommonStatus.normal.getCode());
				role_add.setCreateTime(new Date());
				roleService.insertRole(role_add);
			}
		} else {
			HashMap<String, Object> map = new HashMap<String, Object>();
			map.put("id", roleId);
			SysRole role = roleService.getRoleInfo(map);
			if (role != null) {
				if(!roleName.equals(role.getRoleName())){
					HashMap<String, Object> param = new HashMap<String, Object>();
					param.put("roleName", roleName);
					SysRole role_dl = roleService.getRoleInfo(param);
					if (role_dl != null && role_dl.getId() != role.getId()) {
						return new RespJson(false, "该角色名称已存在！", ResultCode.ERROR, "");
					}
				}else {
					role.setRoleName(roleName);
					if (StringUtils.isNotBlank(roleDesc)) {
						role.setRoleDesc(roleDesc);
					}
					role.setStatus(Constant.CommonStatus.normal.getCode());
					roleService.updateRoleById(role);
				}
			}
		}
		return new RespJson(true, "操作成功！", ResultCode.SUCCESS, "");
	}
	
	/**
	 * @Title: roleDetail  
	 * @Description: 获取角色信息
	 * @author: hanpp
	 * @param response
	 * @param request
	 * @param session
	 * @param roleId
	 * @return RespJson
	 * @date 2018年9月30日 上午11:35:39  
	 * @throws
	 */
	@ResponseBody
	@RequestMapping(value = "/detail",method = RequestMethod.POST)
	public RespJson roleDetail(HttpServletResponse response,
			HttpServletRequest request,HttpSession session,
			@RequestParam(value = "role_id",required = true)Integer roleId){
		SysUser user = getUser(request, session);
		if(null == user){
			return new RespJson(false, "请您登陆后再进行该操作！", ResultCode.TOKEN_NOT_EXIST, null);
		}
		if(null == roleId){
			return new RespJson(false, "数据为空！", ResultCode.ERROR, "");
		}
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("id", roleId);
		SysRole role = roleService.getRoleInfo(map);
		return new RespJson(true, "操作成功！", ResultCode.SUCCESS, role);
	}
	
	@ResponseBody
	@RequestMapping(value = "/delete", method = RequestMethod.POST)
	public RespJson deleteRoles(HttpServletRequest request, HttpSession session,
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
		roleService.updataRoleStatus(map);
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
