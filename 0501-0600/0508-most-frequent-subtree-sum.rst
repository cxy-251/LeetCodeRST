0508. Most Frequent Subtree Sum
===============================

题目信息
--------

:题号: 0508
:难度: Medium
:主题: 二叉树、子树元素和、频率统计、并列结果
:原题: `LeetCode 0508 <https://leetcode.com/problems/most-frequent-subtree-sum/>`_
:重点: 每个节点都定义一棵以其为根的子树、子树和包含全部后代、返回所有最高频率的和且顺序不限

题目重述
--------

给定一棵非空二叉树。对树中的每个节点，计算以该节点为根的整棵子树中所有节点值之和；不同节点即使得到相同的和，也分别贡献一次出现次数。

返回出现频率最高的所有子树和。若多个和并列最高，需要全部返回，顺序不限。节点值和子树和都可能为负数。

自建示例
--------

某个子树和重复出现：

.. code-block:: text

   输入：root = [0,1,1]
   输出：[1]
   解释：两个叶节点对应的子树和都为 1，根节点对应的子树和为 2，因此 1 的频率最高。

所有子树和频率相同：

.. code-block:: text

   输入：root = [3,1,-1]
   输出：[1,-1,3]
   解释：两个叶子的子树和分别为 1 和 -1，整棵树的和为 3，三者都只出现一次，因此都应返回，顺序不限。

后序计算子树和并累计频率
------------------------

节点的子树和必须等左右子树都已知道，因此用后序递归返回 ``leftSum + rightSum + node->val``。每得到一个子树和就增加其频率并更新最高频率；遍历结束后再收集所有达到最高频率的和。

子树和可能为负数，哈希表键使用 ``long long``；不同节点产生相同和时，频率仍按节点次数累加。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       std::unordered_map<long long, int> frequency;
       int bestFrequency = 0;

       long long sum(TreeNode* node) {
           if (node == nullptr) return 0;
           long long total = node->val + sum(node->left) +
                             sum(node->right);
           bestFrequency = std::max(bestFrequency, ++frequency[total]);
           return total;
       }

   public:
       std::vector<int> findFrequentTreeSum(TreeNode* root) {
           frequency.clear();
           bestFrequency = 0;
           sum(root);
           std::vector<int> result;
           for (const auto& [value, count] : frequency) {
               if (count == bestFrequency) {
                   result.push_back(static_cast<int>(value));
               }
           }
           return result;
       }
   };

代码分析
--------

后序返回值确保每个节点的和包含全部后代，哈希频率确保并列结果不会遗漏。每个节点只计算一次，时间复杂度为 ``O(n)``（平均哈希），递归栈和频率表空间为 ``O(n)``。
