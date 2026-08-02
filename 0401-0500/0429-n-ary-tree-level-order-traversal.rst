0429. N-ary Tree Level Order Traversal
======================================

题目信息
--------

:题号: 0429
:难度: Medium
:主题: N 叉树、层级、从左到右、二维结果
:原题: `LeetCode 0429 <https://leetcode.com/problems/n-ary-tree-level-order-traversal/>`_
:重点: 每个节点可以有任意数量子节点、按深度分组、同层保持子节点顺序、空树返回空数组

题目重述
--------

给定一棵 N 叉树的根节点 ``root``，按从上到下的层级顺序返回节点值。结果是二维数组：第 ``d`` 个内层数组包含深度为 ``d`` 的全部节点值，并按它们在树中从左到右出现的顺序排列。

树中节点数位于 ``[0, 10^4]``，节点值位于 ``[0, 10^4]``，树的最大深度不超过 ``1000``。若 ``root`` 为空，返回空数组；函数不需要修改节点或子节点列表。

自建示例
--------

不同父节点在同一层贡献子节点：

.. code-block:: text

   输入：根节点 5 的孩子依次为 2、8、9；节点 2 的孩子为 1；节点 9 的孩子依次为 6、7
   输出：[[5], [2,8,9], [1,6,7]]
   解释：第三层先收集节点 2 的孩子 1，再收集节点 9 的孩子 6、7，保持从左到右顺序。

空树：

.. code-block:: text

   输入：root = null
   输出：[]
   解释：没有任何节点，因此没有层级结果。

按队列长度切分层级
--------------------

队列始终保存尚未处理的节点，并且从左到右排列。每轮先记录当前队列长度，这个长度就是当前层节点数；连续弹出这些节点写入一行，再按原顺序把它们的所有孩子加入队尾，下一轮便恰好处理下一层。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::vector<std::vector<int>> levelOrder(Node* root) {
           if (root == nullptr) return {};
           std::queue<Node*> queue;
           queue.push(root);
           std::vector<std::vector<int>> result;

           while (!queue.empty()) {
               int levelSize = static_cast<int>(queue.size());
               std::vector<int> level;
               for (int i = 0; i < levelSize; ++i) {
                   Node* current = queue.front();
                   queue.pop();
                   level.push_back(current->val);
                   for (Node* child : current->children) {
                       queue.push(child);
                   }
               }
               result.push_back(std::move(level));
           }
           return result;
       }
   };

代码分析
--------

记录 ``levelSize`` 把同层节点与下一层节点分开，孩子的遍历顺序直接决定每层的从左到右顺序。每个节点入队、出队一次，时间复杂度为 ``O(n)``，队列和结果之外的额外空间为 ``O(n)``。
