0197. Rising Temperature
========================

题目信息
--------

:题号: 0197
:难度: Easy
:主题: SQL、日期差、自连接
:原题: `LeetCode 197 <https://leetcode.com/problems/rising-temperature/>`_
:重点: 按日期相差一天连接两日记录，再比较当天与前一天温度。

题目重述
--------

``Weather`` 表每天至多一条记录。返回温度高于前一个自然日的记录 ``id``。比较对象必须是日期恰好相差一天的记录，而不是表中上一行。

自建示例
--------

.. code-block:: text

   Weather:
   id | recordDate | temperature
   1  | 2026-01-01 | 10
   2  | 2026-01-02 | 15
   3  | 2026-01-04 | 20

   结果:
   id
   2

   第 3 行没有 2026-01-03 的记录，因此不参与比较。
