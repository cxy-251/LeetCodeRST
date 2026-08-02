0436. Find Right Interval
=========================

题目信息
--------

:题号: 0436
:难度: Medium
:主题: 区间、唯一开始点、右侧候选、原下标
:原题: `LeetCode 0436 <https://leetcode.com/problems/find-right-interval/>`_
:重点: 对每个区间寻找 ``start_j >= end_i`` 的最小开始点、返回原数组下标、无候选时返回 ``-1``

题目重述
--------

给定区间数组 ``intervals``，每个区间 ``i`` 表示为 ``[start_i, end_i]``，并保证所有 ``start_i`` 互不相同。对每个区间寻找它的右区间 ``j``：要求 ``start_j >= end_i``，并且在所有满足条件的区间中，``start_j`` 最小。

返回长度与输入相同的数组 ``answer``，其中 ``answer[i]`` 是右区间在原数组中的零基下标；若不存在满足条件的区间，则为 ``-1``。``intervals.length`` 位于 ``[1, 2 * 10^4]``，端点位于 ``[-10^6, 10^6]``，且每个区间满足 ``start_i <= end_i``。

自建示例
--------

三个区间互相形成右侧关系：

.. code-block:: text

   输入：intervals = [[3,4], [1,2], [2,3]]
   输出：[-1, 2, 0]
   解释：[3,4] 没有开始点至少为 4 的区间；[1,2] 的最小合格开始点是 2，位于下标 2；[2,3] 的右区间开始点为 3，位于下标 0。

区间可以把自己作为右区间：

.. code-block:: text

   输入：intervals = [[5,5]]
   输出：[0]
   解释：该区间的开始点 5 大于或等于自身结束点 5，因此原下标 0 满足定义。

对开始点排序后做 lower_bound
------------------------------

右区间只由开始点决定。把所有 ``(start, 原下标)`` 按开始点升序保存，对每个 ``end_i`` 二分查找第一个大于等于它的开始点；这一定是满足条件者中开始点最小的一个，直接返回其原下标。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::vector<int> findRightInterval(
           std::vector<std::vector<int>>& intervals) {
           std::vector<std::pair<int, int>> starts;
           for (int i = 0; i < static_cast<int>(intervals.size()); ++i) {
               starts.push_back({intervals[i][0], i});
           }
           std::sort(starts.begin(), starts.end());

           std::vector<int> result;
           for (const auto& interval : intervals) {
               auto it = std::lower_bound(
                   starts.begin(), starts.end(),
                   std::make_pair(interval[1], -1));
               result.push_back(it == starts.end() ? -1 : it->second);
           }
           return result;
       }
   };

代码分析
--------

开始点互不相同，所以 lower_bound 找到的候选唯一；保存原下标避免排序后丢失答案位置。预处理排序为 ``O(n log n)``，每个区间二分查询同为 ``O(log n)``，总体时间 ``O(n log n)``，额外空间为 ``O(n)``。
