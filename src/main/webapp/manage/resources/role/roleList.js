// 初始查询
$(function() {
	getRoleList();
});

function getRoleList(){
	$("#sample-table-1").dataTable({
		ajax : {
			type : 'post',
			url : '/role/page/list',
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
						return "<span>" + row.roleName
								+ "</span>";
					},
				},
				{
					render : function(data, type, row, meta) {
						if (null == row.roleDesc) {
							return "<span> - </span>";
						} else {
							return "<span>" + row.roleDesc
									+ "</span>";
						}

					},
				},
				{
					render : function(data, type, row, meta) {
						return "<span>" + row.createTime
								+ "</span>";
					},
				},
				{
					render : function(data, type, row, meta) {
						return '<a href="operateRole.html?id='+encryptStr(row.id)+'" ><i class="icon-list-alt" title="详情" style="font-size:16px;"></i></a>';
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

// 根据角色名称查询
function query() {
	var oSettings = $("#sample-table-1").dataTable().fnSettings();
	oSettings.ajax.data.role_name = $("#role_name").val();
	$("#sample-table-1").dataTable().fnDraw(oSettings);
}

function deleteRole(){
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
				url : '/role/delete',
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