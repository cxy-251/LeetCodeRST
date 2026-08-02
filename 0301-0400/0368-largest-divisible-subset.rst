0368. Largest Divisible Subset
==============================

题目信息
--------

:题号: 0368
:难度: Medium
:主题: 正整数集合、两两整除、最大子集、答案不唯一
:原题: `LeetCode 0368 <https://leetcode.com/problems/largest-divisible-subset/>`_
:重点: 输入元素互不相同、子集中任意两数都必须可整除、返回元素数量最多的任意一个子集

题目重述
--------

给定一个由互不相同正整数组成的数组 ``nums``，寻找元素数量最多的子集 ``answer``，使其中任意两个不同元素 ``a`` 和 ``b`` 都满足 ``a % b == 0`` 或 ``b % a == 0``。

数组长度位于 ``[1, 1000]``，元素位于 ``[1, 2 * 10^9]``。若存在多个同样大的合法子集，可以返回其中任意一个；返回元素的排列顺序不作要求。题目要求的是从输入元素中选择子集，不能重复使用某个位置。

自建示例
--------

存在唯一更长的整除链：

.. code-block:: text

   输入：nums = [3,5,10,20,21]
   输出：[5,10,20]
   解释：5 整除 10 和 20，10 也整除 20，因此三者两两满足条件；其他元素无法加入后仍保持两两可整除。

多个最大答案均可接受：

.. code-block:: text

   输入：nums = [1,2,3]
   输出：[1,2]
   解释：[1,3] 也是大小为 2 的最大合法子集，题目允许返回任意一个。

排序后，合法子集就是一条整除链
--------------------------------

将数组升序排序。若一个已选子集按升序排列，并且每个新元素都能被当前链的最后一个元素整除，那么链中任意更早元素也能整除新元素，因而“最后一个整除前一个”的条件足以保证任意两数可比较。

令 ``dp[i]`` 表示以排序后第 ``i`` 个数结尾的最长整除链长度。若 ``nums[i] % nums[j] == 0``，就可以把 ``i`` 接在以 ``j`` 结尾的链后；同时记录 ``parent[i]``，最后从最长结尾反向恢复一个合法子集。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::vector<int> largestDivisibleSubset(
           std::vector<int>& nums) {
           std::sort(nums.begin(), nums.end());
           int n = static_cast<int>(nums.size());
           std::vector<int> dp(n, 1);
           std::vector<int> parent(n, -1);
           int bestIndex = 0;

           for (int i = 0; i < n; ++i) {
               for (int j = 0; j < i; ++j) {
                   if (nums[i] % nums[j] == 0
                       && dp[j] + 1 > dp[i]) {
                       dp[i] = dp[j] + 1;
                       parent[i] = j;
                   }
               }
               if (dp[i] > dp[bestIndex]) bestIndex = i;
           }

           std::vector<int> result;
           for (int i = bestIndex; i != -1; i = parent[i]) {
               result.push_back(nums[i]);
           }
           std::reverse(result.begin(), result.end());
           return result;
       }
   };

代码分析
--------

排序把可能的除数放在被除数之前，状态转移只需检查前面的元素；链式整除保证恢复结果中的任意两数都满足题目条件。每个有序下标对检查一次，时间复杂度为 ``O(n^2)``，额外空间为 ``O(n)``；排序会改变输入数组顺序，但题目只要求返回子集。
