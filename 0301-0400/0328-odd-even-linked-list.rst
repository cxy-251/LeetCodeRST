0328. Odd Even Linked List
==========================

题目信息
--------

:题号: 0328
:难度: Medium
:主题: 单链表、位置奇偶、稳定重排、原地链接
:原题: `LeetCode 0328 <https://leetcode.com/problems/odd-even-linked-list/>`_
:重点: 奇偶指节点的一基位置而非节点值、两组内部相对顺序保持、返回重排后的头节点

题目重述
--------

给定单链表头节点 ``head``，按照节点在原链表中的一基位置重新连接节点：位置为 ``1, 3, 5, ...`` 的节点依次放在前面，位置为 ``2, 4, 6, ...`` 的节点依次接在后面。

奇数位置组和偶数位置组内部都必须保持原有相对顺序。节点数位于 ``[0, 10^4]``，节点值位于 ``[-10^6, 10^6]``；分组依据是位置编号，与节点值本身的奇偶无关。题目要求 ``O(n)`` 时间和 ``O(1)`` 额外空间，并返回重排后的头节点。

自建示例
--------

节点值的奇偶与分组无关：

.. code-block:: text

   输入：head = [8, 3, 6, 1]
   输出：[8, 6, 3, 1]
   解释：原位置 1、3 的节点值为 8、6，先按原顺序连接；位置 2、4 的 3、1 随后连接。

空链表：

.. code-block:: text

   输入：head = []
   输出：[]
   解释：没有节点需要重新连接，返回空链表。

同时维护两条稳定链
--------------------

``odd`` 指向当前奇数位置链的尾部，``even`` 指向当前偶数位置链的尾部，另存 ``evenHead`` 作为偶数链的起点。每轮把 ``even`` 后面的节点接到奇数链尾部，再把新奇数节点后面的节点接到偶数链尾部；因为节点总是按原顺序取出，两条链内部都保持稳定。

循环结束时，奇数链比偶数链多一个或刚好一样长，``even`` 或 ``even->next`` 为空。把奇数链尾接到 ``evenHead``，即可得到完整结果；整个过程只改指针，不创建节点。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       ListNode* oddEvenList(ListNode* head) {
           if (head == nullptr || head->next == nullptr) return head;

           ListNode* odd = head;
           ListNode* even = head->next;
           ListNode* evenHead = even;

           while (even != nullptr && even->next != nullptr) {
               odd->next = even->next;
               odd = odd->next;
               even->next = odd->next;
               even = even->next;
           }
           odd->next = evenHead;
           return head;
       }
   };

代码分析
--------

``odd`` 和 ``even`` 的移动分别跳过一个节点，因此每个原节点只被重新接线有限次；奇偶指的是原位置而不是值，代码没有读取节点值。空链表和单节点链表直接返回，避免访问空指针。时间复杂度为 ``O(n)``，额外空间为 ``O(1)``。
