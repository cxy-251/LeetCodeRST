0225. Implement Stack using Queues
==================================

题目信息
--------

:题号: 0225
:难度: Easy
:主题: 设计、栈、队列、对象状态
:原题: `LeetCode 0225 <https://leetcode.com/problems/implement-stack-using-queues/>`_
:重点: 用 FIFO 操作实现 LIFO、方法语义、跨调用状态、合法空栈操作

题目重述
--------

设计 ``MyStack`` 类，用一个或两个队列实现后进先出的栈，并支持以下方法：``push(x)`` 把元素压入栈顶；``pop()`` 删除并返回栈顶元素；``top()`` 返回但不删除栈顶元素；``empty()`` 判断栈是否为空。

实现只能使用队列的标准操作，包括从队尾加入、读取或删除队首、查询长度以及判空。``x`` 位于 ``[1, 9]``，四种方法的调用总数最多为 ``100``；题目保证调用 ``pop`` 和 ``top`` 时栈非空。同一个对象必须在连续方法调用之间保存其内容和顺序。

自建示例
--------

后压入的元素先返回：

.. code-block:: text

   输入：依次调用 push(3), push(8), top(), pop(), top(), empty()
   输出：8, 8, 3, false
   解释：8 比 3 后入栈，因此 top 和第一次 pop 都得到 8；删除 8 后，新的栈顶是 3，栈仍非空。

单队列旋转
----------

让队列的队首始终对应栈顶。压入新元素 ``x`` 时，先把 ``x`` 加到队尾，
再把原来位于 ``x`` 前面的元素依次从队首取出并重新放到队尾：

.. code-block:: text

   原队列：a, b                 栈顶为 a
   push(c)：a, b, c
   旋转两次：b, c, a -> c, a, b
   目标队列：c, a, b             栈顶为 c

一般地，加入前队列有 ``m`` 个元素时，旋转原来的 ``m`` 个元素，就得到“新元素在队首、旧元素按原栈顶到栈底排列”的状态。
之后 ``pop`` 和 ``top`` 只需操作队首，``empty`` 直接查询队列状态。

状态不变量与正确性
------------------

每次公开方法返回后，队列从队首到队尾恰好等于栈从栈顶到栈底的顺序。
初始两者都为空。``push`` 通过旋转把新元素放到队首，并保持旧元素顺序；
``pop`` 删除队首，正好删除栈顶；``top`` 读取队首而不改变状态；``empty`` 的真假也与栈一致。
按调用顺序归纳，四个操作始终满足栈的合同。

C++ 实现
--------

.. code-block:: cpp

   class MyStack {
       std::queue<int> queue_;

   public:
       MyStack() = default;

       void push(int x) {
           queue_.push(x);
           const int old_size = static_cast<int>(queue_.size()) - 1;
           for (int i = 0; i < old_size; ++i) {
               queue_.push(queue_.front());
               queue_.pop();
           }
       }

       int pop() {
           const int value = queue_.front();
           queue_.pop();
           return value;
       }

       int top() const {
           return queue_.front();
       }

       bool empty() const {
           return queue_.empty();
       }
   };

代码分析
--------

``push`` 需要旋转当前已有的 ``m`` 个元素，时间为 ``O(m)``；``pop``、``top`` 和 ``empty`` 均为 ``O(1)``。
队列最多保存栈中的全部元素，额外空间为 ``O(n)``。题目保证对非空栈调用 ``pop``/``top``，所以实现不需要为非法空操作伪造返回值。
