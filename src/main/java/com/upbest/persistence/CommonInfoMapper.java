package com.upbest.persistence;

import java.util.HashMap;

import com.upbest.model.CommonInfo;

public interface CommonInfoMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(CommonInfo record);

    int insertSelective(CommonInfo record);

    CommonInfo selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(CommonInfo record);

    int updateByPrimaryKey(CommonInfo record);
    
    /**
     * @Title selectCommonInfo  
     * @Description 获取常用数据信息
     * @author hanpp
     * @param map
     * @return CommonInfo
     * @date 2018年9月13日 上午11:30:27  
     * @throws
     */
    CommonInfo selectCommonInfo(HashMap<String, Object> map);
}