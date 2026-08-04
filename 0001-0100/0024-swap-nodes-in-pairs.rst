0024. Swap Nodes in Pairs
=========================

题目信息
--------

:题号: 0024
:难度: Medium
:主题: 链表、数组、递归、指针重连
:原题: `LeetCode 0024 <https://leetcode.com/problems/swap-nodes-in-pairs/>`_
:重点: 从显式保存节点顺序，推导到只维护当前节点对的四个边界，并用虚拟头节点原地完成分组重连

题目重述
--------

给定单链表头节点 ``head``，从链表开头开始，每两个相邻节点组成一组，交换组内两个节点在链表中的位置，返回
处理后的头节点。

交换对象是节点本身，必须修改节点之间的 ``next`` 指针，不能只交换节点保存的数值。各组按照原链表顺序划分，
相邻组之间不交叉；若节点总数为奇数，最后一个无法组成完整节点对的节点保持原位置。

链表节点数量位于 ``[0, 100]``，每个节点值位于 ``[0, 100]``。输入可以为空链表，交换过程中不需要创建或
删除真实节点。

自建示例
--------

* 偶数个节点：``[1, 2, 3, 4] -> [2, 1, 4, 3]``；
* 奇数个节点：``[1, 4, 7, 9, 2] -> [4, 1, 9, 7, 2]``，末尾节点 ``2`` 不参与交换；
* 节点值相同：``[5, 5, 8] -> [5, 5, 8]``，数值序列看似不变，但前两个节点的身份已经交换；
* 两个节点：``[8, 3] -> [3, 8]``，原第二个节点成为新的链表头；
* 单个节点和空链表：``[6] -> [6]``，``[] -> []``。

C++ 实现
--------

.. code-block:: cpp

   #include <utility>
   #include <vector>

   // LeetCode 提供 ListNode 定义。
   class Solution {
   private:
       ListNode* collectAndReconnect(ListNode* head) {
           std::vector<ListNode*> nodes;
           for (ListNode* node = head; node != nullptr; node = node->next) {
               nodes.push_back(node);
           }
           for (int index = 0; index + 1 < static_cast<int>(nodes.size()); index += 2) {
               std::swap(nodes[index], nodes[index + 1]);
           }
           for (int index = 1; index < static_cast<int>(nodes.size()); ++index) {
               nodes[index - 1]->next = nodes[index];
           }
           if (!nodes.empty()) {
               nodes.back()->next = nullptr;
           }
           return nodes.empty() ? nullptr : nodes.front();
       }

       ListNode* recursiveSwap(ListNode* head) {
           if (head == nullptr || head->next == nullptr) {
               return head;
           }
           ListNode* first = head;
           ListNode* second = first->next;
           ListNode* remainder = recursiveSwap(second->next);
           first->next = remainder;
           second->next = first;
           return second;
       }

       ListNode* iterativeSwap(ListNode* head) {
           ListNode dummy(0, head);
           ListNode* previous = &dummy;
           while (previous->next != nullptr && previous->next->next != nullptr) {
               ListNode* first = previous->next;
               ListNode* second = first->next;
               ListNode* after = second->next;

               first->next = after;
               second->next = first;
               previous->next = second;
               previous = first;
           }
           return dummy.next;
       }

   public:
       ListNode* swapPairs(ListNode* head) {
           return iterativeSwap(head);
       }
   };

题解
----

节点语义
~~~~~~~~

最容易想到的是每两个节点交换一次 ``val``。这种做法只能让输出的数值序列看起来正确，节点在链表中的位置并未
改变。

例如两个不同节点 ``A``、``B`` 都保存数值 ``5``。题目要求链接由 ``A -> B`` 变成 ``B -> A``；交换数值后
仍然是 ``A -> B``，甚至从数值序列中看不出任何变化。调用者若另外持有 ``A`` 的指针，也能观察到它仍位于原来的
节点位置。因此交换值不属于这道题允许的解法，真正需要改变的是节点身份在链中的先后关系。

显式保存顺序
~~~~~~~~~~~~

在不直接处理指针细节时，可以先遍历链表，把所有节点指针依次放入数组。随后交换数组中下标 ``0`` 与 ``1``、
``2`` 与 ``3`` 等相邻位置，最后按照数组的新顺序重新连接节点。

``collectAndReconnect`` 是一个正确基线：

* 第一次遍历完整保存原节点顺序；
* 数组中的相邻指针交换准确表达每一组的新顺序；
* 第二次遍历数组重建全部 ``next``；
* 奇数长度时，最后一个数组元素没有配对，自然保持在末尾。

设链表长度为 ``n``。该方法只需 ``O(n)`` 时间，却保存了全部 ``n`` 个节点指针。真正需要改变的始终只有当前
一对节点及其与前后链表的连接，完整节点数组包含了大量暂时无关的状态。

局部边界
~~~~~~~~

处理当前节点对时，把链表分成三个部分：已经完成交换的前缀、当前两个节点、尚未处理的后缀。

.. code-block:: text

   已处理前缀 -> previous -> first -> second -> after

四个指针的含义分别是：

* ``previous``：当前节点对之前的最后一个节点；
* ``first``：当前组的第一个节点；
* ``second``：当前组的第二个节点；
* ``after``：下一组的首节点，可能为空。

数组方法保存整条链表的新顺序，而局部方法只需把上述结构改为：

.. code-block:: text

   已处理前缀 -> previous -> second -> first -> after

组外节点顺序完全不变，所以每轮只需要改写三条边界链接。

后缀入口
~~~~~~~~

原后缀只能通过 ``second->next`` 到达。若直接执行 ``second->next = first``，这个字段会被覆盖；没有提前保存
原值时，算法将失去 ``after``，后面的整条链表无法再接回。

因此每轮首先读取：

.. code-block:: cpp

   ListNode* after = second->next;

保存后缀入口后，代码按以下顺序重连：

#. ``first->next = after``：旧组头将成为新组尾，先让它接回后缀；
#. ``second->next = first``：建立组内反向链接；
#. ``previous->next = second``：让已处理前缀接到当前组的新组头。

第一步先切断 ``first -> second``，所以第二步不会临时形成 ``first <-> second`` 的环。三步完成后，前缀、当前组
与后缀重新组成一条完整链表，没有节点丢失或重复。

分组推进
~~~~~~~~

交换前 ``first`` 是当前组头，交换后它变成当前组尾。令 ``previous = first`` 后，``previous->next`` 正好指向
原来的 ``after``，下一轮便从下一组开始。

循环开始时维护以下状态：

* ``dummy.next`` 到 ``previous`` 已经按相邻两节点完成交换；
* ``previous->next`` 是尚未处理后缀的首节点；
* 已处理前缀和未处理后缀共同包含原链表全部节点，二者不重叠。

一轮只消费未处理后缀的前两个节点，再把 ``previous`` 移到本组新尾，因此各组互不交叉且每个完整节点对只处理
一次。当 ``previous->next`` 为空时没有剩余节点；当它存在但 ``previous->next->next`` 为空时只剩一个节点。
两种情况都不再进入循环，奇数尾节点的原链接自然保留。

虚拟头节点
~~~~~~~~~~

第一组交换会改变真实头节点。若没有额外前驱，第一次交换必须单独设置新头；之后的组才有普通前驱节点，可以通过
前驱的 ``next`` 接回。

虚拟节点 ``dummy`` 令原头节点也拥有前驱。初始化 ``previous = &dummy`` 后，第一组和后续组都执行相同的
``previous->next = second``。最终返回 ``dummy.next``，它会自动指向第一组交换后的新头；空链表和单节点链表
也无需额外分支。

状态演化
~~~~~~~~

以 ``[1, 2, 3, 4, 5]`` 为例：

.. list-table::
   :header-rows: 1

   * - ``previous``
     - 当前组
     - ``after``
     - 重连后的链表
     - 新 ``previous``
   * - ``dummy``
     - ``1, 2``
     - ``3``
     - ``2 -> 1 -> 3 -> 4 -> 5``
     - ``1``
   * - ``1``
     - ``3, 4``
     - ``5``
     - ``2 -> 1 -> 4 -> 3 -> 5``
     - ``3``
   * - ``3``
     - 不足两个节点
     - 空
     - ``2 -> 1 -> 4 -> 3 -> 5``
     - 结束

每轮结束后，``previous`` 都位于刚处理节点对的新尾部，而不是新头部。只有这样，下一轮才能从紧随其后的未处理
节点开始。

递归分解
~~~~~~~~

递归方法使用相同的分组边界。若当前链表不足两个节点，它本身就是无需交换的后缀，直接返回 ``head``。

节点足够时，``first`` 与 ``second`` 是当前组，``second->next`` 是剩余后缀。先递归得到后缀交换后的头节点
``remainder``，再执行：

.. code-block:: text

   first.next = remainder
   second.next = first

``first`` 成为当前组尾并连接处理后的后缀，``second`` 成为当前子问题的新头。返回 ``second`` 后，上一层会把
自己的组尾接到它。

递归返回值承担了迭代方法中 ``previous`` 的连接作用。代码结构紧贴“交换当前一对，再处理剩余链表”的定义，
但每个节点对需要一层调用栈。迭代方法用虚拟头节点和 ``previous`` 显式保存组间边界，把调用栈压缩为固定指针。

代码演进
~~~~~~~~

交换节点值没有改变节点身份，因此首先被题意排除。

``collectAndReconnect`` 保存全部节点指针，在数组中完成相邻位置交换，再重建整条链表。它给出了正确结果，但为了
处理一个局部节点对保存了全局顺序。

观察到每组只影响前驱、两个组内节点和后缀入口后，``recursiveSwap`` 删除节点数组和全链重建。每层递归处理一个
节点对，并通过返回值连接已经交换的后缀。

``iterativeSwap`` 进一步用 ``previous`` 代替递归返回链，虚拟头节点删除第一组的特殊处理。每轮保存 ``after``、
改写三条链接并前进两个节点，公开入口采用这一常数空间方法。

复杂度分析
~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 主要代价
   * - 节点数组重连
     - ``O(n)``
     - ``O(n)``
     - 保存全部节点指针并重建全部链接
   * - 递归局部交换
     - ``O(n)``
     - ``O(n)``
     - 每个节点对一层递归调用
   * - 迭代局部交换
     - ``O(n)``
     - ``O(1)``
     - 每个完整节点对改写三条链接

三种有效方法都复用原节点，返回链表本身不计入工作空间。递归深度约为 ``n / 2``，渐进空间仍记为 ``O(n)``；
迭代方法只维护固定数量的节点指针。