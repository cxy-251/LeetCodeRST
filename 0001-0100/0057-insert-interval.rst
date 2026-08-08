0057. Insert Interval
=====================

题目信息
--------

:题号: 0057. 插入区间
:难度: Medium
:主题: 数组、区间、线性扫描
:原题: `LeetCode 0057 <https://leetcode.com/problems/insert-interval/>`_
:重点: 从插入后重新排序合并，推导到利用有序不重叠条件完成三段扫描

题目重述
--------

给定若干闭区间 ``intervals``，它们已经按左端点升序排列，并且彼此不重叠。另给一个闭区间
``newInterval``。

把新区间插入原序列，合并所有重叠区间，返回仍按左端点升序排列且彼此不重叠的结果。

闭区间共享端点时也算重叠。例如 ``[1,4]`` 与 ``[4,6]`` 应合并为 ``[1,6]``。

约束为 ``0 <= intervals.length <= 10^4``。所有端点均在 ``[0,10^5]`` 内，每个区间的左端点不大于
右端点。

自建示例
--------

.. code-block:: text

   输入：intervals = [[1,3],[7,9],[12,15]], newInterval = [4,13]
   输出：[[1,3],[4,15]]

``[1,3]`` 完全位于新区间左侧。新区间依次吸收 ``[7,9]`` 与 ``[12,15]``，最终扩张为
``[4,15]``。

.. code-block:: text

   输入：intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]
   输出：[[1,2],[3,10],[12,16]]

新区间先与 ``[3,5]`` 重叠并扩张为 ``[3,8]``，随后继续吸收 ``[6,7]`` 和与右端点接触的
``[8,10]``。

.. code-block:: text

   输入：intervals = [], newInterval = [5,6]
   输出：[[5,6]]

原数组为空时，结果只包含新区间。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       std::vector<std::vector<int>> appendSortAndMerge(
           std::vector<std::vector<int>> intervals,
           const std::vector<int>& newInterval
       ) {
           intervals.push_back(newInterval);
           std::sort(intervals.begin(), intervals.end());

           std::vector<std::vector<int>> result;
           for (const auto& interval : intervals) {
               if (result.empty() || interval[0] > result.back()[1]) {
                   result.push_back(interval);
               } else {
                   result.back()[1] = std::max(
                       result.back()[1],
                       interval[1]
                   );
               }
           }
           return result;
       }

       std::vector<std::vector<int>> scanThreeParts(
           const std::vector<std::vector<int>>& intervals,
           const std::vector<int>& newInterval
       ) {
           std::vector<std::vector<int>> result;
           result.reserve(intervals.size() + 1);

           int index = 0;
           int mergedStart = newInterval[0];
           int mergedEnd = newInterval[1];
           const int size = static_cast<int>(intervals.size());

           while (index < size && intervals[index][1] < mergedStart) {
               result.push_back(intervals[index]);
               ++index;
           }

           while (index < size && intervals[index][0] <= mergedEnd) {
               mergedStart = std::min(
                   mergedStart,
                   intervals[index][0]
               );
               mergedEnd = std::max(
                   mergedEnd,
                   intervals[index][1]
               );
               ++index;
           }
           result.push_back({mergedStart, mergedEnd});

           while (index < size) {
               result.push_back(intervals[index]);
               ++index;
           }
           return result;
       }

   public:
       std::vector<std::vector<int>> insert(
           std::vector<std::vector<int>>& intervals,
           std::vector<int>& newInterval
       ) {
           return scanThreeParts(intervals, newInterval);
       }
   };

题解
----

统一合并基线
~~~~~~~~~~~~

不利用输入已经有序且互不重叠的条件时，可以先把 ``newInterval`` 追加到数组，再排序并执行普通区间合并。
``appendSortAndMerge`` 将问题直接转化为 0056，时间复杂度为 ``O(n log n)``。

这条路线能够保证正确，但重新排序了本来已经有序的区间。原区间之间不会互相合并，真正可能变化的只有与
``newInterval`` 相交的一段连续区间。

三段扫描模型
~~~~~~~~~~~~

令当前待合并区间为：

.. code-block:: text

   merged = [mergedStart, mergedEnd]

初始时它就是 ``newInterval``。由于原区间按左端点升序排列且彼此不重叠，从左到右扫描时，区间必然依次落入
左侧、重叠、右侧三个连续部分。

左侧区间满足：

.. code-block:: text

   interval.end < mergedStart

它们与新区间之间存在严格空隙，可以直接写入结果。这里不能使用 ``<=``，因为闭区间共享端点时仍需合并。

离开左侧部分后，只要满足：

.. code-block:: text

   interval.start <= mergedEnd

当前区间就与 ``merged`` 相交或接触，应更新两个端点：

.. code-block:: text

   mergedStart = min(mergedStart, interval.start)
   mergedEnd   = max(mergedEnd, interval.end)

右端点扩张后，后续区间可能继续进入重叠范围，因此这一阶段必须持续到第一个
``interval.start > mergedEnd`` 的区间。

此时当前合并段已经完整。排序保证所有更晚区间的左端点只会更大，因此它们全部位于 ``merged`` 右侧，可以在
提交一次 ``merged`` 后原样复制。

有序三段不变量
~~~~~~~~~~~~~~

扫描过程中保持以下事实：

* ``result`` 中已经写入的区间全部位于 ``merged`` 左侧，保持原有顺序且彼此不重叠；
* ``merged`` 覆盖新区间与已经扫描到的全部重叠区间的并集；
* 尚未扫描的区间仍按左端点升序排列。

左侧区间满足 ``interval.end < mergedStart``，写入后不会与 ``merged`` 或更右区间重叠。重叠阶段每吸收一个
区间，只把 ``merged`` 扩张到二者并集；因为两者相交或共享端点，不会填入原覆盖范围之外的空隙。

遇到第一个 ``interval.start > mergedEnd`` 后，任意后续区间也满足同样的不等式，所以重叠阶段不会再次出现。
因此三个循环无需回退，每个原区间恰好处理一次。

最终结果由左侧原区间、一个合并段和右侧原区间组成。三部分内部都保持有序，两个连接处又存在严格空隙，结果
自然按左端点升序排列且彼此不重叠。

状态演化
~~~~~~~~

对：

.. code-block:: text

   intervals   = [[1,2],[3,5],[6,7],[8,10],[12,16]]
   newInterval = [4,8]

扫描过程为：

.. list-table::
   :header-rows: 1

   * - 当前区间
     - 合并前 ``merged``
     - 动作
     - 合并后 ``merged``
   * - ``[1,2]``
     - ``[4,8]``
     - 左侧，直接输出
     - ``[4,8]``
   * - ``[3,5]``
     - ``[4,8]``
     - 重叠，向左扩张
     - ``[3,8]``
   * - ``[6,7]``
     - ``[3,8]``
     - 被完整包含
     - ``[3,8]``
   * - ``[8,10]``
     - ``[3,8]``
     - 共享端点，向右扩张
     - ``[3,10]``
   * - ``[12,16]``
     - ``[3,10]``
     - 右侧，结束合并
     - ``[3,10]``

最终结果为 ``[[1,2],[3,10],[12,16]]``。

边界处理
~~~~~~~~

原数组为空时，三个扫描循环都不会处理原区间，算法直接写入 ``newInterval``。

新区间位于所有原区间之前时，左侧部分为空，先提交新区间，再复制全部右侧区间。新区间位于所有原区间之后时，
先复制全部左侧区间，再提交新区间。

新区间被某个原区间完全包含时，合并后的端点等于该原区间端点。新区间跨越多个原区间时，重叠阶段持续扩张，
直到完整吸收这段连续区间。

复杂度分析
~~~~~~~~~~

``scanThreeParts`` 对每个原区间最多访问一次，时间复杂度为 ``O(n)``。不计返回结果，只维护索引和两个端点，
额外空间为 ``O(1)``。

追加、排序再合并的方法时间复杂度为 ``O(n log n)``，并因按值接收参数而使用 ``O(n)`` 输入副本空间。
公开入口调用 ``scanThreeParts``，且不修改原区间和新区间。
