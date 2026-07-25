1915. Number of Wonderful Substrings
====================================

题目信息
--------

:题号: 1915
:难度: Medium
:主题: 位掩码、前缀状态
:原题: `LeetCode 1915 <https://leetcode.com/problems/number-of-wonderful-substrings/>`_
:重点: 子串中至多一种字符出现奇数次

题目重述
--------

字符串只含前十个小写字母。统计所有连续子串中，最多只有一种字符出现奇数次的子串数量。

自建示例
--------

.. code-block:: text

   输入：word = "aba"
   输出：4
   解释：三个单字符子串和整个 "aba" 都满足条件。

.. code-block:: text

   输入：word = "aa"
   输出：3
   解释：两个单字符子串与 "aa" 都是奇妙子串。
