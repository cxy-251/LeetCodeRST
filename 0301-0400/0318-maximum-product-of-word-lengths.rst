0318. Maximum Product of Word Lengths
=====================================

题目信息
--------

:题号: 0318
:难度: Medium
:主题: 字符串、位运算、数组
:原题: `LeetCode 318 <https://leetcode.com/problems/maximum-product-of-word-lengths/>`_
:教学重点: 将每个单词包含的字母压缩为位掩码，常数时间判断两个单词是否共享字符。

题目重述
--------

给定只含小写英文字母的单词数组，选择两个没有任何公共字母的单词，使它们长度乘积最大；若不存在这样的两个单词，返回 ``0``。

自建示例
--------

输入 ``["abcw","baz","foo","bar","xtfn","abcdef"]``，返回 ``16``，由 ``"abcw"`` 和 ``"xtfn"`` 得到。
