0057. Insert Interval
=====================

题目信息
--------

:题号: 0057
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

约束为 ``0 <= intervals.length <= 10^4``，所有端点均在 ``[0,10^5]`` 内，每个区间的左端点不大于
右端点。

自建示例
--------

.. code-block:: text

   输入：intervals = [[1,3],[7,9],[12,15]], newInterval = [4,13]
   输出：[[1,3],[4,15]]

``[1,3]`` 完全在新区间左侧；新区间依次与 ``[7,9]``、``[12,15]`` 重叠，最终扩张为 ``[4,15]``。

.. code-block:: text

   输入：intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]
   输出：[[1,2],[3,10],[12,16]]

新区间先与 ``[3,5]`` 重叠并扩张为 ``[3,8]``，随后继续吸收 ``[6,7]`` 和与右端点 8 接触的
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
                   result.back()[1] = std::max(result.back()[1], interval[1]);
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
               mergedStart = std::min(mergedStart, intervals[index][0]);
               mergedEnd = std::max(mergedEnd, intervals[index][1]);
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

直接复用 0056：插入、排序、统一合并
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

不利用本题的额外条件时，可以先把 ``newInterval`` 追加到数组，再按左端点排序，最后使用 0056 的区间合并
方法。

``appendSortAndMerge`` 一定正确，因为追加后的问题就是普通的“合并所有重叠区间”。它的时间为
``O(n log n)``，主要成本来自重新排序。

这个方法浪费了两个已经给出的事实：原区间本来就有序，而且原区间之间本来就不重叠。新区间只可能改变一段
连续区域，不需要重新整理全部区间。

新区间把原序列分成哪三部分
~~~~~~~~~~~~~~~~~~~~~~~~~~

令当前待合并区间为：

.. code-block:: text

   merged = [mergedStart, mergedEnd]

开始时它就是 ``newInterval``。从左到右扫描原区间，每个区间只会属于以下三类之一。

第一部分：完全在 merged 左侧
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若当前区间满足：

.. code-block:: text

   interval.end < mergedStart

它与 ``merged`` 之间存在严格空隙，可以直接加入结果。

这里必须使用 ``<``。若 ``interval.end == mergedStart``，两个闭区间共享端点，应该进入合并阶段。

第二部分：与 merged 重叠
~~~~~~~~~~~~~~~~~~~~~~~~

跳过全部左侧区间后，只要当前区间满足：

.. code-block:: text

   interval.start <= mergedEnd

它就与 ``merged`` 相交或接触，应更新：

.. code-block:: text

   mergedStart = min(mergedStart, interval.start)
   mergedEnd   = max(mergedEnd, interval.end)

右端点扩张后，原本更靠右的区间也可能进入重叠范围，因此必须继续扫描，直到遇到第一个
``interval.start > mergedEnd`` 的区间。

第三部分：完全在 merged 右侧
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

一旦出现：

.. code-block:: text

   interval.start > mergedEnd

当前合并段已经结束。由于原数组按左端点升序排列，所有后续区间的左端点只会更大，也不可能再与
``merged`` 重叠。

因此只需提交一次 ``merged``，再把剩余区间原样复制到结果末尾。

为什么重叠区间一定连续出现
~~~~~~~~~~~~~~~~~~~~~~~~~~

原数组有序且彼此不重叠。设扫描到第一个位于右侧的区间 ``intervals[k]``，满足：

.. code-block:: text

   intervals[k].start > mergedEnd

对于任意 ``j > k``，排序保证：

.. code-block:: text

   intervals[j].start >= intervals[k].start > mergedEnd

所以进入右侧部分后，不可能再次遇到重叠区间。左侧、重叠、右侧三部分在数组中必然按顺序连续出现，扫描
不需要回退。

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
     - ``2 < 4``，直接输出
     - ``[4,8]``
   * - ``[3,5]``
     - ``[4,8]``
     - 重叠，向左扩张
     - ``[3,8]``
   * - ``[6,7]``
     - ``[3,8]``
     - 完全包含
     - ``[3,8]``
   * - ``[8,10]``
     - ``[3,8]``
     - 共享端点，向右扩张
     - ``[3,10]``
   * - ``[12,16]``
     - ``[3,10]``
     - ``12 > 10``，进入右侧部分
     - ``[3,10]``

最终结果为 ``[[1,2],[3,10],[12,16]]``。

为什么结果仍然有序且互不重叠
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

左侧部分的每个区间都满足 ``interval.end < mergedStart``，所以它们与最终合并段严格分离。中间所有重叠区间
与新区间被替换为一个覆盖相同并集的 ``merged``。

右侧第一个区间满足 ``interval.start > mergedEnd``，后续区间又保持原有的有序、不重叠性质。因此结果依次由
左侧原区间、一个合并段、右侧原区间组成，天然有序且彼此不重叠。

每个原区间恰好在三个循环中的一个被处理，新区间始终包含在 ``merged`` 中，所以结果没有遗漏。合并只发生在
有交集或共享端点的闭区间之间，也不会填入原覆盖范围之外的空隙。

边界情况
~~~~~~~~

``intervals`` 为空时，前两个循环都不执行，直接加入 ``newInterval``。

新区间位于所有区间之前时，左侧循环为空，重叠阶段可能为空，先加入新区间，再复制全部原区间。新区间位于
所有区间之后时，先复制全部原区间，再加入新区间。

新区间被某个原区间完全包含时，合并后的两个端点都保持为原区间端点；新区间覆盖多个原区间时，重叠循环会
持续扩张，直到完整吸收这段连续区间。

复杂度来源
~~~~~~~~~~

``scanThreeParts`` 对每个原区间最多访问一次，时间为 ``O(n)``。返回结果本身最多包含 ``n+1`` 个区间；不计
返回结果，只使用索引和两个端点，额外空间为 ``O(1)``。

追加、排序再合并的方法时间为 ``O(n log n)``，并因按值接收参数而使用 ``O(n)`` 输入副本空间。主入口调用
``scanThreeParts``，且不修改原区间和新区间。
