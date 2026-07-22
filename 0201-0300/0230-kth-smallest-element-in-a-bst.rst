0230. Kth Smallest Element in a BST
===================================

题目信息
--------

:题号: 0230
:难度: Medium
:主题: 二叉搜索树、中序遍历
:原题: `LeetCode 0230 <https://leetcode.com/problems/kth-smallest-element-in-a-bst/>`_
:教学重点: 中序有序性、访问计数、节点身份

题目重述
--------

给定二叉搜索树根节点 ``root`` 和整数 ``k``，接口为 ``int kthSmallest(TreeNode* root, int k)``。返回按节点值升序排列后的第 ``k`` 小值。节点数最多约 ``10^4``，``1 <= k <= 节点数``；平台保证输入是合法 BST，树结构不应被修改。

自建示例
--------

.. code-block:: text

   输入：root=[5,3,7,2,4,6,8], k=5
   输出：6
