0096. Unique Binary Search Trees
================================

题目信息
--------

:题号: 0096. 不同的二叉搜索树
:难度: Medium
:主题: 二叉搜索树、动态规划、记忆化搜索、Catalan 数
:原题: `LeetCode 0096 <https://leetcode.com/problems/unique-binary-search-trees/>`_
:重点: 从枚举根节点的重复递归，推导到按节点数量计数和 Catalan 递推

题目重述
--------

给定整数 ``n``，计算由数值 ``1..n`` 各使用一次可以构成多少棵结构不同的二叉搜索树。

二叉搜索树要求任意节点左子树中的值都小于该节点，右子树中的值都大于该节点。只需返回树的数量，
不需要构造具体树。

约束为 ``1 <= n <= 19``，答案保证位于 32 位有符号整数范围内。

自建示例
--------

.. code-block:: text

   输入：n = 1
   输出：1

只有一个节点时，只能构成一棵树。

.. code-block:: text

   输入：n = 3
   输出：5

以 1、2、3 为根时，左右子树结构数乘积依次为 ``1*2``、``1*1``、``2*1``，总数为 5。

.. code-block:: text

   输入：n = 4
   输出：14

四个根位置的贡献依次为 ``1*5``、``1*2``、``2*1``、``5*1``。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       long long plainRecursion(int nodes) {
           if (nodes <= 1) return 1;

           long long total = 0;
           for (int leftNodes = 0; leftNodes < nodes; ++leftNodes) {
               int rightNodes = nodes - 1 - leftNodes;
               total += plainRecursion(leftNodes) *
                        plainRecursion(rightNodes);
           }
           return total;
       }

       long long memoDfs(int nodes, std::vector<long long>& memo) {
           if (nodes <= 1) return 1;

           long long& cached = memo[nodes];
           if (cached != -1) return cached;

           cached = 0;
           for (int leftNodes = 0; leftNodes < nodes; ++leftNodes) {
               int rightNodes = nodes - 1 - leftNodes;
               cached += memoDfs(leftNodes, memo) *
                         memoDfs(rightNodes, memo);
           }
           return cached;
       }

       int memoizedRecursion(int n) {
           std::vector<long long> memo(n + 1, -1);
           return static_cast<int>(memoDfs(n, memo));
       }

       int bottomUpDp(int n) {
           std::vector<long long> count(n + 1);
           count[0] = 1;

           for (int nodes = 1; nodes <= n; ++nodes) {
               for (int leftNodes = 0; leftNodes < nodes; ++leftNodes) {
                   int rightNodes = nodes - 1 - leftNodes;
                   count[nodes] += count[leftNodes] * count[rightNodes];
               }
           }
           return static_cast<int>(count[n]);
       }

       int catalanRecurrence(int n) {
           long long value = 1;
           for (int k = 0; k < n; ++k) {
               value = value * 2 * (2 * k + 1) / (k + 2);
           }
           return static_cast<int>(value);
       }

   public:
       int numTrees(int n) {
           return bottomUpDp(n);
       }
   };

题解
----

数量状态
~~~~~~~~

对任意 ``nodes`` 个互异且有序的键，BST 的中序遍历顺序已经确定。把一组连续键整体平移，或替换为另一组
保持相对大小关系的键，不会改变可选树形。

因此状态只需记录节点数量：

.. code-block:: text

   count[nodes] = 使用 nodes 个有序键能够形成的不同 BST 数量

不需要记录具体值域的起点和终点。

根节点划分
~~~~~~~~~~

在 ``nodes`` 个键中选择排名为 ``leftNodes + 1`` 的键作为根后：

.. code-block:: text

   左子树节点数 = leftNodes
   右子树节点数 = nodes - 1 - leftNodes

左、右子树可以独立选择结构，所以固定根位置的组合数为两侧数量的乘积。枚举所有根位置得到：

.. code-block:: text

   count[nodes] = sum(
       count[leftNodes] * count[nodes - 1 - leftNodes]
   )

任意非空 BST 都有唯一根位置，并进一步确定唯一的左、右子树结构对，因此各项覆盖全部合法树且互不重复。

空树状态
~~~~~~~~

``count[0] = 1`` 表示一侧为空时存在一种合法选择。叶节点左右都为空，其结构数应为 ``1 * 1``；若空树计数为
0，所有带空子树的合法结构都会被错误消除。

裸递归
~~~~~~

最直接的递归对每种根位置分别递归计算左右节点数。它准确表达了根节点划分，但相同的节点数量会在不同分支中
被反复计算。例如计算 ``count[5]`` 时，``count[2]`` 会从多个根位置重复出现，递归树因此快速膨胀。

记忆化搜索
~~~~~~~~~~

节点数量只有 ``0..n`` 共 ``n+1`` 种。缓存 ``memo[nodes]`` 后，每个数量只完整枚举一次根位置；后续访问
直接返回已有结果。

记忆化保留了自顶向下的推导方式，同时把重复子问题压缩成有限状态。

自底向上
~~~~~~~~

计算 ``count[nodes]`` 时，左右节点数都严格小于 ``nodes``。按节点数从小到大填表即可保证所有依赖已经完成：

.. list-table::
   :header-rows: 1

   * - 节点数
     - 根位置贡献
     - 结构数
   * - 0
     - 空树
     - 1
   * - 1
     - ``1*1``
     - 1
   * - 2
     - ``1*1 + 1*1``
     - 2
   * - 3
     - ``1*2 + 1*1 + 2*1``
     - 5
   * - 4
     - ``1*5 + 1*2 + 2*1 + 5*1``
     - 14

公开入口采用该方案，因为状态与 BST 根节点划分直接对应，边界和转移都容易验证。

Catalan 递推
~~~~~~~~~~~~

上述序列正是 Catalan 数，还可以使用相邻项关系：

.. code-block:: text

   C(0) = 1
   C(k+1) = C(k) * 2 * (2k+1) / (k+2)

它把时间降为 ``O(n)``、额外空间降为 ``O(1)``。整数除法在数学上能够整除，但固定宽整数实现仍需使用足够宽的
中间类型并谨慎安排乘除顺序。动态规划更直接地体现题目的结构来源。

复杂度
~~~~~~

裸递归会重复展开相同节点数量，时间为指数级，递归深度 ``O(n)``。

记忆化搜索和自底向上 DP 都有 ``n`` 个非空状态，每个状态枚举至多 ``n`` 个根位置，时间 ``O(n^2)``，
缓存或数组空间 ``O(n)``。Catalan 相邻项递推时间 ``O(n)``，额外空间 ``O(1)``。
