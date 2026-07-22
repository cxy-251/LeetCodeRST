0226. Invert Binary Tree
========================

题目信息
--------

:题号: 0226
:难度: Easy
:主题: 树、深度优先搜索、广度优先搜索
:原题: `LeetCode 0226 <https://leetcode.com/problems/invert-binary-tree/>`_
:教学重点: 左右子树交换、原地结构修改、节点身份

题目重述
--------

给定二叉树根节点 ``root``，接口为 ``TreeNode* invertTree(TreeNode* root)``。对每个节点交换左右孩子，并返回反转后的根。节点数最多约 100；返回树复用原节点，只改变连接关系，空树返回 ``nullptr``。

自建示例
--------

.. code-block:: text

   输入：层序 [2,1,4,null,null,3,5]
   输出：[2,4,1,5,3]
   说明：每个节点的左右子树都被交换。
