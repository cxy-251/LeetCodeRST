1685. Sum of Absolute Differences in a Sorted Array
===================================================

题目信息
--------

:题号: 1685
:难度: Medium
:主题: 前缀和、有序数组
:原题: `LeetCode 1685 <https://leetcode.com/problems/sum-of-absolute-differences-in-a-sorted-array/>`_
:重点: 对每个位置求其与数组所有元素差绝对值之和

题目重述
--------

给定非递减数组 ``nums``。返回等长数组 ``result``，其中 ``result[i]`` 是 ``nums[i]`` 与所有 ``nums[j]`` 的绝对差之和。

自建示例
--------

.. code-block:: text

   输入：nums = [1,3,6]
   输出：[7,5,8]
   解释：例如位置 1 的结果为 |3-1|+|3-3|+|3-6|=5。

.. code-block:: text

   输入：nums = [4]
   输出：[0]
   解释：唯一元素与自身的差为零。