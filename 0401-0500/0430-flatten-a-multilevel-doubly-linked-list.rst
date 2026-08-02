0430. Flatten a Multilevel Doubly Linked List
=============================================

题目信息
--------

:题号: 0430
:难度: Medium
:主题: 多级双向链表、子链表、深度优先顺序、原地重连
:原题: `LeetCode 0430 <https://leetcode.com/problems/flatten-a-multilevel-doubly-linked-list/>`_
:重点: 子链表插入父节点与原后继之间、递归处理多层 ``child``、保持 ``prev``/``next`` 一致、最终所有 ``child`` 为空

题目重述
--------

给定一个多级双向链表的头节点 ``head``。每个节点除 ``prev`` 和 ``next`` 外，还可能通过 ``child`` 指向另一条双向链表，该子链表还可以继续包含子链表。

把整个结构原地展平成一条普通双向链表：遇到带有 ``child`` 的节点时，先接入并完整展开其子链表，再继续原链表中该节点原来的后继。返回展平后的头节点。结果中所有节点必须恰好出现一次，``prev`` 和 ``next`` 必须互相对应，所有 ``child`` 指针必须设为空。

节点总数位于 ``[0, 1000]``，节点值位于 ``[1, 10^5]``。输入为空时返回 ``null``。

自建示例
--------

包含两层子链表：

.. code-block:: text

   输入：主链表 1 <-> 2 <-> 3；节点 2 的 child 为 4 <-> 5；节点 4 的 child 为 6
   输出：1 <-> 2 <-> 4 <-> 6 <-> 5 <-> 3
   解释：节点 2 的子链表插入 2 和 3 之间；进入节点 4 时先展开其子节点 6，再回到节点 5。最终所有 child 均为空。

空链表：

.. code-block:: text

   输入：head = null
   输出：null
   解释：没有节点需要展平。

展开子链表并返回它的尾节点
----------------------------

沿主链表扫描。遇到 ``child`` 时，先保存当前节点原来的 ``next``，递归把子链表展平并得到子链表尾部，再把当前节点接到子链表头，把子链表尾接回原后继；最后清空 ``child``。返回尾节点让外层能够一次完成回接，而不必重新扫描刚展开的子链表。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       Node* flattenTail(Node* head) {
           Node* current = head;
           Node* tail = head;
           while (current != nullptr) {
               Node* next = current->next;
               if (current->child != nullptr) {
                   Node* child = current->child;
                   Node* childTail = flattenTail(child);
                   current->child = nullptr;
                   current->next = child;
                   child->prev = current;
                   if (next != nullptr) {
                       childTail->next = next;
                       next->prev = childTail;
                   }
                   tail = childTail;
               } else {
                   tail = current;
               }
               current = next;
           }
           return tail;
       }

   public:
       Node* flatten(Node* head) {
           if (head == nullptr) return nullptr;
           flattenTail(head);
           return head;
       }
   };

代码分析
--------

保存原后继保证子链表展开后仍能回到主链；每次接入都同时更新两个方向的指针并清空 child，不会丢失或重复节点。每个节点被处理一次，时间复杂度为 ``O(n)``，递归栈空间为 ``O(h)``。
