package com.upbest.filter.utils;

import java.util.HashMap;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;

/***
 * @Package: com.upbest.filter.utils
 * @Description: 路径操作过滤
 * @author zhoujian
 * @date 2018年3月9日 下午1:43:47
 */
public class PathUtil {

	private static final HashMap<String, String> MAP = new HashMap<String, String>();
	static {
		MAP.put(".jpg", ".jpg");
		MAP.put(".jpeg", ".jpeg");
		MAP.put(".png", ".png");
		MAP.put(".gif", ".gif");
		MAP.put(".bmp", ".bmp");
		MAP.put(".ico", ".ico");
		MAP.put(".swf", ".swf");
		MAP.put(".doc", ".doc");
		MAP.put(".docx", ".docx");
		MAP.put(".xls", ".xls");
		MAP.put(".xlsx", ".xlsx");
		MAP.put(".ftl", ".ftl");
		MAP.put(".xml", ".xml");
		MAP.put(".txt", ".txt");
	}

	/***
	 * @Package: com.upbest.filter.utils
	 * @Description: 过滤一些特殊字符
	 * @author zhoujian
	 * @date 2018年3月9日 下午2:01:34
	 */
	public static String stringFilter(String path) {
		String file = "";// 点前面的内容
		String suffix = "";// .后缀命名
		if (!StringUtils.isBlank(path) && -1 != path.lastIndexOf(".")) {
			String temp = "";
			file = path.substring(0, path.lastIndexOf("."));
			suffix = path.substring(path.lastIndexOf("."), path.length());
			temp = MAP.get(suffix.toLowerCase(Locale.ENGLISH)) == null ? ""
					: MAP.get(suffix.toLowerCase(Locale.ENGLISH));
			if (!StringUtils.isBlank(temp)) {
				// 清除掉所有特殊字符
				String regEx = "[\\\\.#&?\"<>|]";
				Pattern p = Pattern.compile(regEx);
				Matcher m = p.matcher(file);
				file = p.matcher(file).replaceAll("");
				// 去除空格、回车、换行符、制表符
				Pattern ph = Pattern.compile("(^\\s*|\\s*|\\s*|\\t|\\r|\\n$)");
				file = ph.matcher(file).replaceAll("");
				path = file + suffix;
			} else {
				path = "";
			}
		} else {
			path = "";
		}
		return path;
	}
}
