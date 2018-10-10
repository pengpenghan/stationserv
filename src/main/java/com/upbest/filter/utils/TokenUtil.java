package com.upbest.filter.utils;



/***
 * @Package: com.upbest.smartcity.filter.utils
 * @Description: Token
 * @author zhoujian
 * @date 2018年3月13日 下午2:43:47
 */
public class TokenUtil {

public static final String ACCESS_TOKEN = "access_token";
	
	public static final String U_ID = "u_id";
	
	/***
	 * @Package: com.upbest.filter.utils
	 * @Description: 单例设计模式（保证类的对象在内存中只有一个）
	 *	1、把类的构造函数私有
	 *	2、自己创建一个类的对象
	 *	3、对外提供一个公共的方法，返回类的对象
	 * @author zhoujian
	 * @date 2018年3月13日 下午3:51:14
	 */
	private TokenUtil(){}

	private static final TokenUtil INSTANCE = new TokenUtil();

	public static TokenUtil getInstance(){
	    return INSTANCE;
	}

	/***
	 * @Package: com.upbest.filter.utils
	 * @Description: 生成Token
	 * @author zhoujian
	 * @date 2018年3月13日 下午3:52:12
	 * @param userMark 用户手机号
	 */
	public static String generateToken(String userMark){
	   return AESUtil.encrypt(userMark + IDUtil.getUUIDStr(),0);//手机号+32位uuid
	}
}
