1684. Count the Number of Consistent Strings
============================================

题目信息
--------

:题号: 1684
:难度: Easy
:主题: 字符串、集合
:原题: `LeetCode 1684 <https://leetcode.com/problems/count-the-number-of-consistent-strings/>`_
:重点: 一致字符串中的每个字符都必须属于 ``allowed``

题目重述
--------

给定不含重复字符的 ``allowed`` 和字符串数组 ``words``。统计所有字符均来自 ``allowed`` 的字符串数量。

自建示例
--------

.. code-block:: text

   输入：allowed = "ab", words = ["a","b","ab","ac"]
   输出：3
   解释：前三个字符串只包含 a 和 b。

.. code-block:: text

   输入：allowed = "z", words = ["zz","x"]
   输出：1
   解释：只有 "zz" 一致。