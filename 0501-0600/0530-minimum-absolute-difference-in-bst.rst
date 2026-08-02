0530. Minimum Absolute Difference in BST
========================================

题目信息
--------

:题号: 0530
:难度: Easy
:主题: 二叉搜索树、不同节点、绝对差、最小值
:原题: `LeetCode 0530 <https://leetcode.com/problems/minimum-absolute-difference-in-bst/>`_
:重点: 比较树中任意两个不同节点值、BST 节点值互不相同、返回最小绝对差

题目重述
--------

给定一棵至少包含两个节点的二叉搜索树，计算树中任意两个不同节点的值之差的绝对值，并返回其中的最小值。

树中所有节点值互不相同，且均为非负整数。只返回最小差值，不需要返回对应节点；节点在树中的父子距离不影响比较，任意两个节点都可以组成一对。

自建示例
--------

最小差值来自不同分支：

.. code-block:: text

   输入：root = [8,3,10,1,6,null,14]
   输出：2
   解释：节点值按升序为 1、3、6、8、10、14，最小相邻差值为 2。

最小差值为一：

.. code-block:: text

   输入：root = [2,1,5]
   输出：1
   解释：节点 1 与节点 2 的绝对差为 1，是所有节点对中的最小值。

BST 中序序列的相邻差值
----------------------

二叉搜索树中序遍历得到严格递增的节点值序列。对有序序列，任意非相邻两值的差不会小于它们之间某个相邻差，因此只需要比较连续访问节点的差值即可得到全局最小绝对差。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       TreeNode* previous = nullptr;
       int answer = INT_MAX;

       void inorder(TreeNode* node) {
           if (node == nullptr) return;
           inorder(node->left);
           if (previous != nullptr) {
               answer = std::min(answer, node->val - previous->val);
           }
           previous = node;
           inorder(node->right);
       }

   public:
       int getMinimumDifference(TreeNode* root) {
           previous = nullptr;
           answer = INT_MAX;
           inorder(root);
           return answer;
       }
   };

代码分析
--------

中序顺序把任意节点对问题化为相邻差值问题，节点值互不相同使差值为正；递归访问每个节点一次。时间复杂度为 ``O(n)``，递归栈空间为 ``O(h)``。
