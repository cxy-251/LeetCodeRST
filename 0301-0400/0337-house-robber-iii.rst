0337. House Robber III
======================

题目信息
--------

:题号: 0337
:难度: Medium
:主题: 二叉树、节点选择、父子冲突、最大金额
:原题: `LeetCode 0337 <https://leetcode.com/problems/house-robber-iii/>`_
:重点: 直接相连的父子节点不能同时选择、兄弟和更远后代可以组合、只返回最大总金额

题目重述
--------

房屋按照一棵二叉树连接，每个节点值表示盗取该房屋可以获得的金额。若在同一晚选择两个由一条边直接连接的房屋，也就是同时选择某个父节点及其子节点，警报会被触发。

在不选择任何相邻父子节点的条件下，返回能够获得的最大金额。树中节点数位于 ``[1, 10^4]``，节点值位于 ``[0, 10^4]``。可以同时选择位于不同分支的节点，也可以同时选择祖孙节点，只要它们之间不是直接父子关系；题目不要求返回具体节点集合。

自建示例
--------

选择根节点和孙节点：

.. code-block:: text

   输入：root = [4, 1, 5, null, 2, null, 6]
   输出：12
   解释：选择金额为 4 的根节点以及两个孙节点 2、6，总金额为 12；它们之间没有直接父子关系。

所有金额为零：

.. code-block:: text

   输入：root = [0, 0, 0]
   输出：0
   解释：无论选择哪些合法节点，总金额都为 0。

每个节点只需两个互斥状态
--------------------------

对每个子树返回两个值：``notRob`` 表示不选择当前节点时的最大金额，``rob`` 表示选择当前节点时的最大金额。若选择当前节点，两个孩子都不能选，所以只能加上孩子的 ``notRob``；若不选择当前节点，每个孩子可以选也可以不选，分别取两种状态的较大值。

后序遍历先得到左右子树状态，再合并当前节点。这样直接相连的父子冲突被局部状态完整表达，而兄弟节点的选择可以独立组合；祖孙节点不直接相连，也会在不同层的状态转移中被允许。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       std::pair<int, int> dfs(TreeNode* node) {
           if (node == nullptr) return {0, 0};

           auto left = dfs(node->left);
           auto right = dfs(node->right);
           int notRob = std::max(left.first, left.second)
                      + std::max(right.first, right.second);
           int rob = node->val + left.first + right.first;
           return {notRob, rob};
       }

   public:
       int rob(TreeNode* root) {
           auto result = dfs(root);
           return std::max(result.first, result.second);
       }
   };

代码分析
--------

状态的第一项和第二项分别固定了当前节点是否被选择，子树之间只通过这两个最优值交互，不需要记录具体盗取路径。每个树节点访问一次，时间复杂度为 ``O(n)``；递归栈空间为 ``O(h)``，其中 ``h`` 是树高。
