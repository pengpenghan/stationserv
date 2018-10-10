package com.upbest.service;

import java.util.HashMap;
import java.util.List;

import com.upbest.model.CommonInfo;
import com.upbest.model.PointData;

public interface IDeviceMetrics {
	
	/**
     * @Title getCommonInfo  
     * @Description 获取数据
     * @author hanpp
     * @param map
     * @return CommonInfo
     * @date 2018年9月13日 上午11:09:27  
     * @throws
     */
    CommonInfo getCommonInfo(HashMap<String, Object> map);

    /**
     * @Title getPointDataList  
     * @Description 获取逐小时数据列表
     * @author hanpp
     * @param map
     * @return List<PointData>
     * @date 2018年9月13日 上午11:50:18  
     * @throws
     */
    List<PointData> getPointDataList(HashMap<String, Object> map);
    
    /**
     * @Title getRealTimeData  
     * @Description 获取实时数据
     * @author hanpp
     * @param map
     * @return PointData
     * @date 2018年9月13日 下午5:00:04  
     * @throws
     */
    PointData getRealTimeData(HashMap<String, Object> map);
}
