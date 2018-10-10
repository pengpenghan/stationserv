package com.upbest.service;

import java.util.List;
import java.util.HashMap;

import com.github.pagehelper.PageInfo;
import com.upbest.model.SysRole;

public interface ISysRoleService {
	
	/**
	 * @Title: listPageRoleByCondition  
	 * @Description: 获取用户列表
	 * @author: hanpp
	 * @param search
	 * @param page
	 * @param rows
	 * @return PageInfo<SysRole>
	 * @date 2018年9月30日 上午10:07:18  
	 * @throws
	 */
	PageInfo<SysRole> listPageRoleByCondition(HashMap<String, Object> search, int page, int rows);
	
	/**
	 * @Title: getRoleList  
	 * @Description: 获取用户列表
	 * @author: hanpp
	 * @param search
	 * @return List<SysRole>
	 * @date 2018年9月30日 上午10:12:37  
	 * @throws
	 */
	List<SysRole> getRoleList(HashMap<String, Object> search);
	
	/**
	 * @Title: insertRole  
	 * @Description: 添加角色
	 * @author: hanpp
	 * @param record
	 * @return int
	 * @date 2018年9月30日 上午10:15:07  
	 * @throws
	 */
	int insertRole(SysRole record);

	/**
     * @Title: getRoleInfo  
     * @Description: 获取角色对象
     * @author: hanpp
     * @param map
     * @return SysRole
     * @date 2018年9月30日 上午10:44:51  
     * @throws
     */
    SysRole getRoleInfo(HashMap<String, Object> map);

    /**
     * @Title: updateRoleById  
     * @Description: 更新数据
     * @author: hanpp
     * @param record
     * @return int
     * @date 2018年9月30日 上午10:15:44  
     * @throws
     */
    int updateRoleById(SysRole record);
	
    /**
     * @Title: updataRoleStatus  
     * @Description: 批量修改角色状态
     * @author: hanpp
     * @param map void
     * @date 2018年9月30日 上午11:38:11  
     * @throws
     */
    int updataRoleStatus(HashMap<String, Object> map);
}
