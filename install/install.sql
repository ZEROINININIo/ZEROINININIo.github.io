DROP TABLE IF EXISTS `web_config`;
create table `web_config` (
`k` varchar(32) NOT NULL,
`v` text NULL,
PRIMARY KEY  (`k`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `web_config` VALUES ('cache', '');
INSERT INTO `web_config` VALUES ('version', '1025');
INSERT INTO `web_config` VALUES ('admin_user', 'admin');
INSERT INTO `web_config` VALUES ('admin_pwd', 'admin');
INSERT INTO `web_config` VALUES ('style', '1');
INSERT INTO `web_config` VALUES ('sitename', '网友禁轩');
INSERT INTO `web_config` VALUES ('title', '国内网站排行榜站点工具最新娱乐博客论坛资源网');
INSERT INTO `web_config` VALUES ('keywords', '禁轩导航,站点导航排名,最大导航,博客论坛,IDC主机,SEO优化,网站外链,站点收录,免审收录');
INSERT INTO `web_config` VALUES ('description', '专业网站导航系统查找站点点击出发！');
INSERT INTO `web_config` VALUES ('anounce', '');
INSERT INTO `web_config` VALUES ('kfqq', '536487561');
INSERT INTO `web_config` VALUES ('yzf', '37ef9b9780770bc473429cba18e0e536500ffd99d56c6d64ce538266dd21cc23c071fd564e1133ad3fb9340ae4a236d8b2efd03b');
INSERT INTO `web_config` VALUES ('icp', '京ICP备88888888号');
INSERT INTO `web_config` VALUES ('modal', '最新引导导航页+音乐+留言+后台+多模板源码');
INSERT INTO `web_config` VALUES ('gg', '欢迎来到本网站，有任何问题请与我们联系。');
INSERT INTO `web_config` VALUES ('music', '127');
INSERT INTO `web_config` VALUES ('url', 'http://jinxuan.czcn.net/');
INSERT INTO `web_config` VALUES ('bottom', '');
INSERT INTO `web_config` VALUES ('bj', 'http://api.btstu.cn/sjbz/zsy.php');
INSERT INTO `web_config` VALUES ('template', 'Template3');

DROP TABLE IF EXISTS `web_dh`;
create table `web_dh` (
`id` int(1) NOT NULL AUTO_INCREMENT,
`url` varchar(255) NULL,
`name` text NULL,
`active` int(11) NOT NULL,
 PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8
