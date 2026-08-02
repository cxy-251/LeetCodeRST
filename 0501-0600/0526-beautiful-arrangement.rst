0526. Beautiful Arrangement
===========================

题目信息
--------

:题号: 0526
:难度: Medium
:主题: 排列、一基位置、整除条件、方案计数
:原题: `LeetCode 0526 <https://leetcode.com/problems/beautiful-arrangement/>`_
:重点: 使用 1..n 的每个整数恰好一次、位置从 1 开始、每个位置满足双向整除条件、返回排列数量

题目重述
--------

给定正整数 ``n``，考虑由整数 ``1`` 到 ``n`` 组成的所有排列。若对排列中的每个一基位置 ``i``，都有 ``perm[i]`` 能被 ``i`` 整除，或者 ``i`` 能被 ``perm[i]`` 整除，则该排列称为美丽排列。

返回美丽排列的总数量。每个整数必须恰好使用一次，位置编号从 ``1`` 而不是 ``0`` 开始；同一组数字的不同排列按不同方案计数。

自建示例
--------

三个数字的排列：

.. code-block:: text

   输入：n = 3
   输出：3
   解释：合法排列为 [1,2,3]、[2,1,3] 和 [3,2,1]；其他排列至少有一个位置不满足整除条件。

只有一个数字：

.. code-block:: text

   输入：n = 1
   输出：1
   解释：唯一排列 [1] 在位置 1 满足整除条件。

按位置回溯并用位掩码去重
------------------------

从位置 1 开始逐位放置未使用数字。数字 ``value`` 能放在当前位置 ``position`` 的条件是二者至少一个能整除另一个；掩码的第 ``value-1`` 位记录它是否已被使用。由于后续结果只取决于已用集合，当前位置可以由集合中位数推出，适合记忆化。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       int n;
       std::vector<int> memo;

       int count(int used) {
           int& cached = memo[used];
           if (cached != -1) return cached;
           int position = __builtin_popcount(static_cast<unsigned>(used)) + 1;
           if (position > n) return cached = 1;

           cached = 0;
           for (int value = 1; value <= n; ++value) {
               int bit = 1 << (value - 1);
               if ((used & bit) != 0) continue;
               if (value % position != 0 && position % value != 0) continue;
               cached += count(used | bit);
           }
           return cached;
       }

   public:
       int countArrangement(int nValue) {
           n = nValue;
           memo.assign(1 << n, -1);
           return count(0);
       }
   };

代码分析
--------

每条递归路径恰好使用一个新数字，位置由已用数字数量决定；整除判断保留且只保留合法排列。相同已用集合的后续选择完全相同，记忆化避免重复计算。状态数为 ``2^n``，每个状态尝试 ``n`` 个值，时间复杂度为 ``O(n2^n)``，空间复杂度为 ``O(2^n)``。
