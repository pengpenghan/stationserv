package com.upbest.utils;

public class Constant {

	/**
	* @ClassName: StationStatus  
	* @Description: 站点状态 0 正常 1选中展示 -1 删除
	* @author Administrator  
	* @date 2018年9月29日  
	*
	 */
	public static enum StationStatus{
		normal(0),delete(-1),show(1);
		
		private int code;
		
		public int getCode() {
			return code;
		}

		public void setCode(int code) {
			this.code = code;
		}

		StationStatus(int code){
			this.code = code;
		}
	}
	
	/**
	* @ClassName: StationStatus  
	* @Description: 站点状态 0 正常 1选中展示 -1 删除
	* @author Administrator  
	* @date 2018年9月29日  
	*
	 */
	public static enum CommonStatus{
		normal(0),delete(-1),show(1);
		
		private int code;
		
		public int getCode() {
			return code;
		}

		public void setCode(int code) {
			this.code = code;
		}

		CommonStatus(int code){
			this.code = code;
		}
	}
	
}
