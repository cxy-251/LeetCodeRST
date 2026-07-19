0004. Median of Two Sorted Arrays
=================================

题目信息
--------

:题号: 0004
:难度: Hard
:主题: 数组、二分查找、分割
:原题: `LeetCode 0004 <https://leetcode.com/problems/median-of-two-sorted-arrays/>`_
:访问状态: Available
:教学重点: 二分较短数组、分割条件、边界哨兵、奇偶长度统一处理

题目重述
--------

给定两个分别按非递减顺序排列的整数数组，需要求出它们合并后的中位数。不能真的
把两个数组完整合并；目标复杂度要求把搜索范围压缩到较短数组上。

自建示例
--------

.. code-block:: text

   输入：nums1 = [1, 4], nums2 = [2, 3, 8]
   合并顺序：[1, 2, 3, 4, 8]
   输出：3.0

问题抽象
--------

在两个数组中分别选择一个分割位置，使左半部分包含合并后前一半元素，右半部分
包含剩余元素。只要左侧所有元素都不大于右侧所有元素，分割边界附近的四个值就能
直接确定中位数。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 空间复杂度
     - 定位
   * - 较短数组上的二分分割
     - ``O(log min(m, n))``
     - ``O(1)``
     - 主解法
   * - 双指针走到中间
     - ``O(m + n)``
     - ``O(1)``
     - 对照思路
   * - 完整合并后取中位数
     - ``O(m + n)``
     - ``O(m + n)``
     - 工程直观写法

主解法：二分分割
----------------

思路
~~~~

始终让 ``a`` 指向较短数组。假设在 ``a`` 中取前 ``i`` 个元素放入左半部分，在
``b`` 中就必须取前 ``j`` 个元素，其中：

.. math::

   j = \left\lfloor\frac{m+n+1}{2}\right\rfloor - i

分割合法需要同时满足：

* ``a_left <= b_right``；
* ``b_left <= a_right``。

若 ``a_left > b_right``，说明 ``i`` 太大，需要向左缩小；否则说明 ``i`` 太小，
需要向右扩大。

分割示意
~~~~~~~~

.. mermaid::

   flowchart LR
       AL["a 左侧末尾 a_left"] --> CUT["分割线"]
       CUT --> AR["a 右侧开头 a_right"]
       BL["b 左侧末尾 b_left"] --> CUT
       CUT --> BR["b 右侧开头 b_right"]

图中只需要检查分割线附近的四个值。左右两侧数组内部已经有序，因此这两个交叉
条件成立时，整个左半部分都不会大于整个右半部分。

核心不变量
~~~~~~~~~~

二分过程中始终保持：

* ``i`` 的搜索范围位于 ``[0, m]``；
* ``j`` 由左半部分目标数量唯一确定；
* 当分割不合法时，比较结果能排除一半 ``i`` 的候选范围；
* 只在较短数组上搜索，保证 ``j`` 不越出较长数组范围。

正确性依据
~~~~~~~~~~

合法分割把合并序列划分成数量正确的左右两半。数组内部各自有序，再加上
``a_left <= b_right`` 和 ``b_left <= a_right``，可知左半部分最大值不大于右半
部分最小值。

总长度为奇数时，左半部分比右半部分多一个元素，中位数就是左侧最大值。总长度为
偶数时，中位数是左侧最大值和右侧最小值的平均值。

边界使用负无穷和正无穷作为哨兵（sentinel），使分割位于数组两端时仍使用同一组
比较规则。

复杂度
~~~~~~

设两个数组长度分别为 ``m`` 和 ``n``，并令 ``m <= n``：

* 时间复杂度：``O(log m)``；
* 辅助空间：``O(1)``。

核心语言实现
~~~~~~~~~~~~

C
^

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

       int low = 0;
       int high = nums1Size;
       const int left_count = (nums1Size + nums2Size + 1) / 2;

       while (low <= high) {
           const int i = low + (high - low) / 2;
           const int j = left_count - i;

           const int a_left = i == 0 ? INT_MIN : nums1[i - 1];
           const int a_right =
               i == nums1Size ? INT_MAX : nums1[i];
           const int b_left = j == 0 ? INT_MIN : nums2[j - 1];
           const int b_right =
               j == nums2Size ? INT_MAX : nums2[j];

           if (a_left <= b_right && b_left <= a_right) {
               const int left_max =
                   a_left > b_left ? a_left : b_left;

               if ((nums1Size + nums2Size) % 2 == 1) {
                   return (double)left_max;
               }

               const int right_min =
                   a_right < b_right ? a_right : b_right;
               // 先转换为 double，避免两个 int 相加时溢出。
               return ((double)left_max + (double)right_min) / 2.0;
           }

           if (a_left > b_right) {
               high = i - 1;
           } else {
               low = i + 1;
           }
       }

       return 0.0;
   }

C++
^^^

.. code-block:: cpp

   class Solution {
   public:
       double findMedianSortedArrays(
           std::vector<int>& nums1,
           std::vector<int>& nums2
       ) {
           if (nums1.size() > nums2.size()) {
               return findMedianSortedArrays(nums2, nums1);
           }

           int low = 0;
           int high = static_cast<int>(nums1.size());
           const int left_count =
               (nums1.size() + nums2.size() + 1) / 2;

           while (low <= high) {
               const int i = low + (high - low) / 2;
               const int j = left_count - i;

               const int a_left = i == 0
                   ? std::numeric_limits<int>::min()
                   : nums1[i - 1];
               const int a_right = i == nums1.size()
                   ? std::numeric_limits<int>::max()
                   : nums1[i];
               const int b_left = j == 0
                   ? std::numeric_limits<int>::min()
                   : nums2[j - 1];
               const int b_right = j == nums2.size()
                   ? std::numeric_limits<int>::max()
                   : nums2[j];

               if (a_left <= b_right && b_left <= a_right) {
                   const int left_max = std::max(a_left, b_left);
                   if ((nums1.size() + nums2.size()) % 2 == 1) {
                       return left_max;
                   }

                   const int right_min = std::min(a_right, b_right);
                   return (static_cast<double>(left_max) + right_min) / 2.0;
               }

               if (a_left > b_right) {
                   high = i - 1;
               } else {
                   low = i + 1;
               }
           }

           return 0.0;
       }
   };

Python
^^^^^^

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
           low, high = 0, m
           left_count = (m + n + 1) // 2

           while low <= high:
               i = (low + high) // 2
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
                   high = i - 1
               else:
                   low = i + 1

           raise ValueError("输入数组不满足题目条件")

Java
^^^^

.. code-block:: java

   class Solution {
       public double findMedianSortedArrays(int[] nums1, int[] nums2) {
           if (nums1.length > nums2.length) {
               return findMedianSortedArrays(nums2, nums1);
           }

           int low = 0;
           int high = nums1.length;
           int leftCount = (nums1.length + nums2.length + 1) / 2;

           while (low <= high) {
               int i = low + (high - low) / 2;
               int j = leftCount - i;

               int aLeft = i == 0 ? Integer.MIN_VALUE : nums1[i - 1];
               int aRight =
                   i == nums1.length ? Integer.MAX_VALUE : nums1[i];
               int bLeft = j == 0 ? Integer.MIN_VALUE : nums2[j - 1];
               int bRight =
                   j == nums2.length ? Integer.MAX_VALUE : nums2[j];

               if (aLeft <= bRight && bLeft <= aRight) {
                   int leftMax = Math.max(aLeft, bLeft);
                   if ((nums1.length + nums2.length) % 2 == 1) {
                       return leftMax;
                   }

                   int rightMin = Math.min(aRight, bRight);
                   return ((double) leftMax + rightMin) / 2.0;
               }

               if (aLeft > bRight) {
                   high = i - 1;
               } else {
                   low = i + 1;
               }
           }

           throw new IllegalArgumentException("输入数组不满足题目条件");
       }
   }

Rust
^^^^

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

           let mut low = 0usize;
           let mut high = a.len();
           let left_count = (a.len() + b.len() + 1) / 2;

           while low <= high {
               let i = low + (high - low) / 2;
               let j = left_count - i;

               let a_left = if i == 0 { i32::MIN } else { a[i - 1] };
               let a_right = if i == a.len() { i32::MAX } else { a[i] };
               let b_left = if j == 0 { i32::MIN } else { b[j - 1] };
               let b_right = if j == b.len() { i32::MAX } else { b[j] };

               if a_left <= b_right && b_left <= a_right {
                   let left_max = a_left.max(b_left);
                   if (a.len() + b.len()) % 2 == 1 {
                       return left_max as f64;
                   }

                   let right_min = a_right.min(b_right);
                   return (left_max as f64 + right_min as f64) / 2.0;
               }

               if a_left > b_right {
                   // i 为 0 时 a_left 是最小哨兵，不会进入该分支。
                   high = i - 1;
               } else {
                   low = i + 1;
               }
           }

           unreachable!("题目保证存在合法分割")
       }
   }

Go
^^

.. code-block:: go

   func findMedianSortedArrays(nums1 []int, nums2 []int) float64 {
       if len(nums1) > len(nums2) {
           return findMedianSortedArrays(nums2, nums1)
       }

       low, high := 0, len(nums1)
       leftCount := (len(nums1) + len(nums2) + 1) / 2
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
           if i < len(nums1) {
               aRight = nums1[i]
           }
           if j > 0 {
               bLeft = nums2[j-1]
           }
           if j < len(nums2) {
               bRight = nums2[j]
           }

           if aLeft <= bRight && bLeft <= aRight {
               leftMax := max(aLeft, bLeft)
               if (len(nums1)+len(nums2))%2 == 1 {
                   return float64(leftMax)
               }

               rightMin := min(aRight, bRight)
               return (float64(leftMax) + float64(rightMin)) / 2.0
           }

           if aLeft > bRight {
               high = i - 1
           } else {
               low = i + 1
           }
       }

       panic("输入数组不满足题目条件")
   }

TypeScript
^^^^^^^^^^

.. code-block:: typescript

   function findMedianSortedArrays(
       nums1: number[],
       nums2: number[],
   ): number {
       if (nums1.length > nums2.length) {
           return findMedianSortedArrays(nums2, nums1);
       }

       let low = 0;
       let high = nums1.length;
       const leftCount = Math.floor(
           (nums1.length + nums2.length + 1) / 2,
       );

       while (low <= high) {
           const i = Math.floor((low + high) / 2);
           const j = leftCount - i;

           const aLeft = i === 0 ? -Infinity : nums1[i - 1];
           const aRight = i === nums1.length ? Infinity : nums1[i];
           const bLeft = j === 0 ? -Infinity : nums2[j - 1];
           const bRight = j === nums2.length ? Infinity : nums2[j];

           if (aLeft <= bRight && bLeft <= aRight) {
               const leftMax = Math.max(aLeft, bLeft);
               if ((nums1.length + nums2.length) % 2 === 1) {
                   return leftMax;
               }

               const rightMin = Math.min(aRight, bRight);
               return (leftMax + rightMin) / 2;
           }

           if (aLeft > bRight) {
               high = i - 1;
           } else {
               low = i + 1;
           }
       }

       throw new Error("输入数组不满足题目条件");
   }

C#
^^

.. code-block:: csharp

   public class Solution {
       public double FindMedianSortedArrays(int[] nums1, int[] nums2) {
           if (nums1.Length > nums2.Length) {
               return FindMedianSortedArrays(nums2, nums1);
           }

           int low = 0;
           int high = nums1.Length;
           int leftCount = (nums1.Length + nums2.Length + 1) / 2;

           while (low <= high) {
               int i = low + (high - low) / 2;
               int j = leftCount - i;

               int aLeft = i == 0 ? int.MinValue : nums1[i - 1];
               int aRight = i == nums1.Length ? int.MaxValue : nums1[i];
               int bLeft = j == 0 ? int.MinValue : nums2[j - 1];
               int bRight = j == nums2.Length ? int.MaxValue : nums2[j];

               if (aLeft <= bRight && bLeft <= aRight) {
                   int leftMax = Math.Max(aLeft, bLeft);
                   if ((nums1.Length + nums2.Length) % 2 == 1) {
                       return leftMax;
                   }

                   int rightMin = Math.Min(aRight, bRight);
                   return ((double)leftMax + rightMin) / 2.0;
               }

               if (aLeft > bRight) {
                   high = i - 1;
               } else {
                   low = i + 1;
               }
           }

           throw new ArgumentException("输入数组不满足题目条件");
       }
   }

Julia
^^^^^

.. code-block:: julia

   function find_median_sorted_arrays(
       nums1::Vector{Int},
       nums2::Vector{Int},
   )::Float64
       a, b = length(nums1) <= length(nums2)
           ? (nums1, nums2)
           : (nums2, nums1)

       m, n = length(a), length(b)
       low, high = 0, m
       left_count = (m + n + 1) ÷ 2

       while low <= high
           i = (low + high) ÷ 2
           j = left_count - i

           # i、j 表示左侧元素数量，因此访问数组时需要转换为 1 基下标。
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
               return (Float64(left_max) + Float64(right_min)) / 2
           end

           if a_left > b_right
               high = i - 1
           else
               low = i + 1
           end
       end

       error("输入数组不满足题目条件")
   end

R
^

.. code-block:: r

   find_median_sorted_arrays <- function(nums1, nums2) {
       if (length(nums1) > length(nums2)) {
           return(find_median_sorted_arrays(nums2, nums1))
       }

       m <- length(nums1)
       n <- length(nums2)
       low <- 0L
       high <- m
       left_count <- (m + n + 1L) %/% 2L

       while (low <= high) {
           i <- (low + high) %/% 2L
           j <- left_count - i

           # i、j 是左侧元素数量，真正访问向量时仍使用 R 的 1 基下标。
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
               high <- i - 1L
           } else {
               low <- i + 1L
           }
       }

       stop("输入数组不满足题目条件")
   }

对照思路：双指针走到中间
--------------------------

双指针像归并排序一样，每次取两个数组较小的当前值。只需要保留最近两个取出的数，
走到合并序列中点就可以停止，因此辅助空间仍为 ``O(1)``。它更容易实现，但时间
复杂度为 ``O(m + n)``，没有满足本题要求的对数复杂度。

易错点
------

* 必须在较短数组上二分，否则 ``j`` 可能越界；
* ``i`` 和 ``j`` 表示左侧元素数量，不是普通元素下标；
* 总长度为奇数时使用左侧最大值，偶数时再取两侧边界平均值；
* 平均值计算前先转换为浮点类型，避免整数加法溢出；
* Julia 和 R 的数组从 1 开始，但分割数量仍从 0 到数组长度；
* 负无穷与正无穷只是边界哨兵，不属于真实输入元素。

本题新增知识
------------

* 在答案结构上做二分，而不是在具体数值范围中二分；
* 分割条件把“合并后有序”压缩为四个边界值的比较；
* 哨兵值统一处理空左侧和空右侧；
* 二分方向由哪一侧边界过大决定。

本题强化知识
------------

* 二分查找区间继续使用闭区间 ``[low, high]``；
* Julia 与 R 再次练习 0 基算法数量和 1 基数组访问之间的转换。

最小自检
--------

#. 为什么一定要在较短数组上二分？
#. 合法分割为什么只需要检查两个交叉不等式？
#. 总长度为奇数时为什么直接返回左侧最大值？

答案要点
~~~~~~~~

#. 较短数组的任意分割都能让另一个分割数量保持在合法范围内；
#. 两个数组内部已经有序，只需保证各自左侧末尾不越过另一侧右侧开头；
#. 左半部分比右半部分多一个元素，中间元素正是左侧最大值。
