1800. Maximum Ascending Subarray Sum
====================================

题目信息
--------

:题号: 1800
:难度: Easy
:主题: 数组、连续段
:原题: `LeetCode 1800 <https://leetcode.com/problems/maximum-ascending-subarray-sum/>`_
:重点: 子数组中每个后续元素必须严格大于前一个，求最大元素和

题目重述
--------

给定正整数数组。返回所有严格递增连续子数组的最大元素和。

自建示例
--------

.. code-block:: text

   输入：nums = [10,20,30,5,10,50]
   输出：65
   解释：子数组 [5,10,50] 严格递增且和为 65。

.. code-block:: text

   输入：nums = [5,4,3]
   输出：5
   解释：任意长度大于一的连续段都不递增，选择单个 5。