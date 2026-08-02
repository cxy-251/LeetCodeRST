0590. N-ary Tree Postorder Traversal
===================================

题目信息
--------

:题号: 0590
:难度: Easy
:主题: N 叉树、后序遍历、孩子顺序、值序列
:原题: `LeetCode 0590 <https://leetcode.com/problems/n-ary-tree-postorder-traversal/>`_
:重点: 先按 children 从左到右遍历全部子树、最后访问当前节点、空树返回空数组

题目重述
--------

给定一棵 N 叉树的根节点 ``root``，返回它的后序遍历节点值序列。

后序遍历按照节点 ``children`` 数组中的顺序，从左到右完整遍历每棵子树，最后才访问当前节点。兄弟节点顺序不能改变；若树为空，返回空数组。

自建示例
--------

根节点最后访问：

.. code-block:: text

   输入：根 1 的孩子为 [2,3,4]，3 的孩子为 [5,6]
   输出：[2,5,6,3,4,1]
   解释：先完成 2、3、4 三棵子树的后序遍历，最后访问根节点 1。

只有根节点：

.. code-block:: text

   输入：root = [7]
   输出：[7]
   解释：没有子树，直接在最后访问根节点。

先递归孩子再记录当前节点
------------------------

后序遍历的递归结构直接对应定义：按 children 从左到右调用每棵子树，所有孩子完成后才把当前节点值追加到结果。空节点不产生值。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       std::vector<int> result;

       void visit(Node* node) {
           if (node == nullptr) return;
           for (Node* child : node->children) visit(child);
           result.push_back(node->val);
       }

   public:
       std::vector<int> postorder(Node* root) {
           result.clear();
           visit(root);
           return result;
       }
   };

代码分析
--------

递归返回前才记录节点，保证所有孩子及其后代先出现且顺序不变；每个节点访问一次，时间复杂度为 ``O(n)``，递归栈空间为 ``O(h)``。
