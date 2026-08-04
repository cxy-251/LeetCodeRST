0033. Search in Rotated Sorted Array
====================================

题目信息
--------

:题号: 0033
:难度: Medium
:主题: 数组、二分查找、旋转有序数组
:原题: `LeetCode 0033 <https://leetcode.com/problems/search-in-rotated-sorted-array/>`_
:重点: 从线性扫描推导到识别有序半区，并在不显式寻找旋转点的情况下完成二分查找

题目重述
--------

给定一个元素互不相同的整数数组 ``nums``。它原本按严格递增顺序排列，之后可能在某个位置旋转：将原数组的一个
后缀移动到开头，两个部分内部的相对顺序保持不变。

再给定整数 ``target``。若目标值存在，返回它在旋转后数组中的零基下标；否则返回 ``-1``。题目要求时间复杂度为
``O(log n)``。

例如，严格递增数组 ``[1, 3, 5, 8, 10, 13]`` 可以旋转为 ``[8, 10, 13, 1, 3, 5]``。旋转后整个数组不再
单调，但仍由至多两段严格递增区间组成。

``nums`` 的长度位于 ``[1, 5000]``，元素值和 ``target`` 位于 ``[-10^4, 10^4]``。

自建示例
--------

* 目标位于旋转点左侧：``nums = [8, 10, 13, 1, 3, 5, 6]``、``target = 10``，返回 ``1``；
* 目标位于旋转点右侧：``nums = [15, 18, 2, 4, 7, 11]``、``target = 7``，返回 ``4``；
* 数组没有发生旋转：``nums = [2, 5, 9, 12]``、``target = 9``，返回 ``2``；
* 目标不存在：``nums = [5, 7, 9, 12, 1, 3]``、``target = 8``，返回 ``-1``；
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

线性扫描忽略了什么
~~~~~~~~~~~~~~~~~~

``linearScan`` 从左到右检查每个位置。元素互异，所以第一次发现 ``target`` 就是唯一答案；扫描结束仍未发现则返回
``-1``。它直接覆盖全部可能位置，正确性没有障碍，时间复杂度却是 ``O(n)``。

普通无序数组只能这样逐个排除。旋转数组还保留了大量顺序信息：旋转只打断原数组中的一个相邻关系，数组仍可写成
两段严格递增序列。例如：

.. code-block:: text

   [8, 10, 13] | [1, 3, 5, 6]

若先确定竖线右侧第一个元素的位置，目标就只可能位于其中一段，可以继续使用普通二分查找。

先寻找旋转点
~~~~~~~~~~~~

旋转点 ``pivot`` 是数组最小值的位置，也是第二段递增序列的起点。搜索区间为 ``[left, right]`` 时，将
``nums[middle]`` 与 ``nums[right]`` 比较：

* 若 ``nums[middle] > nums[right]``，中点仍位于较大的左段，最小值只能在 ``middle`` 右侧；
* 否则，中点位于包含最小值的右段，旋转点可能就是 ``middle``，所以保留 ``[left, middle]``。

每轮都保留旋转点所在的一半，最终 ``left == right`` 时得到最小值位置。未旋转数组也适用：所有中点值都不大于
右端值，区间会不断向下标 ``0`` 收缩。

找到 ``pivot`` 后，``[pivot, n-1]`` 与 ``[0, pivot-1]`` 都严格递增。若
``nums[pivot] <= target <= nums[n-1]``，就在右段二分；否则只需搜索左段。

这已经满足 ``O(log n)``：寻找旋转点一次二分，搜索目标再做一次二分。下一步不是降低数量级，而是观察这两个阶段
实际都在回答同一个问题：当前中点的哪一侧仍可能包含目标。

不必知道旋转点的精确位置
~~~~~~~~~~~~~~~~~~~~~~~~

考虑任意当前候选区间 ``[left, right]``。它仍是原旋转数组的一段连续区间，因此内部至多包含一个旋转断点。中点
把它分成 ``[left, middle]`` 与 ``[middle, right]`` 后，断点不可能同时落在两边内部，所以至少一半必然严格递增。

元素互异时，可以用端点直接识别有序半区：

* ``nums[left] <= nums[middle]``，左半区有序；
* 否则左半区跨过旋转点，右半区必然有序。

中点已经先与目标比较，因此之后只需判断目标是否严格落在某个有序半区的剩余范围内。

左半区有序时
~~~~~~~~~~~~

若 ``nums[left] <= nums[middle]``，左半区中的值完整覆盖
``[nums[left], nums[middle]]``，并且每个值只出现一次。

中点已确认不等于目标，所以：

* ``nums[left] <= target < nums[middle]`` 时，目标若存在只能在 ``[left, middle-1]``；
* 否则目标不可能位于左半区，应保留 ``[middle+1, right]``。

第一种情况舍弃右半区，是因为有序左半区的端点范围已经证明目标属于左侧值域。第二种情况舍弃左半区，是因为其中
所有值都位于已知范围内，而目标不在该范围。

右半区有序时
~~~~~~~~~~~~

若左半区无序，旋转断点位于左侧，``[middle, right]`` 必然严格递增。同样先排除已经检查过的中点：

* ``nums[middle] < target <= nums[right]`` 时保留 ``[middle+1, right]``；
* 否则保留 ``[left, middle-1]``。

四个范围判断都使用一端闭、一端开的形式，是因为 ``middle`` 已经单独检查，不能再次留在下一轮候选区间中。

状态演化
~~~~~~~~

以 ``nums = [4, 5, 6, 7, 0, 1, 2]``、``target = 2`` 为例：

.. list-table::
   :header-rows: 1

   * - ``left``
     - ``middle``
     - ``right``
     - 可确认的有序半区
     - 保留区间
   * - 0（4）
     - 3（7）
     - 6（2）
     - 左半 ``[4,5,6,7]``
     - 2 不在 ``[4,7)``，保留 ``[4,6]``
   * - 4（0）
     - 5（1）
     - 6（2）
     - 左半 ``[0,1]``
     - 2 不在 ``[0,1)``，保留 ``[6,6]``
   * - 6（2）
     - 6（2）
     - 6（2）
     - 中点命中
     - 返回 6

循环不变量是：若目标存在，它的下标始终位于 ``[left, right]``。每轮先检查中点，再借助一个确定有序的半区证明
其中是否可能包含目标，只舍弃已被范围关系排除的位置，因此不变量持续成立。

元素互异为何是决定性条件
~~~~~~~~~~~~~~~~~~~~~~~~

判断 ``nums[left] <= nums[middle]`` 的可靠性依赖元素互异。当前题中若两者相等，只可能是同一个位置，或左半区确实
按非递减关系有序，不会出现多个相等值同时遮住旋转断点。

若允许大量重复值，例如 ``[1, 0, 1, 1, 1]``，当 ``left``、``middle``、``right`` 都为 ``1`` 时，仅凭端点无法
判断断点在哪一侧，只能逐步缩边界，最坏可能退化为线性。本题排除重复值，才能保证每轮确定并舍弃约一半区间。

代码演进
~~~~~~~~

``linearScan`` 把每个下标都当作独立候选，没有利用旋转前的严格递增结构。

``findPivotThenSearch`` 先恢复全局结构：二分找到最小值，把数组明确拆成两个有序区间，再选择其中一段执行普通二分。
它展示了旋转数组仍能使用二分的根本原因。

``onePassBinarySearch`` 进一步发现，搜索目标并不需要知道旋转点的精确下标。每轮只要确认左右两半中至少一半有序，
就能通过端点值域决定保留哪一侧。公开入口采用该方法，把“定位旋转点”和“查找目标”合并进同一个二分循环。

复杂度分析
~~~~~~~~~~

``linearScan`` 最坏检查 ``n`` 个元素，时间复杂度为 ``O(n)``，工作空间为 ``O(1)``。

``findPivotThenSearch`` 进行两次二分，每次区间都按比例缩小，时间复杂度为 ``O(log n)``，工作空间为 ``O(1)``。

``onePassBinarySearch`` 每轮至少删除中点及其一侧候选，区间长度至多减半，因此时间复杂度为 ``O(log n)``；只维护
三个下标，工作空间为 ``O(1)``。
