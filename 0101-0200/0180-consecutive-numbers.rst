0180. Consecutive Numbers
=========================

题目信息
--------

:题号: 0180
:难度: Medium
:类型: Database
:主题: SQL、自连接、窗口函数、连续记录
:原题: `LeetCode 180 <https://leetcode.com/problems/consecutive-numbers/>`_
:教学重点: 必须依据相邻 ``id`` 记录判断连续性，并对最终数字去重。

题目重述
--------

``Logs`` 表按 ``id`` 表示记录顺序。找出至少连续出现三次的所有不同 ``num``，输出列名为 ``ConsecutiveNums``。只有相邻记录中的连续重复才算，分散出现不能合并。

自建示例
--------

.. code-block:: text

   Logs:
   id | num
   1  | 1
   2  | 1
   3  | 1
   4  | 2
   5  | 1
   6  | 1

   结果:
   ConsecutiveNums
   1
