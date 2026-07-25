1638. Count Substrings That Differ by One Character
===================================================

题目信息
--------

:题号: 1638
:难度: Medium
:主题: 字符串、动态规划、枚举
:原题: `LeetCode 1638 <https://leetcode.com/problems/count-substrings-that-differ-by-one-character/>`_
:重点: 两个非空子串长度相同且恰好一个对应字符不同；不同起止位置分别计数

题目重述
--------

给定字符串 ``s`` 和 ``t``。统计从两者各选择一个等长非空子串，使两个子串恰好在一个位置字符不同的方案数。

自建示例
--------

.. code-block:: text

   输入：s = "a", t = "b"
   输出：1
   解释：唯一一对子串恰好有一个字符不同。

.. code-block:: text

   输入：s = "aa", t = "aa"
   输出：0
   解释：任意对应子串都没有不同字符。