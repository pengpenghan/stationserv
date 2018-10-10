var user_id = "";//角色id
var role_id = "";

$(function(){
	getParamId();
	queryRoleList();
	queryUserDetail();
});

function getParamId(){
	var id = $.query.get("id");
	if(id){
		var str = new String(id.replace(/\s/g, "+"), 'utf-8');
		user_id = decryptCode(str.toString());
	}
}

function operateUser() {
	var user_name = $("#user_name").val();
	if (user_name == '') {
		art.dialog({
			icon : 'warning',
			time : 2,
			content : "用户名不能为空"
		});
		$("#user_name").focus();
		return false;
	}
	
	var real_name = $("#real_name").val();
	if (real_name == '') {
		art.dialog({
			icon : 'warning',
			time : 2,
			content : "真实姓名不能为空"
		});
		$("#real_name").focus();
		return false;
	}
	
	var user_pwd = $("#user_pwd").val();
	if (user_pwd == '') {
		art.dialog({
			icon : 'warning',
			time : 2,
			content : "用户登录密码不能为空"
		});
		$("#user_pwd").focus();
		return false;
	}
	
	if(user_pwd == '********'){
		user_pwd = '';
	}

	var role_id = $("#role_list").val();
	if (role_id == '-1') {
		art.dialog({
			icon : 'warning',
			time : 2,
			content : "请选择所属角色"
		});
		$("#role_id").focus();
		return false;
	}
	var datas = {
		user_id : user_id,
		user_name : user_name,
		real_name : real_name,
		user_pwd : user_pwd,
		role_id : role_id
	};
	$.ajax({
		headers : {"token" : token},
		url : "/user/operate",
		type : 'post',
		data : datas,
		success : function(resp) {
			if (resp.success) {
				art.dialog({
					icon : 'succeed',
					time : 2,
					content : resp.msg
				});
			} else if(resp.code == 1006){
				window.location.href = "login.html";
			} else {
				art.dialog({
					icon : 'warning',
					time : 2,
					content : resp.msg
				});
			}
		}
	});
}

function queryUserDetail() {
	if(user_id == ""){
		return;
	}
	$.ajax({
		headers : {"token" : token},
		url : "/user/detail",
		type : 'post',
		data : {
			user_id : user_id
		},
		async: false,
		success : function(resp) {
			if (resp.success) {
				var data = resp.data;
				$("#user_name").val(data.userName);
				$("#real_name").val(data.realName);
				$("#user_pwd").val("********");
				$("#id").val(data.id);
				role_id = data.role.id;
			} else if(resp.code == 1006){
				window.location.href = "login.html";
			} else {
				art.dialog({
					icon : 'error',
					time : 2,
					content : resp.msg
				});
			}
		}
	});
};

function queryRoleList() {
	$.ajax({
		headers : {"token" : token},
		url : "/role/list",
		type : 'post',
		data : {},
		dataType : "json",
		success : function(resp) {
			if (resp.success) {
				var list = resp.data;
				$("#role_list").empty();
				$("#role_list").append('<option value="-1">--请选择--</option>');
				$.each(list,function(i,data){
					if(data.id == role_id){
						$("#role_list").append('<option selected="selected" value="' + data.id 
								+'">' + data.roleName + '</option>');
					} else {
						$("#role_list").append('<option value="' + data.id 
								+'">' + data.roleName + '</option>');
					}
				});
			} else if(resp.code == 1006){
				window.location.href = "login.html";
			} else {
				art.dialog({
					icon : 'error',
					time : 2,
					content : resp.msg
				});
			}
		}
	});
}