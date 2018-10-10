package com.upbest.utils;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;


/**
 * 字符串工具类
 * @author zhangchaofeng
 * @version 1.0
 * @date Sep 29, 2011
 */
public class StringUtil {
	public static String getStringValue(Object obj){
		if(obj==null){
			return "";
		}
		return obj.toString();
	}
	public static String monthYYYYMM(String obj){
		if(obj==null){
			return "";
		}
		return obj.replace("-", "");
	}
	public static String getClientIp(HttpServletRequest request) {

        String ip = request.getHeader("x-forwarded-for");

  //String ip = request.getHeader("X-real-ip");

        if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP"); 
        }
        if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        if(StringUtils.isNotBlank(ip)) {
            ip = ip.split(",")[0];
        }
        return ip;

    }
 
	public Map<String, Object> success(Object message) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		resultMap.put("success", 0);
		resultMap.put("data", message);
		return resultMap;
	}
	public static String monthYYYY_MM(String obj){
		if(obj==null || obj.length() != 6){
			return obj;
		}
		return obj.substring(0,4)+"-"+obj.substring(4);
	}
	
	public static String monthToYYYY(String obj){
		if(obj==null || obj.length() != 6){
			return obj;
		}
		return obj.substring(0,4);
	}
	
	public static String monthYYYYMMChinese(String obj){
		if(obj==null || obj.length() != 6){
			return obj;
		}
		return obj.substring(0, 4) + "年" + obj.substring(4) + "月";
	}
	public static String monthYYYYMMChinese7(String obj){
		if(obj==null || obj.length() != 7){
			return obj;
		}
		return obj.substring(0, 4) + "年" + obj.substring(5) + "月";
	}
	public static int getStringLength(String str){
		if(str==null){
			return 0;
		}
		return str.getBytes().length;
	}
	
	public static boolean hasValue(Object o){
		if(o==null||o.toString().trim().equals("")){
			return false;
		}
		return true;
	}
	
	public static boolean isNumber(String str){
		String reg="^[-|+]?\\d*([.]\\d+)?$";
		return str.matches(reg);
	}
	
	/***
	 * 获取字符串中数字
	 * @param str
	 * @return
	 */
	public static String findNumber(String str) {
		String regEx="[^0-9.]";  
    	Pattern p = Pattern.compile(regEx);  
    	Matcher m = p.matcher(str);  
    	return "".equals(m.replaceAll("").trim()) ? "0" : m.replaceAll("").trim();
	}
	
	public static void main(String[] args) {
		String str="abcc12.30";
		System.out.println(isNumber(str));
		System.out.println(findNumber(str));
	}
}
