0092. Reverse Linked List II
============================

题目信息
--------

:题号: 0092
:难度: Medium
:主题: 单链表、区间反转、哨兵节点
:原题: `LeetCode 0092 <https://leetcode.com/problems/reverse-linked-list-ii/>`_
:重点: 从保存节点顺序，推导到固定区间前驱并原地完成局部反转

题目重述
--------

给定单链表 ``head`` 和两个一基位置 ``left``、``right``，反转第 ``left`` 个节点到第
``right`` 个节点组成的闭区间，并返回反转后的链表。

区间外节点的相对顺序必须保持不变。链表节点数为 ``1..500``，并保证
``1 <= left <= right <=`` 链表长度。附加要求是尽量只遍历链表一次。

自建示例
--------

.. code-block:: text

   输入：9 -> 8 -> 7 -> 6 -> 5，left = 2，right = 5
   输出：9 -> 5 -> 6 -> 7 -> 8

第 2 到第 5 个节点整体逆序，首节点 9 保持原位。

.. code-block:: text

   输入：1 -> 2 -> 3 -> 4，left = 1，right = 3
   输出：3 -> 2 -> 1 -> 4

反转区间从头节点开始，因此结果链表的头节点发生变化。

.. code-block:: text

   输入：3 -> 4 -> 5，left = 2，right = 2
   输出：3 -> 4 -> 5

区间长度为 1 时，不需要移动任何节点。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       ListNode* nodeArray(ListNode* head, int left, int right) {
           std::vector<ListNode*> nodes;
           for (ListNode* node = head; node; node = node->next) {
               nodes.push_back(node);
           }

           std::reverse(nodes.begin() + left - 1, nodes.begin() + right);
           for (int index = 0; index + 1 < static_cast<int>(nodes.size()); ++index) {
               nodes[index]->next = nodes[index + 1];
           }
           nodes.back()->next = nullptr;
           return nodes.front();
       }

       ListNode* reverseAndReconnect(ListNode* head, int left, int right) {
           ListNode dummy(0, head);
           ListNode* before = &dummy;
           for (int position = 1; position < left; ++position) {
               before = before->next;
           }

           ListNode* segment_tail = before->next;
           ListNode* current = segment_tail;
           ListNode* previous = nullptr;

           for (int count = 0; count <= right - left; ++count) {
               ListNode* next = current->next;
               current->next = previous;
               previous = current;
               current = next;
           }

           before->next = previous;
           segment_tail->next = current;
           return dummy.next;
       }

       ListNode* frontInsertion(ListNode* head, int left, int right) {
           ListNode dummy(0, head);
           ListNode* before = &dummy;
           for (int position = 1; position < left; ++position) {
               before = before->next;
           }

           ListNode* segment_tail = before->next;
           for (int step = 0; step < right - left; ++step) {
               ListNode* moved = segment_tail->next;
               segment_tail->next = moved->next;
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

节点顺序重排
~~~~~~~~~~~~

最直接的方法是把所有节点地址保存到数组中，反转下标区间 ``[left-1, right)``，再按数组顺序重建
``next`` 链接。它把链表问题转成数组区间反转，逻辑直观，额外空间为 ``O(n)``。

链表本身已经提供了全部节点，继续寻找不保存数组的原地做法。

区间的三处连接
~~~~~~~~~~~~~~

设 ``before`` 是第 ``left`` 个节点的前驱。局部反转完成后只需保证三部分正确相接：

.. code-block:: text

   原前缀尾 before
          |
          v
   反转后的区间头 ... 原区间首节点 segment_tail -> 原后缀头

当 ``left = 1`` 时不存在真实前驱。令 ``dummy.next = head``，则 ``before`` 始终存在，结果头节点也统一从
``dummy.next`` 返回。

标准局部反转
~~~~~~~~~~~~

从 ``before.next`` 开始执行普通链表反转，恰好处理 ``right-left+1`` 个节点。循环结束时：

* ``previous`` 指向反转后的区间头；
* ``segment_tail`` 是原区间首节点，也是反转后的区间尾；
* ``current`` 指向原第 ``right`` 个节点之后的后缀头。

因此只需执行：

.. code-block:: text

   before.next = previous
   segment_tail.next = current

这种方法先完成整段指针翻转，再恢复区间两端连接。

头插法的局部状态
~~~~~~~~~~~~~~~~

还可以固定 ``before`` 与 ``segment_tail``，反复把 ``segment_tail`` 后面的节点摘出并插到区间最前面：

.. code-block:: text

   moved = segment_tail.next
   segment_tail.next = moved.next
   moved.next = before.next
   before.next = moved

每轮开始时，``before.next`` 是当前已反转部分的头，``segment_tail`` 是其尾，
``segment_tail.next`` 是下一个尚未移动的区间节点。

状态演化
~~~~~~~~

以 ``1 -> 2 -> 3 -> 4 -> 5``、``left=2``、``right=4`` 为例：

.. list-table::
   :header-rows: 1

   * - 阶段
     - 链表
     - 下一步移动
   * - 初始
     - ``1 -> [2 -> 3 -> 4] -> 5``
     - 3
   * - 第一次
     - ``1 -> [3 -> 2 -> 4] -> 5``
     - 4
   * - 第二次
     - ``1 -> [4 -> 3 -> 2] -> 5``
     - 完成

区间共有 ``right-left+1`` 个节点。原首节点已经位于局部结构中，其余 ``right-left`` 个节点各执行一次
头插，整段便完成逆序。

连接安全性
~~~~~~~~~~

摘出 ``moved`` 时先令 ``segment_tail.next = moved.next``，保留未处理区间和后缀；随后再把 ``moved``
接到 ``before`` 后面。任何时刻每个节点都只有一个前驱路径，不会丢失节点或形成环。

``before`` 之前和最终后缀内部的链接从未改变，所以区间外节点的相对顺序保持不变。每个原节点也只被移动或保留一次，
结果中的节点集合与输入完全相同。

复杂度
~~~~~~

节点数组方法时间 ``O(n)``、额外空间 ``O(n)``。标准局部反转和头插法都只定位一次区间前驱，并处理
区间内节点一次，时间 ``O(n)``、额外空间 ``O(1)``。
