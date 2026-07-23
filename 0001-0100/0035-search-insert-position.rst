0035. Search Insert Position
============================

题目信息
--------

:题号: 0035
:难度: Easy
:主题: 数组、二分查找、下界
:原题: `LeetCode 0035 <https://leetcode.com/problems/search-insert-position/>`_
:重点: 严格递增数组、目标下标或插入位置、零基返回值、对数时间要求

题目重述
--------

给定一个按严格递增顺序排列且元素互不相同的整数数组 ``nums`` 和整数 ``target``：若目标值已经存在，返回它的零基下标；若不存在，返回将它插入后仍保持数组有序的位置。

要求算法的时间复杂度为 ``O(log n)``。``nums`` 的长度位于 ``[1, 10^4]``，数组元素和 ``target`` 均位于 ``[-10^4, 10^4]``。

自建示例
--------

目标已经存在：

.. code-block:: text

   输入：nums = [2, 5, 9, 14], target = 9
   输出：2
   解释：值 9 位于零基下标 2。

插入到数组中间：

.. code-block:: text

   输入：nums = [1, 4, 7, 10], target = 6
   输出：2
   解释：把 6 插入下标 2 后，数组变为 [1, 4, 6, 7, 10]。

插入到数组末尾：

.. code-block:: text

   输入：nums = [-3, 0, 8], target = 12
   输出：3
   解释：目标值大于所有元素，应插入当前数组长度所表示的末尾位置。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       int linear(const std::vector<int>& nums, int target) {
           for (int i = 0; i < static_cast<int>(nums.size()); ++i) {
               if (nums[i] >= target) return i;
           }
           return static_cast<int>(nums.size());
       }

       int closedInterval(const std::vector<int>& nums, int target) {
           int low = 0, high = static_cast<int>(nums.size()) - 1;
           int answer = static_cast<int>(nums.size());
           while (low <= high) {
               int mid = low + (high - low) / 2;
               if (nums[mid] >= target) {
                   answer = mid;
                   high = mid - 1;
               } else {
                   low = mid + 1;
               }
           }
           return answer;
       }

       int halfOpen(const std::vector<int>& nums, int target) {
           int low = 0, high = static_cast<int>(nums.size());
           while (low < high) {
               int mid = low + (high - low) / 2;
               if (nums[mid] < target) low = mid + 1;
               else high = mid;
           }
           return low;
       }

   public:
       int searchInsert(std::vector<int>& nums, int target) {
           return halfOpen(nums, target);
       }
   };

题解
----

插入位置等价于第一个不小于目标的位置
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若目标存在，严格递增保证唯一位置正是第一个 ``>= target`` 的下标；若不存在，该位置左侧都小于目标，右侧都大于
目标，正是有序插入点。若所有值都小于目标，答案是 ``n``。

半开区间如何容纳末尾答案
~~~~~~~~~~~~~~~~~~~~~~~~

搜索区间使用 ``[low, high)``，初始为 ``[0,n)``。虽然下标 ``n`` 不能访问，却是合法插入位置。循环只访问
``mid < high <= n``，最终 ``low`` 可以自然收敛到 ``n``，无需单独处理目标大于最大值。

分支分别排除哪些位置
~~~~~~~~~~~~~~~~~~~~

若 ``nums[mid] < target``，``mid`` 及其左侧都不可能是第一个不小于目标的位置，令 ``low=mid+1``。否则
``mid`` 可能是答案，右侧位置不可能更早，令 ``high=mid`` 保留中点。

状态演化
~~~~~~~~

对 ``[1,4,7,10]`` 查找 6：

.. list-table::
   :header-rows: 1

   * - ``low``
     - ``mid``
     - ``high``
     - 值
     - 更新
   * - 0
     - 2
     - 4
     - 7
     - ``high=2``
   * - 0
     - 1
     - 2
     - 4
     - ``low=2``

区间收缩到 2，左侧值均小于 6，位置 2 的值大于 6。

为什么终点满足插入条件
~~~~~~~~~~~~~~~~~~~~~~

循环始终保持：``low`` 左侧所有已排除位置的值小于目标，``high`` 及右侧已排除位置不可能是更早答案。终止时
``low==high``，该位置左侧全部小于目标；若位置仍在数组内，其值不小于目标。因此它是唯一正确下界。

复杂度来源
~~~~~~~~~~

区间每轮至少减半，时间 ``O(log n)``，额外空间 ``O(1)``。线性扫描为 ``O(n)``，仅作基准。

九语言实现
----------

C
~

.. code-block:: c

   int searchInsert(int* nums,int n,int target){
       int low=0,high=n;while(low<high){int mid=low+(high-low)/2;if(nums[mid]<target)low=mid+1;else high=mid;}return low;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def searchInsert(self, nums: list[int], target: int) -> int:
           low, high = 0, len(nums)
           while low < high:
               mid = low + (high - low) // 2
               if nums[mid] < target: low = mid + 1
               else: high = mid
           return low

Java
~~~~

.. code-block:: java

   class Solution {
       public int searchInsert(int[] nums,int target){int low=0,high=nums.length;while(low<high){int mid=low+(high-low)/2;if(nums[mid]<target)low=mid+1;else high=mid;}return low;}
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn search_insert(nums:Vec<i32>,target:i32)->i32{
           let(mut low,mut high)=(0,nums.len());while low<high{let mid=low+(high-low)/2;if nums[mid]<target{low=mid+1}else{high=mid}}low as i32
       }
   }

Go
~~

.. code-block:: go

   func searchInsert(nums []int,target int)int{
       low,high:=0,len(nums);for low<high{mid:=low+(high-low)/2;if nums[mid]<target{low=mid+1}else{high=mid}};return low
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function searchInsert(nums:number[],target:number):number{
       let low=0,high=nums.length;while(low<high){const mid=low+Math.floor((high-low)/2);if(nums[mid]<target)low=mid+1;else high=mid;}return low;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int SearchInsert(int[] nums,int target){int low=0,high=nums.Length;while(low<high){int mid=low+(high-low)/2;if(nums[mid]<target)low=mid+1;else high=mid;}return low;}
   }

Julia
~~~~~

.. code-block:: julia

   function search_insert(nums::Vector{Int},target::Int)
       low,high=1,length(nums)+1;while low<high;mid=low+(high-low)÷2;if nums[mid]<target;low=mid+1;else;high=mid;end;end;low-1
   end

R
~

.. code-block:: r

   search_insert <- function(nums,target) {
       low<-1L;high<-length(nums)+1L;while(low<high){mid<-low+(high-low)%/%2L;if(mid<=length(nums)&&nums[[mid]]<target)low<-mid+1L else high<-mid};low-1L
   }