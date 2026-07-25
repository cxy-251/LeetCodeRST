1798. Maximum Number of Consecutive Values You Can Make
======================================================

题目信息
--------

:题号: 1798
:难度: Medium
:主题: 贪心、排序、子集和
:原题: `LeetCode 1798 <https://leetcode.com/problems/maximum-number-of-consecutive-values-you-can-make/>`_
:重点: 从硬币中选择任意子集，统计从零开始连续可表示的整数数量

题目重述
--------

每枚硬币最多使用一次。返回能够用某个硬币子集表示的连续整数 ``0,1,...,x`` 的数量。

自建示例
--------

.. code-block:: text

   输入：coins = [1,3]
   输出：2
   解释：可表示 0 和 1，但不能表示 2。

.. code-block:: text

   输入：coins = [1,1,2]
   输出：5
   解释：可以表示从 0 到 4 的所有整数。