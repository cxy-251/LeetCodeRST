0019. Remove Nth Node From End of List
======================================

题目信息
--------

:题号: 0019
:难度: Medium
:主题: 链表、快慢指针、虚拟头节点、节点删除
:原题: `LeetCode 0019 <https://leetcode.com/problems/remove-nth-node-from-end-of-list/>`_
:教学重点: 倒数位置转换、固定指针间距、删除前驱、头节点统一处理、所有权

题目重述
--------

给定非空单链表头节点 ``head`` 和有效整数 ``n``，删除链表倒数第 ``n`` 个节点，并返回删除后的头节点。
``n`` 不超过链表长度。删除头节点时返回值必须变为原第二个节点。

自建示例
--------

.. code-block:: text

   链表：4 -> 7 -> 1 -> 9 -> 6，n = 2
   删除倒数第 2 个节点 9。
   结果：4 -> 7 -> 1 -> 6

删除头节点：

.. code-block:: text

   链表：5 -> 8 -> 3，n = 3
   删除倒数第 3 个节点，也就是头节点 5。
   结果：8 -> 3

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   // LeetCode 提供 ListNode 定义。
   class Solution {
   private:
       ListNode* twoPasses(ListNode* head, int n) {
           int length = 0;
           for (ListNode* node = head; node != nullptr; node = node->next) {
               ++length;
           }

           ListNode dummy(0, head);
           ListNode* previous = &dummy;
           for (int step = 0; step < length - n; ++step) {
               previous = previous->next;
           }

           ListNode* removed = previous->next;
           previous->next = removed->next;
           delete removed;
           return dummy.next;
       }

       ListNode* nodeStack(ListNode* head, int n) {
           ListNode dummy(0, head);
           std::vector<ListNode*> nodes;
           for (ListNode* node = &dummy; node != nullptr; node = node->next) {
               nodes.push_back(node);
           }

           ListNode* previous = nodes[nodes.size() - n - 1];
           ListNode* removed = previous->next;
           previous->next = removed->next;
           delete removed;
           return dummy.next;
       }

       ListNode* gapPointers(ListNode* head, int n) {
           ListNode dummy(0, head);
           ListNode* fast = &dummy;
           ListNode* slow = &dummy;

           for (int step = 0; step <= n; ++step) {
               fast = fast->next;
           }

           while (fast != nullptr) {
               fast = fast->next;
               slow = slow->next;
           }

           ListNode* removed = slow->next;
           slow->next = removed->next;
           delete removed;
           return dummy.next;
       }

   public:
       ListNode* removeNthFromEnd(ListNode* head, int n) {
           return gapPointers(head, n);
       }
   };

题解
----

倒数位置如何转换为正向前驱位置
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

链表长度为 ``length`` 时，倒数第 ``n`` 个节点是从零开始的正向下标 ``length-n``。两次遍历方法先计算长度，
再从虚拟头节点前进 ``length-n`` 步，停在待删节点前驱。它直接表达位置关系，但扫描链表两次。

为什么需要虚拟头节点
~~~~~~~~~~~~~~~~~~~~

若删除原头节点，真实链表中没有它的前驱。虚拟节点 ``dummy`` 指向 ``head``，使每个可能删除的节点都拥有统一
前驱：删除头节点时前驱就是 ``dummy``。最终返回 ``dummy.next``，无需为 ``n == length`` 单独分支。

栈方法如何保存全部前驱候选
~~~~~~~~~~~~~~~~~~~~~~~~~~

把 ``dummy`` 和所有真实节点依次压入数组。末尾空指针不保存时，待删节点前驱位于
``nodes.size()-n-1``。它用 ``O(length)`` 空间换取直接随机定位，仍需一次建栈和一次删除。

固定间距如何在一次遍历中定位前驱
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

快慢指针都从 ``dummy`` 开始。先让 ``fast`` 前进 ``n+1`` 次，使 ``fast`` 与 ``slow`` 之间隔着 ``n`` 个真实
节点。随后两者同步前进；当 ``fast`` 到达空指针时，``slow->next`` 到链表末尾恰有 ``n`` 个节点，因此
``slow->next`` 就是倒数第 ``n`` 个节点，``slow`` 是其前驱。

指针状态演化
~~~~~~~~~~~~

对 ``4 -> 7 -> 1 -> 9 -> 6``、``n=2``，用 ``D`` 表示虚拟头：

.. list-table::
   :header-rows: 1

   * - 阶段
     - ``fast``
     - ``slow``
     - 说明
   * - 初始
     - ``D``
     - ``D``
     - 同一起点
   * - 快指针前进 3 次
     - ``1``
     - ``D``
     - 间隔 ``n+1`` 条 next 边
   * - 同步 1 次
     - ``9``
     - ``4``
     - 间距保持
   * - 同步 2 次
     - ``6``
     - ``7``
     - 间距保持
   * - 同步 3 次
     - ``null``
     - ``1``
     - ``slow->next`` 为待删节点 9

为什么 fast 到尾时 slow 恰在删除前驱
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

初始间距建立后，两指针每轮同时跨过一条边，间距不变。当 ``fast`` 越过尾节点到达 ``null`` 时，从
``slow`` 到 ``null`` 仍有 ``n+1`` 条边，因此从 ``slow->next`` 到 ``null`` 有 ``n`` 条边，也就是
``slow->next`` 在倒数第 ``n`` 个位置。

删除操作如何保持链表连通
~~~~~~~~~~~~~~~~~~~~~~~~

令 ``removed = slow->next``，执行 ``slow->next = removed->next``，前驱直接连接后继。除待删节点外，其他节点
相对顺序不变。C++ 示例随后释放 ``removed``；在垃圾回收语言中只需断开引用；Rust 通过 ``Option::take`` 转移
所有权后重接链表。

复杂度来源
~~~~~~~~~~

两次遍历和快慢指针都为 ``O(length)`` 时间、``O(1)`` 工作空间；快慢指针只完成一次从头到尾的整体扫描。
栈方法时间 ``O(length)``、空间 ``O(length)``。

九语言实现
----------

C
~

.. code-block:: c

   #include <stdlib.h>

   struct ListNode* removeNthFromEnd(struct ListNode* head, int n) {
       struct ListNode dummy = {0, head};
       struct ListNode* fast = &dummy;
       struct ListNode* slow = &dummy;
       for (int step = 0; step <= n; ++step) fast = fast->next;
       while (fast != NULL) { fast = fast->next; slow = slow->next; }
       struct ListNode* removed = slow->next;
       slow->next = removed->next;
       free(removed);
       return dummy.next;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
           dummy = ListNode(0, head)
           fast = slow = dummy
           for _ in range(n + 1):
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
           ListNode fast = dummy, slow = dummy;
           for (int step = 0; step <= n; step++) fast = fast.next;
           while (fast != null) { fast = fast.next; slow = slow.next; }
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
           let mut length = 0usize;
           let mut cursor = dummy.next.as_ref();
           while let Some(node) = cursor { length += 1; cursor = node.next.as_ref(); }

           let mut previous = &mut dummy;
           for _ in 0..(length - n as usize) {
               previous = previous.next.as_mut().unwrap();
           }
           let mut removed = previous.next.take().unwrap();
           previous.next = removed.next.take();
           dummy.next
       }
   }

Go
~~

.. code-block:: go

   func removeNthFromEnd(head *ListNode, n int) *ListNode {
       dummy := &ListNode{Next: head}; fast, slow := dummy, dummy
       for step := 0; step <= n; step++ { fast = fast.Next }
       for fast != nil { fast = fast.Next; slow = slow.Next }
       slow.Next = slow.Next.Next
       return dummy.Next
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
       const dummy = new ListNode(0, head);
       let fast: ListNode | null = dummy, slow: ListNode = dummy;
       for (let step = 0; step <= n; ++step) fast = fast!.next;
       while (fast !== null) { fast = fast.next; slow = slow.next!; }
       slow.next = slow.next!.next;
       return dummy.next;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public ListNode RemoveNthFromEnd(ListNode head, int n) {
           var dummy = new ListNode(0, head); ListNode fast = dummy, slow = dummy;
           for (int step = 0; step <= n; step++) fast = fast.next;
           while (fast != null) { fast = fast.next; slow = slow.next; }
           slow.next = slow.next.next;
           return dummy.next;
       }
   }

Julia
~~~~~

.. code-block:: julia

   mutable struct ListNode
       val::Int
       next::Union{ListNode,Nothing}
   end

   function remove_nth_from_end(head::Union{ListNode,Nothing}, n::Int)
       dummy = ListNode(0, head); fast = dummy; slow = dummy
       for _ in 0:n
           fast = fast.next
       end
       while fast !== nothing
           fast = fast.next
           slow = slow.next
       end
       slow.next = slow.next.next
       dummy.next
   end

R
~

.. code-block:: r

   removeNthFromEnd <- function(head, n) {
       node <- function(value, next_node = NULL) {
           result <- new.env(parent = emptyenv())
           result$value <- value; result$next <- next_node; result
       }
       dummy <- node(0, head); fast <- dummy; slow <- dummy
       for (step in 0:n) fast <- fast$next
       while (!is.null(fast)) { fast <- fast$next; slow <- slow$next }
       slow$next <- slow$next$next
       dummy$next
   }
