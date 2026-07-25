1967. Number of Strings That Appear as Substrings in Word
========================================================

题目信息
--------

:题号: 1967
:难度: Easy
:主题: 字符串、数组
:原题: `LeetCode 1967 <https://leetcode.com/problems/number-of-strings-that-appear-as-substrings-in-word/>`_
:重点: 独立判断每个模式串是否为 ``word`` 的连续子串

题目重述
--------

返回字符串数组 ``patterns`` 中，有多少个字符串是 ``word`` 的子串。重复模式按数组位置分别计数。

自建示例
--------

.. code-block:: text

   输入：patterns = ["a","abc","bc"], word = "abc"
   输出：3
   解释：三个模式都在 word 中连续出现。

.. code-block:: text

   输入：patterns = ["x","yy"], word = "abc"
   输出：0
   解释：没有模式串出现。
