0034. Find First and Last Position of Element in Sorted Array
============================================================

题目信息
--------

:题号: 0034
:难度: Medium
:主题: 数组、二分查找、边界定位
:原题: `LeetCode 0034 <https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/>`_
:重点: 非递减数组、目标值连续区间、首尾零基下标、对数时间要求

题目重述
--------

给定按非递减顺序排列的整数数组 ``nums`` 和整数 ``target``，返回目标值在数组中第一次和最后一次出现的零基下标 ``[first, last]``。

若数组中不存在目标值，返回 ``[-1, -1]``。要求算法的时间复杂度为 ``O(log n)``。

``nums`` 的长度位于 ``[0, 10^5]``，数组元素和 ``target`` 均位于 ``[-10^9, 10^9]``。

自建示例
--------

目标值连续出现多次：

.. code-block:: text

   输入：nums = [1, 2, 2, 2, 2, 5, 8], target = 2
   输出：[1, 4]
   解释：值 2 第一次出现在下标 1，最后一次出现在下标 4。

目标只出现一次：

.. code-block:: text

   输入：nums = [-3, 0, 4, 7], target = 4
   输出：[2, 2]
   解释：目标值只位于下标 2，因此左右边界相同。

目标不存在：

.. code-block:: text

   输入：nums = [1, 3, 5, 7], target = 4
   输出：[-1, -1]
   解释：数组中没有值 4。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       std::vector<int> linearScan(const std::vector<int>& nums, int target) {
           int first = -1, last = -1;
           for (int i = 0; i < static_cast<int>(nums.size()); ++i) {
               if (nums[i] == target) {
                   if (first == -1) first = i;
                   last = i;
               }
           }
           return {first, last};
       }

       int lowerBound(const std::vector<int>& nums, long long value) {
           int low = 0, high = static_cast<int>(nums.size());
           while (low < high) {
               int mid = low + (high - low) / 2;
               if (nums[mid] < value) low = mid + 1;
               else high = mid;
           }
           return low;
       }

       std::vector<int> twoBoundaries(const std::vector<int>& nums, int target) {
           int first = lowerBound(nums, target);
           if (first == static_cast<int>(nums.size()) || nums[first] != target) return {-1, -1};
           int after = lowerBound(nums, static_cast<long long>(target) + 1);
           return {first, after - 1};
       }

   public:
       std::vector<int> searchRange(std::vector<int>& nums, int target) {
           return twoBoundaries(nums, target);
       }
   };

题解
----

普通二分命中为何不能直接返回
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

普通二分找到的任意一个目标位置未必是首尾边界。命中后向两侧线性扩展最坏仍会遍历全部重复段，无法满足
``O(log n)``。需要把“找到目标”改为“找到满足条件的第一个位置”。

下界函数维护什么搜索语义
~~~~~~~~~~~~~~~~~~~~~~~~

``lowerBound(value)`` 返回第一个满足 ``nums[index] >= value`` 的下标，搜索半开区间 ``[low, high)``：

* ``nums[mid] < value`` 时，``mid`` 及左侧都不可能是答案，令 ``low = mid + 1``；
* 否则 ``mid`` 可能就是第一个满足位置，保留到右边界，令 ``high = mid``。

循环结束时区间收缩为一个插入位置，即第一个不小于 ``value`` 的位置。

如何用两个下界得到闭区间答案
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

第一次计算 ``first = lowerBound(target)``。若越界或 ``nums[first] != target``，目标不存在。

目标存在时，再求第一个严格大于目标的位置。整数数组中可写为 ``lowerBound(target + 1)``，记为 ``after``；最后一个
目标位置就是 ``after - 1``。代码把边界值提升为 ``long long``，避免 ``target + 1`` 在整数上界溢出。

状态演化
~~~~~~~~

对 ``[1,2,2,2,2,5,8]`` 查找下界 2：

.. list-table::
   :header-rows: 1

   * - ``low``
     - ``mid``
     - ``high``
     - ``nums[mid]``
     - 更新
   * - 0
     - 3
     - 7
     - 2
     - ``high = 3``
   * - 0
     - 1
     - 3
     - 2
     - ``high = 1``
   * - 0
     - 0
     - 1
     - 1
     - ``low = 1``

得到首位置 1。对值 3 求下界得到 5，因此末位置为 4。

为什么两个边界不会遗漏重复值
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

有序性保证所有等于目标的元素形成一个连续区间。第一个不小于目标的位置若确实等于目标，就是区间左端；第一个大于
目标的位置之前，所有不小于目标的值只能等于目标，因此其前一位就是区间右端。

复杂度来源
~~~~~~~~~~

两次二分各为 ``O(log n)``，总时间仍为 ``O(log n)``，额外空间 ``O(1)``。线性扫描为 ``O(n)``，仅作基准。

九语言实现
----------

C
~

.. code-block:: c

   static int lower_bound_value(int* nums,int n,long long value){
       int low=0,high=n;while(low<high){int mid=low+(high-low)/2;if(nums[mid]<value)low=mid+1;else high=mid;}return low;
   }
   int* searchRange(int* nums,int n,int target,int* returnSize){
       int* result=malloc(2*sizeof(int));*returnSize=2;int first=lower_bound_value(nums,n,target);
       if(first==n||nums[first]!=target){result[0]=result[1]=-1;return result;}
       int after=lower_bound_value(nums,n,(long long)target+1);result[0]=first;result[1]=after-1;return result;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def searchRange(self, nums: list[int], target: int) -> list[int]:
           def lower(value: int) -> int:
               low, high = 0, len(nums)
               while low < high:
                   mid = low + (high - low) // 2
                   if nums[mid] < value: low = mid + 1
                   else: high = mid
               return low
           first = lower(target)
           if first == len(nums) or nums[first] != target: return [-1, -1]
           return [first, lower(target + 1) - 1]

Java
~~~~

.. code-block:: java

   class Solution {
       private int lower(int[] nums,long value){int low=0,high=nums.length;while(low<high){int mid=low+(high-low)/2;if(nums[mid]<value)low=mid+1;else high=mid;}return low;}
       public int[] searchRange(int[] nums,int target){int first=lower(nums,target);if(first==nums.length||nums[first]!=target)return new int[]{-1,-1};return new int[]{first,lower(nums,(long)target+1)-1};}
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn search_range(nums:Vec<i32>,target:i32)->Vec<i32>{
           fn lower(nums:&[i32],value:i64)->usize{let(mut low,mut high)=(0,nums.len());while low<high{let mid=low+(high-low)/2;if (nums[mid] as i64)<value{low=mid+1}else{high=mid}}low}
           let first=lower(&nums,target as i64);if first==nums.len()||nums[first]!=target{return vec![-1,-1]}vec![first as i32,lower(&nums,target as i64+1) as i32-1]
       }
   }

Go
~~

.. code-block:: go

   func searchRange(nums []int,target int)[]int{
       lower:=func(value int64)int{low,high:=0,len(nums);for low<high{mid:=low+(high-low)/2;if int64(nums[mid])<value{low=mid+1}else{high=mid}};return low}
       first:=lower(int64(target));if first==len(nums)||nums[first]!=target{return []int{-1,-1}};return []int{first,lower(int64(target)+1)-1}
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function searchRange(nums:number[],target:number):number[]{
       const lower=(value:number)=>{let low=0,high=nums.length;while(low<high){const mid=low+Math.floor((high-low)/2);if(nums[mid]<value)low=mid+1;else high=mid;}return low;};
       const first=lower(target);if(first===nums.length||nums[first]!==target)return[-1,-1];return[first,lower(target+1)-1];
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       private int Lower(int[] nums,long value){int low=0,high=nums.Length;while(low<high){int mid=low+(high-low)/2;if(nums[mid]<value)low=mid+1;else high=mid;}return low;}
       public int[] SearchRange(int[] nums,int target){int first=Lower(nums,target);if(first==nums.Length||nums[first]!=target)return new[]{-1,-1};return new[]{first,Lower(nums,(long)target+1)-1};}
   }

Julia
~~~~~

.. code-block:: julia

   function search_range(nums::Vector{Int},target::Int)
       lower(value)=begin;low=1;high=length(nums)+1;while low<high;mid=low+(high-low)÷2;if nums[mid]<value;low=mid+1;else;high=mid;end;end;low;end
       first=lower(target);if first>length(nums)||nums[first]!=target;return[-1,-1];end;[first-1,lower(target+1)-2]
   end

R
~

.. code-block:: r

   search_range <- function(nums,target) {
       lower<-function(value){low<-1L;high<-length(nums)+1L;while(low<high){mid<-low+(high-low)%/%2L;if(mid<=length(nums)&&nums[[mid]]<value)low<-mid+1L else high<-mid};low}
       first<-lower(target);if(first>length(nums)||nums[[first]]!=target)return(c(-1L,-1L));c(first-1L,lower(target+1)-2L)
   }