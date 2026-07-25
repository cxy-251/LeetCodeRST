1669. Merge In Between Linked Lists
===================================

题目信息
--------

:题号: 1669
:难度: Medium
:主题: 链表、指针重连
:原题: `LeetCode 1669 <https://leetcode.com/problems/merge-in-between-linked-lists/>`_
:重点: 删除 ``list1`` 中下标 ``a`` 到 ``b`` 的连续节点，并在原位置接入完整 ``list2``

题目重述
--------

给定两条非空链表和下标 ``a,b``。把 ``list1[a..b]`` 整段移除，将 ``list2`` 接在 ``list1[a-1]`` 与 ``list1[b+1]`` 之间，返回合并后头节点。

自建示例
--------

.. code-block:: text

   输入：list1 = [0,1,2,3,4], a = 1, b = 3, list2 = [8,9]
   输出：[0,8,9,4]
   解释：节点 1、2、3 被替换。

.. code-block:: text

   输入：list1 = [1,2,3], a = 1, b = 1, list2 = [7]
   输出：[1,7,3]
   解释：只替换一个节点。