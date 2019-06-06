-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- 主机： localhost:8889
-- 生成日期： 2019-06-06 12:33:49
-- 服务器版本： 5.7.23
-- PHP 版本： 7.2.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- 数据库： `attgame`
--

-- --------------------------------------------------------

--
-- 表的结构 `account`
--

CREATE TABLE `account` (
  `uid` int(10) NOT NULL COMMENT 'user id, always be unique',
  `name` varchar(64) NOT NULL,
  `email` varchar(128) NOT NULL COMMENT 'user email',
  `password` varchar(128) NOT NULL COMMENT 'user password',
  `coin` int(11) NOT NULL DEFAULT '3000',
  `portrait` varchar(255) DEFAULT NULL COMMENT 'user protrait',
  `signature` text,
  `state` tinyint(1) DEFAULT '0' COMMENT '0 normal',
  `pwd_salt` varchar(32) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- 转存表中的数据 `account`
--

INSERT INTO `account` (`uid`, `name`, `email`, `password`, `coin`, `portrait`, `signature`, `state`, `pwd_salt`) VALUES
(10000012, 'Color', '1233@qq.com', '34e4a210bdeb76025b62d494f0438c56e004b7dafe984e1a8c19d214370ebd16', 2000, NULL, NULL, 0, 'l2v1dlahog0rfvmh5mqao9s70cni20mo');

-- --------------------------------------------------------

--
-- 表的结构 `activity_log`
--

CREATE TABLE `activity_log` (
  `id` bigint(16) NOT NULL COMMENT 'opration id',
  `uid` int(10) NOT NULL COMMENT 'account uid',
  `ip` varchar(32) NOT NULL COMMENT 'opertaion internet address',
  `op` char(4) NOT NULL,
  `time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- 表的结构 `rooms`
--

CREATE TABLE `rooms` (
  `id` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `max_user_coin` int(11) DEFAULT NULL,
  `min_user_coin` int(11) DEFAULT NULL,
  `max_pour_coin` int(11) DEFAULT NULL,
  `min_pour_coin` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- 转存表中的数据 `rooms`
--

INSERT INTO `rooms` (`id`, `name`, `max_user_coin`, `min_user_coin`, `max_pour_coin`, `min_pour_coin`) VALUES
(0, '练习场', 5000, 100, 500, 0),
(1, '初级场', 20000, 2000, 2000, 200),
(2, '中级场', 100000, 10000, 10000, 1000),
(3, '高级场', 500000, 50000, 50000, 5000);

--
-- 转储表的索引
--

--
-- 表的索引 `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`uid`) USING BTREE;

--
-- 表的索引 `activity_log`
--
ALTER TABLE `activity_log`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- 表的索引 `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `account`
--
ALTER TABLE `account`
  MODIFY `uid` int(10) NOT NULL AUTO_INCREMENT COMMENT 'user id, always be unique', AUTO_INCREMENT=10000013;

--
-- 使用表AUTO_INCREMENT `activity_log`
--
ALTER TABLE `activity_log`
  MODIFY `id` bigint(16) NOT NULL AUTO_INCREMENT COMMENT 'opration id';