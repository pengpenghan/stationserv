package com.upbest.persistence;

import java.util.HashMap;
import java.util.List;

import com.upbest.model.Station;

public interface StationMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(Station record);

    int insertSelective(Station record);

    Station selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(Station record);

    int updateByPrimaryKey(Station record);
    
    /**
     * @Title: getStationInfo  
     * @Description:获取站点信息
     * @author:hanpp
     * @param map
     * @return Station
     * @date 2018年9月28日 下午2:47:52  
     * @throws
     */
    Station getStationInfo(HashMap<String,Object> map);
    
    /**
     * @Title: getStationList  
     * @Description:
     * @author:hanpp
     * @param map
     * @return List<Station>
     * @date 2018年9月28日 上午10:26:23  
     * @throws
     */
    List<Station> getStationList(HashMap<String,Object> map);
    
    /**
     * @Title: updataStationStatus  
     * @Description: 更新站点状态
     * @author: hanpp
     * @param map
     * @return int
     * @date 2018年9月29日 下午4:22:36  
     * @throws
     */
    int updataStationStatus(HashMap<String,Object> map);
}