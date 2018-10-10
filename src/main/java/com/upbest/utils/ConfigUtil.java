package com.upbest.utils;

import java.util.Locale;
import java.util.ResourceBundle;

public class ConfigUtil {

	private static final ResourceBundle bundle = ResourceBundle.getBundle(
			"conf/application", Locale.SIMPLIFIED_CHINESE);

	/**
	 * 
	 * @Title 函数名称： get
	 * @Description 功能描述： 通过键获取值
	 * @param 参
	 *            数：
	 * @return 返 回 值： String
	 * @author 创 建 者： <A HREF="bxu@upbest-china.com">bxu</A>
	 * @throws
	 */
	public static final String get(String key) {
		return bundle.getString(key);
	}

	public static final Integer getIntVal(String key) {
		String val = bundle.getString(key);
		return Integer.valueOf(val);
	}
}
