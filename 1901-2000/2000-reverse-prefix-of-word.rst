2000. Reverse Prefix of Word
============================

题目信息
--------

:题号: 2000
:难度: Easy
:主题: 字符串、双指针
:原题: `LeetCode 2000 <https://leetcode.com/problems/reverse-prefix-of-word/>`_
:重点: 只反转从开头到字符 ``ch`` 首次出现位置的前缀

题目重述
--------

找到 ``ch`` 在 ``word`` 中第一次出现的下标，反转从下标 0 到该位置的前缀，其余部分保持不变。

自建示例
--------

.. code-block:: text

   输入：word = "abcdefd", ch = "d"
   输出："dcbaefd"
   解释：首次出现的 d 位于下标 3，反转前缀 "abcd"。

.. code-block:: text

   输入：word = "xy", ch = "x"
   输出："xy"
   解释：前缀只有首字符，反转后不变。
