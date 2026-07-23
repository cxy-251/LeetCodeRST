0160. Intersection of Two Linked Lists
======================================

题目信息
--------

:题号: 0160
:难度: Easy
:主题: 链表、双指针、对象身份
:原题: `LeetCode 0160 <https://leetcode.com/problems/intersection-of-two-linked-lists/>`_
:重点: 长度差对齐、路径交换、共享后缀

题目重述
--------

给定两条无环单链表 ``headA`` 和 ``headB``，返回它们开始相交的第一个节点；若两条链表不相交，返回空引用。相交表示两条链表从某个位置开始共享同一节点对象及其后续链，而不是仅有节点值相同。函数执行后应保持链表原有结构不变。

自建示例
--------

.. code-block:: text

   A: 4 -> 1 -> 8 -> 4 -> 5
                  ^
   B:      5 -> 6 -> 1
                  |
                  +---- 连接到 A 中的节点 8

   返回共享节点对象 8。

.. code-block:: text

   A: 2 -> 6 -> 4
   B: 1 -> 5
   两条链表没有共享节点，返回 null。

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