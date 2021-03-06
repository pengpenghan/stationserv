﻿/*----------------------------------------------------------------------------\
|                       Cross Browser Tree Widget 1.17                        |
|-----------------------------------------------------------------------------|
|                          Created by Emil A Eklund                           |
|                  (http://webfx.eae.net/contact.html#emil)                   |
|                      For WebFX (http://webfx.eae.net/)                      |
|-----------------------------------------------------------------------------|
| An object based tree widget,  emulating the one found in microsoft windows, |
| with persistence using cookies. Works in IE 5+, Mozilla and konqueror 3.    |
|-----------------------------------------------------------------------------|
|                   Copyright (c) 1999 - 2002 Emil A Eklund                   |
|-----------------------------------------------------------------------------|
| This software is provided "as is", without warranty of any kind, express or |
| implied, including  but not limited  to the warranties of  merchantability, |
| fitness for a particular purpose and noninfringement. In no event shall the |
| authors or  copyright  holders be  liable for any claim,  damages or  other |
| liability, whether  in an  action of  contract, tort  or otherwise, arising |
| from,  out of  or in  connection with  the software or  the  use  or  other |
| dealings in the software.                                                   |
| - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - |
| This  software is  available under the  three different licenses  mentioned |
| below.  To use this software you must chose, and qualify, for one of those. |
| - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - |
| The WebFX Non-Commercial License          http://webfx.eae.net/license.html |
| Permits  anyone the right to use the  software in a  non-commercial context |
| free of charge.                                                             |
| - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - |
| The WebFX Commercial license           http://webfx.eae.net/commercial.html |
| Permits the  license holder the right to use  the software in a  commercial |
| context. Such license must be specifically obtained, however it's valid for |
| any number of  implementations of the licensed software.                    |
| - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - |
| GPL - The GNU General Public License    http://www.gnu.org/licenses/gpl.txt |
| Permits anyone the right to use and modify the software without limitations |
| as long as proper  credits are given  and the original  and modified source |
| code are included. Requires  that the final product, software derivate from |
| the original  source or any  software  utilizing a GPL  component, such  as |
| this, is also licensed under the GPL license.                               |
|-----------------------------------------------------------------------------|
| Dependencies: xtree.css (To set up the CSS of the tree classes)             |
|-----------------------------------------------------------------------------|
| 2001-01-10 | Original Version Posted.                                       |
| 2001-03-18 | Added getSelected and get/setBehavior  that can make it behave |
|            | more like windows explorer, check usage for more information.  |
| 2001-09-23 | Version 1.1 - New features included  keyboard  navigation (ie) |
|            | and the ability  to add and  remove nodes dynamically and some |
|            | other small tweaks and fixes.                                  |
| 2002-01-27 | Version 1.11 - Bug fixes and improved mozilla support.         |
| 2002-06-11 | Version 1.12 - Fixed a bug that prevented the indentation line |
|            | from  updating correctly  under some  circumstances.  This bug |
|            | happened when removing the last item in a subtree and items in |
|            | siblings to the remove subtree where not correctly updated.    |
| 2002-06-13 | Fixed a few minor bugs cased by the 1.12 bug-fix.              |
| 2002-08-20 | Added usePersistence flag to allow disable of cookies.         |
| 2002-10-23 | (1.14) Fixed a plus icon issue                                 |
| 2002-10-29 | (1.15) Last changes broke more than they fixed. This version   |
|            | is based on 1.13 and fixes the bugs 1.14 fixed withou breaking |
|            | lots of other things.                                          |
| 2003-02-15 | The  selected node can now be made visible even when  the tree |
|            | control  loses focus.  It uses a new class  declaration in the |
|            | css file '.webfx-tree-item a.selected-inactive', by default it |
|            | puts a light-gray rectangle around the selected node.          |
| 2003-03-16 | Adding target support after lots of lobbying...                |
|-----------------------------------------------------------------------------|
| Created 2000-12-11 | All changes are in the log above. | Updated 2003-03-16 |
\----------------------------------------------------------------------------*/

function __search(root, target)
{
	if( target == "" )
	{
		return false;
	}
	var len = root.childNodes.length;
	for(var i = 0; i < len; i++ )
	{
		var child = root.childNodes[i];
		if( child.text.indexOf(target) >=0  )
		{
			var parent = child.parentNode;
			while( parent )
			{
				parent.expand();
				parent = parent.parentNode;
			}
			if( child.folder)
			{
				//child.select();
				child.expand();
			}
			
			child.select();
			
			return true;
		}
		if( __search(child, target) )
		{
			return true;
		}
	}
	return false;		
}
	
function selectChildren(item, chked)
{
	if(item)
	{
		var len = item.childNodes.length;
		for(var i = 0 ; i < len; i++ )
		{
			__selectChildren(item.childNodes[i], chked);
		}
	}
}
	
function __selectChildren(node, chked)
{
	if (node)
	{
		node.setChecked(chked);
		{
			var len = node.childNodes.length;
			for(var i = 0 ; i < len; i++ )
			{
				__selectChildren(node.childNodes[i], chked);
			}
		}
	}
}

function __callbackGetChildren(jsonObject)
{
	var id = jsonObject.nodeid;
	var chs = jsonObject.children;
	
	if( chs && chs.length > 0 )
	{
		var parentNode = webFXTreeHandler.all[id];
		var len = chs.length;
		for(var i = 0 ; i < len; i++ )
		{
			var child = chs[i];
			var act = "";
			if( child.action )
			{
				act = child.action;
			}
			
			var item = new WebFXTreeItem_org(child.title,act);

			item.tag = child.id;
			
			item.tag2 = child;
			
			item.dataReady = false;
	
			item.action = "javascript:onNodeClick(ctrlTree.getSelected(), ctrlTree.getSelected().tag2);";
			
			parentNode.add(item);
		}
		parentNode.expand()
	}
}

function getScriptPath()
{
	var js = "js/xtree/xtree.js";
	js=js.toLowerCase()
	var script=document.getElementsByTagName("SCRIPT");
	for(var i=0;i<script.length;i++)
	{
		var s=script[i].src.toLowerCase()
		if(s.indexOf(js)!=-1)return s.replace(js,"")
	}
	return null
}

var webFXTreeConfig_org = {
	rootIcon        : getScriptPath() + 'images/xtree/tt1.gif',
	openRootIcon    : getScriptPath() + 'images/xtree/tt1.gif',
	folderIcon      : getScriptPath() + 'images/xtree/tt1.gif',
	openFolderIcon  : getScriptPath() + 'images/xtree/tt1.gif',
	fileIcon        : getScriptPath() + 'images/xtree/tt1.gif',
	iIcon           : getScriptPath() + 'images/xtree/line.gif',
	lIcon           : getScriptPath() + 'images/xtree/joinbottom.gif',
	lMinusIcon      : getScriptPath() + 'images/xtree/minusbottom.gif',
	lPlusIcon       : getScriptPath() + 'images/xtree/plusbottom.gif',
	tIcon           : getScriptPath() + 'images/xtree/join.gif',
	tMinusIcon      : getScriptPath() + 'images/xtree/minus.gif',
	tPlusIcon       : getScriptPath() + 'images/xtree/plus.gif',
	blankIcon       : getScriptPath() + 'images/xtree/empty.gif',
	defaultText     : 'Tree Item',
	defaultAction   : 'javascript:void(0);',
	defaultBehavior : 'classic',
	usePersistence	: true
};

var webFXTreeHandler = {
	idCounter : 0,
	idPrefix  : "webfx-tree-object-",
	rootNode  : null,
	all       : {},
	behavior  : null,
	selected  : null,
	onSelect  : null, /* should be part of tree, not handler */
	getId     : function() { return this.idPrefix + this.idCounter++; },
	toggle    : function (oItem) {this.all[oItem.id.replace('-plus','')].toggle(); },
	clk    : function (oItem) {var item = this.all[oItem.id];item.toggle();},
	select    : function (oItem) { this.all[oItem.id.replace('-icon','')].select(); },
	focus     : function (oItem) { this.all[oItem.id.replace('-anchor','')].focus(); },
	callbackGetChildren:function(ret){__callbackGetChildren(eval('(' + ret + ')'));},
	getChildren: function(oItem) 
	{
		var data ="nodeid=" + escape(oItem.id) + "&id=" + escape(oItem.tag) + "&text=" + escape(oItem.text);
		data = data + "&sqlid=" + __exp_tree_sqlid + "&datasource=" + __exp_tree_datasource;
		AjaxLet.invoke("com.jstrd.base.pl.DynamicTreeAjaxLet", "getChildren", data, webFXTreeHandler.callbackGetChildren);
	},
	
	blur      : function (oItem) { this.all[oItem.id.replace('-anchor','')].blur(); },
	keydown   : function (oItem, e) { return this.all[oItem.id].keydown(e.keyCode); },
	onCheck   : function (oItem) { return this.all[oItem.id.replace('-checkbox','')].onCheck(this.all[oItem.id.replace('-checkbox','')], oItem); },
	onCheck4Parent   : function (oItem) { return this.all[oItem.id.replace('-parentcheckbox','')].onCheck(this.all[oItem.id.replace('-parentcheckbox','')], oItem); },
	onParentCheck   : function (oItem) { selectChildren(this.all[oItem.id.replace('-parentcheckbox','')],oItem.checked); return webFXTreeHandler.onCheck4Parent(oItem);},
	cookies   : new WebFXCookie(),
	insertHTMLBeforeEnd	:	function (oElement, sHTML) {
		if (oElement.insertAdjacentHTML != null) {
			oElement.insertAdjacentHTML("BeforeEnd", sHTML)
			return;
		}
		var df;	// DocumentFragment
		var r = oElement.ownerDocument.createRange();
		r.selectNodeContents(oElement);
		r.collapse(false);
		df = r.createContextualFragment(sHTML);
		oElement.appendChild(df);
	}
};

/*
 * WebFXCookie class
 */

function WebFXCookie() {
	if (document.cookie.length) { this.cookies = ' ' + document.cookie; }
}

WebFXCookie.prototype.setCookie = function (key, value) {
	document.cookie = "xtree_latestselected=1; expires=-1"; 
	document.cookie = "xtree_latestselected=" + escape(key);
}

WebFXCookie.prototype.getCookie = function (key) {
	
	if (this.cookies) {
		var start = this.cookies.indexOf(' ' + key + '=');
		if (start == -1) { return null; }
		var end = this.cookies.indexOf(";", start);
		if (end == -1) { end = this.cookies.length; }
		end -= start;
		var cookie = this.cookies.substr(start,end);
		return unescape(cookie.substr(cookie.indexOf('=') + 1, cookie.length - cookie.indexOf('=') + 1));
	}
	else { return null; }
}

/*
 * WebFXTreeAbstractNode class
 */

function WebFXTreeAbstractNode(sText, sAction) {
	this.childNodes  = [];
	this.id     = webFXTreeHandler.getId();
	this.text   = sText || webFXTreeConfig_org.defaultText;
	this.action = sAction || webFXTreeConfig_org.defaultAction;
	this.target = "";
	this._last  = false;
	this.tag = "";
	this.tag2 = "";
	this.dataReady = true;
	webFXTreeHandler.all[this.id] = this;
}

WebFXTreeAbstractNode.prototype.getTag2Object = function () {
	return eval('(' + unescape(this.tag2) + ')');
}

/*
 * To speed thing up if you're adding multiple nodes at once (after load)
 * use the bNoIdent parameter to prevent automatic re-indentation and call
 * the obj.ident() method manually once all nodes has been added.
 */

WebFXTreeAbstractNode.prototype.add = function (node, bNoIdent) {
	node.parentNode = this;
	node.root = this.root; 
	if( node.open )
	{
		this.open = true;
		var p = this.parentNode;
		while( p )
		{
			p.open = true;
			p = p.parentNode;
		}
	}
	this.childNodes[this.childNodes.length] = node;
	var root = this;
	if (this.childNodes.length >= 2) {
		this.childNodes[this.childNodes.length - 2]._last = false;
	}
	while (root.parentNode) { root = root.parentNode; }
	if (root.rendered) {
		if (this.childNodes.length >= 2) {
			document.getElementById(this.childNodes[this.childNodes.length - 2].id + '-plus').src = ((this.childNodes[this.childNodes.length -2].folder)?((this.childNodes[this.childNodes.length -2].open)?webFXTreeConfig_org.tMinusIcon:webFXTreeConfig_org.tPlusIcon):webFXTreeConfig_org.tIcon);
			this.childNodes[this.childNodes.length - 2].plusIcon = webFXTreeConfig_org.tPlusIcon;
			this.childNodes[this.childNodes.length - 2].minusIcon = webFXTreeConfig_org.tMinusIcon;
			this.childNodes[this.childNodes.length - 2]._last = false;
		}
		this._last = true;
		var foo = this;
		while (foo.parentNode) {
			for (var i = 0; i < foo.parentNode.childNodes.length; i++) {
				if (foo.id == foo.parentNode.childNodes[i].id) { break; }
			}
			if (i == foo.parentNode.childNodes.length - 1) { foo.parentNode._last = true; }
			else { foo.parentNode._last = false; }
			foo = foo.parentNode;
		}
		webFXTreeHandler.insertHTMLBeforeEnd(document.getElementById(this.id + '-cont'), node.toString());
		if ((!this.folder) && (!this.openIcon)) {
			this.icon = webFXTreeConfig_org.folderIcon;
			this.openIcon = webFXTreeConfig_org.openFolderIcon;
		}
		if (!this.folder) { this.folder = true; this.collapse(true); }
		if (!bNoIdent) { this.indent(); }
	}
	
	return node;
}


WebFXTreeAbstractNode.prototype.toggle = function() {
	if (this.folder) {
		if (this.open) { this.collapse(); }
		else { this.expand(); }
}	}

WebFXTreeAbstractNode.prototype.select = function() {
	document.getElementById(this.id + '-anchor').focus();
}


WebFXTreeAbstractNode.prototype.deSelect = function() {
	document.getElementById(this.id + '-anchor').className = '';
	webFXTreeHandler.selected = null;
}

WebFXTreeAbstractNode.prototype.focus = function() {
	if( !this.dataReady )
	{
		if( webFXTreeHandler.getChildren )
		{
			webFXTreeHandler.getChildren(this);
			this.dataReady = true;
		}
	}
	if ((webFXTreeHandler.selected) && (webFXTreeHandler.selected != this)) { webFXTreeHandler.selected.deSelect(); }
	webFXTreeHandler.selected = this;
	if ((this.openIcon) && (webFXTreeHandler.behavior != 'classic')) { document.getElementById(this.id + '-icon').src = this.openIcon; }
	document.getElementById(this.id + '-anchor').className = 'selected';
	document.getElementById(this.id + '-anchor').focus();
	if (webFXTreeHandler.onSelect) { webFXTreeHandler.onSelect(this); }
}

WebFXTreeAbstractNode.prototype.blur = function() {
	if ((this.openIcon) && (webFXTreeHandler.behavior != 'classic')) { document.getElementById(this.id + '-icon').src = this.icon; }
	document.getElementById(this.id + '-anchor').className = 'selected-inactive';
}

WebFXTreeAbstractNode.prototype.doExpand = function() {
	if (webFXTreeHandler.behavior == 'classic') { document.getElementById(this.id + '-icon').src = this.openIcon; }
	if (this.childNodes.length) {  document.getElementById(this.id + '-cont').style.display = 'block'; }
	this.open = true;
	if (webFXTreeConfig_org.usePersistence) {
		webFXTreeHandler.cookies.setCookie(this.id.substr(18,this.id.length - 18), '1');
}	}

WebFXTreeAbstractNode.prototype.doCollapse = function() {
	if (webFXTreeHandler.behavior == 'classic') { document.getElementById(this.id + '-icon').src = this.icon; }
	if (this.childNodes.length) { document.getElementById(this.id + '-cont').style.display = 'none'; }
	this.open = false;
	if (webFXTreeConfig_org.usePersistence) {
		webFXTreeHandler.cookies.setCookie(this.id.substr(18,this.id.length - 18), '0');
}	}

WebFXTreeAbstractNode.prototype.expandAll = function() {
	this.expandChildren();
	if ((this.folder) && (!this.open)) { this.expand(); }
}


WebFXTreeAbstractNode.prototype.expandChildren = function() {
	for (var i = 0; i < this.childNodes.length; i++) {
		this.childNodes[i].expandAll();
} }

WebFXTreeAbstractNode.prototype.collapseAll = function() {
	this.collapseChildren();
	if ((this.folder) && (this.open)) { this.collapse(true); }
}

WebFXTreeAbstractNode.prototype.collapseChildren = function() {
	for (var i = 0; i < this.childNodes.length; i++) {
		this.childNodes[i].collapseAll();
} }

WebFXTreeAbstractNode.prototype.indent = function(lvl, del, last, level, nodesLeft) {
	/*
	 * Since we only want to modify items one level below ourself,
	 * and since the rightmost indentation position is occupied by
	 * the plus icon we set this to -2
	 */
	if (lvl == null) { lvl = -2; }
	var state = 0;
	for (var i = this.childNodes.length - 1; i >= 0 ; i--) {
		state = this.childNodes[i].indent(lvl + 1, del, last, level);
		if (state) { return; }
	}
	if (del) {
		if ((level >= this._level) && (document.getElementById(this.id + '-plus'))) {
			if (this.folder) {
				document.getElementById(this.id + '-plus').src = (this.open)?webFXTreeConfig_org.lMinusIcon:webFXTreeConfig_org.lPlusIcon;
				this.plusIcon = webFXTreeConfig_org.lPlusIcon;
				this.minusIcon = webFXTreeConfig_org.lMinusIcon;
			}
			else if (nodesLeft) { document.getElementById(this.id + '-plus').src = webFXTreeConfig_org.lIcon; }
			return 1;
	}	}
	var foo = document.getElementById(this.id + '-indent-' + lvl);
	if (foo) {
		if ((foo._last) || ((del) && (last))) { foo.src =  webFXTreeConfig_org.blankIcon; }
		else { foo.src =  webFXTreeConfig_org.iIcon; }
	}
	return 0;
}

/*
 * WebFXTree class
 */

function WebFXTree_org(sText, sAction, sBehavior, sIcon, sOpenIcon) {
	this.base = WebFXTreeAbstractNode;
	this.base(sText, sAction);
	this.icon      = sIcon || webFXTreeConfig_org.rootIcon;
	this.openIcon  = sOpenIcon || webFXTreeConfig_org.openRootIcon;
	/* Defaults to open */
	if (webFXTreeConfig_org.usePersistence) {
		this.open  = true;
	} else { this.open  = true; }
	this.folder    = true;
	this.rendered  = false;
	this.onSelect  = null;
	this.root = this;
	this.sepNode = false;
	this.selectedNodes  = [];
	if (!webFXTreeHandler.behavior) {  webFXTreeHandler.behavior = sBehavior || webFXTreeConfig_org.defaultBehavior; }
}

WebFXTree_org.prototype = new WebFXTreeAbstractNode;

WebFXTree_org.prototype.setBehavior = function (sBehavior) {
	webFXTreeHandler.behavior =  sBehavior;
};

WebFXTree_org.prototype.getBehavior = function (sBehavior) {
	return webFXTreeHandler.behavior;
};

WebFXTree_org.prototype.search = function(nodeText)
{
	return __search(this.root, nodeText);
}

WebFXTree_org.prototype.getSelected = function() {
	if (webFXTreeHandler.selected) { return webFXTreeHandler.selected; }
	else { return null; }
}

WebFXTree_org.prototype.remove = function() { }

WebFXTree_org.prototype.expand = function() {
	this.doExpand();
}

WebFXTree_org.prototype.collapse = function(b) {
	if (!b) { this.focus(); }
	this.doCollapse();
}

WebFXTree_org.prototype.getFirst = function() {
	return null;
}

WebFXTree_org.prototype.getLast = function() {
	return null;
}

WebFXTree_org.prototype.getNextSibling = function() {
	return null;
}

WebFXTree_org.prototype.getPreviousSibling = function() {
	return null;
}

WebFXTree_org.prototype.keydown = function(key) {
	if (key == 39) {
		if (!this.open) { this.expand(); }
		else if (this.childNodes.length) { this.childNodes[0].select(); }
		return false;
	}
	if (key == 37) { this.collapse(); return false; }
	if ((key == 40) && (this.open) && (this.childNodes.length)) { this.childNodes[0].select(); return false; }
	return true;
}


WebFXTree_org.prototype.toString = function() {
	if( this.target == "" )
	{
		this.target = "_self";
	}
	var str = "<div id=\"" + this.id + "\" ondblclick=\"webFXTreeHandler.toggle(this);\" class=\"webfx-tree-item\" onkeydown=\"return webFXTreeHandler.keydown(this, event)\">" +
		"<img id=\"" + this.id + "-icon\" class=\"webfx-tree-icon\" src=\"" + ((webFXTreeHandler.behavior == 'classic' && this.open)?this.openIcon:this.icon) + "\" onclick=\"webFXTreeHandler.select(this);\">";
	
	    if(this.action.indexOf("javascript:")==0 )
	    {
	    	str =str +"<a href='###' onclick=\"" + this.action + "\"";
	    }
	    else
	    {
	    	str =str +"<a href=\"" + this.action + "\"";
	    }
		
		str = str + " id=\"" + this.id + "-anchor\" onfocus=\"webFXTreeHandler.focus(this);\" onblur=\"webFXTreeHandler.blur(this);\"";
		str=str+ (this.target ? " target=\"" + this.target + "\"" : "_self") +
		">" + this.text + "</a></div>" +
		"<div id=\"" + this.id + "-cont\" class=\"webfx-tree-container\" style=\"display: " + ((this.open)?'block':'none') + ";\">";
	var sb = [];
	for (var i = 0; i < this.childNodes.length; i++) {
		sb[i] = this.childNodes[i].toString(i, this.childNodes.length);
	}
	this.rendered = true;
	return str + sb.join("") + "</div>";
};

/*
 * WebFXTreeItem class
 */

function WebFXTreeItem_org(sText, sAction, eParent, sIcon, sOpenIcon) {
	this.base = WebFXTreeAbstractNode;
	this.base(sText, sAction);
	this.checked = false; 
	this.isCheck = false;
	this.root = null;
	/* Defaults to close */
	if (webFXTreeConfig_org.usePersistence) {
		this.open = webFXTreeHandler.cookies.getCookie('xtree_latestselected') == this.id.substr(18,this.id.length - 18);
	} else { this.open = false; }
	if (sIcon) { this.icon = sIcon; }
	if (sOpenIcon) { this.openIcon = sOpenIcon; }
	if (eParent) { eParent.add(this); }
}

WebFXTreeItem_org.prototype = new WebFXTreeAbstractNode;

WebFXTreeItem_org.prototype.remove = function() {
	var iconSrc = document.getElementById(this.id + '-plus').src;
	var parentNode = this.parentNode;
	var prevSibling = this.getPreviousSibling(true);
	var nextSibling = this.getNextSibling(true);
	var folder = this.parentNode.folder;
	var last = ((nextSibling) && (nextSibling.parentNode) && (nextSibling.parentNode.id == parentNode.id))?false:true;
	this.getPreviousSibling().focus();
	this._remove();
	if (parentNode.childNodes.length == 0) {
		document.getElementById(parentNode.id + '-cont').style.display = 'none';
		parentNode.doCollapse();
		parentNode.folder = false;
		parentNode.open = false;
	}
	if (!nextSibling || last) { parentNode.indent(null, true, last, this._level, parentNode.childNodes.length); }
	if ((prevSibling == parentNode) && !(parentNode.childNodes.length)) {
		prevSibling.folder = false;
		prevSibling.open = false;
		iconSrc = document.getElementById(prevSibling.id + '-plus').src;
		iconSrc = iconSrc.replace('minus', '').replace('plus', '');
		document.getElementById(prevSibling.id + '-plus').src = iconSrc;
		document.getElementById(prevSibling.id + '-icon').src = webFXTreeConfig_org.fileIcon;
	}
	if (document.getElementById(prevSibling.id + '-plus')) {
		if (parentNode == prevSibling.parentNode) {
			iconSrc = iconSrc.replace('minus', '').replace('plus', '');
			document.getElementById(prevSibling.id + '-plus').src = iconSrc;
}	}	}

WebFXTreeItem_org.prototype._remove = function() {
	for (var i = this.childNodes.length - 1; i >= 0; i--) {
		this.childNodes[i]._remove();
 	}
	for (var i = 0; i < this.parentNode.childNodes.length; i++) {
		if (this == this.parentNode.childNodes[i]) {
			for (var j = i; j < this.parentNode.childNodes.length; j++) {
				this.parentNode.childNodes[j] = this.parentNode.childNodes[j+1];
			}
			this.parentNode.childNodes.length -= 1;
			if (i + 1 == this.parentNode.childNodes.length) { this.parentNode._last = true; }
			break;
	}	}
	webFXTreeHandler.all[this.id] = null;
	var tmp = document.getElementById(this.id);
	if (tmp) { tmp.parentNode.removeChild(tmp); }
	tmp = document.getElementById(this.id + '-cont');
	if (tmp) { tmp.parentNode.removeChild(tmp); }
}

WebFXTreeItem_org.prototype.expand = function() {
	this.doExpand();
	document.getElementById(this.id + '-plus').src = this.minusIcon;
}

WebFXTreeItem_org.prototype.collapse = function(b) {
	if (!b) { this.focus(); }
	this.doCollapse();
	document.getElementById(this.id + '-plus').src = this.plusIcon;
}

WebFXTreeItem_org.prototype.getFirst = function() {
	return this.childNodes[0];
}

WebFXTreeItem_org.prototype.getLast = function() {
	if (this.childNodes[this.childNodes.length - 1].open) { return this.childNodes[this.childNodes.length - 1].getLast(); }
	else { return this.childNodes[this.childNodes.length - 1]; }
}

WebFXTreeItem_org.prototype.getNextSibling = function() {
	for (var i = 0; i < this.parentNode.childNodes.length; i++) {
		if (this == this.parentNode.childNodes[i]) { break; }
	}
	if (++i == this.parentNode.childNodes.length) { return this.parentNode.getNextSibling(); }
	else { return this.parentNode.childNodes[i]; }
}

WebFXTreeItem_org.prototype.getPreviousSibling = function(b) {
	for (var i = 0; i < this.parentNode.childNodes.length; i++) {
		if (this == this.parentNode.childNodes[i]) { break; }
	}
	if (i == 0) { return this.parentNode; }
	else {
		if ((this.parentNode.childNodes[--i].open) || (b && this.parentNode.childNodes[i].folder)) { return this.parentNode.childNodes[i].getLast(); }
		else { return this.parentNode.childNodes[i]; }
} }

WebFXTreeItem_org.prototype.keydown = function(key) {
	if ((key == 39) && (this.folder)) {
		if (!this.open) { this.expand(); }
		else { this.getFirst().select(); }
		return false;
	}
	else if (key == 37) {
		if (this.open) { this.collapse(); }
		else { this.parentNode.select(); }
		return false;
	}
	else if (key == 40) {
		if (this.open) { this.getFirst().select(); }
		else {
			var sib = this.getNextSibling();
			if (sib) { sib.select(); }
		}
		return false;
	}
	else if (key == 38) { this.getPreviousSibling().select(); return false; }
	return true;
}

WebFXTreeItem_org.prototype.setTag = function(sTag) {
	this.tag = sTag;
}

WebFXTreeItem_org.prototype.getTag = function() {
	return this.tag;
}

WebFXTreeItem_org.prototype.setChecked = function(bChecked) {
	if( !this.isCheck )
	{
		this.setCheckNodeType();
	}
	
	if( bChecked != this.checked )
	{
		this.checked = bChecked;
		var chkCtrl = null;
		if( this.folder )
		{
			chkCtrl = document.getElementById(this.id + "-parentcheckbox");
			
		}
		{
			chkCtrl = document.getElementById(this.id + "-checkbox");
		}
		if( chkCtrl != null )
		{
			chkCtrl.checked = bChecked;
			
		}
		else
		{
			this.addSelectNodes(bChecked);
		}
	}
}

WebFXTreeItem_org.prototype.setCheckNodeType = function() {
	this.isCheck = true;
}

WebFXTreeItem_org.prototype.isCheckNodeType = function() {
	return this.isCheck;
}

WebFXTreeItem_org.prototype.getChecked = function() {
	return this.checked;
}

WebFXTreeItem_org.prototype.handleCheckBox = function()
{
	var str = "";
	if( this.isCheck )
	{
		str += "<input style=\"border:None;height:10px;vertical-align:middle\" type=\"checkbox\" id=\"" + this.id + "-checkbox\"";
		if( this.checked )
		{
			str += " checked=\"true\" ";	
		}
		str += " onpropertychange=\"webFXTreeHandler.onCheck(this);\">";
	}
	return str;
}
WebFXTreeItem_org.prototype.handleParentCheckBox = function()
{
	var str = "";
	if( this.isCheck )
	{
		str += "<input type=\"checkbox\" id=\"" + this.id + "-parentcheckbox\"";
		if( this.checked )
		{
			str += " checked=\"true\" ";	
		}
		str += " onpropertychange=\"webFXTreeHandler.onCheck(this);\">";
	}
	return str;
}

WebFXTreeItem_org.prototype.addSelectNodes = function (chked)
{
	var len = this.root.selectedNodes.length;
	var addSelected = true;
	for( var i = 0 ; i < len; i++ )
	{
		var nd = this.root.selectedNodes[i];
		if( nd.id == this.id )
		{
			addSelected = false;
			if( !chked )
			{
				this.root.selectedNodes.splice(i,1);
				len--;
				i--;
			}
		}
	}
	if( addSelected )
	{
		this.root.selectedNodes[this.root.selectedNodes.length] = this;
	}
}

WebFXTreeItem_org.prototype.onCheck = function (srcNode, checkCtrl)
{
	this.checked = checkCtrl.checked;
	
	if( this.root == null )
	{	
		this.root = this;
		while (this.root.parentNode) { this.root = this.root.parentNode; }
	}
	this.root.onCheck(this, checkCtrl);
	this.addSelectNodes(this.checked);
	if( this.folder && !this.root.sepNode)
	{
		selectChildren(this, checkCtrl.checked);
	}
}

WebFXTreeItem_org.prototype.toString = function (nItem, nItemCount) {
	var foo = this.parentNode;
	var indent = '';
	if (nItem + 1 == nItemCount) { this.parentNode._last = true; }
	var i = 0;
	while (foo.parentNode) {
		foo = foo.parentNode;
		indent = "<img id=\"" + this.id + "-indent-" + i + "\" src=\"" + ((foo._last)?webFXTreeConfig_org.blankIcon:webFXTreeConfig_org.iIcon) + "\">" + indent;
		i++;
	}
	this._level = i;
	if (this.childNodes.length) { this.folder = 1; }
	else { this.open = false; }
	if ((this.folder) || (webFXTreeHandler.behavior != 'classic')) {
		if (!this.icon) { this.icon = webFXTreeConfig_org.folderIcon; }
		if (!this.openIcon) { this.openIcon = webFXTreeConfig_org.openFolderIcon; }
	}
	else if (!this.icon) { this.icon = webFXTreeConfig_org.fileIcon; }
	var label = this.text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
	if( this.target == "" )
	{
		this.target = "_self";
	}
	var str = "<div id=\"" + this.id + "\"  ondblclick=\"webFXTreeHandler.toggle(this);\" class=\"webfx-tree-item\" onkeydown=\"return webFXTreeHandler.keydown(this, event)\">" +
		indent +
		"<img id=\"" + this.id + "-plus\" src=\"" + ((this.folder)?((this.open)?((this.parentNode._last)?webFXTreeConfig_org.lMinusIcon:webFXTreeConfig_org.tMinusIcon):((this.parentNode._last)?webFXTreeConfig_org.lPlusIcon:webFXTreeConfig_org.tPlusIcon)):((this.parentNode._last)?webFXTreeConfig_org.lIcon:webFXTreeConfig_org.tIcon)) + "\" onclick=\"webFXTreeHandler.toggle(this);\">" +
		"<img id=\"" + this.id + "-icon\" class=\"webfx-tree-icon\" src=\"" + ((webFXTreeHandler.behavior == 'classic' && this.open)?this.openIcon:this.icon) + "\" onclick=\"webFXTreeHandler.select(this);\">" +
		"<span>";
		
		
		str =str+ this.handleCheckBox();
		
	    	if(this.action.indexOf("javascript:")==0 || this.action.indexOf("return") == 0 || this.action.length == 0 )
	    	{
	    		if( this.isCheck )
	    		{
	    			str =str +"<a href='###' onclick=\"" + this.action + "\"";
	    		}
	    		else
	    		{
	    			if( this.action.indexOf("return") == 0 )
	    			{
	    				str =str +"<a href='###' onclick=\"" + this.action + "\"";
	    			}
	    			else
	    			{
	    				str =str +"<a href='###' onclick=\"" + this.action + "\"";
	    			}
	    		}
	    	}
	   	else
	    	{
	    		str =str +"<a href=\"" + this.action + "\"";
	    	}
		str += " id=\"" + this.id + "-anchor\" onfocus=\"webFXTreeHandler.focus(this);\" onblur=\"webFXTreeHandler.blur(this);\"" +
		(this.target ? " target=\"" + this.target + "\"" : "_self") +
		">" + label + "</a></span></div>" +
		"<div id=\"" + this.id + "-cont\" class=\"webfx-tree-container\" style=\"display: " + ((this.open)?'block':'none') + ";\">";
	var sb = [];
	for (var i = 0; i < this.childNodes.length; i++) {
		sb[i] = this.childNodes[i].toString(i,this.childNodes.length);
	}
	this.plusIcon = ((this.parentNode._last)?webFXTreeConfig_org.lPlusIcon:webFXTreeConfig_org.tPlusIcon);
	this.minusIcon = ((this.parentNode._last)?webFXTreeConfig_org.lMinusIcon:webFXTreeConfig_org.tMinusIcon);
	return str + sb.join("") + "</div>";
}