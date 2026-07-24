0641. Design Circular Deque
===========================

题目信息
--------

:题号: 0641
:难度: Medium
:主题: 设计、固定容量双端队列、循环首尾、对象状态
:原题: `LeetCode 0641 <https://leetcode.com/problems/design-circular-deque/>`_
:重点: 首尾两端都可插入和删除、容量固定、空结构查询返回 -1、所有操作共享同一对象状态

题目重述
--------

实现容量为 ``k`` 的循环双端队列 ``MyCircularDeque``。``insertFront(value)``、``insertLast(value)`` 分别在队首或队尾插入并返回是否成功；``deleteFront()``、``deleteLast()`` 删除对应端元素并返回是否成功。

``getFront()`` 和 ``getRear()`` 返回首、尾元素，空队列时返回 ``-1``；``isEmpty()``、``isFull()`` 判断当前状态。队列已满时任何插入都失败，队列为空时任何删除都失败。``k`` 位于 ``[1, 1000]``，元素值位于 ``[0, 1000]``，方法总调用次数不超过 ``2000``。

自建示例
--------

从两端插入并删除：

.. code-block:: text

   调用：MyCircularDeque(3), insertLast(4), insertFront(2), insertLast(7), getFront(), getRear(), deleteFront(), getFront()
   输出：true, true, true, 2, 7, true, 4
   解释：满队列依次为 [2,4,7]；删除首元素 2 后，新首元素为 4。

满队列拒绝继续插入：

.. code-block:: text

   调用：MyCircularDeque(1), insertFront(9), insertLast(5), isFull()
   输出：true, false, true
   解释：容量为 1，插入 9 后已经装满，因此从另一端插入 5 也必须失败。
