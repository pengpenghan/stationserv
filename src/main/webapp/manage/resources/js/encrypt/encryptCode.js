var Md5Class = new Md5Class();
function encryptAes() {
	var publicKey = 'abcdefgabcdefg13', publicIv = 'abcdefgabcdefg11';
	var key = CryptoJS.enc.Utf8.parse(publicKey), iv = CryptoJS.enc.Utf8
			.parse(publicIv);
	// public method for encoding
	this.encode = function(input) {
		var data = CryptoJS.enc.Utf8.parse(input);
		var encrypted = CryptoJS.AES.encrypt(data, key, {
			iv : iv,
			mode : CryptoJS.mode.CBC,
			padding : CryptoJS.pad.Pkcs7
		});
		return encrypted.toString();
	};

	// public method for decoding
	this.decode = function(input) {
		var data = input;
		var decrypted = CryptoJS.AES.decrypt(data, key, {
			iv : iv,
			mode : CryptoJS.mode.CBC,
			padding : CryptoJS.pad.Pkcs7
		});
		return decrypted.toString(CryptoJS.enc.Utf8);
	}

	this.getStamp = function() {
		return (new Date()).valueOf().toString()
				+ Math.floor(Math.random() * 90000 + 10000).toString();
	}
}

/**
 * 加密(ajax)
 * @param jsonEncrypt 需要加密的对象
 * @returns {{}}
 */
function encryptCode(jsonEncrypt) {
	var encrypt = new encryptAes();
	var obj = {}, sign = '', j = 0, value = 1, timestamp = encrypt.getStamp();
	//合并对象
	jsonEncrypt.encryptFlag = value, jsonEncrypt.timestamp = timestamp;
	var objArr = new Array();
    $.each(jsonEncrypt, function(i) {
    	objArr.push(i); //获取键值
    });
    //对象键排序
    objArr.sort();
	//var objTemp = Object.assign({}, jsonEncrypt);
	//对象键排序
	//var objArr = Object.keys(objTemp).sort();
	for ( var i = 0; i < objArr.length; i++) {
		if (jsonEncrypt.hasOwnProperty(objArr[i])) {
			//加密
			if (i == 0) {
				sign += objArr[i] + '=' + jsonEncrypt[objArr[i]];
			} else {
				if ($.isArray(jsonEncrypt[objArr[i]])) {
					obj[objArr[i]] = new Array();
					var st = jsonEncrypt[objArr[i]].join('');
					sign += '&' + objArr[i] + '[]=' + st;
					for ( var n = 0; n < jsonEncrypt[objArr[i]].length; n++) {
						obj[objArr[i]].push(jsonEncrypt[objArr[i]][n]);
					}
				} else {
					sign += '&' + objArr[i] + '=' + jsonEncrypt[objArr[i]];
				}
			}

			if ($.isArray(obj[objArr[i]])) {
				for ( var j = 0; j < obj[objArr[i]].length; j++) {
					obj[objArr[i]][j] = encrypt
							.encode(jsonEncrypt[objArr[i]][j]);
				}
			} else {
				obj[objArr[i]] = encrypt.encode(jsonEncrypt[objArr[i]]);
			}
		}
	}
	obj['sign'] = Md5Class.md5(sign);
	return obj;
}

/**
 * 解密
 * @param data
 */
function decryptCode(data) {
	var encrypt = new encryptAes();
	return encrypt.decode(data);
}

/**
 * 加密字符串
 * @param dataStr
 */
function encryptStr(dataStr) {
	var encrypt = new encryptAes();
	return encrypt.encode(dataStr);
}

/***
 * 格式化请求参数
 * @param str
 * @returns {Object}
 */
function parseQueryString(str) {
	var theRequest = new Object();
	strs = str.split("&");
	for ( var i = 0; i < strs.length; i++) {
		if (theRequest.hasOwnProperty(strs[i].split("=")[0])) {
			//存在相同key
			var value = theRequest[strs[i].split("=")[0]] + ","
					+ (strs[i].split("=")[1]);
			theRequest[strs[i].split("=")[0]] = value.split(",");
		} else {
			theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
		}
	}
	return theRequest;
}

$.ajaxSetup({
	//设置ajax请求结束后的执行动作
	complete : function(XMLHttpRequest, textStatus) {
		// 通过XMLHttpRequest取得响应头，sessionstatus
		var sessionstatus = XMLHttpRequest
				.getResponseHeader("sessionstatus");
		if (sessionstatus == "TIMEOUT") {
			var win = window;
			while (win != win.top) {
				win = win.top;
			}
			win.location.href = XMLHttpRequest
					.getResponseHeader("CONTEXTPATH");
		}
	}
});