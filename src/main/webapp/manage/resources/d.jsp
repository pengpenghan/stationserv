<%@ page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">

<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- 上述3个meta标签*必须*放在最前面，任何其他内容都*必须*跟随其后！ -->
<link rel="stylesheet" type="text/css"
	href="<%=basePath %>/resources/bootstrap/css/slick.css" />
<link href="<%=basePath %>/resources/bootstrap/css/bootstrap.min.css"
	rel="stylesheet">
<link href="<%=basePath %>/resources/bootstrap/css/party.css"
	rel="stylesheet">

<title>下载页面</title>
<script
	src="<%=basePath %>/manage/services/yaoyiyao/js/jquery-1.8.3.min.js"></script>

</head>
<body>
	<div class="col-xs-12">
		<img alt="" src="<%=basePath %>/resources/images/down/bg.jpg"
			style="width: 100%">
	</div>

	<div class="col-xs-12"
		style="position: absolute; top: 380px; left: 30px; width: 37%; height: 10%; overflow: hidden">
		<a href="http://zhyz.yz188.cn:8080/smartcity/Android_ZHYZ.apk"> <img
			alt="" src="<%=basePath %>/resources/images/down/android.png"
			width="100%" height="100%">
		</a>
	</div>

	<div class="col-xs-12"
		style="position: absolute; top: 380px; right: 30px; width: 37%; height: 10%; overflow: hidden">

		<a
			href="https://itunes.apple.com/cn/app/zhi-hui-yang-zhou-sheng-huo/id1068821345?mt=8">
			<img alt="" src="<%=basePath %>/resources/images/down/iphone.png"
			width="100%" height="100%">
		</a>
	</div>







</body>
</html>