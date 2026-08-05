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

完整分组探测
~~~~~~~~~~~~

一组只有在确实包含 ``k`` 个节点时才允许反转。若先修改指针，反转到一半后才发现节点不足，就必须恢复已经
改变的尾部链接，既增加状态，也容易破坏原链表。

迭代方法令 ``groupPrevious`` 指向当前组之前的节点，再从它出发向后移动 ``k`` 次：

* 成功到达 ``kth``，说明 ``groupPrevious->next`` 到 ``kth`` 正好构成完整一组；
* 中途到达空指针，说明剩余节点不足 ``k`` 个，此时尚未改动任何链接，可以直接返回。

虚拟头节点使第一组也拥有普通前驱。即使第一组反转后真实头节点改变，最终仍统一返回 ``dummy.next``。

四个分组边界
~~~~~~~~~~~~

探测成功后，当前结构为：

.. code-block:: text

   ... -> groupPrevious -> groupStart -> ... -> kth -> groupNext -> ...

四个指针分别表示：

* ``groupPrevious``：已处理前缀的尾节点；
* ``groupStart``：当前组旧头；
* ``kth``：当前组旧尾；
* ``groupNext``：下一组首节点，可能为空。

当前组正是半开区间 ``[groupStart, groupNext)``。使用右端不包含的区间后，反转循环可以直接以
``current != groupNext`` 为终止条件，无需另外统计已经处理的节点数。

半开区间反转
~~~~~~~~~~~~

普通链表反转通常令 ``previous`` 从空指针开始。本题令它从 ``groupNext`` 开始：

.. code-block:: text

   previous = groupNext

随后对当前组逐个执行：

.. code-block:: text

   next = current.next
   current.next = previous
   previous = current
   current = next

第一次改写就让旧组头 ``groupStart`` 指向 ``groupNext``。循环结束时，``previous`` 指向新组头 ``kth``，旧组头
已经成为新组尾并连接后缀。组内反转与后缀重连因此在同一个循环中完成，不需要反转结束后再次寻找组尾。

前缀重连与分组推进
~~~~~~~~~~~~~~~~~~

反转完成后执行：

.. code-block:: text

   groupPrevious.next = kth
   groupPrevious = groupStart

第一条链接把已处理前缀接到当前组的新头。第二条把 ``groupPrevious`` 移到当前组的新尾；由于
``groupStart->next`` 已经指向原来的 ``groupNext``，下一轮正好从下一组开始探测。

每轮开始时保持以下不变量：

* ``dummy.next`` 到 ``groupPrevious`` 已经按完整分组反转；
* ``groupPrevious->next`` 开始的后缀尚未处理；
* 已处理前缀与未处理后缀共同包含原链表全部节点，二者不重叠。

一次循环只消费未处理后缀的前 ``k`` 个节点，随后恢复同一不变量。因此每个完整组恰好反转一次；最后不足
``k`` 个节点的尾部在探测失败前从未被修改，能够保持原顺序。

递归分组
~~~~~~~~

``recursiveGroups`` 使用相同的边界。它先向后探测 ``k`` 个节点；若不足一组，直接返回当前 ``head``，把整个
尾部作为已经完成的结果。

存在完整组时，``groupNext`` 指向下一组开头。递归调用先返回后缀处理后的头节点，再把这个返回值作为当前组
反转时的初始 ``previous``。于是当前组旧头在第一次改写时就连接到已经处理好的后缀，最后返回当前组的新头。

迭代方法通过 ``groupPrevious`` 显式连接相邻分组，递归方法通过子调用返回值完成同一连接。公开入口采用迭代方法，
保留相同的分组结构，并消除随分组数量增长的调用栈。

复杂度分析
~~~~~~~~~~

设链表长度为 ``n``。迭代方法中，每个完整组的节点在探测和反转阶段各访问一次；不足一组的尾部只被最后一次
探测访问，因此总时间复杂度为 ``O(n)``，额外空间为 ``O(1)``。

递归方法同样为 ``O(n)`` 时间。递归深度约为完整分组数量 ``O(n / k)``，每层只保存固定数量指针，因此调用栈
空间为 ``O(n / k)``；当 ``k = 1`` 时最坏为 ``O(n)``。
