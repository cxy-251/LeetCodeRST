1680. Concatenation of Consecutive Binary Numbers
================================================

题目信息
--------

:题号: 1680
:难度: Medium
:主题: 位运算、模运算
:原题: `LeetCode 1680 <https://leetcode.com/problems/concatenation-of-consecutive-binary-numbers/>`_
:重点: 按顺序连接 ``1`` 到 ``n`` 的无前导零二进制表示，并对 ``10^9+7`` 取模

题目重述
--------

把整数 ``1,2,...,n`` 的二进制文本依次连接，视为一个二进制整数，返回其十进制值模 ``10^9+7``。

自建示例
--------

.. code-block:: text

   输入：n = 3
   输出：27
   解释：拼接得到二进制 11011，即十进制 27。

.. code-block:: text

   输入：n = 1
   输出：1
   解释：只有二进制 1。