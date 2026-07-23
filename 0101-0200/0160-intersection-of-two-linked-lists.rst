0160. Intersection of Two Linked Lists
======================================

题目信息
--------

:题号: 0160
:难度: Easy
:主题: 链表、双指针、对象身份
:原题: `LeetCode 0160 <https://leetcode.com/problems/intersection-of-two-linked-lists/>`_
:重点: 无环链表、共享节点对象、第一个交点、结构不可修改

题目重述
--------

给定两条无环单链表 ``headA`` 和 ``headB``，返回它们开始共享的第一个节点对象；若不存在共享节点，则返回空引用。两个节点即使保存相同数值，只要不是内存中的同一个节点，就不构成相交。

一旦两条链表在某节点相交，该节点之后的整个后缀都由两条链表共享。两条链表的节点数分别在 ``1..3 * 10^4`` 范围内，节点值在 ``1..10^5`` 范围内；算法不得修改原链表，并应使用 ``O(1)`` 额外空间。

自建示例
--------

.. code-block:: text

   输入：A 的独立前缀为 [7,2]，B 的独立前缀为 [9,6,1]，二者共同连接到共享后缀 [4,8]
   输出：值为 4 的共享节点对象
   解释：4 是两条链表第一次指向同一个节点的位置，后面的节点 8 也随之共享。

.. code-block:: text

   输入：A = [3,5,7]，B = [1,5,9]，两条链表分别独立创建
   输出：null
   解释：两条链表都含有值 5，但对应的是不同节点对象，因此不相交。

C++ 实现
--------

.. code-block:: cpp

   #include <unordered_set>

   class Solution {
   private:
       ListNode* hashSet(ListNode* headA, ListNode* headB) {
           std::unordered_set<ListNode*> seen;
           for (ListNode* node = headA; node; node = node->next) seen.insert(node);
           for (ListNode* node = headB; node; node = node->next)
               if (seen.count(node)) return node;
           return nullptr;
       }

       ListNode* pathSwitching(ListNode* headA, ListNode* headB) {
           ListNode* first = headA;
           ListNode* second = headB;
           while (first != second) {
               first = first ? first->next : headB;
               second = second ? second->next : headA;
           }
           return first;
       }

   public:
       ListNode* getIntersectionNode(ListNode* headA, ListNode* headB) {
           return pathSwitching(headA, headB);
       }
   };

题解
----

为什么比较节点身份
~~~~~~~~~

相交链表从交点开始共享同一批节点对象；数值相同并不代表相交。

路径交换如何消除长度差
~~~~~~~~~~~

指针 A 走完 A 后改走 B，指针 B 走完 B 后改走 A。两者都走过 ``lenA+lenB`` 距离，进入共享后缀时自动对齐；无交点时同时到达空引用。

复杂度来源
~~~~~

每个指针最多遍历两条链各一次，时间 ``O(m+n)``、额外空间 ``O(1)``。