0327. Count of Range Sum
========================

题目信息
--------

:题号: 0327
:难度: Hard
:主题: 连续子数组、区间和、闭区间计数、宽整数
:原题: `LeetCode 0327 <https://leetcode.com/problems/count-of-range-sum/>`_
:重点: 统计所有起止下标组合、子数组不能为空、上下界均包含、前缀和可能超出 32 位

题目重述
--------

给定整数数组 ``nums`` 和整数 ``lower``、``upper``，其中 ``lower <= upper``。对所有满足 ``0 <= i <= j < nums.length`` 的连续非空子数组，计算 ``nums[i] + ... + nums[j]``，返回其中和落在闭区间 ``[lower, upper]`` 内的子数组数量。

``nums`` 的长度位于 ``[1, 10^5]``，数组元素以及两个边界都位于 32 位有符号整数范围。不同的 ``(i, j)`` 下标对分别计数，即使它们的元素和相同也不能合并。中间前缀和可能超过 32 位范围，题目保证最终计数结果可以由 32 位有符号整数表示。

自建示例
--------

多个不同区间具有合格的和：

.. code-block:: text

   输入：nums = [1, -1, 2]，lower = 1，upper = 2
   输出：4
   解释：符合条件的子数组是 [1]、[1,-1,2]、[-1,2] 和 [2]，它们的和分别为 1、2、1、2。

边界值需要计入：

.. code-block:: text

   输入：nums = [3]，lower = 3，upper = 3
   输出：1
   解释：唯一子数组的和恰好等于上下界，闭区间包含该值。

把子数组和改写成前缀和对
--------------------------

令 ``prefix[t]`` 表示前 ``t`` 个元素的和。子数组 ``i..j`` 的和是
``prefix[j + 1] - prefix[i]``，所以对每个右端前缀 ``prefix[r]``，需要统计之前的前缀 ``prefix[l]`` 满足
``prefix[r] - upper <= prefix[l] <= prefix[r] - lower``。``l < r`` 保证子数组非空。

前缀和数组不能直接排序后保留下标顺序，因此使用归并排序的分治过程：递归完成左右两半后，两半分别有序；对右半的每个前缀，用两个单调指针在左半寻找满足下界和上界的范围，指针不会回退。统计完成后再把两半合并，供更大的区间继续使用。这样既保留了 ``l`` 在 ``r`` 之前的关系，又能在线性合并时间内计数。

上下界是闭区间，左指针跳过严格小于 ``prefix[r] - upper`` 的值，右指针跳过小于等于 ``prefix[r] - lower`` 的值，二者之差正好是合法数量。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       std::vector<long long> prefix;
       long long lowerBound;
       long long upperBound;

       long long sortAndCount(int left, int right) {
           if (right - left <= 1) return 0;

           int middle = left + (right - left) / 2;
           long long answer = sortAndCount(left, middle)
                            + sortAndCount(middle, right);

           int low = middle;
           int high = middle;
           for (int i = left; i < middle; ++i) {
               while (low < right
                      && prefix[low] - prefix[i] < lowerBound) ++low;
               while (high < right
                      && prefix[high] - prefix[i] <= upperBound) ++high;
               answer += high - low;
           }

           std::vector<long long> merged;
           merged.reserve(right - left);
           int i = left;
           int j = middle;
           while (i < middle && j < right) {
               if (prefix[i] <= prefix[j]) {
                   merged.push_back(prefix[i++]);
               } else {
                   merged.push_back(prefix[j++]);
               }
           }
           while (i < middle) merged.push_back(prefix[i++]);
           while (j < right) merged.push_back(prefix[j++]);
           std::copy(merged.begin(), merged.end(), prefix.begin() + left);
           return answer;
       }

   public:
       int countRangeSum(std::vector<int>& nums,
                         int lower, int upper) {
           lowerBound = lower;
           upperBound = upper;
           prefix.assign(nums.size() + 1, 0);
           for (int i = 0; i < static_cast<int>(nums.size()); ++i) {
               prefix[i + 1] = prefix[i] + nums[i];
           }
           return static_cast<int>(sortAndCount(
               0, static_cast<int>(prefix.size())));
       }
   };

代码分析
--------

分治中只统计左半前缀到右半前缀的配对，天然满足 ``l < r``；同一递归层的左右子区间覆盖的正是跨越中点的非空子数组。所有加减都使用 ``long long``，避免输入元素累加时溢出。排序和双指针合并使时间复杂度为 ``O(n log n)``，递归及临时数组空间为 ``O(n)``。
