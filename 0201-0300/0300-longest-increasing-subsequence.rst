0300. Longest Increasing Subsequence
====================================

题目信息
--------

:题号: 0300
:难度: Medium
:主题: 数组、动态规划、二分查找
:原题: `LeetCode 0300 <https://leetcode.com/problems/longest-increasing-subsequence/>`_
:教学重点: 子序列状态、严格递增、最小结尾数组

题目重述
--------

给定整数数组 ``nums``，接口为 ``int lengthOfLIS(vector<int>& nums)``。返回最长严格递增子序列的长度；子序列保持原下标顺序但可以跳过元素，相等值不能延长。数组长度最多约 2500，元素范围约 ``[-10^4,10^4]``，只返回长度，不要求恢复具体序列。

自建示例
--------

.. code-block:: text

   输入：[3,1,2,5,4,7]
   输出：4
   说明：例如 1,2,4,7。

   输入：[2,2,2]
   输出：1
