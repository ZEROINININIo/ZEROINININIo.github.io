<html lang="zh-cn">
<head>
  <meta http-equiv="Content-Type"content="text/html; charset=UTF-8">
  <title><?php echo $conf['sitename']?> - <?php echo $conf['title']?></title>
  <meta name="keywords" content="<?php echo $conf['keywords']?>">
  <meta name="description" content="<?php echo $conf['description']?>">
  <link rel="shortcut icon" href="favicon.ico">
  <link type="text/css"href="assets/css/css.css"rel="stylesheet"/>
</head>
<body onload="javascript:window.alert('<?php echo $conf['gg']?>')">
<div class="background"id="background">
</div>
<section class="section now"data-id="1">
<div class="top-content"id="top">
	<div class="center span-logo"><?php echo $conf['sitename']?></div>
	<br class="accc"/>
	<a class="center span-sublogo"><?php echo $conf['modal']?></a>
	<div class="center nav">
		<nav>
		     <?php
$rs=$DB->query("SELECT * FROM web_dh WHERE active=1 order by id desc limit 7");
while($res = $DB->fetch($rs))
{
echo '<a href="'.$res['url'].'" >&nbsp'.$res['name'].'&nbsp</a>&nbsp&nbsp';
}
        ?>  
		</nav>
	</div>
	<div class="center about"align="center">
		ICP备：<a href="http://www.miitbeian.gov.cn/"><?php echo $conf['icp']?></a></p>
        Copyright © 2021-2021<a href="/"><?php echo $conf['sitename']?></a>版权所有
	</div>
</div>
</section>
<iframe src="http://bd.kuwo.cn/yinyue/450897/?src=album"frameBorder="0"width="0"scrolling="no"height="0"target="_blank">
</iframe>
<script src="assets/js/app.js"></script>
<script>if(/IE (6|7|8)/ig.test(navigator.userAgent))alert("你该升级浏览器了");</script>
<script src="https://libs.baidu.com/jquery/1.11.3/jquery.min.js"></script>
<script src="//lib.baomitu.com/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="https://yzf.qq.com/xv/web/static/chat_sdk/yzf_chat.min.js"></script>
<script src="https://music.clwl.online/Player/player.min.js" id="SinKingMusic" key="<?php echo $conf['music']?>"></script>
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