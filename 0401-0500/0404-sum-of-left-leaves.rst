0404. Sum of Left Leaves
========================

题目信息
--------

:题号: 0404
:难度: Easy
:主题: 二叉树、左孩子、叶节点、节点值求和
:原题: `LeetCode 0404 <https://leetcode.com/problems/sum-of-left-leaves/>`_
:重点: 节点必须同时是父节点的左孩子和叶节点、根节点不算左叶、返回所有左叶值之和

题目重述
--------

给定二叉树根节点 ``root``，返回树中所有左叶节点的节点值之和。左叶节点必须由其父节点的左指针指向，并且自身的左、右子节点都为空。

根节点没有父节点，因此即使整棵树只有根节点，它也不是左叶节点。某个节点是左孩子但仍有子节点时，也不能计入结果。树中节点数位于 ``[1, 1000]``，节点值位于 ``[-1000, 1000]``。

自建示例
--------

左右子树都含左叶：

.. code-block:: text

   输入：root = [6, 2, 9, -3, 4, 8, null]
   输出：5
   解释：节点 -3 是节点 2 的左叶，节点 8 是节点 9 的左叶；总和为 -3 + 8 = 5。

只有根节点：

.. code-block:: text

   输入：root = [12]
   输出：0
   解释：根节点没有父节点，不能被视为左叶节点。

在递归参数中保留“是否为左孩子”
----------------------------------

叶节点本身只说明它没有孩子，还需要知道它是否由父节点的左指针指向。因此递归同时传递 ``isLeft``：到达空节点贡献 0，到达叶节点时只有 ``isLeft`` 为真才把节点值加入；非叶节点继续访问左右子树并分别传入 true、false。根节点传入 false，自动排除根被误算为左叶。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       int sum(TreeNode* node, bool isLeft) {
           if (node == nullptr) return 0;
           if (node->left == nullptr && node->right == nullptr) {
               return isLeft ? node->val : 0;
           }
           return sum(node->left, true)
                + sum(node->right, false);
       }

   public:
       int sumOfLeftLeaves(TreeNode* root) {
           return sum(root, false);
       }
   };

代码分析
--------

“左孩子”和“叶节点”两个条件在同一个递归状态中同时判断，左孩子但仍有子树的节点不会提前计入。每个节点访问一次，时间复杂度为 ``O(n)``，递归栈空间为 ``O(h)``。
