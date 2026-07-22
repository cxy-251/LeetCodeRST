0290. Word Pattern
=================

题目信息
--------

:题号: 0290
:难度: Easy
:主题: 哈希表、字符串、双射
:原题: `LeetCode 0290 <https://leetcode.com/problems/word-pattern/>`_
:教学重点: 字符与单词双向映射、词数一致

题目重述
--------

给定小写字母模式串 ``pattern`` 和由单空格分隔的小写单词字符串 ``s``，接口为 ``bool wordPattern(string pattern, string s)``。判断模式字符与单词之间是否存在一一对应的双射；同字符必须映射同单词，不同字符不能映射同单词，词数必须等于模式长度。

自建示例
--------

.. code-block:: text

   输入：pattern="abba", s="red blue blue red"
   输出：true

   输入：pattern="ab", s="same same"
   输出：false
