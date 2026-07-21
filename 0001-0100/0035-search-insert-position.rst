0035. Search Insert Position
============================

题目信息
--------

:题号: 0035
:难度: Easy
:主题: 数组、二分查找、插入位置、lower bound
:原题: `LeetCode 0035 <https://leetcode.com/problems/search-insert-position/>`_
:教学重点: 第一个大于等于目标的位置、半开区间、命中与缺失统一、末尾插入

题目重述
--------

给定严格递增数组 ``nums`` 和目标值 ``target``。目标存在时返回其零基下标；不存在时返回插入后仍保持递增的下标。要求 ``O(log n)`` 时间。

自建示例
--------

.. code-block:: text

   [1,3,5,8], target = 5 -> 2
   [1,3,5,8], target = 4 -> 2
   [2,4,6],   target = 9 -> 3

三个答案都可解释为“第一个大于等于目标的位置”；若没有这样的元素，边界就是数组长度。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       int linearScan(const std::vector<int>& nums, int target) {
           for (int i = 0; i < static_cast<int>(nums.size()); ++i)
               if (nums[i] >= target) return i;
           return static_cast<int>(nums.size());
       }

       int closedInterval(const std::vector<int>& nums, int target) {
           int left = 0, right = static_cast<int>(nums.size()) - 1;
           int answer = static_cast<int>(nums.size());
           while (left <= right) {
               int mid = left + (right - left) / 2;
               if (nums[mid] >= target) {
                   answer = mid;
                   right = mid - 1;
               } else {
                   left = mid + 1;
               }
           }
           return answer;
       }

       int lowerBound(const std::vector<int>& nums, int target) {
           int left = 0, right = static_cast<int>(nums.size());
           while (left < right) {
               int mid = left + (right - left) / 2;
               if (nums[mid] < target) left = mid + 1;
               else right = mid;
           }
           return left;
       }

   public:
       int searchInsert(std::vector<int>& nums, int target) {
           return lowerBound(nums, target);
       }
   };

题解
----

线性扫描已经暴露答案语义
~~~~~~~~~~~~~~~~~~~~~~~~

从左向右第一个不小于目标的元素就是插入边界；若扫描到末尾仍未找到，目标应插入下标 ``n``。线性方法为 ``O(n)``，但这个单调判定正适合二分。

为什么目标存在与不存在不需要分支
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

答案定义为：

.. code-block:: text

   min index，使 nums[index] >= target

目标存在时，严格递增保证该位置就是唯一目标下标；目标不存在时，左侧全部小于目标，当前位置及右侧全部大于目标，把目标插在这里保持顺序。二分始终返回边界，不需要“找不到”状态。

半开区间保存什么不变量
~~~~~~~~~~~~~~~~~~~~~~

维护 ``[left,right)``：

* ``[0,left)`` 中所有值都小于目标；
* ``[right,n)`` 中所有值都大于等于目标；
* 正确边界仍位于 ``[left,right]``；
* ``right`` 可以等于 ``n``，表示末尾插入。

若 ``nums[mid] < target``，中点及左侧都必须位于边界左边，令 ``left = mid+1``；否则中点已满足条件，但更早位置可能也满足，令 ``right = mid``。

边界演化
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 输入
     - 最终左侧性质
     - 返回
   * - ``target = 4``
     - ``[1,3] < 4``
     - 2
   * - ``target = 1``
     - 左侧为空
     - 0
   * - ``target = 9``
     - 全部元素 ``< 9``
     - ``n``

为什么循环结束位置唯一
~~~~~~~~~~~~~~~~~~~~~~

每轮都保持左侧严格小于目标、右侧大于等于目标，并严格缩短区间。当 ``left == right`` 时，这个位置左侧全部不满足条件，从该位置开始全部满足，因此它恰好是第一个大于等于目标的位置。

闭区间版本与半开区间版本的差异
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

闭区间版本需要额外变量保存当前候选答案，并允许搜索区间变空；半开区间版本把候选答案直接编码为右边界，循环结束直接返回 ``left``。两者都为 ``O(log n)``，主解法选择状态更少的半开区间形式。

复杂度来源
~~~~~~~~~~

每轮把候选区间缩小约一半，时间 ``O(log n)``；只使用三个下标，额外空间 ``O(1)``。

九语言实现
----------

C
~

.. code-block:: c

   int searchInsert(int *nums, int n, int target) {
       int left = 0, right = n;
       while (left < right) {
           int mid = left + (right - left) / 2;
           if (nums[mid] < target) left = mid + 1;
           else right = mid;
       }
       return left;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def searchInsert(self, nums: list[int], target: int) -> int:
           left, right = 0, len(nums)
           while left < right:
               mid = left + (right - left) // 2
               if nums[mid] < target:
                   left = mid + 1
               else:
                   right = mid
           return left

Java
~~~~

.. code-block:: java

   class Solution {
       public int searchInsert(int[] nums, int target) {
           int left = 0, right = nums.length;
           while (left < right) {
               int mid = left + (right - left) / 2;
               if (nums[mid] < target) left = mid + 1;
               else right = mid;
           }
           return left;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn search_insert(nums: Vec<i32>, target: i32) -> i32 {
           let (mut left, mut right) = (0usize, nums.len());
           while left < right {
               let mid = left + (right - left) / 2;
               if nums[mid] < target { left = mid + 1; } else { right = mid; }
           }
           left as i32
       }
   }

Go
~~

.. code-block:: go

   func searchInsert(nums []int, target int) int {
       left, right := 0, len(nums)
       for left < right {
           mid := left + (right-left)/2
           if nums[mid] < target { left = mid+1 } else { right = mid }
       }
       return left
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function searchInsert(nums: number[], target: number): number {
       let left = 0, right = nums.length;
       while (left < right) {
           const mid = left + Math.floor((right - left) / 2);
           if (nums[mid] < target) left = mid + 1;
           else right = mid;
       }
       return left;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int SearchInsert(int[] nums, int target) {
           int left = 0, right = nums.Length;
           while (left < right) {
               int mid = left + (right - left) / 2;
               if (nums[mid] < target) left = mid + 1;
               else right = mid;
           }
           return left;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function search_insert(nums::Vector{Int}, target::Int)
       left, right = 1, length(nums) + 1
       while left < right
           mid = left + (right - left) ÷ 2
           nums[mid] < target ? (left = mid + 1) : (right = mid)
       end
       left - 1
   end

R
~

.. code-block:: r

   search_insert <- function(nums, target) {
     left <- 1L; right <- length(nums) + 1L
     while (left < right) {
       mid <- left + (right - left) %/% 2L
       if (nums[[mid]] < target) left <- mid + 1L else right <- mid
     }
     left - 1L
   }