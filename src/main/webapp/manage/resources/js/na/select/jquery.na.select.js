/**
 * @author XiaoRu LI
 * @description 用于加载json数据的下拉框。
 * @date 2010-03-21
 * 
 * 
 */
(function($) {



	var _dorpDivIdPostfix = "_2D7g46NUN_L380mY";// 下拉框ID的后缀

	var currentShowDropDivId = "";// 当前显示中的下拉框

	$.naselect = {
		// 默认值
		defaults : {
			// 宽度
			width : "200",// 下拉框宽度
			height : "20",// 数据选中后的输入框高度
			dataRowHeight : "26",// 下拉数据行高度
			dropHeight : "auto",// 下拉框高度,默认为根据数据自适应
			//selectEvent : "",// 输入框的值改变事件,在失去焦点时有效，这里是事件名称。
			keyId:"k",
			valueId:"v"
		}
	};

	// 是否显示下拉框
	var chooseDisplay = false;

	/**
	 * 初始化数据,将普通的table文本转化为带有冻结行列、可以排序的。
	 */
	$.fn.naselect = function(options) {

		// 如果没有输入值,继承默认值
		var options = $.extend( {}, $.naselect.defaults, options);
		return this.each(function() {

			// select 对象
				var _select = $(this);
				var _selectId = _select.attr("id");

				//
				$(this).focus(function(){
					  this.blur();
				}); 
				
				// 获取到div的宽度
				if ($(this).width() != "") {
					options.width = $(this).width();
				}
				// 创建数据区
				var _list = $("<div id='" + _selectId + _dorpDivIdPostfix
						+ "' class='naselect_droplist'   ></div>");
				var _dataList = $("<table style=\"cursor: pointer;\"><tbody></tbody></table>");
				_dataList.css( {
					"cursor" : "pointer",
					"width" : "100%"
				});
				
				//用于存放dropList的高度的隐藏字段。供其他函数使用。
				var dropHeightObj=$("<input  type='hidden' >").attr("value",options.dropHeight);
				//用于存放dropList中的行高的隐藏字段。供其他函数使用。
				var rowHeight=$("<input  type='hidden' >").attr("value",options.dataRowHeight);
				
				//设置KEY列名
				_select.data("keyId",options.keyId);
				//设置value列名
				_select.data("valueId",options.valueId);
				//
				_select.data("enable","true");
				
				//
				_select.data("elementType","NaSelect");
				
				
				_list.append(dropHeightObj);
				_list.append(rowHeight);
				_list.append(_dataList);
				_list.css( {
					"position" : "absolute",
					"float" : "left",
					"overflow-y" : "auto",
					"overflow-x" : "hidden",
					"cursor" : "pointer",
					"width" : parseFloat(options.width) + 4,
					"display" : "none",
					"background-color" : "#FEF3D1",
					"z-index" : "999"
				});
				// 数据区的高度
				
				$("body").append(_list);

				// 显示/隐藏下拉框

				// 输入区的单击事件
				$("#" + _selectId)
						.live(
								"click",
								function() {
									if(_select.data("enable")=="false")
										return false ;
									
									if (chooseDisplay) {
										try {
											_list.css("display", "none");
											// 解除运算时的下拉框单击事件
											$("#" + _selectId+ _dorpDivIdPostfix+ " td").die("click");
										} catch (e) {
											alert(e);
										}

									} else {
										$("#" + _selectId+ _dorpDivIdPostfix+ " td").die("click");
										_list.css("display", "block");
										// 位置显示
										_list.css("top", parseFloat($(this)
												.offset().top)
												+ parseFloat($(this).height())+parseFloat("3"));
										_list.css("left", parseFloat($(this)
												.offset().left));
										_list.css("width",parseFloat($(this).width())+4)

										// 选中事件
										var _run_select = $(this);

										$("#" + _selectId+ _dorpDivIdPostfix+ " td")
												.live("click",function() {
															chooseItem($(this),	_run_select);
												});
										
										
										// 绑定window的click事件,判断是否超出数据区自动隐藏。
										$(document).bind("mousemove",selectDropOut_WindowMouseMove);
										currentShowDropDivId = _selectId+ _dorpDivIdPostfix;// 全局下拉框ID,供是否鼠标在区域外时判断用
										$(document).bind("click",selectDropOutClick);
										

									}
									chooseDisplay = !chooseDisplay;

								});

				$(this).hover(function() {
					$(this).css("background-color", "yellow");
				}, function() {
					$(this).css("background-color", "");

				});

				$(this).css( {
					"cursor" : "pointer"

				})

				// 鼠标在选项区的移入

				$("#" + _selectId + _dorpDivIdPostfix + " tr").live(
						"mousemove", function() {
							$(this).addClass("over");
						});
				// 鼠标在选项区的移出
				$("#" + _selectId + _dorpDivIdPostfix + " tr").live("mouseout",
						function() {
							$(this).removeClass("over");
						});

			});

	};
	
	
	/**
	 * 设置是否灰化
	 */
	$.fn.setEnable = function(state)
	{
		if(state==""||state=="true")
		{
			$(this).data("enable","true");
		}
		else
		{
			$(this).data("enable","false");
		}
		
	}
	
	
	/**
	 * 获取元素类型
	 */
	$.fn.getElementType = function() {
		return $(this).data("elementType");
	}

	/**
	 * 选中一个值
	 */
	function chooseItem(cell, _select, selectEvent) {

		// 为输入框赋KEY和value
		
		_select.attr("value", cell.html());
		_select.data("name", cell.attr("id"));
		
		//获取选中参数
		_select.data("params",cell.parent().data("params"));
		// 隐藏
		$("#" + _select.attr("id") + _dorpDivIdPostfix).css("display", "none")
				.die("click");
		// 解除运算时的下拉框单击事件
		chooseDisplay = !chooseDisplay;

		$(document).unbind("click", selectDropOutClick);
		$(document).unbind("mousemove", selectDropOut_WindowMouseMove);

		/*
		if (selectEvent != "") {
			try {
				eval(selectEvent + "('" + cell.attr("id") + "','" + cell.html()
						+ "')");
			} catch (e) {
				alert(e);
				//alert("未发现用户定义的调用方法 '" + selectEvent + "()'.");
			}
		}
		*/
		
		// 触发用户定义的事件
		try {
			eval(_select.attr("id") + "_selected('" + cell.attr("id") + "','" + cell.html() +"','"+cell.data("parmas")+"')");
		}catch(e){
			
		}
	}

	/**
	 * 获取隐藏参数
	 */
	$.fn.getParams=function()
	{
		
		return $(this).data("params");
	}
	
	/**
	 * 清空选择项
	 */
	$.fn.clearSelectValue = function() {
		$(this).attr("value", "");
		$(this).data("name", "");
		$(this).data("params",null);
		
	}

	/**
	 * 获取到下拉框的key
	 */
	$.fn.getValue = function() {
		return $(this).attr("value");
	}

	/**
	 * 获取到下拉框的值
	 */
	$.fn.getKey = function() {
		if($(this).data("name") == null)
			$(this).data("name","");
		return $(this).data("name");
	}
	
	

	/**
	 * 设置默认选中的下拉框的Value
	 */
	$.fn.setValue = function(value) {
		return $(this).attr("value",value);
	}

	/**
	 * 设置默认选中的到下拉框的Key
	 */
	$.fn.setKey = function(key) {
		var _selectId = $(this).attr("id");
		var _table = $("#"+ _selectId + _dorpDivIdPostfix).find("table");
		var _tds = _table.find("tr").find("td");
		var value;
		var isHasData = false;
		_tds.each(function(){
			if($(this).attr("id") == key){
				value = $(this).html();
				isHasData = true;
			}
		});
		
		if(isHasData){
			$(this).data("name",key);
			$(this).attr("value",value);
		}
	}
	
	
	/**
	 * 清空下拉框所有的值
	 */
	$.fn.clear = function() {
		return this.each(function() {

			var listId = $(this).attr("id");
			// 清空内容
				$("#" + $(this).attr("id") + _dorpDivIdPostfix + " tbody")
						.empty();
				// 将高度重置
				$("#" + listId + _dorpDivIdPostfix).css("height", "0");
				$("#" + listId + _dorpDivIdPostfix + "  table").css("width",
						$("#" + listId + "  div").css("width"));

				$(this).val("");
				$(this).data("name", "");
				$(this).data("params",null);
				chooseDisplay = !chooseDisplay;

			});
		
	}

	/**
	 * 删除指定key的值
	 */
	$.fn.removeKey = function(key) {
		return this.each(function() {
			var listId = $(this).attr("id");
			var data_div = $("#" + listId + _dorpDivIdPostfix);
			$("#" + $(this).attr("id") + _dorpDivIdPostfix + " td").each(
					function() {

						if ($(this).attr("id") == key) {
							// 移除TR
							$(this).parent().remove();

							// 如果选择的项是此项,删除选择的内容
							if ($("#" + listId).data("name") == key) {
								$("#" + listId).val("");
								$("#" + listId).data("name", "");
							}

							// 重新计算下拉框的高度
							var tbody = $("#" + listId + _dorpDivIdPostfix
									+ " tbody");
							var tr_count = tbody.children("tr").size();
							// 数据高度小于DIV高度，或者下拉框高度自适应时,下拉框的高度为table高度
							
							var rowHeight=$("#" + listId + _dorpDivIdPostfix +" input").eq(1).attr("value");
							var rowsHeight = parseFloat(rowHeight)
									* tr_count;
							
							var dropHeight=$("#" + listId + _dorpDivIdPostfix +" input").eq(0).attr("value");

							
							if (rowsHeight < parseFloat(dropHeight)
									|| dropHeight == "auto") {
								$("#" + listId + _dorpDivIdPostfix).css(
										"height", rowsHeight);
							} else {
								$("#" + listId + _dorpDivIdPostfix).css(
										"height", dropHeight);
							}

						}
					});

		});
	}

	/**
	 * 追加数据
	 */
	$.fn.appendSelectData = function(jsonList) {

		return this.each(function() {
			
			addList($(this), jsonList);
		});
	}

	/**
	 * 追加和初始化数据公用的方法。
	 */
	function addList(select, jsonList) {

		var listId = select.attr("id");

		var k=select.data("keyId");
		var v=select.data("valueId");
		
		if (!chooseDisplay)
			$("#" + listId + _dorpDivIdPostfix).css("display", "none");

		var tbody = $("#" + listId + _dorpDivIdPostfix + " tbody");
		var jList = eval('(' + jsonList + ')');
		$(jList).each(
				function(i) {
					
					var dataRow=jList[i];
					
					var rows=$("<tr><td id=\"" + dataRow[k] + "\">"
							+ dataRow[v] + "</td></tr>");
					
					tbody.append(rows);
//					
					for(key in dataRow)
					{
						if(key!=k&&key!=v)
						{
							var params=rows.data("params");
							if(params!=null)
							{
								eval("params."+key+"='"+dataRow[key]+"'");
							}
							else
							{	
								rows.data("params",eval("({'"+key+"':'"+dataRow[key]+"'})"));
							}
						}
					}
					
				});

		var tr_count = tbody.children("tr").size();
		
		var rowHeight=$("#" + listId + _dorpDivIdPostfix +" input").eq(1).attr("value");
		
		$("#" + listId + _dorpDivIdPostfix + "  td").css( {
			"height" : rowHeight
		});

		// alert(parseFloat(global_dataRowHeight)*tr_count);
		// 数据高度小于DIV高度，或者下拉框高度自适应时,下拉框的高度为table高度
		
		
		var rowsHeight = parseFloat(rowHeight) * tr_count
				+ parseFloat(2);// parseFloat(2)是为了在自适应时，当没有达到下拉框的高度时,不出现竖向滚动条
		
		var dropHeight=$("#" + listId + _dorpDivIdPostfix +" input").eq(0).attr("value");
		if (rowsHeight < parseFloat(dropHeight)
				|| dropHeight == "auto") {
			$("#" + listId + _dorpDivIdPostfix).css(
					"height", rowsHeight);
		} else {
			$("#" + listId + _dorpDivIdPostfix).css(
					"height", dropHeight);
		}
		

	}

	/**
	 * 初始化数据
	 */
	$.fn.setSelectData = function(jsonList) {
		return this.each(function() {
			$("#" + $(this).attr("id") + _dorpDivIdPostfix + " tbody").empty();

			addList($(this), jsonList);

		});

	}

	// //
	// //浏览器事件。
	// //
	// 窗口单击事件,用于比较当前鼠标是否在数据选择区域内,如果不在,隐藏选择框。
	var selectDropOutClick = function windowClick() {

		try {
			if(currentShowDropDivId==""||currentShowDropDivId==null)
				return ;
			var dorpDiv = $("#" + currentShowDropDivId);
			var data_div_left = dorpDiv.offset().left;
			// 编辑区的top
			var data_div_top = dorpDiv.offset().top;
			// 宽度
			var data_div_width = dorpDiv.css("width");
			// 编辑区的高度
			var data_div_height = dorpDiv.css("height");

			// // 判断是否在编辑区内,如果不在,则隐藏编辑框。
			if (parseFloat(clientX) < parseFloat(data_div_left)
					|| parseFloat(clientX) > parseFloat(data_div_left)
							+ parseFloat(data_div_width)
					|| parseFloat(clientY) < parseFloat(data_div_top)
					|| parseFloat(clientY) > parseFloat(data_div_top)
							+ parseFloat(data_div_height)) {

				dorpDiv.css("display", "none");
				if (chooseDisplay)
					chooseDisplay = !chooseDisplay;
			}
			// // 销毁widonw.click事件。
			// 在选择编辑框的时候定义浏览器click事件，在浏览器单击后销毁事件,可以节省不必要的判断，优化性能,O(∩_∩)O哈哈~
			$(document).unbind("click", selectDropOutClick);
			$(document).unbind("mousemove", selectDropOut_WindowMouseMove);
		} catch (e) {
			alert(e);
		}
	}

	var clientX;// 鼠标在浏览器窗口的位置X
	var clientY;// 鼠标在浏览器窗口的位置Y

	// 鼠标移动事件,记录鼠标的位置
	var selectDropOut_WindowMouseMove = function windowMouseMove(ev) {

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

})(jQuery);
