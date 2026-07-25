1498. Number of Subsequences That Satisfy the Given Sum Condition
=================================================================

题目信息
--------

:题号: 1498
:难度: Medium
:主题: 数组、排序、双指针、组合计数
:原题: `LeetCode 1498 <https://leetcode.com/problems/number-of-subsequences-that-satisfy-the-given-sum-condition/>`_
:重点: 统计非空子序列，使其中最小值与最大值之和不超过 ``target``；不同下标选择分别计数，答案取模

题目重述
--------

给定正整数数组 ``nums`` 和整数 ``target``。从数组中选择一个保持原下标顺序的非空子序列。

若该子序列的最小元素与最大元素之和不超过 ``target``，则它合法。请返回合法子序列数量对 ``10^9 + 7`` 取模后的结果。

``1 <= nums.length <= 10^5``，``1 <= nums[i], target <= 10^6``。

自建示例
--------

重复元素对应的不同下标选择分别计数：

.. code-block:: text

   输入：nums = [2,3,3], target = 6
   输出：7
   解释：所有七个非空子序列的最小值与最大值之和都不超过 6。

单元素自身超过限制时没有合法子序列：

.. code-block:: text

   输入：nums = [5], target = 9
   输出：0
   解释：唯一非空子序列的最小值与最大值之和为 10。