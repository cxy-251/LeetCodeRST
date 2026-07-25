1749. Maximum Absolute Sum of Any Subarray
==========================================

题目信息
--------

:题号: 1749
:难度: Medium
:主题: 动态规划、前缀和
:原题: `LeetCode 1749 <https://leetcode.com/problems/maximum-absolute-sum-of-any-subarray/>`_
:重点: 子数组允许为空，目标最大化连续子数组和的绝对值

题目重述
--------

给定整数数组，返回任意连续子数组元素和绝对值的最大值；空子数组和为零。

自建示例
--------

.. code-block:: text

   输入：nums = [1,-3,2,3,-4]
   输出：5
   解释：子数组 [2,3] 的和为 5。

.. code-block:: text

   输入：nums = [0]
   输出：0
   解释：所有子数组和都为零。