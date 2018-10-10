/**
 * add one option of a select to another select.
 */ 
function addItem(ItemList,Target)
{
    for(var x = 0; x < ItemList.length; x++)
    {
        var opt = ItemList.options[x];
        if (opt.selected)
        {
            flag = true;
            for (var y=0;y<Target.length;y++)
            {
                var myopt = Target.options[y];
                if (myopt.value == opt.value)
                {  
                    flag = false;
                }
            }
            if(flag)
            {
                Target.options[Target.options.length] = new Option(opt.text, opt.value, 0, 0);
            }
        }
    }
}
/**
 * move one selected option from a select.
 */
function delItem(ItemList)
{
    for(var x=ItemList.length-1;x>=0;x--)
    {
        var opt = ItemList.options[x];
        if (opt.selected)
        {
            ItemList.options[x] = null;
        }
    }
}

/**
 * select all items of a select
 */
function selectItem(ItemList)
{
    for(var x=ItemList.length-1;x>=0;x--)
    {
        var opt = ItemList.options[x];
        opt.selected = true;
    }
}
/**
 * join items of an select with ",".
 */
function joinItem(ItemList)
{
    var OptionList = new Array();
    for (var x=0; x<ItemList.length;x++)
    {
        OptionList[x] = ItemList.options[x].value;
    }
    return OptionList.join(",");
}

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

function hasChecked(chk)
{
	var chked = false;
	if( chk )
	{
    		if( chk.length )
    		{
	    		var len = chk.length;
	    		
	    		for(var i = 0 ; i < len; i++ )
	    		{
	    			if( chk[i].checked )
	    			{
	    				chked = true;
	    				break;
	    			}
	    		}
    		}
    		else
    		{
    			chked = chk.checked;
    		}
    	}
    	return chked;
}

/**
	用隐藏对象来保存选中记录
**/
function updateHidden(chk, hid)
{
	var historyArray = hid.value.split(";");
	var len = historyArray.length;
	if( chk.checked )
	{
		for( var i = 0 ; i < len; i++ )
		{
			if( chk.id == historyArray[i] )
			{
				return;
			}
		}
		if( hid.value != "" )
		{
			hid.value = hid.value + ";";
		}
		hid.value = hid.value + chk.id;		
	}
	else
	{
		hid.value = "";
		for( var i = 0 ; i < len; i++ )
		{
			if( chk.id != historyArray[i] )
			{
				if( hid.value != "" )
				{
					hid.value = hid.value + ";";
				}
				hid.value = hid.value + historyArray[i];
			}
		}
		
	}
	alert(hid.value);		
}

/**
	判断该选择对象是否被选中过
**/
function tryChecked(chk, hid)
{
	var historyArray = hid.value.split(";");
	var len = historyArray.length;
	for( var i = 0 ; i < len; i++ )
	{
		if( chk.id == historyArray[i] )
		{
			chk.checked = true;
			return;
		}
	}	
}
