0915. Partition Array into Disjoint Intervals
==============================================

题目信息
--------

:题号: 0915
:难度: Medium
:主题: 数组、前缀最大值、后缀最小值、贪心
:原题: `LeetCode 0915 <https://leetcode.com/problems/partition-array-into-disjoint-intervals/>`_
:教学重点: 找到最早满足左侧最大值不大于右侧最小值的分界点。

题目重述
--------

把数组 ``nums`` 分成连续且非空的 ``left`` 和 ``right``，要求 ``left`` 中每个元素都小于或等于 ``right`` 中每个元素。返回满足条件时 ``left`` 的最小长度。

自建示例
--------

``nums=[5,0,3,8,6]``。取 ``left=[5,0,3]``、``right=[8,6]`` 时左侧最大值 5 不大于右侧最小值 6，且更短前缀不满足条件，因此答案为 ``3``。
