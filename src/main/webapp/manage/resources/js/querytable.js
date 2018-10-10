/*
 This following code are designed and writen by Windy_sk <seasonx@163.net>
 You can use it freely, but u must held all the copyright items!
*/

var cur_row	= null;
var cur_col	= null;
var cur_cell	= null;

var act_bgc	= "#BEC5DE";
var act_fc	= "black";
var cur_bgc	= "#ccffcc";
var cur_fc	= "black";
var readDef = 0;

function clear_color(the_table){
	//the_table=Main_Tab;
	if(cur_col!=null){
		for(i=0;i<the_table.rows.length;i++){
			if( the_table.rows[i] && the_table.rows[i].cells[cur_col] )
			{
				with(the_table.rows[i].cells[cur_col]){
					style.backgroundColor=oBgc;
					//style.color=oFc;
				}
			}
		}
	}
	if(cur_row!=null){
		for(i=0;i<the_table.rows[cur_row].cells.length;i++){
			if( the_table.rows[cur_row] && the_table.rows[cur_row].cells[i] )
			{
				with(the_table.rows[cur_row].cells[i]){
					style.backgroundColor=oBgc;
					//style.color=oFc;
				}
			}
		}
	}
	if(cur_cell!=null){
		cur_cell.children[0].contentEditable = false;
		with(cur_cell.children[0].runtimeStyle){
			borderLeft=borderTop="";
			borderRight=borderBottom="";
			backgroundColor="";
			paddingLeft="";
			textAlign="";
		}
	}
}


function read_def(the_table){
	if( readDef == 0 )
	{
		for(var i=0;i<the_table.rows.length;i++){
			if( the_table.rows[i] )
			{
				for(var j=0;j<the_table.rows[i].cells.length;j++){
					if( the_table.rows[i] )
					{
						with(the_table.rows[i]){
							cells[j].oBgc = cells[j].currentStyle.backgroundColor;
							//cells[j].oFc  = cells[j].currentStyle.color;
						}
					}
				}
			}
		}
		readDef = 1;
	}
}

function get_Element(the_ele,the_tag){
	the_tag = the_tag.toLowerCase();
	if(the_ele.tagName.toLowerCase()==the_tag)return the_ele;
	while(the_ele=the_ele.offsetParent){
		if(the_ele.tagName.toLowerCase()==the_tag)return the_ele;
	}
	return(null);
}


function clickIt(){
	event.cancelBubble=true;
	var the_obj = event.srcElement;
	var i = 0 ,j = 0;
	if(cur_cell!=null && cur_row!=0){
		cur_cell.children[0].contentEditable = false;
		with(cur_cell.children[0].runtimeStyle){
			borderLeft=borderTop="";
			borderRight=borderBottom="";
			backgroundColor="";
			paddingLeft="";
			textAlign="";
		}
	}
	if(the_obj.tagName.toLowerCase() != "table" && the_obj.tagName.toLowerCase() != "tbody" && the_obj.tagName.toLowerCase() != "tr"){
		var the_td	= get_Element(the_obj,"td");
		if(the_td==null) return;
		var the_tr	= the_td.parentElement;
		var the_table	= get_Element(the_td,"table");
		read_def(the_table);
		var i 		= 0;
		clear_color(the_table);
		cur_row = the_tr.rowIndex;
		cur_col = the_td.cellIndex;
		if(cur_row!=0){
			for(i=0;i<the_tr.cells.length;i++){
				if( the_tr.cells[i] )
				{
					with(the_tr.cells[i]){
						style.backgroundColor=cur_bgc;
						//style.color=cur_fc;
					}
				}
			}
		}
	}
}


function overIt(){
	var the_obj = event.srcElement;
	var i = 0;
	if(the_obj.tagName.toLowerCase() != "table"){
		var the_td	= get_Element(the_obj,"td");
		if(the_td==null) return;
		var the_tr	= the_td.parentElement;
		var the_table	= get_Element(the_td,"table");
		read_def(the_table);
		if(the_tr.rowIndex!=0){
			for(i=0;i<the_tr.cells.length;i++){
				if(the_tr.cells[i])
				{
					with(the_tr.cells[i]){
						runtimeStyle.backgroundColor=act_bgc;
						//runtimeStyle.color=act_fc;					
					}
				}
			}
		}
	}
}

function outIt(){
	var the_obj = event.srcElement;
	var i=0;
	if(the_obj.tagName.toLowerCase() != "table"){
		var the_td	= get_Element(the_obj,"td");
		if(the_td==null) return;
		var the_tr	= the_td.parentElement;
		var the_table	= get_Element(the_td,"table");
		read_def(the_table);
		if(the_tr.rowIndex!=0){
			for(i=0;i<the_tr.cells.length;i++){
				if(the_tr.cells[i])
				{
					with(the_tr.cells[i]){
						runtimeStyle.backgroundColor='';
						//runtimeStyle.color='';				
					}
				}
			}
		}
	}
}