0473. Matchsticks to Square
===========================

题目信息
--------

:题号: 0473
:难度: Medium
:主题: 火柴长度、四条等边、全部使用、不可折断
:原题: `LeetCode 0473 <https://leetcode.com/problems/matchsticks-to-square/>`_
:重点: 每根火柴恰好使用一次、不能折断、每条边可由多根组成、四条边总长度相等

题目重述
--------

给定整数数组 ``matchsticks``，每个元素表示一根火柴的长度。判断能否使用全部火柴拼成一个正方形。

每根火柴必须恰好属于正方形的一条边，不能折断，也不能剩余。每条边可以由一根或多根火柴组成，四条边的总长度必须相等且大于 0。``matchsticks.length`` 位于 ``[1, 15]``，每根长度位于 ``[1, 10^8]``。

自建示例
--------

长火柴和短火柴共同组成四边：

.. code-block:: text

   输入：matchsticks = [3,3,3,3,6,6]
   输出：true
   解释：总长度为 24，每条边应为 6；两根长度 6 的火柴各成一边，四根长度 3 的火柴两两组成另外两边。

总长度不能被四整除：

.. code-block:: text

   输入：matchsticks = [1,1,1,3]
   输出：false
   解释：总长度为 6，无法分成四条相等的整数长度边。

降序回溯填充四条边
------------------

正方形每条边的目标长度是总长度除以 4；若总长度不能整除或最长火柴超过目标，立即无解。将火柴按长度降序处理，尝试把当前火柴放入四条尚未超长的边中；一旦四边都达到目标，就说明所有火柴恰好被使用。

同一层回溯中，若两条边当前长度相同，把火柴放入其中任意一条的后续状态等价，可以跳过重复尝试。若一根火柴放入空边后失败，其他空边也完全对称，同样可以结束该层尝试。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       std::vector<int> sticks;
       std::array<int, 4> sides{};
       int target = 0;

       bool search(int index) {
           if (index == static_cast<int>(sticks.size())) return true;
           int length = sticks[index];
           for (int side = 0; side < 4; ++side) {
               if (sides[side] + length > target) continue;
               if (side > 0 && sides[side] == sides[side - 1]) continue;

               sides[side] += length;
               if (search(index + 1)) return true;
               sides[side] -= length;

               if (sides[side] == 0) break;
           }
           return false;
       }

   public:
       bool makesquare(std::vector<int>& matchsticks) {
           long long total = std::accumulate(matchsticks.begin(),
                                             matchsticks.end(), 0LL);
           if (total % 4 != 0) return false;
           target = static_cast<int>(total / 4);

           sticks = matchsticks;
           std::sort(sticks.rbegin(), sticks.rend());
           if (sticks.front() > target) return false;
           sides.fill(0);
           return search(0);
       }
   };

代码分析
--------

降序先放长火柴，能尽早暴露超出边长的分支；四条边的和始终等于已放火柴总长，递归结束时四边都不超目标就必然都等于目标。对称剪枝只删除等价状态，不会删除不同的边长分配。最坏时间复杂度为 ``O(4^n)``，额外空间复杂度为 ``O(n)``。
