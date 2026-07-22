0241. Different Ways to Add Parentheses
=======================================

题目信息
--------

:题号: 0241
:难度: Medium
:主题: 分治、记忆化、字符串、动态规划
:原题: `LeetCode 0241 <https://leetcode.com/problems/different-ways-to-add-parentheses/>`_
:教学重点: 最后运算符分割、笛卡尔组合、重复子串

题目重述
--------

给定由非负整数和 ``+ - *`` 组成的表达式 ``expression``，接口为 ``vector<int> diffWaysToCompute(string expression)``。枚举所有不同加括号方式并返回对应计算结果；相同数值由不同括号方式产生时可以重复出现，返回顺序不限。字符串长度最多约 20，结果适合 32 位整数。

自建示例
--------

.. code-block:: text

   输入："2*3-4"
   输出：[-2,2]
   说明：(2*3)-4=2，2*(3-4)=-2。
