0282. Expression Add Operators
==============================

题目信息
--------

:题号: 0282
:难度: Hard
:主题: 回溯、字符串、数学
:原题: `LeetCode 0282 <https://leetcode.com/problems/expression-add-operators/>`_
:教学重点: 分段、乘法优先级、前导零、溢出

题目重述
--------

给定只含数字的字符串 ``num`` 与目标整数 ``target``，接口为 ``vector<string> addOperators(string num, int target)``。在数字之间插入 ``+``、``-``、``*`` 或不插入，返回所有计算结果等于目标的表达式。数字顺序不可改变，操作数除单个 ``0`` 外不能有前导零；答案顺序不限且不得重复。

自建示例
--------

.. code-block:: text

   输入：num="105", target=5
   输出：["1*0+5","10-5"]
