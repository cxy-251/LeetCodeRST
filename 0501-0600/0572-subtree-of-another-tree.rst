0572. Subtree of Another Tree
=============================

题目信息
--------

:题号: 0572
:难度: Easy
:主题: 二叉树、子树、结构相同、节点值相同
:原题: `LeetCode 0572 <https://leetcode.com/problems/subtree-of-another-tree/>`_
:重点: 必须从 root 的某个节点开始取得完整后代树、结构与节点值都要完全相同、不能只匹配部分节点

题目重述
--------

给定两棵非空二叉树 ``root`` 和 ``subRoot``，判断 ``subRoot`` 是否是 ``root`` 的子树。

若 ``root`` 中存在某个节点，使以该节点为根的整棵后代树与 ``subRoot`` 在结构和每个对应节点值上完全相同，则返回 ``true``；否则返回 ``false``。匹配节点下面若还存在 ``subRoot`` 没有的额外孩子，也不算相同子树。

自建示例
--------

结构和值完全匹配：

.. code-block:: text

   输入：root = [8,3,10,1,6]，subRoot = [3,1,6]
   输出：true
   解释：root 的值为 3 的节点及其两个孩子与 subRoot 完全一致。

候选根相同但后代不同：

.. code-block:: text

   输入：root = [5,2,7,1,3]，subRoot = [2,1]
   输出：false
   解释：root 中值为 2 的节点还有右孩子 3，因此其完整子树结构与 subRoot 不同。

先定位候选根，再比较完整结构
----------------------------

对 ``root`` 的每个节点都可能是候选根；只有候选节点值相等时才调用结构比较。``same`` 同时检查节点值、左右孩子是否都存在以及对应子树是否相同，因而不会把只匹配一部分后代的情况当成子树。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       bool same(TreeNode* first, TreeNode* second) {
           if (first == nullptr || second == nullptr) {
               return first == second;
           }
           return first->val == second->val &&
                  same(first->left, second->left) &&
                  same(first->right, second->right);
       }

   public:
       bool isSubtree(TreeNode* root, TreeNode* subRoot) {
           if (subRoot == nullptr) return true;
           if (root == nullptr) return false;
           return same(root, subRoot) ||
                  isSubtree(root->left, subRoot) ||
                  isSubtree(root->right, subRoot);
       }
   };

代码分析
--------

只有完整结构比较成功才返回真，递归遍历 root 的所有候选节点不会漏掉任意起点。设 root 节点数为 ``n``、subRoot 节点数为 ``m``，朴素最坏时间复杂度为 ``O(nm)``，递归空间为 ``O(n+m)``。
