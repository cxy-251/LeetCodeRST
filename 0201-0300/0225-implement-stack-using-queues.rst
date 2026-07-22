0225. Implement Stack using Queues
==================================

题目信息
--------

:题号: 0225
:难度: Easy
:主题: 设计、栈、队列
:原题: `LeetCode 0225 <https://leetcode.com/problems/implement-stack-using-queues/>`_
:教学重点: LIFO 与 FIFO 转换、跨调用对象状态

题目重述
--------

实现 ``MyStack`` 类，提供 ``push(int x)``、``pop()``、``top()`` 和 ``empty()``。只能使用标准队列操作；平台保证 ``pop``、``top`` 调用时栈非空，操作总数较小。对象必须在多次方法调用之间保存元素顺序，``pop`` 返回并删除栈顶，``top`` 只读取。

自建示例
--------

.. code-block:: text

   操作：push(4), push(9), top(), pop(), empty()
   输出：9, 9, false
   说明：后压入的 9 最先离开。
