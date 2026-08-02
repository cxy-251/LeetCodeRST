0435. Non-overlapping Intervals
===============================

题目信息
--------

:题号: 0435
:难度: Medium
:主题: 区间集合、删除区间、互不重叠、最少删除数
:原题: `LeetCode 0435 <https://leetcode.com/problems/non-overlapping-intervals/>`_
:重点: 每个区间满足 ``start < end``、端点接触不算重叠、返回需要删除的最少区间数量

题目重述
--------

给定区间数组 ``intervals``，每个区间表示为 ``[start, end]`` 且 ``start < end``。删除尽可能少的区间，使剩余任意两个区间都不重叠，返回最少删除数量。

当一个区间的结束点恰好等于另一个区间的开始点时，两者不算重叠，可以同时保留。``intervals.length`` 位于 ``[1, 10^5]``，端点位于 ``[-5 * 10^4, 5 * 10^4]``。只返回删除数量，不要求返回具体被删区间。

自建示例
--------

端点接触可以保留：

.. code-block:: text

   输入：intervals = [[1,3], [2,4], [4,6]]
   输出：1
   解释：删除 [2,4] 后，[1,3] 与 [4,6] 之间没有重叠；端点 4 的接触不会造成冲突。

多个完全相同的区间：

.. code-block:: text

   输入：intervals = [[0,2], [0,2], [0,2]]
   输出：2
   解释：三个区间彼此重叠，最多保留一个，因此至少删除两个。

重叠时保留结束点更早的区间
----------------------------

按结束点升序扫描。若当前区间的开始点小于已经保留区间的结束点，两者重叠，必须删除一个；保留结束点更早的那个能给后续留下更大的可用空间，因此若当前结束点更早就用它替换已保留区间，否则继续保留原区间。开始点等于结束点时不重叠，使用严格 ``<`` 判断。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int eraseOverlapIntervals(
           std::vector<std::vector<int>>& intervals) {
           std::sort(intervals.begin(), intervals.end(),
               [](const std::vector<int>& first,
                  const std::vector<int>& second) {
                   return first[1] < second[1];
               });

           int removed = 0;
           int lastEnd = intervals[0][1];
           for (int i = 1; i < static_cast<int>(intervals.size()); ++i) {
               if (intervals[i][0] < lastEnd) {
                   ++removed;
                   lastEnd = std::min(lastEnd, intervals[i][1]);
               } else {
                   lastEnd = intervals[i][1];
               }
           }
           return removed;
       }
   };

代码分析
--------

每次冲突都选择结束更早者等价于最大化能够保留的非重叠区间数量，删除数就是总数减去该最大数量。排序为 ``O(n log n)``，扫描为 ``O(n)``，额外空间为 ``O(1)``（不计排序实现可能使用的栈）。
