0155. Min Stack
===============

题目信息
--------

:题号: 0155
:难度: Medium
:主题: 栈、设计、状态同步
:原题: `LeetCode 0155 <https://leetcode.com/problems/min-stack/>`_
:重点: 主栈与最小值栈、重复最小值、常数时间操作

题目重述
--------

设计一个支持以下操作的栈：``push(val)`` 把元素压入栈顶，``pop()`` 删除栈顶元素，``top()`` 返回栈顶元素，``getMin()`` 返回当前栈中的最小元素。所有操作都必须在 ``O(1)`` 时间内完成。

自建示例
--------

.. code-block:: text

   push(-2)
   push(0)
   push(-3)
   getMin() -> -3
   pop()
   top()    -> 0
   getMin() -> -2

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