1658. Minimum Operations to Reduce X to Zero
============================================

题目信息
--------

:题号: 1658
:难度: Medium
:主题: 滑动窗口、前后缀
:原题: `LeetCode 1658 <https://leetcode.com/problems/minimum-operations-to-reduce-x-to-zero/>`_
:重点: 每次只能移除数组左端或右端元素，并从 ``x`` 中减去该值

题目重述
--------

给定正整数数组和 ``x``。通过移除两端元素使被移除元素总和恰为 ``x``，返回最少操作数；无法做到返回 ``-1``。

自建示例
--------

.. code-block:: text

   输入：nums = [1,1,4,2,3], x = 5
   输出：2
   解释：移除右端 3 和 2。

.. code-block:: text

   输入：nums = [2,4], x = 3
   输出：-1
   解释：任何两端移除组合都不能得到和 3。