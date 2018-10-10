package com.upbest.service.impl;

import java.util.List;
import java.util.HashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.upbest.model.SysRole;
import com.upbest.persistence.SysRoleMapper;
import com.upbest.service.ISysRoleService;

@Service
public class SysRoleServiceImpl implements ISysRoleService {
	
	@Autowired
	SysRoleMapper sysRoleMapper;

	@Override
	public PageInfo<SysRole> listPageRoleByCondition(
			HashMap<String, Object> search, int page, int rows) {
		PageHelper.startPage(page, rows);
		List<SysRole> list = sysRoleMapper.getRoleList(search);
		PageInfo<SysRole> pageInfo = new PageInfo<SysRole>(list);
		return pageInfo;
	}

	@Override
	public List<SysRole> getRoleList(HashMap<String, Object> search) {
		return sysRoleMapper.getRoleList(search);
	}

	@Override
	public int insertRole(SysRole record) {
		return sysRoleMapper.insertSelective(record);
	}

	@Override
	public int updateRoleById(SysRole record) {
		return sysRoleMapper.updateByPrimaryKeySelective(record);
	}

	@Override
	public SysRole getRoleInfo(HashMap<String, Object> map) {
		return sysRoleMapper.getRoleInfo(map);
	}

	@Override
	public int updataRoleStatus(HashMap<String, Object> map) {
		return sysRoleMapper.updataRoleStatus(map);
	}

}
