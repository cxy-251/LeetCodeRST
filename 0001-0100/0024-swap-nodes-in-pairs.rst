0024. Swap Nodes in Pairs
=========================

题目信息
--------

:题号: 0024
:难度: Medium
:主题: 链表、递归、指针重连
:原题: `LeetCode 0024 <https://leetcode.com/problems/swap-nodes-in-pairs/>`_
:重点: 每次交换相邻两个节点本身，并把交换后的节点对重新接回已处理前缀与未处理后缀

题目重述
--------

给定单链表头节点 ``head``，从链表开头开始，把每两个相邻节点组成一组并交换它们在链表中的位置，返回交换后的
链表头节点。

必须通过修改节点之间的 ``next`` 指针完成交换，不能只交换节点中的数值。若节点总数为奇数，最后一个无法组成
完整节点对的节点保持不动。

链表节点数量位于 ``[0, 100]``，每个节点值位于 ``[0, 100]``。

自建示例
--------

* 偶数个节点：``[1, 2, 3, 4] -> [2, 1, 4, 3]``；
* 奇数个节点：``[1, 4, 7, 9, 2] -> [4, 1, 9, 7, 2]``，末尾 ``2`` 保持不动；
* 两个节点：``[8, 5] -> [5, 8]``，结果头节点发生变化；
* 单个节点：``[6] -> [6]``，没有完整节点对；
* 空链表：``[] -> []``。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   private:
       ListNode* recursiveSwap(ListNode* head) {
           if (head == nullptr || head->next == nullptr) {
               return head;
           }
           ListNode* second = head->next;
           head->next = recursiveSwap(second->next);
           second->next = head;
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

交换对象是节点
~~~~~~~~~~~~~~

若只交换两个节点的 ``val``，链表中的节点位置没有变化。外部若持有某个节点指针，它仍指向原位置上的同一节点，
因此这不满足“交换节点”的要求。正确操作必须改变节点之间的链接关系。

设当前节点对为 ``first -> second``，后续链表从 ``after`` 开始。交换完成后，这一局部结构应变为：

.. code-block:: text

   previous -> second -> first -> after

其中 ``previous`` 是当前节点对之前的最后一个节点。每轮只需建立这三条链接。

三条链接
~~~~~~~~

修改指针前先保存 ``after = second->next``，否则原后缀入口可能在重连过程中丢失。随后依次执行：

#. ``first->next = after``：让交换后的组尾先接回未处理后缀；
#. ``second->next = first``：反转当前两个节点的先后关系；
#. ``previous->next = second``：让已处理前缀接到当前组的新组头。

这三个赋值完成后，当前节点对已经整体嵌回链表。没有创建或删除节点，节点值也没有改变。

循环不变量
~~~~~~~~~~

每轮开始时维护两个事实：

* ``previous`` 及其之前的链表已经完成所有相邻交换；
* ``previous->next`` 是尚未处理后缀的首节点。

若未处理后缀至少有两个节点，``first`` 与 ``second`` 恰好组成下一组。重连后，``first`` 成为该组尾节点，所以令
``previous = first``，下一轮便从原来的第三个节点继续。

每次循环处理两个此前未处理的节点，各组互不重叠。循环停止时，未处理后缀长度只能是零或一；零表示全部完成，
一表示最后一个节点无法配对，它原有的链接无需修改。

虚拟头节点
~~~~~~~~~~

第一组交换后，原第二个节点会成为整条链表的新头节点。若直接从真实头节点开始，就需要单独保存和返回这个新头。

虚拟节点 ``dummy`` 位于真实链表之前，使第一组与后续所有组一样，都拥有 ``previous``。每轮统一修改
``previous->next``，最终返回 ``dummy.next`` 即可。

递归分解
~~~~~~~~

递归方法把链表拆成“当前前两个节点”和“其余后缀”。若节点不足两个，当前链表已经无需处理，直接返回原头。

节点足够时，先递归交换从第三个节点开始的后缀，并让 ``head->next`` 指向该结果；再令第二个节点指向第一个节点。
第二个节点成为当前子问题的新头，因此返回 ``second``。

递归与迭代执行的是同一种分组，只是递归通过返回值获得交换后的后缀头，迭代通过 ``previous`` 把每一组原地接回。
公开入口选择迭代方法，以固定数量的指针完成操作。

复杂度分析
~~~~~~~~~~

设链表长度为 ``n``。递归与迭代都只访问每个节点常数次，时间复杂度为 ``O(n)``。

迭代方法只使用固定数量的节点指针，额外空间为 ``O(1)``；递归深度约为 ``n / 2``，调用栈空间为 ``O(n)``。
