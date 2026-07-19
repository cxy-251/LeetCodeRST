0081. Search in Rotated Sorted Array II
=======================================

题目信息
--------

:题号: 0081
:难度: Medium
:主题: 数组、二分查找、旋转有序数组、重复值
:原题: `LeetCode 0081 <https://leetcode.com/problems/search-in-rotated-sorted-array-ii/>`_
:访问状态: Available
:教学重点: 重复端点消歧、有序半区、最坏线性退化

题目重述
--------

给定一个由非递减数组旋转得到的整数数组 ``nums``，其中允许出现重复值。判断 ``target`` 是否存在。
题目保证 ``1 <= len(nums) <= 5000``，元素与目标都位于 ``[-10000, 10000]``，输入数组只读。

自建示例
--------

普通命中
~~~~~~~~

.. code-block:: text

   nums = [2,5,6,0,0,1,2]
   target = 0
   输出：true

重复值造成歧义
~~~~~~~~~~~~~~

.. code-block:: text

   nums = [1,0,1,1,1]
   target = 0
   输出：true

此时 ``nums[left] == nums[mid] == nums[right]``，仅比较端点与中点无法判断旋转点位于哪一侧。

问题抽象
--------

没有重复值时，中点能确定至少一侧严格有序。允许重复值后，若左右端和中点值完全相同，两侧都可能
包含旋转点。此时删除一个左端和一个右端是安全的，因为中点已确认不是目标，而两个端点值又与中点
相同，也不可能是目标。

消除歧义后，再按普通旋转数组二分判断哪一半非递减，并利用目标值域删除另一半。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 定位
   * - 重复端点消歧后二分
     - 平均 ``O(log n)``，最坏 ``O(n)``
     - ``O(1)``
     - 主解法；利用局部有序结构
   * - 线性扫描
     - ``O(n)``
     - ``O(1)``
     - 简单，未利用旋转结构

主解法：消歧后二分
------------------

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

维护闭区间 ``[left, right]``：

* 若目标存在，它一定仍在当前区间；
* 区间外元素都已被安全排除；
* 每轮先检查中点，再决定缩小哪一侧；
* 更新后区间长度严格缩短。

重复端点为何可以删除
~~~~~~~~~~~~~~~~~~~~

当 ``nums[left] == nums[mid] == nums[right]`` 且中点不是目标时，左右端也不是目标。把 ``left`` 加一、
``right`` 减一不会删除答案，只是去掉无法提供有序性信息的重复端点。

该步骤可能连续执行很多次。例如全部元素相同时，每轮只能删除常数个位置，因此最坏时间复杂度退化为
``O(n)``。这是重复值造成的信息损失，不能继续保证严格对数上界。

有序半区判断
~~~~~~~~~~~~

消除三端相等的歧义后：

* 若 ``nums[left] <= nums[mid]``，左半区非递减；目标位于
  ``nums[left] <= target < nums[mid]`` 时保留左半区；
* 否则右半区非递减；目标位于 ``nums[mid] < target <= nums[right]`` 时保留右半区；
* 其余情况搜索另一侧。

正确性依据
~~~~~~~~~~

**消歧安全。** 三端值相等且中点未命中时，两个端点都不可能是目标，删除它们不会漏解。

**半区排除安全。** 消歧完成后，至少一半不跨越旋转断点并保持非递减。若目标值位于该半区的值域内，
目标若存在只能在该半区；若不在值域内，该半区不可能包含目标。

**完整性。** 每次更新都保留所有仍可能等于目标的位置。目标存在时最终会成为某轮中点；区间为空时，
全部位置均已被安全排除。

复杂度
~~~~~~

通常每轮删除约一半，时间接近 ``O(log n)``。当大量重复值持续触发端点收缩时，最坏需要 ``O(n)``
轮。额外空间为 ``O(1)``。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>

   bool search(int *nums, int numsSize, int target) {
       int left = 0;
       int right = numsSize - 1;

       while (left <= right) {
           const int mid = left + (right - left) / 2;
           if (nums[mid] == target) {
               return true;
           }

           if (nums[left] == nums[mid] && nums[mid] == nums[right]) {
               ++left;
               --right;
               continue;
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
       return false;
   }

C++
~~~

.. code-block:: cpp

   #include <vector>

   class Solution {
   public:
       bool search(std::vector<int>& nums, int target) {
           int left = 0;
           int right = static_cast<int>(nums.size()) - 1;

           while (left <= right) {
               const int mid = left + (right - left) / 2;
               if (nums[mid] == target) {
                   return true;
               }

               if (nums[left] == nums[mid] && nums[mid] == nums[right]) {
                   ++left;
                   --right;
                   continue;
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
           return false;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def search(self, nums: list[int], target: int) -> bool:
           left = 0
           right = len(nums) - 1

           while left <= right:
               mid = left + (right - left) // 2
               if nums[mid] == target:
                   return True

               if nums[left] == nums[mid] == nums[right]:
                   left += 1
                   right -= 1
                   continue

               if nums[left] <= nums[mid]:
                   if nums[left] <= target < nums[mid]:
                       right = mid - 1
                   else:
                       left = mid + 1
               elif nums[mid] < target <= nums[right]:
                   left = mid + 1
               else:
                   right = mid - 1

           return False

Java
~~~~

.. code-block:: java

   class Solution {
       public boolean search(int[] nums, int target) {
           int left = 0;
           int right = nums.length - 1;

           while (left <= right) {
               int mid = left + (right - left) / 2;
               if (nums[mid] == target) {
                   return true;
               }

               if (nums[left] == nums[mid] && nums[mid] == nums[right]) {
                   ++left;
                   --right;
                   continue;
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
           return false;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn search(nums: Vec<i32>, target: i32) -> bool {
           let mut left = 0usize;
           let mut right = nums.len() - 1;

           loop {
               let mid = left + (right - left) / 2;
               if nums[mid] == target {
                   return true;
               }

               if nums[left] == nums[mid] && nums[mid] == nums[right] {
                   if left == right {
                       return false;
                   }
                   left += 1;
                   right -= 1;
               } else if nums[left] <= nums[mid] {
                   if nums[left] <= target && target < nums[mid] {
                       if mid == 0 {
                           return false;
                       }
                       right = mid - 1;
                   } else {
                       left = mid + 1;
                   }
               } else if nums[mid] < target && target <= nums[right] {
                   left = mid + 1;
               } else {
                   if mid == 0 {
                       return false;
                   }
                   right = mid - 1;
               }

               if left > right {
                   return false;
               }
           }
       }
   }

Rust 使用 ``usize`` 下标，在执行 ``mid - 1`` 前保留 ``mid > 0`` 的见证。输入非空保证初始右边界有效。

Go
~~

.. code-block:: go

   func search(nums []int, target int) bool {
       left := 0
       right := len(nums) - 1

       for left <= right {
           mid := left + (right-left)/2
           if nums[mid] == target {
               return true
           }

           if nums[left] == nums[mid] && nums[mid] == nums[right] {
               left++
               right--
               continue
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
       return false
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function search(nums: number[], target: number): boolean {
       let left = 0;
       let right = nums.length - 1;

       while (left <= right) {
           const mid = left + Math.floor((right - left) / 2);
           if (nums[mid] === target) {
               return true;
           }

           if (nums[left] === nums[mid] && nums[mid] === nums[right]) {
               left += 1;
               right -= 1;
               continue;
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
       return false;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public bool Search(int[] nums, int target) {
           int left = 0;
           int right = nums.Length - 1;

           while (left <= right) {
               int mid = left + (right - left) / 2;
               if (nums[mid] == target) {
                   return true;
               }

               if (nums[left] == nums[mid] && nums[mid] == nums[right]) {
                   ++left;
                   --right;
                   continue;
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
           return false;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function search_rotated(nums::Vector{Int}, target::Int)::Bool
       left = 1
       right = length(nums)

       while left <= right
           mid = left + (right - left) ÷ 2
           nums[mid] == target && return true

           if nums[left] == nums[mid] == nums[right]
               left += 1
               right -= 1
               continue
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
       return false
   end

Julia 直接使用一基闭区间，值域判断不需要零基转换。

R
~

.. code-block:: r

   search_rotated <- function(nums, target) {
     left <- 1L
     right <- length(nums)

     while (left <= right) {
       mid <- left + (right - left) %/% 2L
       if (nums[[mid]] == target) {
         return(TRUE)
       }

       if (nums[[left]] == nums[[mid]] && nums[[mid]] == nums[[right]]) {
         left <- left + 1L
         right <- right - 1L
         next
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
     FALSE
   }

验证计划与证据
--------------

覆盖单元素、未旋转、目标位于两侧、目标不存在、全部相同、三端相同但目标藏在内部等边界。随机生成
非递减数组、随机旋转并与线性成员判断对拍。可用语言执行编译、严格类型检查和运行测试。

关键边界
--------

* 三端相等时不能直接判断有序半区；
* 端点收缩会使最坏复杂度退化为 ``O(n)``；
* 中点命中必须先于消歧和半区判断；
* 输入非空，Rust 的初始 ``len-1`` 有合法见证。

易错点
------

* 沿用 0033 的“元素互不相同”证明并错误声称最坏 ``O(log n)``；
* 只在 ``nums[left] == nums[mid]`` 时盲目删除一整侧；
* 三端相等时没有先检查中点；
* 左右值域边界同时使用闭区间，把已检查的中点留在新区间。

本题新增知识
------------

* 重复端点消歧与二分最坏线性退化；
* 信息不足时删除已确认非目标的等值边界。

本题强化知识
------------

* 0033 的旋转数组有序半区判断；
* 闭区间候选不变量和中点排除。

关联题目
--------

* :doc:`0033-search-in-rotated-sorted-array`
* :doc:`0034-find-first-and-last-position-of-element-in-sorted-array`

最小自检
--------

#. 为什么三端相等时可以同时收缩左右边界？
#. 为什么重复值会破坏严格 ``O(log n)`` 保证？
#. 消歧后如何判断目标是否位于左侧有序半区？
#. Rust 为什么需要额外保护 ``mid - 1``？

答案要点
~~~~~~~~

#. 中点已确认不是目标，左右端与中点同值，也不可能是目标。
#. 全部相同等输入每轮只能删除常数个位置。
#. 检查 ``nums[left] <= target < nums[mid]``。
#. ``usize`` 无符号下标不能在 ``mid == 0`` 时减一。
