package com.upbest.service.impl;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.upbest.model.SysRole;
import com.upbest.model.SysUser;
import com.upbest.persistence.SysRoleMapper;
import com.upbest.persistence.SysUserMapper;
import com.upbest.service.ISysUserService;

@Service
public class SysUserServiceImpl implements ISysUserService {

    @Autowired
    SysUserMapper sysUserMapper;

    @Autowired
    SysRoleMapper sysRoleMapper;

    @Override
    public PageInfo<SysUser> listPageUserByCondition(HashMap<String, Object> search, int page, int rows) {
        PageHelper.startPage(page, rows);
        List<SysUser> list = sysUserMapper.listUserByCondition(search);
        PageInfo<SysUser> pageList = new PageInfo<SysUser>(list);
        return pageList;
    }

    @Override
    public List<SysUser> listUserByCondition(HashMap<String, Object> map) {
        return sysUserMapper.listUserByCondition(map);
    }

    @Override
    public SysUser getUserInfo(HashMap<String, Object> map) {
        return sysUserMapper.getUserInfo(map);
    }

	@Override
	public int deleteUserById(int id) {
		return sysUserMapper.deleteByPrimaryKey(id);
	}

	@Override
	public int insertUser(SysUser record) {
		return sysUserMapper.insertSelective(record);
	}

	@Override
	public SysUser getUserById(int id) {
		return sysUserMapper.selectByPrimaryKey(id);
	}

	@Override
	public int updateUserById(SysUser record) {
		return sysUserMapper.updateByPrimaryKeySelective(record);
	}

	@Override
	public int updataUserStatus(HashMap<String, Object> map) {
		return sysUserMapper.updataUserStatus(map);
	}
}
