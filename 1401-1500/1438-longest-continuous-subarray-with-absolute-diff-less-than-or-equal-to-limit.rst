1438. Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit
================================================================================

题目信息
--------

:题号: 1438
:难度: Medium
:主题: 滑动窗口、单调队列、连续子数组
:原题: `LeetCode 1438 <https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit/>`_
:重点: 子数组中任意两元素绝对差不超过 ``limit``，等价于最大值减最小值不超过限制

题目重述
--------

给定整数数组 ``nums`` 和非负整数 ``limit``。寻找一个连续非空子数组，使其中任意两个元素的绝对差都不超过 ``limit``。

请返回满足条件的最长子数组长度。

``1 <= nums.length <= 10^5``，``1 <= nums[i] <= 10^9``，``0 <= limit <= 10^9``。

自建示例
--------

窗口内最大值与最小值之差决定合法性：

.. code-block:: text

   输入：nums = [8,2,4,7], limit = 4
   输出：2
   解释：[2,4] 的最大值与最小值之差为 2；任何长度为三的子数组差值都超过 4。

限制为零时只能保留全部相同的连续段：

.. code-block:: text

   输入：nums = [5,5,5], limit = 0
   输出：3
   解释：整段所有元素都相同。