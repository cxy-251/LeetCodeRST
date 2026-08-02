0004. Median of Two Sorted Arrays
=================================

题目信息
--------

:题号: 0004
:难度: Hard
:主题: 数组、二分查找、分割、边界哨兵
:原题: `LeetCode 0004 <https://leetcode.com/problems/median-of-two-sorted-arrays/>`_
:重点: 两个有序数组、合并序列中位位置、奇偶总长度、对数时间要求

题目重述
--------

给定两个分别按非递减顺序排列的整数数组 ``nums1`` 和 ``nums2``，返回把两者所有元素合并并保持有序后得到的中位数。

设两数组长度分别为 ``m`` 和 ``n``。``m``、``n`` 均位于 ``[0, 1000]``，总长度满足 ``1 <= m + n <= 2000``，因此其中一个数组可以为空，但两个数组不能同时为空；数组元素位于 ``[-10^6, 10^6]``。要求算法的时间复杂度为 ``O(log(m + n))``。

总长度为奇数时，中位数是合并序列正中间的元素；总长度为偶数时，中位数是中间两个元素的平均值。

自建示例
--------

偶数总长度：

.. code-block:: text

   输入：nums1 = [1, 2, 8], nums2 = [3, 4, 5, 6, 7]
   输出：4.5
   解释：合并序列为 [1, 2, 3, 4, 5, 6, 7, 8]，中间两个元素是 4 和 5，平均值为 4.5。

一侧为空：

.. code-block:: text

   输入：nums1 = [], nums2 = [2, 4, 6, 8]
   输出：5.0
   解释：合并序列就是 [2, 4, 6, 8]，中间两个元素 4 和 6 的平均值为 5.0。

奇数总长度：

.. code-block:: text

   输入：nums1 = [1, 4], nums2 = [2, 3, 8]
   输出：3.0
   解释：合并序列为 [1, 2, 3, 4, 8]，正中间的元素是 3。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <limits>
   #include <vector>

   class Solution {
   private:
       double mergeAll(
           const std::vector<int>& nums1,
           const std::vector<int>& nums2
       ) {
           std::vector<int> merged;
           merged.reserve(nums1.size() + nums2.size());

           std::size_t i = 0;
           std::size_t j = 0;

           while (i < nums1.size() || j < nums2.size()) {
               if (j == nums2.size() ||
                   (i < nums1.size() && nums1[i] <= nums2[j])) {
                   merged.push_back(nums1[i++]);
               } else {
                   merged.push_back(nums2[j++]);
               }
           }

           const std::size_t total = merged.size();
           const std::size_t middle = total / 2;

           if (total % 2 == 1) {
               return merged[middle];
           }

           return (
               static_cast<double>(merged[middle - 1]) +
               static_cast<double>(merged[middle])
           ) / 2.0;
       }

       double walkToMiddle(
           const std::vector<int>& nums1,
           const std::vector<int>& nums2
       ) {
           const int total =
               static_cast<int>(nums1.size() + nums2.size());
           const int middle = total / 2;

           int i = 0;
           int j = 0;
           int previous = 0;
           int current = 0;

           for (int step = 0; step <= middle; ++step) {
               previous = current;

               if (j == static_cast<int>(nums2.size()) ||
                   (i < static_cast<int>(nums1.size()) &&
                    nums1[i] <= nums2[j])) {
                   current = nums1[i++];
               } else {
                   current = nums2[j++];
               }
           }

           if (total % 2 == 1) {
               return current;
           }

           return (
               static_cast<double>(previous) +
               static_cast<double>(current)
           ) / 2.0;
       }

       double binaryPartition(
           const std::vector<int>& nums1,
           const std::vector<int>& nums2
       ) {
           if (nums1.size() > nums2.size()) {
               return binaryPartition(nums2, nums1);
           }

           const int m = static_cast<int>(nums1.size());
           const int n = static_cast<int>(nums2.size());
           const int left_count = (m + n + 1) / 2;

           int low = 0;
           int high = m;

           while (low <= high) {
               const int i = low + (high - low) / 2;
               const int j = left_count - i;

               const long long a_left = i == 0
                   ? std::numeric_limits<long long>::min()
                   : nums1[i - 1];
               const long long a_right = i == m
                   ? std::numeric_limits<long long>::max()
                   : nums1[i];
               const long long b_left = j == 0
                   ? std::numeric_limits<long long>::min()
                   : nums2[j - 1];
               const long long b_right = j == n
                   ? std::numeric_limits<long long>::max()
                   : nums2[j];

               if (a_left <= b_right && b_left <= a_right) {
                   const long long left_max =
                       std::max(a_left, b_left);

                   if ((m + n) % 2 == 1) {
                       return static_cast<double>(left_max);
                   }

                   const long long right_min =
                       std::min(a_right, b_right);

                   return (
                       static_cast<double>(left_max) +
                       static_cast<double>(right_min)
                   ) / 2.0;
               }

               if (a_left > b_right) {
                   high = i - 1;  // nums1 左侧取多了，减小分割数量
               } else {
                   low = i + 1;   // nums1 左侧取少了，增大分割数量
               }
           }

           return 0.0;
       }

   public:
       double findMedianSortedArrays(
           std::vector<int>& nums1,
           std::vector<int>& nums2
       ) {
           return binaryPartition(nums1, nums2);
       }
   };

题解
----

从完整合并开始确定中位位置
~~~~~~~~~~~~~~~~~~~~~~~~~~

两个数组各自有序，因此可以像归并排序一样得到完整合并序列。设总长度为 ``total``：

* 奇数长度时，中位位置是 ``total / 2``；
* 偶数长度时，中间两个位置是 ``total / 2 - 1`` 和 ``total / 2``。

``mergeAll`` 完整物化合并数组，直接按照上述位置取值。这种方法最容易验证，但需要访问所有元素，
并额外保存 ``m + n`` 个结果。

``walkToMiddle`` 进一步观察到，中位数只依赖合并序列前半段。它继续执行归并选择，但只走到
``total / 2``，并保存最近取出的 ``previous`` 和 ``current``。它把工作空间降为常数，时间仍然是
线性数量级，没有利用“两个输入都已经有序”来缩小搜索次数。

从中间位置转换为左右分割
~~~~~~~~~~~~~~~~~~~~~~~~

对数解法不再逐个生成合并序列，而是在两个数组中各选一个分割位置：

.. code-block:: text

   nums1: [左侧 i 个元素 | 右侧 m-i 个元素]
   nums2: [左侧 j 个元素 | 右侧 n-j 个元素]

把两个数组左侧合在一起，要求它包含中位数左边的全部元素。统一令左侧目标数量为：

.. math::

   left\_count = \left\lfloor\frac{m+n+1}{2}\right\rfloor

``+1`` 让奇数总长度时左侧比右侧多一个元素，偶数总长度时两侧数量相同。选择 ``nums1`` 左侧
包含 ``i`` 个元素后，``nums2`` 左侧数量不再独立，而是：

.. math::

   j = left\_count - i

因此只需要搜索一个变量 ``i``。每个 ``i`` 都唯一对应一个 ``j``，并且左侧元素总数始终正确。

为什么始终在较短数组上二分
~~~~~~~~~~~~~~~~~~~~~~~~~~

令 ``m <= n``，并在 ``nums1`` 上搜索 ``i in [0, m]``。此时：

.. math::

   0 \le left\_count - m \le j \le left\_count \le n

所以任意候选 ``i`` 都能得到合法的 ``j in [0, n]``。二分过程中可以直接访问两个分割位置附近
的值，不需要为 ``j`` 额外裁剪范围。

若在较长数组上任意选择分割数量，配对得到的 ``j`` 可能小于 0 或大于较短数组长度，二分边界和
数组访问都需要额外处理。搜索较短数组同时把候选数量压缩到 ``m + 1``，最终复杂度取决于
``min(m, n)``。

四个边界值如何代表整个分割
~~~~~~~~~~~~~~~~~~~~~~~~~~

对于候选 ``i``、``j``，只需读取分割线附近四个值：

.. code-block:: text

   a_left  = nums1 左侧最大值
   a_right = nums1 右侧最小值
   b_left  = nums2 左侧最大值
   b_right = nums2 右侧最小值

数组内部已经有序，因此 ``a_left <= a_right``、``b_left <= b_right`` 天然成立。要让合并后的
整个左侧不大于整个右侧，只剩两个跨数组条件：

.. code-block:: text

   a_left <= b_right
   b_left <= a_right

两者同时成立时，左侧最大值是 ``max(a_left, b_left)``，右侧最小值是
``min(a_right, b_right)``。无需知道左右两侧内部的完整排列。

分割位于数组端点时，对应一侧没有真实边界值：

* 左侧为空时，把左边界视为负无穷；
* 右侧为空时，把右边界视为正无穷。

哨兵只参与比较，不属于输入，也不会被当成中位数返回。C++ 使用 ``long long`` 的极值作为哨兵，
真实数组元素先提升到同一类型，偶数结果再转换为 ``double`` 后求和，避免整数加法溢出。

二分分割状态演化
~~~~~~~~~~~~~~~~

使用 ``nums1 = [1, 2, 8]``、``nums2 = [3, 4, 5, 6, 7]``。总长度为 8，
``left_count = 4``：

.. list-table::
   :header-rows: 1

   * - ``low``
     - ``high``
     - ``i``
     - ``j``
     - ``a_left``
     - ``a_right``
     - ``b_left``
     - ``b_right``
     - 判断
   * - 0
     - 3
     - 1
     - 3
     - 1
     - 2
     - 5
     - 6
     - ``b_left > a_right``，``i`` 太小
   * - 2
     - 3
     - 2
     - 2
     - 2
     - 8
     - 4
     - 5
     - 两个交叉条件成立

合法分割的左侧是 ``[1, 2]`` 与 ``[3, 4]``，右侧是 ``[8]`` 与 ``[5, 6, 7]``。
左侧最大值为 4，右侧最小值为 5，总长度为偶数，因此中位数为 ``(4 + 5) / 2 = 4.5``。

解法对比与主解法选择
~~~~~~~~~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 核心操作
   * - 完整合并
     - ``O(m + n)``
     - ``O(m + n)``
     - 物化全部合并序列
   * - 双指针走到中间
     - ``O(m + n)``
     - ``O(1)``
     - 只生成中位位置之前的元素
   * - 较短数组二分分割
     - ``O(log min(m, n))``
     - ``O(1)``
     - 搜索满足交叉边界条件的分割数量

本文 C++ 主解法采用二分分割。它满足题目要求的对数复杂度，并且只读取输入数组和分割线附近的常数个值。

为什么两个交叉条件足以保证分割合法
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

分割已经保证左侧元素数量为 ``left_count``。对于 ``nums1``，左侧每个元素都不大于
``a_left``，右侧每个元素都不小于 ``a_right``；``nums2`` 同理。

当 ``a_left <= b_right`` 且 ``b_left <= a_right`` 时：

* ``nums1`` 左侧所有元素不大于 ``a_left``，进而不大于 ``b_right`` 以及 ``nums2`` 右侧所有元素；
* ``nums2`` 左侧所有元素不大于 ``b_left``，进而不大于 ``a_right`` 以及 ``nums1`` 右侧所有元素；
* 两个数组各自内部的左右顺序已经由原数组有序性保证。

因此左侧任意元素都不大于右侧任意元素，这个分割正好对应合并序列的前 ``left_count`` 个元素。

为什么二分方向不会丢失合法分割
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若 ``a_left > b_right``，说明 ``nums1`` 左侧放入了一个过大的边界值，而 ``nums2`` 右侧仍有更小
元素。任何更大的 ``i`` 都会让 ``a_left`` 保持或增大，同时让 ``j`` 减小、``b_right`` 保持或
减小，冲突不会消失。因此当前 ``i`` 及其右侧候选都可以排除，令 ``high = i - 1``。

另一种不合法情况必然是 ``b_left > a_right``。此时 ``nums1`` 左侧取少了；任何更小的 ``i``
都会让 ``a_right`` 保持或减小，同时让 ``j`` 增大、``b_left`` 保持或增大，冲突同样不会消失。
因此排除当前 ``i`` 及其左侧候选，令 ``low = i + 1``。

两个判断方向都来自有序数组边界随分割移动的单调变化，所以二分不会跨过合法分割。

为什么奇偶总长度只需要四个边界
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

合法分割后，左侧已经包含合并序列前 ``left_count`` 个元素，并且左侧整体不大于右侧。

总长度为奇数时，左侧比右侧多一个元素。中间位置就是左侧最后一个元素，即：

.. math::

   \max(a\_left, b\_left)

总长度为偶数时，两侧数量相同，中间两个元素分别是左侧最大值和右侧最小值，中位数为：

.. math::

   \frac{\max(a\_left,b\_left)+\min(a\_right,b\_right)}{2}

所以合法分割一旦找到，完整合并序列的其他元素都不再影响答案。

复杂度来源
~~~~~~~~~~

``mergeAll`` 的两个指针合计访问 ``m + n`` 个元素，并保存同样数量的合并结果，时间和工作空间
均为 ``O(m + n)``。

``walkToMiddle`` 最多取出 ``floor((m+n)/2) + 1`` 个元素，渐进时间仍为 ``O(m + n)``；只保存
两个数组下标和最近两个值，工作空间为 ``O(1)``。

``binaryPartition`` 在长度为 ``min(m, n)`` 的数组上搜索 ``min(m, n) + 1`` 个分割数量。每轮
只计算 ``i``、``j``、四个边界值并更新一次二分区间，因此时间复杂度为
``O(log min(m, n))``，工作空间为 ``O(1)``。

九语言实现
----------

九语言均先把较短数组作为 ``a``，再对 ``i in [0, length(a)]`` 做闭区间二分。``i``、``j``
表示左侧元素数量；Julia 与 R 在访问数组时转换为一基下标。

C
~

.. code-block:: c

   #include <limits.h>

   double findMedianSortedArrays(
       int* nums1,
       int nums1Size,
       int* nums2,
       int nums2Size
   ) {
       if (nums1Size > nums2Size) {
           return findMedianSortedArrays(
               nums2,
               nums2Size,
               nums1,
               nums1Size
           );
       }

       const int left_count = (nums1Size + nums2Size + 1) / 2;
       int low = 0;
       int high = nums1Size;

       while (low <= high) {
           const int i = low + (high - low) / 2;
           const int j = left_count - i;

           const long long a_left =
               i == 0 ? LLONG_MIN : nums1[i - 1];
           const long long a_right =
               i == nums1Size ? LLONG_MAX : nums1[i];
           const long long b_left =
               j == 0 ? LLONG_MIN : nums2[j - 1];
           const long long b_right =
               j == nums2Size ? LLONG_MAX : nums2[j];

           if (a_left <= b_right && b_left <= a_right) {
               const long long left_max =
                   a_left > b_left ? a_left : b_left;

               if ((nums1Size + nums2Size) % 2 == 1) {
                   return (double)left_max;
               }

               const long long right_min =
                   a_right < b_right ? a_right : b_right;

               return (
                   (double)left_max +
                   (double)right_min
               ) / 2.0;
           }

           if (a_left > b_right) {
               high = i - 1;  // nums1 左侧取多了
           } else {
               low = i + 1;   // nums1 左侧取少了
           }
       }

       return 0.0;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def findMedianSortedArrays(
           self,
           nums1: list[int],
           nums2: list[int],
       ) -> float:
           if len(nums1) > len(nums2):
               nums1, nums2 = nums2, nums1

           m, n = len(nums1), len(nums2)
           left_count = (m + n + 1) // 2
           low, high = 0, m

           while low <= high:
               i = low + (high - low) // 2
               j = left_count - i

               a_left = float("-inf") if i == 0 else nums1[i - 1]
               a_right = float("inf") if i == m else nums1[i]
               b_left = float("-inf") if j == 0 else nums2[j - 1]
               b_right = float("inf") if j == n else nums2[j]

               if a_left <= b_right and b_left <= a_right:
                   left_max = max(a_left, b_left)
                   if (m + n) % 2 == 1:
                       return float(left_max)

                   right_min = min(a_right, b_right)
                   return (left_max + right_min) / 2.0

               if a_left > b_right:
                   high = i - 1  # nums1 左侧取多了
               else:
                   low = i + 1   # nums1 左侧取少了

           raise ValueError("输入数组不满足题目条件")

Java
~~~~

.. code-block:: java

   class Solution {
       public double findMedianSortedArrays(int[] nums1, int[] nums2) {
           if (nums1.length > nums2.length) {
               return findMedianSortedArrays(nums2, nums1);
           }

           int m = nums1.length;
           int n = nums2.length;
           int leftCount = (m + n + 1) / 2;
           int low = 0;
           int high = m;

           while (low <= high) {
               int i = low + (high - low) / 2;
               int j = leftCount - i;

               long aLeft = i == 0 ? Long.MIN_VALUE : nums1[i - 1];
               long aRight = i == m ? Long.MAX_VALUE : nums1[i];
               long bLeft = j == 0 ? Long.MIN_VALUE : nums2[j - 1];
               long bRight = j == n ? Long.MAX_VALUE : nums2[j];

               if (aLeft <= bRight && bLeft <= aRight) {
                   long leftMax = Math.max(aLeft, bLeft);
                   if ((m + n) % 2 == 1) {
                       return (double) leftMax;
                   }

                   long rightMin = Math.min(aRight, bRight);
                   return (
                       (double) leftMax +
                       (double) rightMin
                   ) / 2.0;
               }

               if (aLeft > bRight) {
                   high = i - 1;  // nums1 左侧取多了
               } else {
                   low = i + 1;   // nums1 左侧取少了
               }
           }

           throw new IllegalArgumentException("输入数组不满足题目条件");
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn find_median_sorted_arrays(
           nums1: Vec<i32>,
           nums2: Vec<i32>,
       ) -> f64 {
           let (a, b) = if nums1.len() <= nums2.len() {
               (nums1, nums2)
           } else {
               (nums2, nums1)
           };

           let m = a.len();
           let n = b.len();
           let left_count = (m + n + 1) / 2;
           let mut low = 0usize;
           let mut high = m;

           while low <= high {
               let i = low + (high - low) / 2;
               let j = left_count - i;

               let a_left = if i == 0 {
                   i64::MIN
               } else {
                   a[i - 1] as i64
               };
               let a_right = if i == m {
                   i64::MAX
               } else {
                   a[i] as i64
               };
               let b_left = if j == 0 {
                   i64::MIN
               } else {
                   b[j - 1] as i64
               };
               let b_right = if j == n {
                   i64::MAX
               } else {
                   b[j] as i64
               };

               if a_left <= b_right && b_left <= a_right {
                   let left_max = a_left.max(b_left);
                   if (m + n) % 2 == 1 {
                       return left_max as f64;
                   }

                   let right_min = a_right.min(b_right);
                   return (
                       left_max as f64 +
                       right_min as f64
                   ) / 2.0;
               }

               if a_left > b_right {
                   high = i - 1;  // i 为 0 时不会进入该分支
               } else {
                   low = i + 1;
               }
           }

           unreachable!("题目保证存在合法分割")
       }
   }

Go
~~

.. code-block:: go

   func findMedianSortedArrays(nums1 []int, nums2 []int) float64 {
       if len(nums1) > len(nums2) {
           return findMedianSortedArrays(nums2, nums1)
       }

       m, n := len(nums1), len(nums2)
       leftCount := (m + n + 1) / 2
       low, high := 0, m
       maxInt := int(^uint(0) >> 1)
       minInt := -maxInt - 1

       for low <= high {
           i := low + (high-low)/2
           j := leftCount - i

           aLeft, aRight := minInt, maxInt
           bLeft, bRight := minInt, maxInt

           if i > 0 {
               aLeft = nums1[i-1]
           }
           if i < m {
               aRight = nums1[i]
           }
           if j > 0 {
               bLeft = nums2[j-1]
           }
           if j < n {
               bRight = nums2[j]
           }

           if aLeft <= bRight && bLeft <= aRight {
               leftMax := aLeft
               if bLeft > leftMax {
                   leftMax = bLeft
               }

               if (m+n)%2 == 1 {
                   return float64(leftMax)
               }

               rightMin := aRight
               if bRight < rightMin {
                   rightMin = bRight
               }

               return (
                   float64(leftMax) +
                   float64(rightMin)
               ) / 2.0
           }

           if aLeft > bRight {
               high = i - 1 // nums1 左侧取多了
           } else {
               low = i + 1 // nums1 左侧取少了
           }
       }

       panic("输入数组不满足题目条件")
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function findMedianSortedArrays(
       nums1: number[],
       nums2: number[],
   ): number {
       if (nums1.length > nums2.length) {
           return findMedianSortedArrays(nums2, nums1);
       }

       const m = nums1.length;
       const n = nums2.length;
       const leftCount = Math.floor((m + n + 1) / 2);
       let low = 0;
       let high = m;

       while (low <= high) {
           const i = Math.floor(low + (high - low) / 2);
           const j = leftCount - i;

           const aLeft = i === 0 ? -Infinity : nums1[i - 1];
           const aRight = i === m ? Infinity : nums1[i];
           const bLeft = j === 0 ? -Infinity : nums2[j - 1];
           const bRight = j === n ? Infinity : nums2[j];

           if (aLeft <= bRight && bLeft <= aRight) {
               const leftMax = Math.max(aLeft, bLeft);
               if ((m + n) % 2 === 1) {
                   return leftMax;
               }

               const rightMin = Math.min(aRight, bRight);
               return (leftMax + rightMin) / 2;
           }

           if (aLeft > bRight) {
               high = i - 1; // nums1 左侧取多了
           } else {
               low = i + 1; // nums1 左侧取少了
           }
       }

       throw new Error("输入数组不满足题目条件");
   }

C#
~~

.. code-block:: csharp

   using System;

   public class Solution {
       public double FindMedianSortedArrays(int[] nums1, int[] nums2) {
           if (nums1.Length > nums2.Length) {
               return FindMedianSortedArrays(nums2, nums1);
           }

           int m = nums1.Length;
           int n = nums2.Length;
           int leftCount = (m + n + 1) / 2;
           int low = 0;
           int high = m;

           while (low <= high) {
               int i = low + (high - low) / 2;
               int j = leftCount - i;

               long aLeft = i == 0 ? long.MinValue : nums1[i - 1];
               long aRight = i == m ? long.MaxValue : nums1[i];
               long bLeft = j == 0 ? long.MinValue : nums2[j - 1];
               long bRight = j == n ? long.MaxValue : nums2[j];

               if (aLeft <= bRight && bLeft <= aRight) {
                   long leftMax = Math.Max(aLeft, bLeft);
                   if ((m + n) % 2 == 1) {
                       return leftMax;
                   }

                   long rightMin = Math.Min(aRight, bRight);
                   return (
                       (double)leftMax +
                       (double)rightMin
                   ) / 2.0;
               }

               if (aLeft > bRight) {
                   high = i - 1; // nums1 左侧取多了
               } else {
                   low = i + 1; // nums1 左侧取少了
               }
           }

           throw new ArgumentException("输入数组不满足题目条件");
       }
   }

Julia
~~~~~

.. code-block:: julia

   function find_median_sorted_arrays(
       nums1::Vector{Int},
       nums2::Vector{Int},
   )::Float64
       a, b = length(nums1) <= length(nums2)
           ? (nums1, nums2)
           : (nums2, nums1)

       m, n = length(a), length(b)
       left_count = (m + n + 1) ÷ 2
       low, high = 0, m

       while low <= high
           i = low + (high - low) ÷ 2
           j = left_count - i

           # i、j 是数量；访问数组时转换为一基下标。
           a_left = i == 0 ? typemin(Int) : a[i]
           a_right = i == m ? typemax(Int) : a[i + 1]
           b_left = j == 0 ? typemin(Int) : b[j]
           b_right = j == n ? typemax(Int) : b[j + 1]

           if a_left <= b_right && b_left <= a_right
               left_max = max(a_left, b_left)
               if isodd(m + n)
                   return Float64(left_max)
               end

               right_min = min(a_right, b_right)
               return (
                   Float64(left_max) +
                   Float64(right_min)
               ) / 2
           end

           if a_left > b_right
               high = i - 1 # nums1 左侧取多了
           else
               low = i + 1 # nums1 左侧取少了
           end
       end

       error("输入数组不满足题目条件")
   end

R
~

.. code-block:: r

   find_median_sorted_arrays <- function(nums1, nums2) {
       if (length(nums1) > length(nums2)) {
           return(find_median_sorted_arrays(nums2, nums1))
       }

       m <- length(nums1)
       n <- length(nums2)
       left_count <- (m + n + 1L) %/% 2L
       low <- 0L
       high <- m

       while (low <= high) {
           i <- low + (high - low) %/% 2L
           j <- left_count - i

           # i、j 是数量；访问向量时转换为一基下标。
           a_left <- if (i == 0L) -Inf else nums1[[i]]
           a_right <- if (i == m) Inf else nums1[[i + 1L]]
           b_left <- if (j == 0L) -Inf else nums2[[j]]
           b_right <- if (j == n) Inf else nums2[[j + 1L]]

           if (a_left <= b_right && b_left <= a_right) {
               left_max <- max(a_left, b_left)
               if ((m + n) %% 2L == 1L) {
                   return(as.numeric(left_max))
               }

               right_min <- min(a_right, b_right)
               return((left_max + right_min) / 2)
           }

           if (a_left > b_right) {
               high <- i - 1L # nums1 左侧取多了
           } else {
               low <- i + 1L # nums1 左侧取少了
           }
       }

       stop("输入数组不满足题目条件")
   }
