0092. Reverse Linked List II
============================

题目信息
--------

:题号: 0092
:难度: Medium
:主题: 单链表、区间反转、哨兵节点、头插法
:原题: `LeetCode 0092 <https://leetcode.com/problems/reverse-linked-list-ii/>`_
:访问状态: Available
:教学重点: 区间前驱、固定尾节点、逐节点头插、节点守恒与无环重连

题目重述
--------

给定一条单链表 ``head`` 和两个一基位置 ``left``、``right``，原地反转闭区间
``[left, right]`` 内的节点，区间外节点保持原顺序。题目保证链表非空、无环，
``1 <= left <= right <= n``，节点数 ``n <= 500``。只能重连原节点，不能交换节点值。

自建示例
--------

.. code-block:: text

   输入：1 -> 2 -> 3 -> 4 -> 5，left = 2，right = 4
   输出：1 -> 4 -> 3 -> 2 -> 5

边界示例：``left = right`` 时区间长度为一，链表必须保持不变。

问题抽象
--------

使用哨兵节点 ``dummy`` 统一处理 ``left = 1``。先找到反转区间前一节点 ``before``：

.. code-block:: text

   before -> current -> moved -> suffix

``current`` 固定为反转区间原首节点，也会成为最终区间尾。每轮取出
``current.next`` 指向的 ``moved``，把它插到 ``before`` 之后：

.. code-block:: text

   before -> moved -> ... -> current -> suffix

重复 ``right - left`` 次后，原区间除 ``current`` 外的所有节点都被依次移到区间头部，
恰好得到逆序。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 定位
   * - 哨兵前驱与区间头插
     - ``O(n)``
     - ``O(1)``
     - 主解法；一趟定位并原地重连
   * - 先断开区间、普通反转后重接
     - ``O(n)``
     - ``O(1)``
     - 同样正确，但需要保存更多边界指针
   * - 把节点放入数组后反转下标区间
     - ``O(n)``
     - ``O(n)``
     - 索引直观，没有练习链表原地重连

主解法：区间头插
----------------

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

找到 ``before`` 后，令 ``current = before.next``。执行第 ``step`` 轮之前：

* ``before`` 之前的前缀保持原顺序；
* ``before.next`` 到 ``current`` 已包含区间前 ``step + 1`` 个原节点，顺序已经反转；
* ``current`` 始终是该反转前缀的尾节点；
* ``current.next`` 是区间内下一个尚未移动的节点；
* ``current`` 之后的未处理区间与链表后缀仍保持原顺序；
* 每个原节点仍恰好出现一次，整条结构无环。

一轮重连按以下顺序执行：

.. code-block:: text

   moved = current.next
   current.next = moved.next
   moved.next = before.next
   before.next = moved

第一步先保存节点，第二步从旧位置摘除它，后两步把它插入反转区间头部。每轮处理节点数增加一，
不变量继续成立。

为什么恰好得到逆序
~~~~~~~~~~~~~~~~~~

设原区间为 ``a1, a2, ..., ak``。``current`` 固定为 ``a1``。第一轮把 ``a2`` 插到
``a1`` 前，得到 ``a2, a1``；第二轮把 ``a3`` 插到最前，得到 ``a3, a2, a1``。
归纳可知第 ``t`` 轮后得到 ``a(t+1), ..., a2, a1``。执行 ``k-1`` 轮后得到完整逆序。

正确性依据
~~~~~~~~~~

**区间外不变。** ``before`` 之前的边从不修改；``current.next`` 在最后一轮指向原区间后的首节点，
后缀内部链接也从不修改。

**节点守恒。** 每轮只摘除一个已保存的 ``moved`` 节点并重新插入，不创建、删除、遗漏或复制数据节点。

**无环。** 摘除操作先让 ``current`` 越过 ``moved``，再令 ``moved`` 指向已反转前缀；已反转前缀最终
以 ``current`` 指向未处理后缀，不存在返回到自身的边。

**完整性。** 共执行 ``right-left`` 轮，恰好移动区间中除首节点外的所有节点。

**终止性。** 定位循环和反转循环都有由题目合法位置保证的固定次数。

复杂度与语言边界
~~~~~~~~~~~~~~~~

* 定位 ``before`` 访问 ``left-1`` 条边，反转执行 ``right-left`` 次，总时间 ``O(n)``；
* 常规指针语言只保存固定数量引用，额外空间 ``O(1)``；
* 返回链复用全部原节点，结果本身不计入额外空间；
* Rust 安全实现先从所有权链中取出目标区间，逐节点反转，再扫描反转段找到尾槽位并接回后缀；
  总时间仍为 ``O(n)``，额外容器空间为 ``O(1)``；
* Julia 和 R 使用仓库既有的可变引用节点约定，重连会修改调用者持有的原链表拓扑。

核心语言实现
------------

以下 ``ListNode`` 由平台提供；Julia 与 R 复用仓库在前序链表题中建立的节点约定。

C
~

.. code-block:: c

   struct ListNode *reverseBetween(
       struct ListNode *head,
       int left,
       int right
   ) {
       struct ListNode dummy = {0, head};
       struct ListNode *before = &dummy;

       for (int position = 1; position < left; ++position) {
           before = before->next;
       }

       struct ListNode *current = before->next;
       for (int step = 0; step < right - left; ++step) {
           struct ListNode *moved = current->next;
           current->next = moved->next;
           moved->next = before->next;
           before->next = moved;
       }

       return dummy.next;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       ListNode* reverseBetween(ListNode* head, int left, int right) {
           ListNode dummy(0, head);
           ListNode* before = &dummy;

           for (int position = 1; position < left; ++position) {
               before = before->next;
           }

           ListNode* current = before->next;
           for (int step = 0; step < right - left; ++step) {
               ListNode* moved = current->next;
               current->next = moved->next;
               moved->next = before->next;
               before->next = moved;
           }

           return dummy.next;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def reverseBetween(
           self,
           head: Optional[ListNode],
           left: int,
           right: int,
       ) -> Optional[ListNode]:
           dummy = ListNode(0, head)
           before = dummy

           for _ in range(left - 1):
               before = before.next

           current = before.next
           for _ in range(right - left):
               moved = current.next
               current.next = moved.next
               moved.next = before.next
               before.next = moved

           return dummy.next

Java
~~~~

.. code-block:: java

   class Solution {
       public ListNode reverseBetween(ListNode head, int left, int right) {
           ListNode dummy = new ListNode(0, head);
           ListNode before = dummy;

           for (int position = 1; position < left; ++position) {
               before = before.next;
           }

           ListNode current = before.next;
           for (int step = 0; step < right - left; ++step) {
               ListNode moved = current.next;
               current.next = moved.next;
               moved.next = before.next;
               before.next = moved;
           }

           return dummy.next;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn reverse_between(
           head: Option<Box<ListNode>>,
           left: i32,
           right: i32,
       ) -> Option<Box<ListNode>> {
           let mut dummy = Box::new(ListNode { val: 0, next: head });
           let mut before = &mut dummy;

           for _ in 1..left {
               before = before.next.as_mut().unwrap();
           }

           let mut remaining = before.next.take();
           let mut reversed: Option<Box<ListNode>> = None;
           for _ in left..=right {
               let mut node = remaining.take().unwrap();
               remaining = node.next.take();
               node.next = reversed;
               reversed = Some(node);
           }

           let mut tail = reversed.as_mut().unwrap();
           while tail.next.is_some() {
               tail = tail.next.as_mut().unwrap();
           }
           tail.next = remaining;
           before.next = reversed;
           dummy.next
       }
   }

Go
~~

.. code-block:: go

   func reverseBetween(head *ListNode, left int, right int) *ListNode {
       dummy := &ListNode{Val: 0, Next: head}
       before := dummy

       for position := 1; position < left; position++ {
           before = before.Next
       }

       current := before.Next
       for step := 0; step < right-left; step++ {
           moved := current.Next
           current.Next = moved.Next
           moved.Next = before.Next
           before.Next = moved
       }

       return dummy.Next
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function reverseBetween(
       head: ListNode | null,
       left: number,
       right: number,
   ): ListNode | null {
       const dummy = new ListNode(0, head);
       let before = dummy;

       for (let position = 1; position < left; position += 1) {
           before = before.next as ListNode;
       }

       const current = before.next as ListNode;
       for (let step = 0; step < right - left; step += 1) {
           const moved = current.next as ListNode;
           current.next = moved.next;
           moved.next = before.next;
           before.next = moved;
       }

       return dummy.next;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public ListNode ReverseBetween(ListNode head, int left, int right) {
           var dummy = new ListNode(0, head);
           ListNode before = dummy;

           for (int position = 1; position < left; ++position) {
               before = before.next;
           }

           ListNode current = before.next;
           for (int step = 0; step < right - left; ++step) {
               ListNode moved = current.next;
               current.next = moved.next;
               moved.next = before.next;
               before.next = moved;
           }

           return dummy.next;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function reverse_between(
       head::Union{ListNode, Nothing},
       left::Int,
       right::Int,
   )::Union{ListNode, Nothing}
       dummy = ListNode(0, head)
       before = dummy

       for _ in 1:(left - 1)
           before = before.next::ListNode
       end

       current = before.next::ListNode
       for _ in 1:(right - left)
           moved = current.next::ListNode
           current.next = moved.next
           moved.next = before.next
           before.next = moved
       end

       return dummy.next
   end

R
~

.. code-block:: r

   reverse_between <- function(head, left, right) {
     dummy <- new.env(parent = emptyenv())
     dummy$val <- 0L
     dummy$next <- head
     before <- dummy

     if (left > 1L) {
       for (position in seq_len(left - 1L)) {
         before <- before$next
       }
     }

     current <- before$next
     if (right > left) {
       for (step in seq_len(right - left)) {
         moved <- current$next
         current$next <- moved$next
         moved$next <- before$next
         before$next <- moved
       }
     }

     dummy$next
   }

验证计划与证据
--------------

本批次对长度 ``1..30`` 的链表穷举全部合法 ``left``、``right``：

* 与数组切片反转基准比较节点值顺序；
* 检查返回链中的对象身份恰好等于原节点集合；
* 检查区间外节点顺序、最终长度和无环性；
* C、C++ 使用严格警告、ASan、UBSan；Java、Go、TypeScript 完成编译与运行。

Rust、C#、Julia 和 R 在当前环境执行所有权、可变引用、空值和循环边界的静态检查。

关键边界
--------

* ``left = 1`` 依靠哨兵统一更新新头；
* ``left = right`` 时循环零次，不读取不存在的 ``current.next``；
* ``right = n`` 时最后一轮令 ``current.next`` 保持为空；
* 题目保证位置合法，代码中的非空解包均由该契约支撑。

易错点
------

* 每轮移动 ``current`` 会破坏“固定原区间首节点为最终尾”的头插模型；
* 先写 ``moved.next = before.next`` 再摘除，会丢失 ``moved`` 原后继；
* 不使用哨兵时，``left = 1`` 需要单独修改 ``head``，容易漏掉；
* 通过交换节点值无法保持节点身份语义。

本题新增知识
------------

* 固定区间尾节点的链表头插反转；
* 以 ``right-left`` 次局部重连完成闭区间逆序；
* Rust 所有权链的“取出区间—反转—尾槽位重接”写法。

本题强化知识
------------

* 哨兵节点统一头部修改；
* 局部链表重连需要同时证明连通、节点守恒和无环；
* 与 `0025. Reverse Nodes in k-Group <0025-reverse-nodes-in-k-group.rst>`_ 相同，修改链接前先保存原后继。

关联题目
--------

* `0025. Reverse Nodes in k-Group <0025-reverse-nodes-in-k-group.rst>`_：探测分组后反转半开区间；
* `0061. Rotate List <0061-rotate-list.rst>`_：链表边界定位与局部重连；
* `0086. Partition List <0086-partition-list.rst>`_：复用原节点并证明节点守恒和无环。

最小自检
--------

#. 为什么 ``current`` 在整个反转循环中不移动？
#. 四条赋值为什么既不会丢节点，也不会形成环？
#. 为什么反转循环次数是 ``right-left``？
#. Rust 实现与头插实现的控制流不同，问题语义和复杂度为什么仍一致？

答案要点
~~~~~~~~

#. ``current`` 是原区间首节点，每轮把其后继移到最前，它自然成为最终区间尾。
#. 修改前保存 ``moved``；先让 ``current`` 越过它，再把它接到已反转前缀头部。
#. 长度为 ``k`` 的区间只需移动首节点之后的 ``k-1`` 个节点。
#. 两者都只重连原节点、只反转指定区间、保持区间外顺序，并在 ``O(n)`` 时间和常数容器空间内完成。
