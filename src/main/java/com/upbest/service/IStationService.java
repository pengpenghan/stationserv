package com.upbest.service;

import java.util.HashMap;
import java.util.List;

import com.github.pagehelper.PageInfo;
import com.upbest.model.Station;

public interface IStationService {
	
	/**
	 * @Title: getStationList  
	 * @Description: 获取站点列表
	 * @author:hanpp
	 * @param map
	 * @return List<Station>
	 * @date 2018年9月28日 下午2:37:42  
	 * @throws
	 */
	List<Station> getStationList(HashMap<String,Object> map);

	/**
	 * @Title: listPageUserByCondition  
	 * @Description: 站点列表分页
	 * @author:hanpp
	 * @param search
	 * @param page
	 * @param rows
	 * @return PageInfo<Station>
	 * @date 2018年9月28日 下午2:39:42  
	 * @throws
	 */
	PageInfo<Station> listPageStationByCondition(HashMap<String, Object> search, int page, int rows);
	
	/**
     * @Title: getStationInfo  
     * @Description:获取站点信息
     * @author:hanpp
     * @param map
     * @return List<Station>
     * @date 2018年9月28日 下午2:47:52  
     * @throws
     */
    Station getStationInfo(HashMap<String,Object> map);
    
    /**
     * @Title: updateStationById  
     * @Description: 修改站点信息
     * @author:hanpp
     * @param record
     * @return int
     * @date 2018年9月28日 下午2:49:07  
     * @throws
     */
    int updateStationById(Station record);
    
    /**
     * @Title: insertStation  
     * @Description: 插入站点信息
     * @author:hanpp
     * @param record
     * @return int
     * @date 2018年9月28日 下午2:49:56  
     * @throws
     */
    int insertStation(Station record);
    
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
