package com.upbest.filter.utils;

import java.io.IOException;
import java.util.Date;
import java.util.Map;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.SerializationConfig;
import org.codehaus.jackson.map.annotate.JsonSerialize;

/***
 * @Package: com.upbest.filter.utils
 * @Description: JSON转换
 * @author zhoujian
 * @date 2018年3月8日 下午8:58:16
 */
public class JSONUtil {

	private static ObjectMapper objectMapper = new ObjectMapper();

	static {
		objectMapper.configure(
				SerializationConfig.Feature.WRITE_NULL_MAP_VALUES, false);
		objectMapper
				.setSerializationInclusion(JsonSerialize.Inclusion.NON_NULL);
	}

	/***
	 * @Package: com.upbest.filter.utils
	 * @Description: json字符串转Map
	 * @author zhoujian
	 * @date 2018年3月8日 下午8:58:16
	 */
	@SuppressWarnings("unchecked")
	public static Map<String, Object> parseMap(String jsonStr) {
		Map<String, Object> map = null;
		if (!StringUtils.isBlank(jsonStr)) {
			try {
				map = objectMapper.readValue(jsonStr, Map.class);
			} catch (JsonParseException e) {
				e.printStackTrace();
			} catch (JsonMappingException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return map;
	}

	/**
	 * @Package: com.upbest.filter.utils
	 * @Description: Object to jsonStr
	 * @author zhoujian
	 * @date 2018年3月9日 上午11:02:53
	 */
	public static final String object2JsonStr(Object object,int type) {
		JsonConfig jsonConfig = new JsonConfig();
		// 数据日期格式化
		jsonConfig.registerJsonValueProcessor(Date.class,
				new DateJsonValueProcessor("yyyy-MM-dd"));
		JSONArray jsonArray = JSONArray.fromObject(object, jsonConfig);
		if (type == 0) {
			return jsonArray.toString();
		}else {
			//将数组转换成json对象
			JSONObject jsonObject = jsonArray.getJSONObject(0);
			return jsonObject.toString();
		}
	}
}
