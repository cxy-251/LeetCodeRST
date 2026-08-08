0033. Search in Rotated Sorted Array
====================================

题目信息
--------

:题号: 0033. 搜索旋转排序数组
:难度: Medium
:主题: 数组、二分查找、旋转有序数组
:原题: `LeetCode 0033 <https://leetcode.com/problems/search-in-rotated-sorted-array/>`_
:重点: 从线性扫描推导到识别单调半区，并在不显式寻找旋转点的情况下完成二分查找

题目重述
--------

给定一个元素互不相同的整数数组 ``nums``。它原本按严格递增顺序排列，随后可能在某个位置旋转：把原数组的一个
后缀移动到开头，两个部分内部的相对顺序保持不变。

再给定整数 ``target``。若目标值存在，返回它在旋转后数组中的零基下标；否则返回 ``-1``。题目要求时间复杂度为
``O(log n)``。

旋转后整个数组不再单调，但仍由至多两段严格递增区间组成。``nums`` 的长度位于 ``[1, 5000]``，元素值和
``target`` 位于 ``[-10^4, 10^4]``。

自建示例
--------

* 目标位于左段：``nums = [8,10,13,1,3,5,6]``、``target = 10``，返回 ``1``；
* 目标位于右段：``nums = [15,18,2,4,7,11]``、``target = 7``，返回 ``4``；
* 数组未旋转：``nums = [2,5,9,12]``、``target = 9``，返回 ``2``；
* 目标不存在：``nums = [5,7,9,12,1,3]``、``target = 8``，返回 ``-1``；
* 单个元素：``nums = [4]``、``target = 3``，返回 ``-1``。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       int linearScan(const std::vector<int>& nums, int target) {
           for (int index = 0; index < static_cast<int>(nums.size()); ++index) {
               if (nums[index] == target) {
                   return index;
               }
           }
           return -1;
       }

       int binarySearch(
           const std::vector<int>& nums,
           int target,
           int left,
           int right
       ) {
           while (left <= right) {
               const int middle = left + (right - left) / 2;
               if (nums[middle] == target) {
                   return middle;
               }
               if (nums[middle] < target) {
                   left = middle + 1;
               } else {
                   right = middle - 1;
               }
           }
           return -1;
       }

       int findPivotThenSearch(const std::vector<int>& nums, int target) {
           int left = 0;
           int right = static_cast<int>(nums.size()) - 1;
           while (left < right) {
               const int middle = left + (right - left) / 2;
               if (nums[middle] > nums[right]) {
                   left = middle + 1;
               } else {
                   right = middle;
               }
           }

           const int pivot = left;
           const int last = static_cast<int>(nums.size()) - 1;
           if (nums[pivot] <= target && target <= nums[last]) {
               return binarySearch(nums, target, pivot, last);
           }
           return binarySearch(nums, target, 0, pivot - 1);
       }

       int onePassBinarySearch(const std::vector<int>& nums, int target) {
           int left = 0;
           int right = static_cast<int>(nums.size()) - 1;

           while (left <= right) {
               const int middle = left + (right - left) / 2;
               if (nums[middle] == target) {
                   return middle;
               }

               if (nums[left] <= nums[middle]) {
                   if (nums[left] <= target && target < nums[middle]) {
                       right = middle - 1;
                   } else {
                       left = middle + 1;
                   }
               } else {
                   if (nums[middle] < target && target <= nums[right]) {
                       left = middle + 1;
                   } else {
                       right = middle - 1;
                   }
               }
           }
           return -1;
       }

   public:
       int search(std::vector<int>& nums, int target) {
           return onePassBinarySearch(nums, target);
       }
   };

题解
----

线性搜索基线
~~~~~~~~~~~~

``linearScan`` 从左到右检查每个位置。元素互异，所以第一次发现 ``target`` 就是唯一答案；扫描结束仍未发现则返回
``-1``。该方法直接覆盖全部位置，时间复杂度为 ``O(n)``。

普通无序数组只能逐个排除，但旋转数组只打断了原递增数组中的一个相邻关系。它仍可写成两段严格递增序列：

.. code-block:: text

   [8, 10, 13] | [1, 3, 5, 6]

顺序信息并未消失，关键是利用它一次排除一半候选。

旋转点二分
~~~~~~~~~~

一种直接做法是先找到最小值位置 ``pivot``，再在两段递增区间中选择一段做普通二分。

搜索旋转点时比较 ``nums[middle]`` 与 ``nums[right]``：

* ``nums[middle] > nums[right]``，中点位于较大的左段，最小值只能在右侧；
* 否则中点位于包含最小值的右段，旋转点可能就是 ``middle``。

每轮都保留旋转点所在的一半，最终 ``left == right`` 时得到最小值位置。未旋转数组也适用，此时区间会收缩到
下标 ``0``。

找到旋转点后，``[pivot,n-1]`` 与 ``[0,pivot-1]`` 都严格递增。根据目标是否落在
``[nums[pivot],nums[n-1]]`` 中选择一段，再执行普通二分。该方法由两次 ``O(log n)`` 搜索组成，总复杂度仍为
``O(log n)``。

单调半区
~~~~~~~~

搜索目标不必知道旋转点的精确下标。考虑当前候选区间 ``[left,right]``：它至多包含一个旋转断点，中点把区间
分开后，断点不可能同时位于两边内部，因此至少一半严格递增。

元素互异时可以用端点识别单调半区：

* ``nums[left] <= nums[middle]``，左半区 ``[left,middle]`` 有序；
* 否则旋转点位于左半区，右半区 ``[middle,right]`` 有序。

二分查找真正需要的不是整段数组有序，而是每轮至少有一半能够通过端点值域判断目标是否属于其中。

值域排除
~~~~~~~~

中点已经先与目标比较，因此后续区间不再包含 ``middle``。

左半区有序时，其值域为 ``[nums[left],nums[middle]]``：

.. code-block:: text

   nums[left] <= target < nums[middle]

成立时，目标若存在只能位于 ``[left,middle-1]``；否则左半区可以整体排除，保留
``[middle+1,right]``。

右半区有序时，对称判断：

.. code-block:: text

   nums[middle] < target <= nums[right]

成立时保留 ``[middle+1,right]``；否则保留 ``[left,middle-1]``。

循环始终维护不变量：若目标存在，其下标位于 ``[left,right]``。每轮先检查中点，再利用一个已确认有序的半区和
端点值域排除不可能包含目标的一侧，因此不会丢失答案。

以 ``nums = [4,5,6,7,0,1,2]``、``target = 2`` 为例：

.. list-table::
   :header-rows: 1

   * - 候选区间
     - 中点
     - 有序半区
     - 保留区间
   * - ``[0,6]``
     - 下标 3，值 7
     - 左半 ``[4,5,6,7]``
     - 2 不在 ``[4,7)``，保留 ``[4,6]``
   * - ``[4,6]``
     - 下标 5，值 1
     - 左半 ``[0,1]``
     - 2 不在 ``[0,1)``，保留 ``[6,6]``
   * - ``[6,6]``
     - 下标 6，值 2
     - 中点命中
     - 返回 6

重复值限制
~~~~~~~~~~

单调半区的识别依赖元素互异。若允许大量重复值，例如 ``[1,0,1,1,1]``，当 ``left``、``middle``、``right``
对应值都为 ``1`` 时，仅凭端点无法判断旋转点位于哪一侧，只能逐步缩小边界，最坏可能退化为线性。

本题排除重复值，因此 ``nums[left] <= nums[middle]`` 能可靠确认左半区有序；每轮都能舍弃约一半候选。

复杂度分析
~~~~~~~~~~

``linearScan`` 最坏检查 ``n`` 个元素，时间复杂度为 ``O(n)``，额外空间为 ``O(1)``。

``findPivotThenSearch`` 进行两次二分，时间复杂度为 ``O(log n)``，额外空间为 ``O(1)``。

``onePassBinarySearch`` 每轮保留至多一半候选，时间复杂度为 ``O(log n)``；只维护三个下标，额外空间为
``O(1)``。公开入口采用该方法。
