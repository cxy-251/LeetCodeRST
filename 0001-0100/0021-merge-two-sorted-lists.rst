0021. Merge Two Sorted Lists
============================

题目信息
--------

:题号: 0021
:难度: Easy
:主题: 链表、排序、归并、递归、双指针
:原题: `LeetCode 0021 <https://leetcode.com/problems/merge-two-sorted-lists/>`_
:重点: 从收集全部节点重新排序，推导到只比较两个有序后缀的表头，并用尾指针原地完成两路归并

题目重述
--------

给定两个按非递减顺序排列的单链表 ``list1`` 和 ``list2``，把两条链表中的全部节点合并为一条同样按非递减
顺序排列的链表，并返回结果头节点。

两条输入链表都可能为空。结果必须保留所有节点，值相同的不同节点不能被合并或丢弃。题目允许修改原节点的
``next`` 指针，因此可以直接复用输入节点，不需要为每个值创建新节点。两个当前节点值相等时，先接入任意一个
都不影响结果合法性。

链表节点总数位于 ``[0, 100]``，节点值位于 ``[-100, 100]``。

自建示例
--------

* 交错取值：``list1 = [1, 4, 7]``、``list2 = [2, 3, 8]``，返回 ``[1, 2, 3, 4, 7, 8]``；
* 包含重复值：``list1 = [1, 2, 2]``、``list2 = [1, 2, 5]``，返回 ``[1, 1, 2, 2, 2, 5]``；
* 两侧长度不同：``list1 = [-4, 6]``、``list2 = [-3, 0, 2, 9]``，返回 ``[-4, -3, 0, 2, 6, 9]``；
* 一条链表为空：``list1 = []``、``list2 = [-3, 0, 6]``，返回原第二条链表；
* 两条链表都为空：``list1 = []``、``list2 = []``，返回空链表。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   // LeetCode 提供 ListNode 定义。
   class Solution {
   private:
       ListNode* collectAndSort(ListNode* first, ListNode* second) {
           std::vector<ListNode*> nodes;
           for (ListNode* node = first; node != nullptr; node = node->next) {
               nodes.push_back(node);
           }
           for (ListNode* node = second; node != nullptr; node = node->next) {
               nodes.push_back(node);
           }
           if (nodes.empty()) {
               return nullptr;
           }
           std::sort(nodes.begin(), nodes.end(), [](const ListNode* left, const ListNode* right) {
               return left->val < right->val;
           });
           for (int index = 1; index < static_cast<int>(nodes.size()); ++index) {
               nodes[index - 1]->next = nodes[index];
           }
           nodes.back()->next = nullptr;
           return nodes.front();
       }

       ListNode* recursiveMerge(ListNode* first, ListNode* second) {
           if (first == nullptr) {
               return second;
           }
           if (second == nullptr) {
               return first;
           }
           if (first->val <= second->val) {
               first->next = recursiveMerge(first->next, second);
               return first;
           }
           second->next = recursiveMerge(first, second->next);
           return second;
       }

       ListNode* iterativeMerge(ListNode* first, ListNode* second) {
           ListNode dummy;
           ListNode* tail = &dummy;
           while (first != nullptr && second != nullptr) {
               if (first->val <= second->val) {
                   tail->next = first;
                   first = first->next;
               } else {
                   tail->next = second;
                   second = second->next;
               }
               tail = tail->next;
           }
           tail->next = first != nullptr ? first : second;
           return dummy.next;
       }

   public:
       ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
           return iterativeMerge(list1, list2);
       }
   };

题解
----

收集后重新排序
~~~~~~~~~~~~~~

暂时不利用两条链表已经有序这一条件，可以先遍历它们，把全部节点指针放入数组，按节点值排序，再按照排序结果
重新设置每个节点的 ``next``。``collectAndSort`` 就是这种直接方法。

它不会遗漏节点：两个遍历把每个输入节点各收集一次，排序只改变指针在数组中的次序，最后按该次序重建一条链。
相同值的节点即使排序后先后次序不确定，也仍是两个独立指针，都会保留在结果中。

设总节点数为 ``N``。收集和重连都是 ``O(N)``，排序需要 ``O(N log N)``，还要保存 ``N`` 个节点指针。
真正的浪费是：两个输入内部的大小关系原本已经全部确定，这种方法却把这些信息丢掉，再对所有节点做一次通用排序。

有序后缀
~~~~~~~~

遍历过程中，``first`` 与 ``second`` 分别指向两条链表尚未处理的后缀。因为每个后缀仍按非递减顺序排列，
后缀最小值必定位于它的表头。

因此，全体未处理节点中的最小值不需要从 ``N`` 个节点中重新搜索，只可能是以下两个候选之一：

* ``first`` 指向的节点；
* ``second`` 指向的节点。

若 ``first->val <= second->val``，则 ``first`` 不大于第二条链表的表头，而第二条链表中的其他节点又都不小于
自己的表头，所以 ``first`` 不大于任何未处理节点，可以安全接入结果。另一种情况完全对称。

接入一个表头后只推进对应指针。被推进链表的剩余部分仍然有序，另一条链表没有变化，于是同样的两个候选模型
在下一轮自动恢复。通用排序因此被替换为一次从左到右的两路归并。

状态演化
~~~~~~~~

以 ``list1 = [1, 4, 7]``、``list2 = [2, 3, 8]`` 为例：

.. list-table::
   :header-rows: 1

   * - ``first``
     - ``second``
     - 本轮选择
     - 已完成前缀
   * - 1
     - 2
     - 1
     - ``1``
   * - 4
     - 2
     - 2
     - ``1 -> 2``
   * - 4
     - 3
     - 3
     - ``1 -> 2 -> 3``
   * - 4
     - 8
     - 4
     - ``1 -> 2 -> 3 -> 4``
   * - 7
     - 8
     - 7
     - ``1 -> 2 -> 3 -> 4 -> 7``
   * - 空
     - 8
     - 整体接入第二条后缀
     - ``1 -> 2 -> 3 -> 4 -> 7 -> 8``

每次比较只确定结果中的下一个节点，不需要提前知道后续节点的完整交错次序。

递归分解
~~~~~~~~

若两条链表都非空，两个表头中的较小者已经能够确定为当前结果的首节点。假设 ``first`` 较小，则剩余答案是
``first->next`` 与 ``second`` 的合并结果：

.. code-block:: text

   first -> merge(first.next, second)

``recursiveMerge`` 直接按照这个定义改写 ``first->next``，并返回 ``first``。若任一链表为空，另一条链表本身
已经有序，可以直接返回，既是递归终点，也是剩余后缀整体接入的情况。

递归每层确定一个结果节点，代码紧贴问题分解。不过相邻层只需要记住“当前选中了哪个节点以及剩余两个表头”，
调用栈最坏仍会为每个节点保存一层状态。算法的选择规则已经足够简单，可以改用显式指针顺序执行。

尾指针归并
~~~~~~~~~~

``iterativeMerge`` 用 ``tail`` 指向已完成结果的最后一个节点。每轮比较两个表头，把较小节点接到
``tail->next``，推进对应输入指针，再让 ``tail`` 移到新接入节点。

循环开始时保持三个事实：

* ``dummy.next`` 到 ``tail`` 是已经确定的非递减结果前缀；
* 该前缀恰好包含两个输入中已经越过的节点，每个节点出现一次；
* ``first`` 与 ``second`` 指向两个尚未处理的有序后缀。

本轮选中的表头是全部未处理节点中的最小值，所以它不会破坏结果前缀的顺序。只推进被选中的输入指针后，已处理
节点和两个未处理后缀仍然互不重叠，循环状态继续成立。

虚拟头节点
~~~~~~~~~~

结果开始时没有真实头节点。若直接维护 ``head`` 与 ``tail``，第一次选中节点时需要同时初始化二者，后续才能
统一使用 ``tail->next``。

虚拟节点 ``dummy`` 预先提供一个固定前驱，使第一次和之后的接入都执行相同操作。它本身不属于结果，最终返回
``dummy.next``。两条输入都为空时，循环不会执行，``dummy.next`` 自然为 ``nullptr``。

剩余后缀
~~~~~~~~

主循环在至少一条链表为空时停止。此时另一条链表的剩余部分本身已经有序，并且其所有节点都不小于已经接入的
结果尾值，否则其中更小的表头早已在上一轮被选择。

所以只需执行一次 ``tail->next = first != nullptr ? first : second``，把完整后缀接入结果。逐节点继续循环虽然
也能得到正确答案，却会重复执行已经不再需要的空指针判断和尾指针移动。

代码演进
~~~~~~~~

``collectAndSort`` 收集全部节点并重新排序。它不利用输入链表内部已经存在的顺序，需要节点数组、通用排序和完整
重连。

识别出每个未处理后缀的最小值就是表头后，候选集合从全部剩余节点缩减为两个表头。``recursiveMerge`` 删除节点
数组和排序过程，每层只选择一个表头，再递归合并剩余后缀。

``iterativeMerge`` 保留相同的表头选择，使用 ``tail`` 和两个输入指针替代递归调用栈。虚拟头节点又删除了首次
接入的特殊分支；某侧耗尽后，剩余有序后缀通过一次链接整体接入。

公开入口采用 ``iterativeMerge``。它复用输入节点，在保持线性时间的同时只使用常数工作空间。

复杂度分析
~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 主要代价
   * - 收集后排序
     - ``O((m+n) log(m+n))``
     - ``O(m+n)``
     - 保存全部节点指针并进行通用排序
   * - 递归归并
     - ``O(m+n)``
     - ``O(m+n)``
     - 每个节点选择一次，空间来自递归调用栈
   * - 迭代归并
     - ``O(m+n)``
     - ``O(1)``
     - 每个节点最多作为表头参与一次选择

设两条链表长度分别为 ``m`` 和 ``n``。三种方法都复用原节点，返回链表本身不计入工作空间。迭代方法在一侧
耗尽后直接接入剩余后缀，因此其中部分节点甚至不再需要逐个比较。