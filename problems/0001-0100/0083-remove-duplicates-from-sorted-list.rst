0083. Remove Duplicates from Sorted List
========================================

题目信息
--------

:题号: 0083
:难度: Easy
:主题: 单链表、有序去重、原地断链
:原题: `LeetCode 0083 <https://leetcode.com/problems/remove-duplicates-from-sorted-list/>`_
:访问状态: Available
:教学重点: 每值保留一个、相邻比较、连续删除、节点顺序

题目重述
--------

给定一条按非递减顺序排列的单链表，删除重复节点，使每个不同值只保留第一次出现的节点，并返回头节点。
节点数 ``0..300``，值位于 ``[-100, 100]``。算法重连原节点，不创建结果数据节点。

自建示例
--------

.. code-block:: text

   输入：1 -> 1 -> 2 -> 3 -> 3
   输出：1 -> 2 -> 3

若全部节点值相同，结果只保留原链表的第一个节点。

问题抽象
--------

有序性保证相同值连续。让 ``current`` 指向每个值段的第一个节点：

* 当后继与当前值相同，令 ``current.next = current.next.next``，删除一个重复副本；
* 只要新后继仍相同就继续删除；
* 后继值不同后，当前值段已经压缩为一个节点，再推进到下一值段。

解法选择
--------

主解法单遍重连，时间 ``O(n)``、额外空间 ``O(1)``。使用集合记录已见值需要 ``O(n)`` 空间，也浪费了
输入有序条件。

基础类型约定
------------

``ListNode`` 由平台提供。Julia 使用可变节点，R 使用 ``environment`` 节点。Rust 使用
``Option<Box<ListNode>>``，通过 ``take`` 转移后继所有权并自动释放被删除节点。

主解法：保留每个值段的首节点
----------------------------

核心不变量
~~~~~~~~~~

每轮外层循环开始时：

* 从头到 ``current`` 的链表已经去重且保持原顺序；
* ``current`` 是其值段中保留的第一个原节点；
* ``current.next`` 之后仍是尚未处理的有序后缀。

内层循环删除所有与 ``current.val`` 相同的连续后继。完成后，``current.next`` 为空或指向更大的新值，
推进 ``current`` 后不变量继续成立。

正确性依据
~~~~~~~~~~

**不会重复保留。** 每个值段的第一个节点成为 ``current``，同值后继全部被绕过，因此结果中该值只出现
一次。

**不会遗漏不同值。** 只删除与当前值相同的后继。第一个不同值节点始终保留在 ``current.next``，随后
成为下一轮 ``current``。

**顺序与节点身份保持。** 算法只删除链接，不交换节点。保留节点按原遍历顺序连接，并且都是原链表节点。

**终止性。** 每次内层循环删除一个节点，或外层循环推进到下一个值段；链表有限，所以算法终止。

复杂度
~~~~~~

每个节点只被访问常数次，时间 ``O(n)``；只保存一个当前节点引用，算法额外空间 ``O(1)``。返回结果复用
原节点，不计新的结果节点空间。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stddef.h>

   struct ListNode *deleteDuplicates(struct ListNode *head) {
       struct ListNode *current = head;

       while (current != NULL) {
           while (current->next != NULL &&
                  current->val == current->next->val) {
               current->next = current->next->next;
           }
           current = current->next;
       }
       return head;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       ListNode* deleteDuplicates(ListNode* head) {
           ListNode* current = head;

           while (current != nullptr) {
               while (current->next != nullptr &&
                      current->val == current->next->val) {
                   current->next = current->next->next;
               }
               current = current->next;
           }
           return head;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def deleteDuplicates(
           self,
           head: Optional[ListNode],
       ) -> Optional[ListNode]:
           current = head

           while current is not None:
               while (
                   current.next is not None
                   and current.val == current.next.val
               ):
                   current.next = current.next.next
               current = current.next

           return head

Java
~~~~

.. code-block:: java

   class Solution {
       public ListNode deleteDuplicates(ListNode head) {
           ListNode current = head;

           while (current != null) {
               while (current.next != null &&
                      current.val == current.next.val) {
                   current.next = current.next.next;
               }
               current = current.next;
           }
           return head;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn delete_duplicates(
           mut head: Option<Box<ListNode>>,
       ) -> Option<Box<ListNode>> {
           let mut current = head.as_mut();

           while let Some(node) = current {
               let value = node.val;
               while node
                   .next
                   .as_ref()
                   .map_or(false, |next| next.val == value)
               {
                   let after = node.next.as_mut().unwrap().next.take();
                   node.next = after;
               }
               current = node.next.as_mut();
           }

           head
       }
   }

Go
~~

.. code-block:: go

   func deleteDuplicates(head *ListNode) *ListNode {
       current := head

       for current != nil {
           for current.Next != nil && current.Val == current.Next.Val {
               current.Next = current.Next.Next
           }
           current = current.Next
       }
       return head
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function deleteDuplicates(head: ListNode | null): ListNode | null {
       let current = head;

       while (current !== null) {
           while (current.next !== null && current.val === current.next.val) {
               current.next = current.next.next;
           }
           current = current.next;
       }
       return head;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public ListNode DeleteDuplicates(ListNode head) {
           ListNode current = head;

           while (current != null) {
               while (current.next != null &&
                      current.val == current.next.val) {
                   current.next = current.next.next;
               }
               current = current.next;
           }
           return head;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function delete_duplicates(head::Union{ListNode, Nothing})
       current = head

       while current !== nothing
           while current.next !== nothing &&
                 current.val == current.next.val
               current.next = current.next.next
           end
           current = current.next
       end
       return head
   end

R
~

.. code-block:: r

   delete_duplicates <- function(head) {
     current <- head

     while (!is.null(current)) {
       while (!is.null(current$next) && current$val == current$next$val) {
         current$next <- current$next$next
       }
       current <- current$next
     }
     head
   }

验证计划与证据
--------------

覆盖空链表、单节点、全部唯一、全部相同、多个重复段和负数值。随机生成有序值数组，以连续分组后每组
保留第一个值作为独立基准，并检查结果无环、值序列正确、保留节点身份为每段首节点。

关键边界
--------

* 空链表直接返回；
* 连续三个以上重复节点需要内层循环全部绕过；
* 结果保留每段第一个节点，不是新建节点；
* C/C++ 不负责释放被移出链表的节点。

易错点
------

* 每个值段只删除一个重复节点，留下第三个副本；
* 删除后立即推进 ``current``，没有继续检查新的后继；
* 把本题误写成 0082，连第一个副本也删除；
* 遍历时交换节点，破坏稳定顺序。

本题新增知识
------------

* 用当前节点固定值段首节点，并连续绕过相同后继。

本题强化知识
------------

* 有序链表相邻重复检测；
* 原地断链、节点身份与顺序守恒。

关联题目
--------

* :doc:`0082-remove-duplicates-from-sorted-list-ii`
* :doc:`0026-remove-duplicates-from-sorted-array`

最小自检
--------

#. 为什么删除一个重复后不能立即推进 ``current``？
#. 结果保留每个值段的哪个节点？
#. 为什么相邻比较足够？
#. 本题与 0082 的差异是什么？

答案要点
~~~~~~~~

#. 新后继仍可能与当前值相同。
#. 原值段的第一个节点。
#. 有序性使所有相同值连续。
#. 本题每值保留一个；0082 删除所有出现重复的值。
