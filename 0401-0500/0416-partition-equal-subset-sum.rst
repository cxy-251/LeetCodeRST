0416. Partition Equal Subset Sum
================================

题目信息
--------

:题号: 0416
:难度: Medium
:主题: 正整数数组、两个子集、元素全覆盖、等和判断
:原题: `LeetCode 0416 <https://leetcode.com/problems/partition-equal-subset-sum/>`_
:重点: 每个数组位置恰好属于一个子集、两个子集元素和必须相同、相同数值的不同位置分别使用

题目重述
--------

给定只包含正整数的数组 ``nums``，判断能否把全部数组元素划分成两个子集，使两个子集的元素和相等。

``nums.length`` 位于 ``[1, 200]``，每个元素位于 ``[1, 100]``。数组中的每个位置必须恰好分配给一个子集，不能遗漏或重复使用；重复数值位于不同下标时仍是不同的元素实例。函数只返回是否存在这样的划分，不需要返回具体子集。

自建示例
--------

存在等和划分：

.. code-block:: text

   输入：nums = [2, 3, 5]
   输出：true
   解释：可以划分为 [5] 和 [2,3]，两个子集的元素和都为 5。

总和为偶数仍可能无法划分：

.. code-block:: text

   输入：nums = [2, 2, 3, 5]
   输出：false
   解释：总和为 12，但不存在元素和恰好为 6 的子集，因此无法分成两个等和部分。

只寻找一半总和
----------------

若所有元素总和为奇数，直接不可能平分；若为偶数，只需判断是否存在一个子集的和为 ``total / 2``，剩余元素就自动构成另一半。令 ``dp[s]`` 表示处理过的元素中是否能组成和 ``s``，每加入一个数时从目标和向下更新，确保同一个数组位置不会在同一轮被重复使用。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       bool canPartition(std::vector<int>& nums) {
           int total = std::accumulate(nums.begin(), nums.end(), 0);
           if (total % 2 != 0) return false;
           int target = total / 2;
           std::vector<bool> dp(target + 1, false);
           dp[0] = true;

           for (int value : nums) {
               for (int sum = target; sum >= value; --sum) {
                   dp[sum] = dp[sum] || dp[sum - value];
               }
           }
           return dp[target];
       }
   };

代码分析
--------

倒序枚举和，保证当前元素只参与一次；``dp[0]`` 表示尚未选择元素的空子集，正整数约束使状态方向清晰。总和为 ``S`` 时，时间复杂度为 ``O(nS)``，额外空间为 ``O(S)``。
