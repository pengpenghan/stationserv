package com.upbest.filter.utils;

import java.util.Date;

/***
 * @Package: com.upbest.filter.utils
 * @Description: ID生成工具类
 * 访问控制：
 * 禁止对自增长主键进行单个主键操作。（对单个自增长主键进行操作需2个以上有效参数，或者将自增长主键设计为UUID之类的自定义主键）
 * @author zhoujian
 * @date 2018年3月12日 上午9:20:16
 */
public class IDUtil {
	public static final Long getNextLongId() {
		Date date = new Date();
		long result = date.getTime();
		return result;
	}

	public static final String getUUIDStr(int len) {
		long varl = 0L;
		if (len > 32) {
			len = 32;
		}
		String UUID = Long.toHexString(new Date().getTime()).toUpperCase();
		UUID = UUID + Long.toHexString(varl);
		varl += 1L;
		while (UUID.length() < len) {
			String random = String.valueOf(Math.random());
			try {
				UUID = UUID
						+ Long.toHexString(Long.parseLong(random.substring(2)))
								.toUpperCase();
			} catch (NumberFormatException localNumberFormatException) {
			}
		}
		UUID = UUID.substring(0, len);
		return UUID;
	}

	public static final String getUUIDStr() {
		return getUUIDStr(32);
	}
	
	public static void main(String[] args) {
		System.out.println("LONG================"+getNextLongId());
		System.out.println("String 32位================"+getUUIDStr());
		System.out.println("String 拟定位================"+getUUIDStr(10));
	}
}
