0019. Remove Nth Node From End of List
======================================

题目信息
--------

:题号: 0019
:难度: Medium
:主题: 链表、双指针、哑节点、引用修改
:原题: `LeetCode 0019 <https://leetcode.com/problems/remove-nth-node-from-end-of-list/>`_
:访问状态: Available
:教学重点: 固定间距、前驱定位、删除头节点统一化、所有权与引用语义

题目重述
--------

给定一个非空单链表 ``head`` 和正整数 ``n``，删除链表倒数第 ``n`` 个节点，并返回删除后的
链表头。题目保证 ``n`` 不超过链表长度。

平台已经提供 ``ListNode`` 类型。本文沿用仓库约定，不在每种语言中重复解释节点字段。

自建示例
--------

删除中间节点
~~~~~~~~~~~~

.. code-block:: text

   输入：1 -> 2 -> 3 -> 4 -> 5，n = 2
   删除倒数第二个节点 4。
   输出：1 -> 2 -> 3 -> 5

删除头节点
~~~~~~~~~~

.. code-block:: text

   输入：7 -> 8 -> 9，n = 3
   输出：8 -> 9

单节点链表
~~~~~~~~~~

.. code-block:: text

   输入：5，n = 1
   输出：空链表

删除尾节点
~~~~~~~~~~

.. code-block:: text

   输入：1 -> 2，n = 1
   输出：1

问题抽象
--------

删除单链表节点需要先找到它的前驱。若链表长度为 ``L``，倒数第 ``n`` 个节点是从头开始的
第 ``L - n`` 个零基节点，其前驱位于 ``L - n - 1``。

可以先求长度再定位，也可以让快指针先领先慢指针 ``n`` 个真实节点。随后两者同步前进：当
快指针到达链表末尾时，慢指针正好停在待删除节点的前驱。

为统一删除头节点，引入指向原头节点的哑节点：

.. code-block:: text

   dummy -> head -> ...

慢指针从 ``dummy`` 出发，因此即使目标是原头节点，也仍然存在可修改的前驱 ``dummy``。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 空间复杂度
     - 取舍
   * - 哑节点与固定间距双指针
     - ``O(L)``
     - ``O(1)``
     - 主解法；一次主扫描直接定位前驱
   * - 先求长度再定位
     - ``O(L)``
     - ``O(1)``
     - 两遍扫描，状态更直接；Rust 安全实现采用此法
   * - 把节点保存到数组
     - ``O(L)``
     - ``O(L)``
     - 随机定位容易，但使用了不必要的额外空间

主解法：固定间距双指针
----------------------

状态含义
~~~~~~~~

算法维护：

* ``dummy``：位于原头节点之前的稳定前驱；
* ``fast``：先从 ``head`` 前进 ``n`` 步；
* ``slow``：从 ``dummy`` 出发；
* ``fast`` 与 ``slow.next`` 之间始终相隔 ``n`` 个节点。

初始化后：

.. code-block:: text

   fast = head 前进 n 次
   slow = dummy

然后在 ``fast`` 非空时同步移动：

.. code-block:: text

   fast = fast.next
   slow = slow.next

当 ``fast`` 变为空时，``slow.next`` 正是倒数第 ``n`` 个节点。

固定间距为什么成立
~~~~~~~~~~~~~~~~~~

快指针先走 ``n`` 次后，若慢指针指向某个前驱，``slow.next`` 到 ``fast`` 所覆盖的节点数量
保持为 ``n``。同步移动不会改变这个间距。

当 ``fast`` 越过尾节点时，从 ``slow.next`` 到原尾节点恰好还有 ``n`` 个节点，所以
``slow.next`` 是倒数第 ``n`` 个节点。

删除操作
~~~~~~~~

定位前驱后只需改写一条链接：

.. code-block:: text

   slow.next = slow.next.next

目标节点从头节点可达链中断开。返回 ``dummy.next``，它会自动覆盖“删除原头节点”和“保留原
头节点”两种情况。

核心不变量
~~~~~~~~~~

同步移动阶段每轮开始时：

* ``slow`` 始终指向某个仍在链表中的节点或哑节点；
* ``slow.next`` 是当前候选删除节点；
* ``fast`` 比 ``slow.next`` 领先 ``n`` 个节点位置；
* 从 ``dummy.next`` 开始的链表尚未被修改；
* 若 ``fast`` 到达空指针，当前候选就是倒数第 ``n`` 个节点。

正确性依据
~~~~~~~~~~

哑节点使所有合法删除目标都拥有前驱。快指针先前进 ``n`` 个真实节点，建立与
``slow.next`` 的固定距离。之后两者每次各前进一步，距离保持不变。

链表长度为 ``L`` 时，快指针还需移动 ``L - n`` 次才到空指针，慢指针也移动相同次数，
因此从哑节点到达待删除节点的前驱。修改 ``slow.next`` 跳过目标节点，保留目标前后的其余
顺序，所以结果恰好删除倒数第 ``n`` 个节点。

复杂度
~~~~~~

* 时间复杂度：``O(L)``，每个指针单向移动；
* 辅助空间复杂度：``O(1)``；
* Rust 安全版本先求长度再定位，仍为 ``O(L)`` 时间和 ``O(1)`` 额外空间。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdlib.h>

   struct ListNode* removeNthFromEnd(
       struct ListNode* head,
       int n
   ) {
       // ListNode 由平台提供；局部哑节点不需要额外分配。
       struct ListNode dummy = {0, head};
       struct ListNode* fast = head;
       struct ListNode* slow = &dummy;

       for (int step = 0; step < n; ++step) {
           fast = fast->next;
       }

       while (fast != NULL) {
           fast = fast->next;
           slow = slow->next;
       }

       struct ListNode* removed = slow->next;
       slow->next = removed->next;
       free(removed);
       return dummy.next;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       ListNode* removeNthFromEnd(ListNode* head, int n) {
           ListNode dummy(0, head); // ListNode 由平台提供
           ListNode* fast = head;
           ListNode* slow = &dummy;

           for (int step = 0; step < n; ++step) {
               fast = fast->next;
           }

           while (fast != nullptr) {
               fast = fast->next;
               slow = slow->next;
           }

           slow->next = slow->next->next;
           return dummy.next;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def removeNthFromEnd(
           self,
           head: Optional[ListNode],
           n: int,
       ) -> Optional[ListNode]:
           dummy = ListNode(0, head)  # ListNode 由平台提供
           fast = head
           slow = dummy

           for _ in range(n):
               fast = fast.next

           while fast is not None:
               fast = fast.next
               slow = slow.next

           slow.next = slow.next.next
           return dummy.next

Java
~~~~

.. code-block:: java

   class Solution {
       public ListNode removeNthFromEnd(ListNode head, int n) {
           ListNode dummy = new ListNode(0, head);
           ListNode fast = head;
           ListNode slow = dummy;

           for (int step = 0; step < n; ++step) {
               fast = fast.next;
           }

           while (fast != null) {
               fast = fast.next;
               slow = slow.next;
           }

           slow.next = slow.next.next;
           return dummy.next;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn remove_nth_from_end(
           head: Option<Box<ListNode>>,
           n: i32,
       ) -> Option<Box<ListNode>> {
           let mut dummy = Box::new(ListNode { val: 0, next: head });

           // 安全 Rust 避免同时持有同一链表的可变与不可变借用，
           // 先求长度，再定位前驱；复杂度仍是 O(L) / O(1)。
           let mut length = 0_usize;
           let mut cursor = dummy.next.as_ref();
           while let Some(node) = cursor {
               length += 1;
               cursor = node.next.as_ref();
           }

           let steps = length - n as usize;
           let mut previous = &mut dummy;
           for _ in 0..steps {
               previous = previous.next.as_mut().unwrap();
           }

           let successor = previous
               .next
               .as_mut()
               .unwrap()
               .next
               .take();
           previous.next = successor;
           dummy.next
       }
   }

Go
~~

.. code-block:: go

   func removeNthFromEnd(head *ListNode, n int) *ListNode {
       dummy := &ListNode{Val: 0, Next: head}
       fast := head
       slow := dummy

       for step := 0; step < n; step++ {
           fast = fast.Next
       }

       for fast != nil {
           fast = fast.Next
           slow = slow.Next
       }

       slow.Next = slow.Next.Next
       return dummy.Next
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function removeNthFromEnd(
       head: ListNode | null,
       n: number,
   ): ListNode | null {
       const dummy = new ListNode(0, head);
       let fast: ListNode | null = head;
       let slow: ListNode = dummy;

       for (let step = 0; step < n; step += 1) {
           fast = fast!.next;
       }

       while (fast !== null) {
           fast = fast.next;
           slow = slow.next!;
       }

       slow.next = slow.next!.next;
       return dummy.next;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public ListNode RemoveNthFromEnd(ListNode head, int n) {
           var dummy = new ListNode(0, head);
           ListNode fast = head;
           ListNode slow = dummy;

           for (int step = 0; step < n; ++step) {
               fast = fast.next;
           }

           while (fast != null) {
               fast = fast.next;
               slow = slow.next;
           }

           slow.next = slow.next.next;
           return dummy.next;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function remove_nth_from_end(
       head::Union{Nothing, ListNode},
       n::Int,
   )::Union{Nothing, ListNode}
       # ListNode 使用仓库统一的 mutable struct 约定。
       dummy = ListNode(0, head)
       fast = head
       slow = dummy

       for _ in 1:n
           fast = something(fast).next
       end

       while fast !== nothing
           fast = fast.next
           slow = something(slow.next)
       end

       removed = something(slow.next)
       slow.next = removed.next
       return dummy.next
   end

R
~

.. code-block:: r

   removeNthFromEnd <- function(head, n) {
       # 节点使用仓库统一的 environment 引用语义。
       dummy <- new_list_node(0L, head)
       fast <- head
       slow <- dummy

       for (step in seq_len(n)) {
           fast <- node_next(fast)
       }

       while (!is.null(fast)) {
           fast <- node_next(fast)
           slow <- node_next(slow)
       }

       removed <- node_next(slow)
       set_node_next(slow, node_next(removed))
       node_next(dummy)
   }

关键边界与易错点
----------------

* 没有哑节点时，删除头节点需要单独分支；
* 快指针应先走 ``n`` 个真实节点，慢指针从哑节点开始；
* 循环结束时删除的是 ``slow.next``，不是 ``slow``；
* C 中删除节点后需要按平台约定处理内存；LeetCode C 接口通常允许显式 ``free``；
* Rust 若强行同时维护两个借用容易违反借用规则，安全两遍法更清晰；
* Julia 和 R 的节点需要引用语义，修改 ``next`` 才会影响原链。

新增与强化知识
--------------

新增
~~~~

* **固定间距定位倒数节点**：快指针领先 ``n`` 个节点，把未知长度转为同步移动；
* **前驱定位删除**：链表删除的真正操作对象是目标前驱的 ``next``；
* **哑节点统一删除头部**：把原头节点也变成普通后继节点。

强化
~~~~

* 0002 的哑节点和平台链表类型再次出现；
* Rust 的 ``Option<Box<ListNode>>`` 再次需要用 ``take`` 转移后继所有权；
* Julia 可变节点和 R 环境节点继续承担引用修改语义。

关联题目
--------

* `0002. Add Two Numbers <0002-add-two-numbers.rst>`_：首次引入平台链表类型和哑节点；
* `0011. Container With Most Water <0011-container-with-most-water.rst>`_：同样使用两个指针，
  该题按数组边界收缩，本题维护链表位置间距。

最小自检
--------

#. 为什么慢指针必须从哑节点开始？
#. 快指针先走 ``n`` 步后，两个指针同步移动保持了什么关系？
#. 循环结束时为什么 ``slow.next`` 是删除目标？
#. 删除尾节点时算法是否需要特殊处理？
#. Rust 为什么采用安全两遍法仍不改变渐进复杂度？

答案要点
~~~~~~~~

#. 它让删除原头节点也拥有可修改前驱；
#. ``fast`` 与 ``slow.next`` 始终相隔 ``n`` 个节点位置；
#. ``fast`` 已越过尾部，候选后方恰好有 ``n - 1`` 个节点；
#. 不需要，目标后继自然是空指针；
#. 两次线性遍历仍是 ``O(L)``，只使用固定数量引用。
