0061. Rotate List
=================

题目信息
--------

:题号: 0061
:难度: Medium
:主题: 单链表、环、断链、模运算
:原题: `LeetCode 0061 <https://leetcode.com/problems/rotate-list/>`_
:访问状态: Available
:教学重点: 有效旋转步数、临时成环、断环位置、节点守恒、Rust 所有权适配

题目重述
--------

给定一条单链表 ``head`` 和非负整数 ``k``，把链表整体向右旋转 ``k`` 次。一次右旋会把当前尾节点
移动到链表最前方。返回旋转后的头节点。

题目保证：

* 链表节点数 ``n`` 满足 ``0 <= n <= 500``；
* 节点值满足 ``-100 <= val <= 100``，算法不依赖节点值；
* ``0 <= k <= 2 × 10^9``；
* 输入链表无环，每个节点只属于这条链表一次。

主实现只修改 ``next`` 链接，不创建、复制或释放数据节点。

自建示例
--------

普通旋转
~~~~~~~~

.. code-block:: text

   输入：1 -> 2 -> 3 -> 4 -> 5, k = 2
   输出：4 -> 5 -> 1 -> 2 -> 3

旋转次数超过长度
~~~~~~~~~~~~~~~~

.. code-block:: text

   输入：0 -> 1 -> 2, k = 8
   输出：1 -> 2 -> 0

``8 % 3 = 2``，只需执行两次有效右旋。

整圈旋转
~~~~~~~~

.. code-block:: text

   输入：1 -> 2 -> 3, k = 6
   输出：1 -> 2 -> 3

空链表与单节点
~~~~~~~~~~~~~~

.. code-block:: text

   输入：空链表, k = 10
   输出：空链表

   输入：7, k = 100
   输出：7

问题抽象
--------

长度为 ``n`` 的链表右旋 ``n`` 次会回到原状，因此真正需要处理的步数是：

.. code-block:: text

   shift = k % n

当 ``shift > 0`` 时，旋转后的结构可以视为在原链表的以下位置切开：

.. code-block:: text

   前 n - shift 个节点 | 后 shift 个节点

后半段成为新前缀，前半段接到它后面。常规指针语言可以先令原尾节点指向原头，临时形成一个包含全部
节点的环，再在第 ``n - shift`` 个节点之后断开。

.. mermaid::

   flowchart LR
       A["原头 1"] --> B["2"]
       B --> C["3 新尾"]
       C --> D["4 新头"]
       D --> E["5 原尾"]
       E -. "临时连接" .-> A

在 ``1 -> 2 -> 3 -> 4 -> 5``、``shift = 2`` 中，新尾是第 ``3`` 个节点，新头是它的后继。
断开 ``3 -> 4`` 后得到 ``4 -> 5 -> 1 -> 2 -> 3``。

基础类型约定
------------

``ListNode`` 由平台提供，包含节点值和指向下一节点的 ``next`` 字段。C、C++、Python、Java、Go、
TypeScript、C#、Julia 与 R 可以直接重连节点引用。Julia 复用仓库的 ``mutable struct ListNode``，
R 复用以 ``environment`` 表达引用语义的 ``new_list_node``。

Rust 的平台链表使用 ``Option<Box<ListNode>>``，独占所有权不允许安全代码构造引用环。因此 Rust 主实现
采用等价的“在线性链表中断开，再把旧前缀接到新尾”方式，保持 ``O(1)`` 算法额外空间。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 算法额外空间
     - 定位
   * - 计算长度、成环并断环
     - ``O(n)``
     - ``O(1)``
     - 主解法；直接表达循环位移
   * - 线性断开后拼接
     - ``O(n)``
     - ``O(1)``
     - Rust 所有权适配；逻辑结果等价
   * - 保存全部节点到数组后重连
     - ``O(n)``
     - ``O(n)``
     - 下标直观，但额外保存所有节点
   * - 重复执行一次右旋
     - ``O(k × n)``
     - ``O(1)``
     - ``k`` 很大时不可接受

主解法：临时成环后在目标位置断开
----------------------------------

状态定义
~~~~~~~~

第一遍扫描得到：

* ``length``：链表节点总数；
* ``tail``：原链表最后一个节点。

若 ``length <= 1``，直接返回。否则计算 ``shift = k % length``。当 ``shift == 0`` 时，结果与输入
拓扑相同，也直接返回。

对其余情况：

#. 令 ``tail.next = head``，把全部节点连接成一个环；
#. 从原头开始向前走 ``length - shift - 1`` 条边，到达 ``new_tail``；
#. 保存 ``new_head = new_tail.next``；
#. 令 ``new_tail.next = null``，恢复为线性链表；
#. 返回 ``new_head``。

核心不变量
~~~~~~~~~~

长度扫描阶段：

* ``length`` 等于已经访问的节点数；
* ``tail`` 指向已访问前缀的最后节点；
* 尚未访问后缀仍与前缀连续相接，链表没有被修改。

成环后的定位阶段：

* 环中仍恰好包含原来的 ``length`` 个节点，没有新增或丢失；
* 从原头前进 ``t`` 条边后到达原链表零基下标 ``t`` 的节点；
* ``new_tail`` 应位于零基下标 ``length - shift - 1``；
* ``new_tail.next`` 是原下标 ``length - shift`` 的节点，也就是旋转后的新头。

正确性依据
~~~~~~~~~~

**有效步数正确。** 每右旋 ``length`` 次，所有节点回到原位置。把 ``k`` 写成
``q × length + shift``，其中 ``0 <= shift < length``；前 ``q`` 个整圈不改变结果，所以只需处理
``shift`` 次。

**切分位置正确。** 右旋 ``shift`` 次后，原链表最后 ``shift`` 个节点应移动到最前方。原链表前
``length - shift`` 个节点保持相对顺序并移动到后面，因此新尾正是原下标
``length - shift - 1``，其后继是新头。

**临时成环保持节点守恒。** ``tail.next = head`` 只增加原尾到原头的一条边。每个原节点仍在环中
出现一次，节点身份和值均未改变。环允许从切点后的新头继续经过原尾，再自然连接到原头。

**断环得到正确顺序。** 在目标新尾处删除唯一出边，环被切成一条线性链表。遍历顺序从新头开始为
“原后 ``shift`` 个节点，再接原前 ``length - shift`` 个节点”，正是右旋结果；所有内部相对顺序
保持不变。

**无环与终止性。** 最终将 ``new_tail.next`` 置空，临时环被完全解除。长度扫描和新尾定位都只执行
有限次前进，算法终止。

Rust 等价性
~~~~~~~~~~

Rust 实现在前缀末尾使用 ``take`` 分离出新后缀，再找到该后缀的尾节点，
把旧前缀所有权接到其 ``next``。分离点、新头和最终遍历顺序与成环断环法完全相同；区别只在于不构造
Rust 独占 ``Box`` 无法表达的环。

复杂度
~~~~~~

设链表长度为 ``n``：

* 长度扫描、切点定位和必要的尾部定位合计访问常数轮链表，时间复杂度为 ``O(n)``；
* 常规实现只保存固定数量的节点引用，算法额外空间为 ``O(1)``；
* Rust 使用若干 ``Option``、可变引用和局部 ``Box`` 所有权变量，没有按 ``n`` 增长的容器，额外空间
  仍为 ``O(1)``；
* 算法返回原节点组成的新头引用，没有结果节点复制成本。

核心语言实现
------------

以下代码复用仓库约定的 ``ListNode`` 类型，不在单题内重复定义。

C
~

.. code-block:: c

   struct ListNode *rotateRight(struct ListNode *head, int k) {
       if (head == NULL || head->next == NULL || k == 0) {
           return head;
       }

       int length = 1;
       struct ListNode *tail = head;
       while (tail->next != NULL) {
           tail = tail->next;
           ++length;
       }

       int shift = k % length;
       if (shift == 0) {
           return head;
       }

       tail->next = head;
       struct ListNode *new_tail = head;
       int steps = length - shift - 1;
       for (int step = 0; step < steps; ++step) {
           new_tail = new_tail->next;
       }

       struct ListNode *new_head = new_tail->next;
       new_tail->next = NULL;
       return new_head;
   }

``length <= 500``，所以长度和 ``k % length`` 都适合 ``int``。函数只重连节点，不负责释放节点。

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       ListNode* rotateRight(ListNode* head, int k) {
           if (head == nullptr || head->next == nullptr || k == 0) {
               return head;
           }

           int length = 1;
           ListNode* tail = head;
           while (tail->next != nullptr) {
               tail = tail->next;
               ++length;
           }

           int shift = k % length;
           if (shift == 0) {
               return head;
           }

           tail->next = head;
           ListNode* new_tail = head;
           for (int step = 0; step < length - shift - 1; ++step) {
               new_tail = new_tail->next;
           }

           ListNode* new_head = new_tail->next;
           new_tail->next = nullptr;
           return new_head;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def rotateRight(
           self,
           head: Optional[ListNode],
           k: int,
       ) -> Optional[ListNode]:
           if head is None or head.next is None or k == 0:
               return head

           length = 1
           tail = head
           while tail.next is not None:
               tail = tail.next
               length += 1

           shift = k % length
           if shift == 0:
               return head

           tail.next = head
           new_tail = head
           for _ in range(length - shift - 1):
               new_tail = new_tail.next

           new_head = new_tail.next
           new_tail.next = None
           return new_head

Java
~~~~

.. code-block:: java

   class Solution {
       public ListNode rotateRight(ListNode head, int k) {
           if (head == null || head.next == null || k == 0) {
               return head;
           }

           int length = 1;
           ListNode tail = head;
           while (tail.next != null) {
               tail = tail.next;
               ++length;
           }

           int shift = k % length;
           if (shift == 0) {
               return head;
           }

           tail.next = head;
           ListNode newTail = head;
           for (int step = 0; step < length - shift - 1; ++step) {
               newTail = newTail.next;
           }

           ListNode newHead = newTail.next;
           newTail.next = null;
           return newHead;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn rotate_right(
           mut head: Option<Box<ListNode>>,
           k: i32,
       ) -> Option<Box<ListNode>> {
           let mut length = 0usize;
           let mut cursor = head.as_ref();
           while let Some(node) = cursor {
               length += 1;
               cursor = node.next.as_ref();
           }

           if length <= 1 {
               return head;
           }

           let shift = (k as usize) % length;
           if shift == 0 {
               return head;
           }

           let prefix_length = length - shift;
           let mut cut = &mut head;
           for _ in 0..prefix_length - 1 {
               cut = &mut cut.as_mut().unwrap().next;
           }

           let mut new_head = cut.as_mut().unwrap().next.take();
           let mut new_tail = new_head.as_mut().unwrap();
           while new_tail.next.is_some() {
               new_tail = new_tail.next.as_mut().unwrap();
           }
           new_tail.next = head;

           new_head
       }
   }

题目保证 ``k >= 0``，所以转换到 ``usize`` 安全。``shift > 0`` 保证新后缀非空，
``prefix_length >= 1`` 保证 ``unwrap`` 都有对应节点见证。``take`` 转移后缀所有权并在切点留下 ``None``。

Go
~~

.. code-block:: go

   func rotateRight(head *ListNode, k int) *ListNode {
       if head == nil || head.Next == nil || k == 0 {
           return head
       }

       length := 1
       tail := head
       for tail.Next != nil {
           tail = tail.Next
           length++
       }

       shift := k % length
       if shift == 0 {
           return head
       }

       tail.Next = head
       newTail := head
       for step := 0; step < length-shift-1; step++ {
           newTail = newTail.Next
       }

       newHead := newTail.Next
       newTail.Next = nil
       return newHead
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function rotateRight(head: ListNode | null, k: number): ListNode | null {
       if (head === null || head.next === null || k === 0) {
           return head;
       }

       let length = 1;
       let tail: ListNode = head;
       while (tail.next !== null) {
           tail = tail.next;
           length += 1;
       }

       const shift = k % length;
       if (shift === 0) {
           return head;
       }

       tail.next = head;
       let newTail: ListNode = head;
       for (let step = 0; step < length - shift - 1; step += 1) {
           newTail = newTail.next!;
       }

       const newHead = newTail.next;
       newTail.next = null;
       return newHead;
   }

``k <= 2 × 10^9`` 与长度计算都处于安全整数范围。非空断言由临时环和步数上界保证。

C#
~~

.. code-block:: csharp

   public class Solution {
       public ListNode RotateRight(ListNode head, int k) {
           if (head == null || head.next == null || k == 0) {
               return head;
           }

           int length = 1;
           ListNode tail = head;
           while (tail.next != null) {
               tail = tail.next;
               ++length;
           }

           int shift = k % length;
           if (shift == 0) {
               return head;
           }

           tail.next = head;
           ListNode newTail = head;
           for (int step = 0; step < length - shift - 1; ++step) {
               newTail = newTail.next;
           }

           ListNode newHead = newTail.next;
           newTail.next = null;
           return newHead;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function rotate_right(head::Union{ListNode, Nothing}, k::Int)
       if head === nothing || head.next === nothing || k == 0
           return head
       end

       length = 1
       tail = head
       while tail.next !== nothing
           tail = tail.next
           length += 1
       end

       shift = k % length
       if shift == 0
           return head
       end

       tail.next = head
       new_tail = head
       for _ in 1:(length - shift - 1)
           new_tail = new_tail.next
       end

       new_head = new_tail.next
       new_tail.next = nothing
       return new_head
   end

当步数为零时，Julia 的 ``1:0`` 是空 ``UnitRange``，所以新尾保持原头；这里仍明确使用
``length - shift - 1`` 的非负上界说明切点含义。

R
~

.. code-block:: r

   rotate_right <- function(head, k) {
     if (is.null(head) || is.null(head$next) || k == 0) {
       return(head)
     }

     length <- 1L
     tail <- head
     while (!is.null(tail$next)) {
       tail <- tail$next
       length <- length + 1L
     }

     shift <- as.integer(k %% length)
     if (shift == 0L) {
       return(head)
     }

     tail$next <- head
     new_tail <- head
     steps <- length - shift - 1L
     if (steps > 0L) {
       for (step in seq_len(steps)) {
         new_tail <- new_tail$next
       }
     }

     new_head <- new_tail$next
     new_tail$next <- NULL
     new_head
   }

R 的节点是 ``environment``，因此 ``tail$next <- head`` 与断链会修改共享节点字段。显式判断
``steps > 0``，避免把 ``seq_len(0)`` 误读为需要执行的循环。

语言边界说明
------------

* C、C++、Python、Java、Go、TypeScript、C#、Julia 和 R 都短暂形成环，所有返回路径必须在返回前断环；
* C/C++ 函数不创建或释放节点，节点所有权仍属于调用平台；
* Rust 消费 ``head`` 的所有权，通过 ``take`` 断开后缀，再把旧前缀移动到新尾，不使用 ``unsafe``
  或引用环；
* TypeScript 的 ``number`` 对本题 ``k`` 与长度完全精确，不使用 32 位位运算；
* Julia 的节点必须是可变结构；R 必须使用 ``environment`` 节点，普通列表复制不能表达同一原地重连语义；
* 节点值不参与算法，相同值节点仍按身份和原始位置参与旋转。

对照解法：节点数组重连
----------------------

遍历链表并把每个节点引用保存到数组，令 ``split = n - shift``，再按
``nodes[split..n) + nodes[0..split)`` 的顺序重写 ``next``。时间为 ``O(n)``，数组额外空间为
``O(n)``。该写法下标直观，却没有必要保存全部节点，也弱化了链表切分和节点守恒的教学重点。

验证计划与证据
--------------

``运行验证``
   覆盖空链表、单节点、``k = 0``、``k`` 为长度倍数、``k > n``、普通切分和所有节点值相同的情况。

``随机基准对拍``
   Python 把随机链表转换为节点身份数组，用独立的数组切片公式计算期望身份顺序，再与指针重连结果比较；
   同时检查节点集合不变、节点数不变且最终无环。

``编译验证``
   C 使用 C17、严格警告、AddressSanitizer 与 UndefinedBehaviorSanitizer；C++ 使用 C++17 严格警告；
   Java、Go 和 TypeScript 分别完成编译或严格类型检查。

``静态验证``
   Rust、C#、Julia 和 R 在当前环境缺少运行时，检查接口、所有权见证、可变节点约定、一基循环范围和
   最终断环路径，不宣称运行通过。

关键边界
--------

* 空链表：不能对长度取模；必须在长度计算前直接返回；
* 单节点：任何旋转结果都相同；
* ``k = 0`` 或 ``k % n = 0``：不应成环后再无意义断环；
* ``shift = n - 1``：新尾就是原头，定位步数为零；
* ``shift = 1``：原尾成为新头，原倒数第二节点成为新尾；
* ``k = 2 × 10^9``：先取模，不能按 ``k`` 次重复移动尾节点；
* 相同节点值：验证必须比较节点身份或位置，不能只比较值序列。

易错点
------

* 空链表上计算 ``k % length``，发生除零；
* 新尾位置误写成 ``length - shift``，导致切点向右偏一位；
* 成环后在提前返回路径中没有断环，结果遍历永不终止；
* 找到新头后先覆盖引用，丢失需要断开的新尾；
* 把节点值复制到新链表，违反原地重连语义并增加 ``O(n)`` 结果分配；
* Rust 试图用安全 ``Box`` 建立环，造成所有权模型冲突；
* R 使用普通列表节点并假设字段赋值会像 ``environment`` 一样共享修改。

本题新增知识
------------

* 旋转链表可以化为“取模后的切分 + 后缀前移”；
* 临时成环把尾部接回头部，使任意切点后的节点都能自然成为新头；
* 正确性需要同时证明切点、节点守恒、最终无环和相对顺序不变；
* Rust 的独占所有权需要用线性断开与拼接表达等价拓扑变换。

本题强化知识
------------

* 0019 的长度与位置换算继续用于从整体长度定位节点；
* 0024、0025 的局部链表重连继续要求先保存后继，再修改边；
* Julia 的可变节点与 R 的 ``environment`` 引用节点约定继续复用；
* Rust 的 ``Option<Box<ListNode>>`` 继续通过 ``take`` 转移链表所有权；
* 链表证明继续检查节点身份守恒、连通性和无环性。

关联题目
--------

* `0019. Remove Nth Node From End of List <0019-remove-nth-node-from-end-of-list.rst>`_：两题都把链表长度
  转换为从头计数的位置；本题定位切点后重连两段。
* `0024. Swap Nodes in Pairs <0024-swap-nodes-in-pairs.rst>`_：两题都只改变节点链接，并证明局部重连
  不丢节点、不重复节点。
* `0025. Reverse Nodes in k-Group <0025-reverse-nodes-in-k-group.rst>`_：该题按组反转多条边，本题把
  整条链表切成两段后重新首尾拼接。

最小自检
--------

#. 为什么只需处理 ``k % length`` 次旋转？
#. 新尾为什么位于原链表零基下标 ``length - shift - 1``？
#. 临时成环后，哪一条边必须被删除才能保证最终无环？
#. 如何证明旋转前后节点集合和节点身份完全不变？
#. Rust 为什么采用断开再拼接，而不直接实现临时环？

答案要点
~~~~~~~~

#. 每 ``length`` 次右旋构成一个完整周期，整圈不改变任何节点位置。
#. 原后 ``shift`` 个节点成为新前缀，前段最后一个节点就是新尾。
#. 删除 ``new_tail -> new_head``，该边正是目标切点处的环边。
#. 算法只增加一条旧尾到旧头的边并删除一条切点边，没有创建、复制或释放节点。
#. ``Box`` 表达独占树状所有权，安全 Rust 不能让尾节点重新拥有头节点；线性拆分与拼接得到同一顺序。
