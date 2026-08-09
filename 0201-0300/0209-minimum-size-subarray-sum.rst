0209. Minimum Size Subarray Sum
===============================

题目信息
--------

:题号: 0209. 长度最小的子数组
:难度: Medium
:主题: 数组、滑动窗口、前缀和、二分查找
:原题: `LeetCode 0209 <https://leetcode.com/problems/minimum-size-subarray-sum/>`_
:重点: 正数让窗口和单调变化，达到目标后必须连续收缩左端寻找最短长度

题目重述
--------

给定正整数 ``target`` 和只包含正整数的数组 ``nums``，找出元素和大于或等于 ``target`` 的
最短非空连续子数组，返回它的长度；若不存在满足条件的子数组，返回 ``0``。

``target`` 位于 ``[1, 10^9]``，数组长度位于 ``[1, 10^5]``，每个元素位于 ``[1, 10^4]``。子数组
必须使用连续位置，只返回长度，不要求返回起止下标。

自建示例
--------

最短窗口在中间：

.. code-block:: text

   输入：target = 11，nums = [1, 4, 6, 5, 2]
   输出：2
   解释：[6,5] 的和为 11，长度为 2。

单个元素已经达标：

.. code-block:: text

   输入：target = 4，nums = [1, 4, 4]
   输出：1

整个数组也不达标：

.. code-block:: text

   输入：target = 20，nums = [3, 5, 4, 2]
   输出：0

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   public:
       int minSubArrayLen(int target, std::vector<int>& nums) {
           return slidingWindow(target, nums);
       }

   private:
       int slidingWindow(int target, const std::vector<int>& nums) {
           long long sum = 0;
           int left = 0;
           int best = static_cast<int>(nums.size()) + 1;

           for (int right = 0; right < static_cast<int>(nums.size()); ++right) {
               sum += nums[right];
               while (sum >= target) {
                   best = std::min(best, right - left + 1);
                   sum -= nums[left++];
               }
           }

           return best == static_cast<int>(nums.size()) + 1 ? 0 : best;
       }

       int prefixWithBinarySearch(int target, const std::vector<int>& nums) {
           int n = static_cast<int>(nums.size());
           std::vector<long long> prefix(n + 1, 0);
           for (int index = 0; index < n; ++index) {
               prefix[index + 1] = prefix[index] + nums[index];
           }

           int best = n + 1;
           for (int right = 1; right <= n; ++right) {
               long long limit = prefix[right] - target;
               auto firstGreater = std::upper_bound(prefix.begin(), prefix.begin() + right, limit);
               if (firstGreater != prefix.begin()) {
                   int left = static_cast<int>(firstGreater - prefix.begin()) - 1;
                   best = std::min(best, right - left);
               }
           }
           return best == n + 1 ? 0 : best;
       }
   };

题解
----

枚举区间会重复累加
~~~~~~~~~~~~~~~~~~~~

直接枚举起点 ``left``，向右扩展并累加，遇到和达标就更新答案；或者枚举所有起止位置再求和。
前者已经避免了重复计算同一起点的前缀，但最坏仍要为每个起点扫描很长后缀，时间为 ``O(n^2)``。

要找到最短窗口，不能只在第一次达标时停止：同一个右端下，删除若干左端元素后仍可能达标，
而窗口会更短。重复工作在于，枚举法反复从不同起点重新确认重叠区间的和。

正数提供边界单调性
~~~~~~~~~~~~~~~~~~~~

窗口 ``nums[left..right]`` 的元素全部为正，这一条件改变了搜索空间：

* 右端向右加入元素，窗口和只会增加；
* 左端向右删除元素，窗口和只会减少；
* 对固定右端，左端一旦右移到某个和不足的位置，再继续右移不可能重新达标。

因此右端每次加入一个元素后，只要窗口已经达标，就连续提交答案并收缩左端。第一次收缩后
变为不足时，本右端下的更小窗口全部不可行，可以把左端永久留在当前位置，等待下一个右端。

滑动窗口主解
~~~~~~~~~~~~~~

维护闭区间窗口 ``[left, right]``、其和 ``sum`` 和当前最短长度 ``best``：

1. 把 ``nums[right]`` 加入 ``sum``；
2. 只要 ``sum >= target``，用当前长度更新 ``best``；
3. 先记录，再减去 ``nums[left]`` 并右移 ``left``；
4. 和变小于目标后，右移 ``right`` 继续扩展。

“先记录再删除”不可交换：删除后得到的是更短窗口，原窗口若不先提交就会被永久丢掉。由于
所有元素为正，内层循环结束时，当前右端下没有遗漏的可行左端。

窗口不变量
~~~~~~~~~~~~

每轮外层循环完成加入操作后保持：

* ``sum`` 恰好等于当前 ``[left, right]`` 的元素和；
* ``left``、``right`` 只向右移动，窗口始终连续；
* ``best`` 是已经检查过的所有可行窗口长度的最小值；
* 已经移过的左端起点不可能在未来产生更短答案，因为它当时已经对应一个更早结束的可行窗口；
* 输入数组只读。

状态走读
~~~~~~~~

对 ``target = 7``、``nums = [2,3,1,2,4,3]``：

.. list-table::
   :header-rows: 1

   * - 加入位置
     - 当前窗口和
     - 连续收缩
     - best
   * - 0
     - ``[2]``，2
     - 不达标
     - —
   * - 1
     - ``[2,3]``，5
     - 不达标
     - —
   * - 2
     - ``[2,3,1]``，6
     - 不达标
     - —
   * - 3
     - ``[2,3,1,2]``，8
     - 提交 4，删 2 后和为 6
     - 4
   * - 4
     - ``[3,1,2,4]``，10
     - 提交 4；删 3 后 ``[1,2,4]`` 提交 3；再删 1 后和为 6
     - 3
   * - 5
     - ``[2,4,3]``，9
     - 提交 3；删 2 后 ``[4,3]`` 提交 2；再删 4 后和为 3
     - 2

最终返回 2。每个右端下的连续收缩都在当前窗口仍达标时发生，因此没有错过中间的更短窗口。

前缀和与二分查找
~~~~~~~~~~~~~~~~~~

正数还使前缀和严格递增。令 ``prefix[i]`` 为前 ``i`` 个元素之和，区间 ``[left, right)``
达标等价于：

.. code-block:: text

   prefix[right] - prefix[left] >= target
   prefix[left] <= prefix[right] - target

固定 ``right`` 后，在前缀和的 ``[0, right)`` 中二分查找不大于
``prefix[right] - target`` 的最大下标；它给出当前右端的最靠右、也最短的可行左端。这个方案
把边界移动换成了有序数组查询，时间 ``O(n log n)``、空间 ``O(n)``。它满足题目追问，但主入口
选择滑动窗口，因为正数单调性可以把每次二分压缩为一次整体线性移动。

代码分析
~~~~~~~~

公共入口调用 ``slidingWindow``。``sum`` 使用 ``long long`` 保存窗口和；``best`` 以 ``n+1``
作为“尚未找到”哨兵，最后转为 0。右端加入后，内层 ``while`` 连续更新和删除左端，正是前文
中“同一右端不断寻找更短窗口”的状态转移。

``prefixWithBinarySearch`` 保留为另一条实现路径。它使用 ``upper_bound`` 找到第一个大于上限的
前缀位置，再退一格得到最大的合法 ``left``；前缀严格递增来自数组元素全为正。两个方法都不
修改输入，主解只保存四个标量，优先选择它是因为它完全消除了前缀数组和每次二分。

复杂度与边界
~~~~~~~~~~~~

滑动窗口中每个元素最多被右端加入一次、被左端删除一次，时间复杂度 ``O(n)``，额外空间
``O(1)``。前缀和二分法时间 ``O(n log n)``、空间 ``O(n)``。枚举起点的基线最坏为 ``O(n^2)``。

若整个数组和不足 ``target``，内层循环从不进入，哨兵转换为 0；若某个单元素已经达标，加入它
后立即记录长度 1。正数条件是滑动窗口正确性的必要结构；若允许负数，删除左端可能使和重新变大，
此单调收缩推导就不成立。
