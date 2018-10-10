/**
 * 退出登录
 * @returns
 */
function loginout(){
	$.ajax({
		headers:{"token":token},
		url : '/manage/logout',
		data : {},
		type : 'post',
		success : function(data){
			if(data.success){
				localStorage.removeItem('access_yzyz_token');
				localStorage.removeItem('loginName');
				setTimeout(function(){
					window.location.href='login.html';
				},2000);
			}else if(data.code == 1006){
				window.location.href='login.html';
			}else{
				art.dialog({
					icon : 'error',
					time : 2,
					content : data.msg
				});
			}
		}
	});
}