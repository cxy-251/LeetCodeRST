0222. Count Complete Tree Nodes
==============================

题目信息
--------

:题号: 0222
:难度: Easy
:主题: 完全二叉树、树、二分查找、位运算
:原题: `LeetCode 0222 <https://leetcode.com/problems/count-complete-tree-nodes/>`_
:重点: 完全二叉树定义、最后一层从左连续填充、统计节点身份、空树

题目重述
--------

给定一棵完全二叉树的根节点 ``root``，返回树中节点的总数。完全二叉树除最后一层外的每一层都被填满；最后一层的节点全部靠左排列，中间不会出现空缺后又继续出现节点的情况。

节点数量位于 ``[0, 5 * 10^4]``，节点值位于 ``[0, 5 * 10^4]``。统计对象是实际节点数量，与节点值是否相同无关。空树返回 ``0``，函数不修改树的结构。题目的进阶要求是使用时间复杂度低于 ``O(n)`` 的方法。

自建示例
--------

最后一层未填满：

.. code-block:: text

   输入：root = [8, 4, 12, 2, 6]
   输出：5
   解释：前三层按完全二叉树规则从左到右填充，层序表示中共有 5 个实际节点。

空树：

.. code-block:: text

   输入：root = []
   输出：0
   解释：根节点为空，树中不存在任何节点。

利用完全树的高度
----------------

从一个节点分别沿最左边和最右边的指针向下，得到 ``left_height`` 与 ``right_height``。
若两者相等，完全二叉树的最后一层已经填满；否则最后一层只可能在左子树或右子树中未填满，
递归处理两个子树即可。

高度相等时，整棵树是高度为 ``h`` 的满二叉树，节点数为：

.. math::

   1 + 2 + \cdots + 2^{h-1} = 2^h - 1

这里高度按节点层数计算，空树高度为 0。完全树的重要性质保证：若最左、最右路径高度相同，
不可能存在某个内部空洞，整棵树必然满；若高度不同，递归不会丢掉任何最后一层节点。

正确性说明
----------

对每次调用的根节点归纳。空根返回 0；若左右边界高度相同，由完全二叉树定义，所有层均填满，
公式直接给出精确节点数。若高度不同，根贡献 1，左、右子树仍是完全二叉树，递归返回它们各自的精确数量，
三者相加得到整棵树数量。递归最终到达空子树，因此算法终止。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       int leftHeight(TreeNode* node) {
           int height = 0;
           while (node != nullptr) {
               ++height;
               node = node->left;
           }
           return height;
       }

       int rightHeight(TreeNode* node) {
           int height = 0;
           while (node != nullptr) {
               ++height;
               node = node->right;
           }
           return height;
       }

   public:
       int countNodes(TreeNode* root) {
           if (root == nullptr) return 0;

           const int left = leftHeight(root);
           const int right = rightHeight(root);
           if (left == right) {
               return static_cast<int>((1LL << left) - 1);
           }
           return 1 + countNodes(root->left) + countNodes(root->right);
       }
   };

代码分析
--------

每层只沿两条边界走一遍，单次调用耗时与当前高度成正比；高度不同时递归进入子树，完全树的高度为
``O(log n)``，所以总时间为 ``O(log^2 n)``，递归栈为 ``O(log n)``。位移使用 ``1LL`` 计算满树数量，
避免先在较窄整数类型中移位；题目给出的节点规模使最终返回值仍在 ``int`` 范围内。
