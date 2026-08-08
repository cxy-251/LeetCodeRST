0035. Search Insert Position
============================

题目信息
--------

:题号: 0035. 搜索插入位置
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

线性下界
~~~~~~~~

从左向右寻找第一个满足 ``nums[index] >= target`` 的位置：

* 该值等于目标时，当前位置就是目标下标；
* 该值大于目标时，目标应插入当前位置之前；
* 始终没有找到时，目标应插入数组末尾。

因此，题目中的查找与插入共享同一个答案定义：第一个不小于目标的位置，也就是目标的下界。
``linearScan`` 直接实现该定义，但最坏需要读取全部元素，时间为 ``O(n)``。

精确查找的终止边界
~~~~~~~~~~~~~~~~~~

``exactSearchThenInsert`` 先在闭区间 ``[left, right]`` 中执行普通二分。中点值小于目标时舍弃左半区；中点值大于
目标时舍弃右半区；命中目标时立即返回。

目标不存在时，循环终止于 ``left == right + 1``。此时：

* ``left`` 左侧的元素都小于目标；
* ``left`` 及其右侧的元素都大于目标，或者 ``left == nums.size()``。

所以失败后的 ``left`` 正好是插入位置。这一方法已经达到 ``O(log n)``，但命中目标仍是单独出口；若数组允许重复
值，它也只保证返回某个目标位置，而不是第一个目标位置。

统一下界
~~~~~~~~

存在与不存在最终都可以改写为同一个边界：

.. code-block:: text

   lowerBound(target) = 第一个满足 nums[index] >= target 的位置

数组有序，因此条件 ``nums[index] >= target`` 随下标呈现先假后真的单调结构。``lowerBound`` 不再询问中点是否
恰好等于目标，而是直接寻找真假分界。

搜索区间采用半开形式 ``[left, right)``，初始为 ``[0, n)``。位置 ``n`` 虽然不能访问，却是合法答案，表示所有
元素都小于目标。

半开区间不变量
~~~~~~~~~~~~~~

循环始终保持：

* ``[0, left)`` 中的元素都小于目标；
* ``[right, n)`` 中的元素都不小于目标；
* 真正的下界仍位于闭范围 ``[left, right]``。

取 ``middle = left + (right - left) / 2``：

* ``nums[middle] < target`` 时，中点及其左侧都不是答案，令 ``left = middle + 1``；
* ``nums[middle] >= target`` 时，中点仍可能是最早满足位置，令 ``right = middle``。

两个分支都严格缩小区间，并且不丢失下界。等于目标时继续向左收缩，最终自然得到目标第一次出现的位置。

边界覆盖
~~~~~~~~

半开区间模板同时覆盖全部返回情况：

* 目标小于最小值时，``right`` 最终收缩到 ``0``；
* 目标等于某个元素时，搜索停在该元素位置；
* 目标位于两个元素之间时，搜索停在右侧较大元素位置；
* 目标大于最大值时，``left`` 最终推进到 ``n``。

以 ``nums = [1, 4, 7, 10]``、``target = 6`` 为例，第一次取中点 ``2``，值 ``7`` 不小于目标，令
``right = 2``；第二次取中点 ``1``，值 ``4`` 小于目标，令 ``left = 2``。循环结束于下标 ``2``，其左侧都
小于 ``6``，而 ``nums[2] = 7`` 不小于 ``6``，所以插入位置为 ``2``。

代码演进
~~~~~~~~

``linearScan`` 直接寻找第一个不小于目标的位置，语义准确但没有利用数组有序性。

``exactSearchThenInsert`` 用普通二分搜索目标，命中时返回，失败时利用终止后的 ``left`` 作为插入位置。

``lowerBound`` 将命中与插入统一为一个单调边界，删除相等分支，并让位置 ``n`` 自然进入答案范围。公开入口采用该
方法，其循环不变量与题目要求直接对应，也能推广到包含重复值的有序数组。

复杂度分析
~~~~~~~~~~

线性扫描最坏读取 ``n`` 个元素，时间复杂度为 ``O(n)``。两种二分方法每轮至少舍弃一半候选位置，时间复杂度均为
``O(log n)``。三种方法都只维护常数个下标，工作空间为 ``O(1)``。
