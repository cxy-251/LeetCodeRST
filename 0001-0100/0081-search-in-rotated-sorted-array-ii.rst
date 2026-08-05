0081. Search in Rotated Sorted Array II
=======================================

题目信息
--------

:题号: 0081
:难度: Medium
:主题: 数组、二分查找、旋转有序数组、重复值
:原题: `LeetCode 0081 <https://leetcode.com/problems/search-in-rotated-sorted-array-ii/>`_
:重点: 从线性扫描，推导到重复端点消歧，再恢复有序半区二分

题目重述
--------

给定一个非递减数组。它在某个未知下标处旋转后形成数组 ``nums``，其中允许出现重复值。
判断整数 ``target`` 是否存在于 ``nums`` 中。

旋转表示把原数组分成前后两段，再交换两段顺序。例如：

.. code-block:: text

   原数组：[0,1,2,4,4,5,6]
   旋转后：[4,5,6,0,1,2,4]

约束如下：

- ``1 <= nums.length <= 5000``
- ``-10^4 <= nums[i], target <= 10^4``

自建示例
--------

.. code-block:: text

   输入：nums = [4,4,5,6,0,1,2,4], target = 1
   输出：true

目标位于旋转点右侧的有序段中。

.. code-block:: text

   输入：nums = [1,1,1,0,1], target = 0
   输出：true

初始左端、中点和右端都等于 1，必须先移除没有顺序信息的重复端点。

.. code-block:: text

   输入：nums = [2,2,2,2,2], target = 3
   输出：false

所有元素相同且都不是目标，二分查找会逐步退化为线性消歧。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       bool linearScan(const std::vector<int>& nums, int target) {
           for (int value : nums) {
               if (value == target) {
                   return true;
               }
           }
           return false;
       }

       bool discardOneDuplicateEnd(const std::vector<int>& nums,
                                   int target) {
           int left = 0;
           int right = static_cast<int>(nums.size()) - 1;

           while (left <= right) {
               int middle = left + (right - left) / 2;

               if (nums[middle] == target) {
                   return true;
               }

               if (nums[left] == nums[middle]) {
                   ++left;
                   continue;
               }

               if (nums[left] < nums[middle]) {
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

           return false;
       }

       bool discardBothDuplicateEnds(const std::vector<int>& nums,
                                     int target) {
           int left = 0;
           int right = static_cast<int>(nums.size()) - 1;

           while (left <= right) {
               int middle = left + (right - left) / 2;

               if (nums[middle] == target) {
                   return true;
               }

               if (nums[left] == nums[middle] &&
                   nums[middle] == nums[right]) {
                   ++left;
                   --right;
                   continue;
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

           return false;
       }

   public:
       bool search(std::vector<int>& nums, int target) {
           return discardBothDuplicateEnds(nums, target);
       }
   };

题解
----

线性扫描起点
~~~~~~~~~~~~

直接检查每个元素一定正确，时间为 ``O(n)``。要继续优化，必须利用旋转数组仍由两个非递减段组成这一结构。

没有重复值时，中点至少有一侧可以根据端点关系确定为有序段。若目标落在该段的值域内，就保留该段；
否则删除它。这样每轮可以排除约一半候选。

重复值造成歧义
~~~~~~~~~~~~~~

数组 ``[1,0,1,1,1]`` 的初始状态为：

.. code-block:: text

   left = 0, middle = 2, right = 4
   nums[left] = nums[middle] = nums[right] = 1

仅凭三个值无法判断旋转点在中点左侧还是右侧，因此也无法证明哪一半有序。
这不是二分模板的边界错误，而是重复值确实抹去了顺序信息。

单侧消歧
~~~~~~~~

中点已经确认不等于目标。若 ``nums[left] == nums[middle]``，左端点也不等于目标，删除左端点是安全的：

.. code-block:: text

   ++left

持续删除后，要么找到目标，要么出现 ``nums[left] != nums[middle]``，此时可以重新识别有序半区。
这种写法只需要一个消歧分支，最坏仍可能逐个删除元素。

双侧消歧
~~~~~~~~

当三端值全部相等时，中点不是目标意味着左右端点也都不是目标，因此可以同时执行：

.. code-block:: text

   ++left
   --right

这比只删除左端点对全相等区间更直接。若只有一侧与中点相等，则仍可能通过另一侧的大小关系识别有序半区，
不能无条件同时删除两端。

有序半区
~~~~~~~~

完成必要的消歧后，分两种情况。

``nums[left] <= nums[middle]`` 表示左半区非递减。目标满足下面的半开值域时，只可能位于左半区：

.. code-block:: text

   nums[left] <= target < nums[middle]

否则搜索右半区。

若 ``nums[left] > nums[middle]``，旋转点位于左半区，右半区必然非递减。目标满足下面的值域时保留右半区：

.. code-block:: text

   nums[middle] < target <= nums[right]

左右条件采用不同的开闭边界，是因为中点已经检查过，不能再次保留在新区间中。

循环不变量
~~~~~~~~~~

每轮开始时，若目标存在，则它一定仍位于闭区间 ``[left, right]`` 中。

- 命中中点时立即返回。
- 消歧只删除已知不等于目标的端点。
- 有序半区判断只删除值域不可能包含目标的一半。

因此算法不会遗漏目标。区间耗尽时，所有可能位置均已排除。

退化原因
~~~~~~~~

在 ``[2,2,2,2,2]`` 中查找 3 时，每轮都只能删除重复端点，无法按比例缩小区间。
所以该算法在歧义很少时具有二分查找的 ``O(log n)`` 行为，最坏时间为 ``O(n)``。

重复值造成的信息缺失决定了这种最坏退化；常量空间算法无法保证每轮都排除一半元素。

复杂度
~~~~~~

线性扫描时间为 ``O(n)``。两种消歧二分在无大量歧义时为 ``O(log n)``，最坏为 ``O(n)``；
它们都只维护几个下标，额外空间为 ``O(1)``。
