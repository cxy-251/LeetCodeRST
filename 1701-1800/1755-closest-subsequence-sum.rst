1755. Closest Subsequence Sum
============================

题目信息
--------

:题号: 1755
:难度: Hard
:主题: 折半搜索、子集和
:原题: `LeetCode 1755 <https://leetcode.com/problems/closest-subsequence-sum/>`_
:重点: 可选择任意子序列，包括空集，最小化元素和与 ``goal`` 的绝对差

题目重述
--------

给定整数数组和目标值。返回任意元素子集之和与 ``goal`` 的最小绝对差。

自建示例
--------

.. code-block:: text

   输入：nums = [5,-7,3,5], goal = 6
   输出：0
   解释：选择全部元素时总和恰为 6。

.. code-block:: text

   输入：nums = [1], goal = 3
   输出：2
   解释：选择 1 比选择空集更接近目标。