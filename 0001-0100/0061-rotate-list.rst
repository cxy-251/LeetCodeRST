0061. Rotate List
=================

题目信息
--------

:题号: 0061
:难度: Medium
:主题: 链表、双指针、模运算
:原题: `LeetCode 0061 <https://leetcode.com/problems/rotate-list/>`_
:重点: 从逐次移动尾节点，推导到确定唯一切口并通过成环断开完成旋转

题目重述
--------

给定单链表 ``head`` 和非负整数 ``k``，把链表向右旋转 ``k`` 次并返回新的头节点。

一次右旋会把当前尾节点移动到链表最前方。例如：

.. code-block:: text

   1 -> 2 -> 3 -> 4

右旋一次后变为：

.. code-block:: text

   4 -> 1 -> 2 -> 3

链表节点数在 ``0..500`` 范围内，节点值在 ``-100..100`` 范围内，``0 <= k <= 2 * 10^9``。

自建示例
--------

.. code-block:: text

   输入：1 -> 2 -> 3 -> 4 -> 5 -> 6，k = 8
   输出：5 -> 6 -> 1 -> 2 -> 3 -> 4

链表长度为 6，``8 % 6 = 2``，因此只需把最后两个节点整体移到前面。

.. code-block:: text

   输入：7 -> 8 -> 9，k = 6
   输出：7 -> 8 -> 9

``6 % 3 = 0``，完整旋转两圈后顺序不变。

.. code-block:: text

   输入：空链表，k = 5
   输出：空链表

空链表没有可移动节点，直接返回空指针。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   private:
       ListNode* moveTailToFrontRepeatedly(ListNode* head, int k) {
           if (!head || !head->next) return head;

           while (k-- > 0) {
               ListNode* previous = nullptr;
               ListNode* tail = head;
               while (tail->next) {
                   previous = tail;
                   tail = tail->next;
               }

               previous->next = nullptr;
               tail->next = head;
               head = tail;
           }
           return head;
       }

       ListNode* splitAndReconnect(ListNode* head, int k) {
           if (!head || !head->next) return head;

           int length = 0;
           for (ListNode* node = head; node; node = node->next) {
               ++length;
           }

           int shift = k % length;
           if (shift == 0) return head;

           ListNode* fast = head;
           for (int step = 0; step < shift; ++step) {
               fast = fast->next;
           }

           ListNode* slow = head;
           while (fast->next) {
               fast = fast->next;
               slow = slow->next;
           }

           ListNode* newHead = slow->next;
           slow->next = nullptr;
           fast->next = head;
           return newHead;
       }

       ListNode* makeCycleAndCut(ListNode* head, int k) {
           if (!head || !head->next) return head;

           int length = 1;
           ListNode* tail = head;
           while (tail->next) {
               tail = tail->next;
               ++length;
           }

           int shift = k % length;
           if (shift == 0) return head;

           tail->next = head;

           int stepsToNewTail = length - shift - 1;
           ListNode* newTail = head;
           while (stepsToNewTail-- > 0) {
               newTail = newTail->next;
           }

           ListNode* newHead = newTail->next;
           newTail->next = nullptr;
           return newHead;
       }

   public:
       ListNode* rotateRight(ListNode* head, int k) {
           return makeCycleAndCut(head, k);
       }
   };

题解
----

从定义出发：每次把尾节点移到头部
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

最直接的方法完全照着题意执行一次右旋：

#. 从头扫描到尾节点，同时记录尾节点的前驱；
#. 令前驱的 ``next`` 变为空，摘下尾节点；
#. 令尾节点指向旧头，并把它作为新头。

``moveTailToFrontRepeatedly`` 重复这个过程 ``k`` 次。每次寻找尾节点都需要 ``O(n)``，总时间最坏为
``O(kn)``。当 ``k`` 接近 ``2 * 10^9`` 时，这种方法无法接受。

旋转次数为什么可以先取模
~~~~~~~~~~~~~~~~~~~~~~~~

长度为 ``n`` 的链表右旋 ``n`` 次后，每个节点都会回到原位置。因此旋转具有周期 ``n``：

.. code-block:: text

   shift = k % n

真正改变结果的只有余数 ``shift``。若余数为 0，结果就是原链表，不应再修改任何指针。

取模前必须先处理空链表，因为 ``n = 0`` 时不能执行模运算。单节点链表也可以直接返回，它无论怎样旋转都不变。

旋转本质上是在唯一位置切开
~~~~~~~~~~~~~~~~~~~~~~~~~~

设有效右移量为 ``shift``。原链表可以分成两段：

.. code-block:: text

   A 长度为 n - shift
   B 长度为 shift

   原顺序：A -> B
   新顺序：B -> A

所以不需要真的把尾节点逐个搬到前面。只需找到 ``A`` 的最后一个节点，也就是新尾；它的下一个节点就是新头。

按零基下标计算，新尾位于：

.. code-block:: text

   n - shift - 1

例如长度为 6、``shift = 2`` 时，新尾下标为 ``6 - 2 - 1 = 3``，即节点 4；它的下一个节点 5 成为新头。

成环为什么让重连只剩一次断开
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若先令旧尾指向旧头：

.. code-block:: text

   tail->next = head

全部节点就构成一个环。环上没有固定起点，任何节点都可以成为头。此时找到新尾后，只需：

.. code-block:: text

   newHead = newTail->next
   newTail->next = nullptr

一次断开同时完成两件事：断开位置之后自然成为新头，旧尾又已经通过环连接到旧头，因此不需要另外保存后半段再拼接。

状态演化
~~~~~~~~

以 ``1 -> 2 -> 3 -> 4 -> 5``、``k = 2`` 为例：

.. list-table::
   :header-rows: 1

   * - 阶段
     - 状态
     - 含义
   * - 统计长度
     - ``length = 5``
     - 旧尾是节点 5
   * - 计算位移
     - ``shift = 2``
     - 最后两个节点移到前面
   * - 临时成环
     - ``5.next = 1``
     - 所有节点进入同一个环
   * - 定位新尾
     - 下标 ``5 - 2 - 1 = 2``，节点 3
     - 节点 4 将成为新头
   * - 断开
     - ``3.next = nullptr``
     - 得到 ``4 -> 5 -> 1 -> 2 -> 3``

双指针为什么找到同一个切口
~~~~~~~~~~~~~~~~~~~~~~~~~~

``splitAndReconnect`` 让 ``fast`` 比 ``slow`` 先走 ``shift`` 步，然后两者同步前进，直到 ``fast`` 到达旧尾。
此时从 ``slow`` 后面到旧尾恰好有 ``shift`` 个节点，所以 ``slow`` 就是新尾。

该方法随后先断开 ``slow->next``，再令旧尾连接旧头。它与成环法找到的是同一个切口；成环法的指针关系更集中，
因此作为主实现。

为什么节点不重不漏
~~~~~~~~~~~~~~~~~~

成环前，原链表包含全部 ``n`` 个节点且每个节点出现一次。连接旧尾和旧头只新增一条边，没有创建或删除节点。
随后在新尾处删除一条边，环重新变成一条链。

因为只删除一条边，所有节点仍在同一个连通结构中；因为结构不再成环，从新头沿 ``next`` 最终会在新尾结束。
因此结果恰好包含原来的全部节点，每个节点仍只出现一次。

指针更新顺序为什么重要
~~~~~~~~~~~~~~~~~~~~~~

必须先保存：

.. code-block:: text

   newHead = newTail->next

再执行：

.. code-block:: text

   newTail->next = nullptr

若先断开而没有保存新头，就会失去新头入口。若连接成环后忘记断开，返回的将不是合法单链表，而是无限循环的环。

复杂度来源
~~~~~~~~~~

主方法第一次扫描统计长度并找到旧尾，第二次最多走 ``n-1`` 步寻找新尾，因此时间为 ``O(n)``，额外空间为
``O(1)``。

任何正确方法在最坏情况下都必须检查到链表尾部，才能知道长度和切口位置，因此需要 ``Ω(n)`` 时间；主方法达到
这个下界。逐次右旋方法则为 ``O(kn)``。
