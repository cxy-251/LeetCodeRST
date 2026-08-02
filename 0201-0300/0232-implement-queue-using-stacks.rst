0232. Implement Queue using Stacks
=================================

题目信息
--------

:题号: 0232
:难度: Easy
:主题: 设计、队列、栈、对象状态
:原题: `LeetCode 0232 <https://leetcode.com/problems/implement-queue-using-stacks/>`_
:重点: 用 LIFO 操作实现 FIFO、方法语义、跨调用状态、合法队首操作

题目重述
--------

设计 ``MyQueue`` 类，只使用一个或两个栈实现先进先出的队列，并支持以下方法：``push(x)`` 把元素加入队尾；``pop()`` 删除并返回队首元素；``peek()`` 返回但不删除队首元素；``empty()`` 判断队列是否为空。

实现只能使用栈的标准操作，包括压入栈顶、读取或弹出栈顶、查询长度以及判空。``x`` 位于 ``[1, 9]``，四种方法的调用总数最多为 ``100``；题目保证调用 ``pop`` 和 ``peek`` 时队列非空。同一个对象必须在连续调用之间保存队列内容和先进先出顺序。

自建示例
--------

先加入的元素先离开：

.. code-block:: text

   输入：依次调用 push(5), push(2), push(9), peek(), pop(), peek(), empty()
   输出：5, 5, 2, false
   解释：5 最早进入队列，所以 peek 和第一次 pop 都得到 5；删除后新的队首是 2，队列仍包含元素。

双栈的摊还转移
--------------

使用 ``in_stack`` 接收新元素，使用 ``out_stack`` 提供队首。若输出栈为空，
把输入栈全部弹出并压入输出栈；原来较早加入的元素会在转换后位于输出栈顶。
输出栈非空时不能再次转移，否则会破坏尚未离开的元素顺序。

.. code-block:: text

   push(5), push(2), push(9)
   in_stack: 5 2 9（栈顶为 9）
   第一次 peek 前转移后：out_stack 栈顶为 5，下面是 2、9

之后 ``pop``/``peek`` 直接操作 ``out_stack``。当它再次为空，才把期间积累在 ``in_stack`` 中的新元素反转到输出栈。

正确性说明
----------

当 ``out_stack`` 非空时，它的栈顶是所有尚未出队元素中最早加入的元素，因为上一次转移按入队时间逆序压入。
新的元素只进入 ``in_stack``，不会越过当前输出栈中的旧元素；旧元素全部出队后再转移，新的最早元素又会到达栈顶。
因此每次 ``peek`` 读取和 ``pop`` 删除的都是 FIFO 队首，两个栈为空当且仅当队列为空。

C++ 实现
--------

.. code-block:: cpp

   class MyQueue {
       std::stack<int> in_stack;
       std::stack<int> out_stack;

       void moveIfNeeded() {
           if (!out_stack.empty()) return;
           while (!in_stack.empty()) {
               out_stack.push(in_stack.top());
               in_stack.pop();
           }
       }

   public:
       MyQueue() = default;

       void push(int x) {
           in_stack.push(x);
       }

       int pop() {
           moveIfNeeded();
           const int value = out_stack.top();
           out_stack.pop();
           return value;
       }

       int peek() {
           moveIfNeeded();
           return out_stack.top();
       }

       bool empty() const {
           return in_stack.empty() && out_stack.empty();
       }
   };

代码分析
--------

单次转移可能搬运多个元素，但每个元素从输入栈到输出栈最多一次、从输出栈弹出一次，
所以一串操作的总时间为线性，``push`` 为 ``O(1)``，``pop``/``peek`` 摊还为 ``O(1)``，
最坏单次转移为 ``O(n)``。两个栈合计保存队列元素，额外空间为 ``O(n)``。
