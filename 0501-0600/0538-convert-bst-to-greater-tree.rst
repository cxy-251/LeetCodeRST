0538. Convert BST to Greater Tree
=================================

题目信息
--------

:题号: 0538
:难度: Medium
:主题: 二叉搜索树、节点值更新、较大值累加、原地转换
:原题: `LeetCode 0538 <https://leetcode.com/problems/convert-bst-to-greater-tree/>`_
:重点: 每个节点的新值等于原值加所有严格更大节点的原值、原地修改树、返回根节点

题目重述
--------

给定一棵二叉搜索树，将它转换为大于树。对每个节点，把它的值改为：该节点的原始值，加上树中所有原始值严格大于它的节点值之和。

需要修改现有树并返回根节点。累加依据转换前的节点值定义，不能让已经更新后的值再次参与其他节点的计算。空树可以直接返回空根节点。

自建示例
--------

三个不同节点：

.. code-block:: text

   输入：root = [5,2,7]
   输出：[12,14,7]
   解释：7 没有更大值，保持 7；5 加上 7 得到 12；2 加上 5 和 7 得到 14。

只有一个负值节点：

.. code-block:: text

   输入：root = [-3]
   输出：[-3]
   解释：不存在严格更大的节点，因此节点值不变。

反向中序维护更大值总和
----------------------

BST 的反向中序顺序是从大到小。访问节点前已经累积的 ``running`` 正好是所有严格更大节点的原值之和；把当前节点加上它，再将更新后的值加入 ``running``，继续访问左子树。

虽然节点值被原地修改，但每个节点只在加入当前累计后才影响更小节点，等价于按原值从大到小逐项累加。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       long long running = 0;

       void reverseInorder(TreeNode* node) {
           if (node == nullptr) return;
           reverseInorder(node->right);
           node->val = static_cast<int>(node->val + running);
           running += node->val;
           reverseInorder(node->left);
       }

   public:
       TreeNode* convertBST(TreeNode* root) {
           running = 0;
           reverseInorder(root);
           return root;
       }
   };

代码分析
--------

反向中序的不变量是 ``running`` 等于当前节点右侧所有原值之和；更新后将当前原值加回，恰好建立下一节点所需的累计。每个节点访问一次，时间复杂度为 ``O(n)``，递归栈空间为 ``O(h)``。
