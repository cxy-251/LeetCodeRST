1480. Running Sum of 1d Array
=============================

题目信息
--------

:题号: 1480
:难度: Easy
:主题: 数组、前缀和
:原题: `LeetCode 1480 <https://leetcode.com/problems/running-sum-of-1d-array/>`_
:重点: 第 ``i`` 个结果等于原数组从下标 ``0`` 到 ``i`` 的元素总和

题目重述
--------

给定整数数组 ``nums``。构造同长度数组 ``runningSum``，其中 ``runningSum[i]`` 等于 ``nums[0] + nums[1] + ... + nums[i]``。

请返回该前缀和数组。

``1 <= nums.length <= 1000``，``-10^6 <= nums[i] <= 10^6``。

自建示例
--------

前缀和可以先减小再增大：

.. code-block:: text

   输入：nums = [1,-2,3]
   输出：[1,-1,2]
   解释：三个前缀和依次为 1、1-2、1-2+3。

单元素数组的前缀和就是自身：

.. code-block:: text

   输入：nums = [7]
   输出：[7]
   解释：唯一前缀包含该元素本身。