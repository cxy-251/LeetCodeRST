0040. Combination Sum II
========================

题目信息
--------

:题号: 0040
:难度: Medium
:主题: 数组、回溯、排序、同层去重
:原题: `LeetCode 0040 <https://leetcode.com/problems/combination-sum-ii/>`_
:重点: 从枚举下标子集后去重，推导到排序后只跳过同层等值分支，并保证每个位置最多使用一次

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
* ``candidates = [2, 5, 2, 1, 2]``、``target = 5``，返回 ``[[1, 2, 2], [5]]``；三个下标上的
  ``2`` 不应制造多份 ``[1, 2, 2]``；
* ``candidates = [3, 4, 7]``、``target = 2``，返回 ``[]``；排序后首个候选已经超过剩余目标；
* ``candidates = [1, 2, 3]``、``target = 3``，返回 ``[[1, 2], [3]]``；单个下标不能在同一组合中重复使用。

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

枚举下标子集为何仍需去重
~~~~~~~~~~~~~~~~~~~~~~~~

每个数组位置只有“选”或“不选”两种决定，直接搜索全部下标子集一定不会重复使用同一位置，也不会遗漏任何可能组合。
当剩余目标变为零时，把路径排序成规范形式并放入集合，就能得到正确答案。

问题在于，下标不同不代表数值组合不同。设输入中有 ``1a``、``1b`` 和 ``2``，选择 ``{1a, 2}`` 与
``{1b, 2}`` 是两个不同下标子集，却都表示数值组合 ``[1, 2]``。事后集合能够删除重复结果，但两个等价分支已经
完整搜索过。

重复来源不是排列顺序
~~~~~~~~~~~~~~~~~~~~

0039 中候选值互异且可无限复用，主要问题是 ``[2, 3]`` 与 ``[3, 2]`` 这样的选择顺序重复。本题先按下标做
选或不选，天然保持下标递增，不会生成同一批下标的不同排列。

0040 的重复来自相同数值占据多个位置：不同下标选择可能映射到相同的数值多重集合。因此去重条件必须处理“等值
下标身份”，同时保留合法的重复数值数量。

先把相同值压缩成频次
~~~~~~~~~~~~~~~~~~~~

排序后可以把输入压缩成 ``(value, frequency)``。例如 ``[1, 1, 1, 2]`` 变成：

.. code-block:: text

   (1, 3), (2, 1)

对每个数值只需枚举使用次数 ``0..frequency``，并且不能超过 ``remaining / value``。这样一个组合直接对应唯一的
次数向量，例如 ``[1, 1, 1]`` 对应 ``(3, 0)``，``[1, 2]`` 对应 ``(1, 1)``，重复下标身份完全消失。

``searchByFrequencyGroups`` 从模型上解决了去重问题，但每次枚举 ``used`` 都要批量追加和撤销该值。更常见的回溯
写法仍按下标逐个选择，只在产生等价分支的位置跳过候选。

排序如何暴露同层等价分支
~~~~~~~~~~~~~~~~~~~~~~~~

排序后相同值相邻。固定当前路径和 ``start`` 时，若本层先选择两个相邻相同值中的前一个或后一个，新的数值前缀
完全相同。

后一个相同值可使用的剩余下标还更少，因此它不可能产生前一个分支无法产生的新数值组合。于是可以跳过：

.. code-block:: cpp

   if (index > start && candidates[index] == candidates[index - 1]) {
       continue;
   }

其中 ``index > start`` 表示“本层已经考察过一个相同值”。

为什么只能同层跳过
~~~~~~~~~~~~~~~~~~

对 ``[1a, 1b, 1c, 2]``、目标 ``3``，搜索过程为：

.. list-table::
   :header-rows: 1

   * - 递归层
     - ``start``
     - 选择
     - 说明
   * - 根层
     - 0
     - ``1a``
     - ``1b``、``1c`` 作为根层首选会产生等价前缀，因此跳过
   * - 第二层
     - 1
     - ``1b``
     - 此时 ``1b`` 是本层第一个候选，必须允许选择
   * - 第三层
     - 2
     - ``1c``
     - 得到合法组合 ``[1, 1, 1]``
   * - 第二层回退后
     - 1
     - ``2``
     - 得到另一组合 ``[1, 2]``

若把条件误写成只要与前一个值相同就跳过，深层的 ``1b``、``1c`` 也会被禁止，合法重复值组合将丢失。

为什么递归进入 index + 1
~~~~~~~~~~~~~~~~~~~~~~~~

选择 ``candidates[index]`` 后，该数组位置已经使用，下一层只能从后续位置继续，因此递归起点是 ``index + 1``。

这也是本题与 0039 的核心代码差异：0039 允许同一候选无限复用，递归仍从 ``index`` 开始；0040 每个位置最多使用
一次，必须进入 ``index + 1``。即使后续位置具有相同数值，也属于另一个数组位置，仍可在更深层使用。

排序同时提供和值剪枝
~~~~~~~~~~~~~~~~~~~~

所有候选均为正数，选择一个值后 ``remaining`` 严格减小。数组排序后，若当前 ``value > remaining``，后续值只会
更大，本层可以直接 ``break``；不会有更大的正数重新把总和降回目标。

为什么所有组合恰好生成一次
~~~~~~~~~~~~~~~~~~~~~~~~~~

任意合法组合都可以按非递减顺序排列。对于组合中的每个值，依次选取当前 ``start`` 之后最早的可用等值下标，就能
构造一条符合 ``index + 1`` 的搜索路径，因此算法不会遗漏组合。

反过来，假设两条路径生成相同数值组合。观察它们第一次选择不同下标的位置：两个下标上的值必须相同，并且它们处于
相同递归层。较后的等值下标会被同层去重条件跳过，矛盾。因此同一组合不会生成两次。

从基础代码到主方法
~~~~~~~~~~~~~~~~~~

三种方法依次删除不同层次的浪费：

#. 下标子集枚举严格执行每个位置只使用一次，但先搜索重复分支，再用集合去重；
#. 频次分组把相同值压缩成使用次数，从状态模型中消除重复下标身份；
#. 排序回溯保留下标选择结构，通过同层跳过等值候选直接阻止等价分支，同时以 ``index + 1`` 保证位置不复用。

公开入口采用第三种方法，因为它不需要结果集合，也不需要额外构造频次数组，并且与常见组合回溯模板一致。

复杂度分析
~~~~~~~~~~

设输入长度为 ``n``。排序需要 ``O(n log n)``。下标子集方法最多访问 ``2^n`` 个选择状态，规范化答案还需要排序
与集合插入。

频次分组若不同数值的出现次数为 ``f_1, f_2, ...``，未考虑和值剪枝时最多枚举
``(f_1 + 1)(f_2 + 1)...`` 个次数状态。主方法的搜索树最坏仍可达 ``O(2^n)``，但同层去重与正数剪枝会删除大量
状态。保存每个答案需要复制其路径；除输出外，递归栈和路径最多包含 ``n`` 个元素，额外空间为 ``O(n)``。
