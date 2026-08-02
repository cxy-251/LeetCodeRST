0086. Partition List
====================

题目信息
--------

:题号: 0086
:难度: Medium
:主题: 单链表、稳定分区、双链拼接
:原题: `LeetCode 0086 <https://leetcode.com/problems/partition-list/>`_
:重点: 小于 ``x`` 的节点前置、两组内部稳定、完整节点序列、结果拼接

题目重述
--------

给定单链表 ``head`` 和整数 ``x``，重新排列链表，使所有值小于 ``x`` 的节点出现在值大于等于 ``x`` 的节点之前。两个分区内部都必须保持节点在原链表中的相对顺序。

链表节点数在 ``0..200`` 范围内，节点值和 ``x`` 都在 ``-100..100`` 范围内。

自建示例
--------

.. code-block:: text

   输入：5 -> 1 -> 4 -> 2 -> 3，x = 4
   输出：1 -> 2 -> 3 -> 5 -> 4

小于 4 的节点按原顺序形成 ``1,2,3``；其余节点按原顺序形成 ``5,4``。

.. code-block:: text

   输入：1 -> 2，x = 5
   输出：1 -> 2

所有节点都属于前一分区，相对顺序不变。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       ListNode* collectReferences(ListNode* head, int x) {
           std::vector<ListNode*> before, after;
           for (ListNode* node = head; node; node = node->next)
               (node->val < x ? before : after).push_back(node);
           ListNode dummy(0), *tail = &dummy;
           for (ListNode* node : before) { tail->next = node; tail = node; }
           for (ListNode* node : after) { tail->next = node; tail = node; }
           tail->next = nullptr;
           return dummy.next;
       }

       ListNode* stableTwoLists(ListNode* head, int x) {
           ListNode before_dummy(0), after_dummy(0);
           ListNode* before_tail = &before_dummy;
           ListNode* after_tail = &after_dummy;
           while (head) {
               ListNode* next = head->next;
               head->next = nullptr;
               if (head->val < x) {
                   before_tail->next = head;
                   before_tail = head;
               } else {
                   after_tail->next = head;
                   after_tail = head;
               }
               head = next;
           }
           before_tail->next = after_dummy.next;
           return before_dummy.next;
       }

   public:
       ListNode* partition(ListNode* head, int x) {
           return stableTwoLists(head, x);
       }
   };

题解
----

为什么交换值不是正确模型
~~~~~~~~~~~~~~~~~~~~~~

题目要求稳定分区：每个分区内部的节点顺序必须与原链表一致。交换数值会改变节点承载的数据身份，也难以保证稳定性。更自然的做法是按原遍历顺序把节点追加到两条链。

两条链分别保存什么
~~~~~~~~~~~~~~~~

``before`` 保存已扫描节点中值小于 ``x`` 的节点，``after`` 保存其余节点。每条链只在尾部追加，因此同一分区中的节点顺序自动保持。

为什么先保存 next 再断链
~~~~~~~~~~~~~~~~~~~~~~

当前节点的旧 ``next`` 仍指向原链表后缀，其中可能混合两个分区。若直接尾插而不断开，临时链会携带未分类后缀，最终拼接时可能出现错误跨边或环。因此处理顺序必须是：

.. code-block:: text

   next = current.next
   current.next = null
   append current
   current = next

状态跟踪
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 读取节点
     - before
     - after
   * - 5
     - 空
     - ``5``
   * - 1
     - 空
     - ``5``
   * - 4
     - ``1``
     - ``5 -> 4``
   * - 2
     - ``1 -> 2``
     - ``5 -> 4``
   * - 3
     - ``1 -> 2 -> 3``
     - ``5 -> 4``

为什么最终只需一次拼接
~~~~~~~~~~~~~~~~~~~~~~

扫描结束后，两条链已经分别稳定且正确以空链接结尾。令 ``before_tail.next = after_head`` 即可形成完整结果；若 ``before`` 为空，哨兵的 ``next`` 会直接指向 ``after``，无需特殊分支。

节点守恒如何保证
~~~~~~~~~~~~~~~~

每个原节点恰好被扫描一次，并根据 ``val < x`` 的互斥条件进入一条链。没有节点被复制、删除或重复追加。最终两链拼接后，结果包含全部原节点且仅包含一次。

为什么分区内部顺序稳定
~~~~~~~~~~~~~~~~~~~~~~

原链表按从左到右顺序扫描，两个尾指针也按同一时间顺序追加各自满足条件的节点。任意两个同分区节点的先后关系不会改变。

复杂度来源
~~~~~~~~~~

每个节点处理一次，时间 ``O(n)``。双链方法只使用两个哨兵和尾指针，额外空间 ``O(1)``；引用数组方法需要 ``O(n)``。

九语言实现
----------

C
~

.. code-block:: c

   struct ListNode*partition(struct ListNode*head,int x){struct ListNode before={0,NULL},after={0,NULL},*bt=&before,*at=&after;while(head){struct ListNode*next=head->next;head->next=NULL;if(head->val<x){bt->next=head;bt=head;}else{at->next=head;at=head;}head=next;}bt->next=after.next;return before.next;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def partition(self, head, x):
           before=ListNode();after=ListNode();bt,at=before,after
           while head:
               nxt=head.next;head.next=None
               if head.val<x:bt.next=head;bt=head
               else:at.next=head;at=head
               head=nxt
           bt.next=after.next
           return before.next

Java
~~~~

.. code-block:: java

   class Solution {public ListNode partition(ListNode head,int x){ListNode before=new ListNode(),after=new ListNode(),bt=before,at=after;while(head!=null){ListNode next=head.next;head.next=null;if(head.val<x){bt.next=head;bt=head;}else{at.next=head;at=head;}head=next;}bt.next=after.next;return before.next;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn partition(mut head:Option<Box<ListNode>>,x:i32)->Option<Box<ListNode>>{let mut before=Box::new(ListNode::new(0));let mut after=Box::new(ListNode::new(0));let mut bt=&mut before.next;let mut at=&mut after.next;while let Some(mut node)=head{head=node.next.take();if node.val<x{*bt=Some(node);bt=&mut bt.as_mut().unwrap().next;}else{*at=Some(node);at=&mut at.as_mut().unwrap().next;}}*bt=after.next;before.next}}

Go
~~

.. code-block:: go

   func partition(head *ListNode,x int)*ListNode{before,after:=&ListNode{},&ListNode{};bt,at:=before,after;for head!=nil{next:=head.Next;head.Next=nil;if head.Val<x{bt.Next=head;bt=head}else{at.Next=head;at=head};head=next};bt.Next=after.Next;return before.Next}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function partition(head:ListNode|null,x:number):ListNode|null{const before=new ListNode(),after=new ListNode();let bt=before,at=after;while(head){const next=head.next;head.next=null;if(head.val<x){bt.next=head;bt=head;}else{at.next=head;at=head;}head=next;}bt.next=after.next;return before.next;}

C#
~~

.. code-block:: csharp

   public class Solution {public ListNode Partition(ListNode head,int x){var before=new ListNode();var after=new ListNode();var bt=before;var at=after;while(head!=null){var next=head.next;head.next=null;if(head.val<x){bt.next=head;bt=head;}else{at.next=head;at=head;}head=next;}bt.next=after.next;return before.next;}}

Julia
~~~~~

.. code-block:: julia

   function partition_list(head,x)
       before=ListNode(0,nothing);after=ListNode(0,nothing);bt=before;at=after
       while head!==nothing
           next=head.next;head.next=nothing
           if head.val<x;bt.next=head;bt=head;else;at.next=head;at=head;end
           head=next
       end;bt.next=after.next;before.next
   end

R
~

.. code-block:: r

   partition_list <- function(head,x){before<-new.env(parent=emptyenv());after<-new.env(parent=emptyenv());before$next<-NULL;after$next<-NULL;bt<-before;at<-after;while(!is.null(head)){next_node<-head$next;head$next<-NULL;if(head$val<x){bt$next<-head;bt<-head}else{at$next<-head;at<-head};head<-next_node};bt$next<-after$next;before$next}
