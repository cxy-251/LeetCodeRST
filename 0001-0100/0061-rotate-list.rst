0061. Rotate List
=================

题目信息
--------

:题号: 0061. 旋转链表
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

逐次右移基线
~~~~~~~~~~~~

一次右旋可以直接按定义完成：扫描到尾节点并记录其前驱，摘下尾节点，再把它接到旧头之前。
``moveTailToFrontRepeatedly`` 重复该过程 ``k`` 次，每次扫描需要 ``O(n)``，总时间最坏为
``O(kn)``。当 ``k`` 接近 ``2 * 10^9`` 时，瓶颈来自对同一链表的反复遍历。

旋转周期压缩
~~~~~~~~~~~~

长度为 ``n`` 的链表右旋 ``n`` 次后，每个节点都会回到原位置，因此只有余数会改变结果：

.. code-block:: text

   shift = k % n

取模前必须先排除空链表；单节点链表也可以直接返回。若 ``shift == 0``，结果与原链表相同，不需要修改
任何指针。

唯一切口
~~~~~~~~

有效右移量为 ``shift`` 时，原链表可以分成两段：

.. code-block:: text

   A 长度为 n - shift
   B 长度为 shift

   原顺序：A -> B
   新顺序：B -> A

所以旋转只需要找到 ``A`` 的最后一个节点。按零基下标计算，新尾位于：

.. code-block:: text

   n - shift - 1

它的下一个节点就是新头。重复移动尾节点的过程，等价于一次把后缀 ``B`` 整体移到前面。

双指针切分
~~~~~~~~~~

``splitAndReconnect`` 让 ``fast`` 先走 ``shift`` 步，再让 ``fast`` 和 ``slow`` 同步前进，直到
``fast`` 到达旧尾。此时 ``slow`` 后面恰好剩下 ``shift`` 个节点，因此 ``slow`` 就是新尾。

保存 ``slow->next`` 作为新头后，先断开旧前缀，再令旧尾连接旧头，即可得到 ``B -> A``。该方法无需显式
计算新尾下标，但仍需先统计长度以完成取模。

成环后断开
~~~~~~~~~~

主方法先在统计长度时保留旧尾，再令：

.. code-block:: text

   tail->next = head

全部节点暂时构成一个环。环上没有固定起点，因此旋转不再需要“移动”节点，只需在正确位置重新断开。

找到下标 ``n - shift - 1`` 处的新尾后：

.. code-block:: text

   newHead = newTail->next
   newTail->next = nullptr

旧尾已经通过环连接到旧头，所以这一次断开同时确定新头和新尾，完成全部重连。

旋转切口不变量
~~~~~~~~~~~~~~

统计长度后，``tail`` 指向原链表最后一个节点，``length`` 是节点总数。成环不会创建或删除节点，只新增
``tail -> head`` 这一条边。

从旧头向前走 ``length - shift - 1`` 步到达新尾，说明它前面保留 ``length - shift`` 个节点，后面保留
``shift`` 个节点。断开 ``newTail->next`` 后，环重新变成一条包含全部节点的单链表，起点正是原后缀的首节点。

必须先保存 ``newHead = newTail->next`` 再断开。若先断开，会丢失新头入口；若成环后不再断开，返回结果将
是循环链表。

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

三种方法的关系
~~~~~~~~~~~~~~

逐次右移真实执行每一次旋转；双指针法一次定位后缀起点；成环法进一步把“断开再拼接”压缩为“先连接旧尾，
再在新尾处断开”。三种方法产生相同切口，主入口调用指针关系最集中的 ``makeCycleAndCut``。

复杂度分析
~~~~~~~~~~

逐次右移方法最坏为 ``O(kn)`` 时间。双指针法和成环法都只进行常数次链表扫描，时间为 ``O(n)``，额外空间
为 ``O(1)``。

任何方法在最坏情况下都必须到达旧尾，才能确定长度与旋转切口，因此需要 ``Ω(n)`` 时间；主方法达到该下界。
