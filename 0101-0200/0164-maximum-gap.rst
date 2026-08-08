0164. Maximum Gap
=================

题目信息
--------

:题号: 0164. 最大间距
:难度: Medium
:主题: 数组、桶、鸽巢原理
:原题: `LeetCode 0164 <https://leetcode.com/problems/maximum-gap/>`_
:重点: 从排序后的相邻关系，推导到只保存桶内极值并在线性时间比较跨桶间距

题目重述
--------

给定非负整数数组 ``nums``。将数组按升序排列后，返回相邻元素之间的最大差值；若数组
少于两个元素，则返回 ``0``。

要求在线性时间、线性额外空间内完成。也就是说，直接使用时间为 ``O(n log n)`` 的
比较排序只能作为理解题意的基线，不能作为最终方案。

自建示例
--------

.. code-block:: text

   输入：nums = [2,20,6,7]
   输出：13

   排序后为 [2,6,7,20]，相邻差值为 4、1、13。

.. code-block:: text

   输入：nums = [5,5,5]
   输出：0

   数值范围宽度为 0，所有相邻差值都是 0。

.. code-block:: text

   输入：nums = [9]
   输出：0

   不存在一对相邻元素。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <limits>
   #include <vector>

   class Solution {
   private:
       int sortingBaseline(std::vector<int> nums) {
           if (nums.size() < 2) {
               return 0;
           }

           std::sort(nums.begin(), nums.end());
           int largest_gap = 0;
           for (int i = 1; i < static_cast<int>(nums.size()); ++i) {
               largest_gap =
                   std::max(largest_gap, nums[i] - nums[i - 1]);
           }
           return largest_gap;
       }

       int bucketExtremes(const std::vector<int>& nums) {
           int size = static_cast<int>(nums.size());
           if (size < 2) {
               return 0;
           }

           int minimum = *std::min_element(nums.begin(), nums.end());
           int maximum = *std::max_element(nums.begin(), nums.end());
           if (minimum == maximum) {
               return 0;
           }

           long long range = static_cast<long long>(maximum) - minimum;
           long long width = (range + size - 2) / (size - 1);
           int bucket_count = static_cast<int>(range / width + 1);

           std::vector<int> bucket_minimum(
               bucket_count, std::numeric_limits<int>::max());
           std::vector<int> bucket_maximum(
               bucket_count, std::numeric_limits<int>::min());
           std::vector<char> used(bucket_count, false);

           for (int value : nums) {
               int index = static_cast<int>(
                   (static_cast<long long>(value) - minimum) / width);
               used[index] = true;
               bucket_minimum[index] =
                   std::min(bucket_minimum[index], value);
               bucket_maximum[index] =
                   std::max(bucket_maximum[index], value);
           }

           int largest_gap = 0;
           int previous_maximum = minimum;
           for (int index = 0; index < bucket_count; ++index) {
               if (!used[index]) {
                   continue;
               }
               largest_gap = std::max(
                   largest_gap,
                   bucket_minimum[index] - previous_maximum);
               previous_maximum = bucket_maximum[index];
           }
           return largest_gap;
       }

   public:
       int maximumGap(std::vector<int>& nums) {
           return bucketExtremes(nums);
       }
   };

题解
----

排序基线保留了什么信息
~~~~~~~~~~~~~~~~~~~~~~

题目说的是“排序后相邻”，所以最自然的方案是先排序，再扫描相邻差值。
``sortingBaseline`` 完整实现了这个定义，时间为 ``O(n log n)``。它也揭示了真正需要的
信息：对每个数，只关心它在有序序列中的前驱，而不关心任意远距离数对。

线性要求使问题转变为：能否不恢复完整顺序，却仍找出某些相邻元素之间的最大空隙？
桶方案不会给每个元素排出名次，只保存若干数值区间里的最小值和最大值。

最大间距提供桶宽
~~~~~~~~~~~~~~~~

设数组有 ``n`` 个数，最小值为 ``minimum``，最大值为 ``maximum``，数值跨度为
``R = maximum - minimum``。排序后有 ``n - 1`` 个相邻间距，它们的和是 ``R``，
所以其中最大值至少为：

.. code-block:: text

   ceil(R / (n - 1))

将这个下界记为 ``width``，并从 ``minimum`` 开始按宽度 ``width`` 划桶。整数落入
编号 ``(value - minimum) / width`` 的桶。同一桶覆盖的是一个半开数值段，其中任意
两个整数之差都小于 ``width``；而全局最大间距至少为 ``width``。因此全局最大间距
不可能由同一桶内的两个元素产生，它必然跨越两个非空桶。

这一步是从排序方案删除工作的关键：既然桶内不会产生答案，就不必知道桶内元素的顺序，
只需记住桶的最小值和最大值。

为什么只比较相邻非空桶
~~~~~~~~~~~~~~~~~~~~~~

按桶编号从小到大扫描时，前一个非空桶中的所有数都不大于后一个非空桶中的所有数。
两桶边界处在完整排序结果中真正相邻的两个元素，必然是：

.. code-block:: text

   前一非空桶的最大值 -> 当前非空桶的最小值

空桶表示中间整段没有输入元素，应该直接跳过而不是把扫描断开。变量
``previous_maximum`` 始终保存最近一个非空桶的最大值；遇到下一个非空桶时，用它的
``bucket_minimum`` 计算跨桶间距，再更新状态。

首个非空桶包含全局最小值。代码把 ``previous_maximum`` 初始化为 ``minimum``，
所以首桶产生的比较最多为桶内的 0 或较小差值，不影响答案，也避免为首桶另设分支。

具体走读
~~~~~~~~

对 ``[2,20,6,7]``，``n = 4``、``R = 18``，因此
``width = ceil(18 / 3) = 6``：

.. code-block:: text

   桶 0：[2, 8)   已使用，minimum = 2，maximum = 7
   桶 1：[8,14)   空
   桶 2：[14,20)  空
   桶 3：[20,26)  已使用，minimum = maximum = 20

桶 0 内的 2、6、7 不需要排序，因为其内部差值都小于 6。扫描跳过两个空桶后，比较
``20 - 7 = 13``，这正是排序后 7 与 20 的相邻间距。

若所有值相同，``R = 0``，最大间距直接为 0；这个分支也避免计算出宽度 0。若元素不足
两个，同样不存在相邻差值。``range``、桶宽计算和桶下标的减法使用 ``long long``，
避免极端端点参与中间算术时溢出。

方案选择与复杂度
~~~~~~~~~~~~~~~~

排序基线易于从定义验证，时间 ``O(n log n)``、复制数组需要 ``O(n)`` 空间；桶方案用
两次线性扫描分别建立和读取桶，时间为 ``O(n)``。由桶宽定义可得桶数不超过 ``n``，
因此额外空间为 ``O(n)``。题目明确要求线性时间，主解采用 ``bucketExtremes``。
