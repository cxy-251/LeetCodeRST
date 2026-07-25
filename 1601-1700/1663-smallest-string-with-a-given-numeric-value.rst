1663. Smallest String With A Given Numeric Value
================================================

题目信息
--------

:题号: 1663
:难度: Medium
:主题: 贪心、字符串构造
:原题: `LeetCode 1663 <https://leetcode.com/problems/smallest-string-with-a-given-numeric-value/>`_
:重点: 字母值为 ``a=1`` 到 ``z=26``，构造固定长度且总值为 ``k`` 的字典序最小字符串

题目重述
--------

给定长度 ``n`` 和总数值 ``k``。返回长度为 ``n``、字符数值和恰为 ``k`` 的字典序最小小写字符串。

自建示例
--------

.. code-block:: text

   输入：n = 3, k = 27
   输出："aay"
   解释：先保持前缀尽量小，把剩余数值集中到末尾。

.. code-block:: text

   输入：n = 1, k = 26
   输出："z"
   解释：唯一长度为一且数值为 26 的字符是 z。