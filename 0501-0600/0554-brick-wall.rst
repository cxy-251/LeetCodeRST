0554. Brick Wall
================

题目信息
--------

:题号: 0554
:难度: Medium
:主题: 砖墙、内部缝隙、垂直线、最少穿砖数
:原题: `LeetCode 0554 <https://leetcode.com/problems/brick-wall/>`_
:重点: 每行总宽度相同、垂线不能沿墙左右外边界、经过砖缝不算穿砖、返回最少穿过的砖数

题目重述
--------

一堵墙由若干行砖组成，``wall[i]`` 依次给出第 ``i`` 行每块砖的宽度，所有砖高度相同，并且每行总宽度相同。要从墙顶到墙底画一条竖直线，统计它穿过的砖块数量。

线经过同一行中两块砖之间的缝隙时，不算穿过砖；但不能把线画在整堵墙的最左或最右外边界上。返回能够达到的最少穿砖数量。

自建示例
--------

所有行存在共同内部缝隙：

.. code-block:: text

   输入：wall = [[2,1,2],[1,2,2],[3,2]]
   输出：0
   解释：三行在距左边界 3 的位置都有砖缝，垂线可以完全沿缝穿过。

没有任何内部缝隙：

.. code-block:: text

   输入：wall = [[5],[5]]
   输出：2
   解释：每行只有一块砖，任意合法的内部垂线都会穿过两块砖。

统计各行共同出现的内部缝隙
--------------------------

对每一行累加砖宽得到内部缝隙的位置，忽略该行最后一块砖的总宽度，因为墙的最右外边界不能选。若某个位置在 ``seam`` 行出现，垂线就能在这些行不穿砖；因此穿砖数为总行数减去最多缝隙频次。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int leastBricks(std::vector<std::vector<int>>& wall) {
           std::unordered_map<int, int> frequency;
           for (const auto& row : wall) {
               int position = 0;
               for (int i = 0; i + 1 < static_cast<int>(row.size()); ++i) {
                   position += row[i];
                   ++frequency[position];
               }
           }

           int best = 0;
           for (const auto& [position, count] : frequency) {
               best = std::max(best, count);
           }
           return static_cast<int>(wall.size()) - best;
       }
   };

代码分析
--------

固定一条合法垂线后，它不穿砖的行恰好是该位置的内部缝隙行；选择频次最高的位置即可最大化免穿砖行数。每块砖的内部边界只统计一次，时间复杂度为 ``O(砖块总数)``，额外空间复杂度为 ``O(缝隙数量)``。
