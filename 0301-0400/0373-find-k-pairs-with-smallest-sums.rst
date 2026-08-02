0373. Find K Pairs with Smallest Sums
=====================================

题目信息
--------

:题号: 0373
:难度: Medium
:主题: 两个有序数组、数对、元素和、前 k 小
:原题: `LeetCode 0373 <https://leetcode.com/problems/find-k-pairs-with-smallest-sums/>`_
:重点: 每个数对各取一个数组元素、数组按非递减顺序、重复值按不同位置组合计数、组合不足 k 时全部返回

题目重述
--------

给定两个按非递减顺序排列的整数数组 ``nums1``、``nums2`` 和正整数 ``k``。从两个数组中各选择一个位置，组成数对 ``[nums1[i], nums2[j]]``。返回元素和最小的前 ``k`` 个位置组合所对应的数对。

两个数组长度均位于 ``[1, 10^5]``，元素位于 ``[-10^9, 10^9]``，``k`` 位于 ``[1, 10^4]``。若全部位置组合数量少于 ``k``，应返回所有组合。数组中允许重复值，因此不同位置可能产生相同内容的数对，这些组合仍分别参与比较；边界处和相同时可能存在多种合法结果。

自建示例
--------

选取三个最小和：

.. code-block:: text

   输入：nums1 = [1,3]，nums2 = [2,5]，k = 3
   输出：[[1,2],[3,2],[1,5]]
   解释：四个位置组合的元素和分别为 3、6、5、8，最小的三个和是 3、5、6。

组合总数不足 k：

.. code-block:: text

   输入：nums1 = [4]，nums2 = [1,2]，k = 5
   输出：[[4,1],[4,2]]
   解释：总共只有两个位置组合，因此全部返回。

把每个第一数组位置看成一条有序候选流
--------------------------------------

固定 ``nums1[i]`` 后，``nums1[i] + nums2[j]`` 会随着 ``j`` 增大而不减，因此每个 ``i`` 对应一条按和递增的流。初始把每条流的第一个组合 ``(i, 0)`` 放入最小堆；弹出当前最小组合后，只把同一行的下一个 ``j + 1`` 放入堆。这样堆始终保存每条未展开流的最小候选。

只需初始化前 ``min(nums1.size(), k)`` 行，因为每行至少贡献一个组合，排在更后面的行不可能进入前 ``k`` 个。重复值仍按 ``i、j`` 位置分别入堆和弹出，不会被集合去重。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::vector<std::vector<int>> kSmallestPairs(
           std::vector<int>& nums1, std::vector<int>& nums2, int k) {
           using State = std::tuple<long long, int, int>;
           std::priority_queue<State, std::vector<State>,
                               std::greater<State>> queue;
           int rows = std::min(static_cast<int>(nums1.size()), k);
           for (int i = 0; i < rows; ++i) {
               queue.emplace(static_cast<long long>(nums1[i]) + nums2[0],
                             i, 0);
           }

           std::vector<std::vector<int>> result;
           while (!queue.empty()
                  && static_cast<int>(result.size()) < k) {
               auto [sum, i, j] = queue.top();
               queue.pop();
               result.push_back({nums1[i], nums2[j]});
               if (j + 1 < static_cast<int>(nums2.size())) {
                   queue.emplace(
                       static_cast<long long>(nums1[i]) + nums2[j + 1],
                       i, j + 1);
               }
           }
           return result;
       }
   };

代码分析
--------

堆顶是所有候选流头部的最小值，而每条流内部有序，所以每次弹出的组合都不可能被尚未入堆的同一行组合超越；推进行尾后继续保持这一不变量。若组合总数不足 ``k``，堆耗尽时自然返回全部组合。设 ``r = min(nums1.size(), k)``，时间复杂度为 ``O((r+k) log r)``，额外空间为 ``O(r)``。
