0515. Find Largest Value in Each Tree Row
=========================================

题目信息
--------

:题号: 0515
:难度: Medium
:主题: 二叉树、逐层统计、每层最大值、空树
:原题: `LeetCode 0515 <https://leetcode.com/problems/find-largest-value-in-each-tree-row/>`_
:重点: 每个深度单独返回一个最大节点值、结果按从根到叶的层级顺序排列、空树返回空数组

题目重述
--------

给定一棵二叉树，按深度把节点分成若干层。对每一层，找出该层所有节点值中的最大值，并按从第 0 层到最深层的顺序返回。

若根节点为空，返回空数组。节点值可以为负数，因此每层最大值必须来自该层实际节点，不能默认从零开始比较。

自建示例
--------

每层最大值来自不同分支：

.. code-block:: text

   输入：root = [7,4,9,1,6,8,10]
   输出：[7,9,10]
   解释：三层节点分别为 [7]、[4,9]、[1,6,8,10]，最大值依次为 7、9、10。

全部节点为负数：

.. code-block:: text

   输入：root = [-2,-5,-3]
   输出：[-2,-3]
   解释：第二层的最大值是 -3，而不是 0。

按层初始化真实最大值
--------------------

队列按层处理，每轮先用当前层第一个节点值初始化 ``maximum``，再比较该层其余节点。不能把最大值初始化为 0，因为节点值允许全为负数；处理完一层后把结果追加到答案，孩子留给下一轮。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::vector<int> largestValues(TreeNode* root) {
           if (root == nullptr) return {};
           std::queue<TreeNode*> queue;
           queue.push(root);
           std::vector<int> result;
           while (!queue.empty()) {
               int levelSize = static_cast<int>(queue.size());
               int maximum = queue.front()->val;
               for (int i = 0; i < levelSize; ++i) {
                   TreeNode* node = queue.front();
                   queue.pop();
                   maximum = std::max(maximum, node->val);
                   if (node->left != nullptr) queue.push(node->left);
                   if (node->right != nullptr) queue.push(node->right);
               }
               result.push_back(maximum);
           }
           return result;
       }
   };

代码分析
--------

记录 ``levelSize`` 把下一层节点排除在当前最大值之外，使用实际首节点初始化保证负数层也能正确比较。每个节点处理一次，时间复杂度为 ``O(n)``，队列额外空间为 ``O(w)``。
