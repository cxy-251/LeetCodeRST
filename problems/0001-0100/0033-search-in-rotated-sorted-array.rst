0033. Search in Rotated Sorted Array
====================================

题目信息
--------

:题号: 0033
:难度: Medium
:主题: 数组、二分查找、旋转有序数组、区间排除
:原题: `LeetCode 0033 <https://leetcode.com/problems/search-in-rotated-sorted-array/>`_
:访问状态: Available
:教学重点: 每轮识别有序半区、目标范围判断、保持对数复杂度、无重复元素前提

题目重述
--------

给定一个原本严格递增、随后在某个未知位置旋转过的整数数组 ``nums``，以及目标值
``target``。数组元素互不相同，需要返回目标值的零基下标；不存在时返回 ``-1``。

例如严格递增数组 ``[0, 1, 2, 4, 5, 6, 7]`` 在值 ``4`` 之前切开并交换两段后，可能变成
``[4, 5, 6, 7, 0, 1, 2]``。要求算法时间复杂度为 ``O(log n)``。

自建示例
--------

目标位于左侧有序段
~~~~~~~~~~~~~~~~~~

.. code-block:: text

   nums = [4, 5, 6, 7, 0, 1, 2]
   target = 6
   返回 2

目标位于右侧有序段
~~~~~~~~~~~~~~~~~~

.. code-block:: text

   nums = [4, 5, 6, 7, 0, 1, 2]
   target = 1
   返回 5

目标不存在
~~~~~~~~~~

.. code-block:: text

   nums = [6, 7, 8, 1, 2, 3, 4, 5]
   target = 9
   返回 -1

没有发生有效旋转
~~~~~~~~~~~~~~~~

.. code-block:: text

   nums = [1, 3, 5, 8]
   target = 3
   返回 1

单元素数组
~~~~~~~~~~

.. code-block:: text

   nums = [7]
   target = 7
   返回 0

问题抽象
--------

普通二分查找依赖整个搜索区间有序。旋转数组整体可能在旋转点处下降，但对任意搜索区间
``[left, right]``，取中点 ``mid`` 后至少有一半仍然有序：

* 若 ``nums[left] <= nums[mid]``，左半区 ``[left, mid]`` 有序；
* 否则右半区 ``[mid, right]`` 有序。

识别出有序半区后，可以判断 ``target`` 是否落在该半区的值域内：

* 落在有序半区内，就保留这一半；
* 不落在其中，就排除这一半并搜索另一侧。

数组元素互不相同，使 ``nums[left] <= nums[mid]`` 能可靠判定左半区是否有序；若允许重复值，
边界值相等时可能无法判断旋转点位于哪一侧。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 取舍
   * - 每轮识别有序半区的二分查找
     - ``O(log n)``
     - ``O(1)``
     - 主解法；直接满足复杂度要求
   * - 先二分寻找旋转点，再普通二分
     - ``O(log n)``
     - ``O(1)``
     - 可行，但需要两阶段和更多边界处理
   * - 线性扫描
     - ``O(n)``
     - ``O(1)``
     - 逻辑简单，未利用局部有序结构

主解法：识别有序半区并排除另一半
----------------------------------

状态含义
~~~~~~~~

维护闭区间 ``[left, right]``：

* 区间外的下标已经证明不可能是目标位置；
* 若目标存在，它一定仍位于当前闭区间；
* ``mid = left + (right - left) / 2``，避免直接相加的整数溢出习惯问题。

每轮先检查 ``nums[mid] == target``。未命中时再判断哪一半有序，并使用严格或非严格边界决定
目标是否属于该半区。

左半区有序时
~~~~~~~~~~~~

当 ``nums[left] <= nums[mid]``：

* 若 ``nums[left] <= target < nums[mid]``，目标若存在只能在 ``[left, mid - 1]``；
* 否则目标只能在 ``[mid + 1, right]``。

右半区有序时
~~~~~~~~~~~~

当左半区无序时，右半区必然有序：

* 若 ``nums[mid] < target <= nums[right]``，保留 ``[mid + 1, right]``；
* 否则保留 ``[left, mid - 1]``。

注意目标与 ``nums[mid]`` 相等的情况已经提前返回，因此值域判断一侧使用严格不等号，避免把
中点再次留在新区间中。

核心不变量
~~~~~~~~~~

每轮循环开始时：

* 若 ``target`` 存在，它的下标位于 ``[left, right]``；
* 当前区间仍是某个严格递增数组的旋转结果；
* 至少一个由 ``mid`` 划分出的半区是严格递增的；
* 被排除的半区要么值域不包含 ``target``，要么中点已确认不是目标。

每轮至少排除中点及一侧区间，搜索长度严格缩小。

执行过程
~~~~~~~~

以 ``nums = [4, 5, 6, 7, 0, 1, 2]``、``target = 1`` 为例：

.. list-table::
   :header-rows: 1

   * - ``left``
     - ``mid``
     - ``right``
     - 判断
     - 新区间
   * - 0
     - 3
     - 6
     - 左半区 ``[4,5,6,7]`` 有序，1 不在其值域
     - ``[4,6]``
   * - 4
     - 5
     - 6
     - ``nums[5] == 1``
     - 返回 5

正确性依据
~~~~~~~~~~

先证明每轮排除安全。由于当前区间是严格递增数组的旋转，旋转点至多落在左右两半中的一半，
所以至少一半不跨越旋转点并保持严格递增。算法通过端点与中点值识别这一有序半区。

若目标值位于该半区的闭开值域内，严格递增性保证目标不可能出现在另一半，只保留有序半区是
安全的。若目标值不在该值域内，即使目标存在，也不可能位于该有序半区，因此排除它是安全的。
中点已提前检查，更新到 ``mid - 1`` 或 ``mid + 1`` 不会漏掉答案。

由循环不变量，目标若存在始终留在搜索区间中。每轮区间长度严格缩小，最终要么在某个中点命中，
要么区间为空。区间为空时所有位置都已被安全排除，因此返回 ``-1`` 正确。

复杂度
~~~~~~

设数组长度为 ``n``：

* 每轮把搜索区间至少缩小约一半，时间复杂度为 ``O(log n)``；
* 只使用固定数量索引，额外空间复杂度为 ``O(1)``。

核心语言实现
------------

C
~

.. code-block:: c

   int search(int *nums, int numsSize, int target) {
       int left = 0;
       int right = numsSize - 1;

       while (left <= right) {
           int mid = left + (right - left) / 2;

           if (nums[mid] == target) {
               return mid;
           }

           if (nums[left] <= nums[mid]) {
               /* 左半区有序，检查目标是否落在其值域内。 */
               if (nums[left] <= target && target < nums[mid]) {
                   right = mid - 1;
               } else {
                   left = mid + 1;
               }
           } else {
               /* 左半区跨越旋转点，因此右半区必然有序。 */
               if (nums[mid] < target && target <= nums[right]) {
                   left = mid + 1;
               } else {
                   right = mid - 1;
               }
           }
       }

       return -1;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       int search(const std::vector<int>& nums, int target) {
           int left = 0;
           int right = static_cast<int>(nums.size()) - 1;

           while (left <= right) {
               int mid = left + (right - left) / 2;

               if (nums[mid] == target) {
                   return mid;
               }

               if (nums[left] <= nums[mid]) {
                   if (nums[left] <= target && target < nums[mid]) {
                       right = mid - 1;
                   } else {
                       left = mid + 1;
                   }
               } else {
                   if (nums[mid] < target && target <= nums[right]) {
                       left = mid + 1;
                   } else {
                       right = mid - 1;
                   }
               }
           }

           return -1;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def search(self, nums: list[int], target: int) -> int:
           left = 0
           right = len(nums) - 1

           while left <= right:
               mid = left + (right - left) // 2

               if nums[mid] == target:
                   return mid

               if nums[left] <= nums[mid]:
                   if nums[left] <= target < nums[mid]:
                       right = mid - 1
                   else:
                       left = mid + 1
               else:
                   if nums[mid] < target <= nums[right]:
                       left = mid + 1
                   else:
                       right = mid - 1

           return -1

Java
~~~~

.. code-block:: java

   class Solution {
       public int search(int[] nums, int target) {
           int left = 0;
           int right = nums.length - 1;

           while (left <= right) {
               int mid = left + (right - left) / 2;

               if (nums[mid] == target) {
                   return mid;
               }

               if (nums[left] <= nums[mid]) {
                   if (nums[left] <= target && target < nums[mid]) {
                       right = mid - 1;
                   } else {
                       left = mid + 1;
                   }
               } else {
                   if (nums[mid] < target && target <= nums[right]) {
                       left = mid + 1;
                   } else {
                       right = mid - 1;
                   }
               }
           }

           return -1;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn search(nums: Vec<i32>, target: i32) -> i32 {
           let mut left: i32 = 0;
           let mut right: i32 = nums.len() as i32 - 1;

           while left <= right {
               let mid = left + (right - left) / 2;
               let l = left as usize;
               let m = mid as usize;
               let r = right as usize;

               if nums[m] == target {
                   return mid;
               }

               if nums[l] <= nums[m] {
                   if nums[l] <= target && target < nums[m] {
                       right = mid - 1;
                   } else {
                       left = mid + 1;
                   }
               } else if nums[m] < target && target <= nums[r] {
                   left = mid + 1;
               } else {
                   right = mid - 1;
               }
           }

           -1
       }
   }

Rust 使用有符号索引保存可能变成 ``-1`` 的 ``right``，仅在循环确认索引有效后转换为
``usize`` 访问数组。

Go
~~

.. code-block:: go

   func search(nums []int, target int) int {
       left, right := 0, len(nums)-1

       for left <= right {
           mid := left + (right-left)/2

           if nums[mid] == target {
               return mid
           }

           if nums[left] <= nums[mid] {
               if nums[left] <= target && target < nums[mid] {
                   right = mid - 1
               } else {
                   left = mid + 1
               }
           } else if nums[mid] < target && target <= nums[right] {
               left = mid + 1
           } else {
               right = mid - 1
           }
       }

       return -1
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function search(nums: number[], target: number): number {
       let left = 0;
       let right = nums.length - 1;

       while (left <= right) {
           const mid = left + Math.floor((right - left) / 2);

           if (nums[mid] === target) {
               return mid;
           }

           if (nums[left] <= nums[mid]) {
               if (nums[left] <= target && target < nums[mid]) {
                   right = mid - 1;
               } else {
                   left = mid + 1;
               }
           } else if (nums[mid] < target && target <= nums[right]) {
               left = mid + 1;
           } else {
               right = mid - 1;
           }
       }

       return -1;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int Search(int[] nums, int target) {
           int left = 0;
           int right = nums.Length - 1;

           while (left <= right) {
               int mid = left + (right - left) / 2;

               if (nums[mid] == target) {
                   return mid;
               }

               if (nums[left] <= nums[mid]) {
                   if (nums[left] <= target && target < nums[mid]) {
                       right = mid - 1;
                   } else {
                       left = mid + 1;
                   }
               } else if (nums[mid] < target && target <= nums[right]) {
                   left = mid + 1;
               } else {
                   right = mid - 1;
               }
           }

           return -1;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function search_rotated(nums::Vector{Int}, target::Int)::Int
       left = 1
       right = length(nums)

       while left <= right
           mid = left + (right - left) ÷ 2

           if nums[mid] == target
               return mid - 1  # LeetCode 接口返回零基下标。
           end

           if nums[left] <= nums[mid]
               if nums[left] <= target < nums[mid]
                   right = mid - 1
               else
                   left = mid + 1
               end
           elseif nums[mid] < target <= nums[right]
               left = mid + 1
           else
               right = mid - 1
           end
       end

       return -1
   end

Julia 的链式比较 ``a <= b < c`` 按数学语义工作；内部使用一基索引，命中时转换为零基返回值。

R
~

.. code-block:: r

   search_rotated <- function(nums, target) {
     left <- 1L
     right <- length(nums)

     while (left <= right) {
       mid <- left + (right - left) %/% 2L

       if (nums[[mid]] == target) {
         return(mid - 1L)  # 对外返回零基下标。
       }

       if (nums[[left]] <= nums[[mid]]) {
         if (nums[[left]] <= target && target < nums[[mid]]) {
           right <- mid - 1L
         } else {
           left <- mid + 1L
         }
       } else if (nums[[mid]] < target && target <= nums[[right]]) {
         left <- mid + 1L
       } else {
         right <- mid - 1L
       }
     }

     -1L
   }

关键边界
--------

* 空数组：初始 ``right = -1``，循环不执行并返回 ``-1``；
* 单元素数组：中点就是唯一位置；
* 未旋转数组：每轮左半区判断仍成立，退化为普通二分查找；
* 旋转点恰在中点附近：算法只依赖当前半区是否有序，不需要显式找到旋转点；
* 目标等于左右端点：值域判断必须包含对应端点；
* 元素互不相同：这是能够稳定判断有序半区的重要前提。

易错点
------

* 把 ``nums[left] < nums[mid]`` 写成严格小于，单元素左半区时可能误判；
* 左半区值域错误写成 ``target <= nums[mid]``，把已检查过的中点再次保留；
* 识别有序半区后仍按普通数组比较 ``target`` 与 ``nums[mid]``，会在跨旋转点时错误排除；
* 使用半开区间代码，却沿用闭区间的 ``left <= right`` 和 ``mid ± 1`` 更新；
* 忽略重复元素版本的歧义，把本题结论直接迁移到允许重复值的题目。

新增与强化知识
--------------

新增
~~~~

* 旋转有序数组虽然整体不单调，但任意中点划分后至少一半保持有序；
* 二分查找的核心不是固定比较式，而是每轮证明可以安全排除一部分候选；
* 端点值域可以把“目标是否位于有序半区”转化为常数时间判断。

强化
~~~~

* 复用 0004 的二分区间缩小思想，但本题每轮先识别局部单调结构；
* 继续使用闭区间不变量与防溢出的中点公式；
* Julia、R 内部一基访问与 LeetCode 零基返回值需要显式转换。

最小自检
--------

#. 为什么每轮至少有一半区间是严格递增的？
#. ``nums[left] <= nums[mid]`` 时，怎样判断目标是否应留在左半区？
#. 为什么命中检查必须放在半区值域判断之前？
#. 若数组允许大量重复值，``nums[left] == nums[mid]`` 会带来什么问题？
#. 搜索区间为空时，为什么可以安全返回 ``-1``？

答案要点
~~~~~~~~

#. 旋转点只有一个，不可能同时位于中点两侧的两个半区内部。
#. 检查 ``nums[left] <= target < nums[mid]``。
#. 值域使用严格边界排除中点，必须先确认中点本身是否命中。
#. 无法确定左半区是真的有序，还是相等值掩盖了旋转点。
#. 循环不变量保证目标若存在始终在当前区间；空区间说明所有位置都已安全排除。
