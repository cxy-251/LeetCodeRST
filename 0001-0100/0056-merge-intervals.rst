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

给定若干闭区间 ``intervals[i] = [start_i, end_i]``，合并所有存在重叠的区间，返回若干彼此不重叠的闭区间，
并且它们覆盖的点集与原输入完全相同。

闭区间共享端点时交集非空，因此 ``[1,4]`` 与 ``[4,6]`` 也必须合并为 ``[1,6]``。返回顺序不限。

约束为 ``1 <= intervals.length <= 10^4``，每个区间满足
``0 <= start_i <= end_i <= 10^4``。

自建示例
--------

.. code-block:: text

   输入：intervals = [[2,4],[3,7],[9,12],[11,15]]
   输出：[[2,7],[9,15]]

``[2,4]`` 与 ``[3,7]`` 重叠，``[9,12]`` 与 ``[11,15]`` 重叠。

.. code-block:: text

   输入：intervals = [[1,4],[4,5],[5,8],[10,12]]
   输出：[[1,8],[10,12]]

前三个区间通过共享端点形成一条连续覆盖链。即使 ``[1,4]`` 与 ``[5,8]`` 不直接重叠，它们仍会经过
``[4,5]`` 合并到同一结果区间。

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
                       if (!overlaps(intervals[i], intervals[j])) continue;

                       intervals[i][0] = std::min(intervals[i][0], intervals[j][0]);
                       intervals[i][1] = std::max(intervals[i][1], intervals[j][1]);
                       intervals.erase(intervals.begin() + j);
                       merged = true;
                       break;
                   }
                   if (merged) break;
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
                   if (first[0] != second[0]) return first[0] < second[0];
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

从定义出发：反复寻找任意重叠区间
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

两个闭区间 ``[a,b]`` 与 ``[c,d]`` 重叠，当且仅当：

.. code-block:: text

   a <= d 且 c <= b

找到一对重叠区间后，可以把它们替换为：

.. code-block:: text

   [min(a,c), max(b,d)]

``repeatedlyMergePairs`` 直接按这个定义工作：在无序列表中寻找一对重叠区间，合并并删除其中一个，然后
重新开始扫描，直到不存在重叠对。

为什么一次两两扫描不够
~~~~~~~~~~~~~~~~~~~~~~

合并会扩大区间，进而产生原本没有被发现的新重叠关系。例如：

.. code-block:: text

   [1,4] 与 [4,5] 合并为 [1,5]
   扩张后的 [1,5] 又与 [5,8] 重叠

因此，无序状态下不能在比较完一对区间后永久排除它们。每次扩张都可能迫使算法重新检查此前区间，形成大量
重复工作。

列表最多发生 ``n-1`` 次合并，每次可能扫描 ``O(n²)`` 对区间，所以该直接方法可达到 ``O(n³)`` 时间；
此外，中间删除元素还会移动后续区间。问题的关键不是更快地判断两区间是否重叠，而是先建立一种顺序，使
已经完成的区间可以永久提交。

按左端点排序改变了什么
~~~~~~~~~~~~~~~~~~~~~~

按左端点从小到大排序后，后续区间的左端点不会再减小。设已经合并出的当前覆盖段为：

.. code-block:: text

   current = [currentStart, currentEnd]

下一个区间为 ``[nextStart,nextEnd]``，只可能出现两种情况。

第一种：``nextStart <= currentEnd``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

两个闭区间重叠或共享端点，应合并。因为已经按左端点排序，必有
``currentStart <= nextStart``，所以合并后的左端点仍然是 ``currentStart``，只需更新：

.. code-block:: text

   currentEnd = max(currentEnd, nextEnd)

新区间若完全被包含，右端点不变；若向右伸出，则当前覆盖段随之扩张。

第二种：``nextStart > currentEnd``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

当前覆盖段与下一个区间完全分离。更重要的是，排序保证所有更晚区间的左端点都满足：

.. code-block:: text

   laterStart >= nextStart > currentEnd

所以当前覆盖段不可能再与任何后续区间重叠，可以永久写入结果。随后把下一个区间作为新的当前覆盖段。

为什么传递重叠不会遗漏
~~~~~~~~~~~~~~~~~~~~~~

对 ``[[1,4],[4,5],[5,8]]``：

.. list-table::
   :header-rows: 1

   * - 新区间
     - 合并前当前段
     - 判断
     - 合并后当前段
   * - ``[1,4]``
     - —
     - 建立当前段
     - ``[1,4]``
   * - ``[4,5]``
     - ``[1,4]``
     - ``4 <= 4``
     - ``[1,5]``
   * - ``[5,8]``
     - ``[1,5]``
     - ``5 <= 5``
     - ``[1,8]``

算法比较的不是新区间与最初的 ``[1,4]``，而是与已经扩张到 ``[1,5]`` 的当前覆盖段比较。因此由多个区间
连接形成的传递重叠链，会被连续吸收到同一个结果区间中。

为什么结果保持相同覆盖范围
~~~~~~~~~~~~~~~~~~~~~~~~~~

合并重叠区间时，用 ``[currentStart, max(currentEnd,nextEnd)]`` 替代二者。由于两区间之间没有空隙，这个新区间
覆盖的点恰好等于原两区间覆盖点的并集，既不会丢点，也不会填入原本不存在的空隙。

每个输入区间按排序顺序恰好处理一次：它要么扩张当前覆盖段，要么启动一个新覆盖段，因此没有遗漏。新段只在
``nextStart > currentEnd`` 时建立，所以结果中相邻区间严格分离，不会残留可继续合并的区间。

为什么结果末尾可以充当当前段
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

代码把 ``result.back()`` 直接作为尚未完成的当前覆盖段。遇到重叠时只扩张其右端点；遇到分离时追加新区间。

这样无需额外保存 ``currentStart`` 和 ``currentEnd``。虽然结果末尾在扫描期间仍可能变化，但它之前的所有区间
都已经由排序证明不可能与后续区间重叠，因此不会再被修改。

复杂度来源
~~~~~~~~~~

排序需要 ``O(n log n)`` 时间，之后每个区间只扫描一次，耗时 ``O(n)``，总时间为 ``O(n log n)``。

主方法直接在输入数组上排序。不计返回结果，额外空间由 ``std::sort`` 的调用栈决定，通常为 ``O(log n)``。
扫描阶段只使用常数个局部变量；返回数组最多保存 ``n`` 个区间。
