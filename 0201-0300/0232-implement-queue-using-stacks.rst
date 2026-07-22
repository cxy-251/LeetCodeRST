0232. Implement Queue using Stacks
=================================

题目信息
--------

:题号: 0232
:难度: Easy
:主题: 设计、队列、栈
:原题: `LeetCode 0232 <https://leetcode.com/problems/implement-queue-using-stacks/>`_
:教学重点: 输入栈与输出栈、摊还复杂度、对象状态

题目重述
--------

实现 ``MyQueue`` 类，提供 ``push(int x)``、``pop()``、``peek()``、``empty()``，只能使用标准栈操作。平台保证删除与读取时队列非空。对象必须跨调用保持 FIFO 顺序；``pop`` 返回并移除队首，``peek`` 只读取。

自建示例
--------

.. code-block:: text

   操作：push(3), push(6), peek(), pop(), empty()
   输出：3, 3, false
