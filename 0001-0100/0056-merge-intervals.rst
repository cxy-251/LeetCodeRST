0056. Merge Intervals
=====================

题目信息
--------

:题号: 0056
:难度: Medium
:主题: 数组、排序、区间、贪心
:原题: `LeetCode 0056 <https://leetcode.com/problems/merge-intervals/>`_
:重点: 从无序区间的反复比较，推导到按左端点排序后只维护当前覆盖段

题目重述
--------

给定若干闭区间 ``intervals[i] = [start_i, end_i]``，合并所有存在重叠的区间，返回若干彼此不重叠的
闭区间，并且它们覆盖的点集与原输入完全相同。

闭区间共享端点时交集非空，因此 ``[1,4]`` 与 ``[4,6]`` 也必须合并为 ``[1,6]``。返回顺序不限。

约束为 ``1 <= intervals.length <= 10^4``，每个区间满足
``0 <= start_i <= end_i <= 10^4``。

自建示例
--------

普通重叠：

.. code-block:: text

   输入：intervals = [[2,4],[3,7],[9,12],[11,15]]
   输出：[[2,7],[9,15]]

前两个区间合并为 ``[2,7]``，后两个区间合并为 ``[9,15]``。

端点相接与传递重叠：

.. code-block:: text

   输入：intervals = [[1,4],[4,5],[5,8],[10,12]]
   输出：[[1,8],[10,12]]

前三个区间通过共享端点形成连续覆盖链，最终属于同一结果区间。

包含关系：

.. code-block:: text

   输入：intervals = [[1,10],[2,3],[4,7]]
   输出：[[1,10]]

后两个区间完全包含在第一个区间内，不会扩大最终覆盖范围。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       bool overlaps(
           const std::vector<int>& first,
           const std::vector<int>& second
       ) {
           return first[0] <= second[1] && second[0] <= first[1];
       }

       std::vector<std::vector<int>> repeatedlyMergePairs(
           std::vector<std::vector<int>> intervals
       ) {
           bool merged = true;
           while (merged) {
               merged = false;
               for (int i = 0; i < static_cast<int>(intervals.size()); ++i) {
                   for (int j = i + 1; j < static_cast<int>(intervals.size()); ++j) {
                       if (!overlaps(intervals[i], intervals[j])) {
                           continue;
                       }

                       intervals[i][0] = std::min(
                           intervals[i][0],
                           intervals[j][0]
                       );
                       intervals[i][1] = std::max(
                           intervals[i][1],
                           intervals[j][1]
                       );
                       intervals.erase(intervals.begin() + j);
                       merged = true;
                       break;
                   }
                   if (merged) {
                       break;
                   }
               }
           }
           return intervals;
       }

       std::vector<std::vector<int>> sortAndMerge(
           std::vector<std::vector<int>>& intervals
       ) {
           std::sort(
               intervals.begin(),
               intervals.end(),
               [](const std::vector<int>& first, const std::vector<int>& second) {
                   if (first[0] != second[0]) {
                       return first[0] < second[0];
                   }
                   return first[1] < second[1];
               }
           );

           std::vector<std::vector<int>> result;
           result.push_back(intervals[0]);

           for (int i = 1; i < static_cast<int>(intervals.size()); ++i) {
               const int nextStart = intervals[i][0];
               const int nextEnd = intervals[i][1];
               std::vector<int>& current = result.back();

               if (nextStart > current[1]) {
                   result.push_back(intervals[i]);
               } else {
                   current[1] = std::max(current[1], nextEnd);
               }
           }
           return result;
       }

   public:
       std::vector<std::vector<int>> merge(
           std::vector<std::vector<int>>& intervals
       ) {
           return sortAndMerge(intervals);
       }
   };

题解
----

无序两两合并基线
~~~~~~~~~~~~~~~~

两个闭区间 ``[a,b]`` 与 ``[c,d]`` 重叠，当且仅当：

.. code-block:: text

   a <= d 且 c <= b

重叠后，它们的并集仍是一个闭区间：

.. code-block:: text

   [min(a,c), max(b,d)]

``repeatedlyMergePairs`` 在无序列表中寻找任意重叠对，合并后删除其中一个区间，再从头继续检查。
这种方法直接遵守定义，最终没有任何重叠对时，剩余区间就是答案。

一次扫描不能完成无序合并，因为区间扩张后可能产生新的重叠关系。例如 ``[1,4]`` 与 ``[4,5]`` 合并为
``[1,5]`` 后，又会与 ``[5,8]`` 重叠。此前已经比较过的区间因此可能需要重新检查。

列表最多执行 ``n - 1`` 次合并，每轮可能检查 ``O(n²)`` 对区间，删除元素还会移动后续内容，最坏时间可达
``O(n³)``。继续优化的关键是建立一种顺序，使已经完成的区间能够永久提交。

排序建立单向依赖
~~~~~~~~~~~~~~~~

按左端点升序排列后，后续区间的左端点不会变小。设当前尚未提交的覆盖段为：

.. code-block:: text

   current = [currentStart, currentEnd]

下一个区间为 ``[nextStart, nextEnd]``。由于已经排序，必有：

.. code-block:: text

   currentStart <= nextStart

于是只需比较 ``nextStart`` 与 ``currentEnd``。

若 ``nextStart <= currentEnd``，两个闭区间重叠或共享端点。合并后的左端点仍为 ``currentStart``，只需更新：

.. code-block:: text

   currentEnd = max(currentEnd, nextEnd)

若 ``nextStart > currentEnd``，当前段与新区间之间存在空隙。所有更晚区间的左端点都不小于
``nextStart``，因此也一定大于 ``currentEnd``。当前段不可能再与后续区间重叠，可以永久保留，并以新区间开始
下一段。

有序覆盖段不变量
~~~~~~~~~~~~~~~~

扫描第 ``i`` 个区间前，``result`` 保持以下状态：

* ``result`` 中的区间按左端点有序；
* 除最后一个区间外，其余区间已经永久完成，彼此严格分离；
* ``result.back()`` 是所有已扫描区间中最右侧、仍可能继续扩张的覆盖段；
* ``result`` 覆盖的点集恰好等于已经扫描区间的并集。

处理新区间时只有两种转移。

重叠时，把当前段右端点扩张到两者右端点的最大值。两区间之间没有空隙，因此新区间覆盖的点集恰好等于二者
并集，不会丢失原有点，也不会填入额外空隙。不变量继续成立。

分离时，排序已经证明当前段不可能再被后续区间扩张，所以直接追加新区间。此前的最后一段转为永久完成段，
新区间成为新的活动覆盖段，不变量同样成立。

所有输入区间恰好处理一次。扫描结束时，最后一个活动段也自然成为最终段，因此结果覆盖范围与原输入完全相同，
且任意相邻结果区间都满足前一个右端点小于后一个左端点。

传递重叠
~~~~~~~~

对 ``[[1,4],[4,5],[5,8]]``，排序后顺序不变：

.. list-table::
   :header-rows: 1

   * - 新区间
     - 当前覆盖段
     - 转移后
   * - ``[1,4]``
     - 无
     - 建立 ``[1,4]``
   * - ``[4,5]``
     - ``[1,4]``
     - 扩张为 ``[1,5]``
   * - ``[5,8]``
     - ``[1,5]``
     - 扩张为 ``[1,8]``

每次比较的是新区间与已经吸收前面所有重叠区间的当前覆盖段，因此由多个区间连接形成的重叠链不会遗漏。
包含区间也无需特殊处理；若 ``nextEnd <= currentEnd``，取最大值后当前段保持不变。

结果数组复用
~~~~~~~~~~~~

代码直接让 ``result.back()`` 表示活动覆盖段。重叠时修改它的右端点，分离时追加新区间，因此不需要额外维护
``currentStart`` 和 ``currentEnd``。

活动段之前的结果已经由排序证明不会再与任何后续区间重叠，所以只有最后一个区间可能变化。这正好对应有序覆盖段
不变量。

复杂度分析
~~~~~~~~~~

设区间数量为 ``n``。

无序反复合并最坏需要 ``O(n³)`` 时间，并在删除元素时产生额外移动成本。

主方法排序需要 ``O(n log n)`` 时间，随后线性扫描全部区间，耗时 ``O(n)``，总时间为 ``O(n log n)``。
主方法直接排序输入数组。不计返回结果，``std::sort`` 通常使用 ``O(log n)`` 调用栈；扫描阶段使用
``O(1)`` 额外空间。
