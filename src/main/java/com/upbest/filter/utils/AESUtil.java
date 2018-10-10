package com.upbest.filter.utils;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.upbest.filter.utils.AESUtil;
import com.upbest.filter.utils.Base64Util;
import com.upbest.filter.utils.JSONUtil;
import com.upbest.utils.ConfigUtil;

/***
 * @Package: com.upbest.filter.utils
 * @Description: AES加密
 * @author zhoujian
 * @date 2018年3月8日 下午1:43:47
 */
public class AESUtil {

	private static final Logger logger = LoggerFactory.getLogger(AESUtil.class);

	/**
	 * @Package: com.upbest.filter.utils
	 * @Description: 加密
	 * @author zhoujian
	 * @date 2018年3月8日 下午8:02:47
	 * @param type
	 *            0 返回list集合 1返回json对象
	 */
	public static String encrypt(Object obj, int type) {
		if (null != obj) {
			String jsonStr = null;
			try {
				jsonStr = JSONUtil.object2JsonStr(obj, type);
			} catch (Exception e2) {
				jsonStr = String.valueOf(obj);
			}
			String publicKey = ConfigUtil.get("aes.publicKey");
			if (publicKey == null) {
				logger.debug("Key为空null");
				return null;
			}
			// 去除模糊化
			try {
				publicKey = Base64Util.decode(publicKey);
			} catch (Exception e1) {
				e1.printStackTrace();
			}
			// 判断Key是否为16位
			if (publicKey.length() != 16) {
				logger.debug("Key长度不是16位");
				return null;
			}
			byte[] encrypted = null;
			try {
				byte[] raw = publicKey.getBytes();
				SecretKeySpec skeySpec = new SecretKeySpec(raw, "AES");
				Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");// "算法/模式/补码方式"
				IvParameterSpec iv = new IvParameterSpec(
						"abcdefgabcdefg11".getBytes());// 使用CBC模式，需要一个向量iv，可增加加密算法的强度
				cipher.init(Cipher.ENCRYPT_MODE, skeySpec, iv);
				encrypted = cipher.doFinal(jsonStr.getBytes());
			} catch (Exception e) {
				e.printStackTrace();
			}
			String str = new String(Base64.encodeBase64(encrypted));// 此处使用BAES64做转码功能，同时能起到2次加密的作用。
			return str;
		}
		return null;
	}

	/**
	 * @Package: com.upbest.filter.utils
	 * @Description: 解密
	 * @author zhoujian
	 * @date 2018年3月8日 下午8:02:47
	 */
	public static String decrypt(String sSrc) {
		if (!StringUtils.isBlank(sSrc)) {
			try {
				String publicKey = ConfigUtil.get("aes.publicKey");
				// 判断Key是否正确
				if (publicKey == null) {
					logger.debug("Key为空null");
					return null;
				}
				// 去除模糊化
				try {
					publicKey = Base64Util.decode(publicKey);
				} catch (Exception e1) {
					e1.printStackTrace();
				}
				// 判断Key是否为16位
				if (publicKey.length() != 16) {
					logger.debug("Key长度不是16位");
					return null;
				}
				byte[] raw = publicKey.getBytes("ASCII");
				SecretKeySpec skeySpec = new SecretKeySpec(raw, "AES");
				Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
				IvParameterSpec iv = new IvParameterSpec(
						"abcdefgabcdefg11".getBytes());
				cipher.init(Cipher.DECRYPT_MODE, skeySpec, iv);
				byte[] encrypted1 = Base64.decodeBase64(sSrc.getBytes());// 先用bAES64解密
				try {
					byte[] original = cipher.doFinal(encrypted1);
					String originalString = new String(original, "utf-8");
					return originalString;
				} catch (Exception e) {
					System.out.println(e.toString());
					return null;
				}
			} catch (Exception ex) {
				System.out.println(ex.toString());
				return null;
			}
		}
		return null;
	}
}
