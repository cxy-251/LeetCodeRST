1896. Minimum Cost to Change the Final Value of Expression
=========================================================

题目信息
--------

:题号: 1896
:难度: Hard
:主题: 栈、表达式、动态规划
:原题: `LeetCode 1896 <https://leetcode.com/problems/minimum-cost-to-change-the-final-value-of-expression/>`_
:重点: 每次可翻转一个二进制常量或交换一个逻辑运算符，求改变最终值的最小代价

题目重述
--------

表达式由 ``0``、``1``、``&``、``|`` 和括号组成。一次操作可把 0 与 1 互换，或把 ``&`` 与 ``|`` 互换。返回使表达式结果改变所需的最少操作数。

自建示例
--------

.. code-block:: text

   输入：expression = "1&1"
   输出：1
   解释：把任意一个 1 改为 0，结果即从 1 变为 0。

.. code-block:: text

   输入：expression = "0|0"
   输出：1
   解释：把任意一个 0 改为 1，结果即从 0 变为 1。
