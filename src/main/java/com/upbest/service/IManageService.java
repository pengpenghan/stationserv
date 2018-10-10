package com.upbest.service;

import java.util.HashMap;

import com.upbest.model.SysUser;

public interface IManageService {
	
	/**
     * @Title queryUserByLoginName  
     * @Description 获取用户信息
     * @author 韩鹏鹏
     * @param map
     * @return SysUser
     * @date 2018年7月23日 上午11:11:01  
     * @throws
     */
    SysUser queryUserByLoginName(HashMap<String, Object> map);
    
    /**
     * @Title updateByPrimaryKeySelective  
     * @Description 修改用户信息
     * @author 韩鹏鹏
     * @param record
     * @return int
     * @date 2018年7月23日 上午11:34:08  
     * @throws
     */
    int updateSysUser(SysUser record);

}
