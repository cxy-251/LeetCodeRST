0234. Palindrome Linked List
============================

题目信息
--------

:题号: 0234
:难度: Easy
:主题: 链表、双指针、栈
:原题: `LeetCode 0234 <https://leetcode.com/problems/palindrome-linked-list/>`_
:教学重点: 中点定位、后半反转、结构恢复

题目重述
--------

给定单链表头节点 ``head``，接口为 ``bool isPalindrome(ListNode* head)``。判断节点值序列是否正反相同。节点数最多约 ``10^5``；节点按身份连接但比较值。可使用额外空间，也可临时修改链表；若选择反转，需明确是否恢复输入结构。

自建示例
--------

.. code-block:: text

   输入：[1,3,3,1]
   输出：true

   输入：[1,2,3]
   输出：false
