var role_id = "";//详情站点id
$(function(){
	getIdParam();
	queryRoleDetail();
});

function getIdParam(){
	var id = $.query.get("id");
	if(id){
		var str = new String(id.replace(/\s/g, "+"), 'utf-8');
		role_id = decryptCode(str.toString());
	}
}

function saveRole(){
	var role_name = $("#role_name").val();
	if(role_name == ''){
		art.dialog({
			icon : 'error',
			time : 2,
			content : '请输入角色名称'
		});
		$("#role_name").focus();
		return false;
	}
	var role_desc = $("#role_desc").val();
	$.ajax({
		headers : {"token" : token},
		url : '/role/operate',
		data : {
			role_id : role_id,
			role_name : role_name,
			role_desc : role_desc
		},
		type : 'post',
		success : function(resp){
			if(resp.success){
				art.dialog({
					icon : 'succeed',
					time : 2,
					content : resp.msg
				});
			} else if(resp.code == 1006){
				window.location.href="login.html";
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

function queryRoleDetail(){
	if(role_id == null){
		return;
	}
	$.ajax({
		headers : {"token" : token},
		url : '/role/detail',
		data : {
			role_id : role_id
		},
		type : 'post',
		success : function(resp){
			if(resp.success){
				var data = resp.data;
				$("#role_name").val(data.roleName);
				$("#role_desc").val(data.roleDesc);
			} else if(resp.code == 1006){
				window.location.href="login.html";
			}
		}
	})
}