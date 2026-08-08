0104. Maximum Depth of Binary Tree
==================================

题目信息
--------

:题号: 0104. 二叉树的最大深度
:难度: Easy
:主题: 二叉树、深度优先搜索、后序递归、广度优先搜索
:原题: `LeetCode 0104 <https://leetcode.com/problems/maximum-depth-of-binary-tree/>`_
:重点: 从枚举根到叶路径，压缩为深度状态，再把全局最值改写成子树高度返回值

题目重述
--------

给定二叉树根节点 ``root``，返回树的最大深度。深度按照节点数计算：从根到最远叶节点的路径包含多少个节点，
最大深度就是多少。因此单节点树的深度为 ``1``，空树的深度为 ``0``。

树中节点总数在 ``0..10^4`` 范围内，节点值在 ``-100..100`` 范围内。节点值不影响深度，算法只读取树的
结构，不修改节点或指针。

自建示例
--------

* 两侧高度不同：``root = [5,2,8,null,3,null,10,null,4]``，返回 ``4``。最长路径为
  ``5 -> 2 -> 3 -> 4``；
* 单侧链：``root = [1,null,2,null,3]``，返回 ``3``，不能因为每层只有一个节点而少计；
* 单节点：``root = [7]``，返回 ``1``；
* 空树：``root = []``，返回 ``0``。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <queue>

   class Solution {
   private:
       void updateMaximumDepth(TreeNode* node, int depth, int& maximumDepth) {
           if (!node) {
               return;
           }
           maximumDepth = std::max(maximumDepth, depth);
           updateMaximumDepth(node->left, depth + 1, maximumDepth);
           updateMaximumDepth(node->right, depth + 1, maximumDepth);
       }

       int topDownDepth(TreeNode* root) {
           int maximumDepth = 0;
           updateMaximumDepth(root, 1, maximumDepth);
           return maximumDepth;
       }

       int breadthFirstDepth(TreeNode* root) {
           if (!root) {
               return 0;
           }
           std::queue<TreeNode*> pending;
           pending.push(root);
           int depth = 0;
           while (!pending.empty()) {
               const int levelSize = static_cast<int>(pending.size());
               ++depth;
               for (int count = 0; count < levelSize; ++count) {
                   TreeNode* node = pending.front();
                   pending.pop();
                   if (node->left) {
                       pending.push(node->left);
                   }
                   if (node->right) {
                       pending.push(node->right);
                   }
               }
           }
           return depth;
       }

       int subtreeHeight(TreeNode* node) {
           if (!node) {
               return 0;
           }
           const int leftHeight = subtreeHeight(node->left);
           const int rightHeight = subtreeHeight(node->right);
           return 1 + std::max(leftHeight, rightHeight);
       }

   public:
       int maxDepth(TreeNode* root) {
           return subtreeHeight(root);
       }
   };

题解
----

原始路径空间
~~~~~~~~~~~~

最大深度来自某一条根到叶路径，因此最直观的正确方案是枚举所有这类路径：沿当前路径不断进入左右孩子，
到叶节点时统计路径包含的节点数，再保留最大值。每个最远节点必然是叶节点，否则还可以继续走向它的孩子，
得到更长路径；所以检查完所有叶节点不会遗漏答案。

若为每个递归分支维护完整的节点数组，真正用于比较的却只有数组长度。路径中的节点值、访问方向和完整副本
都不会影响最大深度。这道题首先要删除的工作不是某个搜索分支，而是路径表示中无关的内容。

深度计数
~~~~~~~~

从根进入孩子时，路径节点数恰好加一，所以可以只携带整数 ``depth``。``updateMaximumDepth`` 进入根时使用
深度 ``1``，每下降一层传入 ``depth + 1``，并用 ``maximumDepth`` 保存目前见过的最大值。

代码在每个非空节点更新最大值，不必专门判断叶节点。非叶节点的深度不会超过其后代，提前参与比较只可能
暂时更新较小值；遍历到最深节点时仍会得到最终答案。空树第一次调用便返回，初始最大值 ``0`` 保持不变。

完整路径数组由一个深度整数替代，但这个自顶向下方案仍有可变的外部状态：子调用通过引用共同修改
``maximumDepth``。还可以换一个观察方向，让每棵子树直接返回自己的答案。

子树高度
~~~~~~~~

定义 ``height(node)`` 为以 ``node`` 为根的子树最大深度。空指针没有节点，高度为 ``0``；非空节点到最远
叶节点的路径必须先计入当前节点，再进入左右子树中更高的一侧：

.. code-block:: text

   height(null) = 0
   height(node) = 1 + max(height(node.left), height(node.right))

这不是在根处猜测应走左边还是右边。``subtreeHeight`` 先求出两侧各自能达到的最大长度，再舍弃较短者；
任意根到叶路径的第一步只能落在这两侧之一，因此较大值覆盖当前子树的全部候选。

空指针返回 ``0`` 让叶节点自然得到 ``1 + max(0, 0) = 1``，无需额外叶节点分支。每层调用把子问题结果
加一后返回，原来的全局最大值、当前深度参数和进入节点时的更新操作全部消失。公开入口采用这一后序递归，
因为返回值就是当前子树的完整答案，状态边界最清楚。

后序状态走读
~~~~~~~~~~~~

对 ``[5,2,8,null,3,null,10,null,4]``，结果从叶节点向根汇总：

.. list-table::
   :header-rows: 1

   * - 节点
     - 左子树高度
     - 右子树高度
     - 返回高度
   * - 4
     - 0
     - 0
     - 1
   * - 3
     - 0
     - 1
     - 2
   * - 2
     - 0
     - 2
     - 3
   * - 10
     - 0
     - 0
     - 1
   * - 8
     - 0
     - 1
     - 2
   * - 5
     - 3
     - 2
     - 4

节点 ``5`` 不需要知道左侧最深路径经过哪些具体节点，只接收高度 ``3``；与右侧高度 ``2`` 比较后加一，
便得到整棵树深度 ``4``。这体现了返回状态对完整路径的压缩。

按层计数
~~~~~~~~

``breadthFirstDepth`` 提供不依赖递归的替代方案。队列每轮开始时保存当前层全部节点，固定 ``levelSize`` 后
弹出这一层并加入下一层孩子；每完成一轮，深度加一。最后一层处理结束后队列为空，轮数恰好等于树的层数。

BFS 与后序递归都访问全部节点，只是保存未完成工作的方式不同。后序法保存一条递归路径，空间取决于树高；
BFS 保存层级前沿，空间取决于最大层宽。宽而浅的树更适合递归空间，极深的树则可以用 BFS 避免调用栈风险。

复杂度分析
~~~~~~~~~~

三种实现都访问每个节点一次，时间为 ``O(n)``。自顶向下与后序递归的调用栈为 ``O(h)``，其中 ``h`` 是
树高；单侧链上最坏为 ``O(n)``。BFS 队列工作空间为 ``O(w)``，其中 ``w`` 是最大层宽。所有方法只返回
一个整数，没有与节点数相关的结果空间。
