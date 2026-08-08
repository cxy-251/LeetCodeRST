0143. Reorder List
==================

题目信息
--------

:题号: 0143. 重排链表
:难度: Medium
:主题: 链表、快慢指针、反转链表、交替合并
:原题: `LeetCode 0143 <https://leetcode.com/problems/reorder-list/>`_
:重点: 将首尾交替的随机访问需求分解为找中点、反转后半段和双链交织，并保持节点集合与无环性

题目重述
--------

给定单链表 ``L0 -> L1 -> ... -> Ln``，原地重排为
``L0 -> Ln -> L1 -> L(n-1) -> L2 -> L(n-2) -> ...``。只能修改已有节点的 ``next`` 指针，不得修改
节点值，也不得用新节点替换原节点。函数直接修改输入链表，无需返回头节点。

自建示例
--------

* ``8 -> 3 -> 5 -> 1 -> 9`` 重排为 ``8 -> 9 -> 3 -> 1 -> 5``，奇数长度的中间节点 ``5`` 留在
  最后；
* ``4 -> 7 -> 2 -> 6`` 重排为 ``4 -> 6 -> 7 -> 2``，偶数长度两半各含两个节点；
* 空链、单节点链和双节点链的相对顺序都无需改变。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       void reorderWithNodeArray(ListNode* head) {
           std::vector<ListNode*> nodes;
           for (ListNode* node = head;
                node != nullptr;
                node = node->next) {
               nodes.push_back(node);
           }
           if (nodes.empty()) {
               return;
           }

           int left = 0;
           int right = static_cast<int>(nodes.size()) - 1;
           while (left < right) {
               nodes[left]->next = nodes[right];
               ++left;
               if (left == right) {
                   break;
               }
               nodes[right]->next = nodes[left];
               --right;
           }
           nodes[left]->next = nullptr;
       }

       ListNode* reverseList(ListNode* head) {
           ListNode* reversed = nullptr;
           while (head != nullptr) {
               ListNode* next = head->next;
               head->next = reversed;
               reversed = head;
               head = next;
           }
           return reversed;
       }

       void splitReverseAndMerge(ListNode* head) {
           if (head == nullptr || head->next == nullptr) {
               return;
           }

           ListNode* slow = head;
           ListNode* fast = head;
           while (fast->next != nullptr &&
                  fast->next->next != nullptr) {
               slow = slow->next;
               fast = fast->next->next;
           }

           ListNode* second = slow->next;
           slow->next = nullptr;
           second = reverseList(second);

           ListNode* first = head;
           while (second != nullptr) {
               ListNode* nextFirst = first->next;
               ListNode* nextSecond = second->next;
               first->next = second;
               second->next = nextFirst;
               first = nextFirst;
               second = nextSecond;
           }
       }

   public:
       void reorderList(ListNode* head) {
           splitReverseAndMerge(head);
       }
   };

题解
----

原始困难来自单链表没有向前指针
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

目标顺序要求交替取得最左、最右尚未使用的节点。数组可以用两个下标完成，但单链表从 ``Ln`` 无法直接走回
``L(n-1)``。最直观的 ``reorderWithNodeArray`` 先把所有节点地址放进数组，再用左右下标重连；它不复制
节点，只额外保存 ``O(n)`` 个指针。

数组方案还暴露了一个必要动作：最后必须把尾节点 ``next`` 设为空。旧链中的边在重连过程中并非全部自动
消失，遗漏断尾可能让最终节点仍指向已放到前面的节点，形成环。

怎样把“倒序取后半段”变成顺序访问
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

目标序列的后半部分按 ``Ln, L(n-1), ...`` 消耗。若先把链表切成前后两段，再原地反转后半段，两个待合并
序列都可以只沿 ``next`` 向前读取：

.. code-block:: text

   原链：      L0 -> L1 -> L2 -> L3 -> L4
   切分：      L0 -> L1 -> L2      L3 -> L4
   反转后半：  L0 -> L1 -> L2      L4 -> L3
   交替合并：  L0 -> L4 -> L1 -> L3 -> L2

这个结构信息把节点数组承担的随机访问工作，转换成三次线性指针操作。

中点为何这样选择
~~~~~~~~~~~~~~~~

``slow``、``fast`` 都从头开始，快指针每轮走两步。循环要求 ``fast->next`` 和
``fast->next->next`` 都存在，因此停止时 ``slow`` 位于前半段最后一个节点：

* 奇数长度 ``5``：``slow`` 停在下标 ``2``，前半段三节点、后半段两节点；
* 偶数长度 ``4``：``slow`` 停在下标 ``1``，两段各两节点。

让奇数长度的前半段多一个节点，正好使唯一中间节点最后留在第一链尾部。取出 ``second = slow->next`` 后
立即写 ``slow->next = nullptr``，把两段彻底断开；这既给前半段建立尾部，也保证后续反转和合并面对两条
互不相交的有限链。

反转阶段保存的状态
~~~~~~~~~~~~~~~~~~

``reverseList`` 每次改写当前节点 ``next`` 前，先用 ``next`` 保存尚未处理的原后继；``reversed`` 始终是
已经反转好的前缀头。若先改指针再保存后继，剩余后半链会丢失。反转不创建或删除节点，只改变第二段内部
边的方向。

合并时为何必须先保存两条后继
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

每轮要把 ``first -> nextFirst`` 和 ``second -> nextSecond`` 改成
``first -> second -> nextFirst``。一旦写入新边，原后继就可能不再可达，所以代码先保存
``nextFirst``、``nextSecond``，完成两次连接后再让两个游标各自前进。

.. list-table::
   :header-rows: 1

   * - 合并前待处理头
     - 本轮新边
     - 下一轮待处理头
   * - ``first=L0``、``second=L4``
     - ``L0 -> L4 -> L1``
     - ``first=L1``、``second=L3``
   * - ``first=L1``、``second=L3``
     - ``L1 -> L3 -> L2``
     - 第二链为空，停止

后半段长度永远不超过前半段，所以以 ``second != nullptr`` 为循环条件时，``first`` 一定存在。偶数长度在
最后一轮连接到 ``nextFirst == nullptr``；奇数长度则连接到剩余中间节点，而它已因切分成为空尾。

为什么没有节点丢失、重复或成环
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

切分后两段节点集合互斥且并集为原节点集合；反转只重排第二段；合并每轮从第二段消费一个节点并插入第一段
相邻位置，没有创建或复用额外节点。两段在合并前都以空结束，且游标只向各自未处理后缀前进，最终连接也
落到未消费节点或空指针，因此不会形成回边。

主解选择与复杂度
~~~~~~~~~~~~~~~~

公开入口采用切分、反转、合并。三阶段各为线性扫描，总时间 ``O(n)``，只维护固定数量指针，额外空间
``O(1)``。节点数组方案同样清楚且时间 ``O(n)``，但需 ``O(n)`` 指针空间；保留它作为首尾访问需求的直接
基线，主解则利用“后半段只需要倒序读取”删除整张索引表。
