1546. Maximum Number of Non-Overlapping Subarrays With Sum Equals Target
=======================================================================

题目信息
--------

:题号: 1546
:难度: Medium
:主题: 数组、前缀和、贪心、哈希集合
:原题: `LeetCode 1546 <https://leetcode.com/problems/maximum-number-of-non-overlapping-subarrays-with-sum-equals-target/>`_
:重点: 选择若干互不重叠的非空连续子数组，每段元素和必须等于 ``target``，最大化段数

题目重述
--------

给定整数数组 ``nums`` 和整数 ``target``。可以选择若干非空连续子数组，要求任意两段在下标上互不重叠，并且每段元素和都恰好等于 ``target``。

请返回能够选择的最大子数组数量。

``1 <= nums.length <= 10^5``，``-10^4 <= nums[i], target <= 10^4``。

自建示例
--------

相邻的目标和区间可以分别计数：

.. code-block:: text

   输入：nums = [1,1,1,1], target = 2
   输出：2
   解释：选择下标区间 [0,1] 和 [2,3]，两段互不重叠且和都为 2。

不存在目标和子数组时返回零：

.. code-block:: text

   输入：nums = [3,4], target = 2
   输出：0
   解释：所有非空连续子数组的和都不等于 2。