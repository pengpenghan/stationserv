function selectAllCheck(chk, name){
     var b_flag=false;
     if(chk.checked){
       b_flag=true;
     }else{
       b_flag=false;
     }
     var obj=document.getElementsByName(name);
     if( obj.length )
     {
	     for(iIndex=0;iIndex<obj.length;iIndex++)
	     {
	         if(!obj[iIndex].disabled){
	        	obj[iIndex].checked=b_flag; }
	     }
     }
     else
     {
     	    if(!obj.disabled){
     	    	obj.checked = b_flag;
     	    }
     }
}

function delOther(url){
	var checkBoxArray = document.getElementsByName("selecteditems");
	var isChecked = false;
	var string = "";
	for (i = 0; i < checkBoxArray.length; i++) {
		if (checkBoxArray[i].checked) {
			isChecked = true;
			string += checkBoxArray[i].value + ",";
		}
	}
	string = string.substring(0, string.length - 1);

	if (isChecked == false) {
		art.dialog({
			icon : 'error',
			time : 2,
			content : "请选择需要删除的记录"
		});
		return;
	}

	art.dialog({
		icon : 'warning',
		content : "确定要删除该记录吗",
		cancelVal:'关闭',
		cancel:true,
		okVal: '确定',
		ok:function(){
			var datas=encryptCode({
				params : JSON.stringify({
					"ids" : string
				})
			});
			$.ajax({
				headers:{"token":token},
				url:url,
				type:"post",
				data:datas,
				success:function(resp){
					if(resp.success){
						art.dialog({
							icon : 'succeed',
							time : 2,
							content : resp.msg
						});
					}else{
						art.dialog({
							icon : 'error',
							time : 2,
							content : resp.msg
						});
					}
					setTimeout(function(){query()},2000);
				}
			});
		}
	});
}