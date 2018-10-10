/**
 * @author XiaoRu LI
 * @description 将from的数据进行填充和获取。
 * @date 2010-03-29
 * 
 * 
 */

setForm = function(jsonData) {
	for ( var key in jsonData) {
		setFormSingle(key, jsonData[key]);
	}
};


/**
 * 
 * 
 */
setFormSingle = function(key, value) {

	var element = $("#" + key);

	var type = null;
	try {
		type = element.getElementType();
	} catch (e) {
	}

	if (type == null) {
		type = element.attr("type");
		if (type == "checkbox" || type == "radio") {
			if (value != "0")
			{
				element.attr("checked", "checked");
				
			}
		} else if (type == "image") {
			element.attr("src", value)
		} else
			element.val(value);
	} else if (type == "NaTable") {
		element.setTableData(value, true);
	} else if (type == "NaTree") {
		element.setTreeData(value);
	} else if (type == "NaSelect") {
		if(value.indexOf(':') > -1)
			element.setSelectData(value);
		else
			element.setKey(value);
	}

};

/**
 * 设置Url参数
 */
setUrlParam = function(key, value) {

	var params = $(document).data("url_params");
	params = params == null ? "" : params;
	var indexof = params.indexOf("&" + key);

	// 已经存在,覆盖!
	if (indexof >= 0) {
		// 取出前面的参数
		var pfixStr = params.substring(0, indexof);
		// 取出当前和后面的参数
		var efixStr = params.substring(indexof + 1, params.length);
		// 取出后面的参数
		var n_efixStr = "";
		if (efixStr.indexOf("&") >= 0)
			n_efixStr = efixStr.substring(efixStr.indexOf("&"), efixStr.length);
		// 新的参数=前面参数+新参数+后面的参数。
		params = pfixStr + "&" + key + "=" + value + n_efixStr;

	} else {
		params += "&" + key + "=" + value;
	}

	$(document).data("url_params", params);

};

/**
 * 获取Url参数集(不包含页面中的元素)
 */
getUrlParams = function() {
	var params = $(document).data("url_params");
	if (params == null)
		return "";

	if (params.length > 0)
		return params.substring(1, params.length);
	else
		return "";
}

/**
 * 获取所有的url参数集,包含页面中的所有的input元素。
 */
getAllUrlParams = function() {

	var params = $(document).data("url_params");
	params = params == null ? "" : params;

	$("form input").each(
			function() {

				var type = $(this).getElementType();
				if (type == null) {
					type = $(this).attr("type");
					if (type == "checkbox" || type == "radio") {

						params += "&" + $(this).attr("id") + "="+$(this).attr("checked");

					} else if (type == "image") {
						params += "&" + $(this).attr("id") + "="
								+ $(this).attr("src");
					} else {
						params += "&" + $(this).attr("id") + "="
								+ $(this).val();
					}
				} else if (type == "NaSelect") {
					params += "&" + $(this).attr("id") + "=" + $(this).getKey()
							+ "&" + $(this).attr("id") + "_label" + "="
							+ $(this).getValue();
				}
			});

	if (params.length > 0)
		return params.substring(1, params.length);
	else
		return "";

};


/**
 * 获取到页面的所有的input的的JSON格式
 */
getFormInputJsonStr =function(id)
{
	
	if(id==""||id==null)
		id="form";
	else
	   id="#"+id;
	
	var inputStr="";
	$(id+" input").each(
			function() {

				var type = $(this).getElementType();
				if (type == null) {
					type = $(this).attr("type");
					if (type == "checkbox" || type == "radio") {
						inputStr+="'"+$(this).attr("id")+"':'"+$(this).attr("checked")+"',";
					}
					else
						inputStr+="'"+$(this).attr("id")+"':'"+$(this).val()+"',";
					
					
				} else if (type == "NaSelect") {
					
					inputStr+="'"+$(this).attr("id")+"':'"+$(this).getKey()+"',";
					inputStr+="'"+$(this).attr("id")+"_label':'"+$(this).getValue()+"',";
				}
			});
	
	var newInputStr="";
	if(inputStr.length>0)
		newInputStr=inputStr.substring(0, inputStr.length-1);
	
	return "[{"+newInputStr+"}]";

}
