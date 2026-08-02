0437. Path Sum III
==================

题目信息
--------

:题号: 0437
:难度: Medium
:主题: 二叉树、向下路径、任意起终点、路径和计数
:原题: `LeetCode 0437 <https://leetcode.com/problems/path-sum-iii/>`_
:重点: 路径只能从父节点走向子节点、可从任意节点开始和结束、单节点也算路径、统计路径数量

题目重述
--------

给定二叉树根节点 ``root`` 和整数 ``targetSum``，统计树中节点值之和恰好等于 ``targetSum`` 的路径数量。

每条路径必须沿父节点到子节点的方向连续向下移动，但不要求从根节点开始，也不要求在叶节点结束。不同的起点、终点或经过节点构成不同路径；单个节点本身也可以是一条路径。

树中节点数位于 ``[0, 1000]``，节点值位于 ``[-10^9, 10^9]``，``targetSum`` 位于 ``[-1000, 1000]``。空树返回 0。

自建示例
--------

包含根节点路径和内部路径：

.. code-block:: text

   输入：root = [5,3,-2,2,1,null,4]，targetSum = 5
   输出：2
   解释：一条路径是单节点 [5]，另一条路径是 3 -> 2。两条路径的起点不同，应分别计数。

空树：

.. code-block:: text

   输入：root = null，targetSum = 0
   输出：0
   解释：不存在节点，因此也不存在任何路径。

前缀和差值对应一条向下路径
----------------------------

沿根到当前节点的路径维护前缀和 ``current``。若某个更早前缀为 ``current - target``，从它之后到当前节点的连续向下路径就恰好和为 ``target``。用哈希表记录当前递归路径上每个前缀和出现次数，访问节点时查询、再加入；离开节点时撤销加入，避免把不同分支拼成一条路径。

初始前缀和 0 出现一次，覆盖从根开始的路径；所有和使用 ``long long``。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       int target;
       std::unordered_map<long long, int> prefix;

       int dfs(TreeNode* node, long long current) {
           if (node == nullptr) return 0;
           current += node->val;
           int result = prefix[current - target];
           ++prefix[current];
           result += dfs(node->left, current);
           result += dfs(node->right, current);
           if (--prefix[current] == 0) prefix.erase(current);
           return result;
       }

   public:
       int pathSum(TreeNode* root, int targetSum) {
           target = targetSum;
           prefix.clear();
           prefix[0] = 1;
           return dfs(root, 0);
       }
   };

代码分析
--------

哈希表只保存当前根到节点的祖先前缀，差值查询一一对应以当前节点结尾的合法路径；回溯删除保证兄弟子树重新使用干净的路径状态。每个节点平均进行常数次哈希操作，时间复杂度为 ``O(n)``，递归和前缀表空间为 ``O(h)`` 到 ``O(n)``。
