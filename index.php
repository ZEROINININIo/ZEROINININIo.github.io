<?php 
// +----------------------------------+
// | Uel：http://jinxuan.czcn.net/                |
// +----------------------------------+
// | By: 网友禁轩  <536487561@qq.com>   |
// +----------------------------------+
// | Date: 2021年06月19日             |
// +----------------------------------+
include("./includes/common.php");
include("./includes/txprotect.php");
if(!empty($conf['template']) && $conf['template'] != ""){
    $t = $conf['template'];
}else{
    $t = "default";
}
include 'template/'.$t.'/index.php';
?>