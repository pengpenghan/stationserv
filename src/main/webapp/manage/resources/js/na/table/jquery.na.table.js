/**
 * @author XiaoRu LI
 * @description 支持冻结行、列、排序、加载AJAX值、编辑数据的JQuery Table插件。
 * @date 2010-03-16 表格的构成 表 -区域1 -表头 -冻结行 -滚动行 -数据体 -冻结行 -滚动行 -表尾 -冻结行 -滚动行
 *       -横向滚动条 -区域2 -竖向滚动条
 *       
 *       
 * @date 2010-04-22 修正了设定宽度后不能正确显示的bug、修正了获取行号的bug
 * 
 * 
 */
(function($) {

	/**
	 * 为预防当窗口采用100%模式时,出现浏览器竖向滚动条是预留的宽度。
	 */
	var obligate4Scroll = "20";

	// 如果修改下面三项值,需要同时修改css中的height 和 line-height
	headRowHeight = "30";
	dataRowHeight = "30";
	footRowHeight = "30";


	//隐藏列在TR上的缓存Key
	var HCKV="HIDDEN_COLS_KEY_VALUE";
	
	// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// 普通表格转化为冻结行、列的表格的功能,这是必须步骤,所有对表格的操作前，必须调用这个功能。

	// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	$.natable = {

		// 默认值
		defaults : {
			freezeColIndex : "0",//冻结列
			autoColMinWidth:"100"//自动适应列的最小宽度
		}
	};

	/**
	 * 初始化数据,将普通的table文本转化为带有冻结行列、可以排序的。
	 */
	$.fn.natable = function(options) {

		// 如果没有输入值,继承默认值
		var options = $.extend( {}, $.natable.defaults, options);
		return this.each(function() {

			// TODO:输入数据有效性验证
				// 表
				var _table = $(this);
				
				
				if (options.freezeColIndex >= $(
						"#" + _table.attr("id") + " thead tr").eq(0).children(
						"td").size()) {
					alert("冻结列数必须小于总列数!");
					return false;
				}
				
				var naGridWidth="500";
				var naGridHeight="200";
				//获取表格宽度
				var table_width=$(this).attr("width");
				if (table_width != "" && table_width != null)
				{
					
					var p_index=table_width.indexOf("%");
					if(p_index<0)
					{
						naGridWidth = $(this).attr("width");
					}
					else
					{
						var abs=parseFloat(table_width.substring(0, p_index))/100;
						naGridWidth=$(window).width()*abs
						
					}
					
				}
				
				var table_height=$(this).attr("height");
				if (table_height != "" && table_height != null)
				{
					
					var p_index=table_height.indexOf("%");
					if(p_index<0)
					{
						naGridHeight = $(this).attr("height");
					}
					else
					{
						var abs=parseFloat(table_height.substring(0, p_index))/100;
						naGridHeight=$(window).height()*abs
						
					}
					
				}
				
				
				// 如果宽度>浏览器宽度,宽度=浏览器宽度。
				if (parseFloat(naGridWidth) > $(window).width())
					naGridWidth = parseFloat($(window).width())
							- parseFloat(10);

				// 防止在宽度等于窗口宽度，并有滚动条的情况下,再在窗口上出现滚动条
				
				grid_width = parseFloat(naGridWidth)
						- parseFloat(obligate4Scroll);// - 20;
				
				// 创建新的表
				var _newTableId = _table.attr("id");

				var test = $("<div></div>");

				var _newTable = $("<div></div>").attr("id", _newTableId);

				var _newTableWidth;

				var _newTableHeight;

				// 原表的对象

				var _head = _table.children("thead");

				var _body = _table.children("tbody");

				var _foot = _table.children("tfoot");

				// -----------------------------------
				//缓存字段
				_newTable.data("freezecol",options.freezeColIndex);
				// -----------------------------------

				// 创建内部div层

				var _noVerticalDataBody = $("<div></div>").attr("id",
						"noVerticalBody");

				_newTable.append(_noVerticalDataBody);

				// 冻结列表头区
				if (options.freezeColIndex > 0)
					_noVerticalDataBody
							.append("<div id=\"lock_head\"><table id=\"lock_head_table\"  ><colgroup></colgroup><tbody></tbody></table></div>");

				// 滚动的表头区
				_noVerticalDataBody
						.append("<div id=\"roll_head\" style=\"overflow: hidden; \">"
								+ "<div id=\"roll_head_inner\" ><table id=\"roll_head_table\"><colgroup></colgroup><tbody></tbody></table></div></div>");

				// 冻结数据区
				if (options.freezeColIndex > 0)
					_noVerticalDataBody
							.append("<div id=\"lock_data\" style=\"overflow: hidden;\">"
									+ "<div id=\"lock_data_inner\" ><table id=\"lock_data_table\"  ><colgroup></colgroup><tbody></tbody></table></div>"
									+ "</div>");

				// 滚动数据区
				_noVerticalDataBody
						.append("<div id=\"roll_data\" style=\"overflow: hidden;\">"
								+ "<div id=\"roll_data_inner\">"
								+ "<table id=\"roll_data_table\"><colgroup></colgroup><tbody></tbody>"
								+ "</table>" + "</div>" + "</div>	");

				// 冻结页脚区
				if (options.freezeColIndex > 0)
					_noVerticalDataBody
							.append("<div id=\"lock_foot\">"
									+ "<table id=\"lock_foot_table\" ><colgroup></colgroup><tbody></tbody></table>"
									+ "</div>");

				// 冻结页脚区
				_noVerticalDataBody
						.append("<div id=\"roll_foot\" style=\"overflow: hidden;\">"
								+ "<div id=\"roll_foot_inner\">"
								+ "<table id=\"roll_foot_table\" ><colgroup></colgroup><tbody></tbody></table></div></div>");

				_newTable.css("position", "relative");

				// 添加内层div的公共属性
				_newTable.find("div").css( {
					"position" : "relative",
					"float" : "left"
				});

				// 添加数据table的公共属性
				_newTable.find("table").addClass("natable").css( {
					"table-layout" : "fixed"

				});

				// 高度计算与初始数据加载---------------------------------------------------------------------------------------------------------

				var _colsWidth = 0;// 列的总宽度
				var _freezeColsWidth = 0;// 冻结列的总宽度
				var _scollColsWidth = 0;// 滚动的列的总宽度
				var _rowsHeight = 0;// 行的总高度
				var _freezeHeadRowsHeight = 0// 冻结head行的总高度
				var _dataBodyRowsHeight = 0;// 数据区高度
				var _freezeFootRowsHeight = 0// 冻结foot行的总高度

				var _head_trs = _head.children("tr");// table>thead>tr对象

				var _headRowsCount = _head_trs.size();// table>thead>tr的行数

				var colsWidth = new Array();// 每列的宽度的数组


				// 计算列宽、冻结列宽、滚动列宽
				if (_headRowsCount > 0) {
					//最后一行的列
					var _t_head_tds = _head_trs.eq(_headRowsCount-1).children("td");
					var freeze = 0;
					// 获取到固定列宽度，计算出自动列的宽度，一起加到列宽数组中。
					var fix_cols_width = 0 // 固定列的宽度总和

					var autoColIndex = 0;// 自适应列的Index

					var validateAutoCount = 0;// 判断自适应宽度的列,只有为1才是有效的
					_t_head_tds
							.each(function(currentColIndex) {
								//alert($(this).attr("width"));
								if ($(this).attr("width") != ""
										&& $(this).attr("width") != "NaN") {

									fix_cols_width += parseFloat($(this).attr(
											"width"));
									colsWidth[currentColIndex] = $(this).attr(
											"width");
								} else {
									
									// 如果是，则取动态运行的ID,如果宽度为0,
									
									colsWidth[currentColIndex] = parseFloat($(this).width())>parseFloat(options.autoColMinWidth)?$(this).width():options.autoColMinWidth;
									NaNWidthColIndex = currentColIndex;
									validateAutoCount++;
								}
							});


					if (validateAutoCount == 0) {
						alert("表格必须有一列的宽度是自适应宽度,不能转换当前表格!");
						return false;
					}

					if (validateAutoCount > 1) {
						alert("表格只能有一列的宽度是自适应宽度,\n当前自适应宽度列数是:"
								+ validateAutoCount + "列,\n不能转换当前表格!");
						return false;
					}

					// 如果table运行时总宽度>(固定列总宽度+自适应列的宽度），则自适应列的宽度为= 总宽度-固定列的宽度
					// parseFloat(obligate4Scroll)是在上面有代码减去的。
					if (parseFloat(naGridWidth) > parseFloat(fix_cols_width)
							+ parseFloat(colsWidth[NaNWidthColIndex])) {
						
						colsWidth[NaNWidthColIndex] = grid_width
								- fix_cols_width;
								
					}

					// 计算冻结列的长度
					_t_head_tds.each(function(currentColIndex) {
						_colsWidth += parseFloat(colsWidth[currentColIndex]);

						if (freeze < parseFloat(options.freezeColIndex)) {
							_freezeColsWidth += parseFloat(colsWidth[freeze]);
							freeze++;
						}
					});
					// 滚动列的宽度=总列数-固定列的宽度
					_scollColsWidth = _colsWidth - _freezeColsWidth;
				} else {
					alert("至少有一行表头!");
					return false;
				}

				if (_freezeColsWidth > grid_width) {
					alert("表格宽度必须大于冻结列宽度+20px,,不能转换当前表格!");
					return;
				}

				var _bodyRowsCount = _body.children("tr").size();// table>tbody>tr的行数

				var _footRowsCount = _foot.children("tr").size();// table>tfoot>tr的行数

				// 行的总高度
				_freezeHeadRowsHeight = _headRowsCount * headRowHeight;
				_dataBodyRowsHeight = _bodyRowsCount * dataRowHeight;
				_freezeFootRowsHeight = _footRowsCount * footRowHeight;

				_rowsHeight = _freezeHeadRowsHeight + _dataBodyRowsHeight
						+ _freezeFootRowsHeight;

				if (_freezeHeadRowsHeight + _freezeFootRowsHeight >= naGridHeight) {
					alert("表格高度必须大于冻结行高度总和,不能转换当前表格!");
					return;
				}

				//				
				// 滚动条判断
				var horizontal_bar = false;// 横向滚动条
				var vertical_bar = false;// 竖向滚动条

				// 判断是否该有横向滚动条,如果列长度<=table的总长度,则不需要横向滚动条
				if (_colsWidth <= grid_width)
					_newTableHeight = naGridHeight;
				else {
					// 否则添加滚动条的宽度
					_newTableHeight = parseFloat(naGridHeight)
							+ parseFloat("17");
					horizontal_bar = true;
				}

				// 判断是否该有竖向滚动条,如果总行数高度<=table的总高度,则不需要竖向滚动条
				if (_rowsHeight <= naGridHeight) {
					_newTableWidth = parseFloat(grid_width) + parseFloat("20");

				} else {
					_newTableWidth = parseFloat(grid_width) + parseFloat("20");
					vertical_bar = true;

				}

				// 横向滚动条
				if (horizontal_bar) {
					_noVerticalDataBody
							.append("<div id=\"horizontal_bar\"   style=\"overflow-x: auto;overflow-y: hidden;   \">"
									+ "<div id=\"horizontal_roll\" ></div>"
									+ "</div>	");
				}

				// 竖向滚动条

				_newTable
						.append("<div id=\"vertical_bar\"  style=\"overflow-y: auto;overflow-x: hidden; \">"
								+ "<div id=\"vertical_roll\"></div>" + "</div>");

				// 表格属性
				_newTable.css("width", _newTableWidth);
				_newTable.css("height", _newTableHeight);

				// 带有高度等于带有滚动条判断的高度,宽度等于用户设定的宽度
				_newTable.find("#noVerticalBody").css("width",
						parseFloat(grid_width));
				_newTable.find("#noVerticalBody")
						.css("height", _newTableHeight);

				// 为各个div添加高度和宽度。使用each是,是因为遍历一次后，自动跳出,节省运行时间。

				// 冻结列标题：宽度=冻结列宽度,高度=冻结标题的高度。
				_newTable.find("#lock_head").each(function() {

					$(this).css("width", _freezeColsWidth);
					$(this).css("height", _freezeHeadRowsHeight);
					return false;
				});
				// 冻结标题列数据： 宽度=冻结列总宽度
				_newTable.find("#lock_head_table").each(function() {
					$(this).css("width", _freezeColsWidth);
					return false;
				});

				// --------滚动标题： 宽度=用户设定宽度-冻结列宽度，高度=标题行高
				_newTable.find("#roll_head").each(function() {

					$(this).css("width", grid_width - _freezeColsWidth);
					$(this).css("height", _freezeHeadRowsHeight);
					return false;
				});

				// -----滚动标题内的数据表格 宽度=滚动列宽度
				_newTable.find("#roll_head_table").each(function() {

					$(this).css("width", _scollColsWidth);
					return false;
				});

				// ----数据冻结区 ： 宽度=冻结列宽度 ，高度=用户设定总高度- 冻结表头高度-冻结表尾高度
				_newTable.find("#lock_data").each(
						function() {

							$(this).css("width", _freezeColsWidth);
							$(this).css(
									"height",
									naGridHeight - _freezeHeadRowsHeight
											- _freezeFootRowsHeight);
							return false;
						});

				// ----数据冻结表:宽度=冻结列宽度
				_newTable.find("#lock_data_table").each(function() {
					$(this).css("width", _freezeColsWidth);
					return false;
				});

				// ---滚动数据区 宽度=用户设定宽度-冻结列宽度 ，高度=用户设定总高度- 冻结表头高度-冻结表尾高度

				_newTable.find("#roll_data")
						.each(
								function() {
									$(this).css("width",
											grid_width - _freezeColsWidth);
									$(this).css(
											"height",
											naGridHeight
													- _freezeHeadRowsHeight
													- _freezeFootRowsHeight);
									return false;
								});

				// ---滚动数据区表 宽度=滚动列数的宽度
				_newTable.find("#roll_data_table").each(function() {
					$(this).css("width", _scollColsWidth);
					return false;
				});

				// ---冻结页脚区 宽度=冻结列宽度 ，高度=冻结表尾高度

				_newTable.find("#lock_foot").each(function() {
					$(this).css("width", _freezeColsWidth);
					$(this).css("height", _freezeFootRowsHeight);
					return false;
				});

				// ---冻结页脚数据区 宽度=冻结列宽度
				_newTable.find("#lock_foot_table").each(function() {
					$(this).css("width", _freezeColsWidth);
				});

				// ---滚动页脚区 宽度=用户设定的宽度-冻结列宽度 ,高度=冻结表尾高度
				_newTable.find("#roll_foot").each(function() {
					$(this).css("width", grid_width - _freezeColsWidth);
					$(this).css("height", _freezeFootRowsHeight);
					return false;
				});
				// ---滚动页脚区表 宽度=滚动的列的宽度
				_newTable.find("#roll_foot_table").each(function() {
					$(this).css("width", _scollColsWidth);
					return false;
				});

				// 横向滚动条外层
				// 宽度=用户设定宽度-3px（注：在IE中需要减去3px，不然会出现挤出的情况），高度=17px（滚动条高度）
				_newTable.find("#horizontal_bar").each(function() {
					$(this).css("width", grid_width - 3);
					$(this).css("height", "17");
					return false;
				});

				// 横向滚动条内层 宽度=所有列的宽度 , 高度=17px
				_newTable.find("#horizontal_roll").each(function() {
					$(this).css("width", _colsWidth);
					$(this).css("height", "17");
					return false;
				});
				// 纵向滚动条的外层 高度=等于带有滚动条计算后的总高度 ,宽度=17px;
				_newTable.find("#vertical_bar").each(function() {
					$(this).css("width", "17");
					$(this).css("height", _newTableHeight);
					return false;
				});

				// 纵向滚动条内层 高度=上冻结行高度+下冻结行高度+横向滚动条 + 数据区（tbody）总行数的总高度
				var horizontal_bar_height = 0;// 横向滚动条高度
				if (horizontal_bar)
					horizontal_bar_height = "17";
				_newTable
						.find("#vertical_roll")
						.each(
								function() {
									$(this).css("width", "17");
									$(this)
											.css(
													"height",
													_freezeHeadRowsHeight
															+ _dataBodyRowsHeight
															+ _freezeFootRowsHeight
															+ parseFloat(horizontal_bar_height));
									return false;
								});
				// alert(_newTable.find("#vertical_roll").css("height"));
				// //----------------------------------------------------------------------------------
				// //----表头行-------------------------------------------------------------------------
				// //-----------------------------------------------------------------------------------



				// 标题行数据加载
				var _lock_head_table = _newTable.find("#lock_head_table");
				var _roll_head_table = _newTable.find("#roll_head_table");
				// table>thead>tr对象
				
				_head.children("tr").each(function(rowIndex) {
					// 原表中tr下面的Td对象集
						var _t_head_tds = $(this).children("td");

						var freeze_tr = $("<tr></tr>").addClass("f_head");// 冻结表头
						var scoll_tr = $("<tr></tr>").addClass("s_head");// 滚动表头
						var freeze_cols_width = $("<div></div>");// 用于创建cols约束的临时div
						var scoll_cols_width = $("<div></div>");// 用于创建cols约束的临时div
					
					if(rowIndex<_headRowsCount-1)
					{
						var currentColIndex=0;
						_t_head_tds.each(function() {
							// 如果当列小于冻结列,向冻结表中添加
								currentColIndex+=parseFloat($(this).attr("colspan"));//计算合并列
								if (currentColIndex-1 < options.freezeColIndex) {
									freeze_tr.append("<td id='"
											+ $(this).attr("id") + "' align='"
											+ $(this).attr("align") + " ' colspan='"+$(this).attr("colspan")+"'>"
											+ $(this).html() + "</td>");
								} else {
									scoll_tr.append("<td id='"
											+ $(this).attr("id") + "' align='"
											+ $(this).attr("align") + "'  colspan='"+$(this).attr("colspan")+"'>"
											+ $(this).html() + "</td>");
								}
						
						_lock_head_table.children("tbody").append(freeze_tr);
						_roll_head_table.children("tbody").append(scoll_tr);
						});
	
						
					}
					else//以最后一行表头为准,前面的表头只是显示
					{
						
						//在页面上显示的列的数组,在获取隐藏列时候使用。
						var showColumns="";
						
						_t_head_tds.each(function(currentColIndex) {
							
							
							// 如果当列小于冻结列,向冻结表中添加
								if (currentColIndex < options.freezeColIndex) {
									freeze_cols_width.append("<col WIDTH="
												+ colsWidth[currentColIndex]
												+ ">");
									freeze_tr.append("<td id='"
											+ $(this).attr("id") + "' align='"
											+ $(this).attr("align") + "'>"
											+ $(this).html() + "</td>");
									

								} else {
									scoll_cols_width.append("<col WIDTH="
												+ colsWidth[currentColIndex]
												+ ">");
									scoll_tr.append("<td id='"
											+ $(this).attr("id") + "' align='"
											+ $(this).attr("align") + "'>"
											+ $(this).html() + "</td>");

								}


							});
						
					
						_lock_head_table.children("colgroup").append(
								freeze_cols_width.html());
						_roll_head_table.children("colgroup").append(
								scoll_cols_width.html());
						_lock_head_table.children("tbody").append(freeze_tr);
						_roll_head_table.children("tbody").append(scoll_tr);
					}



					});

				// //----------------------------------------------------------------------------------
				// //----数据行-------------------------------------------------------------------------
				// //-----------------------------------------------------------------------------------
				var _lock_data_table = _newTable.find("#lock_data_table");
				var _roll_data_table = _newTable.find("#roll_data_table");

				// 找到锁定表头/滚动表头的第最后一行Td（最有一行才是最终的一对一的类，前面的列可能是合并表头类）
				var lock_head_table_tds = _lock_head_table.children("tbody")
						.children("tr:last").children("td");
				var rool_head_table_tds = _roll_head_table.children("tbody")
						.children("tr:last").children("td");

				// 数据加载
				var freeze_cols_width = $("<div></div>");// 用于创建cols约束的临时div
				var scoll_cols_width = $("<div></div>");// 用于创建cols约束的临时div
				// 不管是否有数据,先将数据行的宽度和表头行的宽度一致，这样便于在加载空行后，在通过插入行或单独加载时，就无需添加了。
				_head.children("tr:last").children("td").each(function(index){
//					
					if (index < options.freezeColIndex) {		
							freeze_cols_width.append("<col WIDTH="
									+ colsWidth[index] + ">");
					} else {
						scoll_cols_width.append("<col WIDTH="
								+ colsWidth[index] + ">");
					}
//					
				});
				
				_lock_data_table.children("colgroup").append(
						freeze_cols_width.html());
				_roll_data_table.children("colgroup").append(
						scoll_cols_width.html());
				
				
				//加载数据
				_body_trs = _body.children("tr");// table>tbody>tr对象
				_body_trs.each(function() {

					var _t_body_tds = $(this).children("td");// 原表中tr下面的Td对象集
						var freeze_tr = $("<tr></tr>").addClass("f_body");// 冻结数据行
						var scoll_tr = $("<tr></tr>").addClass("s_body");// 滚动数据行
						_t_body_tds
								.each(function(index) {

									if (index < options.freezeColIndex) {

										freeze_tr.append("<td headers="
												+ lock_head_table_tds.eq(index).attr("id") + " align="
												+ $(this).attr("align") + ">"
												+ $(this).html() + "</td>");
									} else {

										scoll_tr
												.append("<td headers="
														+ rool_head_table_tds
																.eq(index- options.freezeColIndex)
																.attr("id")
														+ " align="
														+ $(this).attr("align")
														+ ">" + $(this).html()
														+ "</td>");

									}
								});
						// 冻结数据区
						_lock_data_table.children("tbody").append(freeze_tr);
						// 滚动数据区
						_roll_data_table.children("tbody").append(scoll_tr);
					});

				// //----------------------------------------------------------------------------------
				// //----页脚行-------------------------------------------------------------------------
				// //-----------------------------------------------------------------------------------
				// 页脚
				var _lock_foot_table = _newTable.find("#lock_foot_table");
				var _roll_foot_table = _newTable.find("#roll_foot_table");
				
				//加载列宽约束
				_lock_foot_table.children("colgroup").append(
								freeze_cols_width.html());
				_roll_foot_table.children("colgroup").append(
								scoll_cols_width.html());
					
				// 数据加载
				_foot_trs = _foot.children("tr");// table>tbody>tr对象
				_foot_trs.each(function() {

					var _t_foot_tds = $(this).children("td");// 原表中tr下面的Td对象集
						var freeze_tr = $("<tr></tr>").addClass("f_foot");// 冻结数据行
						var scoll_tr = $("<tr></tr>").addClass("s_foot");// 滚动数据行
					
						_t_foot_tds
								.each(function(index) {
									if (index < options.freezeColIndex) {
										freeze_tr.append("<td align="
												+ $(this).attr("align") + ">"
												+ $(this).html() + "</td>");
									} else {
										scoll_tr.append("<td align="
												+ $(this).attr("align") + ">"
												+ $(this).html() + "</td>");
									}
								});


						_lock_foot_table.children("tbody").append(freeze_tr);
						_roll_foot_table.children("tbody").append(scoll_tr);
					});

				// 滚动条事件定义
				_newTable.find("#horizontal_bar").scroll(function() {
					scrollChange(_newTableId);
				});
				_newTable.find("#vertical_bar").scroll(function() {
					scrollChange(_newTableId);
				});


				// 鼠标悬停变色
				_lock_data_table.live("mousemove", function() {
					$(this).addClass("over");
					$(this).addClass("over");
				});
				_lock_data_table.live("mouseout", function() {
					$(this).removeClass("over");
				});

				_roll_data_table.live("mousemove", function() {
					$(this).addClass("over");
					$(this).addClass("over");
				});
				_roll_data_table.live("mouseout", function() {
					$(this).removeClass("over");
				});

				// 间隔色
				$("#" + _newTableId + " #lock_data_table tr:odd").addClass(
						"alt");
				$("#" + _newTableId + " #roll_data_table tr:odd").addClass(
						"alt");

				// 加载变更以后的Table
				_table.replaceWith(_newTable);
				
				//元素类型
				_newTable.data("elementType","NaTable");
				// alert(_newTable.html());
			});

	};

	
	
	/**
	 * 获取元素类型
	 */
	$.fn.getElementType = function() {
		return $(this).data("elementType");
	}
	
	/**
	 * 滚动条事件
	 */
	function scrollChange(_newTableId) {
		// 横向
		$("#" + _newTableId + " #roll_head_inner").css("left",
				-$("#" + _newTableId + " #horizontal_bar").scrollLeft());// );

		$("#" + _newTableId + " #roll_foot_inner").css("left",
				-$("#" + _newTableId + " #horizontal_bar").scrollLeft());// );
		$("#" + _newTableId + " #roll_data_inner").css("left",
				-$("#" + _newTableId + " #horizontal_bar").scrollLeft());// );

		// 竖向
		$("#" + _newTableId + " #lock_data_inner").css("top",
				-$("#" + _newTableId + " #vertical_bar").scrollTop());// );
		$("#" + _newTableId + " #roll_data_inner").css("top",
				-$("#" + _newTableId + " #vertical_bar").scrollTop());// );

	}
	;

	// TODO:当浏览器窗口大小变化时,采用百分比的宽度时候,需要调整。
	function resizer(table) {

	}
	;



	// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// 表格编辑功能,可以和任何UI元素绑定

	// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * 
	 * @date:2010-03-20 22：33
	 * @description: 编辑功能
	 * @remark:做一个动态输入框是曲折的，刚开始使用了JQuery的hover事件，在Td里面加入输入框, 感觉很爽,但是当尝试select时，发现不能选择下拉框值，哭笑不得，后来尝试了mousemove，mouseover等各类事件，
	 *                                                       总不能满意，后来突然灵感来一冒，想到如果能够在选择其他的dom对象时候，判断ID和之前的不同，不是可以顺利的显示当前需要
	 *                                                       编辑的输入和消除前一个输入的编辑框了吗，于是赶紧试了一下，用"grid_"+long型时间作为ID的，哈哈，搞定！
	 * 
	 * 
	 * 
	 * 
	 */
	var editCols = new Array();// 存放编辑列
	var editColsType = new Array();// 存放编辑列的类型(i|input)/(s|select)/(o|operate)
	var editColsBindElementId = new Array();// 绑定的对象
	var editColsAlways = new Array();// 编辑类型（true/fase）
	/**
	 * 绑定编辑列
	 * 
	 * @param colId:
	 *            绑定列的id
	 * @param type:操作类型
	 *            input /select/operate 或者 i/s/o
	 * @param bindElementId:需要绑定，用于操作的对象ID
	 * @param clickShow:是否单击显示，默认=false.如果为ture,则全部显示。
	 */
	$.fn.setEditCol = function(colId, type, bindElementId, always) {
		var index = editCols.length;
		editCols[index] = colId;
		editColsType[index] = type;
		editColsBindElementId[index] = bindElementId;
		editColsAlways[index] = always;
	};

	var clientX;// 鼠标在浏览器窗口的位置X
	var clientY;// 鼠标在浏览器窗口的位置Y
	// 用于临时存放上一个编辑选择的Td的ID,用于当改变选择输入区时，消除上一个输入区。
	var priEdit_SelectTdId = "";
	var priEdit_OldValue = "";

	// 设置编辑框的背景色
	var editBgColor = "";

	/**
	 * insert时的参数
	 * 
	 */
	$.startEdit = {
		// 默认值
		defaults : {
			editBgColor : "yellow"// 编辑框的背景色,默认为黄色
		}
	};

	$.fn.startEdit = function(options) {

		var options = $.extend( {}, $.startEdit.defaults, options);

		editBgColor = options.editBgColor;
		// 获取到每个符合条件的table
		return this.each(function() {
			var talble_id = $(this).attr("id");

			// 为每个单元格赋上事件
				$("#" + talble_id + " #lock_data_table td").live("click",
						function() {
							enabledEdit($(this));// 编辑
					});

				$("#" + talble_id + " #roll_data_table td").live("click",
						function() {
							enabledEdit($(this));

						});

			});

	};

	// 使用了td 的 headers属性和表头关联，headers中存放了表头的title。
	function enabledEdit(cell) {

		var headers = cell.attr("headers");
		if (cell.attr("headers") == "") {
			alert("headers值为空,不能定位!");
			return false;
		}

		var is_edit = false;// 是否编辑列
		// 为当前单元格匹配绑定的元素,绑定类型,操作方式。
		var type = "";
		var bindElementId = "";
		var alway = false;
		for (i = 0; i < editCols.length; i++) {
			if (editCols[i] == headers) {
				type = editColsType[i];
				bindElementId = editColsBindElementId[i];
				alway = editColsAlways[i];
				is_edit = true;
				break;// 和查找的匹配,则跳出。
			}

		}

		// 如果当前的td的ID为空,赋新的ID,
		// 为了避免ID重复，id="grid_"+long型当前时间（用户点击编辑单元格时间）。O(∩_∩)O~~
		if (cell.attr("id") == "" || cell.attr("id") == null) {
			var d = new Date();
			cell.attr("id", "grid_" + d.getTime());
		}

		// 如果当前的ID和上一个编辑的ID不相同,则保存上一个编辑的单元格,并且让当前编辑单元格可以编辑。
		if (cell.attr("id") != priEdit_SelectTdId) {

			// 在编辑前,保存上一个数据
			savePriEditValue();

			// 如果不是,则不做任何操作
			if (!is_edit)
				return false;

			// 将当前的单元格的ID赋值
			priEdit_SelectTdId = cell.attr("id");
			// 当前单元格在编辑前的值
			priEdit_OldValue = cell.html();
			// 清空当前单元格
			cell.empty();

			// 绑定对象。
			var bindElement = $("#" + bindElementId).clone(true);
			bindElement.show();
			bindElement.css( {
				"width" : parseFloat(cell.css("width")),
				"height" : parseFloat(cell.css("height"))
			});
			cell.append(bindElement);

			if (type == "i" || type == "input")// 如果是输入框，则保存Text
				cell.children().attr("value", priEdit_OldValue);//
			else if (type == "s" || type == "select")// 如果是选择框,则保存value和Text
			{
				cell.children().attr("value", priEdit_OldValue);//
				cell.children().attr("name", cell.attr("abbr"));//
			}

			// 设置选中输入框的背景色
			if (type != "o" && type != "operate") {
				bindElement.css("background-color", editBgColor);
			}

			bindElement.focus();

		}

		// 在可编辑后,定义单击事件和鼠标移动事件。用于处理编辑区的隐藏.
		$(document).bind("click", natableEditEnd);
		$(document).bind("mousemove", natable_WindowMouseMove);
	}

	/**
	 * 将上一个操作的编辑框进行数据保存。并销毁编辑框。
	 */
	function savePriEditValue() {

		if (priEdit_SelectTdId != "") {
			// 获取到上一个操作的对象
			pri_cell = $("#" + priEdit_SelectTdId);

			var headers = pri_cell.attr("headers");
			// 为当前单元格匹配绑定的元素,绑定类型,操作方式。
			var type = "";
			var bindElementId = "";
			var alway = false;
			for (i = 0; i < editCols.length; i++) {
				if (editCols[i] == headers) {
					type = editColsType[i];
					bindElementId = editColsBindElementId[i];
					alway = editColsAlways[i];
					break;
				}

			}

			var edit_value = "";// 编辑的值
			var edit_text = "";// 编辑显示的文本
			if (type == "i" || type == "input")// 如果是输入框，则保存Text
			{
				edit_text = pri_cell.children().eq(0).attr("value");//
			}
			else if (type == "s" || type == "select")// 如果是选择框,则保存value和Text
			{
				edit_value = pri_cell.children().eq(0).getKey();//自定义select的key  @see ： jquery.na.select.js 
				edit_text = pri_cell.children().eq(0).getValue();//自定义select的value  @see ： jquery.na.select.js 
			}


			// 将绑定的对象释放到body中去，并移除。
			var backElement=pri_cell.children();
			backElement.hide();
			$("body").append(backElement)
			pri_cell.children().remove();
			priEdit_SelectTdId = "";
			
						// 赋值
			if (type != "o" && type != "operate") {
				pri_cell.html(edit_text);
				pri_cell.attr("abbr", edit_value);
			} else {
				pri_cell.html(priEdit_OldValue);
			}

			// 销毁widonw.click 和widonw.mousemove事件。
			$(document).unbind("click", natableEditEnd);
			$(document).unbind("mousemove", natable_WindowMouseMove);
		}

	}

	// //
	// //浏览器事件。
	// //
	// 窗口单击事件,用于比较当前鼠标是否在编辑区域
	var natableEditEnd = function windowClick() {

		try {

			if (priEdit_SelectTdId == "")
				return;

			// 如果上一个的编辑的Td的是存在的。
			if ($("#" + priEdit_SelectTdId) != "") {
				// 获取到此编辑的表的div
				// td->parent:tr->parent:tbody->parent:table->parent:div->parent:div
				var _editTable = $("#" + priEdit_SelectTdId).parent().parent()
						.parent();
				var _editTableDiv = _editTable.parent().parent();

				// alert(_editTableDiv.attr("id"));
				// 编辑区的left
				var data_div_left = _editTableDiv.parent().offset().left;
				// 编辑区的top
				var data_div_top = _editTableDiv.offset().top;
				// 宽度
				var data_div_width = _editTableDiv.parent().css("width");
				// 编辑区的高度
				var data_div_height = 0;
				// 如果数据表格高度<数据区DIV高度,高度采用表格高度,否则采用数据区DIV高度

				if (parseFloat(_editTable.height()) < parseFloat(_editTableDiv
						.css("height")))
					data_div_height = _editTable.height();
				else
					data_div_height = _editTableDiv.css("height");

				// 判断是否在编辑区内,如果不在,则隐藏编辑框。
				if (parseFloat(clientX) < parseFloat(data_div_left)
						|| parseFloat(clientX) > parseFloat(data_div_left)
								+ parseFloat(data_div_width)
						|| parseFloat(clientY) < parseFloat(data_div_top)
						|| parseFloat(clientY) > parseFloat(data_div_top)
								+ parseFloat(data_div_height)) {

					// 保存
					savePriEditValue();

				}

			}
		} catch (e) {
			alert(e);
		}
	}

	// 鼠标移动事件,记录鼠标的位置
	var natable_WindowMouseMove = function windowMouseMove(ev) {

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





	// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// 获取表格中的数据,以JSON返回 2010.03.24 00：26

	// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	$.getTableData = {
		// 默认值
		defaults : {
			// 宽度
			startRow : "0",// 要获得数据的开始行<0,表示第一行
			endRow : "-1",// 要获得数据的结束行,<0,表示最后一行
			startCol : "0",// 要获得数据的开始行<0,表示第一列
			endCol : "-1"// 要获得数据的开始行<0,表示最后一行
		}
	};

	// 默认获取这个表格的全部数据,通过指定区域，可以获取指定区域中的数据
	$.fn.getTableData = function(options) {

		var options = $.extend( {}, $.getTableData.defaults, options);

		// TODO:输入数据有效性验证

		var _table = $(this);// 获取到table

		var _tableId = _table.attr("id");
		// 获取到冻结/滚动数据区数据。
		var lock_data_table = $("#" + _tableId + " #lock_data_table");
		var rool_data_table = $("#" + _tableId + " #roll_data_table");

		var lock_trs = lock_data_table.children("tbody").children("tr");
		var roll_trs = rool_data_table.children("tbody").children("tr");
		
		
		// 获取到表格的列数,数据行数
		var lock_cols = lock_trs.eq(0).children("td").size();
		var roll_cols = roll_trs.eq(0).children("td").size();
		var cols = parseFloat(lock_cols) + parseFloat(roll_cols);
		var rows = roll_trs.size();

		if (options.endRow == "-1")
			options.endRow = rows;
		if (options.endCol == "-1")
			options.endCol = cols;

	
		//是否大于一行需要获取的数据。
		var moreThenOneRow=options.startRow==options.endRow?false:true;
		
		// 在此处有三种种数据构建方式,一是通过总的行、列的循环获取，第二种是分别获取到两个数据集,
		// 并将两个数据集按照行的存储到两个array数组中。在最后将两个数据拼接。
		// 第三种采用JQuery
		// each方式，将在滚动数据table的each中调用对应的冻结行,这里将用滚动数据table的each而不用冻结，是因为
		// 有肯能没有冻结列。
		// 构建数据返回json数据


		//从零开始计算的总行数
		var rowCount4index = parseFloat(rows) - parseFloat(1);

		
		var jsonBuilder = "[";
		roll_trs.each(function(i) {

			if (i < options.startRow - 1 || i >= options.endRow)
				return;

			var trbuilder = "{";

			// 获取到对应的锁定列的值
				if (lock_cols > 0) {
					lock_trs.eq(i).children("td").each(
							function(j) {

								if (j < options.startCol - 1
										|| j >= options.endCol)
									return;
								trbuilder += "\"" + $(this).attr("headers")
										+ "\" : "
								
							    var obj=$(this).children();
								if(obj.html()==null )
								{
									trbuilder += $(this).attr("abbr") != "" ? "\""
											+ $(this).attr("abbr") + "\"" : "\""
											+ $(this).text() + "\",";
								}
								else
								{
									var value=getInsertObjectValue(obj);
									trbuilder += "\"" +value+ "\",";
								}
							});
				}

				// 获取到对应的锁定列的值
				$(this)
						.children("td")
						.each(
								function(j) {

									if (lock_cols <= 0
											&& (j < options.startCol - 1 || j >= options.endCol))// 如果锁定列没有
										return;
									else if (lock_cols > 0
											&& ((lock_cols + j) < options.startCol - 1 || ((lock_cols + j)) > options.endCol))// 当有锁定列时
										return;
									trbuilder += "\"" + $(this).attr("headers")
											+ "\" : ";

									
									var obj=$(this).children();
									if(obj.html()==null )
									{
										trbuilder += $(this).attr("abbr") != "" ? "\""
												+ $(this).attr("abbr") + "\"" : "\""
												+ $(this).text() + "\",";
									}
									else
									{
										var value=getInsertObjectValue(obj);
										trbuilder += "\"" +value+ "\",";
									}
								});
								
								
					//获取缓存中的列值
					var HCKY_PARAMS=$(this).data(HCKV)
					if(HCKY_PARAMS!=null)
					{
						for(key in HCKY_PARAMS )
						{
							trbuilder+="\"" + key+ "\" : \""+HCKY_PARAMS[key]+"\"," ;
						}
					}
					
					
	
					
				
				var trblength=trbuilder.length;
				if (trblength > 0)
				{
					if(trblength>1)
					{
						trbuilder=trbuilder.substring(0, trblength-1);
					}
					trbuilder += "}";
				}
					

				jsonBuilder += trbuilder;

				if(moreThenOneRow)
					jsonBuilder += i < rowCount4index ? "," : "";

			});

		jsonBuilder += "]";
		jsonBuilder = (jsonBuilder == "[]" || jsonBuilder == "[{}]") ? ""
				: jsonBuilder;
		return jsonBuilder;

	};

	/**
	 * 内部方法，获取到单元格内部嵌入的元素的值
	 */
	getInsertObjectValue=function(element)
	{
		var type = element.getElementType();
		
		if (type == null) {
			type = element.attr("type");
			if (type == "checkbox" || type == "radio") {
				return element.attr("checked");
			} else if (type == "image") {
				return element.attr("src");
			} else {
				return element.val();
			}
		} else if (type == "NaSelect") {
			return element.getKey();
		}

	}
	
	
	
	

	
	

	// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// 新增行的功能,可以在开始，结束，中间的任何位置插入行，也可以批量插入行

	// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * 
	 * 插入新行，默认是插入第一行,如果需要修改插入行的位置 可以修改 insertRowIndex
	 * 值，小于0，是最后一行，大于0，是第（insertRowIndex+1）行的后面追加一跳
	 * 
	 */

	/**
	 * insert时的参数
	 * 
	 */
	$.insertRow = {
		defaults : {
			insertRowIndex : 0,// 插入位置
			insertRows : 1	// 插入的行数
		}

	};

	/**
	 * 
	 * 
	 * @date ：2010-03-20 15:23
	 * @description:新增行.
	 * @remark:此时此刻，我很郁闷, 打开js准备写编辑table的功能时，发现昨天晚上在火车上写的insertRow功能测试成功后，
	 *                    估计是因为不小心误操作删除了所有的代码，刚好笔记本电池没电了，而没有得到恢复就自动关机了。
	 *                    2个小时的努力白费了，关键是冻结行列功能又的地方做了调整，忘记是什么地方了，以后再调试发现吧，
	 *                    幸亏昨天下午上火车前提交了SVN， 如果火车能上网，我一定会提交svn的。算了，继续劳动吧。
	 * 
	 * @date:2010-03-25 12:54 
	 * @remark:今天对算法，结构进行了优化,在ff中加载1000空行,平均耗时1秒不到 、IE8下平均耗时2秒不到。
	 * 
	 */
	$.fn.insertRow = function(options) {

		var options = $.extend( {}, $.insertRow.defaults, options);

		// TODO:输入数据有效性验证
		if (parseFloat(options.insertRows) < 1) {
			alert("新增行数必须大于等于1");
			return false;
		}
		
		return this.each(function() {

			var _tableId=$(this).attr("id")
			var lock_data_table = $("#"+ _tableId +" #lock_data_table");
			var lock_tr_str="";
			var roll_tr_str="";
			
			// 如果有冻结列的情况下
			if (lock_data_table.html() != null) {
				//冻结表头第一行里面的列
				var lock_head_cols = $("#"+_tableId+" #lock_head_table tbody tr:first").children("td");
					// 添加行
					for (i = 0; i < options.insertRows; i++) {
						lock_tr_str += "<tr>";
						lock_head_cols.each(function() {
							lock_tr_str += "<td headers='"+$(this).attr("id")+"'></td>";
						});
						lock_tr_str += "</tr>";
					}
				}
				// 添加滚动行
				var roll_data_table = $(this).find("#roll_data_table");
				if (roll_data_table.html() != null) {		
					//滚动表头第一行里面的列	
					var roll_head_cols = $("#"+_tableId+" #roll_head_table tbody tr:first").children("td");
						// 添加行
						for (i = 0; i < options.insertRows; i++) {
							roll_tr_str += "<tr>";
							roll_head_cols.each(function() {
								roll_tr_str += "<td headers='"+ $(this).attr("id") + "'></td>";
							});
							roll_tr_str += "</tr>";
						}
						
				}
				//加载
			    var lock_tbody=lock_data_table.find("tbody");
			    var roll_tbody = roll_data_table.find("tbody");
				var trCount = roll_tbody.find("tr").size();//取滚动区的count，不去冻结区的cout，因为肯能没有冻结区。
				// 小于0，在表格最后添加行
				if (options.insertRowIndex < 0||trCount==0)
				{
					lock_tbody.append(lock_tr_str);
					roll_tbody.append(roll_tr_str);
				}
				else if (options.insertRowIndex == 0&&trCount>0)
				{
					lock_tbody.children("tr:first").before(lock_tr_str)
					roll_tbody.children("tr:first").before(roll_tr_str)
				}
				else if (options.insertRowIndex > 0
						&& options.insertRowIndex < trCount)// 大于总行数,在表格最后添加
				{
					lock_tbody.children("tr").eq(options.insertRowIndex - 1)
							.after(lock_tr_str);
					roll_tbody.children("tr").eq(options.insertRowIndex - 1)
							.after(roll_tr_str);
				}
				else if (parseFloat(options.insertRowIndex) > 0
						&& parseFloat(options.insertRowIndex) >= parseFloat(trCount))
				{
					lock_tbody.children("tr").eq(trCount - 1).after(lock_tr_str);// 在总行数内,在选定的行数的上面插入
					roll_tbody.children("tr").eq(trCount - 1).after(roll_tr_str);// 在总行数内,在选定的行数的上面插入
				}
				// 滚动条高度
				var vertical_roll = $(this).find("#vertical_roll");
				vertical_roll.css("height", parseFloat(vertical_roll
						.css("height"))
						+ parseFloat(dataRowHeight)
						* parseFloat(options.insertRows));

				//先移除奇偶样式
				$("#" + _tableId + " #lock_data_table tr")
						.removeClass("alt");
				$("#" + _tableId + " #roll_data_table tr")
						.removeClass("alt");
				//在添加奇偶样式
				$("#" + _tableId + " #lock_data_table tr:odd")
						.addClass("alt");
				$("#" + _tableId + " #roll_data_table tr:odd")
						.addClass("alt");

			});

	};

	// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// 向表格中加载JSON数据 2010.03.24 16:00 
	// 2010.03.38 增加了在数据加载时,提供给开发人员自定义开发的接口 
	// 
	// 
	// /**
	// * 在数据加载时用于实现用户自定义的功能
	// * @param tableId : 需要渲染的表
	// * @param td:当前的td
	// * @param parentTr ：当前td的父节点tr
	// * @param fosterParentTr ：当前td的养父tr（如果td在滚动列区,则养父为td所在行在冻结列区的行。如果td在冻结列区,则养父为td所在行在滚动列区的行）
	// * @param rowindex:当前td所在的行的索引，从0开始。
	// */
	// getUserRomance=function(tableId,td,parentTr,fosterParentTr)
	// 
	
	// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	
		/**
	 * @param jsonStr :json格式的数据
	 * @param userRomance ：是否用户自定义控制
	 */
	$.fn.setTableData = function(jsonStr,userRomance) {

		
		
		//解析json对象
		var jData = eval('(' + jsonStr + ')');
		//获取到json的数据长度
		var rowsCount=jData.length;

		//alert (jData[0][0]);
		//判断是否允许缓存不存在的列,这样会在大批量数据时,影响性能。
		
		// TODO:输入数据有效性验证
		return this.each(function() {
			
			var _tableId=$(this).attr("id")
			var freezeIndex=$("#"+_tableId).data("freezecol");//冻结列

			var lock_data_body = $("#"+ _tableId +" #lock_data_table tbody");
			var roll_data_body = $("#"+ _tableId +" #roll_data_table tbody");
			
			if(rowsCount<=0)
			{
				if (freezeIndex>0) {
					lock_data_body.empty();
				}
				roll_data_body.empty();		
				return false;
			}
			
			
			var lock_tr_str="";//tr字符串
			var	roll_tr_str="";
			var col_id="";//列名称
			var col_value="";
			//qi
			var vertical_roll = $("#"+ _tableId +" #vertical_roll");
			vertical_roll.css("height","0");
			


			if (freezeIndex>0) {
				
				lock_data_body.empty();
				//冻结表头第一行里面的列
				var lock_head_cols = $("#"+_tableId+" #lock_head_table tbody tr:last").children("td");
				
					//性能调优,在数组里面取数比在$(this).attr("id")快,
					var cols=new Array();
					lock_head_cols.each(function(i) {
						cols[i]=$(this).attr("id");
					});
			
					// 添加行
					for (i = 0; i < rowsCount; i++) {
						lock_tr_str += "<tr>";
						lock_head_cols.each(function(index) {
							col_id=cols[index];
							col_value=jData[i][col_id];
							col_value=col_value==null?"":col_value;
							lock_tr_str += "<td headers='"+col_id+"'>"+col_value+"</td>";
							
							//移除展示的项
							delete jData[i][col_id];
							
						});
						lock_tr_str += "</tr>";

					}
					
					lock_data_body.append(lock_tr_str);
				}
				
				// --------------------------------------------------------------------------------
				// 添加滚动行
				roll_data_body.empty();		
				//滚动表头第一行里面的列	
				var roll_head_cols = $("#"+_tableId+" #roll_head_table tbody tr:last").children("td");
				
				//性能调优,在数组里面取数比在$(this).attr("id")快,
				var cols=new Array();
				roll_head_cols.each(function(i) {
					cols[i]=$(this).attr("id");
				});
				// 添加行
				for (i = 0; i < rowsCount; i++) {
					
					var rowJData=jData[i];
					
					 roll_tr_str += "<tr>";
					roll_head_cols.each(function(index) {
						
						col_id=cols[index];
						col_value=rowJData[col_id];
						col_value=(col_value==null)?"":col_value;
						roll_tr_str += "<td headers='"+col_id+"'>"+col_value+"</td>";
						//移除展示的项
						delete rowJData[col_id];
					});
					
					roll_tr_str += "</tr>";

				}
	
				//添加数据
				roll_data_body.append(roll_tr_str);


				var lock_trs=lock_data_body.children("tr");
				var roll_trs=roll_data_body.children("tr");	
				
				//执行绑定隐藏列
				roll_trs.each(function(index){
//					
//					//获取隐藏列
					var rowJData=jData[index];
					
					//新的塞入json对象
					var params=$(this).data(HCKV);
					for(key in rowJData)
					{
						if(params!=null)
						{
							eval("params."+key+"=rowJData[key]");
						}
						else
						{
							var frist_data = eval("({'"+key+"':'"+rowJData[key]+"'})");
							$(this).data(HCKV,frist_data);
							params=frist_data;
						}

					}
					
					//老的塞入字符串
//					var hiddenColumn="";
//					for(key in rowJData)
//					{
//						hiddenColumn+=",'"+key+"':'"+rowJData[key]+"'";
//					}
//					if(hiddenColumn!="")
//					$(this).data(HCKV,hiddenColumn);
					
				});
				
				
				//对加载后的数据进行用户自定义渲染
				if(userRomance)
				{
					//执行用户自定义渲染 和绑定隐藏列
					roll_trs.each(function(index){
					
						if(userRomance)//用户自定义控制，调用getUserRomance方法。
						{
							var roll_tr=$(this);
							var lock_tr=null;
							if(freezeIndex>0)
								lock_tr=lock_trs.eq(index);
							roll_tr.children("td").each(function(){
									getUserRomance(_tableId,$(this),roll_tr,lock_tr,index);
							});
							//如果所冻结列
							if(freezeIndex>0)
							{
								lock_tr.children("td").each(function(){	
									getUserRomance(_tableId,$(this),lock_tr,roll_tr,index);
								});
							}
						}

					});
				}


				// 滚动条高度
				vertical_roll.css("height", parseFloat(vertical_roll
						.css("height"))
						+ parseFloat(dataRowHeight)
						* (parseFloat(rowsCount)+1));

			});
			
	}
	
	/**
	 * 追加数据
	 */
	$.fn.appendTableData = function(jsonStr,userRomance){
		//解析json对象
		var jData = eval('(' + jsonStr + ')');
		//获取到json的数据长度
		var rowsCount=jData.length;
		
		return this.each(function() {
			
			var _tableId=$(this).attr("id")
			var freezeIndex=$("#"+_tableId).data("freezecol");//冻结列

			var lock_data_body = $("#"+ _tableId +" #lock_data_table tbody");
			var roll_data_body = $("#"+ _tableId +" #roll_data_table tbody");
			
			if(rowsCount<=0)
			{	
				return false;
			}
			
			var curr_tr_count = roll_data_body.children("tr").length;  //当前表格内容区tr行数
			if(null == curr_tr_count || "" == curr_tr_count)
				curr_tr_count = 0;
			var lock_tr_str="";//tr字符串
			var	roll_tr_str="";
			var col_id="";//列名称
			var col_value="";
			//qi
			var vertical_roll = $("#"+ _tableId +" #vertical_roll");
			
			
			if (freezeIndex > 0) {

					// 冻结表头第一行里面的列
					var lock_head_cols = $(
							"#" + _tableId + " #lock_head_table tbody tr:eq(0)")
							.children("td");

					// 性能调优,在数组里面取数比在$(this).attr("id")快,
					var cols = new Array();
					lock_head_cols.each(function(i) {
						cols[i] = $(this).attr("id");
						
					});

					// 添加行
					for (i = 0; i < rowsCount; i++) {
						lock_tr_str += "<tr>";
						lock_head_cols.each(function(index) {
							col_id = cols[index];
							col_value = eval("jData[i]." + col_id + "");
							col_value = col_value == null ? "" : col_value;
							lock_tr_str += "<td headers='" + col_id + "'>"
									+ col_value + "</td>";
							//移除展示的项
							delete jData[i][col_id];
						});
						lock_tr_str += "</tr>";
					}

					lock_data_body.append(lock_tr_str);
				}
				
				// --------------------------------------------------------------------------------
				// 添加滚动行
				//滚动表头第一行里面的列	
				var roll_head_cols = $("#"+_tableId+" #roll_head_table tbody tr:eq(0)").children("td");
				
				//性能调优,在数组里面取数比在$(this).attr("id")快,
				var cols=new Array();
				roll_head_cols.each(function(i) {
					cols[i]=$(this).attr("id");
					
				});
				// 添加行
				for (i = 0; i < rowsCount; i++) {
					 roll_tr_str += "<tr>";
					roll_head_cols.each(function(index) {
						
						col_id=cols[index];
						col_value=eval("jData[i]."+col_id+"");
						col_value=(col_value==null)?"":col_value;
						roll_tr_str += "<td headers='"+col_id+"'>"+col_value+"</td>";
						//移除需要展示的项，剩下的就是需要隐藏的数据了
						delete jData[i][col_id];
					});
					
					roll_tr_str += "</tr>";
				}
	
				//添加数据
				
				roll_data_body.append(roll_tr_str);
				

				//对加载后的数据进行用户自定义控制和隐藏列加载

				var lock_trs=lock_data_body.children("tr");
				var roll_trs=roll_data_body.children("tr");
					
				
				
				//执行绑定隐藏列
				roll_trs.each(function(index){
					if(index < curr_tr_count){
					return;
				}
					//获取隐藏列
					var rowJData=jData[index-curr_tr_count];
					
					var params=$(this).data(HCKV);
					for(key in rowJData)
					{
						if(params!=null)
						{
							eval("params."+key+"=rowJData[key]");
						}
						else
						{
							var frist_data = eval("({'"+key+"':'"+rowJData[key]+"'})");
							$(this).data(HCKV,frist_data);
							params=frist_data;
						}

					}
					
				});
				
				

				roll_trs.each(function(index){
					//如果是小于追加当前的行，则不执行用户渲染
					if(index < curr_tr_count){
						return;
					}
					//执行用户自定义渲染 
					if(userRomance)//用户自定义控制，调用getUserRomance方法。
					{
						var roll_tr=$(this);
						var lock_tr=null;
						if(freezeIndex>0)
							lock_tr=lock_trs.eq(index);
						roll_tr.children("td").each(function(){
								getUserRomance(_tableId,$(this),roll_tr,lock_tr,index);
						});
						//如果所冻结列
						if(freezeIndex>0)
						{
							lock_tr.children("td").each(function(){	
								getUserRomance(_tableId,$(this),lock_tr,roll_tr,index);
							});
						}
					}
					
				
				});
		
				// 滚动条高度
				vertical_roll.css("height", parseFloat(vertical_roll
						.css("height"))
						+ parseFloat(dataRowHeight)
						* (parseFloat(rowsCount)));

			});
	}
	
	
	// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// 对具体行的操作 2010.03.25 20:32 
	
	// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * 设置指定的行的隐藏域的指定key的值
	 * index ： 行号 从0开始
	 * key ： key
	 * value ：值
	 */
	$.fn.setRowParam=function(index,key,value)
	{
		
		var _tableId=$(this).attr("id");
		var roll_data_body = $("#"+ _tableId +" #roll_data_table tbody");
		var size =roll_data_body.children().size();
		if(index>size)
		{
			alert("行号大于表格数据行!");
			return false;
		}
		
		var currentRow=roll_data_body.children().eq(index);
		
		params=currentRow.data(HCKV);
		if(params==null)//添加一个临时的隐藏了，这样params不为null，就可以处理带有正值表达式的value了
		{
			var jData = eval("({'na_temp':'na_temp'})");
			currentRow.data(HCKV,jData);
			params=jData;
		}
		
		eval("params."+key+"=value");
		

	}
	
	
	/**
	 * 获取指定的行的隐藏域的指定key的值
	 * index ： 行号 从0开始
	 * key ： key
	 */
	$.fn.getRowParam=function(index,key)
	{
		var _tableId=$(this).attr("id");
		var roll_data_body = $("#"+ _tableId +" #roll_data_table tbody");
		return roll_data_body.children().eq(index).data(HCKV)[key];
		
		
	}
	
	
	
	
	
	

	/**
	 * 获取指定Td所在的行
	 */
	$.fn.getRowIndex=function(td)
	{
		//实现原理,通过在需要获取行号的列上绑定一个缓存标识,然后通过循环找到这个标识，就可以知道当前的列所在的行了,
		//使用结束后清空tag。
		var tr=td.parent().data("currentRowIndex_LIXIAORU","tag");
		var return_index;
		//找到表格的tobody对象
		var tbody=tr.parent();
		tbody.children("tr").each(function(index){
			if($(this).data("currentRowIndex_LIXIAORU")=="tag")
				return_index= index;
			if(return_index>=0)
				return false
		});
		
		tr.data("currentRowIndex_LIXIAORU","");
		
		return return_index;
	}
	
	
	/**
	 * 获取指定行的数据，以JSON形式的字符串返回.
	 * @param rowIndex 行号,rowindex从0开始
	 */
	$.fn.getRowData=function(rowIndex)
	{
		index=parseInt(rowIndex)+1;
		var dataStr=$(this).getTableData({
			startRow : index,
			endRow : index,
			startCol : "0",
			endCol : "-1"
		});
		return dataStr;
	}

	
	/**
	 * 获取到Table的指定行的JSON对象数据,rowindex从0开始
	 */
	$.fn.getJsonDataByIndex=function(rowIndex)
	{
		
		var dataJson=eval('(' + $(this).getRowData(rowIndex) + ')');
		return dataJson[0];
	}

		
	
	/**
	 * 根据行号删除行
	 */
	$.fn.deletRow = function(rowIndex) {
		
		
		var _tableId=$(this).attr("id");
		var freezeIndex=$("#"+_tableId).data("freezecol");//冻结列
		if(freezeIndex>0)
		{
			 $("#"+ _tableId +" #lock_data_table tbody").children("tr").eq(rowIndex).remove();
		}
	
		$("#"+ _tableId +" #roll_data_table tbody").children("tr").eq(rowIndex).remove();
		
		// 滚动条高度
		var vertical_roll = $("#"+ _tableId +" #vertical_roll");
		vertical_roll.css("height", parseFloat(vertical_roll
				.css("height"))	- parseFloat(dataRowHeight));
		
	}
	
	
	/**
	 * 根据行号和列ID获取到td对象
	 * @param rowIndex: 行号
	 * @param colId:列ID
	 * @return td对象
	 */
	$.fn.getTd= function(rowIndex,colId)
	{
		var _tableId=$(this).attr("id");
		var return_td=null;
		var freezeIndex=$("#"+_tableId).data("freezecol");//冻结列
		
		if(freezeIndex>0)
		{
		 var tr=$("#"+ _tableId +" #lock_data_table tbody").children("tr").eq(rowIndex);
			tr.children("td").each(function(){
				if($(this).attr("headers")==colId)
				{
				
					return_td=$(this);
					return false;
				}
			}) 
			
		}
		if(return_td==null)
		{
		var tr=$("#"+ _tableId +" #roll_data_table tbody").children("tr").eq(rowIndex);
		tr.children("td").each(function(){
				if($(this).attr("headers")==colId)
				{
					return_td=$(this);
					return false;
				}
			
			}) ;
		}
		
		return return_td;
	}
	

	/**
	 * 根据指定的行ID,获取到其下面的所有TD对象。
	 * @param rowIndex 行Id ，从0开始
	 * @return 指定行内的所有的列对象数组
	 */
	$.fn.getRowTds = function(rowIndex) {
	
			var _tableId=$(this).attr("id");
			var freezeIndex=$("#"+_tableId).data("freezecol");//冻结列
			
			var lock_data_body = $("#"+ _tableId +" #lock_data_table tbody");
			var roll_data_body = $("#"+ _tableId +" #roll_data_table tbody");
			
			var tds=new Array();
			if(freezeIndex>0)
			{
				lock_data_body.children("tr").eq(rowIndex).children("td").each(function(i){
					
					tds[i]=$(this);
				});
			}
			
			roll_data_body.children("tr").eq(rowIndex).children("td").each(function(i){
					tds[parseFloat(freezeIndex)+i]=$(this);
			});
			return tds;
	}
	
	
	/**
	 * 根据rowIndex和指定的TD获取到其义父tr
	 * @param rowIndex 行Id ，从0开始
	 * @param td 指定的td
	 * @return 指定td的义父tr,如果没有冻结区,则义父tr为null。
	 */
	$.fn.getFosterParent = function(rowIndex,td) {
		var _tableId=$(this).attr("id");
		var tr="";
		if(td.parent().parent().parent().attr("id")=="lock_data_table")
			tr= $("#"+ _tableId +" #roll_data_table tbody").children("tr").eq(rowIndex);
		else
			tr= $("#"+ _tableId +" #lock_data_table tbody").children("tr").eq(rowIndex);
		return tr;
	}
	

	
	/**
	 * 获取到table所有的行
	 */
	$.fn.getRows=function()
	{
		var _tableId=$(this).attr("id");
		var roll_data_body = $("#"+ _tableId +" #roll_data_table tbody");
		
		var rowCount = roll_data_body.children("tr").length;  //当前表格内容区tr行数
		if(null == rowCount || "" == rowCount)
			rowCount = 0;
		
		return rowCount;
	}
	
	
	
	/**
	 * 获取到table所有的行
	 */
	$.fn.clearTable=function()
	{
		var _tableId=$(this).attr("id");
		
		var roll_data_body = $("#"+ _tableId +" #roll_data_table tbody");
		
		var lock_data_body = $("#"+ _tableId +" #lock_data_table tbody");
		
		lock_data_body.html("");
		roll_data_body.html("");
		
	}
	
	// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// 根据列ID获取列下的所有的TD 2010.03.25 20:32 
	
	// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	/**
	 * 根据列ID,获取到其下面的所有TD对象。
	 * @param colId 列Id 
	 * @return 指定列下的所有的列对象
	 */
	$.fn.getColTds = function(colId) {
	
			var _tableId=$(this).attr("id");
			var freezeIndex=$("#"+_tableId).data("freezecol");//冻结列
			var tds=new Array();
		
			if(freezeIndex>0)
			{
				var trs=$("#"+ _tableId +" #lock_data_table tbody").children("tr");
				if(trs.size()>0)
				{
					var colIndex=-1;
					
					trs.each(function(i){
						if(colIndex==-1)
						{
							$(this).children("td").each(function(j){
									if($(this).attr("headers")==colId)
									{
										tds[i]=$(this);
										colIndex=j;
									}
							});
						}
						else
						{
							tds[i]=$(this).children("td").eq(colIndex);
						}
						
					});
				}
				
			}
			if(tds.length<=0)//如果tds的长度大于0，说明已经找到了目标列
			{
				var trs=$("#"+ _tableId +" #roll_data_table tbody").children("tr");
				if(trs.size()>0)
				{
					var colIndex=-1;
					trs.each(function(i){
						if(colIndex==-1)
						{
							$(this).children("td").each(function(j){
									if($(this).attr("headers")==colId)
									{
										tds[i]=$(this);
										colIndex=j;
									}
							});
						}
						else
						{
							tds[i]=$(this).children("td").eq(colIndex);
						}
					});
				}
			}
			
			return tds;
	}
	
})(jQuery);
