0494. Target Sum
================

题目信息
--------

:题号: 0494
:难度: Medium
:主题: 非负整数、正负号分配、表达式结果、方案计数
:原题: `LeetCode 0494 <https://leetcode.com/problems/target-sum/>`_
:重点: 每个数组元素前必须放 ``+`` 或 ``-``、保持原顺序、不同符号选择分别计数、零的两种符号也不同

题目重述
--------

给定非负整数数组 ``nums`` 和整数 ``target``。必须在每个元素前放置一个 ``+`` 或 ``-``，按原数组顺序组成算术表达式。返回表达式计算结果恰好等于 ``target`` 的不同符号分配方案数量。

``nums.length`` 位于 ``[1, 20]``，每个元素位于 ``[0, 1000]``，全部元素之和不超过 ``1000``，``target`` 位于 ``[-1000, 1000]``。每个位置都必须选择一个符号；即使元素值为 0，``+0`` 和 ``-0`` 也是两种不同方案。

自建示例
--------

两种不同位置的负号选择：

.. code-block:: text

   输入：nums = [1,2,1]，target = 2
   输出：2
   解释：+1+2-1 和 -1+2+1 都等于 2，因此有两种方案。

零产生两个符号方案：

.. code-block:: text

   输入：nums = [0,1]，target = 1
   输出：2
   解释：+0+1 与 -0+1 的数值相同，但第一个位置选择的符号不同，应分别计数。

把正号集合转换成子集和计数
--------------------------

设所有元素总和为 ``S``，被放正号的元素和为 ``P``，被放负号的元素和为 ``M``。则 ``P-M=target``、``P+M=S``，所以必须有 ``P=(S+target)/2``。若 ``|target| > S`` 或 ``S+target`` 为奇数，答案直接为 0。

随后变成 0/1 背包：``dp[j]`` 表示处理过的元素中和为 ``j`` 的符号分配数。每个元素只处理一次，容量从目标和向下更新；值为 0 时 ``dp[j]`` 会自我相加，正好保留 ``+0`` 与 ``-0`` 的两种不同选择。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int findTargetSumWays(std::vector<int>& nums, int target) {
           int total = std::accumulate(nums.begin(), nums.end(), 0);
           if (std::abs(target) > total || (total + target) % 2 != 0) {
               return 0;
           }
           int positiveSum = (total + target) / 2;
           std::vector<int> dp(positiveSum + 1, 0);
           dp[0] = 1;
           for (int value : nums) {
               for (int sum = positiveSum; sum >= value; --sum) {
                   dp[sum] += dp[sum - value];
               }
           }
           return dp[positiveSum];
       }
   };

代码分析
--------

正号子集一旦确定，负号集合也随之确定，子集和计数与符号方案一一对应；倒序更新避免同一元素被重复放入，零值在 ``sum`` 不变时仍会使方案数翻倍。时间复杂度为 ``O(nS)``，空间复杂度为 ``O(S)``。
