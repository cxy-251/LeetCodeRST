0019. Remove Nth Node From End of List
======================================

题目信息
--------

:题号: 0019. 删除链表的倒数第 N 个结点
:难度: Medium
:主题: 链表、双指针、虚拟头节点
:原题: `LeetCode 0019 <https://leetcode.com/problems/remove-nth-node-from-end-of-list/>`_
:重点: 虚拟头节点统一删除操作，固定快慢指针间距定位待删节点前驱

题目重述
--------

给定非空单链表的头节点 ``head`` 和整数 ``n``，删除链表中倒数第 ``n`` 个节点，并返回删除后的头节点。

链表长度位于 ``[1, 30]``，节点值位于 ``[0, 100]``，并保证 ``1 <= n <= 链表长度``。若删除的是原头节点，
返回值应指向原第二个节点；若链表只有一个节点，删除后返回 ``nullptr``。

自建示例
--------

* 删除中间节点：``head = [4, 7, 1, 9, 6]``、``n = 2``，返回 ``[4, 7, 1, 6]``；
* 删除尾节点：``head = [3, 8, 5]``、``n = 1``，返回 ``[3, 8]``；
* 删除头节点：``head = [8, 3, 5]``、``n = 3``，返回 ``[3, 5]``；
* 删除唯一节点：``head = [2]``、``n = 1``，返回空链表。

C++ 实现
--------

.. code-block:: cpp

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

       ListNode* gapPointers(ListNode* head, int n) {
           ListNode dummy(0, head);
           ListNode* fast = head;
           ListNode* slow = &dummy;
           for (int step = 0; step < n; ++step) {
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

倒数位置
~~~~~~~~

若链表长度为 ``length``，倒数第 ``n`` 个节点的正向下标是 ``length - n``，其中头节点下标为 ``0``。
删除单链表节点时需要修改其前驱的 ``next``，所以真正要定位的是该节点前面的一个位置。

``twoPasses`` 第一次遍历计算长度，第二次从虚拟头节点前进 ``length - n`` 步。此时 ``previous->next``
就是待删节点。这个方法直接使用下标换算，时间为 ``O(length)``，但链表被完整扫描两轮。

虚拟头节点
~~~~~~~~~~

删除普通节点时，前驱是真实链表中的前一个节点；删除头节点时，真实链表中不存在前驱。若直接从 ``head``
开始处理，就需要为 ``n == length`` 单独修改返回值。

令 ``dummy.next = head`` 后，原头节点也拥有统一前驱 ``dummy``。无论删除哪个节点，都执行同一组操作：

.. code-block:: cpp

   ListNode* removed = previous->next;
   previous->next = removed->next;

最终返回 ``dummy.next``。删除头节点时它自动变为原第二个节点，删除唯一节点时自动变为 ``nullptr``。

固定间距
~~~~~~~~

两次遍历中的 ``length - n`` 可以通过两个同步移动的指针隐式得到。

``fast`` 从真实头节点出发，先前进 ``n`` 步；``slow`` 从虚拟头节点出发。此时：

* ``fast`` 后面还有多少个真实节点；
* ``slow`` 就需要再前进多少步，才能到达待删节点的前驱。

随后两者同步前进。当 ``fast`` 到达 ``nullptr`` 时，``slow`` 恰好停在待删节点前面。

以长度为 ``5``、``n = 2`` 为例，快指针先走两步后位于正向下标 ``2``。它还需要三步到达 ``nullptr``，
慢指针也同步走三步：从虚拟头节点到下标 ``2`` 的节点。该节点正是倒数第二个节点的前驱。

间距不变量
~~~~~~~~~~

快指针先走 ``n`` 步后，从 ``slow->next`` 到 ``fast`` 之间始终包含 ``n`` 个真实节点。同步移动不会改变这个
数量。

当 ``fast == nullptr`` 时，从 ``slow->next`` 到链表末尾正好还有 ``n`` 个节点。因此 ``slow->next``
就是倒数第 ``n`` 个节点，``slow`` 就是删除所需的前驱。

这个关系也覆盖两个边界：

* ``n = 1`` 时，快指针先走一步，最终慢指针停在尾节点前驱；
* ``n = length`` 时，快指针预先走到 ``nullptr``，慢指针保持在 ``dummy``，因此删除头节点。

代码演进
~~~~~~~~

``twoPasses`` 显式计算 ``length``，再根据 ``length - n`` 定位前驱。

``gapPointers`` 删除长度变量和第二次独立定位。快指针先走 ``n`` 步，把“距离链表末尾还有多少步”传递给慢
指针；同步阶段结束时，慢指针直接得到前驱。

公开入口采用 ``gapPointers``。两个方法都借助虚拟头节点统一删除头节点与普通节点，区别只在前驱如何定位。

复杂度分析
~~~~~~~~~~

两种方法的时间复杂度均为 ``O(length)``，工作空间均为 ``O(1)``。两次遍历方法先计算长度再定位，固定间距
方法只进行一次连续的整体扫描。返回链表不属于额外空间。
