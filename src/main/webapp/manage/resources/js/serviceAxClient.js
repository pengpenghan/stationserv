/**
 * bss serviceframework ajax client
 * example:
 *  异步调用:
 *  var client = new bss.serviceframework.ajax.client();
 *  var param = {"type":"partyName","value":"1234"};
 *  client.callServiceAsJson("bss.BluePrint.custFacade.query",param,
 *      function queryCallBack(response){
 *			alert(response.getCode());  
 *			alert(response.getBodyAsText());
 *		}
 *  );   
 *  同步调用:
 *	function testSyncQuery(){
 *	    var param = {"type":"partyName","value":"1234"};   
 *      var client = new bss.serviceframework.ajax.client();
 *		var result = client.callServiceAsJson("bss.BluePrint.custFacade.query",param);
 *		alert(result.getCode());  
 *		alert(result.getBodyAsText());
 *	}
 *  修改1：  zhaoxin 2009-12-29  对系统管理sm返回的过滤器session失效做处理
 *  @author linzp
 * 	@version 0.1
 */

function regNameSpace(namespace) {
	var seg = namespace.split(".");
	var obj = window[seg[0]] = window[seg[0]] || {};
	var c = obj;
	for ( var i = 1; i < seg.length; i++) {
		c[seg[i]] = c[seg[i]] || {};
		c = c[seg[i]];
	}
	return obj;
}
regNameSpace("bss.serviceframework.ajax");
bss.serviceframework.ajax.helper = {
	apply : function(targetObj, sourceObj) {
		for ( var i in sourceObj) {
			targetObj[i] = sourceObj[i];
		}
		return targetObj;
	},
	isFunction : function(fn) {
		return !!fn && typeof fn != "string" && !fn.nodeName
				&& fn.constructor != Array && /^[\s[]?function/.test(fn + "");
	},
	validateHeaders : function(header) {
		var acceptedHeaders = [ "Content-Type", "x-requested-with", "bssSysId",
				"bssSign", "bssReqTime" ];
		for ( var i = 0; i < acceptedHeaders.length; i++) {
			if (acceptedHeaders[i] == header)
				return true;
		}
		return false;
	},
	getXMLHttpRequest : function() {
		var xmlhttp = window.ActiveXObject ? new ActiveXObject(
				"Microsoft.XMLHTTP") : new XMLHttpRequest();
		return xmlhttp;
	},
	initXMLHttpRequest : function(xmlhttp, headers, successCallBack,
			failureCallBack) {
		for ( var p in headers) {
			if (bss.serviceframework.ajax.helper.validateHeaders(p))
				xmlhttp.setRequestHeader(p, headers[p]);
		}
	},
	contentTypes : {
		xml : "text/xml; charset=UTF-8",
		json : "text/plain; charset=UTF-8",
		text : "text/plain; charset=UTF-8"
	}
};

bss.serviceframework.ajax.client = function(config)
 { 	
 	
 	
	var helper = bss.serviceframework.ajax.helper;
	var _numPad = function(value)
	{
		return value < 10 ? '0'+ value : value;
	}
	var reqTime = new Date();
	var formatReqTimeStr =[ reqTime.getFullYear(),
	           _numPad(reqTime.getMonth()+1),
	           _numPad(reqTime.getDate()),
	           _numPad(reqTime.getHours()),
	           _numPad(reqTime.getMinutes()),
	           _numPad(reqTime.getSeconds())].join("");

	var defaultSettings = 
	{
		pwd : "12345",//"${PWD}",
		sysId : "DEFAULT_AJAX_USER",//"${SYSID}",
		reqTime : formatReqTimeStr,
		execType : "json",
		method : "POST"
	};
	var settings = helper.apply(defaultSettings, config || {});
	if (!helper.contentTypes[settings.execType]) 
	{
		throw ( [ "Unaccepted execType:", settings.execType,
				" , optional types:xml,json,text.",
				" json is taken as the default type if there isnt",
				" any exectype applied to config settings" ].join(""));
	}
	var headers = {};
	headers["Content-Type"] = helper.contentTypes[settings.execType];
	headers["x-requested-with"] = "XMLHttpRequest";
	headers["bssSysId"] = settings.sysId;
	headers["bssSign"] = MD5(settings.sysId + settings.reqTime + settings.pwd);
	headers["bssReqTime"] = settings.reqTime;

	var _callBssService = function(servName, params, callback,scope) 
	{
	
		// client can invoke remote services without any param
		// in the case of which the second param is a callback
		// function
		if (helper.isFunction(params)) {
			scope = callback;
			callback = params;
			params = null;
		}

		var context ="${CONTEXT_PATH}";
		context="http://127.0.0.1:8001/digitparty";
		var servURI = context+"/xrainbow/services/"+servName;
		
		//alert("servURI:"+servURI);
		
		var xmlhttp = helper.getXMLHttpRequest();
		xmlhttp.open(settings.method, servURI, !!callback);
			
		if(!!callback)
		{
			asyncCall(xmlhttp, headers, params, callback, scope);
		}else
		{
			return syncCall(xmlhttp, headers, params);
		}
	}
	/**
	 * 同步
	 * @author zhaoxin
	 */
	var syncCall=function(xmlhttp, headers, params)
	{		
		helper.initXMLHttpRequest(xmlhttp, headers);
		xmlhttp.send(params);
		return resultHandler(xmlhttp);
	}
	/**
	 * 异步
	 * @author zhaoxin
	 */
	var asyncCall=function(xmlhttp, headers, params, callback, scope)
	{	
		var timeoutHandler;
		helper.initXMLHttpRequest(xmlhttp, headers);
		xmlhttp.onreadystatechange  = function(){
			if (xmlhttp.readyState == 4) {
				if (xmlhttp.status == 200){
					var result = null;
					try{
						result = resultHandler(xmlhttp);
					}catch(e){
						if(e instanceof SessionExpireException){
							alert("对不起,您的登录已经失效了,请退出系统后重新登录!"); 
							location.href = e.message;
							return;
						}else
							alert('调用后台服务异常:'+e.message);
					}
					if(scope){
						callback(result,scope);
					}else{
						callback(result);
					}
				}
				xmlhttp = null;
			}
		}
		xmlhttp.send(params);
		if(settings.timeout > 0){
		  timeoutHandler = setTimeout(function(){
				if(xmlhttp){
					xmlhttp.abort();
					if(settings.timeoutHandle){
						settings.timeoutHandle();
					}
					xmlhttp = null;
				}
				clearTimeout(timeoutHandler);
			},settings.timeout);
		}
	}
	/**
	 * 对系统管理session的filter返回的信息流做特殊处理
	 */
	var sessionValidateHandler=function(xmlhttp){
		/*
		var responseText = xmlhttp.responseText;
		var regLocation = new RegExp(/reseturl=\[(.*?)\]/);
		var locStr = regLocation.exec(responseText);
		if (locStr != null) {
			throw new SessionExpireException(-1111, locStr[1]);
		} 
	    return 0;
	    */
		var loginUrl = xmlhttp.getResponseHeader("bssErrorPage");
		throw new SessionExpireException(-1111, loginUrl);
	}
	var SessionExpireException = function(code,msg){
		this.number = code;
		this.message = msg;
	}
	/**
	 * 处理返回结果。 http head中的bssRetCode表示后台返回的错误编码÷
	 * getErrorMessage()表示bssRetCode不为0的时候，返回的错误具体消息
	 * 
	 * @author zhaoxin
	 */
	var resultHandler=function(xmlhttp){
		
		var retCode = xmlhttp.getResponseHeader("bssRetCode");
		if(retCode=="-1111"){//-1111表示session失效
			sessionValidateHandler(xmlhttp);
		}		
		var retBody = "success";
		var result = {
			SUCCESS : "0",
			code : "0",
			getCode:function(){
				return this.code;
			},
			getBodyAsDom :	function(){
				retBody = xmlhttp.responseXML;
				return retBody;
			},
			getBodyAsJson : function(){
				retBody = xmlhttp.responseText;
				return JSON.parse(retBody);
			},
			getBodyAsText : function(){
				retBody = xmlhttp.responseText;
				return retBody;
			},
			getErrorMessage : function(){
				retBody = xmlhttp.responseText;
				return retBody;
			}				
		};
		result.code = retCode;
		result.body = retBody;
		return result;
	}
	return {
		/**
		 * 没有callback的时候为同步调用
		 * 比如 var result = callServiceAsJson('TestService','myname');
		 *      if(result.getCode() == result.SUCCESS){
		 *      	var json = result.getBodyAsJson();
		 *      }
		 */
		callServiceAsJson : function(servName, params, callback, scope){
			try{
				var p = JSON.stringify(params);
				return _callBssService(servName, p, callback, scope);
			}catch(e){
				if(e instanceof SessionExpireException){
					if(!callback){
						alert("对不起,您的登录已经失效了,请退出系统后重新登录1!"); 
						location.href = e.message;
					}else
						return;
				}else
					alert('调用后台json服务异常:'+e.message);
			}
		},
		callServiceAsDom : function(servName, domObj, callback, scope){
			try{
				var p = domObj.xml;
				return _callBssService(servName, p, callback, scope);
			}catch(e){
				if(e instanceof SessionExpireException){
					if(!callback){
						alert("对不起,您的登录已经失效了,请退出系统后重新登录2!"); 
						location.href = e.message;
					}else
						return;
				}else
					alert('调用后台xml服务异常:'+e.message);
			}
		},
		callServiceAsText : function(servName, textParam, callback, scope){
			try{
				return _callBssService(servName, textParam, callback, scope);
			}catch(e){
				if(e instanceof SessionExpireException){
					if(!callback){
						alert("对不起,您的登录已经失效了,请退出系统后重新登录3!"); 
						location.href = e.message;
					}else
						return;
				}else
					alert('调用后台text服务异常:'+e.message);
			}
		}
	}
};