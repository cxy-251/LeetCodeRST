0083. Remove Duplicates from Sorted List
========================================

题目信息
--------

:题号: 0083
:难度: Easy
:主题: 单链表、有序去重、原地断链
:原题: `LeetCode 0083 <https://leetcode.com/problems/remove-duplicates-from-sorted-list/>`_
:教学重点: 每值保留一次、值段代表、连续删除、节点顺序

题目重述
--------

给定非递减单链表，删除重复节点，使每个不同值只保留第一次出现的原节点。返回原地重连后的头节点；空链表直接返回空。

自建示例
--------

.. code-block:: text

   1 -> 1 -> 2 -> 3 -> 3
   结果：1 -> 2 -> 3

   4 -> 4 -> 4
   结果：4

C++ 实现
--------

.. code-block:: cpp

   #include <unordered_set>

   class Solution {
   private:
       ListNode* setBased(ListNode* head) {
           std::unordered_set<int> seen;
           ListNode dummy(0), *tail = &dummy;
           for (ListNode* node = head; node; ) {
               ListNode* next = node->next;
               if (seen.insert(node->val).second) {
                   tail->next = node;
                   tail = node;
                   tail->next = nullptr;
               }
               node = next;
           }
           return dummy.next;
       }

       ListNode* recursiveCompress(ListNode* head) {
           if (!head) return nullptr;
           head->next = recursiveCompress(head->next);
           while (head->next && head->next->val == head->val)
               head->next = head->next->next;
           return head;
       }

       ListNode* adjacentScan(ListNode* head) {
           ListNode* current = head;
           while (current) {
               while (current->next && current->next->val == current->val)
                   current->next = current->next->next;
               current = current->next;
           }
           return head;
       }

   public:
       ListNode* deleteDuplicates(ListNode* head) {
           return adjacentScan(head);
       }
   };

题解
----

有序性如何定义值段
~~~~~~~~~~~~~~~~

相同值连续出现，因此链表可视为若干连续值段。每段的第一个节点作为该值唯一代表；段内其余节点全部删除，随后进入更大的下一值段。

current 保存什么
~~~~~~~~~~~~~~~~

每轮外层循环开始时，``current`` 指向当前值段保留的第一个节点。从头到 ``current`` 的结果前缀已经去重且顺序正确；``current.next`` 开始仍是未压缩后缀。

为什么必须连续删除后继
~~~~~~~~~~~~~~~~~~~~

删除一个同值后继后，新 ``current.next`` 可能仍然同值，因此需要内层循环持续执行：

.. code-block:: text

   current.next = current.next.next

直到后继为空或值不同，当前段才真正压缩为一个节点。

.. list-table::
   :header-rows: 1

   * - current
     - 后继
     - 动作
   * - 第一个 1
     - 第二个 1
     - 绕过第二个 1
   * - 第一个 1
     - 2
     - 当前段完成，推进到 2
   * - 2
     - 第一个 3
     - 2 段长度为 1，推进
   * - 第一个 3
     - 第二个 3
     - 绕过第二个 3

为什么不同值不会被误删
~~~~~~~~~~~~~~~~~~~~~~

删除条件要求后继值与 ``current.val`` 完全相同。遇到第一个更大值时内层循环停止，该节点仍保留在 ``current.next``，随后成为下一轮值段代表。

为何不需要哨兵节点
~~~~~~~~~~~~~~~~~~

本题永远保留头部值段的第一个节点，结果头不会因为去重而改变。第 82 题可能删除整个头部重复段，所以需要哨兵；本题只修改保留节点的后继链接即可。

递归方法的取舍
~~~~~~~~~~~~~~

递归先压缩后缀，再消除头节点后的同值节点，语义直接，但调用栈为 ``O(n)``。迭代方法只保存一个节点引用，更符合本题常数空间目标。

节点身份为何保持
~~~~~~~~~~~~~~~~

算法不交换数值，也不新建结果数据节点。每个值保留原链表中最先出现的节点，结果中的节点相对顺序与输入一致。

为什么最终每值恰好一次
~~~~~~~~~~~~~~~~~~~~~~

每个值段的首节点从不被删除，段内其余节点都被连续绕过。各值段按原顺序依次处理，因此每个输入不同值恰好留下一个节点。

复杂度来源
~~~~~~~~~~

每个节点被访问或删除一次，时间 ``O(n)``。迭代主解法额外空间 ``O(1)``；集合方法 ``O(n)``，递归方法使用 ``O(n)`` 栈。

九语言实现
----------

C
~

.. code-block:: c

   struct ListNode*deleteDuplicates(struct ListNode*head){for(struct ListNode*cur=head;cur;cur=cur->next)while(cur->next&&cur->next->val==cur->val)cur->next=cur->next->next;return head;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def deleteDuplicates(self, head):
           current=head
           while current:
               while current.next and current.next.val==current.val:current.next=current.next.next
               current=current.next
           return head

Java
~~~~

.. code-block:: java

   class Solution {public ListNode deleteDuplicates(ListNode head){for(ListNode cur=head;cur!=null;cur=cur.next)while(cur.next!=null&&cur.next.val==cur.val)cur.next=cur.next.next;return head;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn delete_duplicates(mut head:Option<Box<ListNode>>)->Option<Box<ListNode>>{let mut cur=head.as_mut();while let Some(node)=cur{while node.next.as_ref().map_or(false,|next|next.val==node.val){let next_next=node.next.as_mut().unwrap().next.take();node.next=next_next;}cur=node.next.as_mut();}head}}

Go
~~

.. code-block:: go

   func deleteDuplicates(head *ListNode)*ListNode{for cur:=head;cur!=nil;cur=cur.Next{for cur.Next!=nil&&cur.Next.Val==cur.Val{cur.Next=cur.Next.Next}};return head}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function deleteDuplicates(head:ListNode|null):ListNode|null{for(let current=head;current;current=current.next)while(current.next&&current.next.val===current.val)current.next=current.next.next;return head;}

C#
~~

.. code-block:: csharp

   public class Solution {public ListNode DeleteDuplicates(ListNode head){for(var current=head;current!=null;current=current.next)while(current.next!=null&&current.next.val==current.val)current.next=current.next.next;return head;}}

Julia
~~~~~

.. code-block:: julia

   function delete_duplicates_once(head)
       current=head
       while current!==nothing
           while current.next!==nothing&&current.next.val==current.val;current.next=current.next.next;end
           current=current.next
       end;head
   end

R
~

.. code-block:: r

   delete_duplicates_once <- function(head){current<-head;while(!is.null(current)){while(!is.null(current$next)&&current$next$val==current$val)current$next<-current$next$next;current<-current$next};head}
