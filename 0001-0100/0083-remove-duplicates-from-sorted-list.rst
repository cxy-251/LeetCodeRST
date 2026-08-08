0083. Remove Duplicates from Sorted List
========================================

题目信息
--------

:题号: 0083. 删除排序链表中的重复元素
:难度: Easy
:主题: 单链表、有序去重、连续重复段
:原题: `LeetCode 0083 <https://leetcode.com/problems/remove-duplicates-from-sorted-list/>`_
:重点: 从记录已见值，推导到利用有序性原地压缩每个连续值段

题目重述
--------

给定一个按非递减顺序排列的单链表 ``head``，删除其中的重复节点，使每个不同值只保留一个节点，
并返回去重后的链表。

保留下来的节点必须维持原有相对顺序。与 0082 不同，本题不会删除整个重复值段，而是保留该值段的第一个节点。

链表节点数在 ``0..300`` 范围内，节点值在 ``-100..100`` 范围内。

自建示例
--------

.. code-block:: text

   输入：0 -> 0 -> 0 -> 2 -> 2 -> 5
   输出：0 -> 2 -> 5

三个 0 保留第一个，两个 2 保留第一个，5 原样保留。

.. code-block:: text

   输入：-2 -> -1 -> -1 -> 3 -> 3 -> 3 -> 8
   输出：-2 -> -1 -> 3 -> 8

每个连续值段都压缩为一个原节点。

.. code-block:: text

   输入：空链表
   输出：空链表

没有节点时直接返回空指针。

C++ 实现
--------

.. code-block:: cpp

   #include <unordered_set>

   class Solution {
   private:
       ListNode* setBased(ListNode* head) {
           std::unordered_set<int> seen;
           ListNode dummy(0);
           ListNode* tail = &dummy;

           for (ListNode* node = head; node != nullptr; ) {
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
           if (head == nullptr) {
               return nullptr;
           }

           head->next = recursiveCompress(head->next);

           while (head->next != nullptr && head->next->val == head->val) {
               head->next = head->next->next;
           }

           return head;
       }

       ListNode* adjacentScan(ListNode* head) {
           ListNode* current = head;

           while (current != nullptr) {
               while (current->next != nullptr && current->next->val == current->val) {
                   current->next = current->next->next;
               }

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

通用去重
~~~~~~~~

不利用有序性时，可以用集合记录已经出现的值。第一次读到某个值时把该节点接到结果尾部，后续相同值全部跳过。
这种方法适用于无序链表，但需要 ``O(n)`` 额外空间，也忽略了本题最关键的有序结构。

连续值段
~~~~~~~~

链表按非递减顺序排列，所以相同值必然连续出现。链表可以分成若干值段：

.. code-block:: text

   0 -> 0 -> 0 | 2 -> 2 | 5

每段只需保留第一个节点，并让它直接连接到下一段的第一个节点。进入更大的值后，当前值不会再次出现，
因此不需要集合或全局计数。

递归压缩
~~~~~~~~

递归方法先去重 ``head->next`` 开始的后缀，再检查处理后的后继是否与 ``head`` 同值。若同值，就持续绕过这些节点。

后缀已经保证每个值至多保留一次，所以递归返回后通常只需一次比较；代码保留 ``while``，使局部逻辑独立且更容易验证。
递归层数最多为节点数，因此需要 ``O(n)`` 调用栈。

单指针状态
~~~~~~~~~~

迭代方法让 ``current`` 始终指向当前值段保留的第一个节点。每轮外层循环开始时：

- 从链表头到 ``current`` 的部分已经去重；
- ``current`` 本身必须保留；
- ``current->next`` 开始仍可能包含同值节点。

只要后继与 ``current`` 同值，就执行：

.. code-block:: cpp

   current->next = current->next->next;

这会绕过一个重复节点，同时保持 ``current`` 不动，以便继续检查新的后继。

连续绕过
~~~~~~~~

输入 ``1 -> 1 -> 1 -> 2`` 时，删除第一个重复后，``current->next`` 仍然是 1。若只使用一次 ``if``，
第三个 1 会被错误保留。因此必须使用内层 ``while``，直到后继为空或值发生变化。

.. list-table::
   :header-rows: 1

   * - ``current``
     - 后继
     - 动作
   * - 第一个 1
     - 第二个 1
     - 绕过第二个 1
   * - 第一个 1
     - 第三个 1
     - 继续绕过
   * - 第一个 1
     - 2
     - 当前值段完成
   * - 2
     - 空
     - 保留尾节点并结束

不同值保留
~~~~~~~~~~

删除条件只在 ``current->next->val == current->val`` 时成立。遇到第一个更大的值后，内层循环立即停止，
该节点仍连接在链表中，并在下一轮成为新值段的代表。

每个值段的第一个节点从不被绕过，其余同值节点全部被绕过。因此最终每个不同值恰好保留一次，
且保留的是输入中最先出现的原节点。

头节点稳定
~~~~~~~~~~

本题无论头部值重复多少次，都保留第一个头节点，结果头不会改变，所以不需要哨兵节点。
0082 会删除整个重复值段，头部可能整体消失，才需要哨兵节点保存可修改的前驱位置。

节点处理
~~~~~~~~

主方法只修改 ``next`` 指针，不交换节点值，也不创建结果节点。被绕过节点的释放策略由调用环境负责；
LeetCode 的函数只需返回重新连接后的链表头。

复杂度
~~~~~~

集合方法时间 ``O(n)``、额外空间 ``O(n)``。递归方法时间 ``O(n)``，调用栈 ``O(n)``。
单指针方法中每个节点最多被检查和绕过一次，时间 ``O(n)``，额外空间 ``O(1)``。
