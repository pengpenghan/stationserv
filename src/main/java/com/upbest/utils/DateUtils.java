package com.upbest.utils;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;

import org.apache.commons.lang.StringUtils;

public class DateUtils {
	public static final String PATTERN_YYYY_MM_DD = "yyyy-MM-dd";
	public static final String PATTERN_YYYY_MM_DD2 = "yyyy/MM/dd";
	/** 完整时间 yyyy-MM-dd HH:mm:ss */
	public static final String yyyyMM = "yyyyMM";
	public static final String yyyy = "yyyy";
	public static final String yyyy_MM = "yyyy-MM";
	public static final String yyyyMMChinese = "yyyy年MM月";
	public static final String YYYYMMDD = "yyyyMMdd";
	public static final String YYYYMMDDHHMM = "yyyyMMddHHmm";
	public static final String YYYYMMDDHHMMSS = "yyyyMMddHHmmss";
	public static final String YMDHMS = "yyyy-MM-dd HH:mm:ss";
	public static final String YMDHMS2 = "yyyy/MM/dd HH:mm:ss";
	public static final String HH = "HH";
	public static final String HHMMSS = "HH:mm:ss";

	/**
	 * 获取日期(精确到毫秒)格式化，格式：yyyy-MM-dd HH:mm:ss
	 * 
	 * @return
	 */
	public static String formateDate(Date date, String pattern) {
		DateFormat df = new SimpleDateFormat(pattern);
		return df.format(date);
	}
	
	/**
	 * 获取日期(精确到毫秒)格式化，格式：yyyy-MM-dd HH:mm:ss
	 * 
	 * @return
	 */
	public static Date formateDateToDate(String date, String pattern) {
		DateFormat  df = new SimpleDateFormat(pattern);
		try {
			return df.parse(date);
		} catch (ParseException e) {
			return new Date();
		}
	}

	public static int hourNum() {
		Date d = new Date();
		return (d.getDate() - 1) * 24 + d.getHours();
	}

	public static int hourNumByDate(String date) {
		int len = date.lastIndexOf("-");
		int day = 0;
		if (len != -1) {
			date = date.substring(len + 1);
			day = Integer.parseInt(date);
		}
		return day * 24;
	}

	/**
	 * 从当月开始 过去的12个月月份
	 * 
	 * @return
	 */
	public static List<String> monthes(int size) {

		DateFormat df = new SimpleDateFormat("yyyy年MM月");
		List<String> list = new ArrayList<String>();
		Calendar cal = Calendar.getInstance();
		// 调到上个月
		for (int i = 1; i <= size; i++) {
			cal.add(Calendar.MONTH, -1);
			list.add(df.format(cal.getTime()));
		}

		return list;
	}

	public static String lastMonth() {
		Calendar cal = Calendar.getInstance();
		// 调到上个月
		cal.add(Calendar.MONTH, -1);
		DateFormat df = new SimpleDateFormat("yyyy-MM");
		return df.format(cal.getTime());
	}
	
    /**
     * 
     * @param year
     * @param month
     * @param num +1月是下月 -1是上月
     * @return
     */
	public static String lastNextMonth(int  year,int month,int num) {
		int newMonth =  month + num;
         if(newMonth > 12){
        	 newMonth = 1;
        	 year = year +1;
         }
         else if(newMonth == 0){
         	 newMonth = 12;
        	 year = year -1;
         }
         String strMonth = (newMonth +100)+"";
         return year+strMonth.substring(1);
		 
	}
	
	public static String lastLastMonth(Integer month) {
		Calendar cal = Calendar.getInstance();
		// 调到上上个月
		cal.add(Calendar.MONTH, month-10);
		DateFormat df = new SimpleDateFormat("yyyy-MM");
		return df.format(cal.getTime());
	}

	public static List<Integer> monthes2(int size) {
		if (size > 24)
			return null;
		List<Integer> list = new ArrayList<Integer>();
		Date d = new Date();
		int month = d.getMonth();
		int year = (d.getYear() + 1900) * 100;

		for (int i = (month + 1); i > 0; i--) {
			// System.out.println();
			list.add(year + i);
		}
		int oldyear = (d.getYear() - 1 + 1900) * 100;
		int num = list.size();
		int snum = size - num;
		// System.out.println(snum);
		if (snum > 0) {
			int buNum = 12 - snum;
			for (int i = 12; i > buNum; i--) {
				// System.out.println(i);
				list.add(oldyear + i);
			}
		}

		// System.out.println(year);

		return list;
	}

	public static List<String> findMonth(String date) {
   
		List<String> list = new ArrayList<String>();
		// date = date.replace("-", "");
		// int monthNum = Integer.parseInt(date.substring(4));
		for (int i = 1; i <= 12; i++) {
			String t = (i + 100) + "";
			String month = date.substring(0, 4) + "-" + t.substring(1);
			// System.out.println(month);
			list.add(month);
		}
		return list;
	}

	public static List<String> findCurrentMonth(String date) {
        int currentMonth = Integer.parseInt(date.substring(5));
		List<String> list = new ArrayList<String>();
		// date = date.replace("-", "");
		// int monthNum = Integer.parseInt(date.substring(4));
		for (int i = 1; i <= currentMonth; i++) {
			String t = (i + 100) + "";
			String month = date.substring(0, 4) + "-" + t.substring(1);
			// System.out.println(month);
			list.add(month);
		}
		return list;
	}
	
	/**
	 * 查询上一个月天数
	 * 
	 * @return
	 */
	public static int lastMonthDayNum(int month) {
		Calendar cal = Calendar.getInstance();
		// 调到上个月
		cal.add(Calendar.MONTH, month);
		// 得到一个月最最后一天日期(31/30/29/28)
		int maxDay = cal.getActualMaximum(Calendar.DAY_OF_MONTH);
		return maxDay;
	}

	public static List<String> findDaily(int dayNum) {
		// if(dayNum > 30) return null;
		DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		List<String> list = new ArrayList<String>();
		Date d = new Date();
		int month = d.getMonth() + 1;
		int daily = d.getDate();
		int year = d.getYear() + 1900;
		for (int i = daily; i > 0; i--) {
			try {
				Date day = df.parse(year + "-" + month + "-" + i);
				list.add(df.format(day));
			} catch (ParseException e) {
				e.printStackTrace();
			}

		}

		int lastMonthMaxDay = lastMonthDayNum(-1);
		int num = list.size();
		int snum = dayNum - num;
		if (snum > 0) {
			int buNum = lastMonthDayNum(-1) - snum;
			if (buNum < 0)
				buNum = 0;
			if (month != 1) {
				for (int i = lastMonthMaxDay; i > buNum; i--) {
					Date day = null;
					try {
						day = df.parse(year + "-" + (month - 1) + "-" + i);
					} catch (ParseException e) {
						e.printStackTrace();
					}
					list.add(df.format(day));
				}
			} else {
				int oldyear = d.getYear() - 1 + 1900;
				for (int i = 31; i > buNum; i--) {
					Date day = null;
					try {
						day = df.parse(oldyear + "-12-" + i);
					} catch (ParseException e) {
						e.printStackTrace();
					}
					list.add(df.format(day));
				}

			}

		}

		return list;
	}

	public static String[] monthMaxDay(String date) {
		date = date.replace("-", "");
		int monthNum = Integer.parseInt(date.substring(4));
		if (date == null || "".equals(date) || date.length() != 6)
			return null;
		String month = date.substring(0, 4) + "年" + monthNum + "月";
		String startmonth = month + "01日";

		String monthdate = date.substring(0, 4) + "-" + monthNum + "-01";
		DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		Calendar cal = Calendar.getInstance();
		try {
			cal.setTime(df.parse(monthdate));
		} catch (ParseException e) {
			e.printStackTrace();
		}
		String result[] = new String[4];
		int day = cal.getActualMaximum(Calendar.DAY_OF_MONTH);// 本月份的天数
		String endmonth = month + day + "日";
		String m_m = "1";
		if (monthNum > 1) {
			m_m += "-" + monthNum;
		}
		result[0] = month;
		result[1] = startmonth;
		result[2] = endmonth;
		result[3] = m_m;
		return result;
	}
	
	public static String[] monthMaxDay2(String date) {
		date = date.replace("-", "");
		int monthNum = Integer.parseInt(date.substring(4));
		if (date == null || "".equals(date) || date.length() != 6)
			return null;
		String month = date.substring(0, 4) + "年" + monthNum + "月";
		String startmonth = month + "01日";

		String monthdate = date.substring(0, 4) + "-" + monthNum + "-01";
		DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		Calendar cal = Calendar.getInstance();
		try {
			cal.setTime(df.parse(monthdate));
		} catch (ParseException e) {
			e.printStackTrace();
		}
		String result[] = new String[4];
		int day = cal.getActualMaximum(Calendar.DAY_OF_MONTH);// 本月份的天数
		String endmonth = monthNum + "月" + day + "日";
		String m_m = "1";
		if (monthNum > 1) {
			m_m += "-" + monthNum;
		}
		result[0] = month;
		result[1] = startmonth;
		result[2] = endmonth;
		result[3] = m_m;
		return result;
	}

	public static String oldmonth(String month) {
		DateFormat df = new SimpleDateFormat("yyyy-MM");
		Calendar cal = Calendar.getInstance();
		try {
			cal.setTime(df.parse(month+"-01"));
		} catch (ParseException e) {
			e.printStackTrace();
		}
		// 调到上个月
		cal.add(Calendar.MONTH, -1);
//		cal.add(Calendar.YEAR, Integer.parseInt(month.substring(0,4)));
		return df.format(cal.getTime());

	}
	
	public static void main(String[] args) {
	    System.out.println(lastNextMonth(2016,1,-1));
	    //System.out.println(lastLastMonth(9));
	    
		// Calendar cal = Calendar.getInstance();
		// //调到上个月
		// cal.add(Calendar.MONTH, -1);
		// DateFormat df=new SimpleDateFormat("yyyy-MM");
		// List monthes = DateUtils.monthes(12);
		// System.out.println(df.format(cal.getTime()));
	    
	    try {
			System.out.println(DateUtils.parseDate(DateUtils.formateDate(new Date(), "yyyy-MM-dd HH-mm-ss"), "yyyy-MM-dd HH-mm-ss"));
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public static Date parseDate(String dateStr, String pattern) throws ParseException {
		DateFormat df = new SimpleDateFormat(pattern);
		return df.parse(dateStr);
	}

	public static long parseDateToLongTime(String dateStr, String pattern) {
		if (StringUtils.isEmpty(dateStr))
			return 0;
		DateFormat df = new SimpleDateFormat(pattern);
		try {
			return df.parse(dateStr).getTime();
		} catch (ParseException e) {
			e.printStackTrace();
			return 0;
		}
	}

	public static int getThisSeasonTime() {
		int month = new Date().getMonth() + 1;
		int quarter = 0;
		if (month >= 1 && month <= 3) {
			quarter = 1;
		} else if (month >= 4 && month <= 6) {
			quarter = 2;
		} else if (month >= 7 && month <= 9) {
			quarter = 3;
		} else if (month >= 10 && month <= 12) {
			quarter = 4;
		}
		return quarter;
	}

	public static String getFormatDateString(String dateStr) {
		DateFormat df = new SimpleDateFormat(YMDHMS);
		try {
			Date date = df.parse(dateStr);
			return df.format(date);
		} catch (ParseException e) {
			e.printStackTrace();
			df = new SimpleDateFormat(YMDHMS2);
			Date date;
			try {
				date = df.parse(dateStr);
				return df.format(date);
			} catch (ParseException e1) {
				e1.printStackTrace();
				return "";
			}
		}
	}
	public static String getFormatDateYMDString(Date dateStr) {
		if(dateStr==null) return "";
			
		DateFormat df = new SimpleDateFormat(PATTERN_YYYY_MM_DD);
	    return df.format(dateStr);
	 
	}
	
	public static int getDutyDays(String strStartDate, String strEndDate) {
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		Date startDate = null;
		Date endDate = null;
		int result = 0;
		try {
			startDate = df.parse(strStartDate);
			endDate = df.parse(strEndDate);
			while (startDate.compareTo(endDate) <= 0) {
				if (startDate.getDay() != 6 && startDate.getDay() != 0)
					result++;
				else {
					System.out.println(startDate.toString());
				}
				startDate.setDate(startDate.getDate() + 1);
			}
		} catch (Exception e) {
			System.out.println("getDutyDays:非法的日期格式,无法进行转换;smdate=" + strStartDate + ";bdate" + strEndDate);
		}
		return result;
	}

	public static int dateInterval(String smdate, String bdate) {
		int result = 0;
		try {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			Calendar cal = Calendar.getInstance();
			cal.setTime(sdf.parse(smdate));
			long time1 = cal.getTimeInMillis();
			cal.setTime(sdf.parse(bdate));
			long time2 = cal.getTimeInMillis();
			long between_days = (time2 - time1) / (1000 * 3600 * 24);

			return Integer.parseInt(String.valueOf(between_days));
		} catch (Exception e) {
			System.out.println("dateInterval:非法的日期格式,无法进行转换;smdate=" + smdate + ";bdate" + bdate);
		}
		return 0;
	}
	/**
	 * 获取当前时间的YMDHMS格式
	 * @param pattern
	 * @return
	 */
	public static String getNow() {
		SimpleDateFormat sdf = new SimpleDateFormat(YMDHMS);
		return sdf.format(new Date());
	}
	public static Integer dateInterval2(String smdate, String bdate) {
		try {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			Calendar cal = Calendar.getInstance();
			cal.setTime(sdf.parse(smdate));
			long time1 = cal.getTimeInMillis();
			cal.setTime(sdf.parse(bdate));
			long time2 = cal.getTimeInMillis();
			long between_days = (time2 - time1) / (1000 * 3600 * 24);

			return Integer.parseInt(String.valueOf(between_days));
		} catch (Exception e) {
			System.out.println("dateInterval2:非法的日期格式,无法进行转换;smdate=" + smdate + ";bdate" + bdate);
			return null;
		}
	}
	
	/***
	 * 获取月份最大天数
	 * @param month
	 * @return
	 */
	public static int getDaysWithMonth(String month){
		int days = 0;
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM"); 
		Calendar calendar = new GregorianCalendar(); 
		try {
			Date date = sdf.parse(month);
			calendar.setTime(date);
			days = calendar.getActualMaximum(Calendar.DAY_OF_MONTH); 
		} catch (ParseException e) {
			e.printStackTrace();
		} 
		return days;
	}
	
	/***
	 * 获取当前日期下一天
	 * @Description 
	 * @author Administrator
	 * @return
	 */
	public static String getTomorrowDate(int day){
	    Date date = new Date();
	    Calendar calendar = Calendar.getInstance();
	    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        calendar.setTime(date);  
        calendar.add(Calendar.DAY_OF_MONTH, day);  
        date = calendar.getTime();  
        return sdf.format(date);  
	}
	/***
	 * 风险度日期计算
	 * @Description 
	 * @author Administrator
	 * @param min
	 * @return
	 * @throws ParseException
	 */
	public static String dateCalc(int min){
	    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
	    SimpleDateFormat df=new SimpleDateFormat("yyyy-MM-dd");
	    Calendar cal = Calendar.getInstance();
	    Date date = new Date();
	    try {
            date = sdf.parse(df.format(date) + " 17:30");
        } catch (ParseException e) {
            e.printStackTrace();
        }
	    cal.setTime(date);
	    cal.add(Calendar.MINUTE, min);
	    return sdf.format(cal.getTime());
	}
	/***
	 * 日期比较大小
	 * @Description 
	 * @author Administrator
	 * @param date1
	 * @param date2
	 * @return
	 */
	public static boolean compareDate(String date1, String date2) {
	    boolean result = false;
        DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        try {
            Date dt1 = df.parse(date1);
            Date dt2 = df.parse(date2);
            if (dt1.getTime() > dt2.getTime()) {
                result = true;
            }
        } catch (Exception exception) {
            exception.printStackTrace();
        }
        return result;
    }
	
	/**
	 * @Title getFiveData  
	 * @Description 返回间隔5秒数据
	 * @author hanpp
	 * @return String
	 * @date 2018年9月17日 下午3:48:39  
	 * @throws
	 */
	public static Date getFiveData(int sum){
		Calendar c = new GregorianCalendar();
		Date date = new Date();
		c.setTime(date);//设置参数时间
		c.add(Calendar.SECOND,-5 * sum);//把日期往后增加SECOND 秒.整数往后推,负数往前移动
		date=c.getTime(); //这个时间就是日期往后推一天的结果
		return date;
	}
}
