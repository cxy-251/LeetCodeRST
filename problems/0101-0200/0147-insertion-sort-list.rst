0147. Insertion Sort List
=========================

题目信息
--------

:题号: 0147
:难度: Medium
:主题: 链表、插入排序、指针重连
:原题: `LeetCode 0147 <https://leetcode.com/problems/insertion-sort-list/>`_
:访问状态: Available
:教学重点: 已排序前缀、稳定插入、原节点复用

题目重述
--------

给定单链表头节点，使用插入排序按非递减顺序重排并返回新头节点。实现应复用原节点，只改变 ``next`` 连接，
不额外创建结果节点；允许使用一个局部哨兵节点简化头部插入。

算法
----

维护 ``last_sorted``，表示从新头到该节点已经有序。令 ``current = last_sorted.next``：

* 若 ``last_sorted.val <= current.val``，当前节点已经位于正确位置，直接扩大有序前缀；
* 否则从哨兵开始寻找第一个值大于 ``current.val`` 的位置，把 ``current`` 从原处摘下并插到该位置之前。

搜索条件使用 ``<=``，使新节点插在已有相等值之后，保持稳定性。

正确性
~~~~~~

循环开始时，从哨兵后到 ``last_sorted`` 的节点按非递减顺序排列，并且保持它们在原链表中的相对顺序。若
``current`` 不小于前缀末尾，把它留在原位仍保持有序。否则，算法找到前缀中最后一个不大于 ``current`` 的
节点，把 ``current`` 插在其后；前驱值不大于它，后继值严格大于它，所以新前缀有序。搜索跨过所有相等值，
因此稳定性保持。每轮至少把一个原节点纳入有序前缀，最终全部节点有序。

复杂度
~~~~~~

设链表长度为 ``n``。最坏情况下每个节点都要从头搜索插入位置，时间 ``O(n^2)``；已经有序时只执行线性扫描，
时间 ``O(n)``。指针版实现只保存常数个引用，算法额外空间 ``O(1)``。Rust 为符合所有权规则，使用返回新链头
的插入辅助函数，递归栈为零且仍复用原 ``Box`` 节点；时间 ``O(n^2)``、额外节点空间 ``O(1)``。

核心语言实现
------------

C
~

.. code-block:: c

   struct ListNode *insertionSortList(struct ListNode *head) {
       struct ListNode dummy = {0, head};
       struct ListNode *last_sorted = head;
       if (head == NULL) return NULL;

       while (last_sorted->next != NULL) {
           struct ListNode *current = last_sorted->next;
           if (last_sorted->val <= current->val) {
               last_sorted = current;
               continue;
           }

           struct ListNode *position = &dummy;
           while (position->next->val <= current->val) {
               position = position->next;
           }
           last_sorted->next = current->next;
           current->next = position->next;
           position->next = current;
       }
       return dummy.next;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       ListNode *insertionSortList(ListNode *head) {
           if (head == nullptr) return nullptr;
           ListNode dummy(0, head);
           ListNode *last_sorted = head;

           while (last_sorted->next != nullptr) {
               ListNode *current = last_sorted->next;
               if (last_sorted->val <= current->val) {
                   last_sorted = current;
                   continue;
               }

               ListNode *position = &dummy;
               while (position->next->val <= current->val) {
                   position = position->next;
               }
               last_sorted->next = current->next;
               current->next = position->next;
               position->next = current;
           }
           return dummy.next;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def insertionSortList(
           self,
           head: Optional[ListNode],
       ) -> Optional[ListNode]:
           if head is None:
               return None

           dummy = ListNode(0, head)
           last_sorted = head
           while last_sorted.next is not None:
               current = last_sorted.next
               if last_sorted.val <= current.val:
                   last_sorted = current
                   continue

               position = dummy
               while position.next.val <= current.val:
                   position = position.next
               last_sorted.next = current.next
               current.next = position.next
               position.next = current
           return dummy.next

Java
~~~~

.. code-block:: java

   class Solution {
       public ListNode insertionSortList(ListNode head) {
           if (head == null) return null;
           ListNode dummy = new ListNode(0, head);
           ListNode lastSorted = head;

           while (lastSorted.next != null) {
               ListNode current = lastSorted.next;
               if (lastSorted.val <= current.val) {
                   lastSorted = current;
                   continue;
               }

               ListNode position = dummy;
               while (position.next.val <= current.val) {
                   position = position.next;
               }
               lastSorted.next = current.next;
               current.next = position.next;
               position.next = current;
           }
           return dummy.next;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn insertion_sort_list(
           mut head: Option<Box<ListNode>>,
       ) -> Option<Box<ListNode>> {
           fn insert(
               sorted: Option<Box<ListNode>>,
               mut node: Box<ListNode>,
           ) -> Option<Box<ListNode>> {
               if sorted.as_ref().map_or(true, |head| head.val > node.val) {
                   node.next = sorted;
                   return Some(node);
               }

               let mut sorted = sorted;
               let mut cursor = sorted.as_mut().unwrap();
               while cursor
                   .next
                   .as_ref()
                   .map_or(false, |next| next.val <= node.val)
               {
                   cursor = cursor.next.as_mut().unwrap();
               }
               node.next = cursor.next.take();
               cursor.next = Some(node);
               sorted
           }

           let mut sorted = None;
           while let Some(mut node) = head {
               head = node.next.take();
               sorted = insert(sorted, node);
           }
           sorted
       }
   }

Go
~~

.. code-block:: go

   func insertionSortList(head *ListNode) *ListNode {
       if head == nil {
           return nil
       }
       dummy := &ListNode{Next: head}
       lastSorted := head

       for lastSorted.Next != nil {
           current := lastSorted.Next
           if lastSorted.Val <= current.Val {
               lastSorted = current
               continue
           }

           position := dummy
           for position.Next.Val <= current.Val {
               position = position.Next
           }
           lastSorted.Next = current.Next
           current.Next = position.Next
           position.Next = current
       }
       return dummy.Next
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function insertionSortList(head: ListNode | null): ListNode | null {
       if (head === null) return null;
       const dummy = new ListNode(0, head);
       let lastSorted = head;

       while (lastSorted.next !== null) {
           const current = lastSorted.next;
           if (lastSorted.val <= current.val) {
               lastSorted = current;
               continue;
           }

           let position = dummy;
           while (position.next!.val <= current.val) {
               position = position.next!;
           }
           lastSorted.next = current.next;
           current.next = position.next;
           position.next = current;
       }
       return dummy.next;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public ListNode InsertionSortList(ListNode head) {
           if (head == null) return null;
           ListNode dummy = new(0, head);
           ListNode lastSorted = head;

           while (lastSorted.next != null) {
               ListNode current = lastSorted.next;
               if (lastSorted.val <= current.val) {
                   lastSorted = current;
                   continue;
               }

               ListNode position = dummy;
               while (position.next.val <= current.val) {
                   position = position.next;
               }
               lastSorted.next = current.next;
               current.next = position.next;
               position.next = current;
           }
           return dummy.next;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function insertion_sort_list!(
       head::Union{Nothing,ListNode},
   )::Union{Nothing,ListNode}
       head === nothing && return nothing
       dummy = ListNode(0, head)
       last_sorted = head

       while last_sorted.next !== nothing
           current = last_sorted.next
           if last_sorted.val <= current.val
               last_sorted = current
               continue
           end

           position = dummy
           while position.next.val <= current.val
               position = position.next
           end
           last_sorted.next = current.next
           current.next = position.next
           position.next = current
       end
       return dummy.next
   end

R
~

.. code-block:: r

   insertion_sort_list <- function(head) {
     if (is.null(head)) return(NULL)
     dummy <- new_list_node(0L, head)
     last_sorted <- head

     while (!is.null(last_sorted$next)) {
       current <- last_sorted$next
       if (last_sorted$val <= current$val) {
         last_sorted <- current
         next
       }

       position <- dummy
       while (position$next$val <= current$val) {
         position <- position$next
       }
       last_sorted$next <- current$next
       current$next <- position$next
       position$next <- current
     }
     dummy$next
   }

关键边界
--------

* 空链表和单节点链表原样返回；
* 已有序链表不执行节点搬移；
* 完全逆序链表反复插入表头；
* 重复值必须保持原相对顺序；
* 摘下 ``current`` 前先保存其后继关系，不能形成环或丢失剩余链表；
* 哨兵只用于局部连接，不属于返回链表。

验证
----

运行空链表、单节点、已排序、逆序、重复值和混合负数；Python、C、C++ 与稳定数组排序基准一致，并检查节点
身份集合保持不变。其余语言完成所有权、指针重连和重复值插入位置静态检查。

最小自检
--------

#. ``last_sorted`` 在每轮开始时表示什么？
#. 为什么查找条件使用 ``<=`` 才能保持稳定性？
#. 节点摘除和插入的三个指针更新应按什么关系完成？
