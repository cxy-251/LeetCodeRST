0016. 3Sum Closest
==================

题目信息
--------

:题号: 0016
:难度: Medium
:主题: 数组、排序、双指针、最优候选
:原题: `LeetCode 0016 <https://leetcode.com/problems/3sum-closest/>`_
:访问状态: Available
:教学重点: 固定锚点、单调移动、最近候选不变量、差值比较

题目重述
--------

给定一个长度至少为 ``3`` 的整数数组 ``nums`` 和目标值 ``target``，选择三个不同下标，
使三数之和与 ``target`` 的距离最小，返回这个三数之和。

题目保证最接近目标的答案唯一。返回的是数值总和，不需要返回三个下标或三元组本身。

自建示例
--------

目标位于候选之间
~~~~~~~~~~~~~~~~

.. code-block:: text

   输入：nums = [-1, 2, 1, -4], target = 1
   排序：[-4, -1, 1, 2]
   最接近的三数和为 -1 + 1 + 2 = 2
   输出：2

存在精确命中
~~~~~~~~~~~~

.. code-block:: text

   输入：nums = [4, -2, 7, 1], target = 6
   三数和 -2 + 1 + 7 = 6
   输出：6

全为正数
~~~~~~~~

.. code-block:: text

   输入：nums = [5, 8, 12, 20], target = 1
   最小的三数和 5 + 8 + 12 = 25 已是最近答案。
   输出：25

恰好三个元素
~~~~~~~~~~~~

.. code-block:: text

   输入：nums = [-3, 10, 4], target = 8
   唯一可选总和为 11。
   输出：11

问题抽象
--------

排序后固定第一个数 ``nums[i]``，用 ``left`` 和 ``right`` 枚举右侧区间。当前总和为：

.. math::

   sum = nums[i] + nums[left] + nums[right]

与 0015 不同，本题不要求 ``sum`` 必须等于目标，而是始终维护目前差值最小的 ``best``：

.. math::

   |best - target| = \min |seen\_sum - target|

指针移动仍由有序性决定：

* ``sum < target``：需要尝试更大的和，移动 ``left``；
* ``sum > target``：需要尝试更小的和，移动 ``right``；
* ``sum == target``：距离已经为 ``0``，可以立即返回。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 空间复杂度
     - 取舍
   * - 排序、固定锚点、双指针
     - ``O(n^2)``
     - 取决于排序实现
     - 主解法；复用和的单调性，每个锚点线性扫描
   * - 枚举所有三元组
     - ``O(n^3)``
     - ``O(1)``
     - 容易验证，但无法处理较大输入
   * - 为每个锚点枚举第二数并二分第三数
     - ``O(n^2 log n)``
     - 取决于排序
     - 正确但比双指针多一个对数因子，边界候选也更繁琐

主解法：双指针维护最近和
----------------------

初始化最近候选
~~~~~~~~~~~~

排序后先用前三个元素的总和初始化 ``best``。这样在进入循环前，``best`` 已经对应一个真实
三元组，不需要使用无穷大哨兵，也不会在返回时出现“从未更新”的状态。

.. code-block:: text

   best = nums[0] + nums[1] + nums[2]

每次得到 ``sum`` 后，若：

.. math::

   |sum - target| < |best - target|

就令 ``best = sum``。题目保证最近答案唯一，因此相等差值无需额外定义取舍。

状态含义
~~~~~~~~

算法维护：

* ``i``：固定锚点；
* ``left``、``right``：当前未排除的有序候选区间；
* ``sum``：当前三元组总和；
* ``best``：所有已经检查或经过边界比较的三元组中，距离目标最近的总和。

为什么移动方向正确
~~~~~~~~~~~~~~~~~~

固定 ``i``：

* 若 ``sum < target``，当前和需要增大。减小 ``right`` 只会让和不增，因此不能更接近位于
  当前和上方的目标；移动 ``left`` 是唯一可能得到更大和的方向；
* 若 ``sum > target``，当前和需要减小。增大 ``left`` 只会让和不减，因此移动 ``right``；
* 若 ``sum == target``，绝对差已经达到理论下界 ``0``，不存在更优答案。

这里的移动不会要求被丢弃指针上的所有组合都“比 best 更差”。关键是当前组合已经先与
``best`` 比较；随后根据目标相对位置，保留唯一可能越过当前和、继续逼近目标的方向。

核心不变量
~~~~~~~~~~

每轮双指针循环开始时：

* ``best`` 是此前所有已检查三元组中的最近总和；
* 当前 ``left`` 与 ``right`` 之间仍包含所有尚可能改善 ``best`` 的候选边界；
* 已删除的左端是在某次 ``sum < target`` 后删除，已删除的右端是在某次
  ``sum > target`` 后删除；
* 每轮先用当前 ``sum`` 更新 ``best``，再做单调移动，因此不会在丢弃边界前遗漏其最佳贡献。

正确性依据
~~~~~~~~~~

排序不改变任何三元组的和。固定锚点后，令函数：

.. math::

   f(left, right) = nums[i] + nums[left] + nums[right]

它随 ``left`` 增大而不减，随 ``right`` 减小而不增。

当前和小于目标时，本轮已经把它与 ``best`` 比较。对于更小的右端，总和只会更小，无法从
当前和向目标方向靠近；因此保留 ``right`` 并增大 ``left`` 足以覆盖所有可能改善答案的路径。
当前和大于目标时对称地减小 ``right``。若精确命中，差值为零，立即返回必然最优。

每个锚点的两个指针最多各单向走完整个区间。外层枚举所有锚点，因此所有可能成为最近候选的
边界组合都会被检查，``best`` 最终就是全局最近三数和。

复杂度
~~~~~~

设数组长度为 ``n``：

* 排序时间复杂度为 ``O(n log n)``；
* 外层锚点与内层线性双指针合计 ``O(n^2)``；
* 总时间复杂度为 ``O(n^2)``；
* 额外空间取决于排序实现，返回值只占常数空间。

核心语言实现
------------

C
~

.. code-block:: c

   #include <limits.h>
   #include <stdlib.h>

   static int compare_ints(const void* left, const void* right) {
       int a = *(const int*)left;
       int b = *(const int*)right;
       return (a > b) - (a < b);
   }

   static long long distance_to(long long value, long long target) {
       long long difference = value - target;
       return difference < 0 ? -difference : difference;
   }

   int threeSumClosest(int* nums, int numsSize, int target) {
       qsort(nums, numsSize, sizeof(int), compare_ints);

       long long best =
           (long long)nums[0] + nums[1] + nums[2];

       for (int i = 0; i < numsSize - 2; ++i) {
           int left = i + 1;
           int right = numsSize - 1;

           while (left < right) {
               long long sum =
                   (long long)nums[i] + nums[left] + nums[right];

               if (distance_to(sum, target) <
                   distance_to(best, target)) {
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

       return (int)best;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       int threeSumClosest(vector<int>& nums, int target) {
           sort(nums.begin(), nums.end());

           long long best =
               static_cast<long long>(nums[0]) +
               nums[1] + nums[2];

           for (int i = 0;
                i + 2 < static_cast<int>(nums.size());
                ++i) {
               int left = i + 1;
               int right = static_cast<int>(nums.size()) - 1;

               while (left < right) {
                   long long sum =
                       static_cast<long long>(nums[i]) +
                       nums[left] + nums[right];

                   if (std::abs(sum - target) <
                       std::abs(best - target)) {
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
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def threeSumClosest(self, nums: list[int], target: int) -> int:
           nums.sort()
           best = nums[0] + nums[1] + nums[2]

           for i in range(len(nums) - 2):
               left = i + 1
               right = len(nums) - 1

               while left < right:
                   total = nums[i] + nums[left] + nums[right]

                   if abs(total - target) < abs(best - target):
                       best = total

                   if total < target:
                       left += 1
                   elif total > target:
                       right -= 1
                   else:
                       return target

           return best

Java
~~~~

.. code-block:: java

   class Solution {
       public int threeSumClosest(int[] nums, int target) {
           Arrays.sort(nums);

           long best = (long) nums[0] + nums[1] + nums[2];

           for (int i = 0; i + 2 < nums.length; ++i) {
               int left = i + 1;
               int right = nums.length - 1;

               while (left < right) {
                   long sum =
                       (long) nums[i] + nums[left] + nums[right];

                   if (Math.abs(sum - target) <
                       Math.abs(best - target)) {
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

           return (int) best;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn three_sum_closest(
           mut nums: Vec<i32>,
           target: i32,
       ) -> i32 {
           nums.sort_unstable();

           let target = target as i64;
           let mut best =
               nums[0] as i64 +
               nums[1] as i64 +
               nums[2] as i64;

           for i in 0..nums.len() - 2 {
               let mut left = i + 1;
               let mut right = nums.len() - 1;

               while left < right {
                   let sum =
                       nums[i] as i64 +
                       nums[left] as i64 +
                       nums[right] as i64;

                   if (sum - target).abs() <
                      (best - target).abs() {
                       best = sum;
                   }

                   if sum < target {
                       left += 1;
                   } else if sum > target {
                       right -= 1;
                   } else {
                       return target as i32;
                   }
               }
           }

           best as i32
       }
   }

Go
~~

.. code-block:: go

   func threeSumClosest(nums []int, target int) int {
       sort.Ints(nums)
       best := nums[0] + nums[1] + nums[2]

       abs := func(value int) int {
           if value < 0 {
               return -value
           }
           return value
       }

       for i := 0; i+2 < len(nums); i++ {
           left, right := i+1, len(nums)-1

           for left < right {
               total := nums[i] + nums[left] + nums[right]

               if abs(total-target) < abs(best-target) {
                   best = total
               }

               if total < target {
                   left++
               } else if total > target {
                   right--
               } else {
                   return target
               }
           }
       }

       return best
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function threeSumClosest(
       nums: number[],
       target: number,
   ): number {
       nums.sort((a, b) => a - b);
       let best = nums[0] + nums[1] + nums[2];

       for (let i = 0; i + 2 < nums.length; i += 1) {
           let left = i + 1;
           let right = nums.length - 1;

           while (left < right) {
               const total = nums[i] + nums[left] + nums[right];

               if (
                   Math.abs(total - target) <
                   Math.abs(best - target)
               ) {
                   best = total;
               }

               if (total < target) {
                   left += 1;
               } else if (total > target) {
                   right -= 1;
               } else {
                   return target;
               }
           }
       }

       return best;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int ThreeSumClosest(int[] nums, int target) {
           Array.Sort(nums);

           long best = (long) nums[0] + nums[1] + nums[2];

           for (int i = 0; i + 2 < nums.Length; ++i) {
               int left = i + 1;
               int right = nums.Length - 1;

               while (left < right) {
                   long sum =
                       (long) nums[i] + nums[left] + nums[right];

                   if (Math.Abs(sum - target) <
                       Math.Abs(best - target)) {
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

           return (int) best;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function three_sum_closest(
       nums::Vector{Int},
       target::Int,
   )::Int
       sort!(nums)
       best = nums[1] + nums[2] + nums[3]

       for i in 1:(length(nums) - 2)
           left = i + 1
           right = length(nums)

           while left < right
               total = nums[i] + nums[left] + nums[right]

               if abs(total - target) < abs(best - target)
                   best = total
               end

               if total < target
                   left += 1
               elseif total > target
                   right -= 1
               else
                   return target
               end
           end
       end

       return best
   end

R
~

.. code-block:: r

   threeSumClosest <- function(nums, target) {
       nums <- sort(as.integer(nums))
       n <- length(nums)
       best <- nums[1] + nums[2] + nums[3]

       for (i in seq_len(n - 2)) {
           left <- i + 1
           right <- n

           while (left < right) {
               total <- nums[i] + nums[left] + nums[right]

               if (abs(total - target) < abs(best - target)) {
                   best <- total
               }

               if (total < target) {
                   left <- left + 1
               } else if (total > target) {
                   right <- right - 1
               } else {
                   return(target)
               }
           }
       }

       best
   }

关键边界与易错点
----------------

* 必须先用真实三元组初始化 ``best``，不能让未定义哨兵参与最终返回；
* 当前和要先更新 ``best``，再移动指针，否则可能丢掉刚被检查的最近候选；
* 精确命中目标后可立即返回，因为绝对差不可能小于 ``0``；
* 本题返回总和，不需要保存三元组，也不要求像 0015 那样进行结果去重；
* 多个整数求和和做差时，固定宽度语言可使用更宽中间类型，避免潜在溢出；
* 排序会修改输入；需要保留原数组时先复制。

新增与强化知识
--------------

新增
~~~~

* **最近候选不变量**：``best`` 始终是目前已检查候选中距离目标最近的真实总和；
* **先评价再排除**：当前边界组合必须先与最优值比较，之后才能按单调方向删除指针；
* **精确命中下界**：绝对差的理论下界是零，命中后无需继续搜索。

强化
~~~~

* 0015 的固定锚点与双指针结构直接复用，本题把“寻找等于零”改为“维护离目标最近”；
* 双指针移动仍来自排序后的和单调性；
* 0011 的宽类型中间计算继续用于保护和与差值。

关联题目
--------

* `0015. 3Sum <0015-3sum.rst>`_：同样固定锚点并扫描两端，目标是枚举所有精确零和；
* `0011. Container With Most Water <0011-container-with-most-water.rst>`_：同样通过单调依据只移动
  一个边界。

最小自检
--------

#. 为什么 ``best`` 应由前三个排序后元素初始化？
#. 当前和小于目标时，为什么移动 ``left`` 而不是 ``right``？
#. 为什么必须在移动指针前更新 ``best``？
#. 命中 ``target`` 后为什么可以立即返回？
#. 本题为什么不需要像 0015 一样跳过所有重复值？

答案要点
~~~~~~~~

#. 它保证最近候选始终对应真实三元组，返回状态完整；
#. 增大 ``left`` 才可能增大有序三数和，减小 ``right`` 只会使和不增；
#. 当前组合可能就是全局最近候选，先移动会遗漏它的贡献；
#. 绝对差已达到不可突破的下界 ``0``；
#. 只返回一个最近总和，重复数值不会制造重复输出。
