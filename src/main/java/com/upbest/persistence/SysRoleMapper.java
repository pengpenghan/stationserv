package com.upbest.persistence;

import java.util.List;
import java.util.HashMap;

import com.upbest.model.SysRole;

public interface SysRoleMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(SysRole record);

    int insertSelective(SysRole record);

    SysRole selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(SysRole record);

    int updateByPrimaryKey(SysRole record);
    
    /**
     * @Title: getRoleList  
     * @Description:
     * @author: hanpp
     * @return List<SysRole>
     * @date 2018年9月30日 上午10:01:19  
     * @throws
     */
    List<SysRole> getRoleList(HashMap<String, Object> map);
    
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
     * @Title: updataRoleStatus  
     * @Description: 批量修改角色状态
     * @author: hanpp
     * @param map void
     * @date 2018年9月30日 上午11:38:11  
     * @throws
     */
    int updataRoleStatus(HashMap<String, Object> map);
}