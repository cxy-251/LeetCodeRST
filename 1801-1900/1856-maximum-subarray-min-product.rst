1856. Maximum Subarray Min-Product
=================================

题目信息
--------

:题号: 1856
:难度: Medium
:主题: 单调栈、前缀和
:原题: `LeetCode 1856 <https://leetcode.com/problems/maximum-subarray-min-product/>`_
:重点: 子数组最小值乘以子数组元素和，求最大值

题目重述
--------

对每个非空连续子数组，计算其元素和与最小元素的乘积。返回最大乘积并对 ``10^9 + 7`` 取模。

自建示例
--------

.. code-block:: text

   输入：nums = [1,2,3]
   输出：10
   解释：子数组 [2,3] 的和为 5、最小值为 2，乘积为 10。

.. code-block:: text

   输入：nums = [4]
   输出：16
   解释：唯一子数组的和与最小值都为 4。
