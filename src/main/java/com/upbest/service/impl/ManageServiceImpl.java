package com.upbest.service.impl;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.upbest.model.SysRole;
import com.upbest.model.SysUser;
import com.upbest.persistence.SysRoleMapper;
import com.upbest.persistence.SysUserMapper;
import com.upbest.service.IManageService;

@Service
public class ManageServiceImpl implements IManageService{
	
	@Autowired
	SysUserMapper userMapper;
	
	@Autowired
	SysRoleMapper roleMapper;

	@Override
	public SysUser queryUserByLoginName(HashMap<String, Object> map) {
		return userMapper.getUserInfo(map);
	}

	@Override
	public int updateSysUser(SysUser record) {
		return userMapper.updateByPrimaryKeySelective(record);
	}

}
