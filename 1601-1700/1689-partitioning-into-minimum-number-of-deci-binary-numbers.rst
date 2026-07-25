1689. Partitioning Into Minimum Number Of Deci-Binary Numbers
=============================================================

题目信息
--------

:题号: 1689
:难度: Medium
:主题: 数字字符串、贪心
:原题: `LeetCode 1689 <https://leetcode.com/problems/partitioning-into-minimum-number-of-deci-binary-numbers/>`_
:重点: 十进制二进制数每位只能为 0 或 1，最少数量等于原数最大数位

题目重述
--------

给定无前导零十进制字符串 ``n``。把它表示为若干个每位只含 ``0`` 或 ``1`` 的正整数之和，返回所需最少数量。

自建示例
--------

.. code-block:: text

   输入：n = "32"
   输出：3
   解释：十位数字 3 至少需要三个加数在该位取 1。

.. code-block:: text

   输入：n = "1000"
   输出：1
   解释：原数本身就是十进制二进制数。