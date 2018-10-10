package com.upbest.web;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.beanutils.ConvertUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.pagehelper.PageInfo;
import com.upbest.model.Station;
import com.upbest.model.SysUser;
import com.upbest.service.IManageService;
import com.upbest.service.IStationService;
import com.upbest.utils.Constant;
import com.upbest.utils.DataTableModel;
import com.upbest.utils.RespJson;
import com.upbest.utils.ResultCode;

@Controller
@RequestMapping(value = "/station")
public class StationController {
	
	@Autowired
	IManageService manageService;

	@Autowired
	IStationService stationService;
	
	/**
	 * @Title: getStationPageList  
	 * @Description: 获取站点分页列表数据
	 * @author:hanpp
	 * @param request
	 * @param stationName
	 * @param draw
	 * @param start
	 * @param length
	 * @return DataTableModel<?>
	 * @date 2018年9月28日 下午3:03:23  
	 * @throws
	 */
	@ResponseBody
	@RequestMapping(value = "/page/list",method = RequestMethod.POST)
	public DataTableModel<?> getStationPageList(HttpServletRequest request,
			HttpServletResponse response,
			@RequestParam(value = "stationName",required = false) String stationName,
			int draw,int start,int length){
		response.setHeader("Access-Control-Allow-Origin", "*");
		DataTableModel<Station> result = new DataTableModel<Station>();
		result.setDraw(draw);
		HashMap<String, Object> search = new HashMap<String, Object>();
		if (StringUtils.isNotBlank(stationName)) {
			search.put("mainName", stationName);
		}
		try {
			PageInfo<Station> pageValue = stationService
					.listPageStationByCondition(search, start / length + 1, length);
			if (pageValue != null && pageValue.getEndRow() > 0) {
				result.setData(pageValue.getList());
				result.setRecordsFiltered(new Long(pageValue.getTotal())
						.intValue());
				result.setRecordsTotal(new Long(pageValue.getTotal())
						.intValue());
			}
		} catch (Exception ex) {
			ex.getStackTrace();
		}
		return result;
	}
	
	/**
	 * @Title: getStationList  
	 * @Description:获取站点列表（地图）
	 * @author:hanpp
	 * @param response
	 * @return RespJson
	 * @date 2018年9月28日 下午6:06:21  
	 * @throws
	 */
	@ResponseBody
	@RequestMapping(value = "/list",method = RequestMethod.POST)
	public RespJson getStationList(HttpServletResponse response,
			HttpServletRequest request,HttpSession session){
		response.setHeader("Access-Control-Allow-Origin", "*");
		HashMap<String, Object> search = new HashMap<String, Object>();
		List<Station> list = stationService.getStationList(search);
		return new RespJson(true, "操作成功！", ResultCode.SUCCESS, list);
	}
	
	/**
	 * @Title: operateStation  
	 * @Description:
	 * @author: hanpp
	 * @param response
	 * @return RespJson
	 * @date 2018年9月29日 下午1:59:14  
	 * @throws
	 */
	@ResponseBody
	@RequestMapping(value = "/operate",method = RequestMethod.POST)
	public RespJson operateStation(HttpServletResponse response,
			HttpServletRequest request,HttpSession session,
			@RequestParam(value = "station_id",required = false)Integer stationId,
			@RequestParam(value = "main_name",required = true)String mainName,
			@RequestParam(value = "photo",required = true)String photo,
			@RequestParam(value = "prepare_name",required = false)String prepareName,
			@RequestParam(value = "longitude",required = true)String longitude,
			@RequestParam(value = "latitude",required = true)String latitude,
			@RequestParam(value = "address",required = false)String address,
			@RequestParam(value = "remarks",required = false)String remarks,
			@RequestParam(value = "status",required = false)Integer status){
		response.setHeader("Access-Control-Allow-Origin", "*");
		SysUser user = getUser(request, session);
		if(null == user){
			return new RespJson(false, "请您登陆后再进行该操作！", ResultCode.TOKEN_NOT_EXIST, null);
		}
		//平台展示站点信息  0表示不选中 1表示选中展示该平台数据
		if (status != 0) {
			HashMap<String, Object> map = new HashMap<String,Object>();
			map.put("status", Constant.StationStatus.normal.getCode());
			stationService.updataStationStatus(map);
		}
		if (null == stationId) {
			Station station = new Station();
			station.setMainName(mainName);
			if (StringUtils.isNotBlank(prepareName)) {
				station.setPrepareName(prepareName);
			}
			station.setLongitude(new BigDecimal(longitude));
			station.setLatitude(new BigDecimal(latitude));
			if (StringUtils.isNotBlank(address)) {
				station.setAddress(address);
			}
			if (StringUtils.isNotBlank(remarks)) {
				station.setRemarks(remarks);
			}
			station.setLogoUrl(photo);
			station.setStatus(status);
			stationService.insertStation(station);
		} else {
			HashMap<String, Object> map = new HashMap<String, Object>();
			map.put("id", stationId);
			Station station = stationService.getStationInfo(map);
			if (session != null) {
				station.setMainName(mainName);
				if (StringUtils.isNotBlank(prepareName)) {
					station.setPrepareName(prepareName);
				}
				station.setLongitude(new BigDecimal(longitude));
				station.setLatitude(new BigDecimal(latitude));
				if (StringUtils.isNotBlank(address)) {
					station.setAddress(address);
				}
				if (StringUtils.isNotBlank(remarks)) {
					station.setRemarks(remarks);
				}
				station.setLogoUrl(photo);
				station.setStatus(status);
				stationService.updateStationById(station);
			}
		}
		return new RespJson(true, "操作成功！", ResultCode.SUCCESS, "");
	}
	
	/**
	 * @Title: getStationDetail  
	 * @Description: 获取站点详情
	 * @author: hanpp
	 * @param response
	 * @param request
	 * @param session
	 * @param stationId
	 * @return RespJson
	 * @date 2018年9月29日 下午2:47:54  
	 * @throws
	 */
	@ResponseBody
	@RequestMapping(value = "/detail",method = RequestMethod.POST)
	public RespJson getStationDetail(HttpServletResponse response,
			HttpServletRequest request,HttpSession session,
			@RequestParam(value = "station_id",required = true)Integer stationId){
		response.setHeader("Access-Control-Allow-Origin", "*");
		SysUser user = getUser(request, session);
		if(null == user){
			return new RespJson(false, "请您登陆后再进行该操作！", ResultCode.TOKEN_NOT_EXIST, null);
		}
		if(null == stationId){
			return new RespJson(false, "数据为空！", ResultCode.ERROR, "");
		}
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("id", stationId);
		Station station = stationService.getStationInfo(map);
		return new RespJson(true, "操作成功！", ResultCode.SUCCESS, station);
	}
	
	/**
	 * @Title: deleteRoles  
	 * @Description: 删除站点信息
	 * @author: hanpp
	 * @param request
	 * @param session
	 * @param ids
	 * @return RespJson
	 * @date 2018年9月29日 下午4:41:14  
	 * @throws
	 */
	@ResponseBody
	@RequestMapping(value = "/delete", method = RequestMethod.POST)
	public RespJson deleteRoles(HttpServletRequest request, HttpSession session,
			HttpServletResponse response,
			@RequestParam(value = "ids", required = true) String ids) {
		response.setHeader("Access-Control-Allow-Origin", "*");
		SysUser user = getUser(request,session);
		if (null == user) {
			return new RespJson(false, "请您登陆后在进行该操作！", ResultCode.TOKEN_NOT_EXIST, null);
		}
		String [] deleteIds = ids.split(",");
		Integer [] list = (Integer[]) ConvertUtils.convert(deleteIds, Integer.class);
		//平台展示站点信息  0表示不选中 1表示选中展示该平台数据
		HashMap<String, Object> map = new HashMap<String,Object>();
		map.put("status", Constant.StationStatus.delete.getCode());
		map.put("deleteIds", list);
		stationService.updataStationStatus(map);
		return new RespJson(true,"删除成功", ResultCode.SUCCESS, null);
	}
	
	/**
	 * @Title: getStationShow  
	 * @Description: 获取展示的站点信息
	 * @author: hanpp
	 * @param response
	 * @param request
	 * @param session
	 * @return RespJson
	 * @date 2018年9月29日 下午5:28:35  
	 * @throws
	 */
	@ResponseBody
	@RequestMapping(value = "/show",method = RequestMethod.POST)
	public RespJson getStationShow(HttpServletResponse response,
			HttpServletRequest request,HttpSession session){
		response.setHeader("Access-Control-Allow-Origin", "*");
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("status", Constant.StationStatus.show.getCode());
		Station station = stationService.getStationInfo(map);
		return new RespJson(true, "操作成功！", ResultCode.SUCCESS, station);
	}
	
	public SysUser getUser(HttpServletRequest request,HttpSession session) {
		String token = request.getHeader("token");
		Integer userId = (Integer)session.getAttribute(token);
		if (null == userId) {
			return null;
		}
		HashMap<String, Object> param = new HashMap<String, Object>();
		param.put("id", userId);
		SysUser user = manageService.queryUserByLoginName(param);
		return user;
	}
}
