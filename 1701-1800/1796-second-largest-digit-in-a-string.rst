1796. Second Largest Digit in a String
======================================

题目信息
--------

:题号: 1796
:难度: Easy
:主题: 字符串、集合
:原题: `LeetCode 1796 <https://leetcode.com/problems/second-largest-digit-in-a-string/>`_
:重点: 只考虑不同数字字符，返回第二大数值

题目重述
--------

给定由小写字母和数字组成的字符串。返回其中第二大的不同数字；不足两个不同数字时返回 ``-1``。

自建示例
--------

.. code-block:: text

   输入：s = "dfa12321afd"
   输出：2
   解释：不同数字为 1、2、3，第二大是 2。

.. code-block:: text

   输入：s = "abc9"
   输出：-1
   解释：只有一个不同数字。