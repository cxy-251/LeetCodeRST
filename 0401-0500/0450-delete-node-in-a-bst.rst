0450. Delete Node in a BST
==========================

题目信息
--------

:题号: 0450
:难度: Medium
:主题: 二叉搜索树、按键删除、结构重连、返回根节点
:原题: `LeetCode 0450 <https://leetcode.com/problems/delete-node-in-a-bst/>`_
:重点: 删除值等于 ``key`` 的节点、删除后仍满足 BST 性质、键不存在时保持不变、根节点可能改变

题目重述
--------

给定二叉搜索树根节点 ``root`` 和整数 ``key``，删除树中节点值等于 ``key`` 的节点，并返回删除后的根节点。输入树中的节点值互不相同。

若目标节点不存在，返回原树。删除叶节点、只有一个孩子的节点或有两个孩子的节点后，都必须保留其余所有节点，并使结果继续满足二叉搜索树性质。树中节点数位于 ``[0, 10^4]``，节点值和 ``key`` 位于 ``[-10^5, 10^5]``。

自建示例
--------

删除叶节点：

.. code-block:: text

   输入：root = [8,3,10,1,6,null,14]，key = 14
   输出：[8,3,10,1,6]
   解释：14 是叶节点，删除它不会改变其他节点的父子关系，结果仍是合法 BST。

目标键不存在：

.. code-block:: text

   输入：root = [4,2,7]，key = 5
   输出：[4,2,7]
   解释：树中没有值 5 的节点，因此结构和根节点保持不变。

按 BST 路径查找并处理三种结构
----------------------------

先利用 BST 的大小关系递归向左或向右查找 ``key``，没有找到时沿途原样返回。找到目标节点后，叶节点直接返回空；只有一个孩子时返回该孩子，让父节点跳过目标节点；有两个孩子时，用右子树中的最小节点（中序后继）覆盖当前值，再递归删除那个后继节点。

后继节点是右子树最左侧的节点，它大于当前节点且不大于右子树中的其他节点。用它替换后，左子树仍全部更小，右子树仍全部更大，递归删除后继也只会遇到“叶节点或只有一个孩子”的情况。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       TreeNode* deleteNode(TreeNode* root, int key) {
           if (root == nullptr) return nullptr;

           if (key < root->val) {
               root->left = deleteNode(root->left, key);
           } else if (key > root->val) {
               root->right = deleteNode(root->right, key);
           } else {
               if (root->left == nullptr) return root->right;
               if (root->right == nullptr) return root->left;

               TreeNode* successor = root->right;
               while (successor->left != nullptr) {
                   successor = successor->left;
               }
               root->val = successor->val;
               root->right = deleteNode(root->right, successor->val);
           }
           return root;
       }
   };

代码分析
--------

递归返回值承担“删除后该子树的新根”，因此目标节点是根、叶节点或只有一个孩子时都能正确接回父节点。双孩子情况只替换值并在右子树中删除重复的后继节点，不会丢失其他子树。时间复杂度为 ``O(h)``，其中 ``h`` 是树高；递归额外空间为 ``O(h)``。
