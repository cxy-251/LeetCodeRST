1803. Count Pairs With XOR in a Range
=====================================

题目信息
--------

:题号: 1803
:难度: Hard
:主题: 位运算、字典树
:原题: `LeetCode 1803 <https://leetcode.com/problems/count-pairs-with-xor-in-a-range/>`_
:重点: 统计下标对 ``i < j`` 且异或值落在闭区间内的数量

题目重述
--------

给定整数数组以及 ``low``、``high``，统计满足 ``low <= nums[i] XOR nums[j] <= high`` 的下标对数量。

自建示例
--------

.. code-block:: text

   输入：nums = [1,2,3], low = 2, high = 3
   输出：2
   解释：数对 (1,2) 的异或为 3，(1,3) 的异或为 2。

.. code-block:: text

   输入：nums = [0,0], low = 1, high = 1
   输出：0
   解释：唯一数对的异或值为 0，不在区间内。
