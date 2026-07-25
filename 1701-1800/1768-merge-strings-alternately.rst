1768. Merge Strings Alternately
===============================

题目信息
--------

:题号: 1768
:难度: Easy
:主题: 字符串、双指针
:原题: `LeetCode 1768 <https://leetcode.com/problems/merge-strings-alternately/>`_
:重点: 从 ``word1`` 开始交替取字符，较长字符串剩余部分直接追加

题目重述
--------

按 ``word1[0]``、``word2[0]``、``word1[1]``、``word2[1]`` 的顺序合并两个字符串，某一字符串耗尽后追加另一字符串剩余部分。

自建示例
--------

.. code-block:: text

   输入：word1 = "ab", word2 = "pqrs"
   输出："apbqrs"
   解释：交替合并前两对字符后追加 "rs"。

.. code-block:: text

   输入：word1 = "x", word2 = "y"
   输出："xy"
   解释：各取一个字符。