0592. Fraction Addition and Subtraction
=======================================

题目信息
--------

:题号: 0592
:难度: Medium
:主题: 分数表达式、加减运算、最简分数、符号处理
:原题: `LeetCode 0592 <https://leetcode.com/problems/fraction-addition-and-subtraction/>`_
:重点: 表达式由带符号分数组成、按从左到右求和、返回不可约的 numerator/denominator、零写成 0/1

题目重述
--------

给定一个只包含分数加法和减法的合法表达式 ``expression``。每一项都写成 ``numerator/denominator``，项前可以带 ``+`` 或 ``-``；若第一项没有符号，则视为正数。

计算整个表达式的结果，并返回格式为 ``"numerator/denominator"`` 的最简分数。分母必须为正，分子和分母需要约分到互质；若结果为零，返回 ``"0/1"``。

自建示例
--------

多项运算后仍需约分：

.. code-block:: text

   输入：expression = "1/2-1/3+1/6"
   输出："1/3"
   解释：结果为 1/2-1/3+1/6=1/3，已经是最简分数。

结果为零：

.. code-block:: text

   输入：expression = "-1/4+1/4"
   输出："0/1"
   解释：两项相互抵消，零按规定写成 0/1。
