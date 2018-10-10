$(function() {
	queryRoleList();
	queryUserList();
});

function queryUserList(){
	$("#sample-table-1").dataTable().fnClearTable();
	$("#sample-table-1").dataTable().fnDestroy();
	$("#sample-table-1").dataTable({
		ajax : {
			type : 'post',
			url : '/user/page/list',
			data : {}
		},
		autoWidth : false,
		bServerSide : true,
		bPaginate : true,
		bLengthChange : false,
		iDisplayLength : 10,
		processing : true,
		searching : false,
		info : false,
		ordering : false,
		columns : [
				{
					render : function(data, type, row, meta) {
						var r = "-";
						if (null == row.id
								|| "" == row.id) {
							r = "-";
						} else {
							r = row.id;
						}
						return '<input type="checkbox" name="selecteditems" value="'
								+ r + '" />';
					},
				},   
				{
					render : function(data, type, row, meta) {
						return meta.row + 1;
					},
				},

				{
					render : function(data, type, row, meta) {
						return "<span>" + row.userName
								+ "</span>";
					},
				},
				{
					render : function(data, type, row, meta) {
						return "<span>" + row.realName
								+ "</span>";
					},
				},

				{
					render : function(data, type, row, meta) {
						if (null == row.role.roleName) {
							return "<span> - </span>";
						} else {
							return "<span>" + row.role.roleName
									+ "</span>";
						}

					},
				},
				{
					render : function(data, type, row, meta) {
						if (row.status == 0) {
							return "<span>正常</span>";
						} else if (row.status == 1) {
							return "<span class=\"color_2\">禁用</span>";
						}
					},
				},
				{
					render : function(data, type, row, meta) {
						var r = "-";
						if (null == row.createTime
								|| "" == row.createTime) {
							r = "-";
						} else {
							r = row.createTime;
						}
						return r;
					},
				},
				{
					render : function(data, type, row, meta) {
						return '<a href="operateUser.html?id='+encryptStr(row.id)+'" ><i class="icon-list-alt" title="详情" style="font-size:16px;"></i></a>';
					},
				}],
		language : {
			emptyTable : '暂无数据',
			processing : '查询中',
			paginate : {
				previous : '上一页',
				next : '下一页'
			}
		}
	});
}

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
				$("#role_id").empty();
				$("#role_id").append('<option value="-1">--请选择--</option>');
				$.each(list,function(i,data){
					$("#role_id").append('<option value="' + data.id 
							+'">' + data.roleName + '</option>');
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

function query() {
	var oSettings = $("#sample-table-1").dataTable().fnSettings();
	oSettings.ajax.data.user_name = $("#user_name").val();
	oSettings.ajax.data.role_id = $("#role_id").val();
	$("#sample-table-1").dataTable().fnDraw(oSettings);
}

function deleteUser(){
	var deleteIds = new Array();
	$.each($("input:checkbox:checked"),function(i,data){
		deleteIds.push($(this).attr("value")) ;
	});
	
	if(deleteIds.length == 0){
		art.dialog({
			icon : 'error',
			time : 2,
			content : '请选择要删除的文件！'
		});
		return false;
	}
	art.dialog({
		icon : 'warning',
		content : "确定要删除该记录吗",
		cancelVal:'关闭',
		cancel:true,
		okVal: '确定',
		ok:function(){
			$.ajax({
				headers:{"token":token},
				url : '/user/delete',
				type : 'post',
				data : {
					ids : deleteIds.join(',')
				},
				success : function(data){
					if(data.success){
						art.dialog({
							icon : 'succeed',
							time : 2,
							content : data.msg
						});
						setTimeout(function(){
							$('#sample-table-1').DataTable().ajax.reload(); 
						},2000);
					}else if(data.code == 1006){
						window.location.href="login.html";
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
	});
}