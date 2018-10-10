package com.upbest.service.impl;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.upbest.model.Station;
import com.upbest.persistence.StationMapper;
import com.upbest.service.IStationService;

@Service
public class StationServiceImpl implements IStationService {
	
	@Autowired
	StationMapper StationMapper;

	@Override
	public List<Station> getStationList(HashMap<String, Object> map) {
		return StationMapper.getStationList(map);
	}

	@Override
	public PageInfo<Station> listPageStationByCondition(
			HashMap<String, Object> search, int page, int rows) {
		PageHelper.startPage(page, rows);
		List<Station> list = StationMapper.getStationList(search);
		PageInfo<Station> pageList = new PageInfo<Station>(list);
		return pageList;
	}

	@Override
	public Station getStationInfo(HashMap<String, Object> map) {
		return StationMapper.getStationInfo(map);
	}

	@Override
	public int updateStationById(Station record) {
		return StationMapper.updateByPrimaryKeySelective(record);
	}

	@Override
	public int insertStation(Station record) {
		return StationMapper.insertSelective(record);
	}

	@Override
	public int updataStationStatus(HashMap<String, Object> map) {
		return StationMapper.updataStationStatus(map);
	}

}
