0488. Zuma Game
===============

题目信息
--------

:题号: 0488
:难度: Hard
:主题: 彩球序列、手中球、插入操作、连续消除
:原题: `LeetCode 0488 <https://leetcode.com/problems/zuma-game/>`_
:重点: 每次插入一颗手中球、三个及以上同色连续球立即消除、消除可连锁、返回清空棋盘的最少插入数

题目重述
--------

给定棋盘彩球字符串 ``board`` 和手中彩球字符串 ``hand``，颜色只可能是 ``R``、``Y``、``B``、``G``、``W``。一次操作从手中选择一颗尚未使用的球，插入棋盘任意位置。

每次插入后，棋盘中任意长度至少为 3 的连续同色球组会立即消除；消除后两侧连接可能形成新的同色组，需要继续连锁消除，直到不存在可消除组。返回清空整个棋盘所需的最少插入次数；若使用手中球仍无法清空，返回 ``-1``。

``board.length`` 位于 ``[1, 16]``，``hand.length`` 位于 ``[1, 5]``。初始棋盘中不存在长度至少为 3 的连续同色组。每颗手中球最多使用一次。

自建示例
--------

插入一颗球立即清空：

.. code-block:: text

   输入：board = "RR"，hand = "R"
   输出：1
   解释：把手中的 R 插在两个 R 旁边形成 RRR，三个球立即全部消除，棋盘清空。

手中颜色无法形成消除：

.. code-block:: text

   输入：board = "R"，hand = "G"
   输出：-1
   解释：插入唯一的 G 后仍没有三个连续同色球，且手中已无其他球，无法清空棋盘。

规范化消除后的棋盘并记忆化搜索
------------------------------

一次插入后，先把所有长度至少为 3 的连续同色段消除；删除后新连接的两段可能再次达到 3 个，因此 ``shrink`` 需要递归处理，直到棋盘稳定。搜索状态由稳定后的棋盘和手中五种颜色的剩余数量共同决定。

在每个状态中尝试把一种仍有库存的颜色插入每个位置，消除并递归求剩余最少步数。相同的“棋盘 + 手中库存”只需计算一次；手中最多 5 颗球，因此用 6 表示无解即可与合法答案区分。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       const std::string colors = "RYBGW";
       std::unordered_map<std::string, int> memo;

       std::string shrink(const std::string& board) {
           for (int begin = 0;
                begin < static_cast<int>(board.size());) {
               int end = begin + 1;
               while (end < static_cast<int>(board.size()) &&
                      board[end] == board[begin]) {
                   ++end;
               }
               if (end - begin >= 3) {
                   return shrink(board.substr(0, begin) +
                                 board.substr(end));
               }
               begin = end;
           }
           return board;
       }

       std::string makeKey(const std::string& board,
                           const std::array<int, 5>& hand) {
           std::string key = board + '|';
           for (int count : hand) key.push_back(static_cast<char>('0' + count));
           return key;
       }

       int search(const std::string& rawBoard,
                  std::array<int, 5>& hand) {
           std::string board = shrink(rawBoard);
           if (board.empty()) return 0;
           std::string key = makeKey(board, hand);
           auto it = memo.find(key);
           if (it != memo.end()) return it->second;

           int best = 6;
           for (int position = 0;
                position <= static_cast<int>(board.size()); ++position) {
               for (int color = 0; color < 5; ++color) {
                   if (hand[color] == 0) continue;
                   --hand[color];
                   std::string next = board.substr(0, position) +
                                      colors[color] + board.substr(position);
                   best = std::min(best, 1 + search(next, hand));
                   ++hand[color];
               }
           }
           memo[key] = best;
           return best;
       }

   public:
       int findMinStep(std::string board, std::string handString) {
           std::array<int, 5> hand{};
           for (char character : handString) {
               ++hand[colors.find(character)];
           }
           memo.clear();
           int answer = search(board, hand);
           return answer >= 6 ? -1 : answer;
       }
   };

代码分析
--------

``shrink`` 每次消除后重新从头检查，保证连锁反应完整；记忆化键包含库存数量，所以相同棋盘但可用颜色不同的状态不会错误合并。回溯最多使用 5 颗手中球，最坏状态数呈指数增长，单个状态还需尝试插入位置和颜色；额外空间主要为状态缓存和递归栈。
