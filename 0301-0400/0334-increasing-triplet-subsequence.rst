0334. Increasing Triplet Subsequence
====================================

题目信息
--------

:题号: 0334
:难度: Medium
:主题: 数组、贪心
:原题: `LeetCode 334 <https://leetcode.com/problems/increasing-triplet-subsequence/>`_
:教学重点: 用两个最小候选值在线判断是否出现第三个更大的元素。

题目重述
--------

判断数组中是否存在下标 ``i < j < k``，使 ``nums[i] < nums[j] < nums[k]``。只要求子序列，不要求三个元素连续。

自建示例
--------

输入 ``[2,1,5,0,4,6]`` 返回 ``true``，例如子序列 ``1,4,6``。
