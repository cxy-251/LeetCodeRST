0021. Merge Two Sorted Lists
============================

题目信息
--------

:题号: 0021
:难度: Easy
:主题: 链表、归并、递归、双指针
:原题: `LeetCode 0021 <https://leetcode.com/problems/merge-two-sorted-lists/>`_
:重点: 每次从两个未处理表头中选择较小节点，并复用原节点构造有序结果

题目重述
--------

给定两个按非递减顺序排列的单链表 ``list1`` 和 ``list2``，把两条链表中的全部节点合并成一条新的非递减
链表，并返回结果头节点。

输入链表都可能为空。两个当前节点值相等时，可以先接入任意一个；结果只要求保留全部节点并满足非递减顺序。
合并过程可以修改原链表的 ``next`` 指针，不需要为节点值创建副本。

自建示例
--------

* 交错取值：``list1 = [1, 4, 7]``，``list2 = [2, 3, 8]``，返回 ``[1, 2, 3, 4, 7, 8]``；
* 包含重复值：``list1 = [1, 2, 2]``，``list2 = [1, 2, 5]``，返回 ``[1, 1, 2, 2, 2, 5]``；
* 一条链表为空：``list1 = []``，``list2 = [-3, 0, 6]``，直接返回第二条链表；
* 两条链表都为空：``list1 = []``，``list2 = []``，返回空链表。

C++ 实现
--------

.. code-block:: cpp

   // LeetCode 提供 ListNode 定义。
   class Solution {
   private:
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

从两个表头中选择
~~~~~~~~~~~~~~~~

任意时刻，``first`` 和 ``second`` 分别指向两条链表尚未处理的后缀。每个后缀本身有序，因此该后缀中的
最小节点一定是当前表头。所有未处理节点的最小值只可能是 ``first`` 与 ``second`` 两个表头中的较小者。

若 ``first->val <= second->val``，把 ``first`` 接到结果尾部，然后令 ``first`` 前进一位；反之选择
``second``。选择完成后，两条剩余后缀仍然有序，问题重新变成同样的两路归并。

这个局部选择不会错过更小节点：被选中的表头不大于另一条链表的表头，而另一条链表后面的节点又不小于自己的
表头，所以当前被选节点就是全体未处理节点中的最小值。

迭代过程的不变量
~~~~~~~~~~~~~~~~

``iterativeMerge`` 在每轮开始前维护以下状态：

* ``dummy.next`` 到 ``tail`` 是已经完成的非递减结果前缀；
* 这个前缀恰好包含两条链表中已经越过的节点，每个节点只出现一次；
* ``first`` 和 ``second`` 指向尚未接入结果的两个有序后缀。

每轮接入两个表头中的较小者。若结果前缀非空，它不小于当前结果尾值；它也不大于任何其他未处理节点，因此
结果前缀继续有序。随后只推进被选中的链表指针，已处理节点与两个未处理后缀仍然互不重叠，不变量保持成立。

虚拟头节点
~~~~~~~~~~

结果链表开始时还没有真实节点。若直接维护真实头节点，第一次接入节点需要单独赋值，之后才使用
``tail->next``。虚拟节点 ``dummy`` 预先提供一个固定前驱，使第一次和后续接入都执行同一组操作：

#. 令 ``tail->next`` 指向选中的节点；
#. 推进对应输入指针；
#. 令 ``tail`` 移到刚接入的节点。

虚拟节点不属于结果，最终返回 ``dummy.next``。两条输入链表同时为空时，``dummy.next`` 自然为
``nullptr``。

接入剩余后缀
~~~~~~~~~~~~

主循环在至少一条链表耗尽时结束。另一条链表的剩余部分已经有序，并且其表头不小于结果尾节点；若它更小，
上一轮就应当先选择它。因此可以把整个剩余后缀一次连接到 ``tail->next``，不必逐个节点继续扫描。

这里连接的是原链表节点，而不是复制节点。每轮只修改结果尾部的 ``next``，并在继续处理前保留下一未处理节点
的位置；循环结束后再接入唯一剩余后缀，所以原有每个节点恰好进入结果一次。

递归表达
~~~~~~~~

``recursiveMerge`` 使用相同的表头选择。较小表头确定为当前结果首节点，它的 ``next`` 指向两个剩余后缀的
递归合并结果。任一链表为空时，另一条链表本身就是完整有序答案。

递归写法直接对应问题定义，递归深度最坏达到两条链表节点数之和。公开入口采用迭代方法，它保持相同的选择逻辑，
并将额外工作空间降为常数。

复杂度分析
~~~~~~~~~~

设两条链表长度分别为 ``m`` 和 ``n``。每个节点最多被选中并接入一次，迭代与递归方法的时间复杂度均为
``O(m+n)``。

迭代方法只维护常数个指针，工作空间为 ``O(1)``；递归方法的调用栈最坏为 ``O(m+n)``。两种方法都复用输入
节点，返回链表本身不计入额外空间。
