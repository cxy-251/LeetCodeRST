0387. First Unique Character in a String
========================================

题目信息
--------

:题号: 0387
:难度: Easy
:主题: 哈希表、字符串、计数、队列
:原题: `LeetCode 387 <https://leetcode.com/problems/first-unique-character-in-a-string/>`_
:教学重点: 先统计频率，再按原顺序寻找第一个只出现一次的字符。

题目重述
--------

给定字符串 ``s``，返回第一个不重复字符的下标；如果所有字符都重复，返回 ``-1``。

自建示例
--------

``s = "leetcode"`` 返回 ``0``；``s = "aabb"`` 返回 ``-1``。
