0312. Burst Balloons
====================

题目信息
--------

:题号: 0312
:难度: Hard
:主题: 数组、动态相邻关系、操作顺序、最大收益
:原题: `LeetCode 0312 <https://leetcode.com/problems/burst-balloons/>`_
:重点: 戳破后相邻关系立即改变、越界邻居按 1 计算、必须戳破全部气球

题目重述
--------

给定整数数组 ``nums``，每个元素表示一只气球上的数字。每次选择一只尚未戳破的气球 ``i``，获得当前左邻气球数值、``nums[i]`` 和当前右邻气球数值三者的乘积，然后该气球从序列中移除，剩余气球重新相邻。

若某一侧已经没有气球，该侧邻居数值按 ``1`` 计算。必须最终戳破全部气球，返回通过选择操作顺序能够获得的最大硬币总数。``nums`` 的长度位于 ``[1, 300]``，每个元素位于 ``[0, 100]``；原数组中的相邻下标关系会随着气球被移除而改变。

自建示例
--------

两个气球的操作顺序不同：

.. code-block:: text

   输入：nums = [2, 4]
   输出：12
   解释：先戳 2 得到 1*2*4=8，再戳 4 得到 1*4*1=4，总计 12；反向操作只能得到 10。

包含零值气球：

.. code-block:: text

   输入：nums = [0, 5]
   输出：5
   解释：先戳破 0 不得硬币，再戳 5 得到 5；若先戳 5，它的左邻值为 0，本次收益也为 0。

把“最后戳破”作为区间决策
--------------------------

直接按戳破顺序搜索会遇到动态相邻关系：当前一个气球的邻居取决于之前删掉了谁。反过来观察一个开区间 ``(left, right)``，如果最后戳破其中的 ``k``，那么在这一步发生时，``left`` 和 ``right`` 一定是它的左右邻居；而 ``k`` 左侧和右侧的气球已经分别独立完成。于是最后一步把两个子区间的最优值和一次收益连接起来。

在数组两端补上数值为 1 的虚拟气球。令 ``dp[left][right]`` 表示只戳破下标严格位于 ``left`` 与 ``right`` 之间的气球所能得到的最大硬币数。枚举区间内的每一个 ``k`` 作为最后一个气球，转移为
``dp[left][k] + dp[k][right] + a[left] * a[k] * a[right]``。按区间长度从短到长计算，两个子区间在转移前已经完成。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int maxCoins(std::vector<int>& nums) {
           int n = static_cast<int>(nums.size());
           std::vector<int> values(n + 2, 1);
           for (int i = 0; i < n; ++i) values[i + 1] = nums[i];

           std::vector<std::vector<long long>> dp(
               n + 2, std::vector<long long>(n + 2, 0));
           for (int length = 2; length <= n + 1; ++length) {
               for (int left = 0; left + length <= n + 1; ++left) {
                   int right = left + length;
                   for (int last = left + 1; last < right; ++last) {
                       dp[left][right] = std::max(
                           dp[left][right],
                           dp[left][last] + dp[last][right]
                               + 1LL * values[left] * values[last]
                               * values[right]);
                   }
               }
           }
           return static_cast<int>(dp[0][n + 1]);
       }
   };

代码分析
--------

``dp[left][right]`` 的边界气球不会被戳破，只负责提供最后一步的邻居值，因此补 1 后不需要另写首尾情况。枚举“最后一个”消除了中间相邻关系变化带来的依赖；所有合法顺序都有唯一的最后一个气球，故不会漏解。状态数为 ``O(n^2)``，每个状态枚举 ``O(n)`` 个最后位置，时间复杂度为 ``O(n^3)``，空间复杂度为 ``O(n^2)``。
