1955. Count Number of Special Subsequences
==========================================

题目信息
--------

:题号: 1955
:难度: Hard
:主题: 动态规划、计数
:原题: `LeetCode 1955 <https://leetcode.com/problems/count-number-of-special-subsequences/>`_
:重点: 特殊子序列由非空 0 段、非空 1 段、非空 2 段依次组成

题目重述
--------

数组只含 0、1、2。统计子序列数量，使其由一个或多个 0、随后一个或多个 1、最后一个或多个 2 组成。结果取模。

自建示例
--------

.. code-block:: text

   输入：nums = [0,1,2]
   输出：1
   解释：唯一特殊子序列是整个数组。

.. code-block:: text

   输入：nums = [0,0,1,2]
   输出：3
   解释：可以选择第一个 0、第二个 0，或同时选择两个 0，再接 1 和 2。
