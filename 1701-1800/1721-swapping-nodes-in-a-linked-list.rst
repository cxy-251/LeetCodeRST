1721. Swapping Nodes in a Linked List
=====================================

题目信息
--------

:题号: 1721
:难度: Medium
:主题: 链表、双指针
:原题: `LeetCode 1721 <https://leetcode.com/problems/swapping-nodes-in-a-linked-list/>`_
:重点: 交换正数第 ``k`` 个节点与倒数第 ``k`` 个节点的值

题目重述
--------

给定单链表头节点和 ``k``。交换从头数第 ``k`` 个节点与从尾数第 ``k`` 个节点，返回链表头节点。

自建示例
--------

.. code-block:: text

   输入：head = [1,2,3,4,5], k = 2
   输出：[1,4,3,2,5]
   解释：交换值为 2 和 4 的两个节点。

.. code-block:: text

   输入：head = [1,2,3], k = 1
   输出：[3,2,1]
   解释：交换首尾节点。