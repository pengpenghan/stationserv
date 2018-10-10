package com.upbest.web;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.upbest.model.CommonInfo;
import com.upbest.model.PointData;
import com.upbest.model.Station;
import com.upbest.service.IDeviceMetrics;
import com.upbest.service.IStationService;
import com.upbest.utils.DateUtils;
import com.upbest.utils.RespJson;
import com.upbest.utils.ResultCode;

@Controller
@RequestMapping(value = "/device")
public class DeviceMetricsController {

	@Autowired
	IDeviceMetrics deviceMetrics;
	
	@Autowired
	IStationService stationService;
	
	/**
	 * @Title getCommonInfo  
	 * @Description 获取常用信息数据
	 * @author hanpp
	 * @param request
	 * @param id
	 * @return RespJson
	 * @date 2018年9月13日 上午11:17:41  
	 * @throws
	 */
	@ResponseBody
	@RequestMapping(value = "/common",method = RequestMethod.POST)
	public RespJson getCommonInfo(HttpServletResponse response,HttpServletRequest request,
			HttpSession session,
			@RequestParam(value = "stationId",required = true) Integer stationId){
		response.setHeader("Access-Control-Allow-Origin", "*");
		HashMap<String, Object> result = new HashMap<String, Object>();
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("stationId", stationId);
		CommonInfo commonInfo = deviceMetrics.getCommonInfo(map);
		map.put("id", stationId);
		Station station = stationService.getStationInfo(map);
		result.put("commonInfo", commonInfo);
		result.put("station", station);
		return new RespJson(true, "操作成功！", ResultCode.SUCCESS, result);
	}
	
	/**
	 * @Title hourTrendList  
	 * @Description 获取各类型逐小时数据
	 * @author hanpp
	 * @param type 1出力曲线图 2发电量曲线图3风光储净发电量曲线图
	 * @param stationId 1、电站id
	 * @param deviceId 1、储能 2、光伏 3、风电 4、风光储
	 * @param dataTypeId 1、有功功率 2、总充电量 3、总放电量 4、总发电量 5、总出力 6、风光储净发电量
	 * @return RespJson
	 * @date 2018年9月13日 上午11:52:12  
	 * @throws
	 */
	@ResponseBody
	@RequestMapping(value = "/hour/trend",method = RequestMethod.POST)
	public RespJson hourTrendList(HttpServletResponse response,
			@RequestParam(value = "stationId",required = true) Integer stationId,
			@RequestParam(value = "deviceIds",required = true) String deviceIds,
			@RequestParam(value = "dataTypeId",required = true) Integer dataTypeId){
		response.setHeader("Access-Control-Allow-Origin", "*");
		String[] deviceId = deviceIds.split(",");
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("stationId", stationId);
		map.put("dataTypeId", dataTypeId);
		map.put("dateTime", DateUtils.formateDate(new Date(), DateUtils.HHMMSS));
		List<HashMap<String, Object>> listTree = new ArrayList<HashMap<String, Object>>();
		for(int i = 0;i < deviceId.length;i ++){
			HashMap<String, Object> result = new HashMap<String, Object>();
			map.put("deviceId", deviceId[i]);
			List<PointData> list = deviceMetrics.getPointDataList(map);
			List<String> xAxis = new ArrayList<String>();
			List<Double> value = new ArrayList<Double>();
			String name = "";
			int sum = 0;
			for(PointData pd : list){
				value.add(pd.getDataValue() == null ? 0 : Double.parseDouble(pd.getDataValue()));
				xAxis.add(DateUtils.formateDate(pd.getDateTime(), DateUtils.HHMMSS));
				//xAxis.add(DateUtils.formateDate(DateUtils.getFiveData(sum), DateUtils.HHMMSS));
				sum ++;
				name = pd.getDevice().getDeviceName()+pd.getDataType().getName();
			}
			Collections.reverse(xAxis);
			result.put("name", name);
			result.put("value", value);
			result.put("xAxis", xAxis);
			result.put("lastTime", DateUtils.formateDate(list.get(0).getDateTime(), DateUtils.HHMMSS));
			listTree.add(result);
		}
		return new RespJson(true, "获取成功！", ResultCode.SUCCESS, listTree);
	}
	
	/**
	 * @Title realTime  
	 * @Description 获取节点实时数据
	 * @author hanpp
	 * @param stationId
	 * @param deviceIds
	 * @param dataTypeId
	 * @return RespJson
	 * @date 2018年9月13日 下午4:58:03  
	 * @throws
	 */
	@ResponseBody
	@RequestMapping(value = "/real/time",method = RequestMethod.POST)
	public RespJson realTime(HttpServletResponse response,
			@RequestParam(value = "stationId",required = true) Integer stationId,
			@RequestParam(value = "deviceIds",required = true) String deviceIds,
			@RequestParam(value = "dataTypeId",required = true) Integer dataTypeId,
			@RequestParam(value = "dateTime",required = false) String dateTime){
		response.setHeader("Access-Control-Allow-Origin", "*");
		HashMap<String, Object> map = new HashMap<String, Object>();
		String[] deviceId = deviceIds.split(",");
		map.put("stationId", stationId);
		map.put("dataTypeId", dataTypeId);
		map.put("dateTime", dateTime);
		List<HashMap<String, Object>> listTree = new ArrayList<HashMap<String, Object>>();
		for(int i = 0;i < deviceId.length;i ++){
			HashMap<String, Object> param = new HashMap<String, Object>();
			map.put("deviceId", deviceId[i]);
			PointData pd = deviceMetrics.getRealTimeData(map);
			String name = "";
			Double value = 0d;
			String xAxis = "";
			String lastTime = "";
			if (pd != null) {
				name = pd.getDevice().getDeviceName()+pd.getDataType().getName();
				value = pd.getDataValue() == null ? 0 : Double.parseDouble(pd.getDataValue());
				xAxis = DateUtils.formateDate(pd.getDateTime(), DateUtils.HHMMSS);
				lastTime = DateUtils.formateDate(pd.getDateTime(), DateUtils.HHMMSS);
			}
			param.put("lastTime", lastTime);
			param.put("name", name);
			param.put("value", value);
			param.put("xAxis", xAxis);
			listTree.add(param);
		}
		return new RespJson(true, "获取成功！", ResultCode.SUCCESS, listTree);
	}
	
}
