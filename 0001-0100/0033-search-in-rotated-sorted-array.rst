0033. Search in Rotated Sorted Array
====================================

题目信息
--------

:题号: 0033
:难度: Medium
:主题: 数组、二分查找、旋转数组、区间排除
:原题: `LeetCode 0033 <https://leetcode.com/problems/search-in-rotated-sorted-array/>`_
:教学重点: 局部有序半区、目标值域、闭区间收缩、无重复前提

题目重述
--------

给定一个由严格递增数组在未知位置旋转得到的数组 ``nums``，元素互不相同。返回 ``target`` 的零基下标，不存在返回 ``-1``，要求 ``O(log n)`` 时间。

自建示例
--------

.. code-block:: text

   nums = [4,5,6,7,0,1,2], target = 1
   第一次中点为 7，左半段有序但目标不在 [4,7)；搜索区间转向右侧，最终返回 5。

.. code-block:: text

   nums = [6,7,1,2,3,4,5], target = 8
   每轮都能排除一个值域不含 8 的有序半区，最终返回 -1。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       int linearScan(const std::vector<int>& nums, int target) {
           for (int i = 0; i < static_cast<int>(nums.size()); ++i)
               if (nums[i] == target) return i;
           return -1;
       }

       int ordinaryBinary(const std::vector<int>& nums, int left, int right, int target) {
           while (left <= right) {
               int mid = left + (right - left) / 2;
               if (nums[mid] == target) return mid;
               if (nums[mid] < target) left = mid + 1;
               else right = mid - 1;
           }
           return -1;
       }

       int pivotThenBinary(const std::vector<int>& nums, int target) {
           if (nums.empty()) return -1;
           int left = 0, right = static_cast<int>(nums.size()) - 1;
           while (left < right) {
               int mid = left + (right - left) / 2;
               if (nums[mid] > nums[right]) left = mid + 1;
               else right = mid;
           }
           int pivot = left;
           if (target >= nums[pivot] && target <= nums.back())
               return ordinaryBinary(nums, pivot, static_cast<int>(nums.size()) - 1, target);
           return ordinaryBinary(nums, 0, pivot - 1, target);
       }

       int oneStageBinary(const std::vector<int>& nums, int target) {
           int left = 0, right = static_cast<int>(nums.size()) - 1;
           while (left <= right) {
               int mid = left + (right - left) / 2;
               if (nums[mid] == target) return mid;

               if (nums[left] <= nums[mid]) {
                   if (nums[left] <= target && target < nums[mid]) right = mid - 1;
                   else left = mid + 1;
               } else {
                   if (nums[mid] < target && target <= nums[right]) left = mid + 1;
                   else right = mid - 1;
               }
           }
           return -1;
       }

   public:
       int search(std::vector<int>& nums, int target) {
           return oneStageBinary(nums, target);
       }
   };

题解
----

线性扫描遗漏了什么结构
~~~~~~~~~~~~~~~~~~~~~~

线性扫描正确但需要 ``O(n)``。旋转只把严格递增数组切成两段，数组至多有一个下降位置。二分中点虽然不能保证整个区间有序，却能保证左右两半至少有一半不跨越旋转点，因此仍然可以一次排除约一半候选。

两阶段方法如何定位旋转点
~~~~~~~~~~~~~~~~~~~~~~~~

最小值是第二段首元素。比较 ``nums[mid]`` 与 ``nums[right]``：若中点值更大，旋转点一定在右侧；否则中点可能就是最小值，保留 ``mid``。找到最小值后，根据目标值域选择一段普通二分。该方法清楚，但需要两个二分阶段。

单阶段方法如何识别有序半区
~~~~~~~~~~~~~~~~~~~~~~~~~~

在闭区间 ``[left,right]`` 中：

* 若 ``nums[left] <= nums[mid]``，左半区 ``[left,mid]`` 严格递增；
* 否则旋转点位于左半区，右半区 ``[mid,right]`` 严格递增。

元素互异使两种情况可判定。若允许大量重复值，端点和中点相等时可能无法确定哪半边跨越旋转点。

目标值域如何决定保留区间
~~~~~~~~~~~~~~~~~~~~~~~~

左半区有序时，目标落在 ``nums[left] <= target < nums[mid]`` 才保留左侧；否则保留右侧。右半区有序时使用对称条件 ``nums[mid] < target <= nums[right]``。中点已提前检查，所以新区间总能排除 ``mid``。

状态演化
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - ``left,mid,right``
     - 有序半区
     - 目标判断
     - 新区间
   * - ``0,3,6``
     - 左侧 ``[4,5,6,7]``
     - 1 不在 ``[4,7)``
     - ``[4,6]``
   * - ``4,5,6``
     - 左侧 ``[0,1]``
     - 中点值等于 1
     - 返回 5

为什么每次排除都安全
~~~~~~~~~~~~~~~~~~~~

被识别的有序半区具有严格单调值域。若目标位于该值域，另一半不可能包含同值；若目标不在该值域，该有序半区中不存在目标。中点已单独验证，更新到 ``mid-1`` 或 ``mid+1`` 不会漏解。由此目标若存在始终保留在新区间中。

复杂度来源
~~~~~~~~~~

单阶段与两阶段方法都让候选区间每轮缩小约一半，时间 ``O(log n)``、额外空间 ``O(1)``。线性扫描为 ``O(n)``。

九语言实现
----------

C
~

.. code-block:: c

   int search(int *nums, int n, int target) {
       int left = 0, right = n - 1;
       while (left <= right) {
           int mid = left + (right - left) / 2;
           if (nums[mid] == target) return mid;
           if (nums[left] <= nums[mid]) {
               if (nums[left] <= target && target < nums[mid]) right = mid - 1;
               else left = mid + 1;
           } else {
               if (nums[mid] < target && target <= nums[right]) left = mid + 1;
               else right = mid - 1;
           }
       }
       return -1;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def search(self, nums: list[int], target: int) -> int:
           left, right = 0, len(nums) - 1
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
           int left = 0, right = nums.length - 1;
           while (left <= right) {
               int mid = left + (right - left) / 2;
               if (nums[mid] == target) return mid;
               if (nums[left] <= nums[mid]) {
                   if (nums[left] <= target && target < nums[mid]) right = mid - 1;
                   else left = mid + 1;
               } else {
                   if (nums[mid] < target && target <= nums[right]) left = mid + 1;
                   else right = mid - 1;
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
           let (mut left, mut right) = (0i32, nums.len() as i32 - 1);
           while left <= right {
               let mid = left + (right - left) / 2;
               if nums[mid as usize] == target { return mid; }
               if nums[left as usize] <= nums[mid as usize] {
                   if nums[left as usize] <= target && target < nums[mid as usize] { right = mid - 1; }
                   else { left = mid + 1; }
               } else if nums[mid as usize] < target && target <= nums[right as usize] { left = mid + 1; }
               else { right = mid - 1; }
           }
           -1
       }
   }

Go
~~

.. code-block:: go

   func search(nums []int, target int) int {
       left, right := 0, len(nums)-1
       for left <= right {
           mid := left + (right-left)/2
           if nums[mid] == target { return mid }
           if nums[left] <= nums[mid] {
               if nums[left] <= target && target < nums[mid] { right = mid-1 } else { left = mid+1 }
           } else {
               if nums[mid] < target && target <= nums[right] { left = mid+1 } else { right = mid-1 }
           }
       }
       return -1
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function search(nums: number[], target: number): number {
       let left = 0, right = nums.length - 1;
       while (left <= right) {
           const mid = left + Math.floor((right - left) / 2);
           if (nums[mid] === target) return mid;
           if (nums[left] <= nums[mid]) {
               if (nums[left] <= target && target < nums[mid]) right = mid - 1;
               else left = mid + 1;
           } else {
               if (nums[mid] < target && target <= nums[right]) left = mid + 1;
               else right = mid - 1;
           }
       }
       return -1;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int Search(int[] nums, int target) {
           int left = 0, right = nums.Length - 1;
           while (left <= right) {
               int mid = left + (right - left) / 2;
               if (nums[mid] == target) return mid;
               if (nums[left] <= nums[mid]) {
                   if (nums[left] <= target && target < nums[mid]) right = mid - 1;
                   else left = mid + 1;
               } else {
                   if (nums[mid] < target && target <= nums[right]) left = mid + 1;
                   else right = mid - 1;
               }
           }
           return -1;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function search_rotated(nums::Vector{Int}, target::Int)
       left, right = 1, length(nums)
       while left <= right
           mid = left + (right - left) ÷ 2
           nums[mid] == target && return mid - 1
           if nums[left] <= nums[mid]
               nums[left] <= target < nums[mid] ? (right = mid - 1) : (left = mid + 1)
           else
               nums[mid] < target <= nums[right] ? (left = mid + 1) : (right = mid - 1)
           end
       end
       -1
   end

R
~

.. code-block:: r

   search_rotated <- function(nums, target) {
     left <- 1L; right <- length(nums)
     while (left <= right) {
       mid <- left + (right - left) %/% 2L
       if (nums[[mid]] == target) return(mid - 1L)
       if (nums[[left]] <= nums[[mid]]) {
         if (nums[[left]] <= target && target < nums[[mid]]) right <- mid - 1L else left <- mid + 1L
       } else {
         if (nums[[mid]] < target && target <= nums[[right]]) left <- mid + 1L else right <- mid - 1L
       }
     }
     -1L
   }