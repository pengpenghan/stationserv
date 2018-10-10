   
     function sAlert1(str)
     { 
	x = true;
	var msgw,msgh,bordercolor;
	msgw=300;
	msgh=100;
	titleheight="25" //提示窗口标题高度 
	bordercolor="#336699";//提示窗口的边框颜色 
	titlecolor="#99CCFF";//提示窗口的标题颜色 
    
	var sWidth,sHeight;
	sWidth=document.body.offsetWidth;
	sHeight=screen.height;
	var bgObj=document.createElement("div");
	bgObj.setAttribute('id','bgDiv');
	bgObj.style.position="absolute";
	bgObj.style.top="0";
	bgObj.style.background="#777";
	//bgObj.style.filter="progid:DXImageTransform.Microsoft.Alpha(style=3,opacity=25,finishOpacity=75)";
	bgObj.style.filter="alpha(opacity=50)";
	bgObj.style.opacity="0.6";
	bgObj.style.left="0";
	bgObj.style.width=sWidth + "px";
	bgObj.style.height=sHeight + "px";
	bgObj.style.zIndex = "10000";
	
	document.body.appendChild(bgObj);
	  
	var msgObj=document.createElement("div") 
	msgObj.setAttribute("id","msgDiv");
	msgObj.setAttribute("align","center");
	msgObj.style.background="white";
	msgObj.style.border="1px solid " + bordercolor;
	msgObj.style.overflow = "auto";
	msgObj.style.position = "absolute";
	msgObj.style.left = "50%";
	msgObj.style.top = "50%";
	msgObj.style.font="12px/1.6em Verdana, Geneva, Arial, Helvetica, sans-serif";
	msgObj.style.marginTop = "-100px";
	msgObj.style.marginBottom = "0px" ;
	msgObj.style.marginRight = "0px";
	msgObj.style.marginLeft = "-150px";
	msgObj.style.width = msgw + "px";
	msgObj.style.height =msgh + "px";
	msgObj.style.textAlign = "center";
	msgObj.style.lineHeight ="25px";
	msgObj.style.zIndex = "10001";

	var title=document.createElement("h4");
	title.setAttribute("id","msgTitle");
	title.setAttribute("align","right");
	title.style.margin="0";
	title.style.padding="3px";
	title.style.background=bordercolor;
	title.style.filter="progid:DXImageTransform.Microsoft.Alpha(startX=20, startY=20, finishX=100, finishY=100,style=1,opacity=75,finishOpacity=100);";
	title.style.opacity="0.75";
	title.style.border="1px solid " + bordercolor;
	title.style.height="18px";
	//title.style.font="12px Verdana, Geneva, Arial, Helvetica, sans-serif";
	title.style.color="white";
	//title.style.cursor="pointer";
	//title.innerHTML="关闭";
	title.onclick = function(){ 
		//x = false;
		//document.body.removeChild(bgObj);
		//document.getElementById("msgDiv").removeChild(title);
		//document.body.removeChild(msgObj);
		//window.close();
	}
	document.body.appendChild(msgObj);
	//document.body.style.overflow="hidden";
	var select_objs = document.getElementsByTagName("select");
	for(i=0;i<select_objs.length;i++){
		select_objs[i].style.visibility="hidden";
	}
	document.getElementById("msgDiv").appendChild(title);
	var txt=document.createElement("p");
	//txt.name = "testT";
	txt.style.margin="1em 0" 
	txt.setAttribute("id","msgTxt");
	imgpath = "<table><tr><td width='25px' height='40px'id=\"ico_loadding\"></td><td>　"+str+"</td></tr></table>";
	txt.innerHTML=imgpath;
	document.getElementById("msgDiv").appendChild(txt); 
}

function loadMessageBox()
{
	sAlert1("正在处理中,请稍候...");
}

function closeMessageBox()
{
	sAlertClose("");
}
function sAlertClose(sType)
{
		x = false;
		bgObj = document.getElementById("bgDiv");
		document.body.removeChild(bgObj);
		var title = document.getElementById("msgTitle");
		document.getElementById("msgDiv").removeChild(title);
		document.body.removeChild(document.getElementById("msgDiv"));
		var select_objs = document.getElementsByTagName("select");
		//document.body.style.overflow="";
		for(i=0;i<select_objs.length;i++){
			select_objs[i].style.visibility="";
		}
		if(sType == "1")
		{
			window.close();
		}
}