0475. Heaters
=============

题目信息
--------

:题号: 0475
:难度: Medium
:主题: 一维位置、统一半径、房屋覆盖、最小可行半径
:原题: `LeetCode 0475 <https://leetcode.com/problems/heaters/>`_
:重点: 每个加热器左右覆盖相同半径、所有加热器共用同一个半径、每座房屋至少被一个加热器覆盖

题目重述
--------

一条水平线上有若干房屋和加热器，它们的位置分别由整数数组 ``houses`` 和 ``heaters`` 给出。为所有加热器设置同一个非负覆盖半径 ``r``；位置为 ``h`` 的加热器能够覆盖闭区间 ``[h-r, h+r]``。

返回能够覆盖全部房屋的最小半径。房屋或加热器位置可以按任意顺序给出。两个数组长度均位于 ``[1, 3 * 10^4]``，位置位于 ``[1, 10^9]``。每座房屋只需落在至少一个加热器的覆盖范围内。

自建示例
--------

中间房屋决定最小半径：

.. code-block:: text

   输入：houses = [1,5,9]，heaters = [2,8]
   输出：3
   解释：房屋 1 和 9 距最近加热器均为 1，房屋 5 距两个加热器都为 3，因此统一半径至少为 3。

房屋与加热器位置相同：

.. code-block:: text

   输入：houses = [4]，heaters = [4]
   输出：0
   解释：房屋正好位于加热器位置，不需要向外扩展覆盖范围。

每座房屋取最近加热器的距离
--------------------------

固定半径 ``r`` 时，一座房屋能否被覆盖只取决于它到最近加热器的距离。因此对每座房屋寻找左右两侧最近的加热器，取两者距离的较小值；所有房屋所需距离的最大值，就是统一半径的最小可行值。

排序加热器后用 ``lower_bound`` 定位第一个不小于房屋位置的加热器，同时检查它和前一个位置。边界只有一侧候选时，将另一侧视为无穷远。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int findRadius(std::vector<int>& houses,
                      std::vector<int>& heaters) {
           std::sort(heaters.begin(), heaters.end());
           long long answer = 0;
           for (int house : houses) {
               auto rightIt = std::lower_bound(heaters.begin(), heaters.end(),
                                               house);
               long long right = rightIt == heaters.end()
                                     ? LLONG_MAX
                                     : static_cast<long long>(*rightIt) - house;
               long long left = rightIt == heaters.begin()
                                    ? LLONG_MAX
                                    : house - static_cast<long long>(*std::prev(rightIt));
               answer = std::max(answer, std::min(left, right));
           }
           return static_cast<int>(answer);
       }
   };

代码分析
--------

最近加热器必然是排序位置中房屋左右相邻的两个候选之一，检查这两个位置即可得到该房屋的最小覆盖半径；再取所有房屋的最大需求保证全部覆盖。排序耗时 ``O(h log h)``，每座房屋二分耗时 ``O(log h)``，总时间复杂度为 ``O(h log h + r log h)``，额外空间复杂度为 ``O(1)``。
