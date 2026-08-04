0034. Find First and Last Position of Element in Sorted Array
============================================================

题目信息
--------

:题号: 0034
:难度: Medium
:主题: 数组、二分查找、边界定位
:原题: `LeetCode 0034 <https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/>`_
:重点: 从找到任意目标位置，推导到分别寻找第一个不小于目标和第一个大于目标的位置

题目重述
--------

给定一个按非递减顺序排列的整数数组 ``nums`` 和整数 ``target``，返回目标值第一次与最后一次出现的零基下标，
结果格式为 ``[first, last]``。

若 ``target`` 不在数组中，返回 ``[-1, -1]``。算法必须达到 ``O(log n)`` 时间复杂度。

``nums`` 的长度位于 ``[0, 10^5]``，数组元素和 ``target`` 均位于 ``[-10^9, 10^9]``。数组中允许存在
重复值；由于数组有序，所有等于 ``target`` 的元素必然构成一个连续区间。

自建示例
--------

* 重复段位于中间：``nums = [1, 2, 2, 2, 2, 5, 8]``、``target = 2``，返回 ``[1, 4]``；
* 目标只出现一次：``nums = [-3, 0, 4, 7]``、``target = 4``，返回 ``[2, 2]``；
* 整个数组都是目标：``nums = [6, 6, 6, 6]``、``target = 6``，返回 ``[0, 3]``；
* 目标位于插入位置但并不存在：``nums = [1, 3, 5, 7]``、``target = 4``，返回 ``[-1, -1]``；
* 空数组：``nums = []``、``target = 9``，返回 ``[-1, -1]``。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       std::vector<int> linearScan(const std::vector<int>& nums, int target) {
           int first = -1;
           int last = -1;
           for (int index = 0; index < static_cast<int>(nums.size()); ++index) {
               if (nums[index] < target) {
                   continue;
               }
               if (nums[index] > target) {
                   break;
               }
               if (first == -1) {
                   first = index;
               }
               last = index;
           }
           return {first, last};
       }

       std::vector<int> binaryThenExpand(const std::vector<int>& nums, int target) {
           int low = 0;
           int high = static_cast<int>(nums.size()) - 1;
           int found = -1;
           while (low <= high) {
               const int mid = low + (high - low) / 2;
               if (nums[mid] == target) {
                   found = mid;
                   break;
               }
               if (nums[mid] < target) {
                   low = mid + 1;
               } else {
                   high = mid - 1;
               }
           }
           if (found == -1) {
               return {-1, -1};
           }

           int first = found;
           int last = found;
           while (first > 0 && nums[first - 1] == target) {
               --first;
           }
           while (last + 1 < static_cast<int>(nums.size()) && nums[last + 1] == target) {
               ++last;
           }
           return {first, last};
       }

       int lowerBound(const std::vector<int>& nums, int target) {
           int low = 0;
           int high = static_cast<int>(nums.size());
           while (low < high) {
               const int mid = low + (high - low) / 2;
               if (nums[mid] < target) {
                   low = mid + 1;
               } else {
                   high = mid;
               }
           }
           return low;
       }

       int upperBound(const std::vector<int>& nums, int target) {
           int low = 0;
           int high = static_cast<int>(nums.size());
           while (low < high) {
               const int mid = low + (high - low) / 2;
               if (nums[mid] <= target) {
                   low = mid + 1;
               } else {
                   high = mid;
               }
           }
           return low;
       }

       std::vector<int> boundaryBinarySearch(const std::vector<int>& nums, int target) {
           const int first = lowerBound(nums, target);
           if (first == static_cast<int>(nums.size()) || nums[first] != target) {
               return {-1, -1};
           }
           const int afterLast = upperBound(nums, target);
           return {first, afterLast - 1};
       }

   public:
       std::vector<int> searchRange(std::vector<int>& nums, int target) {
           return boundaryBinarySearch(nums, target);
       }
   };

题解
----

线性扫描先确定答案语义
~~~~~~~~~~~~~~~~~~~~~~

最直接的方法从左到右检查数组。第一次遇到 ``target`` 时记录 ``first``，之后每次遇到目标都更新 ``last``。
数组有序，因此：

* 当前值小于目标时继续向右；
* 当前值等于目标时记录边界；
* 当前值大于目标后，右侧只会更大，可以立即停止。

``linearScan`` 准确表达了题目要求，也直接利用了目标值连续出现这一事实。不过当目标位于数组末尾或整个数组都等于
目标时，仍要读取 ``n`` 个元素，时间为 ``O(n)``，不能满足题目的对数要求。

普通二分只找到重复段中的任意位置
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

普通二分能够在 ``O(log n)`` 时间内找到某个等于 ``target`` 的位置，但遇到相等时立即返回，不能保证该位置是重复
段的左端或右端。

一种自然修补是 ``binaryThenExpand``：先二分得到下标 ``found``，再从这里分别向左和向右移动，直到相邻元素不再
等于目标。这比完全线性扫描更接近要求，但重复段长度为 ``r`` 时仍需 ``O(r)`` 次扩展。

例如数组全部由目标值组成时，二分很快命中中间位置，随后仍要走到数组两端，总时间退化为 ``O(n)``。瓶颈并非
“找不到目标”，而是命中后仍逐个检查重复元素。边界本身也必须通过二分直接定位。

把相等查找改写为单调条件
~~~~~~~~~~~~~~~~~~~~~~~~

普通二分询问“中点是否等于目标”。边界二分改为寻找某个单调布尔条件第一次成立的位置。

左边界使用条件：

.. code-block:: text

   nums[index] >= target

在有序数组中，这个条件沿下标方向必然呈现：

.. code-block:: text

   false, false, ..., false, true, true, ..., true

第一个成立的位置就是 ``lowerBound(target)``，即第一个不小于目标的下标。若该位置的值确实等于目标，它就是重复
段左端；若越过数组或值大于目标，则数组中不存在目标。

右边界之后的位置使用条件：

.. code-block:: text

   nums[index] > target

第一个成立的位置是 ``upperBound(target)``，即第一个严格大于目标的下标。记它为 ``afterLast``，那么重复段右端
就是 ``afterLast - 1``。

直接实现“严格大于”比搜索 ``target + 1`` 更准确地表达语义，也不依赖整数加一，因此即使目标扩展到整数上界也
不会产生溢出风险。

半开区间不变量
~~~~~~~~~~~~~~

``lowerBound`` 与 ``upperBound`` 都在半开区间 ``[low, high)`` 中搜索，并允许答案等于 ``nums.size()``。

对 ``lowerBound``，循环始终保持：

* ``[0, low)`` 中的值都严格小于 ``target``，不可能是答案；
* ``[high, n)`` 中的位置都满足值不小于 ``target``；
* 第一个满足条件的位置仍位于 ``[low, high]``。

若 ``nums[mid] < target``，中点及其左侧都不满足条件，令 ``low = mid + 1``。否则中点可能就是第一个满足位置，
不能丢弃它，令 ``high = mid``。当 ``low == high`` 时，唯一候选就是边界。

``upperBound`` 使用完全相同的区间结构，只把“不满足条件”的范围改为 ``nums[mid] <= target``。因此相等元素会被
整体排除到左侧，最终停在重复段之后。

状态演化
~~~~~~~~

对 ``nums = [1, 2, 2, 2, 2, 5, 8]``、``target = 2``：

.. list-table::
   :header-rows: 1

   * - 搜索
     - ``low``
     - ``mid``
     - ``high``
     - 中点值
     - 更新
   * - ``lowerBound``
     - 0
     - 3
     - 7
     - 2
     - ``high = 3``
   * - ``lowerBound``
     - 0
     - 1
     - 3
     - 2
     - ``high = 1``
   * - ``lowerBound``
     - 0
     - 0
     - 1
     - 1
     - ``low = 1``，得到 ``first = 1``
   * - ``upperBound``
     - 0
     - 3
     - 7
     - 2
     - ``low = 4``
   * - ``upperBound``
     - 4
     - 5
     - 7
     - 5
     - ``high = 5``
   * - ``upperBound``
     - 4
     - 4
     - 5
     - 2
     - ``low = 5``，得到 ``afterLast = 5``

最终区间为 ``[first, afterLast - 1] = [1, 4]``。

为什么两个边界足以确定全部目标
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

非递减顺序保证所有小于目标的元素位于重复段之前，所有大于目标的元素位于重复段之后。因此目标若存在，数组必然可
分成三段：

.. code-block:: text

   小于 target | 等于 target | 大于 target

``lowerBound`` 定位第二段起点，``upperBound`` 定位第三段起点。两次搜索之间的区间全部等于目标，不需要再检查
其中任何元素。

代码演进
~~~~~~~~

``linearScan`` 逐个读取元素并直接维护首尾位置，正确但没有利用“边界条件具有单调性”。

``binaryThenExpand`` 用普通二分删除了寻找任意目标位置的线性工作，但向两侧扩展仍会逐个穿过重复段。它揭示出：
普通二分的“命中即停止”语义太弱，必须让二分本身继续逼近边界。

``boundaryBinarySearch`` 分别搜索第一个 ``>= target`` 与第一个 ``> target`` 的位置，删除了命中后的线性扩展。
公开入口采用该方法，两次搜索都只保留一个可能包含边界的半区。

复杂度分析
~~~~~~~~~~

``linearScan`` 的时间复杂度为 ``O(n)``。``binaryThenExpand`` 先用 ``O(log n)`` 找到一个目标，再用 ``O(r)``
穿过长度为 ``r`` 的重复段，最坏仍为 ``O(n)``。

边界方法执行两次二分，每次把搜索区间至少缩小一半，时间复杂度为 ``O(log n)``；只使用固定数量的下标变量，
额外空间为 ``O(1)``。返回结果不计入工作空间。
