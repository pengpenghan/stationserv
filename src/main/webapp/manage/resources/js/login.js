var num = 0;

$(function(){
	$("#userName").focus();
	//syncTime();//同步服务器与本地电脑时间
});

function chgUrl(url) {
	var timestamp = (new Date()).valueOf();
	url = url.substring(0, 17);
	if ((url.indexOf("&") >= 0)) {
		url = url + "×tamp=" + timestamp;
	} else {
		url = url + "?timest=" + timestamp;
	}
	return url;
}
function changeImg() {
	var imgSrc = $("#imgObj");
	var src = imgSrc.attr("src");
	imgSrc.attr("src", chgUrl(src));
	$("#code").val("");
}

function dologin() {
	var userName = $("#userName").val();

	if (userName == '') {
		$("#userName").focus();
		art.dialog({
			icon : 'warning',
			time : 1,
			content : "用户名不能为空"
		});
		return false;
	}
	var password = $("#password").val();
	if (password == '') {
		$("#password").focus();
		art.dialog({
			icon : 'warning',
			time : 2,
			content : "用户登录密码不能为空"
		});
		return false;
	}
	var verifyCode = $("#verifyCode").val();
	$("#verif").show();
	if (verifyCode == '') {
		$("#verifyCode").focus();
		art.dialog({
			icon : 'warning',
			time : 1,
			content : "验证码不能为空"
		});
		return false;
	}
	
	var datas = encryptCode({
		params:JSON.stringify({
			password : password,
			verifyCode : verifyCode,
			userName : userName
		})
	});
	$.ajax({
		url : "/manage/logining",
		type : 'post',
		data : datas,
		dataType : "json",
		success : function(data) {
			if (data.success) {
				 var storage=window.localStorage;
				 var curTime = new Date().getTime();
		         storage.setItem("access_token",data.data.access_token);
		         storage.setItem("loginName",data.data.loginName);
		         sessionStorage.setItem('access_time', curTime);
		         window.location.href="index.html";
			} else {
				art.dialog({
					icon : 'warning',
					time : 2,
					content : data.msg
				});
				changeImg();
				$("#verifyCode").val("");
			}
		}
	});

}

/**
 * 获取服务器时间同步本地计算机时间
 */
function syncTime(){
	$.ajax({
		url : "/syncTime",
		type : 'post',
		data : {},
		success : function(data) {}
	});
}

$(document).keyup(function(event){
	if(event.keyCode == 13){
		dologin();
	}
});