0155. Min Stack
===============

题目信息
--------

:题号: 0155
:难度: Medium
:主题: 栈、数据结构设计、前缀最小值、操作序列不变量
:原题: `LeetCode 0155 <https://leetcode.com/problems/min-stack/>`_
:访问状态: Available
:教学重点: 每层证书、重复最小值、持久对象状态、动态存储成本

精确契约
--------

实现一个 ``MinStack`` 对象，支持：

* 构造器创建空栈；
* ``push(value)`` 把一个有符号 32 位整数压到栈顶；
* ``pop()`` 删除栈顶元素；
* ``top()`` 返回栈顶值；
* ``getMin()`` 返回当前栈中最小值。

``pop``、``top`` 和 ``getMin`` 只会在栈非空时调用，四类操作合计最多 ``3*10^4`` 次。
对象必须跨方法调用保留状态，且每个接口的算法工作为常数；``getMin`` 不能临时扫描全栈。

官方值域是 ``[-2^31,2^31-1]``。算法只比较和保存输入值，不做加减乘法，
所以不需要更宽整数中间量。TypeScript 和 R 的数值类型能精确表示全部 32 位整数。

示例与反例
----------

官方操作序列
~~~~~~~~~~~~

依次执行：

.. code-block:: text

   MinStack()
   push(-2)
   push(0)
   push(-3)
   getMin()  -> -3
   pop()
   top()     -> 0
   getMin()  -> -2

弹出 -3 后，旧最小值 -2 必须立即恢复，不能重新遍历剩余元素。

重复最小值示例
~~~~~~~~~~~~~~

依次压入 ``2,1,1``。两层值 1 都必须各自带有最小值 1。弹出一个 1 后，
``getMin`` 仍返回 1；再弹出一个 1 后才恢复为 2。

只保存一个最小变量的反例
~~~~~~~~~~~~~~~~~~~~~~~~~~

若栈只保存元素和一个全局 ``minimum``，对 ``push(3), push(1), push(2), pop(), pop()``，
删除值 1 后无法从常数个状态知道旧最小值应恢复为 3。扫描剩余元素违反查询时间目标，
而随意重置又会给出错误答案。

问题抽象与解法选择
------------------

普通栈已经能常数时间访问最新元素，困难只在于删除当前最小值后恢复历史最小值。
恢复信息不能从未来推断，必须在 ``push`` 时随栈层保存。

把从栈底到顶的真实值记为 ``x[1],...,x[d]``。为第 ``i`` 层附加：

.. math::

   \mu_i = \min(x_1,x_2,\ldots,x_i)

实际存储的每层记录是 ``(x_i,mu_i)``。压入 ``x`` 时：

.. math::

   \mu_{d+1} =
   \begin{cases}
   x, & d=0,\\
   \min(x,\mu_d), & d>0.
   \end{cases}

弹栈同时删除值和该层证书，下面一层原有的 ``mu`` 自动重新成为全栈最小值。
这相当于给普通栈做增广，而不是维护第二条需要额外同步规则的独立最小栈。

为什么不用最小值编码差分
~~~~~~~~~~~~~~~~~~~~~~~~

可以用一个栈加差值编码恢复旧最小值，但 ``value-minimum`` 可能超出有符号 32 位，
十语言需要不同的宽化和溢出证明。逐层保存 ``(value,prefix_min)`` 多用一个整数，
却直接覆盖完整 32 位值域，证明和平台适配更可靠。

状态与操作不变量
----------------

对象保持一个记录序列 ``entries``。栈深 ``d`` 等于记录数，并满足：

#. 第 ``i`` 条记录的 ``value`` 等于第 ``i`` 个被压入且尚未弹出的元素；
#. 第 ``i`` 条记录的 ``minimum`` 等于前 ``i`` 个当前元素的最小值；
#. 若 ``d>0``，末条记录同时给出真实栈顶和全栈最小值；
#. 记录顺序与栈从底到顶的顺序一致。

实现映射如下：

.. list-table::
   :header-rows: 1

   * - 操作
     - 状态变化或读取
     - 依赖的合同
   * - 构造
     - 建立空记录序列
     - 空栈无需回答查询
   * - ``push(x)``
     - 追加 ``(x,min(x,last.minimum))``；空栈时为 ``(x,x)``
     - 只读取旧栈顶证书
   * - ``pop()``
     - 删除末条完整记录
     - 调用前非空
   * - ``top()``
     - 读取末条 ``value``
     - 调用前非空
   * - ``getMin()``
     - 读取末条 ``minimum``
     - 调用前非空

正确性证明
----------

引理一：构造后的空栈满足不变量
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

构造器建立长度 0 的记录序列。此时没有当前元素，也没有需要验证的记录；题目不会在空栈调用
``pop``、``top`` 或 ``getMin``，因此四条不变量都成立。

引理二：``push`` 保持逐层前缀最小值
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

假设压入前深度为 ``d`` 且不变量成立。

若 ``d=0``，新栈只有元素 ``x``，其最小值显然为 ``x``，追加 ``(x,x)`` 正确。
若 ``d>0``，归纳假设给出末条 ``minimum=mu_d``，即旧栈全部元素的最小值。
新栈的元素集合是旧集合再加入 ``x``，其最小值正是 ``min(x,mu_d)``。

旧记录没有改变，新记录的值和前缀最小值都正确，顺序也在末尾追加，因此全部不变量保持。

引理三：``pop`` 恢复上一层证书
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

调用前栈非空。``pop`` 只删除末条 ``(x_d,mu_d)``，恰好删除最近压入且未弹出的元素。
其余 ``d-1`` 条记录及对应前缀完全没有变化，所以每条旧 ``minimum`` 仍是同一前缀的最小值。

若删除后非空，新的末条早已保存 ``mu_{d-1}``，无需重新计算；若变空，查询前提又使空栈
不需要给出栈顶或最小值。因此不变量恢复。

引理四：两个查询返回正确结果
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

调用 ``top`` 或 ``getMin`` 时 ``d>0``。由不变量，末条 ``value`` 是最近压入且尚未弹出的值，
故 ``top`` 正确；末条 ``minimum`` 是全部 ``d`` 个当前元素的最小值，故 ``getMin`` 正确。

定理：任意合法操作序列的所有可观察结果正确
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

构造器由引理一建立不变量。对操作序列长度归纳：``push`` 由引理二保持不变量，``pop`` 由引理三
保持不变量，两个查询由引理四返回正确值且不改变状态。因此任意合法有限操作序列中，
对象始终表示正确栈，所有 ``top`` 与 ``getMin`` 结果都正确。

复杂度与资源成本
----------------

设当前深度为 ``d``：

* ``pop``、``top``、``getMin`` 各做常数次末端访问，最坏时间 ``O(1)``；
* ``push`` 的前缀最小递推只做常数工作；使用动态数组时，非扩容调用为 ``O(1)``，
  偶发扩容会复制 ``O(d)`` 条记录，连续调用的摊还时间为 ``O(1)``；
* 记录载荷为每层两个整数，总有效空间 ``O(d)``；动态数组容量也是 ``O(d)``；
* R 使用每层一个环境节点，操作是常数次引用重绑定，空间同样为 ``O(d)``，
  但每节点运行时元数据比两个整数更大；
* 返回值和方法局部变量均为 ``O(1)``。

题目常把动态数组的摊还常数写作每操作 ``O(1)``。本文明确保留容器层差异：算法状态转移是最坏常数，
标准动态数组的某一次 ``push`` 可能扩容。若平台严格要求每次调用都最坏常数，可改用已知上限预分配，
代价是构造时固定申请 ``O(30000)`` 空间；本实现选择常见的按需增长接口。

十语言实现
----------

C
~

.. code-block:: c

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

       stack->entries = malloc(16U * sizeof(*stack->entries));
       if (stack->entries == NULL) {
           free(stack);
           return NULL;
       }
       stack->size = 0;
       stack->capacity = 16;
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
       stack->entries[stack->size] =
           (struct MinEntry){value, minimum};
       ++stack->size;
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
               minimum = min(value, self.entries[-1][1])
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

   import java.util.ArrayList;

   class MinStack {
       private final ArrayList<int[]> entries = new ArrayList<>();

       public void push(int value) {
           int minimum = entries.isEmpty()
               ? value
               : Math.min(value, entries.get(entries.size() - 1)[1]);
           entries.add(new int[]{value, minimum});
       }

       public void pop() {
           entries.remove(entries.size() - 1);
       }

       public int top() {
           return entries.get(entries.size() - 1)[0];
       }

       public int getMin() {
           return entries.get(entries.size() - 1)[1];
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
           const minimum = this.entries.length === 0
               ? value
               : Math.min(
                   value,
                   this.entries[this.entries.length - 1][1],
               );
           this.entries.push([value, minimum]);
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

人工推演与静态审查
------------------

本题没有运行、编译或测试任何题解代码，也没有执行随机操作对拍、属性测试、
sanitizer 或目标语言最小程序。以下证据来自操作表推演、序列归纳、资源上界和逐语言静态审查。

官方序列推演
~~~~~~~~~~~~

表中记录按“栈底到栈顶”排列：

.. list-table::
   :header-rows: 1

   * - 操作
     - ``entries``
     - 返回
   * - 构造
     - ``[]``
     - 无
   * - ``push(-2)``
     - ``[(-2,-2)]``
     - 无
   * - ``push(0)``
     - ``[(-2,-2),(0,-2)]``
     - 无
   * - ``push(-3)``
     - ``[(-2,-2),(0,-2),(-3,-3)]``
     - 无
   * - ``getMin()``
     - 不变
     - ``-3``
   * - ``pop()``
     - ``[(-2,-2),(0,-2)]``
     - 无
   * - ``top()``
     - 不变
     - ``0``
   * - ``getMin()``
     - 不变
     - ``-2``

重复最小值与数值边界
~~~~~~~~~~~~~~~~~~~~

``push(2),push(1),push(1)`` 形成 ``[(2,2),(1,1),(1,1)]``。一次 ``pop`` 后末条
仍是 ``(1,1)``，再弹一次才恢复 ``(2,2)``。压入 ``INT_MIN`` 或 ``INT_MAX`` 只参与
``min`` 比较并原样保存，没有算术溢出路径；压入 0 也不需要特殊哨兵。

逐语言静态语义审查
~~~~~~~~~~~~~~~~~~

* **C**：初始容量 16，最多 30000 次操作使翻倍容量不超过 32768，``int`` 容量与
  ``size_t`` 字节乘积安全。``realloc`` 使用临时指针，失败时旧缓冲、大小和容量不变；
  成功路径由 ``minStackFree`` 释放内层缓冲与外层对象。
* **C++ / Python / Rust**：末条二元记录字段次序一致；非空合同支撑 ``back``、
  负下标和 ``unwrap``。动态容器拥有记录，弹出后不会引用已删除记录。
* **Java**：每层是独立 ``int[2]``，外层 ``ArrayList`` 保存对象；``remove``、``get``
  只在非空时调用，32 位 ``Math.min`` 不做溢出算术。
* **Go**：指针接收者让切片头和长度更新持久化；``Pop`` 只缩短长度，后续压入会覆盖
  不可见尾槽，公开结果不读取已弹记录。
* **TypeScript**：元组顺序为 ``[value,minimum]``；所有 32 位整数都在 ``number``
  精确域内，数组与只读字段限制的是字段重绑定，不妨碍数组内容更新。
* **C#**：``List`` 元组字段名与正文一致；索引 ``^1`` 只在非空合同下使用，
  ``RemoveAt`` 删除完整末条记录。
* **Julia**：``MinStack`` 是可变结构，带 ``!`` 方法修改同一对象；``end`` 仅在非空接口
  中读取，二元组和 ``Int`` 值不会被就地更改。
* **R**：环境具有引用语义；函数修改 ``stack$head`` 会对调用者持久可见。每个节点环境保存
  值、前缀最小和前驱引用，避免普通向量参数在函数内重绑定后状态丢失。

剩余风险
~~~~~~~~

C 的 ``void minStackPush`` 无法报告扩容失败；实现选择保持旧栈不变并返回，
但这与抽象的“push 必定成功”有差距。其他语言也可能因分配失败抛异常或终止，本文未运行观察。
静态审查没有确认判题机具体版本、C# 目标版本对 ``^1`` 的支持或 Julia/R 自定义适配器接线。

关键边界与失败方式
------------------

* 第一个元素必须用自身初始化最小值，不能使用 0、最大整数或空哨兵冒充真实层。
* 重复最小值要在每层保存；只记录“最小值发生了变化”会需要额外计数或第二栈规则。
* ``pop`` 必须删除值与证书的同一层，不能只更新一个平行容器。
* ``top`` 与 ``getMin`` 读取不同字段；交换元组顺序会让示例中的 0 与 -2 混淆。
* 动态数组 ``push`` 是摊还常数，不是每次扩容都最坏常数。
* C ``realloc`` 不能直接覆盖原指针，否则失败会丢失唯一缓冲地址并泄漏旧状态。
* Go 必须使用指针接收者；值接收者修改的切片长度不会可靠写回对象字段。
* R 若用普通向量局部追加而不返回新对象或使用环境，调用者看不到持久状态更新。
* 非空调用前提只覆盖 ``pop``、``top``、``getMin``；构造后的第一次操作仍可能是 ``push``。

学习链与知识更新
----------------

本题展示“用额外状态把昂贵查询提前到更新时计算”。每层的 ``prefix_min`` 是一个可随栈回滚的证书：
压栈增量更新，弹栈自然恢复。这个模式可推广到最大栈、括号深度、路径聚合和持久化版本状态。

新增或强化的知识包括：

* 数据结构不变量必须跨整个操作序列成立，而不是只证明单次函数；
* 恢复历史聚合值需要逐层证书、计数最小栈或等价可回滚信息；
* 逻辑常数工作与运行时动态数组扩容成本需要分开报告；
* 可变对象在 Julia/R 等语言中必须显式选择能让更新跨调用持久化的表示；
* 资源失败可能使无返回值更新接口无法完整表达抽象合同，应明确剩余风险；
* 可关联 `0032. Longest Valid Parentheses
  <../0001-0100/0032-longest-valid-parentheses.rst>`_ 的栈状态，以及后续需要历史聚合恢复的
  单调栈、支持最大值的队列和区间聚合结构。

带答案自检
----------

#. **为什么一个全局 ``minimum`` 不够？**

   删除当前最小值后，需要知道它出现前的最小值；一个变量已经覆盖了这段历史，
   除非扫描剩余栈或另存恢复信息，否则无法常数时间恢复。

#. **第 ``i`` 层的 ``minimum`` 精确表示什么？**

   它等于从栈底到第 ``i`` 层所有仍在栈中元素的最小值，不是从该层到栈顶的后缀最小值。

#. **重复最小值为什么必须保留两份证书？**

   弹出最上面的最小值后，下面同值元素仍使全栈最小值不变；下面那层自己的证书正好保存这一事实。

#. **``pop`` 后为什么不需要重新计算？**

   它只删除末层；下面所有前缀的成员没有变化，所以新栈顶原先保存的前缀最小值仍然正确。

#. **动态数组版本的 ``push`` 是什么复杂度？**

   前缀最小递推是最坏 ``O(1)``；普通追加偶发扩容为 ``O(d)``，一串操作的摊还时间为 ``O(1)``。

#. **C 扩容失败时实现保证了什么，又缺少什么？**

   临时 ``realloc`` 指针保证旧栈不丢失且状态不变；但 ``void`` 方法无法告诉调用者本次值未压入，
   所以资源耗尽时不能完全履行抽象 push 合同。
