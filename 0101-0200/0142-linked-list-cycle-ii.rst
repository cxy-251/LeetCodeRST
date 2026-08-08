0142. Linked List Cycle II
==========================

题目信息
--------

:题号: 0142. 环形链表 II
:难度: Medium
:主题: 链表、Floyd 快慢指针、环入口、距离同余
:原题: `LeetCode 0142 <https://leetcode.com/problems/linked-list-cycle-ii/>`_
:重点: 先以速度差确认并取得环内相遇点，再利用头部距离与环内偏移的同余关系定位入口

题目重述
--------

给定可能含环的单链表 ``head``。若存在环，返回从链表头沿 ``next`` 首次进入环的那个节点对象；无环返回
``nullptr``。测试说明中的 ``pos`` 只用于描述尾节点连回的位置，不是函数参数。不能修改链表，节点值也
不能代替节点身份。

自建示例
--------

* ``9 -> 4 -> 7 -> 2 -> 5``，尾节点连回 ``7``：环入口是值为 ``7`` 的那个节点对象；
* ``1 -> 2 -> 3 -> nullptr``：不存在环，返回空；
* 单节点指向自身：头节点同时就是环入口；
* 若环从头节点开始，入口应返回 ``head``，而不是快慢指针第一次相遇时的任意环内位置。

C++ 实现
--------

.. code-block:: cpp

   #include <unordered_set>

   class Solution {
   private:
       ListNode* firstRepeatedIdentity(ListNode* head) {
           std::unordered_set<ListNode*> visited;
           for (ListNode* node = head;
                node != nullptr;
                node = node->next) {
               if (!visited.insert(node).second) {
                   return node;
               }
           }
           return nullptr;
       }

       ListNode* locateEntryWithFloyd(ListNode* head) {
           ListNode* slow = head;
           ListNode* fast = head;
           ListNode* meeting = nullptr;

           while (fast != nullptr && fast->next != nullptr) {
               slow = slow->next;
               fast = fast->next->next;
               if (slow == fast) {
                   meeting = slow;
                   break;
               }
           }
           if (meeting == nullptr) {
               return nullptr;
           }

           ListNode* fromHead = head;
           while (fromHead != meeting) {
               fromHead = fromHead->next;
               meeting = meeting->next;
           }
           return fromHead;
       }

   public:
       ListNode* detectCycle(ListNode* head) {
           return locateEntryWithFloyd(head);
       }
   };

题解
----

原始定义直接给出集合方案
~~~~~~~~~~~~~~~~~~~~~~~~

沿 ``next`` 前进时，第一次再次访问的节点就是环入口：入口之前的节点只出现一次，一旦进入环，最终最先
重复的正是入口。``firstRepeatedIdentity`` 用地址集合保存历史，插入失败时返回当前节点，时间 ``O(n)``、
空间 ``O(n)``。

集合中必须是节点指针。相同 ``val`` 的不同节点不构成重复，返回值也要求入口对象而不是入口的数值。要把
空间降为常量，需要先在不保存历史的情况下取得一个与环位置有关的锚点。

第一阶段：相遇只证明有环，还不一定是入口
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

慢指针每轮走一步，快指针走两步。无环时快指针必到达 ``nullptr``，代码通过
``fast != nullptr && fast->next != nullptr`` 安全结束。有环时两者进入环后相对速度为一，最多一圈会在
某个环内节点相遇。

这个 ``meeting`` 通常不是入口。例如自建示例中，入口是 ``7``，快慢指针第一次相遇可以发生在后面的
``2``。所以不能像上一题那样在相遇时直接返回，必须从运动距离中提取入口信息。

距离同余如何连接相遇点与入口
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

设：

* ``mu`` 为头节点到环入口的边数；
* ``lambda`` 为环长；
* ``x`` 为相遇点从入口沿环前进的偏移，``0 <= x < lambda``；
* ``t`` 为慢指针到第一次相遇时走过的总步数。

快指针走了 ``2t`` 步。两者在同一环位置，路程差 ``t`` 必是整圈长度的倍数，所以
``t ≡ 0 (mod lambda)``。慢指针的路径又满足 ``t ≡ mu + x (mod lambda)``，因此：

.. code-block:: text

   mu + x ≡ 0 (mod lambda)
   mu ≡ -x (mod lambda)

相遇点位于入口之后 ``x`` 步；从那里再走 ``mu`` 步，环内偏移变为 ``x + mu``，恰好是整圈倍数，最终
回到入口。

第二阶段为何把一根指针移回头
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

令 ``fromHead`` 从头出发，``meeting`` 留在第一次相遇点，两者都改为每轮一步。经过 ``mu`` 步：

* ``fromHead`` 刚走完非环前缀，到达入口；
* ``meeting`` 从偏移 ``x`` 又走 ``mu``，由上面的同余关系也到达入口。

在这之前 ``fromHead`` 仍位于环外、``meeting`` 已在环内，不可能指向同一对象，所以第二阶段第一次相等的
位置就是入口。若 ``mu = 0``，环从头开始；第一阶段相遇点也会在整圈后落回头，两指针无需移动便返回
``head``。

具体走读 ``9 -> 4 -> 7 -> 2 -> 5 -> 7``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

此时 ``mu = 2``、``lambda = 3``。第一阶段慢指针走三步到 ``2``，快指针走六步也到 ``2``，相遇点相对
入口偏移 ``x = 1``，满足 ``mu + x = 3``。

.. list-table::
   :header-rows: 1

   * - 第二阶段步数
     - ``fromHead``
     - ``meeting``
   * - ``0``
     - ``9``
     - ``2``
   * - ``1``
     - ``4``
     - ``5``
   * - ``2``
     - ``7``
     - ``7``，返回入口

代码状态与主解选择
~~~~~~~~~~~~~~~~~~

``meeting == nullptr`` 只表示第一阶段没有相遇；一旦相遇，第二阶段不再需要空指针检查，因为两根指针沿
同一有限前缀或环内移动，已由证明保证会合。整个过程只比较地址、不写 ``next``，链表结构保持不变。

公开入口采用 Floyd 两阶段算法。第一阶段至多走过非环前缀和常数圈，第二阶段走 ``mu`` 步，总时间
``O(n)``、空间 ``O(1)``。集合方案同为线性时间且更贴近“首次重复”定义，但需要 ``O(n)`` 地址；保留它
作为从问题定义到常量状态推导的基线。
