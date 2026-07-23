0082. Remove Duplicates from Sorted List II
===========================================

题目信息
--------

:题号: 0082
:难度: Medium
:主题: 单链表、哨兵节点、有序重复段、原地重连
:原题: `LeetCode 0082 <https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/>`_
:教学重点: 删除整个重复段、前驱保持、头部统一处理、节点身份

题目重述
--------

给定非递减单链表，删除所有出现次数大于 1 的值对应的全部节点，只保留原链表中出现恰好一次的节点。主实现复用原节点；C 与 C++ 不负责释放被移出结果链的节点。

自建示例
--------

.. code-block:: text

   1 -> 2 -> 3 -> 3 -> 4 -> 4 -> 5
   结果：1 -> 2 -> 5

   1 -> 1 -> 1 -> 2 -> 3
   结果：2 -> 3

   1 -> 1
   结果：空链表

C++ 实现
--------

.. code-block:: cpp

   #include <unordered_map>

   class Solution {
   private:
       ListNode* countAndRelink(ListNode* head) {
           std::unordered_map<int,int> count;
           for (ListNode* node = head; node; node = node->next) ++count[node->val];
           ListNode dummy(0), *tail = &dummy;
           for (ListNode* node = head; node; ) {
               ListNode* next = node->next;
               if (count[node->val] == 1) { tail->next = node; tail = node; tail->next = nullptr; }
               node = next;
           }
           return dummy.next;
       }

       ListNode* recursiveSkip(ListNode* head) {
           if (!head || !head->next) return head;
           if (head->val != head->next->val) {
               head->next = recursiveSkip(head->next);
               return head;
           }
           int value = head->val;
           while (head && head->val == value) head = head->next;
           return recursiveSkip(head);
       }

       ListNode* sentinelScan(ListNode* head) {
           ListNode dummy(0, head);
           ListNode* previous = &dummy;
           ListNode* current = head;
           while (current) {
               if (current->next && current->val == current->next->val) {
                   int value = current->val;
                   while (current && current->val == value) current = current->next;
                   previous->next = current;
               } else {
                   previous = current;
                   current = current->next;
               }
           }
           return dummy.next;
       }

   public:
       ListNode* deleteDuplicates(ListNode* head) {
           return sentinelScan(head);
       }
   };

题解
----

有序性把重复值变成什么
~~~~~~~~~~~~~~~~~~~~

相同值必然形成连续段。扫描到 ``current`` 时，只需比较它和后继：不同表示当前段长度为 1；相同表示进入重复段，可以保存该值并一次越过全部同值节点。

为什么需要哨兵节点
~~~~~~~~~~~~~~~~~~

重复段可能从头节点开始。若直接维护 ``head``，删除头部时需要特殊分支。令 ``dummy.next = head`` 后，所有删除都统一为 ``previous.next = current``，即使结果头发生变化也无需改写流程。

前驱为什么不能进入重复段
~~~~~~~~~~~~~~~~~~~~~~~~

``previous`` 始终指向结果有效前缀的最后节点。若发现重复后仍把它推进到段内，就失去了重复段之前的链接位置，无法把整个段一次绕过。只有确认当前节点唯一时，前驱才推进到它。

.. list-table::
   :header-rows: 1

   * - 未处理后缀
     - previous
     - 动作
   * - ``1,2,3,3,4,4,5``
     - dummy
     - 1 唯一，前驱推进到 1
   * - ``2,3,3,4,4,5``
     - 1
     - 2 唯一，前驱推进到 2
   * - ``3,3,4,4,5``
     - 2
     - 越过全部 3，连接到 4
   * - ``4,4,5``
     - 2
     - 越过全部 4，连接到 5
   * - ``5``
     - 2
     - 5 唯一，保留

如何确认当前节点唯一
~~~~~~~~~~~~~~~~~~~~

由于链表有序，若 ``current`` 与后继值不同，当前值不可能在更后方再次出现；它所在的连续值段只有一个节点，可以安全保留。空后继同样表示尾节点唯一。

递归方法与迭代方法的关系
~~~~~~~~~~~~~~~~~~~~~~~~

递归方法也把链表按值段分类：唯一段保留头节点并递归处理后缀；重复段先跳到下一不同值再递归。它更短，但使用 ``O(n)`` 调用栈；哨兵迭代保持 ``O(1)`` 工作空间。

节点与资源关系
~~~~~~~~~~~~~~

主实现只修改 ``next``，保留节点的身份和相对顺序。C/C++ 平台通常由评测器管理输入节点，被绕过节点不在函数内释放；拥有所有权的语言可在链接被丢弃时自动回收。

为什么结果恰好保留出现一次的值
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

每个连续值段被完整分类一次。长度为 1 的段使前驱进入该节点；长度大于 1 的段被前驱整段绕过。因此每个出现一次的值保留一个原节点，每个重复值不留下任何节点。

复杂度来源
~~~~~~~~~~

每个节点最多被扫描常数次，时间 ``O(n)``。哨兵迭代额外空间 ``O(1)``；哈希方法 ``O(n)`` 空间，递归方法 ``O(n)`` 栈。

九语言实现
----------

C
~

.. code-block:: c

   struct ListNode*deleteDuplicates(struct ListNode*head){struct ListNode dummy={0,head},*prev=&dummy,*cur=head;while(cur){if(cur->next&&cur->val==cur->next->val){int v=cur->val;while(cur&&cur->val==v)cur=cur->next;prev->next=cur;}else{prev=cur;cur=cur->next;}}return dummy.next;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def deleteDuplicates(self, head):
           dummy=ListNode(0,head);previous=dummy;current=head
           while current:
               if current.next and current.val==current.next.val:
                   value=current.val
                   while current and current.val==value:current=current.next
                   previous.next=current
               else:previous=current;current=current.next
           return dummy.next

Java
~~~~

.. code-block:: java

   class Solution {public ListNode deleteDuplicates(ListNode head){ListNode dummy=new ListNode(0,head),prev=dummy,cur=head;while(cur!=null){if(cur.next!=null&&cur.val==cur.next.val){int v=cur.val;while(cur!=null&&cur.val==v)cur=cur.next;prev.next=cur;}else{prev=cur;cur=cur.next;}}return dummy.next;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn delete_duplicates(head:Option<Box<ListNode>>)->Option<Box<ListNode>>{match head{None=>None,Some(mut node)=>{if node.next.as_ref().map_or(false,|n|n.val==node.val){let value=node.val;let mut rest=node.next.take();while let Some(mut next)=rest{if next.val!=value{return Self::delete_duplicates(Some(next))}rest=next.next.take()}None}else{node.next=Self::delete_duplicates(node.next.take());Some(node)}}}}}

Go
~~

.. code-block:: go

   func deleteDuplicates(head *ListNode)*ListNode{dummy:=&ListNode{Next:head};prev,cur:=dummy,head;for cur!=nil{if cur.Next!=nil&&cur.Val==cur.Next.Val{v:=cur.Val;for cur!=nil&&cur.Val==v{cur=cur.Next};prev.Next=cur}else{prev=cur;cur=cur.Next}};return dummy.Next}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function deleteDuplicates(head:ListNode|null):ListNode|null{const dummy=new ListNode(0,head);let previous=dummy,current=head;while(current){if(current.next&&current.val===current.next.val){const value=current.val;while(current&&current.val===value)current=current.next;previous.next=current;}else{previous=current;current=current.next;}}return dummy.next;}

C#
~~

.. code-block:: csharp

   public class Solution {public ListNode DeleteDuplicates(ListNode head){var dummy=new ListNode(0,head);var prev=dummy;var cur=head;while(cur!=null){if(cur.next!=null&&cur.val==cur.next.val){int v=cur.val;while(cur!=null&&cur.val==v)cur=cur.next;prev.next=cur;}else{prev=cur;cur=cur.next;}}return dummy.next;}}

Julia
~~~~~

.. code-block:: julia

   function delete_duplicates(head)
       dummy=ListNode(0,head);previous=dummy;current=head
       while current!==nothing
           if current.next!==nothing&&current.val==current.next.val
               value=current.val
               while current!==nothing&&current.val==value;current=current.next;end
               previous.next=current
           else;previous=current;current=current.next;end
       end;dummy.next
   end

R
~

.. code-block:: r

   delete_duplicates_all <- function(head){dummy<-new.env(parent=emptyenv());dummy$next<-head;previous<-dummy;current<-head;while(!is.null(current)){if(!is.null(current$next)&&current$val==current$next$val){value<-current$val;while(!is.null(current)&&current$val==value)current<-current$next;previous$next<-current}else{previous<-current;current<-current$next}};dummy$next}
