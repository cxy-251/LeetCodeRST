0164. Maximum Gap
=================

题目信息
--------

:题号: 0164
:难度: Medium
:主题: 数组、桶排序、鸽巢原理
:原题: `LeetCode 0164 <https://leetcode.com/problems/maximum-gap/>`_
:重点: 桶宽下界、桶内无需排序、相邻非空桶差

题目重述
--------

给定整数数组 ``nums``，将其按升序排列后，返回相邻元素之间的最大差值。若数组少于两个元素，返回 0。要求算法具有线性时间和线性额外空间复杂度。

自建示例
--------

.. code-block:: text

   nums = [3,6,9,1]
   排序后为 [1,3,6,9]，相邻差值为 2、3、3，输出 3。

   nums = [10]
   少于两个元素，输出 0。

   nums = [1,1,1,8]
   排序后最大相邻差为 8 - 1 = 7。

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
