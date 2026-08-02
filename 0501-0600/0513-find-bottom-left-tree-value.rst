0513. Find Bottom Left Tree Value
================================

题目信息
--------

:题号: 0513
:难度: Medium
:主题: 二叉树、最深层、最左节点、层级顺序
:原题: `LeetCode 0513 <https://leetcode.com/problems/find-bottom-left-tree-value/>`_
:重点: 返回最大深度那一层最先出现的节点值、不是几何坐标最小值、根节点非空

题目重述
--------

给定一棵非空二叉树，找到树中最深一层的最左侧节点，并返回该节点的值。这里的“最左侧”按二叉树从左到右的层级顺序判断，而不是比较节点值大小。

若最深层只有一个节点，直接返回该节点值；若整棵树只有根节点，根节点同时也是最深层最左节点。

自建示例
--------

最深节点位于左侧分支：

.. code-block:: text

   输入：root = [8,4,10,2,6,null,12,1]
   输出：1
   解释：最深层只有节点 1，因此它也是该层最左侧节点。

只有根节点：

.. code-block:: text

   输入：root = [5]
   输出：5
   解释：根节点是唯一节点，也是最深层的最左节点。

层序遍历中每层第一个节点
------------------------

队列按从左到右保存当前层。每轮开始时队首就是这一层最左节点，将它记录为 ``answer``，再处理整层并把孩子按左右顺序加入队尾。遍历结束时最后一次更新对应最深层的最左节点。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int findBottomLeftValue(TreeNode* root) {
           std::queue<TreeNode*> queue;
           queue.push(root);
           int answer = root->val;
           while (!queue.empty()) {
               int levelSize = static_cast<int>(queue.size());
               answer = queue.front()->val;
               for (int i = 0; i < levelSize; ++i) {
                   TreeNode* node = queue.front();
                   queue.pop();
                   if (node->left != nullptr) queue.push(node->left);
                   if (node->right != nullptr) queue.push(node->right);
               }
           }
           return answer;
       }
   };

代码分析
--------

每层先读取队首再处理孩子，保证记录的是该层最左而非最后访问节点；队列层序顺序使最后一层自然是最深层。每个节点入队出队一次，时间复杂度为 ``O(n)``，队列空间为 ``O(w)``，其中 ``w`` 是最大层宽。
