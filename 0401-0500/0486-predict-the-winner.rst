0486. Predict the Winner
========================

题目信息
--------

:题号: 0486
:难度: Medium
:主题: 两端取数、两人博弈、累计得分、先手不败
:原题: `LeetCode 0486 <https://leetcode.com/problems/predict-the-winner/>`_
:重点: 每回合只能取当前首项或末项、所有元素最终被取完、双方最优、平局也视为玩家 1 获胜

题目重述
--------

给定非负整数数组 ``nums``。玩家 1 和玩家 2 轮流从当前数组的最左端或最右端取走一个数，并把它加入自己的得分；玩家 1 先行动，直到所有数都被取走。

判断双方都采用最优策略时，玩家 1 是否能够使最终得分大于或等于玩家 2。若两人得分相同，也返回 ``true``。``nums.length`` 位于 ``[1, 20]``，每个元素位于 ``[0, 10^7]``。

自建示例
--------

先手选择较大端点后获胜：

.. code-block:: text

   输入：nums = [5,1,2]
   输出：true
   解释：玩家 1 先取 5；无论玩家 2 之后取哪一端，玩家 1 的最终得分都会高于玩家 2。

先手无法避免失败：

.. code-block:: text

   输入：nums = [4,7,2]
   输出：false
   解释：玩家 1 无论先取 4 还是 2，玩家 2 都能取走中间的 7，最终玩家 1 得 6、玩家 2 得 7。

区间博弈保存当前玩家的得分差
------------------------------

定义 ``dp[i]`` 为当前玩家面对区间 ``[i, j]`` 时，相对另一名玩家最多能取得的分数差。若取左端，收益是 ``nums[i] - dp[i+1]``；若取右端，收益是 ``nums[j] - dp[i]``，因为取走后轮到对手，原本的优势要被对手在剩余区间取得的最优差值抵消。

按区间长度从 2 增长，并让 ``dp[i+1]`` 仍保留上一长度的值，就能把二维状态压缩成一维。最终 ``dp[0] >= 0`` 表示先手至少不输，平局也符合题意。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       bool PredictTheWinner(std::vector<int>& nums) {
           int n = static_cast<int>(nums.size());
           std::vector<long long> dp(nums.begin(), nums.end());
           for (int length = 2; length <= n; ++length) {
               for (int left = 0; left + length <= n; ++left) {
                   int right = left + length - 1;
                   long long takeLeft = nums[left] - dp[left + 1];
                   long long takeRight = nums[right] - dp[left];
                   dp[left] = std::max(takeLeft, takeRight);
               }
           }
           return dp[0] >= 0;
       }
   };

代码分析
--------

每个区间只保留当前玩家相对对手的最优差值，取端点后的“轮到对手”由减法体现；一维更新顺序保证两个子区间状态仍未被覆盖。状态数为 ``O(n^2)``，时间复杂度为 ``O(n^2)``，空间复杂度压缩为 ``O(n)``。
