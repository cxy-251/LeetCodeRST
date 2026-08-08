0040. Combination Sum II
========================

题目信息
--------

:题号: 0040. 组合总和 II
:难度: Medium
:主题: 数组、回溯、排序、同层去重
:原题: `LeetCode 0040 <https://leetcode.com/problems/combination-sum-ii/>`_
:重点: 从枚举下标子集后去重，推导到排序后跳过同层等值分支，并保证每个位置最多使用一次

题目重述
--------

给定正整数数组 ``candidates`` 和正整数 ``target``，找出所有元素之和恰好等于 ``target`` 的不同组合。

数组中可以出现相同数值，但每个数组位置在一个组合中最多使用一次。组合只按数值及其出现次数区分，内部顺序不同
不算新组合，因此相同数值组合只能返回一次。答案顺序不限。

``candidates`` 的长度位于 ``[1, 100]``，每个元素位于 ``[1, 50]``，``target`` 位于 ``[1, 30]``。

自建示例
--------

* ``candidates = [1, 1, 1, 2]``、``target = 3``，返回 ``[[1, 1, 1], [1, 2]]``；三个 ``1`` 来自
  三个不同位置，因此可以同时使用；
* ``candidates = [2, 5, 2, 1, 2]``、``target = 5``，返回 ``[[1, 2, 2], [5]]``；三个位置上的
  ``2`` 不应制造多份 ``[1, 2, 2]``；
* ``candidates = [3, 4, 7]``、``target = 2``，返回 ``[]``；排序后首个候选已经超过剩余目标；
* ``candidates = [1, 2, 3]``、``target = 3``，返回 ``[[1, 2], [3]]``；同一位置不能在组合中重复使用。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <set>
   #include <utility>
   #include <vector>

   class Solution {
   private:
       void subsetDfs(
           const std::vector<int>& candidates,
           int index,
           int remaining,
           std::vector<int>& path,
           std::set<std::vector<int>>& unique
       ) {
           if (remaining == 0) {
               std::vector<int> canonical = path;
               std::sort(canonical.begin(), canonical.end());
               unique.insert(canonical);
               return;
           }
           if (index == static_cast<int>(candidates.size()) || remaining < 0) {
               return;
           }

           subsetDfs(candidates, index + 1, remaining, path, unique);

           path.push_back(candidates[index]);
           subsetDfs(
               candidates,
               index + 1,
               remaining - candidates[index],
               path,
               unique
           );
           path.pop_back();
       }

       std::vector<std::vector<int>> enumerateSubsetsThenDeduplicate(
           const std::vector<int>& candidates,
           int target
       ) {
           std::set<std::vector<int>> unique;
           std::vector<int> path;
           subsetDfs(candidates, 0, target, path, unique);
           return {unique.begin(), unique.end()};
       }

       std::vector<std::pair<int, int>> buildFrequencyGroups(
           std::vector<int> candidates
       ) {
           std::sort(candidates.begin(), candidates.end());
           std::vector<std::pair<int, int>> groups;
           for (int value : candidates) {
               if (groups.empty() || groups.back().first != value) {
                   groups.push_back({value, 1});
               } else {
                   ++groups.back().second;
               }
           }
           return groups;
       }

       void frequencyDfs(
           const std::vector<std::pair<int, int>>& groups,
           int group,
           int remaining,
           std::vector<int>& path,
           std::vector<std::vector<int>>& result
       ) {
           if (remaining == 0) {
               result.push_back(path);
               return;
           }
           if (group == static_cast<int>(groups.size())) {
               return;
           }

           const auto [value, frequency] = groups[group];
           const int maximum = std::min(frequency, remaining / value);
           for (int used = 0; used <= maximum; ++used) {
               for (int count = 0; count < used; ++count) {
                   path.push_back(value);
               }
               frequencyDfs(
                   groups,
                   group + 1,
                   remaining - used * value,
                   path,
                   result
               );
               for (int count = 0; count < used; ++count) {
                   path.pop_back();
               }
           }
       }

       std::vector<std::vector<int>> searchByFrequencyGroups(
           std::vector<int> candidates,
           int target
       ) {
           const auto groups = buildFrequencyGroups(std::move(candidates));
           std::vector<std::vector<int>> result;
           std::vector<int> path;
           frequencyDfs(groups, 0, target, path, result);
           return result;
       }

       void sameLevelDfs(
           const std::vector<int>& candidates,
           int start,
           int remaining,
           std::vector<int>& path,
           std::vector<std::vector<int>>& result
       ) {
           if (remaining == 0) {
               result.push_back(path);
               return;
           }

           for (int index = start;
                index < static_cast<int>(candidates.size());
                ++index) {
               if (index > start && candidates[index] == candidates[index - 1]) {
                   continue;
               }
               const int value = candidates[index];
               if (value > remaining) {
                   break;
               }

               path.push_back(value);
               sameLevelDfs(candidates, index + 1, remaining - value, path, result);
               path.pop_back();
           }
       }

       std::vector<std::vector<int>> sortedSameLevelDeduplication(
           std::vector<int> candidates,
           int target
       ) {
           std::sort(candidates.begin(), candidates.end());
           std::vector<std::vector<int>> result;
           std::vector<int> path;
           sameLevelDfs(candidates, 0, target, path, result);
           return result;
       }

   public:
       std::vector<std::vector<int>> combinationSum2(
           std::vector<int>& candidates,
           int target
       ) {
           return sortedSameLevelDeduplication(candidates, target);
       }
   };

题解
----

下标子集基线
~~~~~~~~~~~~

每个数组位置只有选与不选两种决定。``subsetDfs`` 处理完下标 ``index`` 后递归到 ``index + 1``，因此任何路径都
不会重复使用同一位置；所有下标子集都会被枚举，所以不会遗漏合法组合。

下标不同却可能表示相同的数值组合。若输入含 ``1a``、``1b`` 和 ``2``，选择 ``{1a, 2}`` 与 ``{1b, 2}``
是两个下标子集，却都对应 ``[1, 2]``。基线方法只能在命中目标后排序路径，再交给集合删除重复结果。

事后去重保证答案正确，却没有减少搜索：等价下标分支仍被完整展开。优化目标是让相同数值组合只进入搜索树一次。

频次分组模型
~~~~~~~~~~~~

排序后可以把相同值压缩为 ``(value, frequency)``。例如 ``[1, 1, 1, 2]`` 变为：

.. code-block:: text

   (1, 3), (2, 1)

处理一组数值时，只需决定使用 ``0..frequency`` 次，并受 ``remaining / value`` 限制。每个组合对应唯一的次数向量，
例如 ``[1, 1, 1]`` 对应 ``(3, 0)``，``[1, 2]`` 对应 ``(1, 1)``，重复下标身份因此消失。

``searchByFrequencyGroups`` 从状态模型中解决了去重，但每次枚举使用次数都要批量追加和撤销元素。还可以保留下标回溯
模板，只在等价分支出现时直接跳过。

排序后的搜索空间
~~~~~~~~~~~~~~~~

主方法先排序数组，再让 ``start`` 表示本层允许选择的最小下标。路径中的下标严格递增，因此路径数值也保持非递减，
同一个组合不会再因元素顺序不同而出现多次。

选择 ``candidates[index]`` 后递归到 ``index + 1``，表示当前位置已经消耗。后面即使还有相同数值，也属于不同位置，
可以在更深层继续选择。这正是本题与可无限复用候选的 0039 的核心差异。

同层等值分支
~~~~~~~~~~~~

固定相同的 ``path``、``start`` 和 ``remaining`` 时，若本层先选择两个相邻等值位置中的前一个或后一个，形成的数值
前缀完全相同。后一个位置可使用的后缀还更短，不可能产生前一个分支无法产生的新数值组合，因此跳过：

.. code-block:: cpp

   if (index > start && candidates[index] == candidates[index - 1]) {
       continue;
   }

``index > start`` 把去重限制在同一递归层。进入下一层后，后一个等值位置可能是该层第一个候选，必须允许选择，否则
会错误删除 ``[1, 1]``、``[1, 1, 1]`` 等合法组合。

以 ``[1a, 1b, 1c, 2]``、目标 ``3`` 为例：根层只从 ``1a`` 开始等值分支；第二层仍可选 ``1b``，第三层仍可
选 ``1c``，得到 ``[1, 1, 1]``；第二层也可跳到 ``2``，得到 ``[1, 2]``。

任意合法组合按非递减顺序表示后，都可以依次选择每层最早可用的对应下标，因此不会遗漏。若两条路径生成相同组合，
它们第一次选择不同下标时必然处于同层且数值相同，较后的分支会被上述条件跳过，因此组合也不会重复。

剩余目标剪枝
~~~~~~~~~~~~

所有候选均为正数。排序后若当前 ``value > remaining``，后续值只会更大，本层不可能再命中目标，可以直接
``break``。选择一个候选后，``remaining`` 严格减小；当它变为零时，当前路径恰好构成答案。

每轮递归开始时保持三个状态：路径使用的下标严格递增，路径数值非递减，``remaining`` 等于目标减去路径和。
同层去重只删除等价首选，``index + 1`` 保证位置不复用，正数剪枝只排除必然超出剩余目标的后缀。

状态演化
~~~~~~~~

对排序后的 ``[1, 2, 2, 2, 5]``、目标 ``5``：

.. list-table::
   :header-rows: 1

   * - 路径
     - ``start``
     - 本层动作
     - 结果
   * - ``[]``
     - 0
     - 选择 ``1``
     - 剩余 ``4``
   * - ``[1]``
     - 1
     - 选择第一个 ``2``
     - 剩余 ``2``
   * - ``[1, 2]``
     - 2
     - 选择下一个 ``2``
     - 得到 ``[1, 2, 2]``
   * - ``[1]``
     - 1
     - 跳过本层其余等值 ``2``
     - 不生成重复组合
   * - ``[]``
     - 0
     - 选择 ``5``
     - 得到 ``[5]``

代码演进
~~~~~~~~

``enumerateSubsetsThenDeduplicate`` 严格执行每个位置只使用一次，但先搜索全部等价分支，再用集合去重。

``searchByFrequencyGroups`` 把相同值压缩为使用次数，从状态定义中删除重复下标身份。

``sortedSameLevelDeduplication`` 保留下标回溯结构，通过排序、同层跳过和 ``index + 1`` 同时实现结果去重与位置单次
使用，并利用正数有序性提前结束无效后缀。公开入口采用该方法。

复杂度分析
~~~~~~~~~~

设输入长度为 ``n``。排序需要 ``O(n log n)``。下标子集方法最多访问 ``2^n`` 个选择状态，规范化答案还需要路径
排序与集合插入。

频次分组若各数值出现次数为 ``f_1, f_2, ...``，忽略和值剪枝时最多枚举
``(f_1 + 1)(f_2 + 1)...`` 个次数状态。主方法的搜索树最坏仍可达到 ``O(2^n)``，但同层去重与正数剪枝会删除
大量状态。除输出外，递归栈与路径最多保存 ``n`` 个元素，额外空间为 ``O(n)``。
