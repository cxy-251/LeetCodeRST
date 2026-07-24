0622. Design Circular Queue
===========================

题目信息
--------

:题号: 0622
:难度: Medium
:主题: 设计、固定容量队列、循环首尾、跨调用状态
:原题: `LeetCode 0622 <https://leetcode.com/problems/design-circular-queue/>`_
:重点: 队列容量固定、入队和出队返回是否成功、空队列查询首尾返回 -1、对象需要在连续调用之间保存状态

题目重述
--------

实现固定容量为 ``k`` 的循环队列 ``MyCircularQueue``。``enQueue(value)`` 在队尾加入元素并返回是否成功；``deQueue()`` 删除队首元素并返回是否成功；``Front()`` 和 ``Rear()`` 分别返回队首和队尾元素；``isEmpty()``、``isFull()`` 判断当前状态。

队列已满时入队失败，队列为空时出队失败；空队列调用 ``Front()`` 或 ``Rear()`` 必须返回 ``-1``。``k`` 位于 ``[1, 1000]``，入队值位于 ``[0, 1000]``，所有方法的总调用次数不超过 ``3000``。同一对象在各次调用之间持续保存其中的元素和首尾位置。

自建示例
--------

首尾跨过底层数组边界：

.. code-block:: text

   调用：MyCircularQueue(2), enQueue(4), enQueue(7), deQueue(), enQueue(9), Front(), Rear(), isFull()
   输出：true, true, true, true, 7, 9, true
   解释：删除 4 后重新加入 9，逻辑队列为 [7,9]；循环存储位置是否回绕不影响队首和队尾结果。

空队列操作失败：

.. code-block:: text

   调用：MyCircularQueue(1), deQueue(), Front(), Rear(), isEmpty()
   输出：false, -1, -1, true
   解释：容量为 1 的新队列仍为空，不能删除元素，首尾查询按规定返回 -1。
