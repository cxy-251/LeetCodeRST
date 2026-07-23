0016. 3Sum Closest
==================

题目信息
--------

:题号: 0016
:难度: Medium
:主题: 数组、排序、双指针
:原题: `LeetCode 0016 <https://leetcode.com/problems/3sum-closest/>`_
:重点: 三个不同下标、与目标值的绝对距离、唯一最近和值

题目重述
--------

给定整数数组 ``nums`` 和整数 ``target``，从数组中选择三个不同下标，计算对应三个元素的和，返回与 ``target`` 最接近的和值。

接近程度由 ``abs(sum - target)`` 衡量。题目保证最近的三数和值唯一。``nums`` 的长度位于 ``[3, 500]``，每个元素位于 ``[-1000, 1000]``，``target`` 位于 ``[-10^4, 10^4]``。

自建示例
--------

目标值无法精确得到：

.. code-block:: text

   输入：nums = [-5, -1, 2, 6, 9], target = 4
   输出：3
   解释：和值 3 与目标值相差 1，例如选择 -5、-1、9；不存在和值为 4 的三元组，也没有距离更小的和值。

可以精确命中：

.. code-block:: text

   输入：nums = [7, -2, 4, 1], target = 6
   输出：6
   解释：选择 -2、1、7，三数之和正好等于目标值。

全部为负数：

.. code-block:: text

   输入：nums = [-8, -5, -3, -1], target = -10
   输出：-9
   解释：选择 -5、-3、-1 得到 -9，与目标值相差 1，是唯一最近和值。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <cstdlib>
   #include <vector>

   class Solution {
   private:
       int enumerateTriples(const std::vector<int>& nums, int target) {
           long long best = 1LL * nums[0] + nums[1] + nums[2];
           const int n = static_cast<int>(nums.size());
           for (int i = 0; i < n; ++i) {
               for (int j = i + 1; j < n; ++j) {
                   for (int k = j + 1; k < n; ++k) {
                       const long long sum = 1LL * nums[i] + nums[j] + nums[k];
                       if (std::llabs(sum - target) < std::llabs(best - target)) {
                           best = sum;
                       }
                   }
               }
           }
           return static_cast<int>(best);
       }

       int sortAndTwoPointers(std::vector<int> nums, int target) {
           std::sort(nums.begin(), nums.end());
           long long best = 1LL * nums[0] + nums[1] + nums[2];
           const int n = static_cast<int>(nums.size());

           for (int first = 0; first + 2 < n; ++first) {
               int left = first + 1;
               int right = n - 1;
               while (left < right) {
                   const long long sum =
                       1LL * nums[first] + nums[left] + nums[right];

                   if (std::llabs(sum - target) < std::llabs(best - target)) {
                       best = sum;
                   }

                   if (sum < target) {
                       ++left;
                   } else if (sum > target) {
                       --right;
                   } else {
                       return target;
                   }
               }
           }
           return static_cast<int>(best);
       }

   public:
       int threeSumClosest(std::vector<int>& nums, int target) {
           return sortAndTwoPointers(nums, target);
       }
   };

题解
----

三重枚举为什么只提供基准
~~~~~~~~~~~~~~~~~~~~~~~~

所有三下标组合共有 ``O(n^3)`` 个。对每个和值计算 ``abs(sum-target)`` 并维护最小距离即可得到答案，但没有利用
数值顺序，无法批量排除候选。

排序后固定首元素如何形成单调搜索
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

排序并固定 ``nums[first]`` 后，``left`` 增大时和值不减，``right`` 减小时和值不增。因此当前和小于目标时，
保持左端并减小右端只会让和值更小；必须右移 ``left``。当前和大于目标时必须左移 ``right``。

最优值为什么要在移动指针前更新
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

当前三元组无论位于目标左侧还是右侧，都可能是全局最近候选。先比较距离并更新 ``best``，再依据和值方向移动
指针，才能确保被排除区间的边界候选已经记录。若先移动，可能永久跳过最近和值。

状态演化
~~~~~~~~

对排序数组 ``[-5,-1,2,6,9]``、``target = 4``，固定首值 ``-5``：

.. list-table::
   :header-rows: 1

   * - 左值
     - 右值
     - 当前和
     - 距离
     - ``best``
     - 移动
   * - -1
     - 9
     - 3
     - 1
     - 3
     - 和偏小，左移
   * - 2
     - 9
     - 6
     - 2
     - 3
     - 和偏大，右移
   * - 2
     - 6
     - 3
     - 1
     - 3
     - 和偏小，左移

后续首元素继续搜索；题目保证最终最近和值唯一。

为什么指针移动不会错过更近和值
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

当 ``sum < target`` 时，固定当前左值，任何更靠左的右端只会使和值更小，与目标距离不会通过跨越目标而改善；
当前边界和值已经记录，所以这些组合可排除。``sum > target`` 时对称。算法保留了唯一可能让和值朝目标方向变化
的指针移动。

为什么精确命中可以立即返回
~~~~~~~~~~~~~~~~~~~~~~~~~~

和值等于目标时距离为零，这是绝对值距离的理论下界，不存在更优候选。因此无需继续搜索。

复杂度来源
~~~~~~~~~~

排序耗时 ``O(n log n)``。外层 ``O(n)``，每次双指针合计移动 ``O(n)``，总时间 ``O(n^2)``。除排序空间外
工作空间 ``O(1)``。和值和差值使用更宽整数，避免 ``sum-target`` 溢出后破坏距离比较。

九语言实现
----------

C
~

.. code-block:: c

   #include <stdlib.h>

   static int compare_int(const void* a, const void* b) {
       int x = *(const int*)a, y = *(const int*)b;
       return (x > y) - (x < y);
   }

   int threeSumClosest(int* nums, int numsSize, int target) {
       qsort(nums, numsSize, sizeof(int), compare_int);
       long long best = (long long)nums[0] + nums[1] + nums[2];
       for (int first = 0; first + 2 < numsSize; ++first) {
           int left = first + 1, right = numsSize - 1;
           while (left < right) {
               long long sum = (long long)nums[first] + nums[left] + nums[right];
               if (llabs(sum - target) < llabs(best - target)) best = sum;
               if (sum < target) ++left;
               else if (sum > target) --right;
               else return target;
           }
       }
       return (int)best;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def threeSumClosest(self, nums: list[int], target: int) -> int:
           nums.sort(); best = sum(nums[:3])
           for first in range(len(nums) - 2):
               left, right = first + 1, len(nums) - 1
               while left < right:
                   total = nums[first] + nums[left] + nums[right]
                   if abs(total - target) < abs(best - target): best = total
                   if total < target: left += 1
                   elif total > target: right -= 1
                   else: return target
           return best

Java
~~~~

.. code-block:: java

   class Solution {
       public int threeSumClosest(int[] nums, int target) {
           Arrays.sort(nums);
           long best = (long)nums[0] + nums[1] + nums[2];
           for (int first = 0; first + 2 < nums.length; first++) {
               int left = first + 1, right = nums.length - 1;
               while (left < right) {
                   long sum = (long)nums[first] + nums[left] + nums[right];
                   if (Math.abs(sum - target) < Math.abs(best - target)) best = sum;
                   if (sum < target) left++; else if (sum > target) right--; else return target;
               }
           }
           return (int)best;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn three_sum_closest(mut nums: Vec<i32>, target: i32) -> i32 {
           nums.sort_unstable();
           let mut best = nums[0] as i64 + nums[1] as i64 + nums[2] as i64;
           for first in 0..nums.len() - 2 {
               let (mut left, mut right) = (first + 1, nums.len() - 1);
               while left < right {
                   let sum = nums[first] as i64 + nums[left] as i64 + nums[right] as i64;
                   if (sum - target as i64).abs() < (best - target as i64).abs() { best = sum; }
                   if sum < target as i64 { left += 1; }
                   else if sum > target as i64 { right -= 1; }
                   else { return target; }
               }
           }
           best as i32
       }
   }

Go
~~

.. code-block:: go

   func threeSumClosest(nums []int, target int) int {
       sort.Ints(nums); best := nums[0]+nums[1]+nums[2]
       abs := func(x int) int { if x < 0 { return -x }; return x }
       for first := 0; first+2 < len(nums); first++ {
           left, right := first+1, len(nums)-1
           for left < right {
               sum := nums[first]+nums[left]+nums[right]
               if abs(sum-target) < abs(best-target) { best = sum }
               if sum < target { left++ } else if sum > target { right-- } else { return target }
           }
       }
       return best
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function threeSumClosest(nums: number[], target: number): number {
       nums.sort((a,b) => a-b); let best = nums[0]+nums[1]+nums[2];
       for (let first = 0; first + 2 < nums.length; ++first) {
           let left = first + 1, right = nums.length - 1;
           while (left < right) {
               const sum = nums[first]+nums[left]+nums[right];
               if (Math.abs(sum-target) < Math.abs(best-target)) best = sum;
               if (sum < target) ++left; else if (sum > target) --right; else return target;
           }
       }
       return best;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int ThreeSumClosest(int[] nums, int target) {
           Array.Sort(nums); long best = (long)nums[0] + nums[1] + nums[2];
           for (int first = 0; first + 2 < nums.Length; first++) {
               int left = first + 1, right = nums.Length - 1;
               while (left < right) {
                   long sum = (long)nums[first] + nums[left] + nums[right];
                   if (Math.Abs(sum-target) < Math.Abs(best-target)) best = sum;
                   if (sum < target) left++; else if (sum > target) right--; else return target;
               }
           }
           return (int)best;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function three_sum_closest(nums::Vector{Int}, target::Int)::Int
       sort!(nums); best = nums[1] + nums[2] + nums[3]
       for first in 1:(length(nums)-2)
           left, right = first + 1, length(nums)
           while left < right
               total = nums[first] + nums[left] + nums[right]
               if abs(total-target) < abs(best-target); best = total; end
               if total < target; left += 1
               elseif total > target; right -= 1
               else; return target
               end
           end
       end
       best
   end

R
~

.. code-block:: r

   threeSumClosest <- function(nums, target) {
       nums <- sort(nums); best <- sum(nums[1:3]); n <- length(nums)
       for (first in seq_len(n - 2L)) {
           left <- first + 1L; right <- n
           while (left < right) {
               total <- nums[[first]] + nums[[left]] + nums[[right]]
               if (abs(total-target) < abs(best-target)) best <- total
               if (total < target) left <- left + 1L
               else if (total > target) right <- right - 1L
               else return(target)
           }
       }
       best
   }