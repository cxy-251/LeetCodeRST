0148. Sort List
===============

题目信息
--------

:题号: 0148. 排序链表
:难度: Medium
:主题: 链表、归并排序、自底向上合并、常量辅助空间
:原题: `LeetCode 0148 <https://leetcode.com/problems/sort-list/>`_
:重点: 利用链表常数时间断链与归并，把二次插入查找降为 n log n，并用迭代轮次删除递归栈

题目重述
--------

给定单链表 ``head``，把所有节点按 ``val`` 非递减排列并返回新头节点。结果必须由全部原节点重新连接而成；
空链返回空。进阶目标为 ``O(n log n)`` 时间和 ``O(1)`` 额外空间。

自建示例
--------

* ``7 -> -1 -> 3 -> 3 -> 0`` 排序为 ``-1 -> 0 -> 3 -> 3 -> 7``，两个值为 ``3`` 的节点都保留；
* 逆序链 ``4 -> 3 -> 2 -> 1`` 经过宽度 ``1``、``2`` 的两轮归并后成为有序链；
* 空链和单节点链已经有序，直接返回。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   private:
       ListNode* mergeSortedRuns(ListNode* left, ListNode* right) {
           ListNode sentinel(0);
           ListNode* tail = &sentinel;

           while (left != nullptr && right != nullptr) {
               if (left->val <= right->val) {
                   tail->next = left;
                   left = left->next;
               } else {
                   tail->next = right;
                   right = right->next;
               }
               tail = tail->next;
           }
           tail->next = left == nullptr ? right : left;
           return sentinel.next;
       }

       ListNode* topDownMergeSort(ListNode* head) {
           if (head == nullptr || head->next == nullptr) {
               return head;
           }

           ListNode* slow = head;
           ListNode* fast = head->next;
           while (fast != nullptr && fast->next != nullptr) {
               slow = slow->next;
               fast = fast->next->next;
           }
           ListNode* right = slow->next;
           slow->next = nullptr;

           ListNode* sortedLeft = topDownMergeSort(head);
           ListNode* sortedRight = topDownMergeSort(right);
           return mergeSortedRuns(sortedLeft, sortedRight);
       }

       ListNode* cutRun(ListNode* head, int runLength) {
           while (head != nullptr && runLength > 1) {
               head = head->next;
               --runLength;
           }
           if (head == nullptr) {
               return nullptr;
           }
           ListNode* nextRun = head->next;
           head->next = nullptr;
           return nextRun;
       }

       ListNode* mergeRunsAndReturnTail(
           ListNode* left,
           ListNode* right,
           ListNode*& mergedTail
       ) {
           ListNode sentinel(0);
           ListNode* tail = &sentinel;

           while (left != nullptr && right != nullptr) {
               if (left->val <= right->val) {
                   tail->next = left;
                   left = left->next;
               } else {
                   tail->next = right;
                   right = right->next;
               }
               tail = tail->next;
           }
           tail->next = left == nullptr ? right : left;
           while (tail->next != nullptr) {
               tail = tail->next;
           }
           mergedTail = tail;
           return sentinel.next;
       }

       ListNode* bottomUpMergeSort(ListNode* head) {
           int nodeCount = 0;
           for (ListNode* node = head;
                node != nullptr;
                node = node->next) {
               ++nodeCount;
           }

           ListNode sentinel(0);
           sentinel.next = head;
           for (int width = 1; width < nodeCount; width *= 2) {
               ListNode* previousTail = &sentinel;
               ListNode* current = sentinel.next;

               while (current != nullptr) {
                   ListNode* left = current;
                   ListNode* right = cutRun(left, width);
                   current = cutRun(right, width);

                   ListNode* mergedTail = nullptr;
                   previousTail->next = mergeRunsAndReturnTail(
                       left,
                       right,
                       mergedTail
                   );
                   previousTail = mergedTail;
               }
           }
           return sentinel.next;
       }

   public:
       ListNode* sortList(ListNode* head) {
           return bottomUpMergeSort(head);
       }
   };

题解
----

为什么插入排序不够
~~~~~~~~~~~~~~~~~~

链表插入一个节点只需改常数条边，但找到插入位置仍要从有序前缀扫描。逆序输入中，第 ``i`` 个节点检查
``O(i)`` 个前驱，总时间 ``O(n^2)``。也可以把所有节点地址放进数组后调用排序，再重连链表；时间能达到
``O(n log n)``，却需要 ``O(n)`` 指针数组，没有利用链表自身可拆分、可顺序归并的结构。

归并排序的两个核心动作都适合链表：把一条链从中间断开只需改一个 ``next``，合并两条有序链只需比较当前
表头并移动指针，不需要数组式随机访问或整体搬移。因此可以同时达到稳定的 ``O(n log n)`` 时间。

方案一：自顶向下分治
~~~~~~~~~~~~~~~~~~~~

``topDownMergeSort`` 用快慢指针找到中间位置，先把 ``slow->next`` 保存为右半头，再置空断链。两半独立
递归排序后，``mergeSortedRuns`` 每次取较小表头接到结果尾部，某侧耗尽后直接接上另一侧剩余有序链。

递归的不变量清楚：函数返回时，输入节点集合不变且已排序。单节点是天然有序的终点；两个有序半链稳定
归并后整体有序。每层总共处理 ``n`` 个节点，分割深度 ``O(log n)``，时间 ``O(n log n)``。

该方案需要 ``O(log n)`` 递归栈。若严格追求 ``O(1)`` 辅助空间，仍要保留归并思想，但把递归层改写为
显式的段宽轮次，而且不能用一个长度为 ``log n`` 的任务栈。

自底向上的轮次不变量
~~~~~~~~~~~~~~~~~~~~

第一轮把每个单节点视为长度一的有序 run，两两合并成长度不超过二的有序 run；随后段宽 ``width`` 每轮
翻倍。进入某轮时，整条链已经由长度不超过 ``width`` 的有序 run 顺次组成；把相邻两段合并后，轮末得到
长度不超过 ``2 * width`` 的有序 run。段宽最终覆盖节点总数时，整链有序。

.. list-table::
   :header-rows: 1

   * - ``width``
     - 轮前有序段
     - 轮后有序段
   * - ``1``
     - 每个节点各自一段
     - 相邻两个节点归并
   * - ``2``
     - 每段长度最多二
     - 相邻两段归并为长度最多四
   * - ``4``
     - 每段长度最多四
     - 继续归并，直至覆盖整链

切出两段时为什么必须立刻断链
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

一次内层循环依次执行：

.. code-block:: text

   left = current
   right = cutRun(left, width)
   current = cutRun(right, width)

第一次 ``cutRun`` 走到左段最后节点，保存右段头后把左尾置空；第二次同理断开右段，并返回下一对 run 的
起点。若不断链，归并左段时会越过名义边界继续读入右段甚至后续节点，导致节点重复参与、错误连接或成环。

链尾可能不足 ``width``，甚至没有右段。``cutRun`` 遇到空就返回空；归并函数会把唯一非空段直接接上，
无需为末尾残段另写分支。

归并与尾指针如何接回主链
~~~~~~~~~~~~~~~~~~~~~~~~

``previousTail`` 是本轮已经合并部分的最后节点。归并返回新段头，同时通过 ``mergedTail`` 返回新段尾；
先令 ``previousTail->next`` 接新头，再把 ``previousTail`` 移到新尾，下一对 run 就能紧跟其后。

归并中相等时选择左段节点。左段在本轮原顺序上先于右段，因此相等节点跨段仍保持原相对顺序；递归到每轮
都成立，整个排序稳定。``mergeRunsAndReturnTail`` 在接上剩余链后走到真实尾部，这个额外尾扫描仍只遍历
本轮节点常数次，不改变每轮 ``O(n)`` 上界。

具体走读 ``4 -> 3 -> 2 -> 1``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

宽度一时切出 ``[4]`` 与 ``[3]``，合并为 ``[3,4]``；再把 ``[2]``、``[1]`` 合并为 ``[1,2]``，轮末为
``3 -> 4 -> 1 -> 2``。宽度二时切出这两段并合并，依次选择 ``1, 2, 3, 4``，得到整条有序链。所有动作
只改变原节点 ``next``，没有复制节点或值。

主解选择与复杂度
~~~~~~~~~~~~~~~~

公开入口采用自底向上归并，满足进阶要求：``O(log n)`` 轮，每轮访问所有节点常数次，时间
``O(n log n)``；除哨兵和固定指针外不分配随 ``n`` 增长的状态，辅助空间 ``O(1)``。自顶向下版本同样
稳定且更易从分治定义理解，代价是 ``O(log n)`` 调用栈，因此作为有真实实现取舍的方案保留。
