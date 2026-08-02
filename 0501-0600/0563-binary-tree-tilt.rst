0563. Binary Tree Tilt
======================

题目信息
--------

:题号: 0563
:难度: Easy
:主题: 二叉树、子树元素和、节点坡度、总和
:原题: `LeetCode 0563 <https://leetcode.com/problems/binary-tree-tilt/>`_
:重点: 每个节点坡度是左右子树和之差的绝对值、空子树和为 0、返回所有节点坡度之和

题目重述
--------

给定一棵二叉树。对任意节点，它的坡度定义为其左子树全部节点值之和与右子树全部节点值之和的差的绝对值。

整棵树的坡度等于所有节点坡度之和，返回这个总和。空子树的节点值之和按 ``0`` 计算；叶节点左右子树都为空，因此坡度为 ``0``。

自建示例
--------

不同层节点均产生坡度：

.. code-block:: text

   输入：root = [4,2,9,1,3,7]
   输出：19
   解释：节点 2 的坡度为 |1-3|=2，节点 9 的坡度为 |7-0|=7，根节点坡度为 |6-16|=10，叶节点坡度均为 0，总和为 19。

单个节点：

.. code-block:: text

   输入：root = [6]
   输出：0
   解释：左右子树都为空，坡度为 0。

后序同时返回子树和并累加坡度
----------------------------

节点坡度依赖左右子树的总和，因此后序递归返回子树和，并在返回前用 ``abs(leftSum-rightSum)`` 加入全局答案。叶节点得到两个 0，自然贡献 0。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       long long totalTilt = 0;

       long long sum(TreeNode* node) {
           if (node == nullptr) return 0;
           long long left = sum(node->left);
           long long right = sum(node->right);
           totalTilt += std::llabs(left - right);
           return left + right + node->val;
       }

   public:
       int findTilt(TreeNode* root) {
           totalTilt = 0;
           sum(root);
           return static_cast<int>(totalTilt);
       }
   };

代码分析
--------

子树和在父节点使用前已经完整计算，递归返回值与定义一致；每个节点的坡度只加一次。时间复杂度为 ``O(n)``，递归栈空间为 ``O(h)``。
