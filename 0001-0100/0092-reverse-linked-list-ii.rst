0092. Reverse Linked List II
============================

题目信息
--------

:题号: 0092
:题名: Reverse Linked List II
:难度: Medium
:类型: Algorithms
:主题: 单链表、区间反转、哨兵节点、原地重连
:原题: `LeetCode 0092 <https://leetcode.com/problems/reverse-linked-list-ii/>`_
:教学重点: 区间前驱、固定区间尾、逐节点头插、节点守恒

题目重述
--------

给定非空单链表和一基位置 ``left``、``right``，原地反转闭区间 ``[left,right]`` 内的节点，区间外节点保持原顺序。题目保证位置合法。算法必须重连原节点，不能通过交换节点值伪造反转。

自建示例
--------

.. code-block:: text

   1 -> 2 -> 3 -> 4 -> 5, left=2, right=4
   1 -> 4 -> 3 -> 2 -> 5

.. code-block:: text

   1 -> 2 -> 3, left=1, right=3
   3 -> 2 -> 1

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       ListNode* nodeArray(ListNode* head, int left, int right) {
           std::vector<ListNode*> nodes;
           for (ListNode* node = head; node; node = node->next) nodes.push_back(node);
           ListNode dummy(0, head), *tail = &dummy;
           for (int i = 0; i < static_cast<int>(nodes.size()); ++i) {
               int index = i + 1;
               ListNode* chosen = index < left || index > right
                   ? nodes[i]
                   : nodes[right - 1 - (index - left)];
               tail->next = chosen;
               tail = chosen;
           }
           tail->next = nullptr;
           return dummy.next;
       }

       ListNode* detachReverseReconnect(ListNode* head, int left, int right) {
           ListNode dummy(0, head), *before = &dummy;
           for (int position = 1; position < left; ++position) before = before->next;
           ListNode* segment_head = before->next;
           ListNode* after = segment_head;
           for (int position = left; position <= right; ++position) after = after->next;
           ListNode* previous = after;
           ListNode* current = segment_head;
           while (current != after) {
               ListNode* next = current->next;
               current->next = previous;
               previous = current;
               current = next;
           }
           before->next = previous;
           return dummy.next;
       }

       ListNode* frontInsertion(ListNode* head, int left, int right) {
           ListNode dummy(0, head);
           ListNode* before = &dummy;
           for (int position = 1; position < left; ++position) before = before->next;
           ListNode* current = before->next;
           for (int step = 0; step < right - left; ++step) {
               ListNode* moved = current->next;
               current->next = moved->next;
               moved->next = before->next;
               before->next = moved;
           }
           return dummy.next;
       }

   public:
       ListNode* reverseBetween(ListNode* head, int left, int right) {
           return frontInsertion(head, left, right);
       }
   };

题解
----

为什么需要哨兵节点
~~~~~~~~~~~~~~~~

若 ``left=1``，反转后的区间首节点会成为整条链的新头。哨兵令 ``dummy.next=head``，使区间前驱始终存在；无论区间是否从头开始，最终修改都统一为 ``before.next``。

区间头插保存什么状态
~~~~~~~~~~~~~~~~~~~~

定位 ``before`` 后，令 ``current=before.next``。``current`` 是原区间首节点，在反转过程中始终固定，并逐渐成为已反转区间的尾节点。它的 ``next`` 指向下一个尚未移动的区间节点。

一轮四步重连
~~~~~~~~~~~~

.. code-block:: text

   moved = current.next
   current.next = moved.next
   moved.next = before.next
   before.next = moved

先保存 ``moved``，再从旧位置摘除，随后把它插入 ``before`` 后方。顺序不能交换：若先改写 ``moved.next``，会丢失原后继；若没有先让 ``current`` 越过 ``moved``，可能形成环。

状态演化
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 轮次
     - 链表局部
     - ``current``
   * - 初始
     - ``1 -> [2 -> 3 -> 4] -> 5``
     - 2
   * - 移动 3
     - ``1 -> [3 -> 2 -> 4] -> 5``
     - 2
   * - 移动 4
     - ``1 -> [4 -> 3 -> 2] -> 5``
     - 2

执行 ``right-left`` 次后，除原首节点外的区间节点都按原顺序依次插到前端，因此完整逆序。

为什么区间外保持不变
~~~~~~~~~~~~~~~~~~~~

``before`` 之前的链接从未修改。每轮 ``current.next=moved.next`` 会保持未处理区间与后缀相接；最后一轮后，``current.next`` 恰好指向原 ``right`` 节点之后的后缀首节点。后缀内部链接从未改变。

节点守恒如何保证
~~~~~~~~~~~~~~~~

每轮只摘除一个已存在节点并重新插入，不创建、复制或删除数据节点。摘除后再插入保证该节点在链中仍只出现一次；所有未移动节点继续保留原链接，因此最终节点集合与输入完全一致。

断开后普通反转与头插的关系
~~~~~~~~~~~~~~~~~~~~~~~~

另一种方法先找出区间后继 ``after``，把 ``after`` 作为普通反转的初始 ``previous``，逐节点反转直到到达 ``after``，最后让 ``before.next`` 指向新头。它的边界更显式；头插法无需单独定位区间后继，只做固定次数局部操作。

为什么最终无环
~~~~~~~~~~~~

一轮中先让 ``current`` 跳过 ``moved``，再让 ``moved`` 指向已反转前缀。已反转前缀最终沿着链接到达 ``current``，而 ``current`` 指向未处理后缀，不会返回前缀中的任何节点，因此不会形成闭环。

复杂度来源
~~~~~~~~~~

定位前驱和执行区间反转总共访问 ``O(n)`` 个节点，时间 ``O(n)``。头插法只保存固定数量节点引用，额外空间 ``O(1)``；节点数组方法使用 ``O(n)`` 空间。

九语言实现
----------

C
~

.. code-block:: c

   struct ListNode*reverseBetween(struct ListNode*head,int left,int right){struct ListNode dummy={0,head},*before=&dummy;for(int p=1;p<left;p++)before=before->next;struct ListNode*current=before->next;for(int step=0;step<right-left;step++){struct ListNode*moved=current->next;current->next=moved->next;moved->next=before->next;before->next=moved;}return dummy.next;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def reverseBetween(self, head, left: int, right: int):
           dummy = ListNode(0, head); before = dummy
           for _ in range(left - 1): before = before.next
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

   class Solution {public ListNode reverseBetween(ListNode head,int left,int right){ListNode dummy=new ListNode(0,head),before=dummy;for(int p=1;p<left;p++)before=before.next;ListNode current=before.next;for(int step=0;step<right-left;step++){ListNode moved=current.next;current.next=moved.next;moved.next=before.next;before.next=moved;}return dummy.next;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn reverse_between(head:Option<Box<ListNode>>,left:i32,right:i32)->Option<Box<ListNode>>{let mut dummy=Box::new(ListNode{val:0,next:head});let mut before=&mut dummy.next;for _ in 1..left{before=&mut before.as_mut().unwrap().next;}let mut reversed=None;for _ in left..=right{let mut node=before.take().unwrap();*before=node.next.take();node.next=reversed;reversed=Some(node);}let mut tail=&mut reversed;while tail.as_ref().unwrap().next.is_some(){tail=&mut tail.as_mut().unwrap().next;}tail.as_mut().unwrap().next=before.take();*before=reversed;dummy.next}}

Go
~~

.. code-block:: go

   func reverseBetween(head *ListNode,left,right int)*ListNode{dummy:=&ListNode{Next:head};before:=dummy;for p:=1;p<left;p++{before=before.Next};current:=before.Next;for step:=0;step<right-left;step++{moved:=current.Next;current.Next=moved.Next;moved.Next=before.Next;before.Next=moved};return dummy.Next}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function reverseBetween(head:ListNode|null,left:number,right:number):ListNode|null{const dummy=new ListNode(0,head);let before=dummy;for(let p=1;p<left;p++)before=before.next!;const current=before.next!;for(let step=0;step<right-left;step++){const moved=current.next!;current.next=moved.next;moved.next=before.next;before.next=moved;}return dummy.next;}

C#
~~

.. code-block:: csharp

   public class Solution {public ListNode ReverseBetween(ListNode head,int left,int right){var dummy=new ListNode(0,head);var before=dummy;for(int p=1;p<left;p++)before=before.next;var current=before.next;for(int step=0;step<right-left;step++){var moved=current.next;current.next=moved.next;moved.next=before.next;before.next=moved;}return dummy.next;}}

Julia
~~~~~

.. code-block:: julia

   function reverse_between(head,left,right)
       dummy=ListNode(0,head);before=dummy
       for _ in 1:left-1;before=before.next;end
       current=before.next
       for _ in 1:right-left;moved=current.next;current.next=moved.next;moved.next=before.next;before.next=moved;end
       dummy.next
   end

R
~

.. code-block:: r

   reverse_between <- function(head,left,right){dummy<-new.env();dummy$val<-0L;dummy$next<-head;before<-dummy;if(left>1L)for(p in 1:(left-1L))before<-before$next;current<-before$next;if(right>left)for(step in seq_len(right-left)){moved<-current$next;current$next<-moved$next;moved$next<-before$next;before$next<-moved};dummy$next}
