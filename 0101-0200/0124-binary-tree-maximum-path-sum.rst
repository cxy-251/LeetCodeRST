0124. Binary Tree Maximum Path Sum
==================================

题目信息
--------

:题号: 0124. 二叉树中的最大路径和
:难度: Hard
:主题: 二叉树、路径端点、后序遍历、树形动态规划
:原题: `LeetCode 0124 <https://leetcode.com/problems/binary-tree-maximum-path-sum/>`_
:重点: 用路径的唯一最高节点分类候选，区分可同时接两侧的完整路径与只能向父节点延伸一侧的返回收益

题目重述
--------

给定一棵非空二叉树，返回任意一条非空路径的最大节点值总和。路径可从任意节点开始、在任意节点结束；相邻
节点必须由一条父子边连接，同一节点不能重复经过。路径不要求经过根，也不要求端点是叶节点。

树中节点总数在 ``1..3 * 10^4`` 范围内，节点值在 ``-1000..1000`` 范围内。所有值为负时也必须选择至少
一个真实节点，不能用空路径得到 ``0``。

自建示例
--------

* 跨过根的路径：``root = [5,-2,8,4,-6,-3,10]``，返回 ``25``，路径为
  ``4 -> -2 -> 5 -> 8 -> 10``；
* 最优路径位于子树：``root = [-10,9,20,null,null,15,7]``，返回 ``42``，路径 ``15 -> 20 -> 7``
  不经过整棵树根；
* 全负树：``root = [-8,-3,-11]``，返回 ``-3``；
* 单节点：``root = [6]``，返回 ``6``。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <climits>

   class Solution {
   private:
       int bestDownwardChain(TreeNode* node) {
           if (!node) {
               return 0;
           }
           const int leftGain = bestDownwardChain(node->left);
           const int rightGain = bestDownwardChain(node->right);
           return node->val + std::max({0, leftGain, rightGain});
       }

       void enumerateHighestNodes(TreeNode* node, int& maximumPath) {
           if (!node) {
               return;
           }
           const int leftGain = std::max(0, bestDownwardChain(node->left));
           const int rightGain = std::max(0, bestDownwardChain(node->right));
           maximumPath = std::max(maximumPath, node->val + leftGain + rightGain);
           enumerateHighestNodes(node->left, maximumPath);
           enumerateHighestNodes(node->right, maximumPath);
       }

       int postorderGain(TreeNode* node, int& maximumPath) {
           if (!node) {
               return 0;
           }
           const int leftGain = std::max(0, postorderGain(node->left, maximumPath));
           const int rightGain = std::max(0, postorderGain(node->right, maximumPath));
           maximumPath = std::max(maximumPath, node->val + leftGain + rightGain);
           return node->val + std::max(leftGain, rightGain);
       }

   public:
       int maxPathSum(TreeNode* root) {
           int maximumPath = INT_MIN;
           postorderGain(root, maximumPath);
           return maximumPath;
       }
   };

题解
----

端点对与最高节点
~~~~~~~~~~~~~~~~

原始候选可以看成任选两个节点作为端点，取树中连接它们的唯一路径，再计算路径和。直接枚举端点对已经有
``O(n²)`` 个候选，若每次还重新寻找并累加中间节点，工作会更大。

树上任意简单路径都有一个唯一的最高节点：路径中深度最小的节点，也就是两个端点的最近公共祖先；若一个
端点是另一个祖先，最高节点就是该端点。从最高节点看，路径最多由三部分组成：左子树中的一条向下链、当前
节点、右子树中的一条向下链。某一侧也可以为空。

于是无需直接枚举端点对。可以改为枚举每个节点作为路径最高点，并只询问它的左右子树各自能提供多大的向下
收益。每条路径会归入其唯一最高节点，不重不漏。

重复求向下收益
~~~~~~~~~~~~~~

定义 ``bestDownwardChain(node)`` 为从 ``node`` 开始、沿孩子方向选择至多一侧延伸的最大非空路径和。当前
节点必须保留，左右孩子最多选择收益较大且为正的一侧。

``enumerateHighestNodes`` 对每个候选最高节点分别调用这个函数求左右收益，逻辑正确，却会反复扫描相同子树。
单侧树中，根计算长度 ``n`` 的向下链，下一节点又计算长度 ``n - 1``，最坏时间 ``O(n²)``。子树收益应在
首次完成时直接返回给父节点。

两种不同结果
~~~~~~~~~~~~

后序处理 ``node`` 时，左右孩子各返回一条能向上连接的最佳向下链。当前节点需要产生两个不同量。

以当前节点为最高点的完整候选可以同时使用两侧：

.. code-block:: text

   complete = node.value + leftGain + rightGain

但向父节点返回的链只能选择一侧：

.. code-block:: text

   upward = node.value + max(leftGain, rightGain)

若把左右两侧都向父节点返回，父节点再连接后会在 ``node`` 处形成三个分支，不再是一条简单路径。完整候选
负责更新全局答案，单侧收益负责参与祖先候选，这两个状态不能混用。

负收益截断
~~~~~~~~~~

若孩子返回的向下收益为负，把它接入当前路径只会减小总和。路径端点允许停在当前节点，所以父节点可以完全
不使用该侧，代码将孩子收益截断为 ``max(0, gain)``。

当前节点本身不能截断为空。``postorderGain`` 返回的链必须从当前真实节点开始，完整候选也至少包含当前节点。
全局 ``maximumPath`` 初始化为 ``INT_MIN``，并在每个非空节点更新；全负树因此选择值最大的单节点，而不会
错误返回空路径的 ``0``。

后序状态走读
~~~~~~~~~~~~

对 ``[5,-2,8,4,-6,-3,10]``：

.. list-table::
   :header-rows: 1

   * - 节点
     - 截断后左收益
     - 截断后右收益
     - 完整候选
     - 向上返回
   * - 4
     - 0
     - 0
     - 4
     - 4
   * - -6
     - 0
     - 0
     - -6
     - -6
   * - -2
     - 4
     - 0
     - 2
     - 2
   * - -3
     - 0
     - 0
     - -3
     - -3
   * - 10
     - 0
     - 0
     - 10
     - 10
   * - 8
     - 0
     - 10
     - 18
     - 18
   * - 5
     - 2
     - 18
     - 25
     - 23

节点 ``5`` 的完整候选同时接入两侧得到全局答案 ``25``，但只向不存在的父节点返回较大一侧形成的 ``23``。
即使最终返回值未再使用，这一区分保证同一函数在所有子树中语义一致。

主解与复杂度
~~~~~~~~~~~~

公开入口采用一次后序遍历。每个节点只接收左右孩子结果、更新一次完整候选并返回一次单侧收益，重复求链的
工作全部删除。任意路径在其唯一最高节点处都会被考虑，生成的候选又都由真实父子边组成。

主解时间 ``O(n)``，递归栈 ``O(h)``，单侧树最坏为 ``O(n)``；按最高节点重复求收益的基线最坏时间
``O(n²)``。路径和范围适合 32 位整数，返回值只占常数空间。
