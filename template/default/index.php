<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8">
<title><?php echo $conf['sitename']?> - <?php echo $conf['title']?></title>
<meta name="baidu-site-verification" content="b9lOcChmbf">
<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
<meta name="keywords" content="<?php echo $conf['keywords']?>">
<meta name="description" content="<?php echo $conf['description']?>">
<link rel="shortcut icon" href="favicon.ico">
<link rel="stylesheet" href="assets/css/main1.css">
<noscript>
<link rel="stylesheet" href="assets/css/noscript.css"/>
</noscript>
</head>
<body onload="javascript:window.alert('<?php echo $conf['gg']?>')" style="width:100%;
	height:auto;background:#000 url(<?php echo $conf['bj']?>)"rel="nofollow">
<div id="wrapper">
	<header id="header">
	<div class="logo">
		<img src="http://q1.qlogo.cn/g?b=qq&amp;nk=<?php echo $conf['kfqq']?>&amp;s=160" class="logo">
	</div>
	<div class="content">
		<div class="inner">
			<h1><a href="#"><?php echo $conf['sitename']?></a></h1>
			<p>
				<a href="#"><?php echo $conf['modal']?></a><br>
			</p>
		</div>
	</div>
	<nav>
	<ul>
               <li><a href="./">首页
<?php
$rs=$DB->query("SELECT * FROM web_dh WHERE active=1 order by id desc limit 7");
while($res = $DB->fetch($rs))
{
echo '<li><a href="'.$res['url'].'">'.$res['name'].'';
}
        ?>          
	</ul>
	</nav></header>
<footer id="footer">
	<p class="copyright">
<div class="list-group-item reed"><marquee scrollamount="8" direction="left" align="Middle" style="font-weight: bold;line-height: 20px;font-size: 20px;color: #FF0000;"><?php echo $conf['gg']?></marquee></div>
	</p>
					<footer id="footer">
					    <p class="copyright">ICP备：<a href="http://www.miitbeian.gov.cn/"><?php echo $conf['icp']?></a></p>
						<p class="copyright">Copyright © 2021-2021<a href="/"><?php echo $conf['sitename']?></a>版权所有</p>
			</div>

</div>
<div id="bg">
</div>
<script src="https://libs.baidu.com/jquery/1.11.3/jquery.min.js"></script>
<script src="assets/js/skel.min.js"></script>
<script src="assets/js/util.js"></script>
<script src="assets/js/main.js"></script>
	<script src="//lib.baomitu.com/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>
	<script src="https://yzf.qq.com/xv/web/static/chat_sdk/yzf_chat.min.js"></script>
  <script>
    window.yzf && window.yzf.init({
      sign: '<?php echo $conf['yzf']?>',
      uid: '1',
      data: {
        c1: '',
        c2: '',
        c3: '',
        c4: '',
        c5: ''
      },
      selector: '',
      callback: function(type, data){}
    })
    //window.yzf.close() 关闭1已打开的回话窗口
</script>
</body>
</html>
<script src="https://music.clwl.online/Player/player.min.js" id="SinKingMusic" key="<?php echo $conf['music']?>"></script>
