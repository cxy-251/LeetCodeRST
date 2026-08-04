0025. Reverse Nodes in k-Group
==============================

题目信息
--------

:题号: 0025
:难度: Hard
:主题: 链表、分组、区间反转、递归
:原题: `LeetCode 0025 <https://leetcode.com/problems/reverse-nodes-in-k-group/>`_
:重点: 先确认完整分组，再原地反转半开区间，并保持不足 k 个节点的尾部不变

题目重述
--------

给定单链表头节点 ``head`` 和正整数 ``k``，从链表开头开始，每连续 ``k`` 个节点组成一组。反转每个完整分组
中的节点顺序，返回处理后的链表头节点。

若末尾剩余节点不足 ``k`` 个，这部分必须保持原顺序。必须通过修改 ``next`` 指针交换节点位置，不能只交换
节点值。

链表节点数量为 ``n``，满足 ``1 <= n <= 5000``；节点值位于 ``[0, 1000]``；``1 <= k <= n``。

自建示例
--------

* 多个完整组与尾组：``head = [1,2,3,4,5,6,7]``、``k = 3``，结果为 ``[3,2,1,6,5,4,7]``；
* 恰好分完：``head = [1,2,3,4,5,6]``、``k = 2``，结果为 ``[2,1,4,3,6,5]``；
* 整条链表一组：``head = [4,8,1,9]``、``k = 4``，结果为 ``[9,1,8,4]``；
* 分组大小为一：``head = [5,6,7]``、``k = 1``，结果仍为 ``[5,6,7]``；
* 尾部不足一组：``head = [2,4,6,8,10]``、``k = 3``，结果为 ``[6,4,2,8,10]``。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   private:
       ListNode* recursiveGroups(ListNode* head, int k) {
           ListNode* groupNext = head;
           for (int count = 0; count < k; ++count) {
               if (groupNext == nullptr) {
                   return head;
               }
               groupNext = groupNext->next;
           }

           ListNode* previous = recursiveGroups(groupNext, k);
           ListNode* current = head;
           for (int count = 0; count < k; ++count) {
               ListNode* next = current->next;
               current->next = previous;
               previous = current;
               current = next;
           }
           return previous;
       }

       ListNode* iterativeGroups(ListNode* head, int k) {
           ListNode dummy(0, head);
           ListNode* groupPrevious = &dummy;

           while (true) {
               ListNode* kth = groupPrevious;
               for (int step = 0; step < k; ++step) {
                   kth = kth->next;
                   if (kth == nullptr) {
                       return dummy.next;
                   }
               }

               ListNode* groupStart = groupPrevious->next;
               ListNode* groupNext = kth->next;
               ListNode* previous = groupNext;
               ListNode* current = groupStart;

               while (current != groupNext) {
                   ListNode* next = current->next;
                   current->next = previous;
                   previous = current;
                   current = next;
               }

               groupPrevious->next = kth;
               groupPrevious = groupStart;
           }
       }

   public:
       ListNode* reverseKGroup(ListNode* head, int k) {
           return iterativeGroups(head, k);
       }
   };

题解
----

先确认完整分组
~~~~~~~~~~~~~~

一组只有在确实包含 ``k`` 个节点时才允许反转。若先改指针、反转到一半后才发现节点不足，就必须再把尾部恢复，
不仅逻辑复杂，也容易破坏原链表。

迭代方法令 ``groupPrevious`` 指向当前组之前的节点，再从它出发向后移动 ``k`` 次：

* 成功到达节点 ``kth``，说明 ``groupPrevious->next`` 到 ``kth`` 正好构成完整一组；
* 中途到达空指针，说明剩余节点不足 ``k`` 个，此时尚未改动任何链接，可以直接返回。

虚拟头节点使第一组也拥有普通前驱。即使第一组反转后真实头节点改变，最终仍统一返回 ``dummy.next``。

四个分组边界
~~~~~~~~~~~~

探测成功后，当前结构可写为：

.. code-block:: text

   ... -> groupPrevious -> groupStart -> ... -> kth -> groupNext -> ...

其中：

* ``groupPrevious`` 是已处理前缀的尾节点；
* ``groupStart`` 是当前组旧头；
* ``kth`` 是当前组旧尾；
* ``groupNext`` 是下一组首节点，可能为空。

真正需要反转的是半开区间 ``[groupStart, groupNext)``。使用半开区间后，循环条件可以直接写成
``current != groupNext``，无需额外统计已经反转了多少节点。

反转如何自动接回后缀
~~~~~~~~~~~~~~~~~~~~

普通链表反转通常令 ``previous`` 从空指针开始。本题把它初始化为 ``groupNext``：

.. code-block:: text

   previous = groupNext

随后对当前组逐个执行：

.. code-block:: text

   next = current.next
   current.next = previous
   previous = current
   current = next

第一次改写就让旧组头 ``groupStart`` 指向 ``groupNext``。循环结束时，``previous`` 指向新组头 ``kth``，而旧组头
已经成为新组尾并正确连接后缀。因此组内反转与连接后缀在同一循环中完成。

接回前缀并推进
~~~~~~~~~~~~~~

反转结束后还需要完成两件事：

.. code-block:: text

   groupPrevious.next = kth
   groupPrevious = groupStart

第一条把已处理前缀接到当前组的新头。第二条把 ``groupPrevious`` 移到当前组的新尾，也就是反转前保存的
``groupStart``。下一轮便从原来的 ``groupNext`` 开始探测。

循环开始时始终满足：``groupPrevious`` 之前的节点已经按完整组反转并连成一条链，
``groupPrevious->next`` 开始的后缀尚未处理。一次循环只处理该后缀的前 ``k`` 个节点，完成后不变量继续成立。
因此每个完整组恰好反转一次，最后不足 ``k`` 个节点的尾部从未被修改。

递归如何表达同一结构
~~~~~~~~~~~~~~~~~~~~

``recursiveGroups`` 同样先向后探测 ``k`` 个节点。若不足一组，直接返回当前 ``head``，保留整个尾部。

若存在完整组，``groupNext`` 已指向下一组开头。递归先取得后缀处理后的头节点，并把它作为本组反转时的初始
``previous``。这样当前组旧头在第一次反转时就会连接到已经处理好的后缀，最后返回当前组的新头。

递归与迭代执行的是同一分组操作；迭代显式保存组前驱，递归则由调用返回值连接相邻分组。公开入口采用迭代方法，
避免递归栈随分组数量增长。

复杂度分析
~~~~~~~~~~

设链表长度为 ``n``。迭代方法中，每个完整组的节点在探测和反转阶段各访问一次；不足一组的尾部只被最后一次
探测访问，因此总时间复杂度为 ``O(n)``，额外空间为 ``O(1)``。

递归方法同样为 ``O(n)`` 时间。递归深度约为完整分组数量 ``O(n / k)``，每层只保存固定数量指针，因此调用栈
空间为 ``O(n / k)``；当 ``k = 1`` 时最坏为 ``O(n)``。
