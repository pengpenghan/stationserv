//上传图片

function uploadFile(obj,id){
	var objUrl = getObjectURL(obj.files[0])
	var path = $("#file").val();
	var ext = path.substring(path.lastIndexOf(".")+1);//获取后缀名称
	//判断图片类型  暂时支持 jpg png jpeg 
	if("jpg" != ext && "png" != ext && "jpeg" != ext){
		art.dialog({
			icon : 'error',
			time : 2,
			content : "图片文件格式有误,请上传正确图片文件"
		});
		return;
	}
	$("#uploadForm").ajaxSubmit({
		headers : {"token":token},
		url : "/manage/file/upload",
		type : "post",
		dataType : "json",
		success : function(resp) {
			console.log(resp);
			if(resp.success){
				var data = decryptCode(resp.data);
				data = eval('('+data+')');
				$("#"+id).empty();
				$("#"+id).css("display","");
				$("#"+id).append('<img onclick="openPic(this)" src="'+objUrl+'" style="width:100px;height:100%;margin-left:10px;" />');
				$("#"+id).append('<input type="hidden" value='+data.path+' />');
			}else if(resp.code == 1006){
				window.location.href="login.html";
			} else {
				art.dialog({
					icon : 'error',
					time : 2,
					content : data.msg
				});
			}
		}
	});
}

//上传图片

function uploadFile_dl(obj,id,file_id){
	var objUrl = getObjectURL(obj.files[0])
	var path = $("#" + file_id).val();
	var ext = path.substring(path.lastIndexOf(".")+1);//获取后缀名称
	//判断图片类型  暂时支持 jpg png jpeg 
	if("jpg" != ext && "png" != ext && "jpeg" != ext){
		art.dialog({
			icon : 'error',
			time : 2,
			content : "图片文件格式有误,请上传正确图片文件"
		});
		return;
	}
	$("#uploadForm").ajaxSubmit({
		url : "/manager/file/upload",
		type : "post",
		dataType : "json",
		success : function(resp) {
			var data = decryptCode(resp.data);
			data = eval('('+data+')');
			$("#"+id).empty();
			$("#"+id).css("display","");
			$("#"+id).append('<img onclick="openPic(this)" src="'+objUrl+'" style="width:100px;height:100%;margin-left:10px;" />');
			$("#"+id).append('<input type="hidden" value='+data.path+' />');
		}
	});
}

//建立一個可存取到該file的url
function getObjectURL(file) {
	var url = null ;
	if (window.createObjectURL!=undefined) { // basic
		url = window.createObjectURL(file) ;
	} else if (window.URL!=undefined) { // mozilla(firefox)
		url = window.URL.createObjectURL(file) ;
	} else if (window.webkitURL!=undefined) { // webkit or chrome
		url = window.webkitURL.createObjectURL(file) ;
	}
	return url ;
}

