0102. Binary Tree Level Order Traversal
=======================================

题目信息
--------

:题号: 0102. 二叉树的层序遍历
:难度: Medium
:主题: 二叉树、广度优先搜索、深度优先搜索、队列
:原题: `LeetCode 0102 <https://leetcode.com/problems/binary-tree-level-order-traversal/>`_
:重点: 从逐层重复寻找节点，推导到携带深度的一次遍历，再用队列前沿直接维护层边界

题目重述
--------

给定二叉树根节点 ``root``，按照节点到根的距离从小到大返回所有节点值。返回结果是二维数组：第 ``d`` 个
子数组保存深度为 ``d`` 的全部节点，同一层内必须按照树中从左到右的顺序排列。

结果只包含实际存在的节点，不需要为空孩子保留占位。空树没有任何层，应返回空数组。遍历过程不修改树。

树中节点总数在 ``0..2000`` 范围内，节点值在 ``-1000..1000`` 范围内。

自建示例
--------

* 稀疏结构：``root = [8,4,12,null,6,10,14]``，返回 ``[[8],[4,12],[6,10,14]]``。第三层的 ``6``
  是节点 ``4`` 的右孩子，仍排在节点 ``12`` 的两个孩子之前；
* 单侧延伸：``root = [5,null,7,null,9]``，返回 ``[[5],[7],[9]]``。每个深度都只有一个节点；
* 单节点：``root = [3]``，返回 ``[[3]]``；
* 空树：``root = []``，返回 ``[]``，不能返回包含一个空行的 ``[[]]``。

C++ 实现
--------

.. code-block:: cpp

   #include <queue>
   #include <utility>
   #include <vector>

   class Solution {
   private:
       void collectAtDepth(TreeNode* node, int currentDepth, int targetDepth, std::vector<int>& level) {
           if (!node) {
               return;
           }
           if (currentDepth == targetDepth) {
               level.push_back(node->val);
               return;
           }
           collectAtDepth(node->left, currentDepth + 1, targetDepth, level);
           collectAtDepth(node->right, currentDepth + 1, targetDepth, level);
       }

       std::vector<std::vector<int>> levelsByRepeatedDepthSearch(TreeNode* root) {
           std::vector<std::vector<int>> levels;
           for (int targetDepth = 0;; ++targetDepth) {
               std::vector<int> level;
               collectAtDepth(root, 0, targetDepth, level);
               if (level.empty()) {
                   break;
               }
               levels.push_back(std::move(level));
           }
           return levels;
       }

       void collectByDepth(TreeNode* node, int depth, std::vector<std::vector<int>>& levels) {
           if (!node) {
               return;
           }
           if (depth == static_cast<int>(levels.size())) {
               levels.emplace_back();
           }
           levels[depth].push_back(node->val);
           collectByDepth(node->left, depth + 1, levels);
           collectByDepth(node->right, depth + 1, levels);
       }

       std::vector<std::vector<int>> levelsByDepthFirstSearch(TreeNode* root) {
           std::vector<std::vector<int>> levels;
           collectByDepth(root, 0, levels);
           return levels;
       }

       std::vector<std::vector<int>> levelsByBreadthFirstSearch(TreeNode* root) {
           if (!root) {
               return {};
           }
           std::vector<std::vector<int>> levels;
           std::queue<TreeNode*> pending;
           pending.push(root);
           while (!pending.empty()) {
               const int levelSize = static_cast<int>(pending.size());
               std::vector<int> level;
               level.reserve(levelSize);
               for (int count = 0; count < levelSize; ++count) {
                   TreeNode* node = pending.front();
                   pending.pop();
                   level.push_back(node->val);
                   if (node->left) {
                       pending.push(node->left);
                   }
                   if (node->right) {
                       pending.push(node->right);
                   }
               }
               levels.push_back(std::move(level));
           }
           return levels;
       }

   public:
       std::vector<std::vector<int>> levelOrder(TreeNode* root) {
           return levelsByBreadthFirstSearch(root);
       }
   };

题解
----

原始分层搜索
~~~~~~~~~~~~

题目直接按深度组织输出，因此最直观的正确方案是一次只构造一层。先从根出发寻找深度 ``0`` 的节点，再从
根寻找深度 ``1`` 的节点，随后依次处理 ``2``、``3``，直到某个深度没有节点。

``collectAtDepth`` 用 ``currentDepth`` 记录当前节点深度，到达 ``targetDepth`` 时保存节点值并停止向下。
递归始终先访问左孩子再访问右孩子，所以同一目标深度的节点会按从左到右的顺序进入 ``level``。每个非空
节点以及它的祖先链都会在对应深度的搜索中被覆盖，因此每一行都完整。

当某次搜索得到空行时可以结束。若深度 ``d + 1`` 存在节点，它的父节点必定位于深度 ``d``；所以深度
``d`` 为空就意味着所有更深层也为空。这个条件也让空树在第一次搜索后直接返回 ``[]``，而不是加入空行。

重复路径瓶颈
~~~~~~~~~~~~

逐层搜索的问题不在正确性，而在于每一层都从根重新出发。寻找深度 ``d`` 的节点时，深度小于 ``d`` 的
全部路径前缀只是通道，却会被再次访问。

在高度为 ``h`` 的树中，每个节点可能作为后续多个目标深度的路径前缀，重复搜索的最坏时间为 ``O(nh)``。
单侧链的第 ``d`` 层需要重新走过前 ``d`` 个节点，总访问量为 ``1 + 2 + ... + n = O(n²)``。输出分层
确实需要知道深度，但没有必要为每个深度重新寻找节点。

深度状态复用
~~~~~~~~~~~~

从父节点走到孩子时，孩子深度必然是父节点深度加一。把这个深度随递归状态向下传递，就能在第一次到达节点
时直接确定它属于 ``levels[depth]``，不再保留“目标深度”外层循环，也不再重复经过祖先路径。

``collectByDepth`` 首次到达深度 ``depth`` 时满足 ``depth == levels.size()``，此时创建新行；之后同层节点
直接追加到已有行。二叉树不可能在尚未到达深度 ``d - 1`` 时先到达深度 ``d``，所以结果不会出现中间缺行，
也不需要预先计算树高。

DFS 会深入左子树后才进入右子树，但这不会破坏层内顺序。任取同一层的两个节点，在它们路径第一次分叉的
祖先处，左侧节点进入左子树，右侧节点进入右子树；先左后右的递归会先访问整个左子树，因此左侧节点必先
追加到对应行。若交换两次递归调用的顺序，结果就会变成每层从右到左。

队列前沿
~~~~~~~~

DFS 已把时间降到 ``O(n)``，但层边界仍由每个节点携带的 ``depth`` 和结果下标间接表达。题目要求先完成
整层再进入下一层，队列可以让尚未处理的最浅节点形成一个显式前沿。

开始处理某一层时，``pending`` 中已有的节点恰好全部属于当前层。保存此刻的 ``levelSize``，再只弹出这么
多个节点；处理过程中加入队尾的孩子都比父节点深一层，留给下一轮。循环不变量是：每轮外层循环开始时，
队列从头到尾正好是下一行需要输出的节点，且顺序为从左到右。

``levelSize`` 必须在本层处理前固定。若内层也写成“只要队列非空就继续”，新加入的孩子会立刻被弹出，
所有深度会混入同一个 ``level``。层大小快照不是为了统计节点总数，而是给不断增长的队列划出本轮的终点。

层内顺序
~~~~~~~~

当前层父节点已经按从左到右排列。每个父节点出队时先加入左孩子、再加入右孩子，下一层便先按父节点位置、
再按同一父节点的左右方向排列。空孩子不入队，因为返回值不需要占位；跳过空位置不会改变其余非空节点的
相对次序。

以 ``[8,4,12,null,6,10,14]`` 为例，队列边界和输出变化如下：

.. list-table::
   :header-rows: 1

   * - 层
     - 开始时 ``pending``
     - ``levelSize``
     - 本层输出
     - 结束时 ``pending``
   * - 0
     - ``[8]``
     - 1
     - ``[8]``
     - ``[4,12]``
   * - 1
     - ``[4,12]``
     - 2
     - ``[4,12]``
     - ``[6,10,14]``
   * - 2
     - ``[6,10,14]``
     - 3
     - ``[6,10,14]``
     - ``[]``

第二层处理中，弹出 ``4`` 后只加入它的右孩子 ``6``，此时队列暂时是 ``[12,6]``。快照值仍为 ``2``，
所以接着弹出本层剩余的 ``12``，并把 ``10``、``14`` 放到 ``6`` 后面；``6`` 不会提前混入第二行，
下一层顺序也自然成为 ``[6,10,14]``。

代码演进与主解
~~~~~~~~~~~~~~

``levelsByRepeatedDepthSearch`` 的目标深度循环让输出结构很直观，但每轮都重新遍历公共路径。
``levelsByDepthFirstSearch`` 把目标深度改为节点自带的状态，删除外层循环和重复寻层，使每个节点只访问一次；
代价是依赖递归栈，并通过 ``levels[depth]`` 间接聚合各层。

``levelsByBreadthFirstSearch`` 进一步让队列本身按照深度组织待处理节点。代码不再携带每个节点的深度，改用
一次队列大小快照确定整层边界；先左后右入队同时维护下一层顺序。公开入口采用 BFS，因为它的处理批次与二维
结果的行一一对应，并避免树高较大时的递归调用栈。

另一种写法可以用两个队列分别保存当前层和下一层，但它与单队列加 ``levelSize`` 表达的是同一边界，既不
减少访问次数，也不改善渐进空间，因此不再单列为一种 C++ 方案。

复杂度分析
~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 主要状态
   * - 逐层重复搜索
     - ``O(nh)``
     - ``O(h)``
     - 目标深度与递归路径
   * - 携带深度的 DFS
     - ``O(n)``
     - ``O(h)``
     - 当前深度与调用栈
   * - 单队列 BFS
     - ``O(n)``
     - ``O(w)``
     - 当前层和下一层的队列前沿

其中 ``n`` 是节点数，``h`` 是树高，``w`` 是最大层宽。DFS 和 BFS 都只访问每个节点一次；BFS 的每个节点
也只入队、出队一次。复杂度表只统计工作空间，返回结果本身保存全部 ``n`` 个节点值，需要 ``O(n)`` 空间。
