0382. Linked List Random Node
=============================

题目信息
--------

:题号: 0382
:难度: Medium
:主题: 单链表、随机节点、等概率、对象状态
:原题: `LeetCode 0382 <https://leetcode.com/problems/linked-list-random-node/>`_
:重点: 链表非空、每个节点而不是每个不同值等概率、重复值的概率会累加、每次调用返回一个节点值

题目重述
--------

使用给定非空单链表的头节点构造对象，并实现 ``getRandom()``。每次调用时，从链表的全部节点中等概率选择一个节点，返回该节点保存的整数值。

链表节点数位于 ``[1, 10^4]``，节点值位于 ``[-10^4, 10^4]``，``getRandom`` 的调用次数不超过 ``10^4``。等概率针对节点位置：若多个节点保存相同值，该值被返回的总概率等于这些节点概率之和。对象不应改变链表节点的次序或连接关系。

自建示例
--------

重复值来自不同节点：

.. code-block:: text

   输入链表：4 -> 4 -> 9
   调用：getRandom()
   输出：4 或 9
   解释：三个节点各有 1/3 概率被选中，因此返回值 4 的总概率为 2/3，返回 9 的概率为 1/3。

单节点链表：

.. code-block:: text

   输入链表：-6
   调用：getRandom()
   输出：-6
   解释：链表只有一个节点，每次调用都必须返回它的值。

水塘抽样不预先知道链表长度
----------------------------

每次调用从头遍历链表，维护当前已经看到的节点数 ``count`` 和候选值。看到第 ``count`` 个节点时，以 ``1 / count`` 的概率用它替换候选。第一个节点必选；任意第 ``j`` 个节点最终被保留的概率是 ``1/j`` 乘以前面没有替换它的概率，恰好为 ``1/n``。

这样无需先统计长度或复制节点，且不改变链表结构。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       ListNode* head;
       std::mt19937 generator{std::random_device{}()};

   public:
       Solution(ListNode* head) : head(head) {}

       int getRandom() {
           int count = 0;
           int chosen = 0;
           for (ListNode* node = head; node != nullptr;
                node = node->next) {
               ++count;
               std::uniform_int_distribution<int> distribution(1, count);
               if (distribution(generator) == 1) {
                   chosen = node->val;
               }
           }
           return chosen;
       }
   };

代码分析
--------

水塘抽样保证每个节点位置等概率，而不是按节点值去重；重复值的概率会自动按对应节点数量相加。每次 ``getRandom`` 遍历 ``n`` 个节点，时间复杂度为 ``O(n)``，除随机状态外额外空间为 ``O(1)``。
