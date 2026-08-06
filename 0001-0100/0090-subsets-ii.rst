0090. Subsets II
================

题目信息
--------

:题号: 0090
:难度: Medium
:主题: 数组、回溯、排序、重复值去重
:原题: `LeetCode 0090 <https://leetcode.com/problems/subsets-ii/>`_
:重点: 从按位置枚举后去重，推导到排序后只跳过同层重复选择

题目重述
--------

给定一个可能包含重复元素的整数数组 ``nums``，返回它的所有不同子集。

每个输入位置在一个子集中最多使用一次。两个子集只要包含的元素及其重复次数相同，就视为同一个子集，
不能重复返回。答案需要包含空集，子集和答案的排列顺序均不限。

约束为 ``1 <= nums.length <= 10``，``-10 <= nums[i] <= 10``。

自建示例
--------

.. code-block:: text

   输入：nums = [1,1,2,2]
   输出：
   [[],[1],[1,1],[2],[2,2],[1,2],[1,1,2],[1,2,2],[1,1,2,2]]

值 1 和 2 都可以分别选择 0、1、2 个，因此共有 ``3 * 3 = 9`` 个不同子集。

.. code-block:: text

   输入：nums = [4,4,4]
   输出：[[],[4],[4,4],[4,4,4]]

三个位置不同，但数值相同；只需区分选择了几个 4。

.. code-block:: text

   输入：nums = [2,5]
   输出：[[],[2],[5],[2,5]]

输入没有重复值时，本题退化为普通子集枚举。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <set>
   #include <vector>

   class Solution {
   private:
       std::vector<std::vector<int>> bitmaskAndSet(std::vector<int> nums) {
           std::sort(nums.begin(), nums.end());
           std::set<std::vector<int>> unique;
           int total = 1 << static_cast<int>(nums.size());

           for (int mask = 0; mask < total; ++mask) {
               std::vector<int> subset;
               for (int index = 0; index < static_cast<int>(nums.size()); ++index) {
                   if (mask & (1 << index)) {
                       subset.push_back(nums[index]);
                   }
               }
               unique.insert(std::move(subset));
           }

           return {unique.begin(), unique.end()};
       }

       void backtrack(const std::vector<int>& nums, int start,
                      std::vector<int>& path,
                      std::vector<std::vector<int>>& result) {
           result.push_back(path);

           for (int index = start; index < static_cast<int>(nums.size()); ++index) {
               if (index > start && nums[index] == nums[index - 1]) {
                   continue;
               }

               path.push_back(nums[index]);
               backtrack(nums, index + 1, path, result);
               path.pop_back();
           }
       }

       std::vector<std::vector<int>> sortedBacktracking(std::vector<int> nums) {
           std::sort(nums.begin(), nums.end());
           std::vector<std::vector<int>> result;
           std::vector<int> path;
           backtrack(nums, 0, path, result);
           return result;
       }

       std::vector<std::vector<int>> iterativeExpansion(std::vector<int> nums) {
           std::sort(nums.begin(), nums.end());
           std::vector<std::vector<int>> result{{}};
           int previousSize = 0;

           for (int index = 0; index < static_cast<int>(nums.size()); ++index) {
               int oldSize = static_cast<int>(result.size());
               int begin = 0;

               if (index > 0 && nums[index] == nums[index - 1]) {
                   begin = previousSize;
               }

               for (int subsetIndex = begin; subsetIndex < oldSize; ++subsetIndex) {
                   std::vector<int> next = result[subsetIndex];
                   next.push_back(nums[index]);
                   result.push_back(std::move(next));
               }

               previousSize = oldSize;
           }

           return result;
       }

   public:
       std::vector<std::vector<int>> subsetsWithDup(std::vector<int>& nums) {
           return sortedBacktracking(nums);
       }
   };

题解
----

按位置枚举
~~~~~~~~~~

忽略重复值时，每个输入位置都有“选择”和“不选择”两种决定，可以用 ``n`` 位掩码枚举全部
``2^n`` 个位置子集。

重复元素使不同位置选择映射到同一个数值子集。例如在 ``[1,2_a,2_b]`` 中，只选择 ``2_a`` 和
只选择 ``2_b`` 都得到 ``[2]``。朴素方法可以先排序每个子集，再放入集合去重，但它仍生成了所有重复候选，
并承担集合比较和存储成本。

排序后的等价分支
~~~~~~~~~~~~~~~~

排序让相同值连续出现。回溯状态 ``backtrack(start)`` 表示：路径已经确定，接下来可以从
``nums[start:]`` 中选择新的元素。

在同一递归层中，若两个相邻候选值相同，以它们作为“本层首次选择”会产生完全相同的后续数值子集。
因此只保留这一层的第一个等值候选：

.. code-block:: cpp

   if (index > start && nums[index] == nums[index - 1]) {
       continue;
   }

条件必须同时检查 ``index > start``。``start`` 是本层第一个候选位置，只有 ``index`` 已越过它时，
前一个相同值才属于同层已经处理过的兄弟分支。

深层重复选择
~~~~~~~~~~~~

同层去重不会禁止一个子集包含多个相同值。以 ``[2,2]`` 为例：

.. list-table::
   :header-rows: 1

   * - 状态
     - 处理
   * - 根层选择第一个 2
     - 路径变为 ``[2]``，递归起点移到第二个 2
   * - 下一层选择第二个 2
     - 此时 ``index == start``，允许形成 ``[2,2]``
   * - 根层直接遇到第二个 2
     - 此时 ``index > start`` 且与前一项相同，跳过重复兄弟分支

被删除的是“用另一个相同位置建立同样的首次选择分支”，不是后续合法副本。

递归节点即答案
~~~~~~~~~~~~~~

子集没有固定长度，每条当前路径本身都是一个合法答案。进入递归节点时先复制 ``path``，于是根节点自然提交空集，
随后每次加入一个元素都会产生一个更长子集。

路径使用严格递增的下标，因此每个输入位置最多使用一次。选择后递归、返回后弹出，保证兄弟分支共享同一个
``path`` 容器而不互相污染。

迭代扩展
~~~~~~~~

普通子集的迭代构造是：处理新元素时，把它追加到当前所有子集的副本后面，答案数量翻倍。

遇到重复值时，不能再次扩展全部旧子集。设处理前一个相同值之前答案长度为 ``previousSize``，处理完前一个值后
新产生的子集范围为 ``[previousSize, oldSize)``。当前重复值只追加到这一段新子集：

.. code-block:: text

   第一个 2：扩展此前所有子集
   第二个 2：只扩展“刚由第一个 2 产生”的子集

这样分别得到选择一个、两个、三个同值副本的层次，不会再次生成“只选择一个 2”的重复结果。

完整性与唯一性
~~~~~~~~~~~~~~

任意不同子集都可按非递减顺序表示，并唯一确定每个不同值选取多少个副本。排序回溯允许在更深层连续选择该值，
因此能生成所需副本数；同一层只保留一个等值首次分支，因此不会出现第二条生成同一多重集的路径。

复杂度
~~~~~~

位掩码方法先生成 ``2^n`` 个位置子集，并用集合去重，时间和空间都包含额外的集合维护成本。

排序回溯需要 ``O(n log n)`` 预处理。设所有不同答案包含的元素总数为 ``P``，生成并复制答案需要
``Theta(P)`` 时间；最坏所有元素互异时 ``P = Theta(n * 2^n)``。递归路径和调用栈为 ``O(n)``，
不计返回结果。迭代方法具有相同的输出量级，并直接使用结果数组扩展。
