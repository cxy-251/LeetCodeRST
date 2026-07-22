0152. Maximum Product Subarray
==============================

题目信息
--------

:题号: 0152
:难度: Medium
:主题: 数组、动态规划、符号状态
:原题: `LeetCode 0152 <https://leetcode.com/problems/maximum-product-subarray/>`_
:教学重点: 同时维护最大积与最小积、负数交换、零重启

题目重述
--------

返回乘积最大的连续非空子数组。

自建示例
--------

.. code-block:: text

   nums = [2,3,-2,4] -> 6
   nums = [-2,0,-1] -> 0

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       int quadratic(const std::vector<int>& nums) {
           int best = nums[0];
           for (int left = 0; left < static_cast<int>(nums.size()); ++left) {
               int product = 1;
               for (int right = left; right < static_cast<int>(nums.size()); ++right) {
                   product *= nums[right];
                   best = std::max(best, product);
               }
           }
           return best;
       }

       int dynamicProgramming(const std::vector<int>& nums) {
           int maximum = nums[0];
           int minimum = nums[0];
           int answer = nums[0];
           for (int i = 1; i < static_cast<int>(nums.size()); ++i) {
               int value = nums[i];
               int old_maximum = maximum;
               int old_minimum = minimum;
               maximum = std::max({value, old_maximum * value, old_minimum * value});
               minimum = std::min({value, old_maximum * value, old_minimum * value});
               answer = std::max(answer, maximum);
           }
           return answer;
       }

   public:
       int maxProduct(std::vector<int>& nums) {
           return dynamicProgramming(nums);
       }
   };

题解
----

为什么只保存最大积不够
~~~~~~~~~~~

负数会把最小负积翻转成最大正积，因此以当前位置结尾的状态必须同时保存最大积和最小积。

当前位置如何重新开始
~~~~~~~~~~

三个候选分别是当前值、旧最大积乘当前值、旧最小积乘当前值。直接选择当前值等价于在零或不利前缀之后重新开始子数组。

复杂度来源
~~~~~

每个元素只更新两个滚动状态，时间 ``O(n)``、额外空间 ``O(1)``。双重枚举需要 ``O(n²)``。
