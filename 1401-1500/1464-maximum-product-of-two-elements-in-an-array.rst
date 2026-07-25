1464. Maximum Product of Two Elements in an Array
=================================================

题目信息
--------

:题号: 1464
:难度: Easy
:主题: 数组、最大值
:原题: `LeetCode 1464 <https://leetcode.com/problems/maximum-product-of-two-elements-in-an-array/>`_
:重点: 选择两个不同下标，最大化 ``(nums[i]-1) * (nums[j]-1)``

题目重述
--------

给定正整数数组 ``nums``。选择两个不同下标 ``i`` 和 ``j``，计算 ``(nums[i]-1) * (nums[j]-1)``。

请返回所有选择中的最大结果。

``2 <= nums.length <= 500``，``1 <= nums[i] <= 1000``。

自建示例
--------

选择最大的两个元素可以获得最大乘积：

.. code-block:: text

   输入：nums = [3,4,5]
   输出：12
   解释：选择 5 和 4，结果为 (5-1) * (4-1) = 12。

两个元素都为一时结果为零：

.. code-block:: text

   输入：nums = [1,1]
   输出：0
   解释：两个因子都等于零。