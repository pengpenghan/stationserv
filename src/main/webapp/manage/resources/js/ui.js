//载入常用控件
//try{
//	loadCJfile('resources/skin_default/js/ymPrompt/skin/black/ymPrompt.css','css','ymSkinCss');
//	loadCJfile('resources/skin_default/js/ymPrompt/ymPrompt.js','js','ymJS');
//	loadCJfile('resources/skin_default/js/My97DatePicker/WdatePicker.js','js','WdatePickerJS');
//}catch(e){
//	alert("控件载入失败！");
//}
/*导航TAB相关*/
var LastItem = null;
function doCheckNavBtn(obj)
{
	if(obj != null){
		if(LastItem != null)
		{
			LastItem.className = "";
		}
		obj.className = "checked";
		LastItem = obj;
		obj.blur();
	}
}
function checkNavBtnA(objName)
{
	var as = document.getElementsByName(objName);
	for(var i=0;i<as.length;i++){
		if(as[i].className=="checked"){
			LastItem = as[i];
		}
	}
}

/*菜单搜索框提示*/
function checkLeftSearchTip(obj,state){
	if(state == "show"){
		if(obj.value == ""){
			obj.value = "请输入菜单名称，回车确定";
		}
	}else if(state == "hide"){
		if(obj.value == "请输入菜单名称，回车确定"){
			obj.value = "";
		}
	}
}

/*获取页面可视区域高度*/
function getPageViewHeight() { 
    var height = 0; 
    if (window.innerHeight) { 
        height = window.innerHeight; 
    } else if (document.documentElement && document.documentElement.clientHeight) { 
        height = document.documentElement.clientHeight; 
    } else if (document.body && document.body.clientHeight) { 
        height = document.body.clientHeight; 
    } 
    return height; 

}

/*载入CSS或JS*/
function loadCJfile(filename, filetype, id){ 
	if (filetype=="js"){
		var fileref=document.createElement('script');
		fileref.setAttribute("type","text/javascript");
		fileref.setAttribute("src", filename);
		fileref.setAttribute("id", id);
	} else if (filetype=="css"){ 
		var fileref=document.createElement("link");
		fileref.setAttribute("rel", "stylesheet");
		fileref.setAttribute("type", "text/css");
		fileref.setAttribute("href", filename);
		fileref.setAttribute("id", id);
	} 
	if (typeof fileref!="undefined") 
		document.getElementsByTagName("head")[0].appendChild(fileref);
}

/*关闭信息提示框*/
function closeMsgBox(obj){
	if(obj){
		var msgbox = obj.parentNode.parentNode.parentNode.parentNode;
		//alert(msgbox.tagName);
		msgbox.removeNode(true);
	}
}

document.getElementsByClassName = function(className,oBox) 
{
	//适用于获取某个HTML区块内部含有某一特定className的所有HTML元素
	this.d= oBox || document;
	var children = this.d.getElementsByTagName('*') || document.all;
	var elements = new Array();
	for (var ii = 0; ii < children.length; ii++) {
		var child = children[ii];
		if(child.className==className)
		{
		    elements.push(child);
			continue;
		}
		var classNames = child.className.split(' ');
		for (var j = 0; j < classNames.length; j++) 
		{
			if (classNames[j] == className) 
			{
				elements.push(child);
				continue;
			}
		}
	}
	return elements;
}

document.getElementsByType = function(sTypeValue,oBox) 
{
	//适用于获取某个HTML区块内部同属于某一特定type的所有HTML元素，如:input,script,link等等
	this.d= oBox || document;
	var children = this.d.getElementsByTagName('*') || document.all;
	var elements = new Array();
	for (var ii = 0; ii < children.length; ii++) {
		if (children[ii].type == sTypeValue) {
			elements.push(children[ii]);
		}
	}
	return elements;
}

function $F() 
{
	var elements = new Array();
	for (var ii = 0; ii < arguments.length; ii++) 
	{
		var element = arguments[ii];
		if (typeof element == 'string')
			element = document.getElementById(element);
		if (arguments.length == 1)
			return element;
		elements.push(element);
	}
	return elements;
}

$Cls = function (s,o){
	return document.getElementsByClassName(s,o);
};

$Type = function (s,o){
	return document.getElementsByType(s,o);
};

$Tag = function (s,o){
	this.d=o || document;
	return this.d.getElementsByTagName(s);
};

function UI_TAB()
{
	var id="";
	var arr=[];
	var panelList=[];
	this.init=function(id)
	{
		id=id;//alert(id);
		arr=$Tag("LI",
		$Cls("line-tabs-nav",$F(id))[0]
		);
		
		panelList=$Cls("line-tabs-panel line-tabs-hide",$F(id));
		/******************注册tab的事件*/
		for(var i=0;i<arr.length;i++)
			arr[i].onclick=function(){
				activeLI(this);
			};
		/******************刷新后保持状态*/
		//alert(location.hash);
		var defaultID=location.hash.replace(/###/gi,"");//alert(defaultID);
		var defaultIndex=-1;
		if(defaultID!=null && defaultID!="")
		{
			for (var x=0; x< panelList.length;x++)
			{
				if(panelList[x].id==defaultID)
				{
					defaultIndex=x;
					break;
				}
			}
		}
		//alert(defaultIndex);
		
		if(defaultIndex!=-1)
		{active(defaultIndex);}
	}
	
	/******************激活*/
	function active(i)
	{
		activeLI(arr[i]);
	}
	
	function activeLI(LI)
	{
		//alert(LI.className);return;//没有使用LI.getAttribute("Class");问题是在IE7里得不到值
		if(LI.className=="line-tabs-selected")
		{return;}
		else
		{
			var a=$Tag("a",LI)[0];//alert(a.href);
			var str=a.href;
			var temp_arr=str.split("###");
			var _id=temp_arr[temp_arr.length-1];//alert(_id);
			
			for ( var j=0 ;j<arr.length;j++ ) //用for in 无法修改classname，因为for in 是只读的
				arr[j].className="";
			
			LI.className="line-tabs-selected";//设置当前的为激活状态
			
			//设置所有的ID隐藏
			//alert(id);//alert(panelList.length);
			for(j=0;j<panelList.length;j++)
			{
				panelList[j].style.display="none";
			}
			//设置当前的id为show
			$F(_id).style.display="block";
			
		}
	}
	
	this.activeIndex=function(i)
	{
		activeLI(arr[i]);
	}
	return this;
}