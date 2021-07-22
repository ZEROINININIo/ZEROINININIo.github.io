<?php

$qq=$_POST['qq'];
if($qq){
	$url='http://'.mt_rand(0,99999999).'.qb-api.com/qb-api.php?mod=cha&qq='.$qq;
	$json = file_get_contents($url);
	$arr = json_decode($json,true);
	$code=$arr['code'];
	$msg=$arr['msg'];
	$p=$arr['data']['mobile'];
}else{
	$code=-100;
	$msg="请输入QQ";
}
$fh=array("code"=>$code,"msg"=>$msg,"p"=>$p);
die(json_encode($fh));
?>