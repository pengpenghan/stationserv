package com.upbest.filter.utils;

import com.alibaba.druid.filter.config.ConfigTools;
import com.alibaba.druid.pool.DruidDataSource;

/***
 * @Package: com.upbest.filter.utils
 * @Description: 配置文件(数据连接)密文处理
 * @author zhoujian
 * @date 2018年3月16日 下午5:43:47
 */
@SuppressWarnings("serial")
public class DbConnectDecrypt extends DruidDataSource {

	public void setUsername(String username) {
		try {
			username = ConfigTools.decrypt(username);
		} catch (Exception e) {
			e.printStackTrace();
		}
		super.setUsername(username);
	}

	public void setPassword(String password) {
		try {
			password = ConfigTools.decrypt(password);
		} catch (Exception e) {
			e.printStackTrace();
		}
		super.setPassword(password);
	}

}
