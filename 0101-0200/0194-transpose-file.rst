0194. Transpose File
====================

题目信息
--------

:题号: 0194
:难度: Medium
:主题: Shell、文本矩阵、行列转置
:原题: `LeetCode 194 <https://leetcode.com/problems/transpose-file/>`_
:重点: file.txt 输入、各行字段数一致、原列变输出行、空格分隔

题目重述
--------

编写 Bash 脚本读取 ``file.txt``。文件可视为一个文本矩阵：每行包含数量相同的字段，字段之间由空格分隔。输出该矩阵的转置结果，即原文件的第 ``j`` 列变成输出的第 ``j`` 行。

转置后，同一输出行中的字段仍使用单个空格分隔，并保持它们在原文件中从上到下的顺序。若原文件有 ``r`` 行、``c`` 列，输出应有 ``c`` 行，每行包含 ``r`` 个字段。

自建示例
--------

.. code-block:: text

   file.txt:
   item qty zone
   pens 8 north
   paper 3 west

   输出：
   item pens paper
   qty 8 3
   zone north west

   解释：原来的三列分别成为三行；每列中的字段按原行顺序依次排列。