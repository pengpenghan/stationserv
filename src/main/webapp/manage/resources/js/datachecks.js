	/**
		判断字符串是否为空，去除两头空格
	*/
	function isEmpty(str)
	{
		str=str.replace(/(^\s*)|(\s*$)/g, "");
		
		return (str.length==0);		
	}

	/**
		判断值是否匹配给定的正则表达式
		@param reg 给定的正则表达式
		@param value 待判断的值
		@param igore 是否忽略大小写 true 忽略，false 不忽略
		@return true 匹配 false 不匹配
	*/
	function matchRegExp(reg, value, ignore)
	{
		var regEx
		if( ignore )
		{
			regEx = new RegExp(reg, "i");
		}
		else
		{
			regEx = new RegExp(reg);
		}
		return regEx.test(value);
	}

	/**
		判断给定的字符串是否符合EMAIL格式
		@param 待判断的值
		@return true 合法 false 非法
	*/
	function isEmail(value)
	{
		return matchRegExp("^[\\w-]+(\\.[\\w-]+)*@[\\w-]+(\\.[\\w-]+)+$", value, true);
	}

	/**
		判断给定的字符串是否全为数字构成的字符串
		@param value 待判断的字符串
		@return true 是 false 不是
	*/
	function isDigitalString(value)
	{
		return matchRegExp("^[\\d]+$", value, true);
	}
	
	/**
		判断两个给定的值是否相等
		@param value1 值1
		@param value2 值2
		@return true 相等 false 不等
	*/
	function equal(value1, vlaue2)
	{
		return value1 = value2;
	}
	
	/**
		判断给定的字符串长度是否在给定的长度区间内
		@param value 给定的字符串
		@param min 最小长度
		@param max 最大长度
		@return true 是 false 不在
	*/
	function limit(value, min, max)
	{
		if( min != -1 && max != -1)
		{
			return value.length >= min && value.length <= max;
		}
		else if( min != -1 )
		{
			return value.length >= min;
		}
		else if( max != -1 )
		{
			return value.length <= max;
		}
		else
			return false;
	}
	function uLimit(value, min, max)
	{
		return limit(value, min, max);
	}
	
	/**
		判断给定的数字是否在给定的范围内
		@param value 给定的值
		@param bInt 是整型
		@param min 最小值
		@param max 最大值
		@param precision 精度，如果为-1，则不判断
		@param bContainMin 是否含最小值
		@param bContainMax 是否含最大值
		@return true 在 false 不在 
	*/
	function isRange(value, bInt, min, max, precision, bContainMin, bContailMax)
	{
		var ret = true;
		if( !isDigital(value) )
			return false;
		if( bInt )
		{
			if( !isInteger(value) )
				return false;
		}
		if( bContainMin )
		{
 			ret = ret && value >= min;
 		}
 		else
 		{
 			ret = ret && value > min;
 		}
 		if( bConainMax )
 		{
 			ret = ret && value <= max;
 		}
 		else 
 		{
 			ret = ret && value < max;
 		}
 		ret = ret && isPrecision(value, precision);
 		return ret;
	}
	function checkNum(val, isFloat){
		var i=0;
		var flag=true;
		var dot = 0;
		for(i=0;i<val.length;i++){
			var ch=val.charAt(i);
			if( i == 0 && !isFloat )
			{
				if( ch == '0' )
				{
					return false;
				}
			}
			if(!asc(ch,isFloat)){
				flag=false;
			}
			if( ch == '.' )
			{
				dot = dot + 1;
				if( dot > 1 )
				{
					return false;
				}
			}
		}
		return flag;
	}
	function asc(c, isFloat){
		var i;
		var dot = 0;
		var num="0123456789";
		if( isFloat )
		{
			num = num + ".";
		}
		var flag=false;
		for(i=0;i<num.length;i++){
			if(c==num.charAt(i)){
				flag=true;
			}
		}
		return flag;
	}

	/**
		判断给定的值是否为整型
		@param value 给定的值
		@return true 是 false 不是
	*/
	function isInteger(value)
	{
		if( checkNum(value, false) )
		{
			return !isNaN(parseInt(value));
		}
		else
		{
			return false;
		}
	}
	
	/**
		判断给定的值是否为浮点型
		@param value 给定的值
		@return true 是 false 不是
	*/
	function isFloat(value)
	{
		if( checkNum(value, true) )
		{
			return !isNaN(parseFloat(value));
		}
		else
		{
			return false;
		}
	}
	
	/**
		判断给定的值是否为数字
		@param value 给定的值
		@return true 是 false 不是
	*/
	function isDigital(value)
	{
		if( checkNum(value, true) )
		{
			return value != "" && !isNaN(Number(value));
		}
		else
		{
			return false;
		}
	}
	
	/**
		判断给定的值的精度是否在指定精度内
		@param value 给定的值
		@param precision 精度,如果为-1，则不判断
		@return true 是 false 不是
	*/
	function isPrecision(value, precision)
	{
		if( precision < 0)
		{
			return true;
		}
		else
		{
			var pos = value.indexOf(".");
			var len = value.length -1;
			if( pos >= 0 )
			{
				while(length > pos )
				{
					if( value.charAt(len) = '0' )
					{
						len--;
					}
					else
						break;
				}
			}
			return len - pos < precision;
		}
	}
	
	function isMoney(value){
		var patrn=/^(-)?(([1-9]{1}\d*)|([0]{1}))(\.(\d){1,2})?$/; 

		if (!patrn.exec(value)) { 
			alert('false'); 
		}else{ alert('true'); } 


		
	}