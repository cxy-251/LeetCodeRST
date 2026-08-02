0234. Palindrome Linked List
============================

题目信息
--------

:题号: 0234
:难度: Easy
:主题: 单链表、回文、双指针
:原题: `LeetCode 0234 <https://leetcode.com/problems/palindrome-linked-list/>`_
:重点: 按节点值序列判断、正读与反读完全相同、奇偶长度、常数空间进阶

题目重述
--------

给定一个非空单链表的头节点 ``head``，按照从头到尾访问得到节点值序列。若该序列从左向右和从右向左读取完全相同，返回 ``true``；否则返回 ``false``。比较的是节点值及其顺序，不是节点地址是否对称。

链表节点数位于 ``[1, 10^5]``，每个节点值位于 ``[0, 9]``。单节点链表一定是回文；奇数长度链表的中间节点不需要与其他位置配对。题目只要求返回判断结果，进阶要求为 ``O(n)`` 时间和 ``O(1)`` 额外空间。

自建示例
--------

偶数长度回文：

.. code-block:: text

   输入：head = [4, 1, 1, 4]
   输出：true
   解释：从头到尾和从尾到头得到的值序列都为 [4, 1, 1, 4]。

相同值数量不足以构成回文：

.. code-block:: text

   输入：head = [2, 5, 2, 5]
   输出：false
   解释：反向序列为 [5, 2, 5, 2]，与原顺序不同。

找中点、反转后半段
------------------

用快慢指针定位后半段起点：``fast`` 每次走两步，``slow`` 每次走一步。
循环结束时，偶数长度链表的 ``slow`` 已指向后半段首节点；奇数长度时 ``fast`` 仍非空，
``slow`` 位于中间节点，再向前移动一步跳过中间值。中间节点不需要比较。

把后半段原地反转后，从头节点和反转后的后半段首节点同步比较。后半段长度不大于前半段，
只要所有对应值相同就是回文。比较结束后再把后半段反转一次，恢复原链表方向，避免判断函数留下结构副作用。

正确性说明
----------

快慢指针的步速差保证 ``slow`` 的位置如上；跳过奇数长度的中点不会遗漏任何需要配对的值。
反转后，后半段从头到尾的顺序正好对应原链表从尾到中点的顺序，因此逐项比较等价于比较整个序列与其逆序。
若存在不等值位置，序列不是回文；若全部匹配，所有对称位置相等。恢复操作只反转同一段，不改变比较结论。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       ListNode* reverseList(ListNode* head) {
           ListNode* previous = nullptr;
           while (head != nullptr) {
               ListNode* next = head->next;
               head->next = previous;
               previous = head;
               head = next;
           }
           return previous;
       }

   public:
       bool isPalindrome(ListNode* head) {
           ListNode* slow = head;
           ListNode* fast = head;
           while (fast != nullptr && fast->next != nullptr) {
               slow = slow->next;
               fast = fast->next->next;
           }
           if (fast != nullptr) slow = slow->next;

           ListNode* reversed = reverseList(slow);
           ListNode* first = head;
           ListNode* second = reversed;
           bool palindrome = true;
           while (second != nullptr) {
               if (first->val != second->val) {
                   palindrome = false;
                   break;
               }
               first = first->next;
               second = second->next;
           }

           reverseList(reversed);
           return palindrome;
       }
   };

代码分析
--------

快慢指针、反转和比较各自只遍历链表常数次，时间复杂度为 ``O(n)``；反转使用固定指针，
额外空间为 ``O(1)``。``reversed`` 保存反转段的入口，比较提前失败时仍会执行恢复，
所以无论返回真或假，原链表结构都恢复为调用前状态。
