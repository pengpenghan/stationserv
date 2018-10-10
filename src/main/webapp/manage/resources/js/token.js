/**
 * 获取登录信息
 */
var token = null;
/**
 * 登录名称
 */
var loginName = null;

var img_url = "http://local.upbest-china.com:10022/uploadFile/img/";

$(document).ready(function(){
	token = localStorage.getItem("access_token");
	//判断后台是否在运行中
	$.ajax({
		headers : {"token":token},
		url : '/manage/validate/token',
		data : {},
		type : 'post',
		success : function(resp){
			if(!resp.success){
				window.location.href="login.html";
			}
		}
	})
	loginName = localStorage.getItem("loginName");
	if(token == "" || token == null || token == undefined){
		window.location.href="login.html";
	}
	var time  = sessionStorage.getItem('access_time');
	
	//token时间大于30分钟失效
	if (new Date().getTime() - time > 1000 * 1800) {
		window.location.href="login.html";
    }
	$("#loginName").text(loginName);
});
