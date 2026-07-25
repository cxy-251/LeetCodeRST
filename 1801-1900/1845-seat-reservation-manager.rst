1845. Seat Reservation Manager
==============================

题目信息
--------

:题号: 1845
:难度: Medium
:主题: 设计、优先队列
:原题: `LeetCode 1845 <https://leetcode.com/problems/seat-reservation-manager/>`_
:重点: ``reserve`` 总是分配编号最小的空闲座位

题目重述
--------

实现座位管理器。``reserve`` 占用并返回当前编号最小的空闲座位；``unreserve`` 释放指定已占用座位。

自建示例
--------

.. code-block:: text

   输入：SeatManager(3)；reserve()；reserve()；unreserve(1)；reserve()
   输出：[null,1,2,null,1]
   解释：释放 1 号座位后，它再次成为最小空闲编号。

.. code-block:: text

   输入：SeatManager(1)；reserve()
   输出：[null,1]
   解释：唯一座位编号为 1。
