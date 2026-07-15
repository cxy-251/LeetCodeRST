0143. Reorder List
==================

题目信息
--------

:题号: 0143
:难度: Medium
:主题: 链表、快慢指针、原地反转、交替合并
:原题: `LeetCode 0143 <https://leetcode.com/problems/reorder-list/>`_
:访问状态: Available
:教学重点: 中点切分、后半逆序、节点复用

题目重述
--------

给定链表 ``L0 -> L1 -> ... -> Ln``，原地改造成
``L0 -> Ln -> L1 -> Ln-1 -> ...``。不能只交换节点值，必须重新连接原节点；函数不返回新的链表。

算法
----

算法分为三步：

#. 用快慢指针找到第一段末尾。快指针从 ``head.next`` 出发，使奇数长度时第一段多一个节点；
#. 断开两段，并原地反转第二段；
#. 从两段头部开始，交替连接一个第一段节点和一个逆序后的第二段节点。

断开 ``slow.next`` 很重要，否则反转和合并过程中可能保留旧边并形成环。

正确性
~~~~~~

切分后，第一段保持 ``L0, L1, ...`` 的原顺序；第二段包含剩余节点。反转第二段后，其顺序变为
``Ln, Ln-1, ...``。

合并的每轮依次连接当前第一段节点与当前第二段节点，再恢复第一段后继。于是已经合并的前缀始终等于题目
要求的交替顺序。第二段长度不超过第一段，因此当第二段耗尽时，全部节点都恰好出现一次；奇数长度时第一段
最后一个中点自然留在末尾。算法只修改 ``next``，没有创建或丢失节点。

复杂度
~~~~~~

设节点数为 ``n``。寻找中点、反转和合并各为线性扫描，总时间 ``O(n)``；只保存固定数量节点引用，
算法额外空间 ``O(1)``。所有实现复用原节点。Rust 使用 ``Rc<RefCell<_>>`` 适配可变引用图；
Julia 和 R 的节点为引用对象，修改对调用者可见。

核心语言实现
------------

C
~

.. code-block:: c

   void reorderList(struct ListNode *head) {
       if (head == NULL || head->next == NULL) {
           return;
       }

       struct ListNode *slow = head;
       struct ListNode *fast = head->next;
       while (fast != NULL && fast->next != NULL) {
           slow = slow->next;
           fast = fast->next->next;
       }

       struct ListNode *second = slow->next;
       slow->next = NULL;

       struct ListNode *previous = NULL;
       while (second != NULL) {
           struct ListNode *next = second->next;
           second->next = previous;
           previous = second;
           second = next;
       }

       struct ListNode *first = head;
       second = previous;
       while (second != NULL) {
           struct ListNode *first_next = first->next;
           struct ListNode *second_next = second->next;
           first->next = second;
           second->next = first_next;
           first = first_next;
           second = second_next;
       }
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       void reorderList(ListNode *head) {
           if (head == nullptr || head->next == nullptr) {
               return;
           }

           ListNode *slow = head;
           ListNode *fast = head->next;
           while (fast != nullptr && fast->next != nullptr) {
               slow = slow->next;
               fast = fast->next->next;
           }

           ListNode *second = slow->next;
           slow->next = nullptr;

           ListNode *previous = nullptr;
           while (second != nullptr) {
               ListNode *next = second->next;
               second->next = previous;
               previous = second;
               second = next;
           }

           ListNode *first = head;
           second = previous;
           while (second != nullptr) {
               ListNode *firstNext = first->next;
               ListNode *secondNext = second->next;
               first->next = second;
               second->next = firstNext;
               first = firstNext;
               second = secondNext;
           }
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def reorderList(self, head: Optional[ListNode]) -> None:
           if head is None or head.next is None:
               return

           slow = head
           fast = head.next
           while fast is not None and fast.next is not None:
               slow = slow.next
               fast = fast.next.next

           second = slow.next
           slow.next = None

           previous = None
           while second is not None:
               following = second.next
               second.next = previous
               previous = second
               second = following

           first = head
           second = previous
           while second is not None:
               first_next = first.next
               second_next = second.next
               first.next = second
               second.next = first_next
               first = first_next
               second = second_next

Java
~~~~

.. code-block:: java

   class Solution {
       public void reorderList(ListNode head) {
           if (head == null || head.next == null) return;

           ListNode slow = head;
           ListNode fast = head.next;
           while (fast != null && fast.next != null) {
               slow = slow.next;
               fast = fast.next.next;
           }

           ListNode second = slow.next;
           slow.next = null;

           ListNode previous = null;
           while (second != null) {
               ListNode next = second.next;
               second.next = previous;
               previous = second;
               second = next;
           }

           ListNode first = head;
           second = previous;
           while (second != null) {
               ListNode firstNext = first.next;
               ListNode secondNext = second.next;
               first.next = second;
               second.next = firstNext;
               first = firstNext;
               second = secondNext;
           }
       }
   }

Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;

   impl Solution {
       pub fn reorder_list(
           head: &mut Option<Rc<RefCell<ListNode>>>,
       ) {
           fn next(
               node: &Option<Rc<RefCell<ListNode>>>,
           ) -> Option<Rc<RefCell<ListNode>>> {
               node.as_ref()
                   .and_then(|current| current.borrow().next.clone())
           }

           if next(head).is_none() {
               return;
           }

           let mut slow = head.clone();
           let mut fast = next(head);
           while fast.is_some() {
               let fast_once = next(&fast);
               if fast_once.is_none() {
                   break;
               }
               slow = next(&slow);
               fast = next(&fast_once);
           }

           let mut second = slow
               .as_ref()
               .and_then(|node| node.borrow_mut().next.take());
           let mut previous = None;
           while let Some(node) = second {
               let following = node.borrow_mut().next.take();
               node.borrow_mut().next = previous;
               previous = Some(node);
               second = following;
           }

           let mut first = head.clone();
           second = previous;
           while let Some(second_node) = second {
               let first_node = first.expect(
                   "the first half is never shorter",
               );
               let first_next = first_node.borrow_mut().next.take();
               let second_next = second_node.borrow_mut().next.take();

               first_node.borrow_mut().next =
                   Some(second_node.clone());
               second_node.borrow_mut().next = first_next.clone();

               first = first_next;
               second = second_next;
           }
       }
   }

Go
~~

.. code-block:: go

   func reorderList(head *ListNode) {
       if head == nil || head.Next == nil {
           return
       }

       slow := head
       fast := head.Next
       for fast != nil && fast.Next != nil {
           slow = slow.Next
           fast = fast.Next.Next
       }

       second := slow.Next
       slow.Next = nil

       var previous *ListNode
       for second != nil {
           next := second.Next
           second.Next = previous
           previous = second
           second = next
       }

       first := head
       second = previous
       for second != nil {
           firstNext := first.Next
           secondNext := second.Next
           first.Next = second
           second.Next = firstNext
           first = firstNext
           second = secondNext
       }
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function reorderList(head: ListNode | null): void {
       if (head === null || head.next === null) return;

       let slow: ListNode = head;
       let fast: ListNode | null = head.next;
       while (fast !== null && fast.next !== null) {
           slow = slow.next!;
           fast = fast.next.next;
       }

       let second = slow.next;
       slow.next = null;

       let previous: ListNode | null = null;
       while (second !== null) {
           const following = second.next;
           second.next = previous;
           previous = second;
           second = following;
       }

       let first: ListNode | null = head;
       second = previous;
       while (second !== null) {
           const firstNext = first!.next;
           const secondNext = second.next;
           first!.next = second;
           second.next = firstNext;
           first = firstNext;
           second = secondNext;
       }
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public void ReorderList(ListNode head) {
           if (head == null || head.next == null) return;

           ListNode slow = head;
           ListNode fast = head.next;
           while (fast != null && fast.next != null) {
               slow = slow.next;
               fast = fast.next.next;
           }

           ListNode second = slow.next;
           slow.next = null;

           ListNode previous = null;
           while (second != null) {
               ListNode following = second.next;
               second.next = previous;
               previous = second;
               second = following;
           }

           ListNode first = head;
           second = previous;
           while (second != null) {
               ListNode firstNext = first.next;
               ListNode secondNext = second.next;
               first.next = second;
               second.next = firstNext;
               first = firstNext;
               second = secondNext;
           }
       }
   }

Julia
~~~~~

.. code-block:: julia

   function reorder_list!(head::Union{Nothing,ListNode})::Nothing
       if head === nothing || head.next === nothing
           return nothing
       end

       slow = head
       fast = head.next
       while fast !== nothing && fast.next !== nothing
           slow = slow.next
           fast = fast.next.next
       end

       second = slow.next
       slow.next = nothing

       previous = nothing
       while second !== nothing
           following = second.next
           second.next = previous
           previous = second
           second = following
       end

       first = head
       second = previous
       while second !== nothing
           first_next = first.next
           second_next = second.next
           first.next = second
           second.next = first_next
           first = first_next
           second = second_next
       end
       return nothing
   end

R
~

.. code-block:: r

   reorder_list <- function(head) {
     if (is.null(head) || is.null(head$next)) return(invisible(head))

     slow <- head
     fast <- head$next
     while (!is.null(fast) && !is.null(fast$next)) {
       slow <- slow$next
       fast <- fast$next$next
     }

     second <- slow$next
     slow$next <- NULL

     previous <- NULL
     while (!is.null(second)) {
       following <- second$next
       second$next <- previous
       previous <- second
       second <- following
     }

     first <- head
     second <- previous
     while (!is.null(second)) {
       first_next <- first$next
       second_next <- second$next
       first$next <- second
       second$next <- first_next
       first <- first_next
       second <- second_next
     }
     invisible(head)
   }

关键边界
--------

* 空链表、单节点和双节点不应形成环；
* 奇数长度时中点保留在最终尾部；
* 偶数长度时两段长度相等；
* 反转前必须断开第一段末尾；
* 合并前要先保存两段各自的后继；
* 节点对象和节点值都保持，只改变连接顺序。

验证
----

运行长度 ``0`` 至 ``6`` 的链表，检查输出顺序、节点身份集合和尾节点空引用；Python、C 与 C++ 通过。
其余语言完成切分位置、反转所有权和交替连接静态检查。

最小自检
--------

#. 快指针为什么从 ``head.next`` 出发？
#. 反转第二段前为什么必须断开第一段？
#. 如何证明交替合并不会遗漏或重复节点？
