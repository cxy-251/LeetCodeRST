0082. Remove Duplicates from Sorted List II
===========================================

题目信息
--------

:题号: 0082
:难度: Medium
:主题: 单链表、哨兵节点、有序重复区间、断链
:原题: `LeetCode 0082 <https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/>`_
:访问状态: Available
:教学重点: 删除整个重复段、前驱链接、头部统一处理、节点身份

题目重述
--------

给定一条按非递减顺序排列的单链表，删除所有出现次数大于一的数值对应节点，只保留原链表中出现
恰好一次的节点，并返回结果头节点。

题目保证节点数 ``0..300``，节点值位于 ``[-100, 100]``。主实现重连原节点，不复制数据节点；C 与
C++ 不负责释放被移出结果链表的节点。

自建示例
--------

中间和尾部重复段
~~~~~~~~~~~~~~~~

.. code-block:: text

   输入：1 -> 2 -> 3 -> 3 -> 4 -> 4 -> 5
   输出：1 -> 2 -> 5

头部重复段
~~~~~~~~~~

.. code-block:: text

   输入：1 -> 1 -> 1 -> 2 -> 3
   输出：2 -> 3

问题抽象
--------

有序性保证相同值形成连续区间。扫描到 ``current`` 时，只需比较它与后继：

* 若值不同，``current`` 是唯一节点，可以把前驱推进到它；
* 若值相同，记录该值并越过整个连续重复段，再让前驱直接连接到第一个不同值节点；
* 重复段可能从头节点开始，因此使用哨兵节点把“修改头指针”统一为普通的 ``previous.next`` 更新。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 定位
   * - 哨兵节点与重复段跳过
     - ``O(n)``
     - ``O(1)``
     - 主解法；每个节点只访问常数次
   * - 哈希表统计后重建
     - ``O(n)``
     - ``O(n)``
     - 忽略输入有序性

基础类型约定
------------

``ListNode`` 由平台提供，包含 ``val`` 与 ``next``。Julia 使用仓库的可变 ``ListNode``，R 使用
``environment`` 节点。Rust 平台类型为 ``Option<Box<ListNode>>``，实现通过可变链接位置和 ``take``
转移所有权，不使用 ``unsafe``。

主解法：哨兵节点跳过整个重复段
------------------------------

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

创建 ``dummy.next = head``，维护：

* ``previous`` 指向结果有效前缀的最后节点，初始为哨兵；
* ``current`` 指向尚未分类的第一个节点；
* ``dummy.next`` 到 ``previous`` 只包含原链表中已经确认唯一的节点；
* ``previous.next == current``，结果前缀与未处理后缀始终相接。

若 ``current.val == current.next.val``，保存重复值 ``value``，持续前进直到节点为空或值不再等于
``value``，随后令 ``previous.next = current``。前驱不能进入重复段，否则无法一次删除整个区间。

正确性依据
~~~~~~~~~~

**唯一节点保留正确。** 当前值与后继不同。由于相同值连续，当前节点所在值段长度为一，可以安全保留并
推进前驱。

**重复节点删除完整。** 当前值与后继相同，循环会越过所有且只越过该值的连续节点。把前驱链接到首个
不同值节点后，该重复值在结果中不留下任何副本。

**头部处理统一。** 哨兵位于真实头节点之前。首个值段重复时，更新 ``dummy.next`` 即可得到新头，无需
为头部编写独立分支。

**完整性与终止性。** 每轮至少越过一个节点，每个连续值段恰好分类一次。扫描结束后，所有唯一值段被
保留，所有重复值段被完全删除。

复杂度
~~~~~~

链表长度为 ``n``。每个节点最多被扫描常数次，时间 ``O(n)``；只保存哨兵、前驱、当前节点和重复值，
算法额外空间 ``O(1)``。返回链表复用原节点，不产生结果节点复制。

核心语言实现
------------

以下代码复用平台 ``ListNode`` 类型。

C
~

.. code-block:: c

   #include <stddef.h>

   struct ListNode *deleteDuplicates(struct ListNode *head) {
       struct ListNode dummy = {0, head};
       struct ListNode *previous = &dummy;
       struct ListNode *current = head;

       while (current != NULL) {
           if (current->next != NULL &&
               current->val == current->next->val) {
               const int value = current->val;
               while (current != NULL && current->val == value) {
                   current = current->next;
               }
               previous->next = current;
           } else {
               previous = current;
               current = current->next;
           }
       }
       return dummy.next;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       ListNode* deleteDuplicates(ListNode* head) {
           ListNode dummy(0, head);
           ListNode* previous = &dummy;
           ListNode* current = head;

           while (current != nullptr) {
               if (current->next != nullptr &&
                   current->val == current->next->val) {
                   const int value = current->val;
                   while (current != nullptr && current->val == value) {
                       current = current->next;
                   }
                   previous->next = current;
               } else {
                   previous = current;
                   current = current->next;
               }
           }
           return dummy.next;
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
           dummy = ListNode(0, head)
           previous = dummy
           current = head

           while current is not None:
               if (
                   current.next is not None
                   and current.val == current.next.val
               ):
                   value = current.val
                   while current is not None and current.val == value:
                       current = current.next
                   previous.next = current
               else:
                   previous = current
                   current = current.next

           return dummy.next

Java
~~~~

.. code-block:: java

   class Solution {
       public ListNode deleteDuplicates(ListNode head) {
           ListNode dummy = new ListNode(0, head);
           ListNode previous = dummy;
           ListNode current = head;

           while (current != null) {
               if (current.next != null && current.val == current.next.val) {
                   int value = current.val;
                   while (current != null && current.val == value) {
                       current = current.next;
                   }
                   previous.next = current;
               } else {
                   previous = current;
                   current = current.next;
               }
           }
           return dummy.next;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn delete_duplicates(
           head: Option<Box<ListNode>>,
       ) -> Option<Box<ListNode>> {
           let mut dummy = Box::new(ListNode { val: 0, next: head });
           let mut link = &mut dummy.next;

           while link.is_some() {
               let value = link.as_ref().unwrap().val;
               let duplicated = link
                   .as_ref()
                   .unwrap()
                   .next
                   .as_ref()
                   .map_or(false, |next| next.val == value);

               if duplicated {
                   while link
                       .as_ref()
                       .map_or(false, |node| node.val == value)
                   {
                       let next = link.as_mut().unwrap().next.take();
                       *link = next;
                   }
               } else {
                   link = &mut link.as_mut().unwrap().next;
               }
           }

           dummy.next
       }
   }

``link`` 表示“指向当前节点的所有权槽位”。重复时不断把槽位替换为后继；唯一时把槽位推进到
``current.next``。所有被跳过的 ``Box`` 在离开作用域时自动释放。

Go
~~

.. code-block:: go

   func deleteDuplicates(head *ListNode) *ListNode {
       dummy := &ListNode{Next: head}
       previous := dummy
       current := head

       for current != nil {
           if current.Next != nil && current.Val == current.Next.Val {
               value := current.Val
               for current != nil && current.Val == value {
                   current = current.Next
               }
               previous.Next = current
           } else {
               previous = current
               current = current.Next
           }
       }
       return dummy.Next
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function deleteDuplicates(head: ListNode | null): ListNode | null {
       const dummy = new ListNode(0, head);
       let previous: ListNode = dummy;
       let current: ListNode | null = head;

       while (current !== null) {
           if (current.next !== null && current.val === current.next.val) {
               const value = current.val;
               while (current !== null && current.val === value) {
                   current = current.next;
               }
               previous.next = current;
           } else {
               previous = current;
               current = current.next;
           }
       }
       return dummy.next;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public ListNode DeleteDuplicates(ListNode head) {
           ListNode dummy = new ListNode(0, head);
           ListNode previous = dummy;
           ListNode current = head;

           while (current != null) {
               if (current.next != null && current.val == current.next.val) {
                   int value = current.val;
                   while (current != null && current.val == value) {
                       current = current.next;
                   }
                   previous.next = current;
               } else {
                   previous = current;
                   current = current.next;
               }
           }
           return dummy.next;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function delete_duplicates_all(head::Union{ListNode, Nothing})
       dummy = ListNode(0, head)
       previous = dummy
       current = head

       while current !== nothing
           if current.next !== nothing && current.val == current.next.val
               value = current.val
               while current !== nothing && current.val == value
                   current = current.next
               end
               previous.next = current
           else
               previous = current
               current = current.next
           end
       end
       return dummy.next
   end

R
~

.. code-block:: r

   delete_duplicates_all <- function(head) {
     dummy <- new_list_node(0L, head)
     previous <- dummy
     current <- head

     while (!is.null(current)) {
       if (!is.null(current$next) && current$val == current$next$val) {
         value <- current$val
         while (!is.null(current) && current$val == value) {
           current <- current$next
         }
         previous$next <- current
       } else {
         previous <- current
         current <- current$next
       }
     }
     dummy$next
   }

验证计划与证据
--------------

覆盖空链表、单节点、全部唯一、全部重复、头部重复、中间重复、尾部重复和多个相邻重复段。随机生成
有序值数组，以分组计数后只保留出现一次的值作为独立基准，并检查结果节点顺序、无环和输入唯一节点
身份复用。

关键边界
--------

* 重复值段必须全部删除，不是只压缩为一个节点；
* 前驱在删除重复段时不能推进；
* 哨兵节点统一处理真实头节点被删除的情况；
* C/C++ 不创建或释放数据节点，Rust 会自动释放被移出的 ``Box``。

易错点
------

* 看到两个相同节点后只跳过一个，留下重复值副本；
* 把 ``previous`` 移入重复段，导致无法从结果前缀断开整个区间；
* 没有哨兵节点，头部重复段需要复杂特判且容易返回旧头；
* 把本题写成 0083 的“每个值保留一个”。

本题新增知识
------------

* 哨兵节点配合前驱链接删除整个有序重复段；
* Rust 通过可变所有权槽位连续删除节点。

本题强化知识
------------

* 单链表节点守恒、断链与头节点替换；
* 有序性把重复检测限制在相邻节点。

关联题目
--------

* :doc:`0083-remove-duplicates-from-sorted-list`
* :doc:`0026-remove-duplicates-from-sorted-array`
* :doc:`0061-rotate-list`

最小自检
--------

#. 为什么重复段出现时 ``previous`` 不能推进？
#. 哨兵节点解决了哪个头部边界？
#. 为什么只需要比较当前节点与后继？
#. 本题与 0083 的结果语义有何区别？

答案要点
~~~~~~~~

#. 它必须保留在结果前缀末尾，用来绕过整个重复段。
#. 首个真实值段被全部删除时，统一更新 ``dummy.next``。
#. 相同值在有序链表中连续。
#. 本题删除所有重复值，0083 为每个值保留一个节点。
