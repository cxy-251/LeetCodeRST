0155. Min Stack
===============

题目信息
--------

:题号: 0155
:难度: Medium
:主题: 栈、数据结构设计、前缀最小值
:原题: `LeetCode 0155 <https://leetcode.com/problems/min-stack/>`_
:访问状态: Available
:教学重点: 每层同步保存最小值、操作不变量、常数时间接口

题目重述
--------

设计一个支持 ``push``、``pop``、``top`` 和 ``getMin`` 的栈。除构造函数外，题目只会在栈非空时调用
后三个查询或删除操作。全部接口都需要在最坏 ``O(1)`` 时间内完成，不能在 ``getMin`` 时重新扫描栈。

算法
----

每个栈元素保存两个值：当前压入的 ``value``，以及从栈底到该位置的最小值 ``minimum``。压入新值时，
新的最小值等于 ``min(value, previous_minimum)``；弹栈时两个字段一起删除。栈顶元素的 ``minimum`` 因而
始终代表整个当前栈的最小值。

R 适配器使用环境节点构成链式栈，避免反复增长向量带来的累计复制。其他语言使用动态数组或标准顺序容器。

正确性
~~~~~~

对栈深度 ``k`` 归纳。空栈没有查询要求。压入第一个值后，该层最小值就是自身。假设深度 ``k`` 时，
每一层保存其前缀最小值；压入 ``x`` 后，新层保存 ``min(x, old_minimum)``，正好是深度 ``k+1`` 的全部
元素最小值。弹栈只删除最后一层，下面各层的前缀没有变化，因此原不变量恢复。于是 ``top`` 返回最新值，
``getMin`` 返回当前全部元素最小值。

复杂度
~~~~~~

四个操作的最坏时间均为 ``O(1)``；动态数组扩容语言的单次 ``push`` 最坏会复制已有元素，摊还时间为
``O(1)``。保存每层最小值需要 ``O(n)`` 空间。C 的 ``push`` 在扩容失败时保持原栈不变；平台评测通常假设
分配成功，而该 ``void`` 接口无法向调用者报告失败。

核心语言实现
------------

C
~

.. code-block:: c

   #include <limits.h>
   #include <stdlib.h>

   struct MinEntry {
       int value;
       int minimum;
   };

   typedef struct {
       struct MinEntry *entries;
       int size;
       int capacity;
   } MinStack;

   MinStack *minStackCreate(void) {
       MinStack *stack = malloc(sizeof(*stack));
       if (stack == NULL) {
           return NULL;
       }

       stack->capacity = 16;
       stack->size = 0;
       stack->entries = malloc(
           (size_t)stack->capacity * sizeof(*stack->entries)
       );
       if (stack->entries == NULL) {
           free(stack);
           return NULL;
       }
       return stack;
   }

   void minStackPush(MinStack *stack, int value) {
       if (stack->size == stack->capacity) {
           int new_capacity = stack->capacity * 2;
           struct MinEntry *resized = realloc(
               stack->entries,
               (size_t)new_capacity * sizeof(*resized)
           );
           if (resized == NULL) {
               return;
           }
           stack->entries = resized;
           stack->capacity = new_capacity;
       }

       int minimum = value;
       if (stack->size > 0 &&
           stack->entries[stack->size - 1].minimum < minimum) {
           minimum = stack->entries[stack->size - 1].minimum;
       }
       stack->entries[stack->size++] =
           (struct MinEntry){value, minimum};
   }

   void minStackPop(MinStack *stack) {
       --stack->size;
   }

   int minStackTop(MinStack *stack) {
       return stack->entries[stack->size - 1].value;
   }

   int minStackGetMin(MinStack *stack) {
       return stack->entries[stack->size - 1].minimum;
   }

   void minStackFree(MinStack *stack) {
       if (stack != NULL) {
           free(stack->entries);
           free(stack);
       }
   }

C++
~~~

.. code-block:: cpp

   #include <algorithm>
   #include <utility>
   #include <vector>

   class MinStack {
   public:
       void push(int value) {
           int minimum = entries_.empty()
               ? value
               : std::min(value, entries_.back().second);
           entries_.push_back({value, minimum});
       }

       void pop() {
           entries_.pop_back();
       }

       int top() const {
           return entries_.back().first;
       }

       int getMin() const {
           return entries_.back().second;
       }

   private:
       std::vector<std::pair<int, int>> entries_;
   };

Python
~~~~~~

.. code-block:: python

   class MinStack:
       def __init__(self) -> None:
           self.entries: list[tuple[int, int]] = []

       def push(self, value: int) -> None:
           minimum = value
           if self.entries:
               minimum = min(minimum, self.entries[-1][1])
           self.entries.append((value, minimum))

       def pop(self) -> None:
           self.entries.pop()

       def top(self) -> int:
           return self.entries[-1][0]

       def getMin(self) -> int:
           return self.entries[-1][1]

Java
~~~~

.. code-block:: java

   import java.util.Arrays;

   class MinStack {
       private int[] values = new int[16];
       private int[] minimums = new int[16];
       private int size = 0;

       public void push(int value) {
           ensureCapacity();
           values[size] = value;
           minimums[size] = size == 0
               ? value
               : Math.min(value, minimums[size - 1]);
           size++;
       }

       public void pop() {
           size--;
       }

       public int top() {
           return values[size - 1];
       }

       public int getMin() {
           return minimums[size - 1];
       }

       private void ensureCapacity() {
           if (size < values.length) {
               return;
           }
           int capacity = values.length * 2;
           values = Arrays.copyOf(values, capacity);
           minimums = Arrays.copyOf(minimums, capacity);
       }
   }

Rust
~~~~

.. code-block:: rust

   struct MinStack {
       entries: Vec<(i32, i32)>,
   }

   impl MinStack {
       fn new() -> Self {
           Self { entries: Vec::new() }
       }

       fn push(&mut self, value: i32) {
           let minimum = self.entries.last()
               .map_or(value, |entry| value.min(entry.1));
           self.entries.push((value, minimum));
       }

       fn pop(&mut self) {
           self.entries.pop();
       }

       fn top(&self) -> i32 {
           self.entries.last().unwrap().0
       }

       fn get_min(&self) -> i32 {
           self.entries.last().unwrap().1
       }
   }

Go
~~

.. code-block:: go

   type MinStack struct {
       entries [][2]int
   }

   func Constructor() MinStack {
       return MinStack{entries: make([][2]int, 0)}
   }

   func (stack *MinStack) Push(value int) {
       minimum := value
       if len(stack.entries) > 0 {
           previous := stack.entries[len(stack.entries)-1][1]
           if previous < minimum {
               minimum = previous
           }
       }
       stack.entries = append(stack.entries, [2]int{value, minimum})
   }

   func (stack *MinStack) Pop() {
       stack.entries = stack.entries[:len(stack.entries)-1]
   }

   func (stack *MinStack) Top() int {
       return stack.entries[len(stack.entries)-1][0]
   }

   func (stack *MinStack) GetMin() int {
       return stack.entries[len(stack.entries)-1][1]
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   class MinStack {
       private readonly entries: Array<[number, number]> = [];

       push(value: number): void {
           const previous = this.entries.length === 0
               ? value
               : this.entries[this.entries.length - 1][1];
           this.entries.push([value, Math.min(value, previous)]);
       }

       pop(): void {
           this.entries.pop();
       }

       top(): number {
           return this.entries[this.entries.length - 1][0];
       }

       getMin(): number {
           return this.entries[this.entries.length - 1][1];
       }
   }

C#
~~

.. code-block:: csharp

   using System;
   using System.Collections.Generic;

   public class MinStack {
       private readonly List<(int Value, int Minimum)> entries = new();

       public void Push(int value) {
           int minimum = entries.Count == 0
               ? value
               : Math.Min(value, entries[^1].Minimum);
           entries.Add((value, minimum));
       }

       public void Pop() {
           entries.RemoveAt(entries.Count - 1);
       }

       public int Top() {
           return entries[^1].Value;
       }

       public int GetMin() {
           return entries[^1].Minimum;
       }
   }

Julia
~~~~~

.. code-block:: julia

   mutable struct MinStack
       entries::Vector{Tuple{Int, Int}}
   end

   MinStack() = MinStack(Tuple{Int, Int}[])

   function push_value!(stack::MinStack, value::Int)::Nothing
       minimum = isempty(stack.entries) ? value :
           min(value, stack.entries[end][2])
       push!(stack.entries, (value, minimum))
       return nothing
   end

   function pop_value!(stack::MinStack)::Nothing
       pop!(stack.entries)
       return nothing
   end

   top_value(stack::MinStack)::Int = stack.entries[end][1]
   get_min(stack::MinStack)::Int = stack.entries[end][2]

R
~

.. code-block:: r

   new_min_stack <- function() {
     stack <- new.env(parent = emptyenv())
     stack$head <- NULL
     stack
   }

   push_value <- function(stack, value) {
     node <- new.env(parent = emptyenv())
     node$value <- value
     node$minimum <- if (is.null(stack$head)) {
       value
     } else {
       min(value, stack$head$minimum)
     }
     node$next_node <- stack$head
     stack$head <- node
     invisible(NULL)
   }

   pop_value <- function(stack) {
     stack$head <- stack$head$next_node
     invisible(NULL)
   }

   top_value <- function(stack) {
     stack$head$value
   }

   get_min <- function(stack) {
     stack$head$minimum
   }

关键边界
--------

* 重复最小值必须在每一层独立保存，弹出一个最小值后另一个仍然有效；
* 负数和零不需要哨兵，最小值直接从真实元素初始化；
* ``pop`` 后不能重新计算剩余元素的最小值；
* 查询只在非空栈上执行，因此实现可由接口前提支撑非空解包；
* R 使用环境引用，调用方法后修改对调用者可见。

验证
----

运行官方操作序列、重复最小值、递减压栈、弹出后最小值恢复和负数边界。Python 另执行 500 组随机操作
序列并与普通列表扫描基准比较；C、C++、Go、Java 和 TypeScript 运行代表序列，其余语言完成静态检查。

最小自检
--------

#. 为什么只保存一个全局 ``minimum`` 无法在弹栈后恢复旧最小值？
#. 重复最小值为何必须在不同栈层分别出现？
#. 动态数组版本的 ``push`` 是最坏 ``O(1)`` 还是摊还 ``O(1)``？
