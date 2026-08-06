0095. Unique Binary Search Trees II
===================================

题目信息
--------

:题号: 0095
:难度: Medium
:主题: 二叉搜索树、分治、记忆化、Catalan 结构
:原题: `LeetCode 0095 <https://leetcode.com/problems/unique-binary-search-trees-ii/>`_
:重点: 从枚举根节点拆分值域，推导到缓存重复区间并组合左右子树

题目重述
--------

给定整数 ``n``，返回所有由数值 ``1..n`` 各使用一次构成、结构互不相同的二叉搜索树。

每棵树都必须满足：任意节点左子树中的值严格小于该节点，右子树中的值严格大于该节点。答案顺序不限。

约束为 ``1 <= n <= 8``。

自建示例
--------

.. code-block:: text

   输入：n = 2
   输出（层序表示）：[[1,null,2],[2,1]]

以 1 为根时，2 只能位于右子树；以 2 为根时，1 只能位于左子树。

.. code-block:: text

   输入：n = 3
   输出数量：5

以 1、2、3 为根时分别产生 2、1、2 棵树，总数为 5。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       std::vector<std::vector<std::vector<TreeNode*>>> memo;
       std::vector<std::vector<char>> computed;
       std::vector<TreeNode*> empty_range{nullptr};

       TreeNode* cloneTree(TreeNode* node) {
           if (!node) {
               return nullptr;
           }
           return new TreeNode(
               node->val,
               cloneTree(node->left),
               cloneTree(node->right));
       }

       void destroyTree(TreeNode* node) {
           if (!node) {
               return;
           }
           destroyTree(node->left);
           destroyTree(node->right);
           delete node;
       }

       std::vector<TreeNode*> directGenerate(int start, int end) {
           if (start > end) {
               return {nullptr};
           }

           std::vector<TreeNode*> result;
           for (int root_value = start; root_value <= end; ++root_value) {
               auto left_trees = directGenerate(start, root_value - 1);
               auto right_trees = directGenerate(root_value + 1, end);

               for (TreeNode* left_tree : left_trees) {
                   for (TreeNode* right_tree : right_trees) {
                       result.push_back(new TreeNode(
                           root_value,
                           cloneTree(left_tree),
                           cloneTree(right_tree)));
                   }
               }

               for (TreeNode* tree : left_trees) {
                   destroyTree(tree);
               }
               for (TreeNode* tree : right_trees) {
                   destroyTree(tree);
               }
           }
           return result;
       }

       const std::vector<TreeNode*>& generateRange(int start, int end) {
           if (start > end) {
               return empty_range;
           }
           if (computed[start][end]) {
               return memo[start][end];
           }

           computed[start][end] = true;
           auto& result = memo[start][end];

           for (int root_value = start; root_value <= end; ++root_value) {
               const auto& left_trees = generateRange(start, root_value - 1);
               const auto& right_trees = generateRange(root_value + 1, end);

               for (TreeNode* left_tree : left_trees) {
                   for (TreeNode* right_tree : right_trees) {
                       result.push_back(new TreeNode(
                           root_value,
                           cloneTree(left_tree),
                           cloneTree(right_tree)));
                   }
               }
           }
           return result;
       }

       std::vector<TreeNode*> memoizedGenerate(int n) {
           memo.assign(
               n + 2,
               std::vector<std::vector<TreeNode*>>(n + 2));
           computed.assign(n + 2, std::vector<char>(n + 2));

           generateRange(1, n);
           std::vector<TreeNode*> result = std::move(memo[1][n]);

           for (int start = 1; start <= n; ++start) {
               for (int end = start; end <= n; ++end) {
                   for (TreeNode* tree : memo[start][end]) {
                       destroyTree(tree);
                   }
               }
           }
           return result;
       }

   public:
       std::vector<TreeNode*> generateTrees(int n) {
           return memoizedGenerate(n);
       }
   };

题解
----

排列建树
~~~~~~~~

最直接的思路是枚举 ``1..n`` 的所有插入顺序，再依次插入二叉搜索树并去除重复结构。

该方法至少检查 ``n!`` 个排列，而且不同插入顺序可能得到同一棵树。它把大量时间花在重复结构上，没有利用连续值域对根节点的约束。

根节点拆分
~~~~~~~~~~

考虑一个必须使用连续值域 ``[start, end]`` 的子问题。选择 ``root_value`` 作为根后，二叉搜索树性质立即确定两侧值域：

.. code-block:: text

   左子树使用 [start, root_value - 1]
   右子树使用 [root_value + 1, end]

左右值域互不重叠。任取一棵合法左树和一棵合法右树，都能与当前根组成合法结果，因此固定根的答案是两个子树集合的笛卡尔积。

空区间
~~~~~~

当 ``start > end`` 时，应返回包含一个 ``nullptr`` 的集合，而不是空集合。

``nullptr`` 表示“这一侧没有子树”，是组合过程中的一个合法选择。若返回空集合，叶节点的左右结果数都为零，笛卡尔积将无法生成任何叶节点。

.. code-block:: text

   空左树集合  = {nullptr}
   空右树集合  = {nullptr}
   组合结果数  = 1 * 1 = 1

区间分治
~~~~~~~~

直接分治为每个根递归生成左右区间，再枚举所有左右组合。不同根值产生不同根节点；根值相同时，不同的左树或右树组合又产生不同结构，因此结果不会重复。

任意合法 BST 都有唯一根值。该根强制划分左右值域，递归又会生成其唯一的左右结构，所以所有合法树都会被覆盖。

重复区间
~~~~~~~~

直接分治会反复生成相同区间。例如生成 ``[1,4]`` 时，区间 ``[1,2]`` 可能从多个上层根选择再次出现。

记忆化以 ``(start, end)`` 为状态，第一次生成后保存该区间的全部树模板。后续访问同一区间直接复用模板集合，不再重复展开根节点与子区间。

独立节点
~~~~~~~~

同一棵子树模板可能与多个另一侧模板组合。若直接把模板指针挂到多个根节点下，不同返回树会共享可变节点，修改或释放其中一棵树可能影响其他树。

实现把缓存结果视为结构模板，每次组合时深复制左右子树：

.. code-block:: text

   new root(root_value, clone(left_template), clone(right_template))

因此每棵生成树拥有独立节点集合。顶层缓存的所有权最终转移给返回结果，其余区间模板在返回前释放。

根值分组
~~~~~~~~

``n = 3`` 时，各根节点的组合数量如下：

.. list-table::
   :header-rows: 1

   * - 根值
     - 左区间树数
     - 右区间树数
     - 组合数
   * - 1
     - 1 个空树
     - 2
     - 2
   * - 2
     - 1
     - 1
     - 1
   * - 3
     - 2
     - 1 个空树
     - 2

固定根的数量是左右结果数之积，对所有根求和正是 Catalan 递推结构。

复杂度
~~~~~~

设第 ``n`` 个 Catalan 数为 ``C_n``，它也是最终树的数量。每棵返回树包含 ``n`` 个节点，仅构造独立输出就需要 ``Theta(n * C_n)`` 时间与返回空间。

记忆化还保存较短区间的树模板，其节点总量仍为 ``O(n * C_n)``；递归深度为 ``O(n)``。直接分治会额外重复生成相同区间，实际工作量更高。
