0164. Maximum Gap
=================

题目信息
--------

:题号: 0164
:难度: Hard
:主题: 数组、桶、鸽巢原理、线性时间排序思想
:原题: `LeetCode 0164 <https://leetcode.com/problems/maximum-gap/>`_
:访问状态: Available
:教学重点: 最大间距下界、桶内严格界、跨桶相邻性、宽整数算术

精确契约
--------

输入 ``nums`` 是整数数组，满足：

* ``1 <= nums.length <= 10^5``；
* ``0 <= nums[i] <= 10^9``。

把全部元素按非递减顺序排列后，考察相邻元素差值，返回其中最大值。
若数组少于两个元素，返回 0。重复元素保留在排序序列中，其相邻差可以是 0。

算法不修改输入，要求 ``O(n)`` 时间与 ``O(n)`` 额外空间。直接调用比较排序需要
``O(n log n)``，不满足时间合同；按整个值域建立 ``10^9`` 个槽也不满足线性空间。

示例与反例
----------

官方示例一
~~~~~~~~~~

``nums = [3,6,9,1]``。排序后为 ``[1,3,6,9]``，相邻差为 ``2,3,3``，答案是 3。

官方示例二
~~~~~~~~~~

``nums = [10]``。没有相邻元素对，按合同返回 0。

重复与稀疏示例
~~~~~~~~~~~~~~

``nums = [1,1,1,100]``。排序相邻差是 ``0,0,99``，答案 99。
重复值必须进入桶，但不能让“未使用桶”与“桶最小值恰为 0”混淆。

桶宽向下取整的反例
~~~~~~~~~~~~~~~~~~

对 ``[0,3,7]``，值域 7、间距数 2。若桶宽错误使用 ``floor(7/2)=3``，
最大间距 4 不一定由“桶内差小于正确下界”这条证明支撑。正确宽度是
``ceil(7/2)=4``，同桶整数差严格小于 4，最大间距至少 4，才能推出它必跨桶。

问题抽象与解法选择
------------------

设元素数为 ``n>=2``，最小值为 ``low``，最大值为 ``high``，值域跨度：

.. math::

   R = high-low

若 ``R=0``，所有元素相等，答案立即为 0。以下假设 ``R>0``。

排序后有 ``n-1`` 个相邻间距，它们的和恰为 ``R``。因此最大间距 ``M`` 至少达到平均值的
上取整：

.. math::

   M \ge w = \left\lceil\frac{R}{n-1}\right\rceil

把 ``w`` 选作桶宽，并令值 ``x`` 的零基桶号为：

.. math::

   bucket(x)=\left\lfloor\frac{x-low}{w}\right\rfloor

每桶只保存实际落入值的最小值、最大值和 ``used`` 标记，不保存桶内全部元素。
同桶整数差严格小于 ``w``，而全局最大间距至少 ``w``，所以最大间距不可能完全位于桶内。
问题由此转化为扫描相邻非空桶的边界差。

为什么每桶两个极值足够
~~~~~~~~~~~~~~~~~~~~~~

按桶号从小到大看，若 ``A`` 与 ``B`` 是相邻的两个非空桶，中间桶都为空。
排序序列离开 A 时最后一个元素必是 ``max(A)``，进入 B 时第一个元素必是 ``min(B)``；
二者之间没有其他输入元素。因此跨越这两个桶的排序相邻差正是：

.. math::

   min(B)-max(A)

桶内其他值不会参与跨桶边界，所以无须保存。

状态、不变量与实现映射
----------------------

算法分三次线性扫描：

#. 扫描输入求 ``low`` 与 ``high``；
#. 计算桶宽和桶数，再扫描输入更新每桶极值；
#. 按桶号扫描所有非空桶，比较当前桶最小值与前一非空桶最大值。

填桶结束后，每个桶保持：

* ``used=false`` 当且仅当没有输入值落入该桶；
* 若 ``used=true``，``minimum`` 与 ``maximum`` 分别是该桶全部输入值的两端极值。

扫桶时保持：

* ``previous_maximum`` 是最近一个已处理非空桶的最大值；
* ``answer`` 是此前所有相邻非空桶边界差的最大值；
* 尚未处理桶的候选尚未计入，空桶不改变状态。

单独的 ``used``/``has_previous`` 布尔量不可省略。输入允许 0，数值 0 不能兼任
“桶为空”或“还没有前一桶”的可靠哨兵。

正确性证明
----------

引理一：最大相邻间距至少为桶宽
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

设排序序列为 ``a[0]<=...<=a[n-1]``，相邻差 ``g_i=a[i+1]-a[i]``。
这些差望远镜求和：

.. math::

   \sum_{i=0}^{n-2}g_i=a[n-1]-a[0]=R

若每个 ``g_i`` 都小于 ``ceil(R/(n-1))``，由于 ``g_i`` 是整数，所有差之和会小于 ``R``，
矛盾。因此 ``M=max(g_i)>=w``。

引理二：同一桶内任意差严格小于桶宽
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

桶号为 ``j`` 的值满足半开范围：

.. math::

   low+jw \le x < low+(j+1)w

对同桶整数 ``x<=y``，有 ``y-x<=w-1<w``。由引理一 ``M>=w``，
所以产生全局最大相邻间距的两个元素不可能落在同一桶。

引理三：桶数不超过元素数，所有桶号合法
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

桶数定义为：

.. math::

   B=\left\lfloor\frac{R}{w}\right\rfloor+1

因为 ``w>=R/(n-1)``，所以 ``R/w<=n-1``，从而 ``B<=n``。又因 ``R>0``，
``w>=1``，除法合法。任意 ``x`` 满足 ``0<=x-low<=R``，故桶号位于
``[0,floor(R/w)]=[0,B-1]``；特别地，最大值恰落在最后一个桶。

引理四：相邻非空桶边界是排序后的相邻元素
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

设 A、B 是按桶号相邻的两个非空桶，即二者之间所有桶都为空。桶区间按编号有序且不重叠，
所以 A 的任意值不大于 B 的任意值。A 中最后出现的排序元素是 ``max(A)``，
B 中最先出现的是 ``min(B)``。

中间桶为空，A 内没有大于其最大值的元素，B 内没有小于其最小值的元素，
其他更早或更晚桶也不可能落在二者之间。因此这两个值在全局排序序列中相邻。

定理：算法返回最大相邻间距
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

引理二说明全局最大间距必跨越两个桶。产生该间距的排序相邻元素所在桶之间不可能有非空桶，
否则会有输入元素夹在两者之间；所以它们属于某对相邻非空桶。

由引理四，该差等于后一桶最小值减前一桶最大值。扫桶不变量保证算法检查每对相邻非空桶并取最大，
因此不会漏掉全局最大间距，也不会加入非排序相邻的虚假候选。``n<2`` 或 ``R=0`` 的早返回
分别符合无相邻对和全部差为零的合同，故所有输入均正确。

复杂度与数值成本
----------------

求极值、填桶、扫桶各为线性。由引理三桶数 ``B<=n``，所以总时间 ``O(n)``，
桶载荷 ``O(n)``。核心标量为 ``O(1)``，输入不修改，返回一个整数。

固定宽语言把 ``high-low``、上取整分子 ``R+n-2``、桶号分子和跨桶差在运算前提升到
64 位。当前答案最大为 ``10^9``，最终可安全返回 32 位整数。TypeScript/R 的所有整数中间量
不超过约 ``10^9+10^5``，远小于 ``2^53``，除法取整在当前分母范围内也能稳定得到整数桶边界。

十语言实现
----------

C
~

.. code-block:: c

   #include <stdint.h>
   #include <stdlib.h>

   struct GapBucket {
       int minimum;
       int maximum;
       int used;
   };

   int maximumGap(int *nums, int numsSize) {
       if (numsSize < 2) {
           return 0;
       }

       int minimum = nums[0];
       int maximum = nums[0];
       for (int index = 1; index < numsSize; ++index) {
           if (nums[index] < minimum) {
               minimum = nums[index];
           }
           if (nums[index] > maximum) {
               maximum = nums[index];
           }
       }

       int64_t value_range = (int64_t)maximum - minimum;
       if (value_range == 0) {
           return 0;
       }

       int64_t bucket_width =
           (value_range + numsSize - 2) / (numsSize - 1);
       size_t bucket_count =
           (size_t)(value_range / bucket_width + 1);
       struct GapBucket *buckets =
           calloc(bucket_count, sizeof(*buckets));
       if (buckets == NULL) {
           return 0;
       }

       for (int index = 0; index < numsSize; ++index) {
           size_t bucket_index = (size_t)(
               ((int64_t)nums[index] - minimum) / bucket_width
           );
           struct GapBucket *bucket = &buckets[bucket_index];
           if (!bucket->used) {
               bucket->minimum = nums[index];
               bucket->maximum = nums[index];
               bucket->used = 1;
           } else {
               if (nums[index] < bucket->minimum) {
                   bucket->minimum = nums[index];
               }
               if (nums[index] > bucket->maximum) {
                   bucket->maximum = nums[index];
               }
           }
       }

       int64_t answer = 0;
       int previous_maximum = 0;
       int has_previous = 0;
       for (size_t index = 0; index < bucket_count; ++index) {
           if (!buckets[index].used) {
               continue;
           }
           if (has_previous) {
               int64_t gap =
                   (int64_t)buckets[index].minimum - previous_maximum;
               if (gap > answer) {
                   answer = gap;
               }
           }
           previous_maximum = buckets[index].maximum;
           has_previous = 1;
       }

       free(buckets);
       return (int)answer;
   }

C++
~~~

.. code-block:: cpp

   #include <algorithm>
   #include <cstdint>
   #include <vector>

   class Solution {
   public:
       int maximumGap(std::vector<int>& nums) {
           const int count = static_cast<int>(nums.size());
           if (count < 2) {
               return 0;
           }

           const auto extrema =
               std::minmax_element(nums.begin(), nums.end());
           const int minimum = *extrema.first;
           const int maximum = *extrema.second;
           const std::int64_t valueRange =
               static_cast<std::int64_t>(maximum) - minimum;
           if (valueRange == 0) {
               return 0;
           }

           const std::int64_t bucketWidth =
               (valueRange + count - 2) / (count - 1);
           const int bucketCount = static_cast<int>(
               valueRange / bucketWidth + 1
           );

           struct Bucket {
               int minimum = 0;
               int maximum = 0;
               bool used = false;
           };
           std::vector<Bucket> buckets(bucketCount);

           for (int value : nums) {
               const int index = static_cast<int>(
                   (static_cast<std::int64_t>(value) - minimum) /
                   bucketWidth
               );
               Bucket& bucket = buckets[index];
               if (!bucket.used) {
                   bucket.minimum = value;
                   bucket.maximum = value;
                   bucket.used = true;
               } else {
                   bucket.minimum = std::min(bucket.minimum, value);
                   bucket.maximum = std::max(bucket.maximum, value);
               }
           }

           std::int64_t answer = 0;
           int previousMaximum = 0;
           bool hasPrevious = false;
           for (const Bucket& bucket : buckets) {
               if (!bucket.used) {
                   continue;
               }
               if (hasPrevious) {
                   answer = std::max(
                       answer,
                       static_cast<std::int64_t>(bucket.minimum) -
                           previousMaximum
                   );
               }
               previousMaximum = bucket.maximum;
               hasPrevious = true;
           }

           return static_cast<int>(answer);
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def maximumGap(self, nums: list[int]) -> int:
           count = len(nums)
           if count < 2:
               return 0

           minimum = min(nums)
           maximum = max(nums)
           value_range = maximum - minimum
           if value_range == 0:
               return 0

           bucket_width = (value_range + count - 2) // (count - 1)
           bucket_count = value_range // bucket_width + 1
           buckets: list[tuple[int, int] | None] = [None] * bucket_count

           for value in nums:
               index = (value - minimum) // bucket_width
               bucket = buckets[index]
               if bucket is None:
                   buckets[index] = (value, value)
               else:
                   buckets[index] = (
                       min(bucket[0], value),
                       max(bucket[1], value),
                   )

           answer = 0
           previous_maximum: int | None = None
           for bucket in buckets:
               if bucket is None:
                   continue
               if previous_maximum is not None:
                   answer = max(answer, bucket[0] - previous_maximum)
               previous_maximum = bucket[1]

           return answer

Java
~~~~

.. code-block:: java

   class Solution {
       public int maximumGap(int[] nums) {
           int count = nums.length;
           if (count < 2) {
               return 0;
           }

           int minimum = nums[0];
           int maximum = nums[0];
           for (int value : nums) {
               minimum = Math.min(minimum, value);
               maximum = Math.max(maximum, value);
           }

           long valueRange = (long) maximum - minimum;
           if (valueRange == 0) {
               return 0;
           }

           long bucketWidth =
               (valueRange + count - 2L) / (count - 1L);
           int bucketCount =
               (int) (valueRange / bucketWidth + 1L);
           int[] bucketMinimums = new int[bucketCount];
           int[] bucketMaximums = new int[bucketCount];
           boolean[] used = new boolean[bucketCount];

           for (int value : nums) {
               int index = (int) (((long) value - minimum) / bucketWidth);
               if (!used[index]) {
                   bucketMinimums[index] = value;
                   bucketMaximums[index] = value;
                   used[index] = true;
               } else {
                   bucketMinimums[index] =
                       Math.min(bucketMinimums[index], value);
                   bucketMaximums[index] =
                       Math.max(bucketMaximums[index], value);
               }
           }

           long answer = 0;
           int previousMaximum = 0;
           boolean hasPrevious = false;
           for (int index = 0; index < bucketCount; index++) {
               if (!used[index]) {
                   continue;
               }
               if (hasPrevious) {
                   answer = Math.max(
                       answer,
                       (long) bucketMinimums[index] - previousMaximum
                   );
               }
               previousMaximum = bucketMaximums[index];
               hasPrevious = true;
           }

           return (int) answer;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn maximum_gap(nums: Vec<i32>) -> i32 {
           let count = nums.len();
           if count < 2 {
               return 0;
           }

           let minimum = *nums.iter().min().unwrap();
           let maximum = *nums.iter().max().unwrap();
           let value_range = i64::from(maximum) - i64::from(minimum);
           if value_range == 0 {
               return 0;
           }

           let bucket_width =
               (value_range + count as i64 - 2) / (count as i64 - 1);
           let bucket_count =
               (value_range / bucket_width + 1) as usize;
           let mut buckets: Vec<Option<(i32, i32)>> =
               vec![None; bucket_count];

           for value in nums {
               let index = (
                   (i64::from(value) - i64::from(minimum)) /
                   bucket_width
               ) as usize;
               buckets[index] = match buckets[index] {
                   None => Some((value, value)),
                   Some((bucket_minimum, bucket_maximum)) => Some((
                       bucket_minimum.min(value),
                       bucket_maximum.max(value),
                   )),
               };
           }

           let mut answer = 0i64;
           let mut previous_maximum: Option<i32> = None;
           for bucket in buckets.into_iter().flatten() {
               if let Some(previous) = previous_maximum {
                   answer = answer.max(
                       i64::from(bucket.0) - i64::from(previous)
                   );
               }
               previous_maximum = Some(bucket.1);
           }

           answer as i32
       }
   }

Go
~~

.. code-block:: go

   type gapBucket struct {
       minimum int
       maximum int
       used    bool
   }

   func maximumGap(nums []int) int {
       count := len(nums)
       if count < 2 {
           return 0
       }

       minimum := nums[0]
       maximum := nums[0]
       for _, value := range nums {
           if value < minimum {
               minimum = value
           }
           if value > maximum {
               maximum = value
           }
       }

       valueRange := int64(maximum) - int64(minimum)
       if valueRange == 0 {
           return 0
       }

       bucketWidth :=
           (valueRange + int64(count) - 2) / (int64(count) - 1)
       bucketCount := int(valueRange/bucketWidth + 1)
       buckets := make([]gapBucket, bucketCount)

       for _, value := range nums {
           index := int(
               (int64(value) - int64(minimum)) / bucketWidth,
           )
           bucket := &buckets[index]
           if !bucket.used {
               bucket.minimum = value
               bucket.maximum = value
               bucket.used = true
           } else {
               if value < bucket.minimum {
                   bucket.minimum = value
               }
               if value > bucket.maximum {
                   bucket.maximum = value
               }
           }
       }

       answer := int64(0)
       previousMaximum := 0
       hasPrevious := false
       for _, bucket := range buckets {
           if !bucket.used {
               continue
           }
           if hasPrevious {
               gap := int64(bucket.minimum) - int64(previousMaximum)
               if gap > answer {
                   answer = gap
               }
           }
           previousMaximum = bucket.maximum
           hasPrevious = true
       }

       return int(answer)
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function maximumGap(nums: number[]): number {
       const count = nums.length;
       if (count < 2) {
           return 0;
       }

       let minimum = nums[0];
       let maximum = nums[0];
       for (const value of nums) {
           minimum = Math.min(minimum, value);
           maximum = Math.max(maximum, value);
       }

       const valueRange = maximum - minimum;
       if (valueRange === 0) {
           return 0;
       }

       const bucketWidth = Math.ceil(valueRange / (count - 1));
       const bucketCount = Math.floor(valueRange / bucketWidth) + 1;
       const buckets: Array<
           { minimum: number; maximum: number } | undefined
       > = new Array(bucketCount);

       for (const value of nums) {
           const index = Math.floor((value - minimum) / bucketWidth);
           const bucket = buckets[index];
           if (bucket === undefined) {
               buckets[index] = { minimum: value, maximum: value };
           } else {
               bucket.minimum = Math.min(bucket.minimum, value);
               bucket.maximum = Math.max(bucket.maximum, value);
           }
       }

       let answer = 0;
       let previousMaximum: number | undefined;
       for (const bucket of buckets) {
           if (bucket === undefined) {
               continue;
           }
           if (previousMaximum !== undefined) {
               answer = Math.max(
                   answer,
                   bucket.minimum - previousMaximum,
               );
           }
           previousMaximum = bucket.maximum;
       }

       return answer;
   }

C#
~~

.. code-block:: csharp

   using System;

   public class Solution {
       public int MaximumGap(int[] nums) {
           int count = nums.Length;
           if (count < 2) {
               return 0;
           }

           int minimum = nums[0];
           int maximum = nums[0];
           foreach (int value in nums) {
               minimum = Math.Min(minimum, value);
               maximum = Math.Max(maximum, value);
           }

           long valueRange = (long)maximum - minimum;
           if (valueRange == 0) {
               return 0;
           }

           long bucketWidth =
               (valueRange + count - 2L) / (count - 1L);
           int bucketCount =
               (int)(valueRange / bucketWidth + 1L);
           int[] bucketMinimums = new int[bucketCount];
           int[] bucketMaximums = new int[bucketCount];
           bool[] used = new bool[bucketCount];

           foreach (int value in nums) {
               int index = (int)(((long)value - minimum) / bucketWidth);
               if (!used[index]) {
                   bucketMinimums[index] = value;
                   bucketMaximums[index] = value;
                   used[index] = true;
               } else {
                   bucketMinimums[index] =
                       Math.Min(bucketMinimums[index], value);
                   bucketMaximums[index] =
                       Math.Max(bucketMaximums[index], value);
               }
           }

           long answer = 0;
           int previousMaximum = 0;
           bool hasPrevious = false;
           for (int index = 0; index < bucketCount; index++) {
               if (!used[index]) {
                   continue;
               }
               if (hasPrevious) {
                   answer = Math.Max(
                       answer,
                       (long)bucketMinimums[index] - previousMaximum
                   );
               }
               previousMaximum = bucketMaximums[index];
               hasPrevious = true;
           }

           return (int)answer;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function maximum_gap(nums::Vector{Int})::Int
       count = length(nums)
       count < 2 && return 0

       minimum_value = Base.minimum(nums)
       maximum_value = Base.maximum(nums)
       value_range = Int64(maximum_value) - Int64(minimum_value)
       value_range == 0 && return 0

       bucket_width =
           (value_range + count - 2) ÷ (count - 1)
       bucket_count = Int(value_range ÷ bucket_width + 1)
       bucket_minimums = zeros(Int, bucket_count)
       bucket_maximums = zeros(Int, bucket_count)
       used = falses(bucket_count)

       for value in nums
           index = Int(
               (Int64(value) - Int64(minimum_value)) ÷ bucket_width
           ) + 1
           if !used[index]
               bucket_minimums[index] = value
               bucket_maximums[index] = value
               used[index] = true
           else
               bucket_minimums[index] =
                   min(bucket_minimums[index], value)
               bucket_maximums[index] =
                   max(bucket_maximums[index], value)
           end
       end

       answer = Int64(0)
       previous_maximum = 0
       has_previous = false
       for index in eachindex(used)
           used[index] || continue
           if has_previous
               answer = max(
                   answer,
                   Int64(bucket_minimums[index]) - previous_maximum,
               )
           end
           previous_maximum = bucket_maximums[index]
           has_previous = true
       end

       return Int(answer)
   end

R
~

.. code-block:: r

   maximum_gap <- function(nums) {
     count <- length(nums)
     if (count < 2L) {
       return(0)
     }

     minimum <- min(nums)
     maximum <- max(nums)
     value_range <- maximum - minimum
     if (value_range == 0) {
       return(0)
     }

     bucket_width <- ceiling(value_range / (count - 1L))
     bucket_count <- as.integer(
       floor(value_range / bucket_width) + 1
     )
     bucket_minimums <- numeric(bucket_count)
     bucket_maximums <- numeric(bucket_count)
     used <- rep(FALSE, bucket_count)

     for (value in nums) {
       index <- as.integer(
         floor((value - minimum) / bucket_width)
       ) + 1L
       if (!used[index]) {
         bucket_minimums[index] <- value
         bucket_maximums[index] <- value
         used[index] <- TRUE
       } else {
         bucket_minimums[index] <- min(
           bucket_minimums[index],
           value
         )
         bucket_maximums[index] <- max(
           bucket_maximums[index],
           value
         )
       }
     }

     answer <- 0
     previous_maximum <- 0
     has_previous <- FALSE
     for (index in seq_len(bucket_count)) {
       if (!used[index]) {
         next
       }
       if (has_previous) {
         answer <- max(
           answer,
           bucket_minimums[index] - previous_maximum
         )
       }
       previous_maximum <- bucket_maximums[index]
       has_previous <- TRUE
     }

     answer
   }

人工推演与静态审查
------------------

本题没有运行、编译或测试任何题解代码，也没有执行随机对拍、穷举、属性测试、
sanitizer 或目标语言最小程序。以下证据来自桶表纸面推演、整数上界证明和逐语言静态审查。

官方示例一推演
~~~~~~~~~~~~~~

对 ``[3,6,9,1]``，``n=4``、``low=1``、``high=9``、``R=8``：

.. math::

   w=\left\lceil\frac{8}{3}\right\rceil=3,
   \qquad B=\left\lfloor\frac{8}{3}\right\rfloor+1=3

.. list-table::
   :header-rows: 1

   * - 桶号
     - 落入值
     - 桶最小/最大
     - 与前一非空桶的差
   * - 0
     - ``1,3``
     - ``1/3``
     - 无
   * - 1
     - ``6``
     - ``6/6``
     - ``6-3=3``
   * - 2
     - ``9``
     - ``9/9``
     - ``9-6=3``

扫描结果为 3，与排序相邻差一致。

单元素、全相等与稀疏重复
~~~~~~~~~~~~~~~~~~~~~~~~

``[10]`` 在分桶前返回 0。``[5,5,5]`` 得到 ``R=0``，避免计算零桶宽并返回 0。
``[1,1,1,100]`` 有 ``w=33``、``B=4``；桶 0 的极值为 1，桶 3 的极值为 100，
中间两桶为空，相邻非空桶差为 99。

数值与桶数边界
~~~~~~~~~~~~~~

``[0,10^9]`` 有 ``n=2``、``w=10^9``、``B=2``，最大值桶号为 1，答案 ``10^9``
仍适合有符号 32 位。一般情况下引理三保证 ``B<=10^5``，不会按值域分配十亿个桶。

逐语言静态语义审查
~~~~~~~~~~~~~~~~~~

* **C**：``numsSize>=2`` 后分母为正；64 位表达式在减法和加法前完成提升。
  ``bucket_count<=numsSize`` 支撑 ``calloc`` 数量，成功路径统一 ``free``。
* **C++ / Java / C#**：极值、桶号与跨桶差在 64 位表达式中计算，桶数再安全转为
  ``int``；``used`` 独立于数值 0，输入数组未修改。
* **Python**：整数任意精度，``None`` 区分空桶；元组更新只替换一个桶记录，
  桶列表大小由 ``B<=n`` 约束。
* **Rust**：非空保证 ``min/max().unwrap``；``Option`` 明确空桶，消费 ``nums``
  不克隆输入；``i64`` 差值后桶号由已证范围转 ``usize``。
* **Go**：先转 ``int64`` 再相减；即使平台 ``int`` 为 32 位，元素、桶数和最终答案
  仍在范围内。结构体 ``used`` 不依赖零值极值。
* **TypeScript**：没有位运算；全部整数远低于 ``2^53``，对象 ``undefined`` 表示空桶，
  ``Math.ceil``/``Math.floor`` 与正数公式一致。
* **Julia**：差值先转 ``Int64``，数学零基桶号加一映射到数组；``eachindex``
  扫描全部桶，布尔向量独立记录使用状态。
* **R**：双精度精确表示当前整数域，正数 ``ceiling``/``floor`` 计算桶边界；
  桶数至少 2，``seq_len`` 方向安全，三个向量各为 ``O(B)``。

剩余风险
~~~~~~~~

C 的公开接口没有资源失败返回通道；``calloc`` 失败时实现返回 0，但在 ``R>0`` 的合法输入上
真实答案必为正，因此该返回无法与算法结果等价。其他语言分配失败也可能抛异常或终止。
静态审查没有运行判题机确认内存、语言版本或模板行为。

关键边界与失败方式
------------------

* ``n<2`` 与 ``R=0`` 必须在桶宽除法前返回。
* 桶宽必须使用上取整的平均间距下界；向下取整会破坏桶内严格小于目标下界的证明。
* 桶数量要加一包含 ``high`` 所在端点桶，同时用证明保证总数不超过 ``n``。
* 只保存桶平均值不够；跨桶相邻差需要前桶最大值和后桶最小值。
* 扫描的是相邻 **非空** 桶，不能把空桶的零初始化值拿来计算差。
* ``used`` 与 ``has_previous`` 不能由极值是否为 0 代替，因为 0 是合法元素。
* 宽化必须发生在 ``high-low`` 或 ``R+n-2`` 之前，窄表达式溢出后再赋宽类型无效。
* 分配与值域等长的桶数组会达到 ``10^9`` 空间，不是 ``O(n)``。
* 桶法没有真正输出排序序列；正确性来自跨桶候选覆盖，而不是隐式假设桶已排序所有元素。

学习链与知识更新
----------------

本题利用的是“答案下界反过来指导离散化粒度”。鸽巢原理先给出最大相邻差至少为平均间距上取整，
再把桶内所有差压到该下界以下，于是目标被迫出现在桶边界。只保存局部极值就足以恢复答案，
无需恢复完整排序。

新增或强化的知识包括：

* 由望远镜和鸽巢原理得到最大间距的整数下界；
* 用半开桶区间证明同桶整数差严格小于桶宽；
* 相邻非空桶的最大/最小是全局排序中的相邻元素；
* 由桶宽下界反推桶数不超过 ``n``，关闭线性空间证明；
* 资源证明要同时覆盖数值范围、索引转换、分配数量与失败通道；
* 可联系 `0128. Longest Consecutive Sequence
  <0128-longest-consecutive-sequence.rst>`_：两题都避免比较排序，但 0128 用哈希邻接，
  本题用答案下界设计桶。

带答案自检
----------

#. **为什么最大间距至少是 ``ceil(R/(n-1))``？**

   排序后 ``n-1`` 个非负整数间距之和为 ``R``；若全部小于该上取整平均值，
   总和不可能达到 ``R``。

#. **为什么同桶差严格小于桶宽？**

   同桶值落在宽度 ``w`` 的半开区间中；整数两端最大差为 ``w-1``。

#. **为什么只扫描相邻非空桶？**

   两个这样的桶之间没有输入元素；前桶最大值与后桶最小值在全局排序中恰好相邻。

#. **桶数为什么不会随 ``10^9`` 值域增长？**

   ``w>=R/(n-1)``，所以 ``floor(R/w)+1<=n``；桶数由元素数控制。

#. **最大值的桶号为什么合法？**

   ``high-low=R``，其桶号是 ``floor(R/w)=B-1``，正是最后一个已分配桶。

#. **哪几处必须先宽化？**

   ``high-low``、上取整分子 ``R+n-2``、``value-low`` 和跨桶减法都应在运算前进入宽类型。
