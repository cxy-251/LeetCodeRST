0023. Merge k Sorted Lists
==========================

题目信息
--------

:题号: 0023
:难度: Hard
:主题: 链表、归并、分治、优先队列
:原题: `LeetCode 0023 <https://leetcode.com/problems/merge-k-sorted-lists/>`_
:重点: 将两路归并扩展到多路归并，并控制每个节点参与比较的次数

题目重述
--------

给定一个链表数组 ``lists``，其中每条单链表都按节点值非递减排列。把所有链表中的节点合并为一条非递减链表，
返回合并后的头节点。

输入数组可以为空，数组中的任意链表也可以为空。``lists`` 的长度位于 ``[0, 10^4]``，所有链表的节点总数
不超过 ``10^4``，节点值位于 ``[-10^4, 10^4]``。结果应保留所有节点，包括值相同的不同节点；可以重新连接
原节点，无需创建对应的新节点。

自建示例
--------

* 一般情况：``lists = [[1, 4, 7], [2, 5], [3, 6, 9]]``，返回
  ``[1, 2, 3, 4, 5, 6, 7, 9]``；
* 包含空链表：``lists = [[], [-2, 3, 3], [0, 3]]``，返回 ``[-2, 0, 3, 3, 3]``；
* 输入数组为空：``lists = []``，返回空链表；
* 所有链表均为空：``lists = [[], [], []]``，返回空链表；
* 只有一条链表：``lists = [[-1, 2, 2]]``，直接返回这条链表。

C++ 实现
--------

.. code-block:: cpp

   #include <queue>
   #include <vector>

   class Solution {
   private:
       struct GreaterNode {
           bool operator()(const ListNode* left, const ListNode* right) const {
               return left->val > right->val;
           }
       };

       ListNode* mergeTwo(ListNode* first, ListNode* second) {
           ListNode dummy(0);
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

       ListNode* mergeSequentially(const std::vector<ListNode*>& lists) {
           ListNode* merged = nullptr;
           for (ListNode* head : lists) {
               merged = mergeTwo(merged, head);
           }
           return merged;
       }

       ListNode* mergeByIntervals(std::vector<ListNode*> lists) {
           const int count = static_cast<int>(lists.size());
           if (count == 0) {
               return nullptr;
           }
           for (int interval = 1; interval < count; interval *= 2) {
               for (int start = 0; start + interval < count; start += 2 * interval) {
                   lists[start] = mergeTwo(lists[start], lists[start + interval]);
               }
           }
           return lists[0];
       }

       ListNode* mergeWithHeap(const std::vector<ListNode*>& lists) {
           std::priority_queue<ListNode*, std::vector<ListNode*>, GreaterNode> candidates;
           for (ListNode* head : lists) {
               if (head != nullptr) {
                   candidates.push(head);
               }
           }

           ListNode dummy(0);
           ListNode* tail = &dummy;
           while (!candidates.empty()) {
               ListNode* node = candidates.top();
               candidates.pop();
               ListNode* next = node->next;

               tail->next = node;
               tail = node;
               if (next != nullptr) {
                   candidates.push(next);
               }
           }
           tail->next = nullptr;
           return dummy.next;
       }

   public:
       ListNode* mergeKLists(std::vector<ListNode*>& lists) {
           return mergeByIntervals(lists);
       }
   };

题解
----

两路归并是基本操作
~~~~~~~~~~~~~~~~~~

任意一条有序链表的最小未处理节点都在当前表头。合并两条链表时，全局最小未处理节点只能是两个表头中较小的
一个；把它接入结果并推进对应指针后，剩余问题仍是两条有序链表的归并。

``mergeTwo`` 复用输入节点，每轮恰好消耗一个表头。某条链表耗尽后，另一条剩余部分已经有序，并且其中所有值
都不小于已接入结果的最后一个值，所以可以整体连接。若两条链表共有 ``x`` 个节点，该操作耗时 ``O(x)``。

顺序累加为何可能退化
~~~~~~~~~~~~~~~~~~~~

最直接的扩展是先合并第 0、1 条链表，再把结果与第 2 条合并，依次处理全部链表。``mergeSequentially`` 的结果
始终正确，但早期进入结果的节点会在以后每次归并中被重新扫描。

假设 ``k`` 条链表长度接近，节点总数为 ``N``。第 ``i`` 次归并要扫描前 ``i`` 条链表积累出的长结果，总代价
近似为：

.. math::

   \frac{N}{k}(1+2+\cdots+k)=O(Nk)

问题不在两路归并本身，而在归并顺序极不平衡：一个不断增长的长链表反复与短链表合并。

分治如何限制重复扫描
~~~~~~~~~~~~~~~~~~~~

``mergeByIntervals`` 先合并相邻的单条链表，再合并相邻的两条链表结果，之后合并四条、八条，直到只剩一个
结果。``interval`` 表示当前每个已归并分组覆盖的原链表数量。

在同一层中，各次两路归并处理的节点集合互不重叠，所以这一层总共只扫描 ``N`` 个节点。每经过一层，分组规模
至少翻倍，因此最多有 ``ceil(log2 k)`` 层。每个节点每层至多参与一次归并，总时间为 ``O(N log k)``。

不能配成一对的尾部分组会留到下一层。它已经有序，之后再与相邻分组归并即可，因此 ``k`` 不是二的幂也不会
遗漏任何链表。公开入口采用这一方法，它直接复用了第 21 题的两路归并，并重新连接原节点。

最小堆维护当前候选
~~~~~~~~~~~~~~~~~~

多路归并也可以直接决定结果的下一个节点。每条未耗尽链表的最小节点仍是其表头，所以全局最小未处理节点一定在
这些表头之中。``mergeWithHeap`` 把每条非空链表的当前表头放入最小堆，堆顶就是下一项。

弹出某条链表的表头后，它的后继才成为该链表新的最小未处理节点，因此只需把这个后继加入堆。循环过程中，每条
未耗尽链表在堆中恰有一个代表：

* 不需要放入更深节点，因为它们不小于本链表当前表头；
* 不能缺少当前表头，否则该链表的最小值可能被遗漏；
* 堆顶不大于所有链表代表，也就不大于任何未处理节点。

因此每次弹出的节点都可以安全接在结果尾部。相同值的节点仍是不同指针，会分别入堆和出堆，不会被去重。

分治与最小堆的关系
~~~~~~~~~~~~~~~~~~

两种主流方法都让一个节点只承担 ``O(log k)`` 级别的比较成本：

* 分治让节点沿平衡归并树逐层向上，每层最多被扫描一次；
* 最小堆让节点入堆、出堆各一次，每次堆操作处理最多 ``k`` 个候选。

分治只反复调用简单的两路归并，常数较小；最小堆能够随时明确给出所有链表中的当前最小节点。两者都复用原链表
节点，区别主要在候选组织方式，而不是最终复杂度。

复杂度分析
~~~~~~~~~~

设 ``N`` 为全部节点数，``k`` 为链表数量。

``mergeSequentially`` 最坏时间复杂度为 ``O(Nk)``，除调用参数外只使用 ``O(1)`` 指针空间。

``mergeByIntervals`` 的时间复杂度为 ``O(N log k)``。实现复制了长度为 ``k`` 的头指针数组，工作空间为
``O(k)``；链表节点本身没有复制。

``mergeWithHeap`` 中每个节点入堆、出堆各一次，堆大小不超过非空链表数，时间复杂度为 ``O(N log k)``，
工作空间为 ``O(k)``。返回链表复用输入节点，结果本身不计入额外空间。
