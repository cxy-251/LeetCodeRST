1920. Build Array from Permutation
=================================

题目信息
--------

:题号: 1920
:难度: Easy
:主题: 数组、模拟
:原题: `LeetCode 1920 <https://leetcode.com/problems/build-array-from-permutation/>`_
:重点: 构造 ``ans[i] = nums[nums[i]]``

题目重述
--------

给定零基排列 ``nums``，返回同长度数组 ``ans``，其中每个位置满足 ``ans[i] = nums[nums[i]]``。

自建示例
--------

.. code-block:: text

   输入：nums = [0,2,1]
   输出：[0,1,2]
   解释：依次读取 nums[0]、nums[2]、nums[1]。

.. code-block:: text

   输入：nums = [0]
   输出：[0]
   解释：唯一位置映射到自身。
