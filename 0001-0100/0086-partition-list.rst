0086. Partition List
====================

题目信息
--------

:题号: 0086
:难度: Medium
:主题: 单链表、稳定分区、双链拼接
:原题: `LeetCode 0086 <https://leetcode.com/problems/partition-list/>`_
:重点: 从保存节点引用，推导到常量空间的稳定双链分区与原链抽取

题目重述
--------

给定单链表 ``head`` 和整数 ``x``，重新连接原链表节点，使所有值小于 ``x`` 的节点都位于值大于等于
``x`` 的节点之前。

两个分区内部必须保持原链表中的相对顺序。算法返回重排后的头节点，不要求按数值排序，也不能遗漏或复制节点。

链表节点数在 ``0..200`` 范围内，节点值和 ``x`` 都在 ``-100..100`` 范围内。

自建示例
--------

.. code-block:: text

   输入：5 -> 1 -> 4 -> 2 -> 3，x = 4
   输出：1 -> 2 -> 3 -> 5 -> 4

小于 4 的节点按原顺序形成 ``1,2,3``，其余节点按原顺序形成 ``5,4``。

.. code-block:: text

   输入：1 -> 4 -> 2 -> 5 -> 3，x = 3
   输出：1 -> 2 -> 4 -> 5 -> 3

前段保留 ``1,2`` 的顺序，后段也保留 ``4,5,3`` 的顺序。

.. code-block:: text

   输入：1 -> 2，x = 5
   输出：1 -> 2

所有节点都属于前一分区，拼接后链表不变。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       ListNode* collectReferences(ListNode* head, int x) {
           std::vector<ListNode*> before;
           std::vector<ListNode*> after;

           for (ListNode* node = head; node; node = node->next) {
               if (node->val < x) {
                   before.push_back(node);
               } else {
                   after.push_back(node);
               }
           }

           ListNode dummy(0);
           ListNode* tail = &dummy;

           for (ListNode* node : before) {
               tail->next = node;
               tail = node;
           }
           for (ListNode* node : after) {
               tail->next = node;
               tail = node;
           }

           tail->next = nullptr;
           return dummy.next;
       }

       ListNode* inPlaceSplice(ListNode* head, int x) {
           ListNode dummy(0, head);
           ListNode* lessTail = &dummy;

           while (lessTail->next && lessTail->next->val < x) {
               lessTail = lessTail->next;
           }

           ListNode* scanPrev = lessTail;
           while (scanPrev->next) {
               if (scanPrev->next->val >= x) {
                   scanPrev = scanPrev->next;
                   continue;
               }

               ListNode* moved = scanPrev->next;
               scanPrev->next = moved->next;
               moved->next = lessTail->next;
               lessTail->next = moved;
               lessTail = moved;
           }

           return dummy.next;
       }

       ListNode* stableTwoLists(ListNode* head, int x) {
           ListNode beforeDummy(0);
           ListNode afterDummy(0);
           ListNode* beforeTail = &beforeDummy;
           ListNode* afterTail = &afterDummy;

           while (head) {
               ListNode* next = head->next;
               head->next = nullptr;

               if (head->val < x) {
                   beforeTail->next = head;
                   beforeTail = head;
               } else {
                   afterTail->next = head;
                   afterTail = head;
               }

               head = next;
           }

           beforeTail->next = afterDummy.next;
           return beforeDummy.next;
       }

   public:
       ListNode* partition(ListNode* head, int x) {
           return stableTwoLists(head, x);
       }
   };

题解
----

稳定分区模型
~~~~~~~~~~~~

题目只要求按条件分为两组，不要求组内排序。交换节点值或把小节点不断插到链表头部，都会改变同一分区中的
相对顺序。稳定做法是按原链表的扫描顺序，把节点追加到对应分区的尾部。

引用数组
~~~~~~~~

最直接的方法把小于 ``x`` 和大于等于 ``x`` 的节点引用分别保存到两个数组，再按两个数组的顺序重连。
这种方法容易验证稳定性，但需要 ``O(n)`` 额外空间。

双链尾插
~~~~~~~~

数组只承担“记住两个分区顺序”的作用。链表自身已经有顺序，因此可以用两组哨兵和尾指针直接构造：

* ``beforeTail`` 指向小于 ``x`` 分区的尾节点；
* ``afterTail`` 指向大于等于 ``x`` 分区的尾节点；
* 当前节点只会被追加到其中一条链。

每条链始终在尾部追加，所以同一分区中的节点顺序与输入一致。

断开旧链接
~~~~~~~~~~

处理当前节点前先保存原后继，再把当前节点的 ``next`` 置空：

.. code-block:: text

   next = current.next
   current.next = null
   append current
   current = next

旧 ``next`` 指向尚未分类的混合后缀。提前断开可保证两条临时链都只包含已经分类的节点，也避免最终拼接后
残留旧链接形成错误跨接或环。

状态演进
~~~~~~~~

以 ``5 -> 1 -> 4 -> 2 -> 3``、``x = 4`` 为例：

.. list-table::
   :header-rows: 1

   * - 读取节点
     - 小于 ``x``
     - 大于等于 ``x``
   * - 5
     - 空
     - ``5``
   * - 1
     - ``1``
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

扫描结束后执行 ``beforeTail->next = afterDummy.next``，结果即为两条稳定链的连接。

原链抽取
~~~~~~~~

``inPlaceSplice`` 不建立两条独立链。它先让 ``lessTail`` 越过开头已经连续满足 ``val < x`` 的节点，随后
从后缀中逐个抽取小节点，并插到 ``lessTail`` 之后。

``scanPrev`` 只在当前后继属于后分区时推进；遇到小节点时，先从原位置摘除，再追加到小节点前缀尾部。
抽取顺序就是扫描顺序，因此前后两个分区都保持稳定。

节点守恒
~~~~~~~~

每个原节点恰好被扫描一次，并根据互斥条件 ``val < x`` 进入一个分区。算法只修改 ``next``，不复制、删除
或新建结果数据节点。最终拼接后，全部原节点各出现一次。

复杂度来源
~~~~~~~~~~

引用数组方法时间 ``O(n)``、额外空间 ``O(n)``。双链尾插和原链抽取都只扫描链表一次，时间 ``O(n)``，
除固定数量的哨兵和指针外不使用额外存储，工作空间 ``O(1)``。
