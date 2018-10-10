package com.upbest.persistence;

import java.util.HashMap;
import java.util.List;

import com.upbest.model.SysUser;

public interface SysUserMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(SysUser record);

    int insertSelective(SysUser record);

    SysUser selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(SysUser record);

    int updateByPrimaryKey(SysUser record);
    
    /**
     * @Title: listUserByCondition  
     * @Description: 获取用户分页列表
     * @author: hanpp
     * @param map
     * @return List<SysUser>
     * @date 2018年9月30日 下午5:14:57  
     * @throws
     */
    List<SysUser> listUserByCondition(HashMap<String, Object> map);
    
    /**
     * @Title: getUserInfo  
     * @Description: 获取用户详情
     * @author: hanpp
     * @param map
     * @return SysUser
     * @date 2018年9月30日 下午5:14:40  
     * @throws
     */
    SysUser getUserInfo(HashMap<String,Object> map);
    
    /**
     * @Title: updataUserStatus  
     * @Description: 更新用户状态
     * @author: hanpp
     * @param map
     * @return int
     * @date 2018年9月30日 下午5:50:50  
     * @throws
     */
    int updataUserStatus(HashMap<String,Object> map);
}