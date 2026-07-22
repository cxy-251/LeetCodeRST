0916. Word Subsets
==================

题目信息
--------

:题号: 0916
:难度: Medium
:主题: 字符串、字符频次、需求合并
:原题: `LeetCode 0916 <https://leetcode.com/problems/word-subsets/>`_
:教学重点: 将多个目标单词合并为每个字符所需的最大频次。

题目重述
--------

给定字符串数组 ``words1`` 和 ``words2``。若 ``words2`` 中每个单词的字符多重集合都包含在某个 ``words1`` 单词中，则该单词是通用单词。返回 ``words1`` 中全部通用单词。

自建示例
--------

``words1=["amazon","apple","facebook"]``，``words2=["e","o"]``。只有 ``facebook`` 同时包含字符 e 和 o，因此结果为 ``["facebook"]``。
