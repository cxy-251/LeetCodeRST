0514. Freedom Trail
===================

题目信息
--------

:题号: 0514
:难度: Hard
:主题: 环形拨盘、顺逆时针旋转、逐字符拼写、最少操作
:原题: `LeetCode 0514 <https://leetcode.com/problems/freedom-trail/>`_
:重点: 拨盘首字符初始位于正上方、每次旋转一格算一步、按键确认也算一步、同一字符可能有多个位置

题目重述
--------

一个环形拨盘由字符串 ``ring`` 表示，字符按圆周顺序排列，开始时 ``ring[0]`` 位于正上方。需要依次拼写字符串 ``key`` 中的每个字符。

每一步可以将拨盘顺时针或逆时针旋转一个位置；当目标字符位于正上方时，还必须按下中心按钮一次来确认该字符。返回拼完整个 ``key`` 所需的最少总步数，旋转和按键都计入。题目保证 ``key`` 中的每个字符都存在于 ``ring`` 中。

自建示例
--------

同一字符有多个可选位置：

.. code-block:: text

   输入：ring = "abca"，key = "ca"
   输出：5
   解释：从位置 0 的 a 旋转两格到 c 并按键，共 3 步；随后旋转一格到位置 3 的 a 并按键，共 2 步，总计 5 步。

无需旋转即可连续确认：

.. code-block:: text

   输入：ring = "xyz"，key = "xx"
   输出：2
   解释：x 初始就在正上方，两次字符确认各按键一次，不需要旋转。

状态是“当前指针位置 + 已拼写前缀”
----------------------------------

同一个字符可能在拨盘上出现多次，不能只记录字符本身；完成某个前缀后，指针停在哪个位置会影响下一个字符的旋转距离。令 ``dp[i]`` 表示处理完当前前缀且指针位于 ``ring[i]`` 的最少步数，只在目标字符出现的位置之间转移。

从位置 ``i`` 到 ``j`` 的最短旋转距离为 ``min(|i-j|, r-|i-j|)``，每次转移再加一次确认按钮。初始状态是位置 0，答案取最后一个字符所有候选位置的最小值。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int findRotateSteps(std::string ring, std::string key) {
           int size = static_cast<int>(ring.size());
           std::vector<std::vector<int>> positions(26);
           for (int i = 0; i < size; ++i) {
               positions[ring[i] - 'a'].push_back(i);
           }

           const int infinity = 1e9;
           std::vector<int> dp(size, infinity);
           dp[0] = 0;
           for (char target : key) {
               std::vector<int> next(size, infinity);
               for (int from = 0; from < size; ++from) {
                   if (dp[from] == infinity) continue;
                   for (int to : positions[target - 'a']) {
                       int distance = std::abs(from - to);
                       distance = std::min(distance, size - distance);
                       next[to] = std::min(next[to],
                                           dp[from] + distance + 1);
                   }
               }
               dp.swap(next);
           }
           return *std::min_element(dp.begin(), dp.end());
       }
   };

代码分析
--------

每个状态都保留了下一步所需的完整位置信息，转移枚举所有同字符位置，因此不会错过更近或更远但能改善后续的选择。设拨盘长度为 ``r``、目标长度为 ``m``，时间复杂度为 ``O(mr^2)`` 的上界，空间复杂度为 ``O(r)``。
