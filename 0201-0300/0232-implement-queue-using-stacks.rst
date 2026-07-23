0232. Implement Queue using Stacks
=================================

题目信息
--------

:题号: 0232
:难度: Easy
:主题: 设计、队列、栈、对象状态
:原题: `LeetCode 0232 <https://leetcode.com/problems/implement-queue-using-stacks/>`_
:重点: 先进先出、受限栈操作、跨调用状态、队首读取

题目重述
--------

设计 ``MyQueue`` 类，使用两个栈实现队列行为。对象需要支持 ``push(x)``、``pop()``、``peek()`` 和 ``empty()``：``push`` 把元素加入队尾；``pop`` 返回并删除队首元素；``peek`` 只返回队首元素；``empty`` 判断队列是否为空。

实现中只能使用栈通常提供的操作，例如向栈顶压入元素、读取或弹出栈顶、查询长度和判断为空。平台保证调用 ``pop`` 或 ``peek`` 时队列非空；同一对象的多次方法调用共享之前保存的状态。

自建示例
--------

.. code-block:: text

   输入：MyQueue(), push(3), push(6), peek(), pop(), empty()
   输出：[null,null,null,3,3,false]
   解释：3 先进入队列，所以 peek 和 pop 都得到 3；弹出后仍有元素 6，empty 返回 false。

.. code-block:: text

   输入：MyQueue(), push(8), pop(), empty()
   输出：[null,null,8,true]
   解释：唯一元素 8 被移除后，队列为空。
