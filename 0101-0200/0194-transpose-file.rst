0194. Transpose File
====================

题目信息
--------

:题号: 0194
:难度: Medium
:主题: Shell、文本矩阵、转置
:原题: `LeetCode 194 <https://leetcode.com/problems/transpose-file/>`_
:重点: 逐行保存每一列的字段，并在读取结束后按列编号输出。

题目重述
--------

读取字段数一致的 ``file.txt``，把原文件的列转换为输出的行。字段由空白分隔，转置后仍以空格分隔。

自建示例
--------

.. code-block:: text

   file.txt:
   name age
   Alice 21
   Bob 30

   输出:
   name Alice Bob
   age 21 30
