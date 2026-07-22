0236. Lowest Common Ancestor of a Binary Tree
=============================================

题目信息
--------

:题号: 0236
:难度: Medium
:主题: 二叉树、深度优先搜索
:原题: `LeetCode 0236 <https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/>`_
:教学重点: 子树返回语义、首次汇合、节点身份

题目重述
--------

给定普通二叉树根节点 ``root`` 与树中不同节点 ``p``、``q``，接口为 ``TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q)``。返回最近公共祖先的原节点指针。平台保证两节点存在且值唯一；祖先关系允许节点自身，输入树不修改。

自建示例
--------

.. code-block:: text

   输入：root=[1,2,3,4,5,null,6], p=4, q=5
   输出：节点 2
