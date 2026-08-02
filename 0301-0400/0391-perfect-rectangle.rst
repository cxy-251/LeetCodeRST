0391. Perfect Rectangle
=======================

题目信息
--------

:题号: 0391
:难度: Hard
:主题: 轴对齐矩形、精确覆盖、重叠、空洞
:原题: `LeetCode 0391 <https://leetcode.com/problems/perfect-rectangle/>`_
:重点: 所有小矩形面积必须恰好组成一个外接矩形、内部不能重叠或留空、共享边界允许

题目重述
--------

给定若干轴对齐矩形，``rectangles[i] = [xi, yi, ai, bi]`` 表示左下角为 ``(xi, yi)``、右上角为 ``(ai, bi)`` 的矩形，其中 ``xi < ai`` 且 ``yi < bi``。判断这些小矩形的并集是否恰好等于某一个完整的大矩形。

合法覆盖中，小矩形可以共享边或角，但内部面积不能重叠，大矩形内部也不能存在未覆盖空洞；外轮廓必须只有目标大矩形的四条边。矩形数量位于 ``[1, 2 * 10^4]``，所有坐标位于 ``[-10^5, 10^5]``。

自建示例
--------

三个矩形无缝拼接：

.. code-block:: text

   输入：rectangles = [[0,0,1,2],[1,0,3,1],[1,1,3,2]]
   输出：true
   解释：三个区域没有重叠或空洞，恰好覆盖左下角 (0,0)、右上角 (3,2) 的大矩形。

内部发生重叠：

.. code-block:: text

   输入：rectangles = [[0,0,2,2],[1,0,3,2]]
   输出：false
   解释：两个矩形在横坐标 1 到 2 的区域内重叠，不能视为精确覆盖。

面积检查内部，角点奇偶检查边界
--------------------------------

先求所有小矩形的总面积和外接边界 ``[minX,maxX] × [minY,maxY]``。若存在重叠，面积会多算；若存在空洞，面积会少算，因此总面积必须等于外接矩形面积。

面积相等还不足以排除某些内部重叠与空洞组合，所以对每个小矩形的四个角做奇偶切换：内部共享角会出现偶数次而被抵消，最终集合只能留下外接矩形的四个角。两个条件同时满足时，边界拼接没有重叠或空缺。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       bool isRectangleCover(
           std::vector<std::vector<int>>& rectangles) {
           long long area = 0;
           int minX = INT_MAX;
           int minY = INT_MAX;
           int maxX = INT_MIN;
           int maxY = INT_MIN;
           std::set<std::pair<int, int>> corners;

           auto toggle = [&](int x, int y) {
               std::pair<int, int> point = {x, y};
               auto it = corners.find(point);
               if (it == corners.end()) {
                   corners.insert(point);
               } else {
                   corners.erase(it);
               }
           };

           for (const auto& rectangle : rectangles) {
               int x1 = rectangle[0];
               int y1 = rectangle[1];
               int x2 = rectangle[2];
               int y2 = rectangle[3];
               minX = std::min(minX, x1);
               minY = std::min(minY, y1);
               maxX = std::max(maxX, x2);
               maxY = std::max(maxY, y2);
               area += 1LL * (x2 - x1) * (y2 - y1);
               toggle(x1, y1);
               toggle(x1, y2);
               toggle(x2, y1);
               toggle(x2, y2);
           }

           long long boundingArea =
               1LL * (maxX - minX) * (maxY - minY);
           if (area != boundingArea || corners.size() != 4) {
               return false;
           }
           return corners.count({minX, minY})
               && corners.count({minX, maxY})
               && corners.count({maxX, minY})
               && corners.count({maxX, maxY});
       }
   };

代码分析
--------

角点集合只保留出现奇数次的坐标，内部共享角和边界分割点会抵消，四个外轮廓角必须最终存在。面积使用 ``long long``，避免坐标差乘积超出 32 位。每个矩形进行常数次有序集合操作，时间复杂度为 ``O(m log m)``，额外空间为 ``O(m)``。
