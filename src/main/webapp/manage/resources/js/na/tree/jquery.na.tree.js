/**
 * @author XiaoRu LI
 * @description 支持异步/同步加载Json数据,能够进行checkbox,radiobox编辑的,可以移动节点的树。
 * @date 2010-03-29 
 * 
 * 
 */
(function($) {

	
	var rootIdFix="Root_"

	// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// 初始化 2010.04.03 11:18
	
	// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	



	$.natree = {
		// 默认值
		defaults : {
			rootId:"root",
			rootName :"root",//树的根节点
			async : false ,//是否同步或异步
			selectType : "none", //checkbox,radio
			nodeDrag : false , //节点是否可以移动
			nodeEdit : false , //节点是否可以编辑（双击编辑）
			rightMenu :false ,//右键菜单(删除、)
			initExpandLevel:1, //默认展开节点层次
			target:"",//每个子节点超链接均可以指定跳转指向,如果没有指定,则采用这个超链接指向
			parentCheckedType:"1", // 1 取消选中子节点,父节点也取消 2：取消子节点,父节点不取消
			f_id:"id",//用户自定义字段，节点ID的KEY
			f_name:"name",//用户自定义字段，节点名称的KEY
			f_pid:"parentId",//用户自定义字段，父节点的KEY
			f_href:"href",//用户自定义字段,节点的超链接地址
			f_target:"target"//用户自定义字段,节点的超连接的指向
			
		}
	};

	/**
	 * 初始化树
	 */
	$.fn.natree = function(options) {

		// 如果没有输入值,继承默认值
		var options = $.extend( {}, $.natree.defaults, options);
				
				var _tree=$(this);
				_tree_Id=_tree.attr("id");	
				
				_tree.data("rootId",options.rootId);
				//添加属性项
				_tree.data("selectType",options.selectType);//选择框类型类型
				_tree.data("nodeEdit",options.nodeEdit);//节点是否允许编辑
				_tree.data("rightMenu",options.rightMenu);//是否右键菜单
				_tree.data("initExpandLevel",options.initExpandLevel);
				_tree.data("async",options.async);
				_tree.data("target",options.target);
					

				_tree.data("parentCheckedType",options.parentCheckedType);
				//用户定义的字段
				_tree.data("f_id",options.f_id);
				_tree.data("f_name",options.f_name);
				_tree.data("f_pid",options.f_pid);
				_tree.data("f_href",options.f_href);
				_tree.data("f_target",options.f_target);
				
				
				_tree.data("elementType","NaTree");
				
				
				//加载根节点
				rootNode="<a class='switch'></a><a class='rootFolder'></a><a class='value'>"+options.rootName+"</a>"
				_tree.append("<ul><li id='"+options.rootId+"'>"+rootNode+"</li></ul>");
				_tree.children("ul").data("level","1");//设置为第一级节点
				//设置根图片
				var rootNode=$("#"+_tree_Id +"  #"+options.rootId);
				rootNode.children(".switch").addClass("switchClosed");
				rootNode.children(".rootFolder").addClass("rootClosedFolder");
				//指定是跟节点
				$("#"+options.rootId).data("rootNode","root");
				
				//开关单击事件
				$("#"+_tree_Id +" .switch").live("click",
						function() {
					switchClick($(this),_tree_Id);
				});
				
				
				//双击节点外层div,打开节点
				$("#"+_tree_Id +" li").live("dblclick",
						function() {
					switchClick($(this).children(".switch"),_tree_Id);
				});
				

				
				//节点鼠标移入移除事件
				$("#"+_tree_Id +" li").live("mousemove",
						function() {
					liMouseMove($(this));
				});
				
				$("#"+_tree_Id +"  li").live("mouseout",
						function() {
					liMouseOut($(this));
				});
				
				//文字区域的单击事件。
				$("#"+_tree_Id +" .value").live("click",
						function() {
					nodeValueClick($(this),_tree_Id);
				});
				
				
				//双击节点外层div,打开节点
				$("#"+_tree_Id +" .value").live("dblclick",
						function() {
					valueDbClick($(this),_tree_Id);
				});
				
				
				
				//checkbox
				$("#"+ _tree_Id + " :checkbox").live("click" ,function(){
					
					checkboxClick($(this),_tree_Id);
				})
				//radio
				$("#"+ _tree_Id + " :radio").live("click" ,function(){
					
//					radioClick($(this));
				})
				
				
				//---------------------------
				//可拖拽节点的位置
				//---------------------------
				if(options.nodeDrag)
				{
					$("#"+ _tree_Id + " a").live("mousedown" ,function(){
						aDragMouseDown(_tree,$(this));
					})
					
					$("#"+ _tree_Id ).live("mousemove" ,function(){
						dragNode(_tree);
					})
//					
					$(document).bind("mouseup" ,function(){
						_tree.data("dragNodeId",null);
						
					});
	
					$(document).bind("mousemove", natree_WindowMouseMove);
				
				}
				//右键菜单禁用
				//$(document).bind("contextmenu", function(){return false;});
			
	};
	
	
	/**
	 * 获取元素类型
	 */
	$.fn.getElementType = function() {
		return $(this).data("elementType");
	}
	// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// 节点拖拽 2010.04.05 09:58
	
	// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
		
	aDragMouseDown = function(_tree,a)
	{
		_tree.data("dragNodeId",a.clone(true));
		
	}
			
	dragNode=function(_tree)
	{
		obj =_tree.data("dragNodeId");
		
		if(obj!=null)
		{
		
			obj.offset({
				top: clientY ,
				left: clientX
			});
		}
		
		
	}
	
	
	aDragMouseUp=function()
	{
//		alert(_tree.html());
//		_tree.data("dragNodeId",null);
//		
	}
	
	var clientX="";
	var clientY="";
	// 鼠标移动事件,记录鼠标的位置
	natree_WindowMouseMove = function windowMouseMove(ev)
	{
		ev = ev || window.event;
		if (ev.pageX || ev.pageY) {
			clientX = ev.pageX;
			clientY = ev.pageY;
		} else {
			clientX = ev.clientX + document.body.scrollLeft
					- document.body.clientLeft;
			clientY = ev.clientY + document.body.scrollTop
					- document.body.clientTop;
		}
		
	}
	
	
	
	/**
	 * 节点值的单击
	 */
	nodeValueClick=function (currentNode,_tree_Id)
	{
		//获取到上个选中的节点的ID
		oldSelectNodeValue=$("#"+_tree_Id).data("selectNodeId");
		
		if(oldSelectNodeValue!=""&&oldSelectNodeValue!=null)
		{
			//移除上一个选中节点的选中css颜色
			$("#"+_tree_Id +" #"+oldSelectNodeValue +" .value").removeClass("selectNode");
		}
		//将当前选中的节点加上选中颜色
		currentNode.addClass("selectNode");
		//将当前的选中节点的ID放入到选中的临时对象中，供选中下个节点后移除用。
		$("#"+_tree_Id).data("selectNodeId",currentNode.parent().attr("id"));
		if($("#"+_tree_Id).data("async")==true&&currentNode.parent().children("ul").size()==0)
		{
			
			try
			{
				li=currentNode.parent();
				var nodeName=currentNode.html();
				eval(_tree_Id+"_addChildNode(li.attr('id'),li.data('params'),nodeName)");
			}
			catch(e)
			{
				alert("动态加载节点失败!");
			}
		}
		
		try
		{
			li=currentNode.parent();
			var nodeName=currentNode.html();
			eval(_tree_Id+"_nodeClick(li.attr('id'),li.data('params'),nodeName)");
		}
		catch(e)
		{
			
		}
	}
	
	/**
	 * 节点值双击
	 */
	valueDbClick=function(valueObj,_tree_Id)
	{
		try
		{
			//用户自定义双击事件
			li=valueObj.parent();
			var nodeName=valueObj.html();
			eval(_tree_Id+"_nodeDbClick(li.attr('id'),li.data('params'),nodeName)");
		}catch(e){}
	}
	
	
	/**
	 * 开关的单击事件
	 */
	switchClick =function (switchObj,_tree_Id)
	{
	
		//是否有关闭或打开文件夹的图片,
		var imageName=switchObj.css("background-image");
		if(imageName=="none")
			return false;
		if(imageName.search("switchClosed")>-1)//打开文件夹
		{
			//改变图标
			switchObj.removeClass("switchClosed").addClass("switchOpen");
			if(switchObj.parent().attr("id")!=$("#"+_tree_Id).data("rootId"))//不等于根目录,修改图片为文件夹图片，增加开关。
				switchObj.next(".folder").removeClass("closedFolder").addClass("openFolder");
			else
				switchObj.next(".rootFolder").removeClass("rootClosedFolder").addClass("rootOpenFolder");
			switchObj.parent().children("ul").show();
		}
		
		if(imageName.search("switchOpen")>-1)
		{
			switchObj.removeClass("switchOpen").removeClass("switchOpenFocus").addClass("switchClosed");
			if(switchObj.parent().attr("id")!=$("#"+_tree_Id).data("rootId"))//不等于根目录,修改图片为文件夹图片，增加开关。
				switchObj.next(".folder").removeClass("openFolder").addClass("closedFolder");
			else
				switchObj.next(".rootFolder").removeClass("rootOpenFolder").addClass("rootClosedFolder");
			switchObj.parent().children("ul").hide();
		}

	}
	
	/**
	 * 复选框选中/反选操作
	 */
	checkboxClick=function (checkbox,tree_id)
	{
		//获取checkbox的选择类型 
		// 1：选中子节点,父节点都除非其子节点都选中,才选中. 取消子节点,父节点也取消 
		// 2: 选中子节点,父节点无需其子节点都选中就可以选中. 取消子节点,父节点也不取消 
		
		var parentCheckedType=$("#"+tree_id).data("parentCheckedType");
		
		li =checkbox.parent();
		parentLis=li.parents("li");
		if(checkbox.attr("checked")==true)
		{
			//选中所有的下级节点
			li.find("ul :checkbox").attr("checked",true);
			
			if(parentCheckedType==1)
			{
				//如果每个上级节点的子节点都选中,则该节点也选中。
				parentLis.each(function(){
						check=true;
						$(this).find("ul :checkbox").each(function(){
							
							if($(this).attr("checked")==false)
							{
								check=false;
								return false;
							}
						})
						if(check)
						$(this).children(":checkbox").attr("checked",true);
						
				})
			}
			else{
				//选中子节点,父节点无需其子节点都选中就可以选中. 
				parentLis.each(function(){
					$(this).children(":checkbox").attr("checked",true);
				});
			}
		}
		else
		{
			//取消所有的子节点的chdckbox
			li.find("ul :checkbox").attr("checked",false);
			if(parentCheckedType=="1")
			{
				//取消所有的父节点checkbox
				parentLis.each(function(){
						$(this).children(":checkbox").attr("checked",false);
						
				});
			}
		}
		
	}
	
	
	
	
	
	
	
	/**
	 * 鼠标移入li
	 */
	liMouseMove =function (li)
	{
//		var switchObj=divNode.children(".switch");
//		var imageName=switchObj.css("background-image");
//		if(imageName=="none")
//			return false;
//		if(imageName.search("switchClosedFocus.gif")>-1)//打开文件夹
//		{
//			switchObj.removeClass("switchClosedFocus").addClass("switchClosed");
//		}
//		if(imageName.search("switchClosed.gif")>-1)//打开文件夹
//		{
//			switchObj.removeClass("switchClosed").addClass("switchClosedFocus");
//		}
//		if(imageName.search("switchOpenFocus.gif")>-1)
//		{
//			switchObj.removeClass("switchOpenFocus").addClass("switchOpen");
//		}
//		if(imageName.search("switchOpen.gif")>-1)
//		{
//			switchObj.removeClass("switchOpen").addClass("switchOpenFocus");
//		}
		
		li.children(".value").addClass("hoveringNode");
		
	}
	
	
	/**
	 * 鼠标移除li
	 */
	liMouseOut =function (li)
	{
//		var switchObj=divNode.children(".switch");
//		var imageName=switchObj.css("background-image");
//		if(imageName=="none")
//			return false;
//		if(imageName.search("switchClosedFocus.gif")>-1)//打开文件夹
//		{
//			switchObj.removeClass("switchClosedFocus").addClass("switchClosed");
//		}
//		if(imageName.search("switchClosed.gif")>-1)//打开文件夹
//		{
//			switchObj.removeClass("switchClosed").addClass("switchClosedFocus");
//		}
//		if(imageName.search("switchOpenFocus.gif")>-1)
//		{
//			switchObj.removeClass("switchOpenFocus").addClass("switchOpen");
//		}
//		
//		if(imageName.search("switchOpen.gif")>-1)
//		{
//			switchObj.removeClass("switchOpen").addClass("switchOpenFocus");
//		}
		
		li.children(".value").removeClass("hoveringNode");
	}
	
	
	
		

	

	
	
	// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// 节点展示 2010.04.05 00:46
	
	// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * 展开所有的节点
	 */
		$.fn.expandAll = function() {
				var _tree=$(this);
				_tree_Id=_tree.attr("id");

				$(this).children("ul").children("li").children(".switch").removeClass("switchClosed").addClass("switchOpen");
				
				$("#"+_tree_Id +" .rootFolder").removeClass("rootClosedFolder").addClass("rootOpenFolder");
				
				$("#"+_tree_Id +" .folder").each(function(){
					if($(this).parent().children("ul").html()!=null)
					{
						$(this).removeClass("closedFolder").addClass("openFolder");
						$(this).parent().children(".switch").removeClass("switchClosed").addClass("switchOpen");
					}
				});
				
				$("#"+_tree_Id +" ul").show();
				
				
		}


	/**
	 * 关闭所有的节点
	 */
		$.fn.ClosedAll = function() {
			var _tree=$(this);
				_tree_Id=_tree.attr("id");
				
				$(this).children("ul").children("li").children(".switch").removeClass("switchOpen").addClass("switchClosed");
				
				$("#"+_tree_Id +" .rootFolder").removeClass("rootOpenFolder").addClass("rootClosedFolder");
				
				$("#"+_tree_Id +" .folder").each(function(){
					if($(this).parent().children("ul").html()!=null)
					{
						$(this).removeClass("openFolder").addClass("closedFolder");
						$(this).parent().children(".switch").removeClass("switchOpen").addClass("switchClosed");
					}
				});
				
				$("#"+_tree_Id +" li ul").hide();
		}


	// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// 数据处理 2010.04.03 11:18
	
	// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	


	/**
	 * 设置跟节点名称
	 */
	$.fn.setRootName = function(rootName) {
				var rootId=$(this).data("rootId");
				var _tree_Id=$(this).attr("id");
				var rootNode=$("#"+_tree_Id +"  #"+rootId);
				rootNode.children(".value").text(rootName);
	};
	
	/**
	 * 设置节点名称
	 */
	$.fn.setNodeName = function(nootName,nodeId){
		
		_tree_Id=$(this).attr("id");
		var node = $("#"+_tree_Id +" #"+nodeId);
		node.children(".value").text(nootName);
	}
	


	/**
	 * 设置递归数据
	 * @param jsonData ：json的数据
     * @param parentId ：需要加载数据的根节点
	 * @param nodeParams ：节点的其他参数
	 * @param isReload :是否重载,默认重载，如果为false,则向指定的parentId下追加节点。
	 */
	$.fn.setTreeData = function(jsonData,parentId,isReload) {
		var _tree=$(this);
		_tree_Id=_tree.attr("id");
		
		//如果parentId为空,则加载到根节点下
		parentId=(parentId==null||parentId=="")?$(this).data("rootId"):parentId;

		//默认打开的节点层次
		initExpandLevel=_tree.data("initExpandLevel");
		//默认的跳转
		target=_tree.data("target");
		var jData = eval('(' + jsonData + ')');
		//获取到json的数据长度
		var rowsCount=jData.length;
		if(rowsCount<=0)
			return false;
		
		
		if(isReload==null||isReload==""||isReload==true)
		{
			$(this).find("#"+parentId).children("ul").remove();
		}
		
		
			//加载数据
		addRecursionTreeNode(parentId,jData,rowsCount,_tree_Id,initExpandLevel,target,_tree,
		_tree.data("f_id"),_tree.data("f_pid"),_tree.data("f_name"),_tree.data("f_href"),_tree.data("f_target"));

		//加载checkbox或radiobox
		if($("#"+ _tree_Id).data("selectType")=="checkbox")
		{
			
			$("#"+_tree_Id +" .value ").each(function(){
				//如果已经有的checkbox,则不在添加checkbox
				if($(this).prev().attr("type")!="checkbox")
					$(this).before("<input type='checkbox'/>");
			});
				
		}
		else if ($("#"+ _tree_Id ).data("selectType")=="radio")
		{
			$("#"+_tree_Id +" .value").each(function(){
				if($(this).prev().attr("type")!="radio")
					$(this).before("<input name='"+_tree_Id+"_radio' type='radio'/>");
			});
			
		}

		
		
	};
	
	/**
	 * 清空树
	 */
	$.fn.clearTree = function(){
		var rootId=$(this).data("rootId");
		var _tree_Id=$(this).attr("id");
		$("#"+_tree_Id +"  #"+rootId).children("ul").remove();
				
		removeChildNodeStyle(rootId);
	}
	

	/**
	 * 添加递归数据。
	 */
	addRecursionTreeNode =function  (parentId,jData,count,_tree_Id,initExpandLevel,target,_tree,f_id,f_pid,f_name,f_href,f_target)
	{
		
		for(var i=0;i<count;i++)
		{
			var nodeData=jData[i];
			
			if(nodeData[f_pid]==parentId)
			{
				var childeId=nodeData[f_id];
				
				a_href=(nodeData[f_href]==null||nodeData[f_href]=="")?"":"href='"+nodeData[f_href]+"'";
				
				a_target=(nodeData[f_target]==null || nodeData[f_target]=="")?"":nodeData[f_target];
				a_target= a_target==""?target:a_target;

				childeNode=$("<li id='"+childeId+"'><a class='switch'></a><a class='folder'></a><a " + a_href +" target='" +  a_target + "'   class='value'>"+jData[i][f_name]+"</a></li>");
				
				//添加节点缓存
				for(key in nodeData)
				{
					if(key!=f_id&&key!=f_pid&&key!=f_name&&key!=f_href&&key!=f_target)
					{
						var params=childeNode.data("params");
						if(params!=null)
						{
							eval("params."+key+"='"+nodeData[key]+"'");
						}
						else
						{
							childeNode.data("params",eval("({'"+key+"':'"+nodeData[key]+"'})"));
						}
					}
				}
				
				//查找父节点是否所有子ul元素，如果没有,则添加(在树的设计中,每个节点下如果有UL，有且只有一个UL)
				var parentNode=$("#"+_tree_Id + " #"+parentId);
				ul=parentNode.children("ul").eq(0);
				//如果不等于NULL,则添加节点
				if(ul.html()!=null)
				{
					ul.append(childeNode);
				}
				else//否则创建新的子节点
				{
					level=parentNode.parent().data("level");
					ul=$("<ul></ul>");
					if(parseFloat(level)<=parseFloat(initExpandLevel)||parseFloat(initExpandLevel)<0)//展开
					{
						parentNode.children(".switch").removeClass("switchClosed").addClass("switchOpen");
						if(parentId!=$("#"+_tree_Id).data("rootId"))//不等于根目录,修改图片为文件夹图片，增加开关。
						{
							parentNode.children(".folder").removeClass("closedFolder").addClass("openFolder");
						}
						else
						{
							parentNode.children(".rootFolder").removeClass("rootClosedFolder").addClass("rootOpenFolder");
						}
					}
					else
					{
						parentNode.children(".switch").removeClass("switchOpen").addClass("switchClosed");
						if(parentId!=$("#"+_tree_Id).data("rootId"))//不等于根目录,修改图片为文件夹图片，增加开关。
						{
							parentNode.children(".folder").removeClass("openFolder").addClass("closedFolder");
						}
						else
						{
							parentNode.children(".rootFolder").removeClass("rootOpenFolder").addClass("rootClosedFolder");
						}
						ul.hide();
					}
					ul.data("level",parseFloat(level)+1).append(childeNode);
					parentNode.append(ul);
				}
				addRecursionTreeNode(childeId,jData,count,_tree_Id,initExpandLevel,target,_tree,f_id,f_pid,f_name,f_href,f_target);
			}
			
		}
			
	}
	
	
	
	/**
	 * 获取到tree指定节点下的所有子节点的信息,如果不填则为根节点下的所有信息.
	 * @param nodeId 需要获取到
	 * 
	 */
	$.fn.getTreeData=function(nodeId)
	{
		
		
		var _tree=$(this);
		_tree_Id=_tree.attr("id");
		
		nodeId=(nodeId==null||nodeId=="")?$(this).data("rootId"):nodeId;
		//采用在缓存中设立返回值，是因为如果定义一个var对象给getTreeInfo调用,返回的还是空，因为它不是地址引用。
		//
		_tree.data("returnTreeInfo","");
		getTreeInfo(_tree,nodeId);
		
		var returnInfo=_tree.data("returnTreeInfo");
		//returnInfo.substr(0,returnInfo.length-1)去除最后一个逗号
		
		return returnInfo="["+returnInfo.substr(0,returnInfo.length-1)+"]"
	
	}
	
	
	getTreeInfo=function(_tree,nodeId)
	{
		
		var lis=_tree.find("#"+nodeId).children("ul").children("li");
		lis.each(function(){
			
			var returnStr="{";
			returnStr+="'parentId':'"+nodeId+"',";
			returnStr+="'id':'"+$(this).attr("id")+"',";
			returnStr+="'name':'"+$(this).children(".value").html()+"'";
			var params=$(this).data("params");
			if(params!=null)
			{
			  returnStr+=",'params':{";
			 var cram=false;
			  for(var   key   in   $(this).data("params"))   
			  {   
			  	  returnStr+=cram?",":"";
			  	  returnStr+="'"+key.toString()+"':'"+params[key]+"'";
				  cram=true;
			  }   
			  returnStr+="}";
			}
			returnStr+="},";
			_tree.data("returnTreeInfo",_tree.data("returnTreeInfo")+returnStr);
			getTreeInfo(_tree,$(this).attr("id"));
		});
		
	}
	
	// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// 节点操作 2010.04.03 11:18
	
	// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * 是否有子节点
	 */
	$.fn.hasChild=function(nodeId)
	{
		//如果为空,则获取选中的节点ID
		if(nodeId==null||nodeId=="")
			nodeId=$(this).getSelectNodeId(nodeId);
		
		//如果再为空,则提示。
		if(nodeId==null||nodeId=="")
		{
			alert("请先指定节点或选中节点!");
		}
		else
		{
		
		var list=$(this).find("#"+nodeId).children("ul").children("li");
		if(list.size()>0)
			return true;
		else
			return false;
		}
	}




	
	/**
	 * 获取节点的参数,如果不输入节点ID,则默认为选中的节点
	 */
	$.fn.getSelectNodeParams=function(nodeId)
	{
		nodeId = (nodeId==null||nodeId=="") ? $(this).data("selectNodeId"):nodeId;
		return $(this).find(" #"+nodeId).data("params");
	}

	
	
		
	/**
	 * 清除节点参数,如果不输入节点ID,则默认为选中的节点
	 */
	$.fn.clearNodeParams=function(nodeId)
	{
		nodeId = (nodeId==null||nodeId=="") ? $(this).data("selectNodeId"):nodeId;
		 $(this).find(" #"+nodeId).data("params",null);
	}
	
	
	/**
	 * 获取节点的Id,如果不输入节点ID,则默认为选中的节点
	 */
	$.fn.getSelectNodeId = function(nodeId) {
		
		nodeId = (nodeId==null||nodeId=="") ? $(this).data("selectNodeId"):nodeId;
		return $(this).find(" #"+nodeId).attr("id");
	}
	
	/**
	 * 获取节点的名称,如果不输入节点ID,则默认为选中的节点
	 */
	$.fn.getSelectNodeName = function(nodeId) {
		
		nodeId = (nodeId==null||nodeId=="") ? $(this).data("selectNodeId"):nodeId;
		return $(this).find(" #"+nodeId).children(".value").html();

	}



	/**
	 * 设置节点的参数,如果不输入节点ID,则默认选中的节点
	 * @param key    : 参数名
	 * @param value  : 参数值
	 * @param nodeId : 节点ID,不输入节点ID,则默认选中的节点
	 */
	$.fn.setNodeParams = function(key,value,nodeId) {
		
		nodeId = (nodeId==null||nodeId=="") ? $(this).data("selectNodeId"):nodeId;
		var li=$(this).find(" #"+nodeId);
		var params=li.data("params");
		if(params!=null)
		{
			eval("params."+key+"=value");
		}
		else
		{
			var jData = eval("({'"+key+"':'"+value+"'})");
			li.data("params",jData);
		}
	}
	
	
	
	/**
	 *是否选中节点
	 */
	$.fn.isSelected = function() {
		
		var sel_id= $(this).data("selectNodeId");
		if(sel_id==null||sel_id=="")
			return false;
		else
			return true
	}
	
	/**
	 * 判断节点是否存在
	 */
	$.fn.nodeExist= function(nodeId) {
		
		var sel_id= $(this).find("#"+nodeId);
		if(sel_id.html()==null||sel_id.html()=="")
			return false;
		else
			return true
	}
	
	
	
		/**
	 * 删除选中节点(不包含选中的节点)
	 */
	
	$.fn.deleteNode=function(nodeId)
	{
		
		
		var sel=$(this).nodeExist(nodeId);
		if(sel==false)
		{
			alert("未发现需要删除的节点!");
			return false;
		}
		
		
		var isRootNode=$("#"+nodeId).data("rootNode");
		if(isRootNode!=null)
		{
			alert("根节点不能删除!");
			return false;
		}
		
		if($("#"+nodeId).children("ul").size()>0)
		{
			alert("选中的节点下有子节点,不能删除!");
			return false;
		}
		
		
		var parentNodeId=$("#"+nodeId).parent().parent().attr("id");
		
		$("#"+nodeId).remove();
		
		removeChildNodeStyle(parentNodeId)
		
		
	}
	
	
	
	/**
	 * 删除指定节点(包含选中的节点)
	 */
	
	$.fn.deleteNodeWithChild=function(nodeId)
	{
		
		var sel=$(this).nodeExist(nodeId);
		if(sel==false)
		{
			alert("未发现需要删除的节点!");
			return false;
		}
		
		
		var isRootNode=$("#"+nodeId).data("rootNode");
		if(isRootNode!=null)
		{
			alert("根节点不能删除!");
			return false;
		}

		var parentNodeId=$("#"+nodeId).parent().parent().attr("id");
		
		$("#"+nodeId).remove();
		
		removeChildNodeStyle(parentNodeId)
		
	}
	
	
		
	
	
	/**
	 * 删除选中节点(不包含选中的节点)
	 */
	
	$.fn.deleteSelectNode=function()
	{
		
		var sel=$(this).isSelected();
		if(sel==false)
		{
			alert("请选中要删除的节点!");
			return false;
		}
		
		
		var sel_id= $(this).data("selectNodeId");
		
		var isRootNode=$("#"+sel_id).data("rootNode");
		if(isRootNode!=null)
		{
			alert("根节点不能删除!");
			return false;
		}
		
		
		if($("#"+sel_id).children("ul").size()>0)
		{
			alert("选中的节点下有子节点,不能删除!");
			return false;
		}
		
		

		
		var parentNodeId=$("#"+sel_id).parent().parent().attr("id");
		
		$("#"+sel_id).remove();
		
		removeChildNodeStyle(parentNodeId)
		

		
	}
	
	
	
	/**
	 * 删除选中节点(包含子节点)
	 */
	
	$.fn.deleteSelectNodeWithChild=function()
	{
		var sel=$(this).isSelected();
		if(sel==false)
		{
			alert("请选中要删除的节点!");
			return false;
		}
		
		var sel_id= $(this).data("selectNodeId");
		
		var isRootNode=$("#"+sel_id).data("rootNode");
		if(isRootNode!=null)
		{
			alert("根节点不能删除!");
			return false;
		}

		var parentNodeId=$("#"+sel_id).parent().parent().attr("id");
		
		$("#"+sel_id).remove();
		
		removeChildNodeStyle(parentNodeId);
		
	}
	
	
	/**
	 * 删除指定所有子节点
	 * @param nodeId 节点ID
	 */
	$.fn.deleteChild=function(nodeId)
	{
		if(nodeId==null||nodeId=="")
		{
			alert("节点ID不能为空!");
			return false;
		}
		$(this).find("#"+nodeId).children("ul").remove();
		
		removeChildNodeStyle(nodeId);
	}
	
	
	/**
	 * 删除选中节点所有子节点
	 */
	$.fn.deleteSelectChild=function()
	{
		var nodeId= $(this).data("selectNodeId");
		if(nodeId==null||nodeId=="")
		{
			alert("节点ID不能为空!");
			return false;
		}
		$(this).find("#"+nodeId).children("ul").remove();
		
		removeChildNodeStyle(nodeId);
	}
	
	/**
	 * 判断是否最后一个移除的节点
	 */	
	removeChildNodeStyle=function(parentNodeId)
	{
	
		var parentNode=$("#"+parentNodeId);
		var ul=parentNode.children("ul");
		var childrenSize=ul.children("li").size();
		
		if(childrenSize>0)
			return false;

		
		var isRootNode=$("#"+parentNodeId).data("rootNode");
			
			if(isRootNode==null)//不等于根目录,修改图片为文件夹图片，增加开关。
			{
				parentNode.children(".switch").removeClass("switchOpen").removeClass("switchClosed");
				parentNode.children(".folder").removeClass("openFolder").removeClass("closedFolder").addClass("folder");
			}
			else
			{
				parentNode.children(".switch").removeClass("switchOpen").addClass("switchClosed");
				parentNode.children(".rootFolder").removeClass("rootOpenFolder").addClass("rootClosedFolder");
			}
			
			ul.remove();
	}

	
	// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// radio操作 2010.04.05 00:24
	
	// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
		/**
	 * 获取到选中的radio的节点ID
	 * @return 返回选中的radio的节点
	 */
	$.fn.getRadioId= function() {
		
		var _tree=$(this);
		
		_tree_Id=_tree.attr("id");
		
		var returnId="";
		$("#"+_tree_Id +" :radio").each(function(){
			
			if($(this).attr("checked"))
				{
					returnId= $(this).parent().attr("id");
					return ;
				}
		});
		
		return returnId;
	}
	
	
	
	/**
	 * 将radio节点选中
	 * @param  nodeId : 需要被选中节点id
	 */
	$.fn.setRadio= function(nodeId) {
		
		var _tree=$(this);
		_tree_Id=_tree.attr("id");
		
		var returnId="";
		$("#"+_tree_Id +" :radio").each(function(){
			
				if($(this).parent().attr("id")==nodeId)
				{
					$(this).attr("checked",true);
					return ;
				}
		});
	}
	
	
	/**
	 * 将选中的radio清空
	 * @param  nodeId : 需要被选中节点id
	 */
	$.fn.unClickRadio= function(nodeId) {
		
		var _tree=$(this);
		_tree_Id=_tree.attr("id");
		
		$("#"+_tree_Id +" :radio").each(function(){
			
					if($(this).attr("checked")==true);
					{
						$(this).attr("checked",false);
						return ;
					}
				});
	}
	
	
	
	// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// CheckBox操作 2010.04.04 23:46
	
	// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	
		
	/**
	 * 获取到选中的checkbox的节点ID
	 * @return 返回选中的checkbox的节点,多个用逗号隔开。
	 */
	$.fn.getCheckedId= function() {
		
		var _tree=$(this);
		
		_tree_Id=_tree.attr("id");
		
		var returnId="";
		$("#"+_tree_Id +" :checkbox").each(function(){
			if($(this).attr("checked"))
			{
				returnId+= $(this).parent().attr("id")+",";
			}
		});
		
		if(returnId=="")
			return "";
		else
			return returnId.substr(0,returnId.length-1);
	}
	
	
	/**
	 * 选中自身,所有的子节点，父节点在它所有子节点全被选中后才选中
	 * @param  nodeIdStr : 需要被选中节点id ,多个用逗号隔开。
	 */
	$.fn.setChecked= function(nodeIdStr) {
		
		var _tree_Id=$(this).attr("id");
		
		nodeIdStr+=","
		$("#"+_tree_Id +" :checkbox").each(function(){
			
			var nodeId=$(this).parent().attr("id");
			if(nodeIdStr.indexOf(nodeId+",")>-1)
			{
				$(this).attr("checked",true);
				li =$(this).parent();
				parentLis=li.parents("li");
				//选中所有的下级节点
				li.find("ul :checkbox").attr("checked",true);
				//如果每个上级节点的子节点都选中,则该节点也选中。
				parentLis.each(function(){
						check=true;
						$(this).find("ul :checkbox").each(function(){
							if($(this).attr("checked")==false)
							{
								check=false;
								return false;
							}
						})
						if(check)
						$(this).children(":checkbox").attr("checked",true);
						
				})
				
			}
		});
	}
	
	
	
	
		
	/**
	 * 选中自身、所有子节点、所有父节点
	 * @param  nodeIdStr : 需要被选中节点id ,多个用逗号隔开。
	 */
	$.fn.setChecked2= function(nodeIdStr) {
		
		var _tree_Id=$(this).attr("id");
		
		nodeIdStr+=","
		$("#"+_tree_Id +" :checkbox").each(function(){
			
			var nodeId=$(this).parent().attr("id");
			if(nodeIdStr.indexOf(nodeId+",")>-1)
			{
				$(this).attr("checked",true);
				
				li =$(this).parent();
				//选中所有的下级节点
				li.find("ul :checkbox").attr("checked",true);
				//如果每个上级节点的子节点都选中,则该节点也选中。
				parentLis=li.parents("li");
				parentLis.each(function(){
						$(this).children(":checkbox").attr("checked",true);
				})
				
			}
		});
	}
	
	
	
	/**
	 * 只选中自身
	 * @param  nodeIdStr : 需要被选中节点id ,多个用逗号隔开。
	 */
	$.fn.setCheckedSelf= function(nodeIdStr) {
		
		var _tree_Id=$(this).attr("id");
		
		nodeIdStr+=","
		$("#"+_tree_Id +" :checkbox").each(function(){
			
			var nodeId=$(this).parent().attr("id");
			if(nodeIdStr.indexOf(nodeId+",")>-1)
			{
				$(this).attr("checked",true);
			}
		});
	}
	
	
	/**
	 * 选中自身和其所有子节点
	 * @param  nodeIdStr : 需要被选中节点id ,多个用逗号隔开。
	 */
	$.fn.setCheckedSelfAndSub= function(nodeIdStr) {
		
		var _tree_Id=$(this).attr("id");
		nodeIdStr+=","
		$("#"+_tree_Id +" :checkbox").each(function(){
			
			var nodeId=$(this).parent().attr("id");
			if(nodeIdStr.indexOf(nodeId+",")>-1)
			{
				$(this).attr("checked",true);
				li =$(this).parent();
				//选中所有的下级节点
				li.find("ul :checkbox").attr("checked",true);
			}
		});
	}
	
	
	/**
	 * 只选中子节点
	 * @param  nodeIdStr : 需要被选中节点id ,多个用逗号隔开。
	 */
	$.fn.setCheckedSub= function(nodeIdStr) {
		
		var _tree_Id=$(this).attr("id");
		
		nodeIdStr+=","
		$("#"+_tree_Id +" :checkbox").each(function(){
			
			var nodeId=$(this).parent().attr("id");
			if(nodeIdStr.indexOf(nodeId+",")>-1)
			{
				li =$(this).parent();
				parentLis=li.parents("li");
				//选中所有的下级节点
				li.find("ul :checkbox").attr("checked",true);
			}
		});
	}
	
	
	/**
	 * 选中自身和父节点
	 * @param  nodeIdStr : 需要被选中节点id ,多个用逗号隔开。
	 */
	$.fn.setCheckedSelfAndParent= function(nodeIdStr) {
		
		var _tree_Id=$(this).attr("id");
		
		nodeIdStr+=","
		$("#"+_tree_Id +" :checkbox").each(function(){
			
			var nodeId=$(this).parent().attr("id");
			if(nodeIdStr.indexOf(nodeId+",")>-1)
			{
				$(this).attr("checked",true);
				li =$(this).parent();
				parentLis=li.parents("li");
				//如果每个上级节点的子节点都选中,则该节点也选中。
				parentLis.each(function(){
						$(this).children(":checkbox").attr("checked",true);
						
				})
				
			}
		});
	}
	
	
	/**
	 * 选中自身和父节点
	 * @param  nodeIdStr : 需要被选中节点id ,多个用逗号隔开。
	 */
	$.fn.checkedAll= function() {
		
		var _tree_Id=$(this).attr("id");
		
		$("#"+_tree_Id +" :checkbox").each(function(){
			
			$(this).attr("checked",true);
		
		});
	}
	/**
	 * 选中自身和父节点
	 * @param  nodeIdStr : 需要被选中节点id ,多个用逗号隔开。
	 */
	$.fn.unCheckedAll= function() {
		
		var _tree_Id=$(this).attr("id");
		
		$("#"+_tree_Id +" :checkbox").each(function(){
			
			$(this).attr("checked",false);
		
		});
	}

})(jQuery);
