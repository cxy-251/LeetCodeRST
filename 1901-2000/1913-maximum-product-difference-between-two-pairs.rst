1913. Maximum Product Difference Between Two Pairs
==================================================

题目信息
--------

:题号: 1913
:难度: Easy
:主题: 排序、数组
:原题: `LeetCode 1913 <https://leetcode.com/problems/maximum-product-difference-between-two-pairs/>`_
:重点: 选择最大的两个元素与最小的两个元素

题目重述
--------

从数组中选择四个不同下标，最大化 ``nums[w] * nums[x] - nums[y] * nums[z]`` 并返回结果。

自建示例
--------

.. code-block:: text

   输入：nums = [5,6,2,7,4]
   输出：34
   解释：7 × 6 - 2 × 4 = 34。

.. code-block:: text

   输入：nums = [1,2,3,4]
   输出：10
   解释：4 × 3 - 1 × 2 = 10。
