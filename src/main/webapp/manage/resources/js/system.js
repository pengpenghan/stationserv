
/*
	得到topFrame中form1窗体中指定元素的值
*/
function getTopFrameValue(el)
{
	var tf = parent.frames["topFrame"];
	if( tf )
	{
		var frm = tf.form1;
		if( frm )
		{
			var ctrl = frm.elements[el];
			if( ctrl )
			{
				return ctrl.value;
			}
		}
	}
	return ""; 
}


/**
	设置离开保存标识
**/
function setExitConfirmFlag(bConfirm  /*1 or 0*/)
{
	parent.frames["topFrame"].form1.exitconfirm.value=bConfirm;		
}

/*
	设置离开保存提示标识
*/
function set_exit_confirm(contextPath, url, target)
{
	if( "1" == getTopFrameValue("exitconfirm") )
	{
		if( confirm("在离开当前页面前，请确认数据已经保存，是否要离开当前页面？") )
		{
			parent.frames[target].location.replace(contextPath + url);
			return false;
		}
		else
		{
			return false;
		}
	}
	setExitConfirmFlag("1");		
	parent.frames[target].location.replace(contextPath + url);
	return false;
	
}
	
/**
	打开页面时检查数据是否保存
**/
function exit_confirm(contextPath, url, target)
{
	if( "1" == getTopFrameValue("exitconfirm") && "mainFrame" == target )
	{
		if( confirm("在离开当前页面前，请确认数据已经保存，是否要离开当前页面？") )
		{
			setExitConfirmFlag("0");
			parent.frames[target].location.replace(contextPath + url);
			return false;
		}
	}
	else
	{
		parent.frames[target].location.replace(contextPath + url);
	}
	return false;
}


/**
	根据给定的json字符串生成javascript对象
	@param json字符串
	@return  javascript对象
**/
function parseJsonString(json)
{
	return eval('(' + json + ')');
}

/**
	打开模态对话框
	@param url 打开URL，相对于跟目录，以 / 开头
	@param wd 对话框宽度
	@param ht 对话框高度
	@return 对话框返回值
**/
function showDialog(url, wd, ht)
{
	var winFeatures = "";
	if( wd && ht )
	{	
		winFeatures = "dialogHeight:" + ht + "px; dialogWidth:" + wd + "px;status:no; help:no; scroll:no";
	}
	return window.showModalDialog(getContextPath() + url,"", winFeatures);
}

/*
	错误信息对话框
	@param 错误信息
*/
function showErrorDialog(title)
{
	var w = 180 + title.length * 4;
	showDialog("/framework/common/dialog_info.jsp?type=dialog_err&title=" + title,w,130);
}

/*
	提示信息信息对话框
	@param 错误信息
*/
function showTipDialog(title)
{
	var w = 180 + title.length * 4;
	showDialog("/framework/common/dialog_info.jsp?type=dialog_exc&title=" + title,w,130);
}

/*
	confirm替换对话框
	@param 确认信息
*/
function confirm2(title)
{
	var w = 240 + title.length * 4;
	return showDialog("/framework/common/dialog_dbl.jsp?type=dialog_quest&title=" + title,w,130);	
}

/**
	公司选择
**/
function selectOneCompany()
{
	return showDialog("/base/base_company/selectonecompany.dlg?actionName=doPage", 600,550);
}

/**
	部门选择
**/
function selectOneDepartment()
{
	return showDialog("/base/base_department/selectonedepartment.dlg?actionName=doPage", 600,550);
}

/**
	账户选择
**/
function selectOneUser()
{
	return showDialog("/base/base_user/selectoneuser.dlg?actionName=doPage", 600,550);
}

/*
	显示进度或提示栏
*/
function showTip(dTip){
		if(typeof(progressMask)=="undefined"){
			var objStr="<div id=\"progressMask\" class=\"progressMask\"></div>";
			var newobj=document.createElement(objStr);
			document.body.insertBefore(newobj);
		}
		progressMask.innerHTML="";
		progressMask.style.display="block";
		dTip.style.display="block";	
		dTip.style.left=(document.body.clientWidth-dTip.clientWidth)/2;
		dTip.style.top=(document.body.clientHeight-dTip.clientHeight)/2;
	}

/*
	关闭进度或提示栏
*/
function hideTip(dTip){
	progressMask.style.display="none";
	if(typeof(dTip)!="undefined"){
		dTip.style.display="none";
	}
}

function showHelp(id)
{
	var feature = "'height=600, width=700, top=50, left=150, toolbar=no, menubar=no, scrollbars=yes, resizable=yes,location=n o, status=no'";
	window.open(getContextPath() + "/framework/common/help/help.jsp?id=" + id, "帮助系统", feature);
	return false;
}

/**
	选择对话框
	@param frm 当前Form
	@param name 目标输入框名称
	@param dialogId 查询页面编码
	@param w  对话框宽度
	@param h  对话框高度
**/
function selectDialog(frm, name, dialogId, w, h)
{
    		var ret = showDialog('page.dlg?actionName=doPage&id=' + dialogId,w,h);
    		if(typeof ret == "string" && ret == "-1")
    		{
    			frm.elements[name + "_label"].value = "";
    			frm.elements[name].value = "";
    		}
    		else if( ret )
    		{
    			frm.elements[name + "_label"].value = ret.returnlabel;
    			frm.elements[name].value = ret.returnid;
    		}
}

/**
	判断用户是否选择了记录
**/
function selectSomeThing(ret)
{
	if( typeof ret == "undefined" )
	{
		return false;
	}
	if(typeof ret == "string" && ret == "-1")
	{
		return false;
	}
	if( ret != null )
	{
		return true;
	}
	else
	{
		return false;
	}
}
function userSelect4Wf(bizMethod)
{
	return showDialog("/sychworkflow_jsps/console/userselect.dlg?actionName=doInit&wf_bizmethod=" + bizMethod, 600,550);
}

function __queryClose()
{
	event.returnValue = "如果数据未保存，更改数据可能会丢失";
}

function queryClose()
{
	window.attachEvent("onbeforeunload", __queryClose);
}


function selectDp(dpId,itemValue) {
   for(var index=0;index<dpId.options.length;index++)
    {
       if( dpId.options[index].value == itemValue )
       {
          dpId.selectedIndex=index;
          break;
       }
    }
}


/**
	获取同名radio被选择项的值
**/
function getRadioValue(objName)
{
	var obj = document.getElementsByName("objName");
	var ret_val = "";
	for(i=0; i<obj.length; i++)
		{
			if(obj[i].checked)
			{
				ret_val = obj[i].value;
				break;
			}
		}
	return ret_val;
}

/**
	Reset FCK
**/
function resetFCK(oEditor,oContent)
{
	var oEditor = FCKeditorAPI.GetInstance(oEditor);
	if(oEditor.IsDirty()){
		oEditor.SetHTML(oContent);
	}
}

/**
	swap_card
**/
var LastItem = null;
function DoSwap(obj)
{
	if(LastItem != null)
	{
		LastItem.className = "";
	}
	obj.className = "checked";
	LastItem = obj;
	obj.blur();
}

/**
	预载图片
**/
function preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.p) d.p=new Array();
    var i,j=d.p.length,a=preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.p[j]=new Image; d.p[j++].src=a[i];}}
}

/**
	输入框有效性限制(两位小数的正数)
**/
function isTriDecimal(value){
if(value!=null&&value!=''){
    var decimalIndex=value.indexOf('.');
    if(decimalIndex=='-1'){
            return false;
        }else{
            var decimalPart=value.substring(decimalIndex+1,value.length);
            if(decimalPart.length>2){
                return true;
            }else{
                return false;
            }
        }
    }
    return false;
}

/**
	输入框有效性限制(正整数)
**/
function isInteger(obj){
	obj.value = obj.value.replace(/[^0-9]\D*$/,'');
	obj.value = Number(obj.value);
	if(obj.value <= 0){
		obj.value = "";
		obj.focus();
		return false;
	}
}

/**
	替换所有指定字符串（原字符串，指定字符串，目标字符串）
**/
function replaceAll(str, sptr, sptr1)
	{
	while (str.indexOf(sptr) >= 0)
	{
	   str = str.replace(sptr, sptr1);
	}
	return str;
}

/**
	图片预览及合法性检测
**/
function imgcheck(){
　var x = document.getElementById("imgfile");
　var y = document.getElementById("img");
　if(x.value.length==0){
　　document.getElementById("img_ok").value = "true";
　　if(y){
　　　document.getElementById("showpre").removeChild(y);
　　}
　}else{
　　if(!x || !x.value) return;
　　var patn = /\.jpg$|\.jpeg$|\.gif$|\.png$|\.bmp$/i;
　　if(patn.test(x.value)){
　　　document.getElementById("img_ok").value = "true";
　　　if(y){
　　　　y.src = x.value;
　　　}else{
　　　 if(!this.img){
　　　 	this.img=document.createElement("img");
　　　 	img.src = x.value;
　　　 	img.width = 110;
　　　 	img.height = 80;
　　　 	img.id = "img";
　　　 	document.getElementById("showpre").appendChild(img);
　　　 }else{
　　　 	img.src = x.value;
　　　 }
　　　}
　　}else{
　　　document.getElementById("img_ok").value = "false";
　　　if(y){
　　　　y.src = x.value;
　　　}
　　　alert("请选择正确的图像文件！");
　　　}
　　}
}

/**
	屏蔽鼠标右键
**/
/*document.oncontextmenu = function (){
	return false;
}*/

/**
	监听键盘事件
**/
document.onkeydown = function ()
{
	//监听回车键
	if( window.event.keyCode == 13 )
	{
		if(document.activeElement.tagName == "pagegoto"){
			var index = document.getElementById("pagegoto").value;
			var max = document.getElementById("pageCount").value;
			var gotoIndex = parseInt(index);
			var pageCount = parseInt(max);
			if( index !=""&&!isNaN(gotoIndex)&&gotoIndex>0&&gotoIndex<=pageCount )
			{
				doPageByIndex(gotoIndex);
			}
		}
	}
	//监听F5键
	else if( window.event.keyCode == 116 )
	{
		event.keyCode = 0;
		event.cancelBubble = true;
		return false;
	}
}

function getCurrentPageURL(){//返回URL
//	var returnTopURL="";//这里的URL是返回到顶端的URL
//	var pageURLParam="";
	var url=document.location.href;
	return url;
	}
	function getCurrentPangURLparam(){//返回URL参数
	return window.location.search;
}