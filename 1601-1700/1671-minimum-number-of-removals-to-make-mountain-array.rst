1671. Minimum Number of Removals to Make Mountain Array
======================================================

题目信息
--------

:题号: 1671
:难度: Hard
:主题: 最长递增子序列、动态规划
:原题: `LeetCode 1671 <https://leetcode.com/problems/minimum-number-of-removals-to-make-mountain-array/>`_
:重点: 保留一个先严格递增后严格递减且峰值不在端点的子序列

题目重述
--------

从数组中删除尽可能少的元素，使剩余元素按原顺序组成山形数组。返回最少删除数量。

自建示例
--------

.. code-block:: text

   输入：nums = [1,3,1]
   输出：0
   解释：原数组已经严格上升后严格下降。

.. code-block:: text

   输入：nums = [2,1,1,5,6,2,3,1]
   输出：3
   解释：可以保留 [1,5,6,3,1]。