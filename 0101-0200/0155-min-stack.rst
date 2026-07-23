0155. Min Stack
===============

题目信息
--------

:题号: 0155
:难度: Medium
:主题: 栈、数据结构设计、状态同步
:原题: `LeetCode 0155 <https://leetcode.com/problems/min-stack/>`_
:重点: 栈顶操作、当前最小值、重复最小值、常数时间

题目重述
--------

设计一个栈结构 ``MinStack``，支持 ``push(val)``、``pop()``、``top()`` 和 ``getMin()``。``push`` 把整数压入栈顶，``pop`` 删除栈顶元素，``top`` 返回栈顶值，``getMin`` 返回当前栈中的最小值。

四种操作都必须在 ``O(1)`` 时间内完成。``val`` 在 32 位有符号整数范围内；测试最多调用各操作 ``3 * 10^4`` 次，并保证调用 ``pop``、``top`` 或 ``getMin`` 时栈非空。

自建示例
--------

.. code-block:: text

   操作：push(5), push(2), push(2), push(7), getMin(), pop(), pop(), getMin()
   输出：2, 2
   解释：两个值为 2 的元素都保存着当前最小值；弹出 7 和其中一个 2 后，另一个 2 仍是最小值。

.. code-block:: text

   操作：push(-4), push(9), top(), getMin()
   输出：9, -4
   解释：栈顶值与全栈最小值是两个独立查询结果。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <stack>
   #include <utility>

   class MinStack {
   private:
       std::stack<std::pair<int, int>> data_;

   public:
       MinStack() = default;

       void push(int value) {
           int minimum = data_.empty() ? value : std::min(value, data_.top().second);
           data_.push({value, minimum});
       }

       void pop() {
           data_.pop();
       }

       int top() {
           return data_.top().first;
       }

       int getMin() {
           return data_.top().second;
       }
   };

题解
----

每个栈项保存什么
~~~~~~~~

栈项保存 ``{当前值, 压入后整个栈的最小值}``。因此弹出时，旧最小值随旧栈顶自然恢复。

重复最小值为何安全
~~~~~~~~~

每一层都复制当时的最小值。连续压入相同最小值后，弹出一层仍能从下一层取得相同最小值。

复杂度来源
~~~~~

四个操作都只访问栈顶，时间 ``O(1)``；每个元素增加一个最小值字段，空间 ``O(n)``。