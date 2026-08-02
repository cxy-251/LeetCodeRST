0474. Ones and Zeroes
=====================

题目信息
--------

:题号: 0474
:难度: Medium
:主题: 二进制字符串、零预算、一预算、最大子集大小
:原题: `LeetCode 0474 <https://leetcode.com/problems/ones-and-zeroes/>`_
:重点: 每个字符串最多选择一次、总零数不超过 ``m``、总一数不超过 ``n``、返回所选字符串数量

题目重述
--------

给定二进制字符串数组 ``strs`` 以及整数 ``m`` 和 ``n``，从数组中选择一个子集，使所选字符串包含的字符 ``0`` 总数不超过 ``m``，字符 ``1`` 总数不超过 ``n``。返回能够选择的最多字符串数量。

每个数组位置最多使用一次，即使两个字符串文本相同，它们也是不同的可选实例。``strs.length`` 位于 ``[1, 600]``，每个字符串长度位于 ``[1, 100]``，且只包含 0 和 1；``m``、``n`` 位于 ``[0, 100]``。

自建示例
--------

两种字符预算都恰好用完：

.. code-block:: text

   输入：strs = ["10", "0", "1", "11"]，m = 2，n = 2
   输出：3
   解释：选择 "10"、"0"、"1" 共使用两个 0 和两个 1；无法再加入 "11"，因此最大数量为 3。

零预算为零：

.. code-block:: text

   输入：strs = ["1", "11", "0"]，m = 0，n = 3
   输出：2
   解释：可以选择 "1" 和 "11"，但不能选择含有 0 的字符串。

零和一预算的二维 0/1 背包
-------------------------

每个字符串是一件物品，消耗 ``zero`` 个零预算和 ``one`` 个一预算，价值为 1。``dp[i][j]`` 表示最多使用 ``i`` 个零和 ``j`` 个一时能选的最大字符串数。处理一个字符串时，两个预算都必须从大到小更新，才能保证同一字符串在本轮只被选择一次。

字符串内容相同也不能合并，因为它们在数组中是不同物品；逐个处理正好保留了这种下标区别。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int findMaxForm(std::vector<std::string>& strs, int m, int n) {
           std::vector<std::vector<int>> dp(
               m + 1, std::vector<int>(n + 1, 0));
           for (const std::string& word : strs) {
               int zeros = std::count(word.begin(), word.end(), '0');
               int ones = static_cast<int>(word.size()) - zeros;
               for (int availableZeros = m; availableZeros >= zeros;
                    --availableZeros) {
                   for (int availableOnes = n; availableOnes >= ones;
                        --availableOnes) {
                       dp[availableZeros][availableOnes] = std::max(
                           dp[availableZeros][availableOnes],
                           dp[availableZeros - zeros][availableOnes - ones] + 1);
                   }
               }
           }
           return dp[m][n];
       }
   };

代码分析
--------

倒序遍历两个容量维度确保转移读取的是处理当前字符串之前的状态，因此每个字符串最多贡献一次；状态值只记录数量，不需要记录具体子集。设字符串数为 ``q``，时间复杂度为 ``O(qmn)``，空间复杂度为 ``O(mn)``。
