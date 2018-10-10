package com.upbest.service;

import java.util.HashMap;
import java.util.List;

import com.github.pagehelper.PageInfo;
import com.upbest.model.SysUser;

public interface ISysUserService {
    int deleteUserById(int id);

    int insertUser(SysUser record);

    SysUser getUserById(int id);

    int updateUserById(SysUser record);

    List<SysUser> listUserByCondition(HashMap<String, Object> map);

    /**
     * @Title: listPageUserByCondition  
     * @Description: 获取分页数据
     * @author: hanpp
     * @param search
     * @param page
     * @param rows
     * @return PageInfo<SysUser>
     * @date 2018年9月30日 下午5:16:21  
     * @throws
     */
    PageInfo<SysUser> listPageUserByCondition(HashMap<String, Object> search, int page, int rows);

    /**
     * @Title: getUserInfo  
     * @Description: 获取用户详情
     * @author: hanpp
     * @param map
     * @return SysUser
     * @date 2018年9月30日 下午5:15:42  
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
