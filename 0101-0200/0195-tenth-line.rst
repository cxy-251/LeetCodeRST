0195. Tenth Line
================

题目信息
--------

:题号: 0195
:难度: Easy
:主题: Shell、行号定位、文本读取
:原题: `LeetCode 195 <https://leetcode.com/problems/tenth-line/>`_
:重点: file.txt 输入、一基行号、仅输出第十行、不足十行无输出

题目重述
--------

编写 Bash 脚本读取 ``file.txt``，并只输出文件中的第 ``10`` 行。行号从 ``1`` 开始计算，文件开头第一行是第 1 行。

输出必须保留第 10 行本身的文本内容，不输出其他行或附加说明。若文件总行数不足 10 行，则脚本不应输出任何内容。

自建示例
--------

.. code-block:: text

   file.txt:
   alpha
   beta
   gamma
   delta
   epsilon
   zeta
   eta
   theta
   iota
   selected text
   omega

   输出：
   selected text

   解释：selected text 位于文件的一基第 10 行；第 11 行 omega 不应输出。