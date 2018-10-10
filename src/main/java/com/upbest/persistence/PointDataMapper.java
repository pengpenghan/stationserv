package com.upbest.persistence;

import java.util.HashMap;
import java.util.List;

import com.upbest.model.PointData;

public interface PointDataMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(PointData record);

    int insertSelective(PointData record);

    PointData selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(PointData record);

    int updateByPrimaryKey(PointData record);
    
    /**
     * @Title selectPointDataList  
     * @Description 获取逐小时数据列表
     * @author hanpp
     * @param map
     * @return List<PointData>
     * @date 2018年9月13日 上午11:50:18  
     * @throws
     */
    List<PointData> selectPointDataList(HashMap<String, Object> map);
    
    /**
     * @Title selectRealTimeData  
     * @Description 获取实时数据
     * @author hanpp
     * @param map
     * @return PointData
     * @date 2018年9月13日 下午5:00:04  
     * @throws
     */
    PointData selectRealTimeData(HashMap<String, Object> map);
}