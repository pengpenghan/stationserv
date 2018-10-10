package com.upbest.persistence;

import com.upbest.model.DataType;

public interface DataTypeMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(DataType record);

    int insertSelective(DataType record);

    DataType selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(DataType record);

    int updateByPrimaryKey(DataType record);
}