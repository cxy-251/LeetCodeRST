0149. Max Points on a Line
==========================

题目信息
--------

:题号: 0149. 直线上最多的点数
:难度: Hard
:主题: 几何、斜率规范化、最大公约数、哈希计数
:原题: `LeetCode 0149 <https://leetcode.com/problems/max-points-on-a-line/>`_
:重点: 固定锚点把直线比较降为方向分组，用约分后的整数对精确表示同一无向斜率

题目重述
--------

给定二维平面上一组互不重复的整数点 ``points``，返回能同时位于同一条直线上的最大点数。直线可以水平、
竖直或具有任意有理斜率；只统计输入点。

自建示例
--------

* ``[[-2,-1], [0,0], [2,1], [4,2], [0,3]]``：前四点都满足 ``y = x / 2``，返回 ``4``；
* ``[[3,-2], [3,1], [3,5], [-1,5], [6,5]]``：竖线 ``x=3`` 与水平线 ``y=5`` 都含三个点，
  返回 ``3``；
* ``[[0,0], [-2,-1], [2,1]]``：从锚点看两个方向相反，但属于同一条直线，必须放入同一方向桶。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <cstdint>
   #include <numeric>
   #include <unordered_map>
   #include <utility>
   #include <vector>

   struct DirectionHash {
       std::size_t operator()(
           const std::pair<int, int>& direction
       ) const noexcept {
           const std::uint64_t first = static_cast<std::uint32_t>(
               direction.first
           );
           const std::uint64_t second = static_cast<std::uint32_t>(
               direction.second
           );
           return static_cast<std::size_t>((first << 32) ^ second);
       }
   };

   class Solution {
   private:
       int verifyEveryLine(
           const std::vector<std::vector<int>>& points
       ) {
           const int pointCount = static_cast<int>(points.size());
           if (pointCount <= 2) {
               return pointCount;
           }
           int best = 2;

           for (int first = 0; first < pointCount; ++first) {
               for (int second = first + 1;
                    second < pointCount;
                    ++second) {
                   const long long deltaX =
                       points[second][0] - points[first][0];
                   const long long deltaY =
                       points[second][1] - points[first][1];
                   int onLine = 0;

                   for (int candidate = 0;
                        candidate < pointCount;
                        ++candidate) {
                       const long long candidateX =
                           points[candidate][0] - points[first][0];
                       const long long candidateY =
                           points[candidate][1] - points[first][1];
                       if (deltaX * candidateY == deltaY * candidateX) {
                           ++onLine;
                       }
                   }
                   best = std::max(best, onLine);
               }
           }
           return best;
       }

       std::pair<int, int> normalizedDirection(int deltaX, int deltaY) {
           if (deltaX == 0) {
               return {1, 0};
           }
           if (deltaY == 0) {
               return {0, 1};
           }

           const int divisor = std::gcd(deltaX, deltaY);
           deltaX /= divisor;
           deltaY /= divisor;
           if (deltaX < 0) {
               deltaX = -deltaX;
               deltaY = -deltaY;
           }
           return {deltaY, deltaX};
       }

       int countDirectionsFromEveryAnchor(
           const std::vector<std::vector<int>>& points
       ) {
           const int pointCount = static_cast<int>(points.size());
           int best = pointCount == 0 ? 0 : 1;

           for (int anchor = 0; anchor < pointCount; ++anchor) {
               std::unordered_map<
                   std::pair<int, int>,
                   int,
                   DirectionHash
               > frequency;
               int largestBucket = 0;

               for (int other = 0; other < pointCount; ++other) {
                   if (other == anchor) {
                       continue;
                   }
                   const int deltaX =
                       points[other][0] - points[anchor][0];
                   const int deltaY =
                       points[other][1] - points[anchor][1];
                   const auto direction = normalizedDirection(deltaX, deltaY);
                   largestBucket = std::max(
                       largestBucket,
                       ++frequency[direction]
                   );
               }
               best = std::max(best, largestBucket + 1);
           }
           return best;
       }

   public:
       int maxPoints(std::vector<std::vector<int>>& points) {
           return countDirectionsFromEveryAnchor(points);
       }
   };

题解
----

原始搜索：两点定线，再验证所有点
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

任意两个不同点唯一确定一条直线。最直接的 ``verifyEveryLine`` 枚举点对 ``A``、``B``，再检查每个候选
``P`` 是否满足叉积等式：

.. code-block:: text

   (Bx - Ax) * (Py - Ay) == (By - Ay) * (Px - Ax)

等式不需要除法，水平线和竖直线都适用；代码用 ``long long`` 计算乘积，避免坐标差相乘溢出。这种方法
正确，但同一条含 ``k`` 个点的直线会被它的许多点对反复定义，每次又扫描全部 ``n`` 个点，时间
``O(n^3)``。

固定锚点后，直线只剩方向
~~~~~~~~~~~~~~~~~~~~~~~~~~

固定输入点 ``A``。所有经过 ``A`` 的直线可按方向分组：若 ``B-A`` 与 ``C-A`` 是同一无向方向，那么
``A``、``B``、``C`` 共线；方向不同则对应不同的过 ``A`` 直线。于是一次扫描其他点并统计最大方向桶，就
得到“经过当前锚点的最多点数”；桶计的是其他点，最后还要加锚点自身。

遍历每个锚点即可覆盖全局最优直线。任取最优线上的一个输入点作锚点，其余同线点都会落在同一个方向桶，
所以不会漏解。与点对定线相比，共线关系从“每对重复验证全部点”压缩为“每个锚点给其他点分桶”，期望
时间降为 ``O(n^2)``。

为什么不能直接用 ``double`` 斜率作键
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

斜率 ``deltaY / deltaX`` 本质是有理数。数学上相等的比例经过浮点除法后依赖舍入表示；竖线还要处理除零，
水平线可能出现正零与负零。即使当前坐标范围下许多例子恰好通过，浮点键也没有提供精确的等价类证明。

整数方向向量可以精确规范化。先用 ``gcd(deltaX, deltaY)`` 同时约分，得到互质分量；再规定非竖直方向的
``deltaX`` 必须为正，若为负就同时翻转两个分量。这样 ``(2,1)``、``(4,2)`` 与 ``(-2,-1)`` 都统一为
``(deltaY, deltaX) = (1,2)``。

水平线与竖直线为何单独规范
~~~~~~~~~~~~~~~~~~~~~~~~~~

同一竖线上，从锚点向上可能得到 ``(0, positive)``，向下得到 ``(0, negative)``；它们必须属于同一条线，
统一键设为 ``(1,0)``。水平线对称统一为 ``(0,1)``。先处理这两类也避免最大公约数和符号规则出现零分量
歧义。

.. list-table::
   :header-rows: 1

   * - 原始 ``(deltaX, deltaY)``
     - 规范键 ``(deltaY, deltaX)``
     - 含义
   * - ``(4, 2)``
     - ``(1, 2)``
     - 斜率 ``1/2``
   * - ``(-2, -1)``
     - ``(1, 2)``
     - 反方向但同一直线
   * - ``(0, 5)``、``(0, -3)``
     - ``(1, 0)``
     - 竖直线
   * - ``(6, 0)``、``(-4, 0)``
     - ``(0, 1)``
     - 水平线

哈希状态与具体走读
~~~~~~~~~~~~~~~~~~

对锚点 ``[0,0]`` 和其他点 ``[-2,-1]``、``[2,1]``、``[4,2]``、``[0,3]``，前三个方向都规范为
``(1,2)``，该桶计数为三；竖直点进入 ``(1,0)`` 桶。当前锚点所在最大直线含 ``3 + 1 = 4`` 个点。

输入保证点互不重复，所以不会出现 ``deltaX == 0 && deltaY == 0`` 的“重复点”状态；若约束允许重复点，
必须另设计数并把它加到每个锚点答案，不能把零向量归入某个方向桶。这里不为不存在的状态增加代码分支。

``DirectionHash`` 只负责把规范整数对组合成哈希值；方向相等性仍由 ``std::pair`` 的精确整数比较决定，哈希
碰撞不会错误合并不同方向，容器会继续检查键相等。

正确性与复杂度
~~~~~~~~~~~~~~

固定锚点时，同一规范键的点与锚点共线；任意经过锚点的共线点又具有成比例方向，经约分和符号统一后键相同，
所以桶与过锚点直线一一对应。遍历全部锚点后，全局最大值必被统计。

主解共有 ``n`` 个锚点，每个扫描 ``n-1`` 个点；最大公约数和哈希操作按坐标位宽计为常数，期望时间
``O(n^2)``、单个锚点的哈希空间 ``O(n)``。三点叉积基线时间 ``O(n^3)``、额外空间 ``O(1)``，保留它用于
展示重复定义同一直线的瓶颈；主解选择精确整数方向哈希。
