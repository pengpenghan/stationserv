package com.upbest.service.impl;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.upbest.model.CommonInfo;
import com.upbest.model.PointData;
import com.upbest.persistence.CommonInfoMapper;
import com.upbest.persistence.PointDataMapper;
import com.upbest.service.IDeviceMetrics;

@Service
public class DeviceMetricsImpl implements IDeviceMetrics {
	
	@Autowired
	CommonInfoMapper commonInfoMapper;
	
	@Autowired
	PointDataMapper pointDataMapper;

	@Override
	public CommonInfo getCommonInfo(HashMap<String, Object> map) {
		return commonInfoMapper.selectCommonInfo(map);
	}

	@Override
	public List<PointData> getPointDataList(HashMap<String, Object> map) {
		return pointDataMapper.selectPointDataList(map);
	}

	@Override
	public PointData getRealTimeData(HashMap<String, Object> map) {
		return pointDataMapper.selectRealTimeData(map);
	}

}
