$(function(){
	queryStationList();
});

/**
 * 站点列表
 */
function queryStationList() {
	$("#sample-table-1").dataTable({
		ajax : {
			type : 'post',
			url : '/station/page/list',
			data : {
				
			}
		},
		autoWidth : false,
		bServerSide : true,
		bPaginate : true,
		bLengthChange : false,
		iDisplayLength : 12,
		processing : true,
		searching : false,
		info : false,
		ordering : false,
		paging : true,
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
						var r = "-";
						if (null == row.mainName
								|| "" == row.mainName) {
							r = "-";
						} else {
							r = row.mainName;
						}
						return r;
					},
				},
				{
					render : function(data, type, row, meta) {
						var r = "-";
						if (null == row.longitude
								|| "" == row.longitude) {
							r = "-";
						} else {
							r = row.longitude;
						}
						return r;
					},
				},
				{
					render : function(data, type, row, meta) {
						var r = "-";
						if (null == row.latitude
								|| "" == row.latitude) {
							r = "-";
						} else {
							r = row.latitude;
						}
						return r;
					},
				},
				{
					render : function(data, type, row, meta) {
						var r = "-";
						if (null == row.address
								|| "" == row.address) {
							r = "-";
						} else {
							r = row.address;
						}
						return r;
					},
				},
				{
					render : function(data, type, row, meta) {
						var r = "-";
						if (null == row.describe
								|| "" == row.describe) {
							r = "-";
						} else {
							r = row.describe;
						}
						return r;
					},
				},
				{
					render : function(data, type, row, meta) {
						return '<a href="operateStation.html?id='+encryptStr(row.id)+'" ><i class="icon-list-alt" title="详情" style="font-size:16px;"></i></a>';
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

/**
 * 根据条件查询
 */
function queryStation() {
	var oSettings = $("#sample-table-1").dataTable().fnSettings();
	oSettings.ajax.data.stationName = $.trim($("#stationName").val());
	//oSettings._iDisplayLength = 50;动态设置一页显示码数
	$("#sample-table-1").dataTable().fnDraw(oSettings);
}

function deleteStation(){
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
				url : '/station/delete',
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
