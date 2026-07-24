0524. Longest Word in Dictionary through Deleting
==================================================

题目信息
--------

:题号: 0524
:难度: Medium
:主题: 字符串、字典、子序列、长度与字典序
:原题: `LeetCode 0524 <https://leetcode.com/problems/longest-word-in-dictionary-through-deleting/>`_
:重点: 只能从源字符串删除字符、候选必须来自 dictionary、优先长度最长、并列取字典序最小

题目重述
--------

给定字符串 ``s`` 和字符串数组 ``dictionary``。可以从 ``s`` 中删除任意字符，但不能改变剩余字符的相对顺序。找出字典中能够通过这种方式得到的单词。

在所有可行单词中，返回长度最长者；若有多个长度相同的候选，返回字典序最小者。若没有任何候选，返回空字符串 ``""``。不能重新排列 ``s`` 中的字符，也不能返回不在字典中的字符串。

自建示例
--------

最长长度并列时比较字典序：

.. code-block:: text

   输入：s = "abpcd"，dictionary = ["ale","abc","abd"]
   输出："abc"
   解释："abc" 和 "abd" 都能按顺序从 s 中取得且长度同为 3；"abc" 的字典序更小。

没有可行单词：

.. code-block:: text

   输入：s = "xyz"，dictionary = ["xyzz","za"]
   输出：""
   解释：两个字典单词都不是 s 的子序列。