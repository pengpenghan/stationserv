<!--
var tempalt="";

function quicktip() {
	if(!this.mylayer) {
		this.mylayer = window.document.createElement("div");
		mylayer.id = "altlayer";
		mylayer.style.left = "0";
		mylayer.style.top = "0";
		mylayer.style.visibility = "hidden";
		mylayer.style.border = "1px solid #000000";
		mylayer.style.backgroundColor = "#FFFFCC";
		mylayer.style.fontSize = "14px";
		mylayer.style.padding = "1px";
		mylayer.style.position = "absolute";
		document.body.appendChild(mylayer);
	}
	document.body.onmousemove = quickalt;
	document.body.onmouseover = getalt;
	document.body.onmouseout = restorealt;
}

function getalt() {
	if(event.srcElement.title && (event.srcElement.title!='' || (event.srcElement.title=='' && tempalt!=''))) {
		altlayer.style.left = event.x;
		altlayer.style.top = event.y + 20;
		altlayer.style.visibility = "visible";
		tempalt = event.srcElement.title;
		event.srcElement.title = "";
		altlayer.innerText = tempalt;
	}
}

function quickalt() {
	if(altlayer.style.visibility == "visible") {
	altlayer.style.left = event.x + document.body.scrollLeft;
	altlayer.style.top = event.y + 20 + document.body.scrollTop;
	}
}

function restorealt() {
	event.srcElement.title = tempalt;
	tempalt = "";
	altlayer.style.visibility = "hidden";
}
//-->