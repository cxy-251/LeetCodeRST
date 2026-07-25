1930. Unique Length-3 Palindromic Subsequences
=============================================

题目信息
--------

:题号: 1930
:难度: Medium
:主题: 字符串、集合、前缀信息
:原题: `LeetCode 1930 <https://leetcode.com/problems/unique-length-3-palindromic-subsequences/>`_
:重点: 只统计内容不同的长度 3 回文子序列

题目重述
--------

统计字符串中能够作为子序列出现的不同长度 3 回文串数量。相同字符内容即使由不同下标产生，也只计一次。

自建示例
--------

.. code-block:: text

   输入：s = "aabca"
   输出：2
   解释：不同回文子序列为 "aba" 和 "aca"。

.. code-block:: text

   输入：s = "abc"
   输出：0
   解释：首尾无法选择相同字符。
