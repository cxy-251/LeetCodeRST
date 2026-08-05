0082. Remove Duplicates from Sorted List II
===========================================

题目信息
--------

:题号: 0082
:难度: Medium
:主题: 单链表、有序重复段、哨兵节点
:原题: `LeetCode 0082 <https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/>`_
:重点: 从统计出现次数，推导到按连续值段处理，再用哨兵节点统一删除头部重复段

题目重述
--------

给定一个按非递减顺序排列的单链表 ``head``，删除所有出现次数大于 1 的值对应的全部节点。
结果中只能保留在原链表中恰好出现一次的值，并保持这些节点原有的相对顺序。

链表节点数满足 ``0 <= n <= 300``，节点值满足 ``-100 <= Node.val <= 100``。

自建示例
--------

.. code-block:: text

   输入：1 -> 1 -> 2 -> 3 -> 3 -> 4 -> 5 -> 5
   输出：2 -> 4

值 1、3、5 都属于长度大于 1 的重复段，整段删除；值 2、4 各出现一次，保留原节点。

.. code-block:: text

   输入：2 -> 2 -> 2
   输出：空链表

链表只有一个值段，且该段长度为 3，因此没有节点可以保留。

.. code-block:: text

   输入：1 -> 2 -> 3
   输出：1 -> 2 -> 3

所有值段长度都为 1，原链表保持不变。

C++ 实现
--------

.. code-block:: cpp

   #include <unordered_map>

   class Solution {
   private:
       ListNode* countAndRelink(ListNode* head) {
           std::unordered_map<int, int> frequency;
           for (ListNode* node = head; node != nullptr; node = node->next) {
               ++frequency[node->val];
           }

           ListNode dummy(0);
           ListNode* tail = &dummy;
           ListNode* current = head;

           while (current != nullptr) {
               ListNode* next = current->next;
               if (frequency[current->val] == 1) {
                   tail->next = current;
                   tail = current;
                   tail->next = nullptr;
               }
               current = next;
           }

           return dummy.next;
       }

       ListNode* recursiveSkip(ListNode* head) {
           if (head == nullptr || head->next == nullptr) {
               return head;
           }

           if (head->val != head->next->val) {
               head->next = recursiveSkip(head->next);
               return head;
           }

           int duplicate_value = head->val;
           while (head != nullptr && head->val == duplicate_value) {
               head = head->next;
           }
           return recursiveSkip(head);
       }

       ListNode* sentinelScan(ListNode* head) {
           ListNode dummy(0, head);
           ListNode* previous = &dummy;
           ListNode* current = head;

           while (current != nullptr) {
               if (current->next != nullptr &&
                   current->val == current->next->val) {
                   int duplicate_value = current->val;
                   while (current != nullptr &&
                          current->val == duplicate_value) {
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

   public:
       ListNode* deleteDuplicates(ListNode* head) {
           return sentinelScan(head);
       }
   };

解题推导
--------

从节点计数到值段
~~~~~~~~~~~~~~~~

最直接的方法是先统计每个值的出现次数，再扫描链表，只把频次为 1 的节点重新连接到结果链表。
这种方法容易验证，但需要 ``O(n)`` 额外空间，而且没有利用链表已经有序这一条件。

有序链表中，相同值必然连续出现。因此不必保存所有值的全局频次，只需把链表划分为连续值段：

- 值段长度为 1，保留该节点；
- 值段长度大于 1，绕过整段节点。

递归按值段处理
~~~~~~~~~~~~~~

递归方法直接处理当前值段。若头节点与后继值不同，当前值段只有一个节点，可以保留头节点，
再递归过滤后缀。若两者相同，就先移动到第一个不同值，再从该位置继续递归。

每次递归至少处理一个节点，因此最终一定到达空链表。它完整表达了值段分类，但递归深度最坏为
``O(n)``，还可以改为迭代扫描。

哨兵节点统一边界
~~~~~~~~~~~~~~~~

重复段可能出现在链表头部，例如 ``1 -> 1 -> 2``。没有哨兵时，删除头部重复段需要额外修改
``head``。建立 ``dummy.next = head`` 后，``previous`` 始终指向结果有效前缀的最后一个节点，
所有删除都统一为：

.. code-block:: text

   previous->next = current

其中 ``current`` 已移动到重复段之后。即使首个值段被删除，修改的仍然只是 ``dummy.next``。

前驱指针不变量
~~~~~~~~~~~~~~

每轮开始时：

- ``dummy.next`` 到 ``previous`` 是已经确认应保留的有效前缀；
- ``current`` 指向尚未分类的第一个节点；
- ``previous->next == current``。

若 ``current`` 与后继值不同，由于链表非递减，该值不可能在后方再次出现，当前节点可以保留。
此时同时推进 ``previous`` 和 ``current``。

若两者值相同，``current`` 所在值段必然重复。算法只推进 ``current``，直到离开该值段，
``previous`` 保持不动，再把它直接连接到新的 ``current``。因此重复段中不会留下任何节点。

.. list-table::
   :header-rows: 1

   * - 未处理后缀
     - ``previous``
     - 动作
   * - ``1,2,3,3,4,4,5``
     - ``dummy``
     - 1 唯一，前驱推进到 1
   * - ``2,3,3,4,4,5``
     - 1
     - 2 唯一，前驱推进到 2
   * - ``3,3,4,4,5``
     - 2
     - 越过全部 3，连接到第一个 4
   * - ``4,4,5``
     - 2
     - 越过全部 4，连接到 5
   * - ``5``
     - 2
     - 5 唯一，保留

结果与资源
~~~~~~~~~~

每个连续值段恰好被分类一次。长度为 1 的段进入有效前缀，长度大于 1 的段被前驱整段绕过，
所以结果恰好包含所有只出现一次的值，并保持原有顺序。

代码只修改节点的 ``next`` 指针，不创建结果节点。被绕过节点的释放策略由调用环境决定；
LeetCode 的接口不要求在函数内手动释放这些节点。

复杂度
~~~~~~

哈希计数方法时间 ``O(n)``、额外空间 ``O(n)``。递归方法时间 ``O(n)``、调用栈 ``O(n)``。
哨兵迭代方法中每个节点最多被访问常数次，时间 ``O(n)``，额外空间 ``O(1)``。
