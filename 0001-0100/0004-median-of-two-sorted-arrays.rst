0004. Median of Two Sorted Arrays
=================================

题目信息
--------

:题号: 0004
:难度: Hard
:主题: 数组、二分查找、分割、边界哨兵
:原题: `LeetCode 0004 <https://leetcode.com/problems/median-of-two-sorted-arrays/>`_
:重点: 从归并两个有序数组，推导到搜索左右两部分的合法分割，并把线性扫描降为较短数组上的二分查找

题目重述
--------

给定两个分别按非递减顺序排列的整数数组 ``nums1`` 和 ``nums2``，需要返回把两者全部元素合并并保持有序后得到的中位数。

设两数组长度分别为 ``m`` 和 ``n``。其中一个数组可以为空，但两者不能同时为空。总长度为奇数时，中位数是合并序列正中间的元素；总长度为偶数时，中位数是中间两个元素的平均值。题目要求算法达到 ``O(log(m + n))`` 时间复杂度。

约束条件：

* ``0 <= m, n <= 1000``；
* ``1 <= m + n <= 2000``；
* ``-10^6 <= nums1[i], nums2[i] <= 10^6``。

自建示例
--------

* 奇数总长度：``nums1 = [1, 4]``、``nums2 = [2, 3, 8]``，合并后为 ``[1, 2, 3, 4, 8]``，返回 ``3.0``；
* 偶数总长度：``nums1 = [1, 2, 8]``、``nums2 = [3, 4, 5, 6, 7]``，中间两个数为 ``4`` 和 ``5``，返回 ``4.5``；
* 一侧为空：``nums1 = []``、``nums2 = [2, 4, 6, 8]``，返回 ``5.0``；
* 大小关系交错：``nums1 = [1, 10]``、``nums2 = [2, 3, 4, 5, 6]``，合法分割不能只按数组长度平均切开，返回 ``4.0``；
* 含重复值：``nums1 = [1, 2, 2]``、``nums2 = [2, 2, 3]``，返回 ``2.0``。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <limits>
   #include <vector>

   class Solution {
   private:
       double mergeAll(const std::vector<int>& nums1, const std::vector<int>& nums2) {
           std::vector<int> merged;
           merged.reserve(nums1.size() + nums2.size());
           int i = 0;
           int j = 0;
           while (i < static_cast<int>(nums1.size()) || j < static_cast<int>(nums2.size())) {
               if (j == static_cast<int>(nums2.size()) ||
                   (i < static_cast<int>(nums1.size()) && nums1[i] <= nums2[j])) {
                   merged.push_back(nums1[i++]);
               } else {
                   merged.push_back(nums2[j++]);
               }
           }
           const int total = static_cast<int>(merged.size());
           const int middle = total / 2;
           if (total % 2 == 1) {
               return merged[middle];
           }
           return (static_cast<double>(merged[middle - 1]) + static_cast<double>(merged[middle])) / 2.0;
       }

       double walkToMiddle(const std::vector<int>& nums1, const std::vector<int>& nums2) {
           const int total = static_cast<int>(nums1.size() + nums2.size());
           const int middle = total / 2;
           int i = 0;
           int j = 0;
           int previous = 0;
           int current = 0;
           for (int step = 0; step <= middle; ++step) {
               previous = current;
               if (j == static_cast<int>(nums2.size()) ||
                   (i < static_cast<int>(nums1.size()) && nums1[i] <= nums2[j])) {
                   current = nums1[i++];
               } else {
                   current = nums2[j++];
               }
           }
           if (total % 2 == 1) {
               return current;
           }
           return (static_cast<double>(previous) + static_cast<double>(current)) / 2.0;
       }

       double binaryPartition(const std::vector<int>& nums1, const std::vector<int>& nums2) {
           if (nums1.size() > nums2.size()) {
               return binaryPartition(nums2, nums1);
           }
           const int m = static_cast<int>(nums1.size());
           const int n = static_cast<int>(nums2.size());
           const int leftSize = (m + n + 1) / 2;
           int low = 0;
           int high = m;
           while (low <= high) {
               const int cut1 = low + (high - low) / 2;
               const int cut2 = leftSize - cut1;
               const long long left1 = cut1 == 0 ? std::numeric_limits<long long>::lowest() : nums1[cut1 - 1];
               const long long right1 = cut1 == m ? std::numeric_limits<long long>::max() : nums1[cut1];
               const long long left2 = cut2 == 0 ? std::numeric_limits<long long>::lowest() : nums2[cut2 - 1];
               const long long right2 = cut2 == n ? std::numeric_limits<long long>::max() : nums2[cut2];
               if (left1 <= right2 && left2 <= right1) {
                   const long long leftMax = std::max(left1, left2);
                   if ((m + n) % 2 == 1) {
                       return static_cast<double>(leftMax);
                   }
                   const long long rightMin = std::min(right1, right2);
                   return (static_cast<double>(leftMax) + static_cast<double>(rightMin)) / 2.0;
               }
               if (left1 > right2) {
                   high = cut1 - 1;
               } else {
                   low = cut1 + 1;
               }
           }
           return 0.0;
       }

   public:
       double findMedianSortedArrays(std::vector<int>& nums1, std::vector<int>& nums2) {
           return binaryPartition(nums1, nums2);
       }
   };

题解
----

完整归并
~~~~~~~~

两个输入数组各自有序，最直接的方法是按照归并排序的合并阶段，从两个数组头部反复取出较小元素，构造完整有序数组。

设合并后的总长度为 ``total``。若 ``total`` 为奇数，中位数位于下标 ``total / 2``；若为偶数，中间位置为 ``total / 2 - 1`` 和 ``total / 2``。

``mergeAll`` 把全部元素写入 ``merged`` 后直接读取这些位置。它清楚地复现了中位数定义，问题在于无论中位数多早能够确定，仍会访问并保存全部 ``m + n`` 个元素。

中位位置截断
~~~~~~~~~~~~

中位数只依赖合并序列的前半部分。继续沿用双指针归并时，不必构造完整数组，只需取出到下标 ``total / 2`` 为止。

``walkToMiddle`` 使用 ``previous`` 和 ``current`` 保存最近取出的两个值。总长度为奇数时，``current`` 就是中位数；总长度为偶数时，答案是 ``previous`` 与 ``current`` 的平均值。

这一步删除了 ``merged`` 数组，把工作空间从 ``O(m + n)`` 降为 ``O(1)``。时间仍为线性，因为算法依旧逐个生成中位位置之前的元素，没有把两个数组的有序性转化为可二分的搜索条件。

分割模型
~~~~~~~~

要跳过大量元素，需要从“生成合并序列”改为“直接确定中位数两侧的边界”。在两个数组中分别选择分割位置 ``cut1`` 和 ``cut2``：

.. code-block:: text

   nums1: 左侧 cut1 个元素 | 右侧剩余元素
   nums2: 左侧 cut2 个元素 | 右侧剩余元素

令合并后左侧元素数量为 ``leftSize = (m + n + 1) / 2``，于是 ``cut2 = leftSize - cut1``。只要搜索 ``cut1``，另一条分割线就被唯一确定。

公式中的 ``+1`` 统一了奇偶情况：总长度为偶数时左右数量相同；总长度为奇数时左侧比右侧多一个元素，中位数就落在左侧最大值上。

合法分割
~~~~~~~~

每个数组内部已经有序，所以只需观察分割线附近四个值：

.. code-block:: text

   left1  = nums1 左侧最大值
   right1 = nums1 右侧最小值
   left2  = nums2 左侧最大值
   right2 = nums2 右侧最小值

左侧全部元素都不大于右侧全部元素，当且仅当两个跨数组条件同时成立：``left1 <= right2`` 且 ``left2 <= right1``。

条件成立后，合并左侧最大值为 ``max(left1, left2)``，合并右侧最小值为 ``min(right1, right2)``。奇数总长度直接返回左侧最大值；偶数总长度返回左右两个边界值的平均数。算法不需要知道左右两部分内部的完整排列。

分割线位于数组端点时，某一侧可能没有真实元素。代码把空左侧边界视为负无穷，把空右侧边界视为正无穷，使端点候选仍能使用同一组比较条件。一侧数组为空的情况也因此自然包含在主循环中。

较短数组二分
~~~~~~~~~~~~

主解法始终在较短数组上搜索 ``cut1``。设其长度为 ``m``，另一数组长度为 ``n``，并保证 ``m <= n``。此时 ``cut1`` 在 ``[0, m]`` 中变化时，由 ``cut2 = leftSize - cut1`` 得到的分割位置始终位于 ``[0, n]``，无需额外裁剪第二个数组的边界。

若 ``left1 > right2``，说明 ``nums1`` 左侧取入的元素过多，分割线必须左移，因此令 ``high = cut1 - 1``。

剩余的不合法情况只能是 ``left2 > right1``，说明 ``nums1`` 左侧取入的元素过少，分割线必须右移，因此令 ``low = cut1 + 1``。

有序性保证这两个方向具有单调性：``cut1`` 增大时，``left1`` 不会减小，``right1`` 不会减小，而 ``cut2`` 同时减小，``left2`` 和 ``right2`` 不会增大。因此一次比较就能排除一半候选分割位置。

状态推演
~~~~~~~~

以 ``nums1 = [1, 2, 8]``、``nums2 = [3, 4, 5, 6, 7]`` 为例，总长度为 ``8``，``leftSize = 4``：

.. list-table::
   :header-rows: 1

   * - 轮次
     - ``cut1``
     - ``cut2``
     - 左边界
     - 右边界
     - 处理
   * - 1
     - 1
     - 3
     - ``left1 = 1, left2 = 5``
     - ``right1 = 2, right2 = 6``
     - ``left2 > right1``，右移 ``cut1``
   * - 2
     - 2
     - 2
     - ``left1 = 2, left2 = 4``
     - ``right1 = 8, right2 = 5``
     - 合法分割

合法分割的左侧包含 ``[1, 2]`` 和 ``[3, 4]``，左侧最大值为 ``4``；右侧包含 ``[8]`` 和 ``[5, 6, 7]``，右侧最小值为 ``5``。总长度为偶数，所以答案为 ``(4 + 5) / 2 = 4.5``。

代码演进
~~~~~~~~

``mergeAll`` 使用双指针生成完整有序数组，代码直接对应中位数定义，但保存了最终答案不需要的后半部分。

``walkToMiddle`` 删除结果数组和后半段归并，只维护最近两个值。空间降为常数，但两个指针仍需要逐个跨过前半部分元素。

``binaryPartition`` 不再生成任何合并元素，而是把中位位置转换为左右分割数量，再通过四个边界值判断分割是否合法。双指针、逐元素选择和临时合并结果全部消失，搜索对象从 ``m + n`` 个元素变成较短数组中的 ``m + 1`` 个分割位置。

公开入口采用 ``binaryPartition``，因为它满足题目的对数时间要求，同时保持 ``O(1)`` 工作空间。

复杂度分析
~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 主要代价
   * - 完整归并
     - ``O(m + n)``
     - ``O(m + n)``
     - 生成并保存全部合并元素
   * - 中位截断
     - ``O(m + n)``
     - ``O(1)``
     - 逐个生成前半部分元素
   * - 二分分割
     - ``O(log min(m, n))``
     - ``O(1)``
     - 搜索较短数组中的合法分割位置

边界处理
~~~~~~~~

* 一侧数组为空时，负无穷和正无穷哨兵让分割条件仍然成立；
* 总长度为奇数时，左侧故意多保留一个元素，直接返回左侧最大值；
* 总长度为偶数时，先把两个中间值转换为 ``double`` 再相加，避免整数平均造成截断；
* 数组中存在重复值时，合法条件使用 ``<=``，相等元素可以分布在分割线两侧；
* 主解法只读取输入数组，不修改其内容。