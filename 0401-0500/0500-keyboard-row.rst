0500. Keyboard Row
==================

题目信息
--------

:题号: 0500
:难度: Easy
:主题: QWERTY 键盘、单行字母、大小写忽略、单词筛选
:原题: `LeetCode 0500 <https://leetcode.com/problems/keyboard-row/>`_
:重点: 单词的全部字母必须来自同一键盘行、判断时忽略大小写、返回原单词及原顺序

题目重述
--------

标准美式 QWERTY 键盘的三行字母分别是 ``QWERTYUIOP``、``ASDFGHJKL`` 和 ``ZXCVBNM``。给定单词数组 ``words``，返回所有能够只使用其中同一行字母输入的单词。

判断所属键盘行时忽略字母大小写，但返回结果必须保留输入单词原来的拼写和大小写，并按它们在 ``words`` 中的原顺序排列。``words.length`` 位于 ``[1, 20]``，每个单词长度位于 ``[1, 100]``，只包含大小写英文字母。

自建示例
--------

筛选来自单一键盘行的单词：

.. code-block:: text

   输入：words = ["Gas", "Tree", "Mom", "quiz"]
   输出：["Gas", "Tree"]
   解释：Gas 的字母都在键盘中行，Tree 的字母都在上行；Mom 和 quiz 分别跨越多行。

大小写不影响判断：

.. code-block:: text

   输入：words = ["TYPE", "sad"]
   输出：["TYPE", "sad"]
   解释：TYPE 全部来自上行，sad 全部来自中行，返回时保留原大小写。
