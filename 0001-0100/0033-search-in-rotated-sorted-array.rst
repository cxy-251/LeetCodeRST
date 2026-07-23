0033. Search in Rotated Sorted Array
====================================

题目信息
--------

:题号: 0033
:难度: Medium
:主题: 数组、二分查找、旋转有序数组
:原题: `LeetCode 0033 <https://leetcode.com/problems/search-in-rotated-sorted-array/>`_
:重点: 严格递增数组旋转、元素互异、零基下标、对数时间要求

题目重述
--------

给定一个元素互不相同的整数数组 ``nums``。它原本按严格递增顺序排列，之后可能在某个下标处旋转，使一个后缀移到数组开头。再给定整数 ``target``，若目标值存在，返回其零基下标；否则返回 ``-1``。

要求算法的时间复杂度为 ``O(log n)``。``nums`` 的长度位于 ``[1, 5000]``，数组元素位于 ``[-10^4, 10^4]``，``target`` 也位于该范围。

自建示例
--------

目标位于旋转后的左段：

.. code-block:: text

   输入：nums = [8, 10, 13, 1, 3, 5, 6], target = 10
   输出：1
   解释：目标值 10 位于零基下标 1。

目标位于旋转后的右段：

.. code-block:: text

   输入：nums = [15, 18, 2, 4, 7, 11], target = 7
   输出：4
   解释：目标值 7 位于零基下标 4。

目标不存在：

.. code-block:: text

   输入：nums = [5, 7, 9, 12, 1, 3], target = 8
   输出：-1
   解释：数组中没有值 8。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       int linearScan(const std::vector<int>& nums, int target) {
           for (int i = 0; i < static_cast<int>(nums.size()); ++i) {
               if (nums[i] == target) return i;
           }
           return -1;
       }

       int findPivotThenSearch(const std::vector<int>& nums, int target) {
           int low = 0, high = static_cast<int>(nums.size()) - 1;
           while (low < high) {
               int mid = low + (high - low) / 2;
               if (nums[mid] > nums[high]) low = mid + 1;
               else high = mid;
           }
           int pivot = low;
           low = 0; high = static_cast<int>(nums.size()) - 1;
           if (target >= nums[pivot] && target <= nums.back()) low = pivot;
           else high = pivot - 1;
           while (low <= high) {
               int mid = low + (high - low) / 2;
               if (nums[mid] == target) return mid;
               if (nums[mid] < target) low = mid + 1;
               else high = mid - 1;
           }
           return -1;
       }

       int onePassBinary(const std::vector<int>& nums, int target) {
           int low = 0, high = static_cast<int>(nums.size()) - 1;
           while (low <= high) {
               int mid = low + (high - low) / 2;
               if (nums[mid] == target) return mid;

               if (nums[low] <= nums[mid]) {
                   if (nums[low] <= target && target < nums[mid]) high = mid - 1;
                   else low = mid + 1;
               } else {
                   if (nums[mid] < target && target <= nums[high]) low = mid + 1;
                   else high = mid - 1;
               }
           }
           return -1;
       }

   public:
       int search(std::vector<int>& nums, int target) {
           return onePassBinary(nums, target);
       }
   };

题解
----

旋转后为什么仍可二分
~~~~~~~~~~~~~~~~~~~~

旋转只产生一个断点。任意二分区间中，``[low,mid]`` 与 ``[mid,high]`` 至少有一半保持严格递增。识别有序半区后，
可以用端点范围判断目标是否位于其中；若不在，就保留另一半。

元素互异为什么重要
~~~~~~~~~~~~~~~~~~

通过 ``nums[low] <= nums[mid]`` 可以确定左半有序，因为不存在大量相等值遮蔽断点。若允许重复值，端点与中点相等时
可能无法判断旋转点在哪一侧，需要额外收缩边界，最坏可能退化为线性。

一次迭代如何选择保留区间
~~~~~~~~~~~~~~~~~~~~~~~~

若左半有序：

* ``nums[low] <= target < nums[mid]`` 时目标只能在左半；
* 否则目标若存在只能在右半。

若右半有序：

* ``nums[mid] < target <= nums[high]`` 时保留右半；
* 否则保留左半。

中点已经先单独检查，因此范围判断采用半开边界，不会遗漏目标。

状态演化
~~~~~~~~

对 ``[8,10,13,1,3,5,6]`` 查找 10：

.. list-table::
   :header-rows: 1

   * - ``low``
     - ``mid``
     - ``high``
     - 有序半区
     - 判断
   * - 0
     - 3
     - 6
     - 右半 ``[1,3,5,6]``
     - 10 不在右半，保留左侧
   * - 0
     - 1
     - 2
     - 左半 ``[8,10]``
     - 中点等于目标，返回 1

为什么被舍弃半区不可能含目标
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

有序半区内的端点范围完整描述其中所有值。目标落在该范围时，另一半无需考虑；目标不在该范围时，有序半区中也不
可能存在目标。每轮至少删除一半候选，且保留区间仍包含所有可能位置。

先找旋转点与一次二分的取舍
~~~~~~~~~~~~~~~~~~~~~~~~~~

两阶段方法先二分最小值位置，再根据目标范围选择一个普通有序段做二分，逻辑直观，总时间仍为 ``O(log n)``。
一次方法把两步合并到每轮判断中，只执行一个循环，标准入口采用它。

复杂度来源
~~~~~~~~~~

二分区间每轮至少缩小一半，时间 ``O(log n)``，额外空间 ``O(1)``。线性扫描不利用结构，时间 ``O(n)``。

九语言实现
----------

C
~

.. code-block:: c

   int search(int* nums,int n,int target){
       int low=0,high=n-1;
       while(low<=high){int mid=low+(high-low)/2;if(nums[mid]==target)return mid;
           if(nums[low]<=nums[mid]){if(nums[low]<=target&&target<nums[mid])high=mid-1;else low=mid+1;}
           else{if(nums[mid]<target&&target<=nums[high])low=mid+1;else high=mid-1;}}
       return -1;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def search(self, nums: list[int], target: int) -> int:
           low, high = 0, len(nums) - 1
           while low <= high:
               mid = low + (high - low) // 2
               if nums[mid] == target: return mid
               if nums[low] <= nums[mid]:
                   if nums[low] <= target < nums[mid]: high = mid - 1
                   else: low = mid + 1
               else:
                   if nums[mid] < target <= nums[high]: low = mid + 1
                   else: high = mid - 1
           return -1

Java
~~~~

.. code-block:: java

   class Solution {
       public int search(int[] nums,int target){
           int low=0,high=nums.length-1;
           while(low<=high){int mid=low+(high-low)/2;if(nums[mid]==target)return mid;
               if(nums[low]<=nums[mid]){if(nums[low]<=target&&target<nums[mid])high=mid-1;else low=mid+1;}
               else{if(nums[mid]<target&&target<=nums[high])low=mid+1;else high=mid-1;}}
           return -1;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn search(nums:Vec<i32>,target:i32)->i32{
           let(mut low,mut high)=(0i32,nums.len() as i32-1);
           while low<=high{let mid=low+(high-low)/2;let m=mid as usize;if nums[m]==target{return mid}
               if nums[low as usize]<=nums[m]{if nums[low as usize]<=target&&target<nums[m]{high=mid-1}else{low=mid+1}}
               else if nums[m]<target&&target<=nums[high as usize]{low=mid+1}else{high=mid-1}}
           -1
       }
   }

Go
~~

.. code-block:: go

   func search(nums []int,target int)int{
       low,high:=0,len(nums)-1
       for low<=high{mid:=low+(high-low)/2;if nums[mid]==target{return mid}
           if nums[low]<=nums[mid]{if nums[low]<=target&&target<nums[mid]{high=mid-1}else{low=mid+1}}
           else if nums[mid]<target&&target<=nums[high]{low=mid+1}else{high=mid-1}}
       return -1
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function search(nums:number[],target:number):number{
       let low=0,high=nums.length-1;
       while(low<=high){const mid=low+Math.floor((high-low)/2);if(nums[mid]===target)return mid;
           if(nums[low]<=nums[mid]){if(nums[low]<=target&&target<nums[mid])high=mid-1;else low=mid+1;}
           else if(nums[mid]<target&&target<=nums[high])low=mid+1;else high=mid-1;}return -1;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int Search(int[] nums,int target){
           int low=0,high=nums.Length-1;
           while(low<=high){int mid=low+(high-low)/2;if(nums[mid]==target)return mid;
               if(nums[low]<=nums[mid]){if(nums[low]<=target&&target<nums[mid])high=mid-1;else low=mid+1;}
               else if(nums[mid]<target&&target<=nums[high])low=mid+1;else high=mid-1;}return -1;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function search_rotated(nums::Vector{Int},target::Int)
       low,high=1,length(nums)
       while low<=high;mid=low+(high-low)÷2;if nums[mid]==target;return mid-1;end
           if nums[low]<=nums[mid];if nums[low]<=target<nums[mid];high=mid-1;else;low=mid+1;end
           elseif nums[mid]<target<=nums[high];low=mid+1;else;high=mid-1;end
       end;-1
   end

R
~

.. code-block:: r

   search_rotated <- function(nums,target) {
       low<-1L;high<-length(nums)
       while(low<=high){mid<-low+(high-low)%/%2L;if(nums[[mid]]==target)return(mid-1L)
           if(nums[[low]]<=nums[[mid]]){if(nums[[low]]<=target&&target<nums[[mid]])high<-mid-1L else low<-mid+1L}
           else if(nums[[mid]]<target&&target<=nums[[high]])low<-mid+1L else high<-mid-1L}
       -1L
   }