0257. Binary Tree Paths
=======================

题目信息
--------

:题号: 0257
:难度: Easy
:主题: 二叉树、深度优先搜索、回溯、字符串
:原题: `LeetCode 0257 <https://leetcode.com/problems/binary-tree-paths/>`_
:教学重点: 根到叶路径、路径快照、分支恢复

题目重述
--------

给定二叉树根节点 ``root``，接口为 ``vector<string> binaryTreePaths(TreeNode* root)``。返回所有从根到叶节点的路径，每条路径使用 ``"->"`` 连接节点值。叶节点必须左右孩子均为空；返回顺序不限，空树返回空数组，输入树不修改。

自建示例
--------

.. code-block:: text

   输入：root=[1,2,3,null,5]
   输出：["1->2->5","1->3"]
