0039. Combination Sum
=====================

题目信息
--------

:题号: 0039. 组合总和
:难度: Medium
:主题: 数组、回溯、组合搜索、剪枝
:原题: `LeetCode 0039 <https://leetcode.com/problems/combination-sum/>`_
:重点: 从枚举有序选择序列，推导到只生成非递减组合，并允许同一候选值重复使用

题目重述
--------

给定一个由互不相同正整数组成的数组 ``candidates`` 和一个正整数 ``target``，找出所有元素之和恰好等于
``target`` 的不同组合。

每个候选值可以在同一个组合中使用任意多次。组合只由各数值的使用次数决定，内部排列顺序不产生新答案；例如
``[2, 2, 3]``、``[2, 3, 2]`` 和 ``[3, 2, 2]`` 属于同一个组合。答案顺序不限。

``candidates`` 的长度位于 ``[1, 30]``，每个候选值位于 ``[2, 40]``，``target`` 位于 ``[1, 40]``。题目保证
不同合法组合的数量少于 150。

自建示例
--------

* ``candidates = [2, 3, 6, 7]``、``target = 7``，返回 ``[[2, 2, 3], [7]]``；
* ``candidates = [2, 3, 5]``、``target = 8``，返回
  ``[[2, 2, 2, 2], [2, 3, 3], [3, 5]]``；
* ``candidates = [3]``、``target = 9``，返回 ``[[3, 3, 3]]``，说明同一候选可以重复使用；
* ``candidates = [5, 8, 11]``、``target = 3``，返回 ``[]``，因为所有候选都大于目标；
* ``candidates = [4, 6, 9]``、``target = 18``，返回
  ``[[4, 4, 4, 6], [6, 6, 6], [9, 9]]``，排列不同不会重复计入。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <set>
   #include <vector>

   class Solution {
   private:
       void enumerateSequences(
           const std::vector<int>& values,
           int remaining,
           std::vector<int>& path,
           std::set<std::vector<int>>& uniqueCombinations
       ) {
           if (remaining == 0) {
               std::vector<int> canonical = path;
               std::sort(canonical.begin(), canonical.end());
               uniqueCombinations.insert(canonical);
               return;
           }

           for (int value : values) {
               if (value > remaining) {
                   break;
               }
               path.push_back(value);
               enumerateSequences(values, remaining - value, path, uniqueCombinations);
               path.pop_back();
           }
       }

       std::vector<std::vector<int>> enumerateAndDeduplicate(
           std::vector<int> candidates,
           int target
       ) {
           std::sort(candidates.begin(), candidates.end());
           std::set<std::vector<int>> uniqueCombinations;
           std::vector<int> path;
           enumerateSequences(candidates, target, path, uniqueCombinations);
           return {uniqueCombinations.begin(), uniqueCombinations.end()};
       }

       void enumerateCounts(
           const std::vector<int>& values,
           int index,
           int remaining,
           std::vector<int>& path,
           std::vector<std::vector<int>>& result
       ) {
           if (remaining == 0) {
               result.push_back(path);
               return;
           }
           if (index == static_cast<int>(values.size())) {
               return;
           }

           const int value = values[index];
           const int maximumCount = remaining / value;
           const int originalSize = static_cast<int>(path.size());
           for (int count = 0; count <= maximumCount; ++count) {
               path.resize(originalSize);
               path.insert(path.end(), count, value);
               enumerateCounts(
                   values,
                   index + 1,
                   remaining - count * value,
                   path,
                   result
               );
           }
           path.resize(originalSize);
       }

       std::vector<std::vector<int>> countByCandidate(
           std::vector<int> candidates,
           int target
       ) {
           std::sort(candidates.begin(), candidates.end());
           std::vector<std::vector<int>> result;
           std::vector<int> path;
           enumerateCounts(candidates, 0, target, path, result);
           return result;
       }

       void orderedSearch(
           const std::vector<int>& values,
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
                index < static_cast<int>(values.size());
                ++index) {
               const int value = values[index];
               if (value > remaining) {
                   break;
               }

               path.push_back(value);
               orderedSearch(values, index, remaining - value, path, result);
               path.pop_back();
           }
       }

       std::vector<std::vector<int>> orderedBacktracking(
           std::vector<int> candidates,
           int target
       ) {
           std::sort(candidates.begin(), candidates.end());
           std::vector<std::vector<int>> result;
           std::vector<int> path;
           orderedSearch(candidates, 0, target, path, result);
           return result;
       }

   public:
       std::vector<std::vector<int>> combinationSum(
           std::vector<int>& candidates,
           int target
       ) {
           return orderedBacktracking(candidates, target);
       }
   };

题解
----

直接枚举选择序列
~~~~~~~~~~~~~~~~

最直接的搜索把状态写成“还差多少”：初始 ``remaining = target``，每层可以选择任意一个不超过剩余值的候选，随后
递归搜索 ``remaining - value``。所有候选都是正数，所以剩余值严格下降，搜索一定终止；降到零时，当前路径的和
恰好等于目标。

问题在于这棵树生成的是有顺序的选择序列。对 ``candidates = [2, 3]``、``target = 7``，会出现三条成功路径：

.. code-block:: text

   2 -> 2 -> 3
   2 -> 3 -> 2
   3 -> 2 -> 2

它们对应同一个组合 ``[2, 2, 3]``。``enumerateAndDeduplicate`` 在叶节点把路径排序，再放入集合，因此结果正确；
大量等价排列已经被完整搜索，最后才被删除，搜索和集合比较都属于重复工作。

按每种候选的使用次数搜索
~~~~~~~~~~~~~~~~~~~~~~~~

组合不关心选取顺序，只关心每个候选用了多少次。``countByCandidate`` 因此依次处理候选值，并为当前值枚举使用次数
``0..remaining / value``，随后进入下一个候选。

一条搜索路径实际上确定了一个次数向量。例如 ``values = [2, 3, 5]``、``target = 8`` 时，组合
``[2, 3, 3]`` 对应：

.. code-block:: text

   2 使用 1 次
   3 使用 2 次
   5 使用 0 次

候选值互不相同，所以一个次数向量只对应一个组合；每个组合也有唯一的次数向量，因此这种方法无需集合去重。它的
不足是每层还要显式枚举“当前候选取零次、一次、两次……”，并反复批量追加与删除相同值。

把次数枚举改写为逐元素选择
~~~~~~~~~~~~~~~~~~~~~~~~~~

逐元素回溯可以把“当前候选再多取一次”和“转向后面的候选”统一在一个循环中。先将候选升序排列，并给递归状态增加
``start``：下一次只能选择下标不小于 ``start`` 的候选。

因此路径中的候选下标永不下降，数值序列也保持非递减。选择 ``values[index]`` 后，递归仍传入 ``index``，因为
同一候选允许继续使用；循环进入下一下标时，搜索自然转向更大的候选。

.. code-block:: text

   选择 2 后递归起点仍为 2 的下标：可以继续选 2、3、5
   选择 3 后递归起点变为 3 的下标：可以继续选 3、5，不能回到 2
   选择 5 后递归起点变为 5 的下标：只能继续选 5

若题目规定每个候选只能使用一次，递归起点才应改为 ``index + 1``；本题传入 ``index`` 是允许重复使用的关键。

非递减路径为何恰好去重
~~~~~~~~~~~~~~~~~~~~~~

任意合法组合都能唯一写成非递减序列。假设组合中下标 ``i`` 的候选使用若干次，再使用更大下标的候选；
``orderedSearch`` 可以在 ``i`` 处重复选择任意次，再由循环转到更大下标，所以这条规范序列一定能够生成。

反过来，搜索路径的下标从不下降，同一多重集合的其他排列都不可能出现。候选值本身互不相同，因此也不会有两个
不同下标表示同一个数值。每个组合由唯一一条路径生成，既不遗漏，也不需要结果集合去重。

正数与排序如何产生剪枝
~~~~~~~~~~~~~~~~~~~~~~

所有候选都是正数，因此选择一个值后 ``remaining`` 必然减小；若某条路径的剩余值无法再由候选凑出，它最终会因没有
可选值而返回。

排序后，循环遇到 ``value > remaining`` 时，当前值已经无法选择，后面的值只会更大，因此可以直接 ``break``，
一次排除整个后缀。若候选包含零或负数，剩余值未必下降，重复使用还可能形成无限搜索，本题的正数条件是终止与剪枝
成立的基础。

选择、递归与撤销
~~~~~~~~~~~~~~~~

``path`` 表示当前递归路径已经选取的组合。进入子树前追加候选，子树返回后删除末尾，使下一个兄弟分支重新从同一父
状态开始。``remaining`` 按值传递，无需手动恢复。

当 ``remaining == 0`` 时，代码复制当前 ``path`` 到结果中。保存的是独立副本，因此后续 ``pop_back`` 不会修改
已经记录的答案。

状态演化
~~~~~~~~

对 ``candidates = [2, 3, 5]``、``target = 8``，生成 ``[2, 3, 3]`` 的路径如下：

.. list-table::
   :header-rows: 1

   * - ``path``
     - ``start`` 可选值
     - ``remaining``
     - 动作
   * - ``[]``
     - ``2, 3, 5``
     - 8
     - 选择 2
   * - ``[2]``
     - ``2, 3, 5``
     - 6
     - 转向 3
   * - ``[2, 3]``
     - ``3, 5``
     - 3
     - 再次选择 3
   * - ``[2, 3, 3]``
     - ``3, 5``
     - 0
     - 记录答案

在选择 3 后，递归不会再访问 2，因此不会生成 ``[3, 2, 3]`` 或 ``[3, 3, 2]``。

代码演进
~~~~~~~~

三种方法依次删除两类重复工作：

#. ``enumerateAndDeduplicate`` 搜索全部有序选择序列，再把等价排列规范化并交给集合删除；
#. ``countByCandidate`` 直接枚举每个候选的使用次数，从搜索空间中消除排列重复；
#. ``orderedBacktracking`` 用非递减路径隐式表达使用次数，一次选择一个元素，并利用排序在候选过大时停止循环。

公开入口采用第三种方法。它最直接对应“选择一个候选、继续使用它或转向更大候选”的搜索过程，路径本身已经是答案的
唯一规范表示。

复杂度分析
~~~~~~~~~~

设候选数量为 ``m``，最小候选值为 ``a``，任意路径长度最多为 ``d = target / a``。回溯问题的搜索规模依赖候选值与
目标，最坏情况下呈指数增长，可粗略上界为 ``O(m^d)`` 个搜索节点；排序需要 ``O(m log m)``。

每个合法组合复制到结果时还需要与其长度成正比的时间，因此更准确地说，总时间至少包含全部输出元素的数量。递归栈与
当前路径最多保存 ``d`` 个值，除返回结果外的额外空间为 ``O(d)``。直接序列方法还要保存规范化集合，并搜索大量
排列重复；按次数方法的递归深度为 ``O(m)``，路径长度仍最多为 ``O(d)``。
