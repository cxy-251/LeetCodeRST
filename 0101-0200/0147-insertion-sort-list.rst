0147. Insertion Sort List
=========================

题目信息
--------

:题号: 0147. 对链表进行插入排序
:难度: Medium
:主题: 链表、插入排序、有序前缀、指针重连
:原题: `LeetCode 0147 <https://leetcode.com/problems/insertion-sort-list/>`_
:重点: 维护有序前缀与未处理后缀的边界，只移动逆序节点，并按摘除后再插入的顺序保持链不断裂

题目重述
--------

给定单链表 ``head``，使用插入排序把节点按 ``val`` 非递减排列，并返回排序后头节点。按插入排序过程，依次
取出下一个未处理节点，插入此前已经排好序的部分。结果必须保留全部原节点；相同值节点也不能丢失。

自建示例
--------

* ``6 -> 1 -> 4 -> 1 -> 3`` 排序为 ``1 -> 1 -> 3 -> 4 -> 6``；后出现的第二个 ``1`` 插在
  先出现的 ``1`` 之后，可保持稳定顺序；
* ``-2 -> 5 -> 0 -> -4`` 排序为 ``-4 -> -2 -> 0 -> 5``；
* 已有序链 ``1 -> 2 -> 3`` 不需要移动任何节点；空链返回空。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   private:
       ListNode* rebuildByInsertion(ListNode* head) {
           ListNode sentinel(0);

           while (head != nullptr) {
               ListNode* current = head;
               head = head->next;

               ListNode* insertionPrevious = &sentinel;
               while (insertionPrevious->next != nullptr &&
                      insertionPrevious->next->val <= current->val) {
                   insertionPrevious = insertionPrevious->next;
               }
               current->next = insertionPrevious->next;
               insertionPrevious->next = current;
           }
           return sentinel.next;
       }

       ListNode* maintainSortedPrefix(ListNode* head) {
           if (head == nullptr) {
               return nullptr;
           }

           ListNode sentinel(0);
           sentinel.next = head;
           ListNode* sortedTail = head;
           ListNode* current = head->next;

           while (current != nullptr) {
               if (sortedTail->val <= current->val) {
                   sortedTail = current;
               } else {
                   ListNode* insertionPrevious = &sentinel;
                   while (insertionPrevious->next != current &&
                          insertionPrevious->next->val <= current->val) {
                       insertionPrevious = insertionPrevious->next;
                   }

                   sortedTail->next = current->next;
                   current->next = insertionPrevious->next;
                   insertionPrevious->next = current;
               }
               current = sortedTail->next;
           }
           return sentinel.next;
       }

   public:
       ListNode* insertionSortList(ListNode* head) {
           return maintainSortedPrefix(head);
       }
   };

题解
----

把数组插入排序翻译成链表动作
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

插入排序的核心不变量是：处理第 ``i`` 个元素前，前 ``i`` 个元素已经有序；随后把当前元素放入这个有序段
的正确位置。数组需要右移一段元素腾出位置，链表则只需找到插入点并修改指针，不需要搬动节点值。

最直接的 ``rebuildByInsertion`` 建立一条初始为空的有序链。每轮先从输入头取下一个 ``current``，再从
哨兵开始寻找第一个值大于它的节点，插到该节点之前。处理过的节点全部在新链，未处理节点由 ``head``
保持，状态分界清楚。

这个方案每个节点都重新扫描插入位置。即使输入本来已有很长的有序前缀，后一个节点已经位于正确末尾，仍
会从哨兵走完整个前缀。最坏时间是 ``O(n^2)``，而有序输入也做近似同样多的查找。

结构信息：原链前缀本来就可能已经有序
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

无需把所有节点搬到另一条链。维护 ``sentinel.next`` 到 ``sortedTail`` 为已排序前缀，令
``current = sortedTail->next`` 为下一个未处理节点，其后仍保持原输入顺序。

若 ``sortedTail->val <= current->val``，因为 ``sortedTail`` 已是前缀最大值，``current`` 也不小于它，
当前位置就是有序前缀末尾；只把 ``sortedTail`` 前进一步即可，不做查找或重连。这个快速分支让已排序输入
降为线性扫描。

逆序节点的摘除与插入
~~~~~~~~~~~~~~~~~~~~

若 ``current->val < sortedTail->val``，当前位置破坏有序性，才从哨兵查找插入点。循环越过所有
``value <= current->val`` 的已有节点，停在第一个更大值之前。随后三次赋值分两阶段：

.. code-block:: text

   sortedTail->next = current->next       摘除 current，接回未处理后缀
   current->next = insertionPrevious->next
   insertionPrevious->next = current      插入有序前缀

第一行必须在覆盖 ``current->next`` 之前执行，否则未处理后继会丢失。插入后 ``sortedTail`` 仍是有序前缀
末尾；被移动的 ``current`` 已放到它之前，所以下一未处理节点固定是新的 ``sortedTail->next``。代码统一在
轮末从这里取得下一状态，而不是沿已移动节点的 ``next`` 前进。

哨兵节点解决什么边界
~~~~~~~~~~~~~~~~~~~~

当前节点可能小于所有已有值，需要插到真实头节点之前。栈上的 ``sentinel`` 提供固定前驱，使“头插”和
“中间插入”都使用同一组指针操作；它不是返回链的一部分，函数返回 ``sentinel.next``。哨兵值为零没有
排序含义，查找只比较它的后继。

查找条件中的 ``insertionPrevious->next != current`` 给有序前缀设置明确右边界，避免扫描进入未处理区。
在逆序分支中至少 ``sortedTail`` 的值大于当前值，实际一定会在前缀内停止；边界条件仍让代码的不变量更
直接，也避免无条件解引用越界。

相等值与稳定性
~~~~~~~~~~~~~~

查找时使用 ``<=``，会越过前缀中所有与 ``current`` 相等的节点，再把后出现的当前节点插在它们之后，
保持相同值的原相对顺序。若使用 ``<``，当前节点会插到已有同值节点之前，数值排序仍正确，但不再稳定。

对 ``6 -> 1 -> 4 -> 1 -> 3`` 的核心状态：

.. list-table::
   :header-rows: 1

   * - 当前节点
     - 排序前缀变化
     - ``sortedTail``
   * - ``1``
     - 从 ``6`` 后摘下，插到头部，得到 ``1, 6``
     - 仍为 ``6``
   * - ``4``
     - 插入 ``1`` 与 ``6`` 之间，得到 ``1, 4, 6``
     - 仍为 ``6``
   * - 第二个 ``1``
     - 越过第一个 ``1`` 后插入，得到 ``1, 1, 4, 6``
     - 仍为 ``6``
   * - ``3``
     - 插到两个 ``1`` 之后、``4`` 之前
     - 仍为 ``6``，后缀为空

节点完整性与复杂度
~~~~~~~~~~~~~~~~~~

每轮要么只扩张前缀，要么先把一个现有节点从边界后摘下再插入前缀；未处理后缀始终由
``sortedTail->next`` 可达，没有节点复制、释放或遗漏。插入目标位于已断开位置之前，指针只连向前缀原后继，
不会形成环。

公开入口采用有序前缀版本。最坏逆序输入中，第 ``i`` 个节点仍可能扫描 ``O(i)`` 前缀，总时间
``O(n^2)``；已排序输入只需 ``O(n)``。工作空间为哨兵和固定指针，``O(1)``。重建版保留为插入排序定义的
直接基线，优化版删除了已在正确位置节点的重复查找。
