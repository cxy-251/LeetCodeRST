1379. Find a Corresponding Node of a Binary Tree in a Clone of That Tree
========================================================================

题目信息
--------

:题号: 1379
:难度: Easy
:主题: 二叉树、同步遍历、节点引用
:原题: `LeetCode 1379 <https://leetcode.com/problems/find-a-corresponding-node-of-a-binary-tree-in-a-clone-of-that-tree/>`_
:重点: ``cloned`` 与 ``original`` 结构和值完全相同；给定的是原树节点引用，必须返回克隆树中同一结构位置的节点引用，不能仅按值查找

题目重述
--------

给定原始二叉树 ``original``、它的完整深拷贝 ``cloned``，以及原树中的节点对象 ``target``。两棵树结构一致，对应节点值相同，但节点对象彼此独立。

请返回 ``cloned`` 中与 ``target`` 位于相同结构位置的节点对象。树中可能存在重复值。

树中节点数不超过 ``10^4``，``target`` 保证属于原树。

自建示例
--------

重复值要求按结构位置匹配：

.. code-block:: text

   输入：original = [7,4,7]，target 为原树右孩子
   输出：cloned 的右孩子节点
   解释：根和右孩子值都可能相同，必须同步遍历两棵树定位对应引用。

目标为根节点：

.. code-block:: text

   输入：original = [5,2,8]，target 为原树根
   输出：cloned 的根节点
   解释：两棵树根节点处于对应位置。