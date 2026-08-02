0410. Split Array Largest Sum
=============================

题目信息
--------

:题号: 0410
:难度: Hard
:主题: 连续分段、恰好 ``k`` 段、子数组和、最小化最大值
:原题: `LeetCode 0410 <https://leetcode.com/problems/split-array-largest-sum/>`_
:重点: 每段必须非空且连续、所有元素恰好属于一段、比较各段和的最大值、返回该最大值的最小可能值

题目重述
--------

给定非负整数数组 ``nums`` 和整数 ``k``，将整个数组按原顺序划分成恰好 ``k`` 个非空连续子数组。对一种划分，计算每个子数组的元素和，并取这些和中的最大值；返回所有合法划分中该最大值的最小可能值。

``nums.length`` 位于 ``[1, 1000]``，每个元素位于 ``[0, 10^6]``，``k`` 位于 ``[1, min(50, nums.length)]``。数组元素总和不会超过 32 位有符号整数范围。不能改变元素顺序，也不能遗漏或重复使用元素。

自建示例
--------

最优划分的各段大小不同：

.. code-block:: text

   输入：nums = [4, 1, 7, 3, 2]，k = 3
   输出：7
   解释：划分为 [4,1]、[7]、[3,2] 时各段和为 5、7、5，最大值为 7；任何划分都必须包含元素 7，因此答案不可能小于 7。

每个元素单独成段：

.. code-block:: text

   输入：nums = [2, 9, 1]，k = 3
   输出：9
   解释：恰好分成三段时唯一的分段方式是 [2]、[9]、[1]，最大段和为 9。

二分“允许的最大段和”
----------------------

设候选上限为 ``limit``。从左到右尽量把元素放入当前段；只有加入下一个元素会超过 ``limit`` 时才切一刀。这样得到的是在该上限下所需的最少段数：每次延迟切分都让当前段尽可能长，不会增加段数。

若最少段数大于 ``k``，上限太小；若不大于 ``k``，由于数组元素非负，可以继续把某些非空段拆开，直到恰好得到 ``k`` 段。因此“可行”随 ``limit`` 单调变化，可以在 ``[max(nums), sum(nums)]`` 上二分最小可行值。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int splitArray(std::vector<int>& nums, int k) {
           long long left = 0;
           long long right = 0;
           for (int value : nums) {
               left = std::max(left, static_cast<long long>(value));
               right += value;
           }

           while (left < right) {
               long long limit = left + (right - left) / 2;
               int parts = 1;
               long long current = 0;
               for (int value : nums) {
                   if (current + value > limit) {
                       ++parts;
                       current = value;
                   } else {
                       current += value;
                   }
               }
               if (parts <= k) {
                   right = limit;
               } else {
                   left = limit + 1;
               }
           }
           return static_cast<int>(left);
       }
   };

代码分析
--------

贪心切段只用于判断一个 ``limit`` 是否可行，不直接声称它就是最优分段；非负元素保证段数条件具有单调性，且“至多 k 段”可细分为“恰好 k 段”。二分次数为 ``O(log sum)``，每次扫描数组，时间复杂度为 ``O(n log sum)``，额外空间为 ``O(1)``。
