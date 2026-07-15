0164. Maximum Gap
=================

题目信息
--------

:题号: 0164
:难度: Hard
:主题: 数组、桶、鸽巢原理、线性时间排序思想
:原题: `LeetCode 0164 <https://leetcode.com/problems/maximum-gap/>`_
:访问状态: Available
:教学重点: 最大间距下界、桶宽设计、只比较相邻非空桶

题目重述
--------

给定一个非空整数数组。把所有元素按非递减顺序排列后，返回相邻元素之间的最大差值；元素不足两个时
返回 ``0``。要求主算法在线性时间和线性额外空间内完成，并且不修改输入。

算法
----

设元素数量为 ``n``，最小值为 ``low``，最大值为 ``high``。当 ``n >= 2`` 且两端不同，排序后的
``n - 1`` 个相邻间距之和为 ``high - low``，因此最大间距至少为：

``ceil((high - low) / (n - 1))``。

把这个下界作为桶宽。每个桶只保存落入其中的最小值和最大值，不保存全部元素。相同桶内两个整数的差
严格小于桶宽，所以真正的最大间距不需要在桶内部寻找；按桶序扫描相邻非空桶，只计算“当前桶最小值减
前一非空桶最大值”。

桶数量为 ``floor((high - low) / bucket_width) + 1``，不会超过 ``n``。差值、上取整和桶下标计算先
提升到宽整数，避免减法或加法在窄类型中溢出。

正确性
~~~~~~

排序后共有 ``n - 1`` 个相邻间距，其总和为 ``high - low``，所以至少一个间距不小于桶宽。按
``floor((value - low) / bucket_width)`` 分桶后，同一桶内任意两个整数的差严格小于桶宽，因此全局最大
相邻间距不可能只发生在同一桶内部。

忽略空桶后，排序序列中跨越两个相邻非空桶的边界元素，恰好是前一桶最大值与后一桶最小值。算法扫描
所有这类边界并取最大值，覆盖全部可能达到全局最大值的候选，因此返回结果正确。

复杂度
~~~~~~

扫描输入、填桶和扫描桶各为 ``O(n)``，总时间复杂度为 ``O(n)``。桶数量不超过 ``n``，额外空间为
``O(n)``。C 实现的公开接口没有资源失败返回通道；若桶分配失败只能返回约定值 ``0``，正常题目执行
依赖平台提供足够内存。

核心语言实现
------------

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

           const auto [minimum_it, maximum_it] =
               std::minmax_element(nums.begin(), nums.end());
           const int minimum = *minimum_it;
           const int maximum = *maximum_it;
           const std::int64_t value_range =
               static_cast<std::int64_t>(maximum) - minimum;
           if (value_range == 0) {
               return 0;
           }

           const std::int64_t bucket_width =
               (value_range + count - 2) / (count - 1);
           const int bucket_count = static_cast<int>(
               value_range / bucket_width + 1
           );

           struct Bucket {
               int minimum = 0;
               int maximum = 0;
               bool used = false;
           };
           std::vector<Bucket> buckets(bucket_count);

           for (int value : nums) {
               const int index = static_cast<int>(
                   (static_cast<std::int64_t>(value) - minimum) /
                   bucket_width
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
           int previous_maximum = 0;
           bool has_previous = false;
           for (const Bucket& bucket : buckets) {
               if (!bucket.used) {
                   continue;
               }
               if (has_previous) {
                   answer = std::max(
                       answer,
                       static_cast<std::int64_t>(bucket.minimum) -
                           previous_maximum
                   );
               }
               previous_maximum = bucket.maximum;
               has_previous = true;
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
                   (i64::from(value) - i64::from(minimum)) / bucket_width
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
                   answer = answer.max(i64::from(bucket.0) - i64::from(previous));
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
           const index = Math.floor(
               (value - minimum) / bucketWidth,
           );
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

关键边界
--------

* 单元素数组直接返回 ``0``；
* 所有元素相等时值域为零，不能继续计算桶宽；
* 重复值可以落入同一桶，不影响桶内间距严格小于桶宽的结论；
* 最大值可能恰好位于最后一个桶，桶数量必须包含该端点；
* ``maximum - minimum``、上取整分子和桶下标先使用宽整数；
* TypeScript 的约束值域位于安全整数范围内，代码不使用 32 位位运算。

验证
----

运行两个官方示例以及全相等、仅两个值、包含重复值和 ``0`` 到 ``10^9`` 的边界。Python 对 1000 个
随机数组与“排序后逐项求差”的独立基准对拍；C、C++、Go、Java 和 TypeScript 运行代表案例，其余语言
完成接口与索引静态检查。

最小自检
--------

#. 为什么桶宽应使用最大间距的下界，而不是随意选择固定宽度？
#. 为什么桶内只保存最小值和最大值就足够？
#. 哪几处算术必须在减法或加法之前提升到宽整数？
