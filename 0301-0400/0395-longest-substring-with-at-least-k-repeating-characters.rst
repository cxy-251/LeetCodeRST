0395. Longest Substring with At Least K Repeating Characters
============================================================

题目信息
--------

:题号: 0395
:难度: Medium
:主题: 哈希表、字符串、分治、滑动窗口
:原题: `LeetCode 395 <https://leetcode.com/problems/longest-substring-with-at-least-k-repeating-characters/>`_
:教学重点: 用出现次数不足 ``k`` 的字符切分区间，或枚举窗口中的不同字符数量。

题目重述
--------

给定字符串 ``s`` 和整数 ``k``，寻找最长连续子串，使该子串中出现的每一种字符都至少出现 ``k`` 次，返回其长度。

自建示例
--------

``s = "aaabb"``，``k = 3``，最长合法子串为 ``"aaa"``，返回 ``3``。
