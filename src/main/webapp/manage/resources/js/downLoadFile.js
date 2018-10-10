	function downLoad(selectName,rootPath)
	{
		var fileList = document.getElementById(selectName);
		var index = fileList.selectedIndex;
		if(index==-1)
		{
			alert("请选择要下载的文件!");
			return false ;
		}
		var fileName =  fileList[index].text;
		var filePath = fileList[index].value;
		location.href = encodeURI(rootPath+"/download.jsp?filePath="+filePath+"&fileName="+fileName);
	}