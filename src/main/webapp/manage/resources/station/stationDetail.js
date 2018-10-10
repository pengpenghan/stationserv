var station_id = "";//详情站点id
$(function(){
	getIdParam();
	queryStationDetail();
});

function getIdParam(){
	var id = $.query.get("id");
	if(id){
		var str = new String(id.replace(/\s/g, "+"), 'utf-8');
		station_id = decryptCode(str.toString());
	}
}

function saveStation(){
	var main_name = $("#main_name").val();
	if('' == main_name){
		art.dialog({
			icon : 'error',
			time : 2,
			content : '请输入站点名称！'
		});
		$("#main_name").focus();
		return false;
	}
	var prepare_name = $("#prepare_name").val();
	var re = /^[0-9]+.?[0-9]*/;//判断字符串是否为数字
	var longitude = $("#longitude").val();
	if(longitude == ''){
		art.dialog({
			icon : 'error',
			time : 2,
			content : '请输入经度！'
		});
		$("#longitude").focus();
		return false;
	} else if(isNaN(longitude)){
		art.dialog({
			icon : 'error',
			time : 2,
			content : '请输入经度的正确格式！'
		});
		$("#longitude").focus();
		return false;
	}
	var latitude = $("#latitude").val();
	if(latitude == ''){
		art.dialog({
			icon : 'error',
			time : 2,
			content : '请输入纬度！'
		});
		$("#latitude").focus();
		return false;
	} else if(isNaN(latitude)){
		art.dialog({
			icon : 'error',
			time : 2,
			content : '请输入纬度的正确格式！'
		});
		$("#latitude").focus();
		return false;
	}
	var address = $("#address").val();
	var remarks = $("#remarks").val();
	var photo = "";
	$("#imgs input").each(function(i,e){
		photo = $(this).val();
	});
	var status = $("input[name='status']:checked").val();
	$.ajax({
		headers:{"token":token},
		url : '/station/operate',
		data : {
			station_id : station_id,
			photo : photo,
			main_name : main_name,
			prepare_name : prepare_name,
			longitude : longitude,
			latitude : latitude,
			address : address,
			remarks : remarks,
			status : status
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

function queryStationDetail(){
	if (station_id == null) {
		return;
	}
	$.ajax({
		headers:{"token":token},
		url:"/station/detail",
		data:{
			"station_id" : station_id
		},
		type : 'post',
		success:function(resp){
			if (resp.success) {
				var data = resp.data;
				$("#main_name").val(data.mainName);
				$("#prepare_name").val(data.prepareName);
				$("#longitude").val(data.longitude);
				$("#latitude").val(data.latitude);
				$("#address").val(data.address);
				$("#remarks").val(data.remarks);
				$("#imgs").empty();
				if(data.logoUrl){
					$("#imgs").css('display','block');
					$("#imgs").append('<img onclick="openPic(this)" src="'+img_url + data.logoUrl+'" style="width:100px;height:100%;margin-left:10px;" />');
					$("#imgs").append('<input type="hidden" value='+data.logoUrl+' />');
				}
				$("input[name='status'][value='"+data.status+"']").attr('checked',true);
			}else if(resp.code == 1006){
				window.location.href="login.html";
			}
		}
	});
}