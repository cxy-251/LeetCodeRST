0147. Insertion Sort List
=========================

题目信息
--------

:题号: 0147
:难度: Medium
:主题: 链表、插入排序、哨兵节点、稳定重连
:原题: `LeetCode 0147 <https://leetcode.com/problems/insertion-sort-list/>`_
:重点: 有序前缀、节点摘除、插入位置、链表重连

题目重述
--------

给定单链表的头节点 ``head``，使用插入排序将链表按节点值从小到大排序，并返回排序后的头节点。插入排序每次从未排序部分取出一个节点，把它插入前面已经有序部分的合适位置。

自建示例
--------

.. code-block:: text

   输入：4 -> 2 -> 1 -> 3 -> 2
   输出：1 -> 2 -> 2 -> 3 -> 4

   输入：-1 -> 5 -> 3 -> 4 -> 0
   输出：-1 -> 0 -> 3 -> 4 -> 5

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   private:
       ListNode* plainInsertion(ListNode* head) {
           ListNode dummy(0);
           while (head) {
               ListNode* current = head;
               head = head->next;
               ListNode* previous = &dummy;
               while (previous->next && previous->next->val <= current->val)
                   previous = previous->next;
               current->next = previous->next;
               previous->next = current;
           }
           return dummy.next;
       }

       ListNode* sortedPrefix(ListNode* head) {
           if (!head) return nullptr;
           ListNode dummy(0);
           dummy.next = head;
           ListNode* last_sorted = head;
           ListNode* current = head->next;
           while (current) {
               if (last_sorted->val <= current->val) {
                   last_sorted = current;
               } else {
                   ListNode* previous = &dummy;
                   while (previous->next->val <= current->val)
                       previous = previous->next;
                   last_sorted->next = current->next;
                   current->next = previous->next;
                   previous->next = current;
               }
               current = last_sorted->next;
           }
           return dummy.next;
       }

   public:
       ListNode* insertionSortList(ListNode* head) {
           return sortedPrefix(head);
       }
   };

题解
----

有序前缀不变量
~~~~~~~~~~~~~~

``dummy.next`` 到 ``last_sorted`` 始终是稳定非递减链；``current = last_sorted.next`` 是下一个未处理节点，其后的链保持输入顺序。

何时可以直接扩张前缀
~~~~~~~~~~~~~~~~~~~~

若 ``last_sorted.val <= current.val``，当前节点已经不小于前缀最大值，无需移动，只把 ``last_sorted`` 前进一步。

逆序节点如何插入
~~~~~~~~~~~~~~~

先令 ``last_sorted.next = current.next`` 把当前节点从原位置摘下；再从哨兵开始寻找最后一个值 ``<= current.val`` 的节点，把当前节点插到其后。使用 ``<=`` 而不是 ``<``，使新节点位于已有同值节点之后，保持稳定性。

为什么不会丢节点或成环
~~~~~~~~~~~~~~~~~~~~~~

摘除前保存的后继仍由 ``last_sorted.next`` 指向；插入只让当前节点连接到有序前缀中的原后继。每轮移动同一个现有节点，不复制、不释放，也不会让任何节点同时属于两个位置。

复杂度来源
~~~~~~~~~~

最坏逆序输入中，第 ``i`` 个节点要扫描长度 ``i`` 的前缀，时间 ``O(n²)``；指针版额外空间 ``O(1)``。

九语言实现
----------

C
~

.. code-block:: c

   struct ListNode*insertionSortList(struct ListNode*head){if(!head)return NULL;struct ListNode dummy={0,head},*last=head,*cur=head->next;while(cur){if(last->val<=cur->val)last=cur;else{struct ListNode*prev=&dummy;while(prev->next->val<=cur->val)prev=prev->next;last->next=cur->next;cur->next=prev->next;prev->next=cur;}cur=last->next;}return dummy.next;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def insertionSortList(self, head):
           if not head: return None
           dummy=ListNode(0,head);last=head;cur=head.next
           while cur:
               if last.val<=cur.val: last=cur
               else:
                   prev=dummy
                   while prev.next.val<=cur.val: prev=prev.next
                   last.next=cur.next;cur.next=prev.next;prev.next=cur
               cur=last.next
           return dummy.next

Java
~~~~

.. code-block:: java

   class Solution {public ListNode insertionSortList(ListNode head){if(head==null)return null;ListNode dummy=new ListNode(0,head),last=head,cur=head.next;while(cur!=null){if(last.val<=cur.val)last=cur;else{ListNode prev=dummy;while(prev.next.val<=cur.val)prev=prev.next;last.next=cur.next;cur.next=prev.next;prev.next=cur;}cur=last.next;}return dummy.next;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn insertion_sort_list(head:Option<Box<ListNode>>)->Option<Box<ListNode>>{let mut nodes=vec![];let mut cur=head;while let Some(mut node)=cur{cur=node.next.take();nodes.push(node)}for i in 1..nodes.len(){let mut j=i;while j>0&&nodes[j-1].val>nodes[j].val{nodes.swap(j-1,j);j-=1}}let mut out=None;for mut node in nodes.into_iter().rev(){node.next=out;out=Some(node)}out}}

Go
~~

.. code-block:: go

   func insertionSortList(head *ListNode)*ListNode{if head==nil{return nil};dummy:=&ListNode{Next:head};last,cur:=head,head.Next;for cur!=nil{if last.Val<=cur.Val{last=cur}else{prev:=dummy;for prev.Next.Val<=cur.Val{prev=prev.Next};last.Next=cur.Next;cur.Next=prev.Next;prev.Next=cur};cur=last.Next};return dummy.Next}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function insertionSortList(head:ListNode|null):ListNode|null{if(!head)return null;const dummy=new ListNode(0,head);let last=head,cur=head.next;while(cur){if(last.val<=cur.val)last=cur;else{let prev=dummy;while(prev.next!.val<=cur.val)prev=prev.next!;last.next=cur.next;cur.next=prev.next;prev.next=cur;}cur=last.next;}return dummy.next;}

C#
~~

.. code-block:: csharp

   public class Solution {public ListNode InsertionSortList(ListNode head){if(head==null)return null;var dummy=new ListNode(0,head);var last=head;var cur=head.next;while(cur!=null){if(last.val<=cur.val)last=cur;else{var prev=dummy;while(prev.next.val<=cur.val)prev=prev.next;last.next=cur.next;cur.next=prev.next;prev.next=cur;}cur=last.next;}return dummy.next;}}

Julia
~~~~~

.. code-block:: julia

   function insertion_sort_list(head)
       head===nothing&&return nothing;dummy=ListNode(0,head);last=head;cur=head.next
       while cur!==nothing
           if last.val<=cur.val;last=cur
           else;prev=dummy;while prev.next.val<=cur.val;prev=prev.next;end;last.next=cur.next;cur.next=prev.next;prev.next=cur;end
           cur=last.next
       end
       dummy.next
   end

R
~

.. code-block:: r

   insertion_sort_list <- function(head){if(is.null(head))return(NULL);dummy<-new.env();dummy$next<-head;last<-head;cur<-head$next;while(!is.null(cur)){if(last$val<=cur$val)last<-cur else{prev<-dummy;while(prev$next$val<=cur$val)prev<-prev$next;last$next<-cur$next;cur$next<-prev$next;prev$next<-cur};cur<-last$next};dummy$next}