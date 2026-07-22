0081. Search in Rotated Sorted Array II
=======================================

题目信息
--------

:题号: 0081
:题名: Search in Rotated Sorted Array II
:难度: Medium
:类型: Algorithms
:主题: 数组、二分查找、旋转有序数组、重复值
:原题: `LeetCode 0081 <https://leetcode.com/problems/search-in-rotated-sorted-array-ii/>`_
:教学重点: 重复端点消歧、有序半区判断、值域排除、最坏线性退化

题目重述
--------

给定一个可能含有重复值的整数数组 ``nums``。该数组原本按非递减顺序排列，随后在未知位置进行了旋转。判断整数 ``target`` 是否存在于数组中，并返回布尔值。

自建示例
--------

.. code-block:: text

   [2,5,6,0,0,1,2], target=0 -> true
   [1,0,1,1,1],     target=0 -> true
   [1,1,1,1,1],     target=2 -> false

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       bool linearScan(const std::vector<int>& nums, int target) {
           return std::find(nums.begin(), nums.end(), target) != nums.end();
       }

       bool compressThenSearch(const std::vector<int>& nums, int target) {
           std::vector<int> unique;
           for (int value : nums)
               if (unique.empty() || unique.back() != value) unique.push_back(value);
           int left = 0, right = static_cast<int>(unique.size()) - 1;
           while (left <= right) {
               int mid = left + (right - left) / 2;
               if (unique[mid] == target) return true;
               if (unique[left] <= unique[mid]) {
                   if (unique[left] <= target && target < unique[mid]) right = mid - 1;
                   else left = mid + 1;
               } else {
                   if (unique[mid] < target && target <= unique[right]) left = mid + 1;
                   else right = mid - 1;
               }
           }
           return false;
       }

       bool disambiguatedBinary(const std::vector<int>& nums, int target) {
           int left = 0, right = static_cast<int>(nums.size()) - 1;
           while (left <= right) {
               int mid = left + (right - left) / 2;
               if (nums[mid] == target) return true;

               if (nums[left] == nums[mid] && nums[mid] == nums[right]) {
                   ++left;
                   --right;
                   continue;
               }

               if (nums[left] <= nums[mid]) {
                   if (nums[left] <= target && target < nums[mid]) right = mid - 1;
                   else left = mid + 1;
               } else {
                   if (nums[mid] < target && target <= nums[right]) left = mid + 1;
                   else right = mid - 1;
               }
           }
           return false;
       }

   public:
       bool search(std::vector<int>& nums, int target) {
           return disambiguatedBinary(nums, target);
       }
   };

题解
----

无重复版本依赖什么信息
~~~~~~~~~~~~~~~~~~~~

旋转数组在任意中点处至少有一侧保持严格有序。只要识别有序半区，再检查目标是否落入它的端点值域，就能删除另一半。

重复值如何破坏半区判断
~~~~~~~~~~~~~~~~~~~~~~

在 ``[1,0,1,1,1]`` 中，``left``、``mid``、``right`` 的值都为 1。相同的三端观测既可能表示旋转点在左侧，也可能表示旋转点在右侧，无法据此选出有序半区。

端点消歧为何安全
~~~~~~~~~~~~~~~~

中点已经确认不是目标。若 ``nums[left] == nums[mid] == nums[right]``，两个端点也不是目标，因此同时执行 ``left++``、``right--`` 不会删除答案，只移除没有提供顺序信息的重复值。

.. list-table::
   :header-rows: 1

   * - 区间
     - 三端值
     - 动作
   * - ``[0,4]``，数组 ``[1,0,1,1,1]``
     - ``1,1,1``
     - 删除左右端点
   * - ``[1,3]``
     - ``0,1,1``
     - 左半 ``[0,1]`` 有序
   * - 目标 0
     - 落入左半值域
     - 保留左侧并命中

消歧后如何排除半区
~~~~~~~~~~~~~~~~~~

若 ``nums[left] <= nums[mid]``，左半区非递减。只有 ``nums[left] <= target < nums[mid]`` 时目标可能位于左半，否则搜索右半。若左半无序，则右半必然非递减，使用 ``nums[mid] < target <= nums[right]`` 判断是否保留右半。

为何最坏会退化为线性
~~~~~~~~~~~~~~~~~~~~

数组大量元素相同时，三端相等可能连续触发，每轮只能删除两个位置，无法按比例缩小区间。因此平均情况下仍接近 ``O(log n)``，最坏为 ``O(n)``。这是重复值造成的信息缺失，而不是实现缺陷。

压缩重复值为何不是主解法
~~~~~~~~~~~~~~~~~~~~~~~~

先删除连续重复值能恢复多数严格半区信息，但需要 ``O(n)`` 额外数组和预处理，本身已经达到线性时间；直接在二分过程中按需消歧更节省空间。

为什么不会遗漏目标
~~~~~~~~~~~~~~~~~~

消歧只删除已知不等于目标的端点。有序半区判断只删除值域不可能包含目标的位置。每轮都保留所有仍可能等于目标的下标；若目标存在，最终会成为中点，区间耗尽则说明全部候选已被排除。

复杂度来源
~~~~~~~~~~

线性扫描与压缩方法均为 ``O(n)``。消歧二分平均 ``O(log n)``、最坏 ``O(n)``，额外空间 ``O(1)``。

九语言实现
----------

C
~

.. code-block:: c

   bool search(int*a,int n,int target){int l=0,r=n-1;while(l<=r){int m=l+(r-l)/2;if(a[m]==target)return true;if(a[l]==a[m]&&a[m]==a[r]){l++;r--;continue;}if(a[l]<=a[m]){if(a[l]<=target&&target<a[m])r=m-1;else l=m+1;}else{if(a[m]<target&&target<=a[r])l=m+1;else r=m-1;}}return false;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def search(self, a: list[int], target: int) -> bool:
           left,right=0,len(a)-1
           while left<=right:
               mid=(left+right)//2
               if a[mid]==target:return True
               if a[left]==a[mid]==a[right]:left+=1;right-=1;continue
               if a[left]<=a[mid]:
                   if a[left]<=target<a[mid]:right=mid-1
                   else:left=mid+1
               else:
                   if a[mid]<target<=a[right]:left=mid+1
                   else:right=mid-1
           return False

Java
~~~~

.. code-block:: java

   class Solution {public boolean search(int[]a,int target){int l=0,r=a.length-1;while(l<=r){int m=l+(r-l)/2;if(a[m]==target)return true;if(a[l]==a[m]&&a[m]==a[r]){l++;r--;continue;}if(a[l]<=a[m]){if(a[l]<=target&&target<a[m])r=m-1;else l=m+1;}else{if(a[m]<target&&target<=a[r])l=m+1;else r=m-1;}}return false;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn search(a:Vec<i32>,target:i32)->bool{let(mut l,mut r)=(0i32,a.len()as i32-1);while l<=r{let m=l+(r-l)/2;let(x,y,z)=(a[l as usize],a[m as usize],a[r as usize]);if y==target{return true}if x==y&&y==z{l+=1;r-=1;continue}if x<=y{if x<=target&&target<y{r=m-1}else{l=m+1}}else if y<target&&target<=z{l=m+1}else{r=m-1}}false}}

Go
~~

.. code-block:: go

   func search(a []int,target int)bool{l,r:=0,len(a)-1;for l<=r{m:=l+(r-l)/2;if a[m]==target{return true};if a[l]==a[m]&&a[m]==a[r]{l++;r--;continue};if a[l]<=a[m]{if a[l]<=target&&target<a[m]{r=m-1}else{l=m+1}}else if a[m]<target&&target<=a[r]{l=m+1}else{r=m-1}};return false}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function search(a:number[],target:number):boolean{let l=0,r=a.length-1;while(l<=r){const m=l+Math.floor((r-l)/2);if(a[m]===target)return true;if(a[l]===a[m]&&a[m]===a[r]){l++;r--;continue;}if(a[l]<=a[m]){if(a[l]<=target&&target<a[m])r=m-1;else l=m+1;}else if(a[m]<target&&target<=a[r])l=m+1;else r=m-1;}return false;}

C#
~~

.. code-block:: csharp

   public class Solution {public bool Search(int[]a,int target){int l=0,r=a.Length-1;while(l<=r){int m=l+(r-l)/2;if(a[m]==target)return true;if(a[l]==a[m]&&a[m]==a[r]){l++;r--;continue;}if(a[l]<=a[m]){if(a[l]<=target&&target<a[m])r=m-1;else l=m+1;}else if(a[m]<target&&target<=a[r])l=m+1;else r=m-1;}return false;}}

Julia
~~~~~

.. code-block:: julia

   function search_rotated(a,target)
       l=1;r=length(a)
       while l<=r
           m=l+(r-l)÷2;a[m]==target&&return true
           if a[l]==a[m]==a[r];l+=1;r-=1;continue;end
           if a[l]<=a[m]
               if a[l]<=target<a[m];r=m-1;else;l=m+1;end
           elseif a[m]<target<=a[r];l=m+1
           else;r=m-1;end
       end;false
   end

R
~

.. code-block:: r

   search_rotated <- function(a,target){l<-1L;r<-length(a);while(l<=r){m<-l+(r-l)%/%2L;if(a[[m]]==target)return(TRUE);if(a[[l]]==a[[m]]&&a[[m]]==a[[r]]){l<-l+1L;r<-r-1L;next};if(a[[l]]<=a[[m]]){if(a[[l]]<=target&&target<a[[m]])r<-m-1L else l<-m+1L}else if(a[[m]]<target&&target<=a[[r]])l<-m+1L else r<-m-1L};FALSE}
