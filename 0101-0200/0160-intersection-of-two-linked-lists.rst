0160. Intersection of Two Linked Lists
======================================

题目信息
--------

:题号: 0160
:难度: Easy
:主题: 链表、双指针、对象身份
:原题: `LeetCode 0160 <https://leetcode.com/problems/intersection-of-two-linked-lists/>`_
:教学重点: 长度差对齐、路径交换、共享后缀

题目重述
--------

返回两条无环单链表开始共享节点的第一个节点；没有交点返回空引用。

自建示例
--------

.. code-block:: text

   A: 4 -> 1 -> 8 -> 4 -> 5
   B:      5 -> 6 -> 1 --^
   返回值为共享节点对象 8，而不是数值相等的新节点。

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
