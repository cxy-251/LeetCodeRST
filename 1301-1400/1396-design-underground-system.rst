1396. Design Underground System
===============================

题目信息
--------

:题号: 1396
:难度: Medium
:主题: 设计题、哈希表、行程统计
:原题: `LeetCode 1396 <https://leetcode.com/problems/design-underground-system/>`_
:重点: 记录乘客进出站状态，并按有向站点对累计总时长和行程次数，返回平均时间

题目重述
--------

实现 ``UndergroundSystem`` 类。``checkIn(id, stationName, t)`` 记录乘客进站；``checkOut(id, stationName, t)`` 结束该乘客当前行程；``getAverageTime(startStation,endStation)`` 返回历史上该有向路线全部已完成行程的平均用时。

同一乘客在一次行程完成前不会再次进站，出站时间严格晚于进站时间，查询的路线保证至少有一条已完成记录。各次调用共享历史数据。

方法调用总数不超过 ``2 * 10^4``。

自建示例
--------

同一路线的多次行程取平均值：

.. code-block:: text

   输入：乘客 1 在 A@3 进站、B@8 出站；乘客 2 在 A@10 进站、B@16 出站；查询 A 到 B
   输出：5.5
   解释：两次用时分别为 5 和 6，平均值为 5.5。

反向路线独立统计：

.. code-block:: text

   输入：另记录乘客 3 在 B@20 进站、A@24 出站；查询 B 到 A
   输出：4.0
   解释：B 到 A 与 A 到 B 是不同路线。