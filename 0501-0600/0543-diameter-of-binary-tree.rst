0543. Diameter of Binary Tree
============================

题目信息
--------

:题号: 0543
:难度: Easy
:主题: 二叉树、最长节点路径、边数、任意端点
:原题: `LeetCode 0543 <https://leetcode.com/problems/diameter-of-binary-tree/>`_
:重点: 直径是任意两个节点间最长路径的边数、路径不一定经过根节点、单节点直径为 0

题目重述
--------

给定一棵二叉树，返回它的直径。直径定义为树中任意两个节点之间最长简单路径所包含的边数。

路径可以经过根节点，也可以完全位于某棵子树中。返回的是边数而不是节点数；若树只有一个节点，最长路径没有边，答案为 ``0``。空树同样返回 ``0``。

自建示例
--------

最长路径连接不同分支：

.. code-block:: text

   输入：root = [1,2,3,4,5,null,null,6]
   输出：4
   解释：路径 6 -> 4 -> 2 -> 1 -> 3 包含 4 条边，是树中的最长路径。

只有一个节点：

.. code-block:: text

   输入：root = [9]
   输出：0
   解释：没有两个不同节点可连接，因此直径按边数为 0。

后序返回从节点向下的最长边数
------------------------------

对每个节点，若左、右子树向下的最长路径分别为 ``left``、``right``，经过该节点的候选直径就是 ``left + right``；返回给父节点的高度则是 ``max(left,right)+1``。后序遍历先得到两个子树高度，同时更新全局最大直径，因此不要求最优路径经过根节点。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       int answer = 0;

       int height(TreeNode* node) {
           if (node == nullptr) return 0;
           int left = height(node->left);
           int right = height(node->right);
           answer = std::max(answer, left + right);
           return std::max(left, right) + 1;
       }

   public:
       int diameterOfBinaryTree(TreeNode* root) {
           answer = 0;
           height(root);
           return answer;
       }
   };

代码分析
--------

子树高度以边数表示时，左右高度相加正好是经过当前节点的节点间路径边数；所有节点都作为一次可能的路径最高点检查，所以不会漏掉子树内部直径。时间复杂度为 ``O(n)``，递归栈空间为 ``O(h)``。
