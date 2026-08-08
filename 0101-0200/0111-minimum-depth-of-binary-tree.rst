0111. Minimum Depth of Binary Tree
==================================

题目信息
--------

:题号: 0111. 二叉树的最小深度
:难度: Easy
:主题: 二叉树、根到叶路径、广度优先搜索、提前结束
:原题: `LeetCode 0111 <https://leetcode.com/problems/minimum-depth-of-binary-tree/>`_
:重点: 区分空孩子与叶节点，修正递归最小值状态，再利用 BFS 的深度顺序在首个叶节点停止

题目重述
--------

给定二叉树根节点 ``root``，返回从根到最近叶节点的路径所包含的节点数。叶节点必须同时没有左孩子和右孩子；
只有一个孩子的节点不是叶节点，缺失的孩子位置也不能当作一条已结束路径。空树的最小深度为 ``0``。

树中节点总数在 ``0..10^5`` 范围内，节点值在 ``-1000..1000`` 范围内。节点值不影响答案，算法不修改树。

自建示例
--------

* 多个最近叶：``root = [6,2,9,null,4,8,12,null,null,7]``，返回 ``3``，节点 ``4``、``12`` 都是
  深度 ``3`` 的叶节点；
* 单侧链：``root = [5,null,7,null,9]``，返回 ``3``，缺失的左孩子不能使 ``5`` 或 ``7`` 提前结束；
* 单节点：``root = [3]``，返回 ``1``；
* 空树：``root = []``，返回 ``0``。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <queue>

   class Solution {
   private:
       int recursiveMinimumDepth(TreeNode* node) {
           if (!node) {
               return 0;
           }
           if (!node->left) {
               return 1 + recursiveMinimumDepth(node->right);
           }
           if (!node->right) {
               return 1 + recursiveMinimumDepth(node->left);
           }
           return 1 + std::min(recursiveMinimumDepth(node->left), recursiveMinimumDepth(node->right));
       }

       int breadthFirstMinimumDepth(TreeNode* root) {
           if (!root) {
               return 0;
           }
           std::queue<TreeNode*> pending;
           pending.push(root);
           int depth = 1;
           while (!pending.empty()) {
               const int levelSize = static_cast<int>(pending.size());
               for (int count = 0; count < levelSize; ++count) {
                   TreeNode* node = pending.front();
                   pending.pop();
                   if (!node->left && !node->right) {
                       return depth;
                   }
                   if (node->left) {
                       pending.push(node->left);
                   }
                   if (node->right) {
                       pending.push(node->right);
                   }
               }
               ++depth;
           }
           return 0;
       }

   public:
       int minDepth(TreeNode* root) {
           return breadthFirstMinimumDepth(root);
       }
   };

题解
----

原始路径搜索
~~~~~~~~~~~~

最小深度来自某条根到叶路径。最直接的正确思路是枚举所有根到叶路径：沿孩子继续搜索，只在节点同时没有
左右孩子时记录当前路径长度，最后取所有叶深度的最小值。检查全部叶节点显然覆盖所有合法终点。

关键在“合法终点”。空指针只表示某个孩子不存在，并不是树中的叶节点。若当前节点只有右孩子，根到叶路径
仍必须进入右侧；不能沿缺失的左侧走一步便宣告路径结束。

递归最小值陷阱
~~~~~~~~~~~~~~

最大深度可以统一写成 ``1 + max(leftDepth, rightDepth)``，因为空孩子深度 ``0`` 不会抢走非空侧的较大值。
最小深度若机械改成 ``1 + min(...)`` 就会出错：对 ``[5,null,7,null,9]``，根的左侧返回 ``0``，公式
立即得到 ``1``，却没有到达任何叶节点。

``recursiveMinimumDepth`` 因此区分三类非空节点：

* 左孩子为空时，只能沿右孩子继续；若两侧都空，右递归返回 ``0``，当前叶节点自然得到 ``1``；
* 右孩子为空时，只能沿左孩子继续；
* 两个孩子都存在时，两侧都有合法叶路径，才能取较小深度。

这版递归不需要保存完整路径，只让每棵子树返回到最近叶节点的距离，已经把路径数组压缩为一个整数。它仍可能
为了比较两侧而访问整棵树；而最小值问题还提供了更强的信息：只要按深度递增访问，第一个叶节点就是答案。

按层提前结束
~~~~~~~~~~~~~~

``breadthFirstMinimumDepth`` 使用队列按层处理节点。每轮开始时，队列中的 ``levelSize`` 个节点处于同一深度；
只弹出这批节点，处理中加入的孩子留到下一轮。完成整层后才递增 ``depth``。

当弹出一个同时没有左右孩子的节点时，可以立即返回当前深度。此时所有更浅节点已经检查完且都不是叶节点，
队列中剩余节点与当前节点同深或更深，尚未入队的节点只会更深，所以不可能再出现更小答案。

对第一个示例，状态为：

.. list-table::
   :header-rows: 1

   * - 深度
     - 本层队列
     - 检查结果
     - 下一层队列
   * - 1
     - ``[6]``
     - 根不是叶节点
     - ``[2,9]``
   * - 2
     - ``[2,9]``
     - 两者都至少有一个孩子
     - ``[4,8,12]``
   * - 3
     - ``[4,8,12]``
     - ``4`` 是叶节点，立即返回 3
     - 不再生成

``4`` 后面即使还有同层节点，也不需要继续比较；它们最多提供相同深度，不可能改善最小值。

分支顺序与主解
~~~~~~~~~~~~~~

BFS 必须先判断当前节点是否为叶，再把非空孩子入队。若把“一侧为空”误当叶条件，单侧链会提前返回；若不
固定层大小便持续弹出不断增长的队列，``depth`` 将失去层边界。

公开入口采用 BFS。它直接利用“最浅叶”的目标顺序，并避免最多 ``10^5`` 个节点形成单侧链时的深递归栈；
递归方法仍保留，因为它清楚展示了空孩子为何不能参与普通最小值比较。

复杂度分析
~~~~~~~~~~

两种方法最坏都访问全部 ``n`` 个节点，时间为 ``O(n)``。递归工作空间为树高 ``O(h)``；BFS 队列为最大
层宽 ``O(w)``。BFS 遇到最近叶节点时提前结束，实际访问量可能明显小于 ``n``。返回值只占常数空间。
