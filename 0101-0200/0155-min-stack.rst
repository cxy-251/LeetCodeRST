0155. Min Stack
===============

题目信息
--------

:题号: 0155. 最小栈
:难度: Medium
:主题: 栈、设计、前缀最小值、同步状态
:原题: `LeetCode 0155 <https://leetcode.com/problems/min-stack/>`_
:重点: 为每个栈深度保留当时的最小值，使弹栈能直接恢复历史状态，并正确处理重复最小值

题目重述
--------

设计 ``MinStack``，支持 ``push(val)``、``pop()``、``top()``、``getMin()``。前两者遵守普通栈的后进先出；
``top`` 返回栈顶值，``getMin`` 返回当前栈内最小值。四种操作都必须为 ``O(1)``。测试保证在非空栈上调用
``pop``、``top`` 和 ``getMin``。

自建示例
--------

.. code-block:: text

   push(5), push(2), push(2), push(7)
   getMin() -> 2
   pop()             删除 7
   pop()             删除一个 2
   getMin() -> 2     另一个 2 仍在栈中

执行 ``push(-4), push(9)`` 后，``top()`` 返回 ``9``，``getMin()`` 返回 ``-4``；栈顶与全栈最小值是两种
不同状态。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <stack>
   #include <utility>

   class MinStackWithTwoStacks {
   private:
       std::stack<int> values_;
       std::stack<int> minimums_;

   public:
       void push(int value) {
           values_.push(value);
           if (minimums_.empty() || value <= minimums_.top()) {
               minimums_.push(value);
           }
       }

       void pop() {
           if (values_.top() == minimums_.top()) {
               minimums_.pop();
           }
           values_.pop();
       }

       int top() {
           return values_.top();
       }

       int getMin() {
           return minimums_.top();
       }
   };

   class MinStack {
   private:
       std::stack<std::pair<int, int>> entries_;

   public:
       MinStack() = default;

       void push(int value) {
           const int minimumAfterPush = entries_.empty()
               ? value
               : std::min(value, entries_.top().second);
           entries_.push({value, minimumAfterPush});
       }

       void pop() {
           entries_.pop();
       }

       int top() {
           return entries_.top().first;
       }

       int getMin() {
           return entries_.top().second;
       }
   };

题解
----

为什么只保存当前最小值仍然不够
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

普通栈只需保存元素，``push``、``pop``、``top`` 都访问一端。若 ``getMin`` 每次扫描全栈，最坏为 ``O(n)``；
若只额外保存一个变量 ``currentMinimum``，压入时可以常数更新，但弹出当前最小元素后，不知道它下面历史
元素的最小值，仍要重新扫描。

缺少的信息不是“现在最小值是多少”，而是“回到每个旧栈深度时最小值应恢复成什么”。栈的后进先出顺序
允许把这段历史也按栈保存。

方案一：第二个栈只记录最小值变化
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``MinStackWithTwoStacks`` 的 ``values_`` 保存全部值，``minimums_`` 保存仍有效的最小值候选。压入值不大于
当前最小时，它成为新深度的最小值并同步压入；弹出值等于当前最小时，也同步弹出最小栈。于是
``minimums_.top()`` 始终是全栈最小值。

条件必须是 ``value <= minimums_.top()``，不能只在严格更小时记录。连续压入两个 ``2`` 后，最小栈也应
保存两个 ``2``；弹出上面一个时，只删除一份，下面的 ``2`` 仍证明当前最小值为二。若只记录一次，第一次
弹出就会错误暴露更大的旧最小值，甚至让最小栈为空。

该方法只在最小值不增时追加辅助项，某些输入可少存状态；代价是 ``push``、``pop`` 都要保持两个栈同步，
相等分支是容易出错的地方。

方案二：每一层绑定压入后的前缀最小值
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

主实现让每个栈项保存二元组：

.. code-block:: text

   {当前 value, 压入它之后整个栈的 minimum}

压入时，新最小值只可能是当前值或旧栈顶保存的最小值，两者取小即可。弹出时，值与这一层的最小状态一起
删除；新的栈顶已经携带上一深度的正确最小值，无需判断刚删的值是否等于最小值。

不变量与具体走读
~~~~~~~~~~~~~~~~

``entries_`` 中任一位置 ``i`` 的 ``second``，等于从栈底到位置 ``i`` 所有 ``first`` 的最小值。因此栈顶
二元组同时回答普通栈顶和全栈最小值。

.. list-table::
   :header-rows: 1

   * - 操作
     - 新压入二元组
     - 栈顶最小值
   * - ``push(5)``
     - ``(5, 5)``
     - ``5``
   * - ``push(2)``
     - ``(2, 2)``
     - ``2``
   * - ``push(2)``
     - ``(2, 2)``
     - ``2``
   * - ``push(7)``
     - ``(7, 2)``
     - ``2``
   * - ``pop()`` 两次
     - 删除 ``(7,2)``、上层 ``(2,2)``
     - 下一项仍为 ``(2,2)``，最小值 ``2``

每次压入后不变量由 ``min(value, oldMinimum)`` 成立；弹出只恢复一个此前已经正确的前缀状态，所以归纳地
覆盖任意操作序列。

为什么不使用最小堆
~~~~~~~~~~~~~~~~~~

最小堆能常数取得最小值，但删除的必须是栈顶最近元素，而它可能位于堆中间；需要额外身份、延迟删除或索引
维护，操作也通常达到 ``O(log n)``。这里查询只随栈深度回退，前缀最小值正好匹配后进先出的历史结构，
无需引入更通用的数据结构。

主解选择与复杂度
~~~~~~~~~~~~~~~~

公开类 ``MinStack`` 采用二元组栈。四个操作都只读取或修改栈顶，严格 ``O(1)``；每个输入元素多保存一个
整数，空间 ``O(n)``。双栈方案同样满足时间要求，并可能在最小值很少变化时少存辅助项；二元组方案选择
固定的一层一状态对应，牺牲少量常数空间换取无分支的弹出与更容易维护的不变量。
