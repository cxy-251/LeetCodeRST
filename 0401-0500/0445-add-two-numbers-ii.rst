0445. Add Two Numbers II
========================

题目信息
--------

:题号: 0445
:难度: Medium
:主题: 非负整数链表、最高位在前、十进制加法、结果链表
:原题: `LeetCode 0445 <https://leetcode.com/problems/add-two-numbers-ii/>`_
:重点: 每个节点保存一位数字、链表顺序是最高位到最低位、输入无前导零、返回和的同序链表

题目重述
--------

给定两个非空单链表 ``l1`` 和 ``l2``，分别表示两个非负整数。每个节点保存一个十进制数字，且最高位位于链表头部。计算两数之和，并以相同的最高位在前形式返回结果链表。

除数字 0 本身外，输入链表不会以 0 开头。每条链表节点数位于 ``[1, 100]``，节点值位于 ``[0, 9]``。结果若产生新的最高位，需要新增头节点。题目的进阶要求在不反转输入链表的情况下完成计算。

自建示例
--------

两个链表长度不同：

.. code-block:: text

   输入：l1 = [7,2,4]，l2 = [8,9]
   输出：[8,1,3]
   解释：链表分别表示 724 和 89，两数之和为 813。

最高位产生进位：

.. code-block:: text

   输入：l1 = [9,9]，l2 = [1]
   输出：[1,0,0]
   解释：99 + 1 = 100，结果比两个输入都多一个最高位节点。

栈恢复从低位到高位的计算顺序
----------------------------

链表头部是最高位，而加法必须从最低位开始。分别把两条链表的数字压入栈，出栈时就能从个位向左处理；每一步把两个栈顶数字和进位相加，当前位插入结果链表头部。这样既不需要反转输入链表，也不改变输入节点。

两个栈都为空后，若仍有进位，再把它作为新的最高位插入。结果节点始终头插，因此生成的链表天然保持最高位在前。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
           std::vector<int> first;
           std::vector<int> second;
           for (ListNode* node = l1; node != nullptr; node = node->next) {
               first.push_back(node->val);
           }
           for (ListNode* node = l2; node != nullptr; node = node->next) {
               second.push_back(node->val);
           }

           int i = static_cast<int>(first.size()) - 1;
           int j = static_cast<int>(second.size()) - 1;
           int carry = 0;
           ListNode* head = nullptr;
           while (i >= 0 || j >= 0 || carry != 0) {
               int sum = carry;
               if (i >= 0) sum += first[i--];
               if (j >= 0) sum += second[j--];

               ListNode* node = new ListNode(sum % 10);
               node->next = head;
               head = node;
               carry = sum / 10;
           }
           return head;
       }
   };

代码分析
--------

栈顶对应当前最低位，``carry`` 保存向更高位传递的进位；头插把逆序计算结果重新排列为正序。循环条件包含进位，保证 ``99 + 1`` 这类情况会生成额外的最高位。设两条链表长度分别为 ``m``、``n``，时间复杂度为 ``O(m+n)``，栈和结果链表之外的辅助空间为 ``O(m+n)``。
