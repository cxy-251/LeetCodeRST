0559. Maximum Depth of N-ary Tree
=================================

题目信息
--------

:题号: 0559
:难度: Easy
:主题: N 叉树、根到叶路径、节点层数、空树
:原题: `LeetCode 0559 <https://leetcode.com/problems/maximum-depth-of-n-ary-tree/>`_
:重点: 深度按根到最远叶节点的节点数量计算、根深度为 1、空树深度为 0

题目重述
--------

给定一棵 N 叉树的根节点 ``root``，返回树的最大深度。最大深度是从根节点到任意叶节点的最长路径所包含的节点数量。

若树为空，返回 ``0``；非空树的根节点深度为 ``1``。每个节点可以拥有零个或多个子节点，叶节点是没有子节点的节点。

自建示例
--------

最深路径位于某个孙辈分支：

.. code-block:: text

   输入：根 1 的孩子为 [2,3]，3 的孩子为 [4,5]，5 的孩子为 [6]
   输出：4
   解释：最长根到叶路径为 1 -> 3 -> 5 -> 6，共包含 4 个节点。

空树：

.. code-block:: text

   输入：root = null
   输出：0
   解释：没有任何节点，因此最大深度为 0。

递归取最深孩子路径
------------------

空节点深度为 0；非空节点的深度是 1 加上所有孩子深度的最大值。叶节点没有孩子，最大孩子深度取 0，因此返回 1。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int maxDepth(Node* root) {
           if (root == nullptr) return 0;
           int depth = 0;
           for (Node* child : root->children) {
               depth = std::max(depth, maxDepth(child));
           }
           return depth + 1;
       }
   };

代码分析
--------

每个节点只需知道最深孩子的结果，递归返回值与根到叶的节点计数定义一致。时间复杂度为 ``O(n)``，递归栈空间为 ``O(h)``。
