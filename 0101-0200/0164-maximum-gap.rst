0164. Maximum Gap
=================

题目信息
--------

:题号: 0164
:难度: Medium
:主题: 数组、桶排序、线性复杂度
:原题: `LeetCode 0164 <https://leetcode.com/problems/maximum-gap/>`_
:重点: 排序后相邻元素、最大差值、少于两项、线性时间与空间

题目重述
--------

给定非负整数数组 ``nums``。设想将所有元素按升序排列，返回排序结果中任意两个相邻元素之间的最大差值；若数组不足两个元素，则返回 ``0``。重复元素会形成差值 ``0``，但仍应保留在排序后的相邻关系中。

``nums`` 的长度在 ``1..10^5`` 范围内，每个元素在 ``0..10^9`` 范围内，答案保证能用 32 位有符号整数表示。要求算法达到 ``O(n)`` 时间和 ``O(n)`` 额外空间，不能直接依赖比较排序。

自建示例
--------

.. code-block:: text

   输入：nums = [2,20,6,7]
   输出：13
   解释：升序排列后为 [2,6,7,20]，相邻差值分别为 4、1、13，最大值是 13。

.. code-block:: text

   输入：nums = [5,5,5]
   输出：0
   解释：排序后所有相邻元素都相等，因此最大相邻差值为 0。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <climits>
   #include <vector>

   class Solution {
   private:
       int sorting(std::vector<int> nums) {
           std::sort(nums.begin(), nums.end());
           int answer = 0;
           for (int i = 1; i < static_cast<int>(nums.size()); ++i)
               answer = std::max(answer, nums[i] - nums[i - 1]);
           return answer;
       }

       int buckets(const std::vector<int>& nums) {
           int n = nums.size();
           if (n < 2) return 0;
           int minimum = *std::min_element(nums.begin(), nums.end());
           int maximum = *std::max_element(nums.begin(), nums.end());
           if (minimum == maximum) return 0;

           int width = std::max(1, (maximum - minimum + n - 2) / (n - 1));
           int count = (maximum - minimum) / width + 1;
           std::vector<int> bucket_min(count, INT_MAX);
           std::vector<int> bucket_max(count, INT_MIN);
           std::vector<char> used(count);

           for (int value : nums) {
               int index = (value - minimum) / width;
               used[index] = true;
               bucket_min[index] = std::min(bucket_min[index], value);
               bucket_max[index] = std::max(bucket_max[index], value);
           }

           int answer = 0;
           int previous = minimum;
           for (int i = 0; i < count; ++i) {
               if (!used[i]) continue;
               answer = std::max(answer, bucket_min[i] - previous);
               previous = bucket_max[i];
           }
           return answer;
       }

   public:
       int maximumGap(std::vector<int>& nums) {
           return buckets(nums);
       }
   };

题解
----

桶宽来自哪里
~~~~~~~~~~~~

若 ``n`` 个数落在 ``[min,max]``，全局最大相邻差至少为 ``ceil((max-min)/(n-1))``。用不大于该量的桶宽，可保证最大差不会出现在同一桶内部。

为什么只比较相邻非空桶
~~~~~~~~~~~~~~~~~~~~~~

桶内数值跨度不超过桶宽；真正可能更大的间隔只存在于前一非空桶最大值与后一非空桶最小值之间。

复杂度来源
~~~~~~~~~~

建立并扫描桶都是 ``O(n)``，空间 ``O(n)``。排序基准为 ``O(n log n)``。