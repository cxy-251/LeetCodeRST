0035. Search Insert Position
============================

题目信息
--------

:题号: 0035
:难度: Easy
:主题: 数组、二分查找、下界
:原题: `LeetCode 0035 <https://leetcode.com/problems/search-insert-position/>`_
:重点: 从精确查找与失败插入两种情况，推导到统一寻找第一个不小于目标的位置

题目重述
--------

给定一个按严格递增顺序排列、元素互不相同的整数数组 ``nums`` 和整数 ``target``。若 ``target`` 已经存在，返回
它的零基下标；若不存在，返回把它插入数组后仍保持严格递增的位置。

返回值可以等于 ``nums.size()``，表示目标应插入数组末尾。题目要求时间复杂度为 ``O(log n)``。

``nums`` 的长度位于 ``[1, 10^4]``，数组元素和 ``target`` 均位于 ``[-10^4, 10^4]``。

自建示例
--------

* 目标已经存在：``nums = [2, 5, 9, 14]``、``target = 9``，返回 ``2``；
* 插入两个元素之间：``nums = [1, 4, 7, 10]``、``target = 6``，返回 ``2``；
* 插入数组开头：``nums = [3, 8, 12]``、``target = -2``，返回 ``0``；
* 插入数组末尾：``nums = [-3, 0, 8]``、``target = 12``，返回 ``3``；
* 单元素数组：``nums = [5]``、``target = 4``，返回 ``0``；``target = 6`` 时返回 ``1``。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       int linearScan(const std::vector<int>& nums, int target) {
           for (int index = 0; index < static_cast<int>(nums.size()); ++index) {
               if (nums[index] >= target) {
                   return index;
               }
           }
           return static_cast<int>(nums.size());
       }

       int exactSearchThenInsert(const std::vector<int>& nums, int target) {
           int left = 0;
           int right = static_cast<int>(nums.size()) - 1;
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
           return left;
       }

       int lowerBound(const std::vector<int>& nums, int target) {
           int left = 0;
           int right = static_cast<int>(nums.size());
           while (left < right) {
               const int middle = left + (right - left) / 2;
               if (nums[middle] < target) {
                   left = middle + 1;
               } else {
                   right = middle;
               }
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

线性扫描先统一答案语义
~~~~~~~~~~~~~~~~~~~~~~

最直接的方法从左向右寻找第一个满足 ``nums[index] >= target`` 的位置：

* 若该位置的值等于目标，它就是目标下标；
* 若该位置的值大于目标，目标应插入它之前；
* 若始终没有找到，所有元素都小于目标，插入位置就是数组长度。

因此题目表面的“查找成功”与“查找失败”并不是两个独立问题。它们都在寻找同一个边界：第一个不小于目标的位置。
``linearScan`` 已经准确表达这个边界，但最坏需要检查全部 ``n`` 个元素。

普通二分失败后留下了什么
~~~~~~~~~~~~~~~~~~~~~~~~

先按照精确查找编写普通二分。``exactSearchThenInsert`` 在闭区间 ``[left, right]`` 中搜索：

* 中点值等于目标时立即返回；
* 中点值小于目标时舍弃中点及左侧；
* 中点值大于目标时舍弃中点及右侧。

目标不存在时，循环终止于 ``left == right + 1``。此时可以证明：

* ``left`` 左侧的值都小于目标；
* ``left`` 及其右侧的值都大于目标，或者 ``left == nums.size()``。

所以 ``left`` 正好是插入位置。普通二分不需要在失败后再做线性扫描，已经把时间降到 ``O(log n)``。

这种写法依赖题目中的元素互异条件。若数组允许重复值，命中任意一个目标就返回，未必得到第一个目标位置；而插入位置
通常更自然地定义为第一个不小于目标的位置。

把两个出口改成一个边界
~~~~~~~~~~~~~~~~~~~~~~

既然存在与不存在最终都返回同一个下界，就不必在循环中单独处理 ``nums[middle] == target``。定义：

.. code-block:: text

   lowerBound(target) = 第一个满足 nums[index] >= target 的位置

数组严格递增，因此条件 ``nums[index] >= target`` 随下标呈单调变化：前面连续为假，后面连续为真。二分查找的任务
就是定位真假分界。

``lowerBound`` 搜索半开区间 ``[left, right)``，初始为 ``[0, n)``。位置 ``n`` 虽然不能访问，却是合法插入点，
代表所有数组元素都小于目标。

每个分支删除哪些位置
~~~~~~~~~~~~~~~~~~~~

取 ``middle = left + (right - left) / 2``：

* 若 ``nums[middle] < target``，中点以及更左位置的值都小于目标，不可能是下界，令
  ``left = middle + 1``；
* 若 ``nums[middle] >= target``，中点可能就是第一个满足位置，不能丢弃它；更右位置不可能更早，令
  ``right = middle``。

两个分支都严格缩短区间，并始终保留真正的下界。与精确查找相比，等于目标时不再返回，而是继续向左压缩，直到
确认没有更早的满足位置。

状态演化
~~~~~~~~

以 ``nums = [1, 4, 7, 10]``、``target = 6`` 为例：

.. list-table::
   :header-rows: 1

   * - ``left``
     - ``middle``
     - ``right``
     - ``nums[middle]``
     - 更新
     - 保留区间
   * - 0
     - 2
     - 4
     - 7
     - ``right = 2``
     - ``[0, 2)``
   * - 0
     - 1
     - 2
     - 4
     - ``left = 2``
     - ``[2, 2)``

循环终止于 ``left == right == 2``。下标 ``2`` 左侧的值都小于 ``6``，而 ``nums[2] = 7`` 不小于 ``6``，所以
目标应插入下标 ``2``。

终止位置为什么同时覆盖全部边界
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

半开区间模板无需为开头和末尾编写特殊分支：

* 目标小于最小值时，每次都收缩 ``right``，最终得到 ``0``；
* 目标等于某个元素时，最终停在该元素位置；
* 目标位于两个元素之间时，最终停在右侧较大元素位置；
* 目标大于最大值时，每次都推进 ``left``，最终得到 ``n``。

循环结束时 ``left == right``，候选区间只剩一个插入边界。此位置左侧所有元素都小于目标；若位置小于 ``n``，该
位置及右侧元素都不小于目标，因此它是唯一正确答案。

代码演进
~~~~~~~~

``linearScan`` 直接寻找第一个不小于目标的位置，语义正确但没有利用数组有序性。

``exactSearchThenInsert`` 用普通二分搜索目标；命中时返回，失败时利用最终的 ``left`` 作为插入点。它已经达到
对数时间，但循环中仍把“目标存在”当成特殊出口。

``lowerBound`` 进一步把两种结果统一为一个单调边界，删除命中分支，并让位置 ``n`` 自然进入搜索空间。公开入口
采用该方法，因为循环不变量直接对应题目要求，也能自然推广到含重复值数组的插入位置问题。

复杂度分析
~~~~~~~~~~

线性扫描最坏读取 ``n`` 个元素，时间复杂度为 ``O(n)``。两种二分方法每轮至少舍弃一半候选位置，时间复杂度均为
``O(log n)``。三种方法都只维护常数个下标，工作空间为 ``O(1)``。
