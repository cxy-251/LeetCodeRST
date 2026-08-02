0587. Erect the Fence
=====================

题目信息
--------

:题号: 0587
:难度: Hard
:主题: 平面点集、凸包、边界点、共线点
:原题: `LeetCode 0587 <https://leetcode.com/problems/erect-the-fence/>`_
:重点: 围住全部树、返回最外层边界上的所有点、凸包边上的共线点也必须保留、顺序不限

题目重述
--------

给定平面上若干个互不相同的整数坐标点，每个点表示一棵树。需要用一圈围栏包围所有树，返回位于最小凸包边界上的全部点坐标。

不仅凸包顶点需要返回，落在凸包边线上的共线点也属于围栏边界，必须包含在结果中。严格位于内部的点不返回；结果顺序不限。

自建示例
--------

边线上存在共线点：

.. code-block:: text

   输入：trees = [[0,0],[2,0],[2,2],[0,2],[1,0],[1,1]]
   输出：[[0,0],[1,0],[2,0],[2,2],[0,2]]
   解释：前五个点位于矩形边界，其中 [1,0] 在底边上也必须返回；[1,1] 位于内部。

所有点共线：

.. code-block:: text

   输入：trees = [[0,0],[1,1],[2,2]]
   输出：[[0,0],[1,1],[2,2]]
   解释：所有树都位于围栏边界上，因此全部返回。

保留共线点的单调链凸包
----------------------

按坐标排序后构造下凸壳和上凸壳。加入新点时，只有形成严格右转（叉积小于 0）才弹出中间点；叉积等于 0 的点保留，这正是题目要求的凸包边上共线树木。最后合并两条链并去重，覆盖所有点共线时的重复端点。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       long long cross(const std::vector<int>& origin,
                       const std::vector<int>& first,
                       const std::vector<int>& second) {
           return (static_cast<long long>(first[0]) - origin[0]) *
                      (static_cast<long long>(second[1]) - origin[1]) -
                  (static_cast<long long>(first[1]) - origin[1]) *
                      (static_cast<long long>(second[0]) - origin[0]);
       }

   public:
       std::vector<std::vector<int>> outerTrees(
           std::vector<std::vector<int>>& trees) {
           std::sort(trees.begin(), trees.end());
           std::vector<std::vector<int>> lower, upper;
           for (const auto& point : trees) {
               while (lower.size() >= 2 &&
                      cross(lower[lower.size() - 2], lower.back(), point) < 0) {
                   lower.pop_back();
               }
               lower.push_back(point);
           }
           for (auto it = trees.rbegin(); it != trees.rend(); ++it) {
               while (upper.size() >= 2 &&
                      cross(upper[upper.size() - 2], upper.back(), *it) < 0) {
                   upper.pop_back();
               }
               upper.push_back(*it);
           }

           std::set<std::pair<int, int>> unique;
           for (const auto& point : lower) unique.insert({point[0], point[1]});
           for (const auto& point : upper) unique.insert({point[0], point[1]});
           std::vector<std::vector<int>> result;
           for (const auto& [x, y] : unique) result.push_back({x, y});
           return result;
       }
   };

代码分析
--------

严格右转才弹出，保证边界共线点不被误删；上下链覆盖凸包两侧，集合去重只消除端点和共线遍历造成的重复，不改变返回点集合。排序耗时 ``O(n log n)``，构造与去重为 ``O(n log n)``，额外空间复杂度为 ``O(n)``。
