0034. Find First and Last Position of Element in Sorted Array
=============================================================

题目信息
--------

:题号: 0034
:难度: Medium
:主题: 数组、二分查找、边界定位、重复元素
:原题: `LeetCode 0034 <https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/>`_
:访问状态: Available
:教学重点: lower bound、upper bound、半开区间、存在性验证、重复值边界

题目重述
--------

给定一个按非递减顺序排列的整数数组 ``nums`` 和目标值 ``target``，返回目标值第一次出现与
最后一次出现的零基下标 ``[first, last]``。若目标不存在，返回 ``[-1, -1]``。

要求算法整体时间复杂度为 ``O(log n)``，因此不能从命中位置向左右线性扩展。

自建示例
--------

目标重复出现
~~~~~~~~~~~~

.. code-block:: text

   nums = [1, 2, 2, 2, 4, 7]
   target = 2
   返回 [1, 3]

目标只出现一次
~~~~~~~~~~~~~~

.. code-block:: text

   nums = [1, 3, 5, 8]
   target = 5
   返回 [2, 2]

目标不存在
~~~~~~~~~~

.. code-block:: text

   nums = [1, 2, 4, 6]
   target = 3
   返回 [-1, -1]

目标位于数组边缘
~~~~~~~~~~~~~~~~

.. code-block:: text

   nums = [5, 5, 5, 9]
   target = 5
   返回 [0, 2]

空数组
~~~~~~

.. code-block:: text

   nums = []
   target = 4
   返回 [-1, -1]

问题抽象
--------

重复元素使“找到任意一个目标位置”不足以回答问题。可以把答案改写成两个插入边界：

* ``lower_bound(target)``：第一个满足 ``nums[index] >= target`` 的位置；
* ``upper_bound(target)``：第一个满足 ``nums[index] > target`` 的位置。

若目标存在：

.. code-block:: text

   first = lower_bound(target)
   last  = upper_bound(target) - 1

例如 ``[1, 2, 2, 2, 4]`` 中：

.. code-block:: text

   lower_bound(2) = 1
   upper_bound(2) = 4
   答案 = [1, 3]

两个边界都可以在半开区间 ``[left, right)`` 中用二分查找完成。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 取舍
   * - 两次边界二分
     - ``O(log n)``
     - ``O(1)``
     - 主解法；统一处理重复值、缺失值和数组两端
   * - 先找任意目标，再向两侧扩展
     - 最坏 ``O(n)``
     - ``O(1)``
     - 大量重复值时不满足复杂度要求
   * - 一次线性扫描
     - ``O(n)``
     - ``O(1)``
     - 没有利用数组有序性

主解法：lower bound 与 upper bound
----------------------------------

半开区间状态
~~~~~~~~~~~~

边界函数维护半开区间 ``[left, right)``，初始为 ``[0, n)``：

* ``left`` 之前的位置已证明不满足所求边界条件；
* ``right`` 及其之后的位置可视为已经满足边界条件；
* 答案始终位于 ``[left, right]`` 的边界位置中；
* 当 ``left == right`` 时，该位置就是第一个满足条件的插入点。

半开区间允许返回 ``n``，表示所有数组元素都位于目标边界左侧。

寻找 lower bound
~~~~~~~~~~~~~~~~

寻找第一个 ``nums[index] >= target`` 的位置：

* 若 ``nums[mid] < target``，中点和它左侧都不可能成为答案，令 ``left = mid + 1``；
* 否则中点已经满足条件，但可能不是第一个，令 ``right = mid``。

循环结束时，``left`` 是第一个大于等于目标的位置。

寻找 upper bound
~~~~~~~~~~~~~~~~

寻找第一个 ``nums[index] > target`` 的位置，只需改变一个比较条件：

* 若 ``nums[mid] <= target``，令 ``left = mid + 1``；
* 否则令 ``right = mid``。

这个细微差异决定相等元素被归入边界左侧还是右侧。

存在性验证
~~~~~~~~~~

``lower_bound(target)`` 即使目标不存在也会返回合法插入位置。例如在 ``[1, 2, 4]`` 中搜索
``3``，下界是下标 2，但 ``nums[2]`` 是 4。

因此取得 ``first`` 后必须验证：

.. code-block:: text

   first < n 且 nums[first] == target

验证失败时直接返回 ``[-1, -1]``，无需再解释插入位置为真实命中。

核心不变量
~~~~~~~~~~

以 ``lower_bound`` 为例，每轮开始时：

* 所有下标小于 ``left`` 的元素都严格小于 ``target``；
* 所有下标大于等于 ``right`` 的元素都大于等于 ``target``；
* 第一个大于等于目标的位置位于 ``[left, right]``。

``upper_bound`` 的不变量只需替换为：左侧元素小于等于目标，右侧元素严格大于目标。

正确性依据
~~~~~~~~~~

先证明 ``lower_bound``。当 ``nums[mid] < target`` 时，由数组非递减可知 ``mid`` 左侧所有元素
也小于目标，所以将 ``left`` 移到 ``mid + 1`` 不会越过第一个大于等于目标的位置。当
``nums[mid] >= target`` 时，中点满足边界条件，但更早位置可能也满足，因此保留中点并令
``right = mid``。不变量在两种更新后都成立。

区间长度每轮严格缩小，最终 ``left == right``。此时左侧全部不满足条件，当前位置及右侧满足
条件，所以 ``left`` 恰是第一个大于等于目标的位置。``upper_bound`` 使用同样证明，只把判定
条件改成严格大于。

目标存在时，所有目标值构成连续区间。其左端正是第一个大于等于目标的位置，其右端之后正是
第一个严格大于目标的位置，因此 ``[lower, upper - 1]`` 是准确答案。目标不存在时，显式验证会
返回 ``[-1, -1]``。

复杂度
~~~~~~

设数组长度为 ``n``：

* 两次二分各执行 ``O(log n)`` 轮，总时间复杂度仍为 ``O(log n)``；
* 只使用固定数量索引，额外空间复杂度为 ``O(1)``。

核心语言实现
------------

C
~

.. code-block:: c

   static int lower_bound_value(
       int *nums,
       int numsSize,
       int target
   ) {
       int left = 0;
       int right = numsSize;

       while (left < right) {
           int mid = left + (right - left) / 2;

           if (nums[mid] < target) {
               left = mid + 1;
           } else {
               right = mid;
           }
       }

       return left;
   }

   static int upper_bound_value(
       int *nums,
       int numsSize,
       int target
   ) {
       int left = 0;
       int right = numsSize;

       while (left < right) {
           int mid = left + (right - left) / 2;

           if (nums[mid] <= target) {
               left = mid + 1;
           } else {
               right = mid;
           }
       }

       return left;
   }

   int *searchRange(
       int *nums,
       int numsSize,
       int target,
       int *returnSize
   ) {
       int *answer = malloc(2 * sizeof(int));
       *returnSize = 2;
       answer[0] = -1;
       answer[1] = -1;

       int first = lower_bound_value(nums, numsSize, target);
       if (first == numsSize || nums[first] != target) {
           return answer;
       }

       answer[0] = first;
       answer[1] = upper_bound_value(nums, numsSize, target) - 1;
       return answer;
   }

C 需要 ``<stdlib.h>``。返回数组由调用者释放；边界函数不分配内存。

C++
~~~

.. code-block:: cpp

   class Solution {
   private:
       int lowerBound(
           const std::vector<int>& nums,
           int target
       ) {
           int left = 0;
           int right = static_cast<int>(nums.size());

           while (left < right) {
               int mid = left + (right - left) / 2;
               if (nums[mid] < target) {
                   left = mid + 1;
               } else {
                   right = mid;
               }
           }

           return left;
       }

       int upperBound(
           const std::vector<int>& nums,
           int target
       ) {
           int left = 0;
           int right = static_cast<int>(nums.size());

           while (left < right) {
               int mid = left + (right - left) / 2;
               if (nums[mid] <= target) {
                   left = mid + 1;
               } else {
                   right = mid;
               }
           }

           return left;
       }

   public:
       std::vector<int> searchRange(
           std::vector<int>& nums,
           int target
       ) {
           int first = lowerBound(nums, target);

           if (first == static_cast<int>(nums.size()) ||
               nums[first] != target) {
               return {-1, -1};
           }

           return {first, upperBound(nums, target) - 1};
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def searchRange(
           self,
           nums: list[int],
           target: int,
       ) -> list[int]:
           def lower_bound(strict: bool) -> int:
               left = 0
               right = len(nums)

               while left < right:
                   mid = left + (right - left) // 2
                   move_right = nums[mid] < target
                   if strict:
                       move_right = nums[mid] <= target

                   if move_right:
                       left = mid + 1
                   else:
                       right = mid

               return left

           first = lower_bound(False)
           if first == len(nums) or nums[first] != target:
               return [-1, -1]

           return [first, lower_bound(True) - 1]

这里的 ``strict`` 表示寻找“严格大于目标”的上界。生产代码也可以拆成两个命名函数，以减少
布尔参数带来的阅读负担。

Java
~~~~

.. code-block:: java

   class Solution {
       private int lowerBound(int[] nums, int target, boolean upper) {
           int left = 0;
           int right = nums.length;

           while (left < right) {
               int mid = left + (right - left) / 2;
               boolean moveRight = nums[mid] < target;

               if (upper) {
                   moveRight = nums[mid] <= target;
               }

               if (moveRight) {
                   left = mid + 1;
               } else {
                   right = mid;
               }
           }

           return left;
       }

       public int[] searchRange(int[] nums, int target) {
           int first = lowerBound(nums, target, false);

           if (first == nums.length || nums[first] != target) {
               return new int[] {-1, -1};
           }

           int afterLast = lowerBound(nums, target, true);
           return new int[] {first, afterLast - 1};
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       fn boundary(nums: &[i32], target: i32, upper: bool) -> usize {
           let mut left: usize = 0;
           let mut right: usize = nums.len();

           while left < right {
               let mid = left + (right - left) / 2;
               let move_right = if upper {
                   nums[mid] <= target
               } else {
                   nums[mid] < target
               };

               if move_right {
                   left = mid + 1;
               } else {
                   right = mid;
               }
           }

           left
       }

       pub fn search_range(nums: Vec<i32>, target: i32) -> Vec<i32> {
           let first = Self::boundary(&nums, target, false);

           if first == nums.len() || nums[first] != target {
               return vec![-1, -1];
           }

           let after_last = Self::boundary(&nums, target, true);
           vec![first as i32, after_last as i32 - 1]
       }
   }

半开区间让 Rust 全程使用 ``usize``，不需要保存 ``-1`` 下标；只在最终 LeetCode 返回值中转换为
``i32``。

Go
~~

.. code-block:: go

   func boundary(nums []int, target int, upper bool) int {
       left, right := 0, len(nums)

       for left < right {
           mid := left + (right-left)/2
           moveRight := nums[mid] < target

           if upper {
               moveRight = nums[mid] <= target
           }

           if moveRight {
               left = mid + 1
           } else {
               right = mid
           }
       }

       return left
   }

   func searchRange(nums []int, target int) []int {
       first := boundary(nums, target, false)

       if first == len(nums) || nums[first] != target {
           return []int{-1, -1}
       }

       return []int{first, boundary(nums, target, true) - 1}
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function searchRange(nums: number[], target: number): number[] {
       const boundary = (upper: boolean): number => {
           let left = 0;
           let right = nums.length;

           while (left < right) {
               const mid = left + Math.floor((right - left) / 2);
               const moveRight = upper
                   ? nums[mid] <= target
                   : nums[mid] < target;

               if (moveRight) {
                   left = mid + 1;
               } else {
                   right = mid;
               }
           }

           return left;
       };

       const first = boundary(false);
       if (first === nums.length || nums[first] !== target) {
           return [-1, -1];
       }

       return [first, boundary(true) - 1];
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       private int Boundary(int[] nums, int target, bool upper) {
           int left = 0;
           int right = nums.Length;

           while (left < right) {
               int mid = left + (right - left) / 2;
               bool moveRight = upper
                   ? nums[mid] <= target
                   : nums[mid] < target;

               if (moveRight) {
                   left = mid + 1;
               } else {
                   right = mid;
               }
           }

           return left;
       }

       public int[] SearchRange(int[] nums, int target) {
           int first = Boundary(nums, target, false);

           if (first == nums.Length || nums[first] != target) {
               return new int[] {-1, -1};
           }

           return new int[] {
               first,
               Boundary(nums, target, true) - 1
           };
       }
   }

Julia
~~~~~

.. code-block:: julia

   function boundary(nums::Vector{Int}, target::Int, upper::Bool)::Int
       left = 1
       right = length(nums) + 1

       while left < right
           mid = left + (right - left) ÷ 2
           move_right = upper ? nums[mid] <= target : nums[mid] < target

           if move_right
               left = mid + 1
           else
               right = mid
           end
       end

       return left
   end

   function search_range(nums::Vector{Int}, target::Int)::Vector{Int}
       first = boundary(nums, target, false)

       if first == length(nums) + 1 || nums[first] != target
           return [-1, -1]
       end

       after_last = boundary(nums, target, true)
       return [first - 1, after_last - 2]
   end

Julia 使用一基半开区间 ``[1, n + 1)``。``after_last`` 是最后目标后一位的一基位置，因此最后
目标的零基下标是 ``after_last - 2``。

R
~

.. code-block:: r

   boundary <- function(nums, target, upper) {
     left <- 1L
     right <- length(nums) + 1L

     while (left < right) {
       mid <- left + (right - left) %/% 2L
       move_right <- if (upper) {
         nums[[mid]] <= target
       } else {
         nums[[mid]] < target
       }

       if (move_right) {
         left <- mid + 1L
       } else {
         right <- mid
       }
     }

     left
   }

   search_range <- function(nums, target) {
     first <- boundary(nums, target, FALSE)

     if (first == length(nums) + 1L || nums[[first]] != target) {
       return(c(-1L, -1L))
     }

     after_last <- boundary(nums, target, TRUE)
     c(first - 1L, after_last - 2L)
   }

R 的 ``&&`` 适用于单个逻辑值。这里先判断 ``first`` 是否越过数组，再借助短路语义避免无效索引。

关键边界
--------

* 空数组：两个边界都为 0，存在性验证失败；
* 所有元素都等于目标：下界为 0，上界为 ``n``，答案为 ``[0, n - 1]``；
* 目标小于所有元素：下界为 0，但元素不相等；
* 目标大于所有元素：下界为 ``n``，必须先检查越界；
* 目标只出现一次：上界恰为下界加一；
* 重复区间位于数组开头或结尾：半开边界仍可返回 0 或 ``n``。

易错点
------

* 找到任意目标后线性扩展，导致最坏复杂度退化为 ``O(n)``；
* ``lower_bound`` 中把 ``right = mid`` 写成 ``mid - 1``，混用半开与闭区间；
* ``upper_bound`` 仍使用 ``nums[mid] < target``，得到的只是第二个下界；
* 未验证 ``first < n && nums[first] == target``，把插入位置误当成命中位置；
* 直接计算 ``upper_bound(target + 1)``，在 ``target`` 为整数上界时可能溢出；
* Julia/R 的一基边界转换少减或多减一。

新增与强化知识
--------------

新增
~~~~

* 二分查找可以定位“第一个满足单调谓词的位置”，不只用于寻找等值元素；
* lower bound 与 upper bound 的唯一核心差别，是相等值被放在边界哪一侧；
* 半开区间允许边界自然落在数组末尾 ``n``，非常适合插入位置问题。

强化
~~~~

* 0033 的闭区间二分以命中为目标，本题的半开区间二分以边界收敛为目标；
* 继续强化“先定义不变量，再选择比较符号和区间更新”；
* 避免通过 ``target + 1`` 模拟上界，优先直接表达严格大于谓词。

最小自检
--------

#. ``lower_bound`` 和 ``upper_bound`` 分别寻找什么位置？
#. 为什么 ``right`` 初始化为 ``n`` 而不是 ``n - 1``？
#. 目标不存在时，为什么下界仍可能位于数组内部？
#. 两个边界函数在相等元素上的比较条件有什么差别？
#. 为什么不能从任意命中点向左右扩展？

答案要点
~~~~~~~~

#. 第一个大于等于目标的位置；第一个严格大于目标的位置。
#. 半开区间需要允许答案位于数组末尾之后的插入位置 ``n``。
#. 下界表示插入点，并不保证该位置元素等于目标。
#. 下界遇到相等值向左收缩，上界遇到相等值向右越过。
#. 大量重复值时扩展长度可达 ``n``，违反 ``O(log n)`` 要求。
