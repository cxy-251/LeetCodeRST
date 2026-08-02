0501. Find Mode in Binary Search Tree
=====================================

题目信息
--------

:题号: 0501
:难度: Easy
:主题: 二叉搜索树、频率统计、并列众数
:原题: `LeetCode 0501 <https://leetcode.com/problems/find-mode-in-binary-search-tree/>`_
:重点: BST 允许重复值、众数按出现次数定义、可能存在多个并列众数、结果顺序不限

题目重述
--------

给定一棵允许出现重复值的二叉搜索树，找出树中出现次数最多的所有节点值。若多个不同值具有相同的最高频率，需要全部返回，排列顺序不限。

树中节点数位于 ``[1, 10^4]``，节点值位于 ``[-10^5, 10^5]``。统计对象是节点值的出现次数，而不是节点引用；同一个值在不同节点中出现时需要累计。

自建示例
--------

存在多个并列众数：

.. code-block:: text

   输入：root = [4,2,6,2,3,5,6]
   输出：[2,6]
   解释：数值 2 和 6 都出现两次，其余数值各出现一次，因此二者都是众数；返回顺序可以交换。

只有一个节点：

.. code-block:: text

   输入：root = [9]
   输出：[9]
   解释：树中唯一的值自然具有最高频率。

利用中序遍历的连续相同值
------------------------

BST 的中序遍历按非递减顺序访问节点，因此同一个值会形成连续的一段。扫描这段序列时维护当前值及其连续出现次数；次数超过历史最大值就清空答案并换成当前值，次数相等则追加当前值。这样无需单独的频率哈希表，也能处理允许重复值的 BST。

代码使用 Morris 中序遍历，把临时线索接到当前节点的前驱上，访问完左子树后立即恢复指针。遍历结束时树的结构与输入相同，且不依赖递归栈。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::vector<int> findMode(TreeNode* root) {
           std::vector<int> result;
           TreeNode* current = root;
           int previous = 0;
           int run = 0;
           int best = 0;
           bool hasPrevious = false;

           auto visit = [&](int value) {
               if (!hasPrevious || value != previous) {
                   previous = value;
                   run = 1;
                   hasPrevious = true;
               } else {
                   ++run;
               }
               if (run > best) {
                   best = run;
                   result.clear();
                   result.push_back(value);
               } else if (run == best) {
                   result.push_back(value);
               }
           };

           while (current != nullptr) {
               if (current->left == nullptr) {
                   visit(current->val);
                   current = current->right;
                   continue;
               }
               TreeNode* predecessor = current->left;
               while (predecessor->right != nullptr &&
                      predecessor->right != current) {
                   predecessor = predecessor->right;
               }
               if (predecessor->right == nullptr) {
                   predecessor->right = current;
                   current = current->left;
               } else {
                   predecessor->right = nullptr;
                   visit(current->val);
                   current = current->right;
               }
           }
           return result;
       }
   };

代码分析
--------

中序顺序保证同值节点连续，``run`` 只需比较相邻访问值即可得到准确频率；答案更新规则同时保留所有并列最高值。Morris 线索每条边至多建立和恢复一次，时间复杂度为 ``O(n)``，除返回结果外额外空间复杂度为 ``O(1)``。
