0593. Valid Square
==================

题目信息
--------

:题号: 0593
:难度: Medium
:主题: 平面几何、四个点、边长、对角线
:原题: `LeetCode 0593 <https://leetcode.com/problems/valid-square/>`_
:重点: 四点顺序任意、正方形必须有四条相等非零边和两条相等对角线、重复点不能成正方形

题目重述
--------

给定平面上的四个整数坐标点 ``p1``、``p2``、``p3``、``p4``，判断它们能否作为某个正方形的四个顶点。

输入点的排列顺序没有几何含义。合法正方形必须具有正面积：四条边长度相等且非零，两条对角线长度相等，并且对角线长于边；若存在重复点、退化图形或仅构成长方形、菱形等其他形状，返回 ``false``。

自建示例
--------

轴对齐正方形：

.. code-block:: text

   输入：p1 = [0,0]，p2 = [2,0]，p3 = [2,2]，p4 = [0,2]
   输出：true
   解释：四条边长度均为 2，两条对角线长度也相等，四点构成正方形。

长方形不是正方形：

.. code-block:: text

   输入：p1 = [0,0]，p2 = [3,0]，p3 = [3,2]，p4 = [0,2]
   输出：false
   解释：相邻边长度分别为 3 和 2，并不全部相等。

六个点对距离判定边和对角线
----------------------------

四个顶点的排列顺序未知，不能直接假定输入顺序对应相邻点。计算六个点对的平方距离并排序：正方形应有四个相等且非零的边长平方，另外两个相等的对角线平方，并且对角线平方恰好是边长平方的两倍。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       long long distanceSquared(const std::vector<int>& a,
                                 const std::vector<int>& b) {
           long long dx = static_cast<long long>(a[0]) - b[0];
           long long dy = static_cast<long long>(a[1]) - b[1];
           return dx * dx + dy * dy;
       }

   public:
       bool validSquare(std::vector<int>& p1, std::vector<int>& p2,
                        std::vector<int>& p3, std::vector<int>& p4) {
           std::vector<std::vector<int>> points = {p1, p2, p3, p4};
           std::vector<long long> distances;
           for (int i = 0; i < 4; ++i) {
               for (int j = i + 1; j < 4; ++j) {
                   distances.push_back(
                       distanceSquared(points[i], points[j]));
               }
           }
           std::sort(distances.begin(), distances.end());
           return distances[0] > 0 &&
                  distances[0] == distances[3] &&
                  distances[4] == distances[5] &&
                  distances[4] == 2 * distances[0];
       }
   };

代码分析
--------

重复点会产生零距离并被第一项条件排除；排序后的前四项相等保证四条边一致，后两项相等且为两倍则保证它们是同一组正方形对角线。平方距离避免浮点误差，六个点对的计算次数固定，时间和额外空间复杂度均为 ``O(1)``。
