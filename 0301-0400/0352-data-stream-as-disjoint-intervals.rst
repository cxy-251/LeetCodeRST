0352. Data Stream as Disjoint Intervals
=======================================

题目信息
--------

:题号: 0352
:难度: Hard
:主题: 设计、有序区间、数据流、状态维护
:原题: `LeetCode 0352 <https://leetcode.com/problems/data-stream-as-disjoint-intervals/>`_
:重点: 重复加入不改变结果、相邻整数合并为闭区间、区间按起点升序返回、对象跨调用保存状态

题目重述
--------

实现 ``SummaryRanges`` 数据结构。``addNum(value)`` 把一个非负整数加入数据流；``getIntervals()`` 返回当前已经加入的所有不同整数所组成的若干闭区间 ``[start, end]``。

返回的区间必须互不重叠、彼此不相邻，并按 ``start`` 严格升序排列。若某个整数被重复加入，已记录集合和区间结果都不发生变化。``value`` 位于 ``[0, 10^4]``，对对象的调用总数不超过 ``3 * 10^4``，其中 ``getIntervals`` 的调用次数不超过 ``100``。同一对象需要在连续调用之间保存已经接收的数据。

自建示例
--------

新值同时连接左右区间：

.. code-block:: text

   调用：addNum(2), addNum(4), getIntervals(), addNum(3), getIntervals()
   输出：[[2,2],[4,4]]，随后为 [[2,4]]
   解释：加入 3 之前，2 和 4 分属两个单点区间；3 同时与两侧相邻，因此三个整数合并成一个闭区间。

重复加入已有整数：

.. code-block:: text

   调用：addNum(7), addNum(8), addNum(7), getIntervals()
   输出：[[7,8]]
   解释：第二次加入 7 不会产生重复元素，也不会改变现有区间。

有序区间只需检查左右两个邻居
------------------------------

用按起点排序的 ``map`` 保存当前互不相邻的区间。加入 ``value`` 时，``lower_bound`` 找到第一个起点不小于它的区间；它的前一个区间是唯一可能从左侧相邻或包含 ``value`` 的区间，当前找到的区间是唯一可能从右侧相邻的区间。因此只需判断“接左、接右、两边都接、两边都不接”四种情况。

若 ``value`` 已经落在左区间中，或恰好是右区间起点，直接返回；若左右都相邻，就把左区间的右端扩展到右区间的右端并删除右区间。只连接一侧时扩展对应端点，完全独立时插入单点区间。区间始终按起点排列，所以 ``getIntervals`` 只需顺序复制当前值。

C++ 实现
--------

.. code-block:: cpp

   class SummaryRanges {
       std::map<int, int> intervals;

   public:
       SummaryRanges() = default;

       void addNum(int value) {
           auto right = intervals.lower_bound(value);
           if (right != intervals.end() && right->first == value) {
               return;
           }

           bool joinRight = right != intervals.end()
                          && right->first == value + 1;
           bool joinLeft = false;
           auto left = right;
           if (left != intervals.begin()) {
               --left;
               if (left->second >= value) return;
               joinLeft = left->second == value - 1;
           }

           if (joinLeft && joinRight) {
               left->second = right->second;
               intervals.erase(right);
           } else if (joinLeft) {
               ++left->second;
           } else if (joinRight) {
               int end = right->second;
               intervals.erase(right);
               intervals[value] = end;
           } else {
               intervals[value] = value;
           }
       }

       std::vector<std::vector<int>> getIntervals() {
           std::vector<std::vector<int>> result;
           for (const auto& interval : intervals) {
               result.push_back({interval.first, interval.second});
           }
           return result;
       }
   };

代码分析
--------

``map`` 的不变量是区间既不重叠也不相邻，因此一次加入最多合并两个已有区间；重复值会在落入左区间或撞上右端点时被忽略。每次 ``addNum`` 需要 ``O(log m)``，其中 ``m`` 是当前区间数；``getIntervals`` 按区间数 ``O(m)`` 输出，额外存储为 ``O(m)``。
