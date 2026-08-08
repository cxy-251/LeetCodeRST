0077. Combinations
==================

题目信息
--------

:题号: 0077. 组合
:难度: Medium
:主题: 回溯、组合、容量剪枝
:原题: `LeetCode 0077 <https://leetcode.com/problems/combinations/>`_
:重点: 从枚举全部子集，推导到递增路径回溯，再利用剩余容量收紧候选上界

题目重述
--------

给定两个整数 ``n`` 和 ``k``，从集合 ``{1, 2, ..., n}`` 中选出恰好 ``k`` 个不同整数，
返回所有可能的组合。

组合只关心选中了哪些整数，不关心排列顺序。例如 ``[1, 3]`` 与 ``[3, 1]`` 表示同一个组合，
只能返回一次。答案中的组合顺序不限，每个组合内部的元素顺序也不限。

约束为 ``1 <= n <= 20``、``1 <= k <= n``。

自建示例
--------

.. code-block:: text

   输入：n = 4, k = 3
   输出：[[1,2,3],[1,2,4],[1,3,4],[2,3,4]]

四个整数中任取三个，共有 ``C(4,3)=4`` 个组合。

.. code-block:: text

   输入：n = 3, k = 1
   输出：[[1],[2],[3]]

每个单独的整数都构成一个合法组合。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       int countBits(int mask) {
           int count = 0;
           while (mask != 0) {
               mask &= mask - 1;
               ++count;
           }
           return count;
       }

       std::vector<std::vector<int>> maskEnumeration(int n, int k) {
           std::vector<std::vector<int>> result;
           const int limit = 1 << n;

           for (int mask = 0; mask < limit; ++mask) {
               if (countBits(mask) != k) {
                   continue;
               }

               std::vector<int> combination;
               for (int bit = 0; bit < n; ++bit) {
                   if ((mask & (1 << bit)) != 0) {
                       combination.push_back(bit + 1);
                   }
               }
               result.push_back(combination);
           }
           return result;
       }

       void plainDfs(int start, int n, int k,
                     std::vector<int>& path,
                     std::vector<std::vector<int>>& result) {
           if (static_cast<int>(path.size()) == k) {
               result.push_back(path);
               return;
           }

           for (int value = start; value <= n; ++value) {
               path.push_back(value);
               plainDfs(value + 1, n, k, path, result);
               path.pop_back();
           }
       }

       void prunedDfs(int start, int n, int k,
                      std::vector<int>& path,
                      std::vector<std::vector<int>>& result) {
           if (static_cast<int>(path.size()) == k) {
               result.push_back(path);
               return;
           }

           const int needed = k - static_cast<int>(path.size());
           const int lastStart = n - needed + 1;

           for (int value = start; value <= lastStart; ++value) {
               path.push_back(value);
               prunedDfs(value + 1, n, k, path, result);
               path.pop_back();
           }
       }

   public:
       std::vector<std::vector<int>> combine(int n, int k) {
           std::vector<std::vector<int>> result;
           std::vector<int> path;
           path.reserve(k);
           prunedDfs(1, n, k, path, result);
           return result;
       }
   };

题解
----

全部子集枚举
~~~~~~~~~~~~

``1..n`` 的每个子集都可由一个 ``n`` 位掩码表示：第 ``bit`` 位为 1，表示选择 ``bit+1``。
枚举 ``0`` 到 ``2^n-1``，再保留恰好含 ``k`` 个置位的掩码，可以直接得到全部组合。

这种方法先访问所有 ``2^n`` 个子集，其中大量子集的大小并非 ``k``。它说明问题可以归结为选择集合，
但没有利用“只需要长度为 ``k`` 的结果”这一条件。

递增路径
~~~~~~~~

回溯路径保存当前已经选择的整数。参数 ``start`` 表示下一层只能从 ``start`` 及其右侧继续选择。
选择 ``value`` 后，递归入口变为 ``value+1``，所以路径始终严格递增。

严格递增同时解决两个问题：

* 同一个整数不会被再次选择；
* 同一个集合只会生成唯一的递增排列。

例如组合 ``{1,3,5}`` 只会沿 ``1 -> 3 -> 5`` 到达，不会生成 ``3 -> 1 -> 5`` 等排列。

选择与恢复
~~~~~~~~~~

每次循环执行三个步骤：把候选加入 ``path``，递归枚举包含该候选的全部后续组合，随后弹出该候选。
弹出后，路径恢复到进入本轮循环前的状态，下一候选可以复用同一个容器。

当路径长度达到 ``k`` 时，当前路径已经是完整组合。此时复制到结果并立即返回，避免继续加入多余元素。

容量剪枝
~~~~~~~~

无剪枝回溯仍会进入一些不可能填满 ``k`` 个元素的分支。设当前路径还需要：

.. code-block:: text

   needed = k - path.size()

若本层选择 ``value``，从 ``value`` 到 ``n`` 至少要留下 ``needed`` 个可选整数，因此必须满足：

.. code-block:: text

   n - value + 1 >= needed
   value <= n - needed + 1

所以循环终点可以从 ``n`` 收紧为 ``lastStart = n-needed+1``。超过该上界的候选即使把右侧元素全部选中，
也无法填满路径。

.. list-table::
   :header-rows: 1

   * - 当前路径
     - 还需数量
     - 本层最大候选
   * - ``[]``，``n=5,k=3``
     - 3
     - 3
   * - ``[1]``
     - 2
     - 4
   * - ``[1,4]``
     - 1
     - 5
   * - ``[1,4,5]``
     - 0
     - 提交结果

完整性
~~~~~~

任意合法组合都有唯一的递增表示 ``a1 < a2 < ... < ak``。算法从 1 开始，在第 ``i`` 层选择 ``ai``，
随后只搜索更大的整数，因此存在一条递归路径能够依次选中整个组合。

容量剪枝只排除“剩余元素数量不足”的起点。合法组合的每个前缀后都至少保留了完成该组合所需的元素，
所以这条路径不会被剪掉。

唯一性
~~~~~~

每条叶子路径都是严格递增序列。一个集合只有一种严格递增排列，因此不同叶子不可能表示同一个组合，
结果中不会出现重复项。

复杂度
~~~~~~

位掩码方法枚举 ``2^n`` 个子集，并可能扫描 ``n`` 位，时间 ``O(2^n * n)``。

剪枝回溯输出 ``C(n,k)`` 个组合，每个组合复制 ``k`` 个整数，输出主导时间为
``O(C(n,k) * k)``。递归路径最多保存 ``k`` 个整数，不计返回结果时额外空间为 ``O(k)``。
