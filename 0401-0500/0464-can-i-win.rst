0464. Can I Win
===============

题目信息
--------

:题号: 0464
:难度: Medium
:主题: 两人博弈、不重复整数、累计总和、先手必胜
:原题: `LeetCode 0464 <https://leetcode.com/problems/can-i-win/>`_
:重点: 每个整数最多选择一次、谁先使累计和达到或超过目标谁获胜、双方采用最优策略

题目重述
--------

两名玩家轮流从整数集合 ``1..maxChoosableInteger`` 中选择一个尚未使用的整数，并把它加入共享累计总和。第一个使累计总和达到或超过 ``desiredTotal`` 的玩家立即获胜，先手玩家先行动。

判断双方都采用最优策略时，先手玩家是否能够保证获胜。``maxChoosableInteger`` 位于 ``[1, 20]``，``desiredTotal`` 位于 ``[0, 300]``。每个整数整局只能使用一次；若所有可选整数之和仍小于目标，则任何玩家都无法达到目标，先手不能保证获胜。

自建示例
--------

先手存在必胜开局：

.. code-block:: text

   输入：maxChoosableInteger = 4，desiredTotal = 6
   输出：true
   解释：先手选择 1。无论对手随后选择 2、3 或 4，先手都能选择一个尚未使用的数，使累计和达到或超过 6。

所有整数总和不足：

.. code-block:: text

   输入：maxChoosableInteger = 3，desiredTotal = 7
   输出：false
   解释：1 + 2 + 3 = 6，小于目标 7，整局不可能有人达到目标。

位掩码记录已使用整数
--------------------

因为最大可选整数不超过 20，可以用一个整数的第 ``i`` 位表示数字 ``i + 1`` 是否已经被使用。一个掩码代表一个确定的局面；轮到当前玩家时，若选择某个数能立即达到目标就获胜，否则把该数标记后交给对手，只要存在一个让对手无法获胜的选择，当前局面就是必胜。

先判断所有数字总和是否足够达到目标；若不足，任何策略都不可能获胜。递归参数中的当前和随掩码唯一确定，但显式传入可使转移含义清楚。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       int maximum;
       int target;
       std::vector<int> memo;

       bool win(int used, int current) {
           int& cached = memo[used];
           if (cached != -1) return cached;

           for (int i = 0; i < maximum; ++i) {
               if (used & (1 << i)) continue;
               int value = i + 1;
               if (current + value >= target ||
                   !win(used | (1 << i), current + value)) {
                   return cached = 1;
               }
           }
           return cached = 0;
       }

   public:
       bool canIWin(int maxChoosableInteger, int desiredTotal) {
           if (desiredTotal <= 0) return true;
           long long sum = static_cast<long long>(maxChoosableInteger) *
                           (maxChoosableInteger + 1) / 2;
           if (sum < desiredTotal) return false;

           maximum = maxChoosableInteger;
           target = desiredTotal;
           memo.assign(1 << maximum, -1);
           return win(0, 0);
       }
   };

代码分析
--------

``memo[used]`` 缓存的是“从该使用集合出发、轮到当前玩家时能否获胜”，如果存在立即获胜或能把对手送入必败局面的选择就返回真；所有选择都失败时才返回假。状态数为 ``2^m``，每个状态尝试 ``m`` 个数字，时间复杂度为 ``O(m 2^m)``，空间复杂度为 ``O(2^m)``。
