1614. Maximum Nesting Depth of the Parentheses
==============================================

题目信息
--------

:题号: 1614
:难度: Easy
:主题: 字符串、括号计数
:原题: `LeetCode 1614 <https://leetcode.com/problems/maximum-nesting-depth-of-the-parentheses/>`_
:重点: 扫描有效括号字符串，记录任意位置尚未闭合的左括号最大数量

题目重述
--------

给定一个保证有效的括号字符串，其中还可以包含数字、运算符和字母。返回括号的最大嵌套深度；字符串没有括号时返回 ``0``。

自建示例
--------

.. code-block:: text

   输入：s = "a+(b*(c+d))"
   输出：2
   解释：最内层表达式位于两层左括号之内。

.. code-block:: text

   输入：s = "abc"
   输出：0
   解释：字符串中没有括号。