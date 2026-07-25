1758. Minimum Changes To Make Alternating Binary String
======================================================

题目信息
--------

:题号: 1758
:难度: Easy
:主题: 字符串、计数
:原题: `LeetCode 1758 <https://leetcode.com/problems/minimum-changes-to-make-alternating-binary-string/>`_
:重点: 目标只能是以 0 开头或以 1 开头的两种交替模式

题目重述
--------

每次可翻转任意一个二进制字符。返回把字符串变成相邻字符均不同的交替串所需的最少操作数。

自建示例
--------

.. code-block:: text

   输入：s = "0100"
   输出：1
   解释：把末尾 0 改为 1 得到 "0101"。

.. code-block:: text

   输入：s = "10"
   输出：0
   解释：原字符串已经交替。