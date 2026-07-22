0235. Lowest Common Ancestor of a Binary Search Tree
====================================================

题目信息
--------

:题号: 0235
:难度: Medium
:主题: 二叉搜索树、树、深度优先搜索
:原题: `LeetCode 0235 <https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/>`_
:教学重点: BST 分叉点、节点身份、祖先可包含自身

题目重述
--------

给定合法 BST 根节点 ``root`` 以及树中不同节点 ``p``、``q``，接口为 ``TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q)``。返回二者最近公共祖先节点本身；节点可作为自己的祖先。节点值唯一且 ``p``、``q`` 保证存在，不能仅新建同值节点返回。

自建示例
--------

.. code-block:: text

   输入：root=[8,4,12,2,6,10,14], p=2, q=6
   输出：节点 4
