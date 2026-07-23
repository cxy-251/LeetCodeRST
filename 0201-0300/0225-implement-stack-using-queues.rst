0225. Implement Stack using Queues
==================================

题目信息
--------

:题号: 0225
:难度: Easy
:主题: 设计、栈、队列、对象状态
:原题: `LeetCode 0225 <https://leetcode.com/problems/implement-stack-using-queues/>`_
:重点: 后进先出、受限队列操作、跨调用状态、空栈判断

题目重述
--------

设计 ``MyStack`` 类，使用一个或多个队列实现栈的行为。对象需要支持 ``push(x)``、``pop()``、``top()`` 和 ``empty()``：``push`` 把元素放到栈顶；``pop`` 返回并删除栈顶元素；``top`` 只返回栈顶元素；``empty`` 判断栈是否为空。

实现中只能使用队列通常提供的操作，例如从队尾加入元素、读取或删除队首元素、查询长度和判断为空。平台保证调用 ``pop`` 或 ``top`` 时栈中至少有一个元素；同一对象的多次方法调用共享之前保存的状态。

自建示例
--------

.. code-block:: text

   输入：MyStack(), push(4), push(9), top(), pop(), empty()
   输出：[null,null,null,9,9,false]
   解释：9 后压入，因此 top 和 pop 都得到 9；弹出后栈中仍有元素 4，所以 empty 返回 false。

.. code-block:: text

   输入：MyStack(), push(6), pop(), empty()
   输出：[null,null,6,true]
   解释：唯一元素 6 被弹出后，栈变为空。
