0223. Rectangle Area
====================

题目信息
--------

:题号: 0223. 矩形面积
:难度: Medium
:主题: 几何、矩形、区间交集、容斥
:原题: `LeetCode 0223 <https://leetcode.com/problems/rectangle-area/>`_
:重点: 轴对齐矩形的覆盖并集、一维投影求交、边界接触没有面积

题目重述
--------

平面上有两个边与坐标轴平行的矩形。第一个矩形由左下角 ``(ax1, ay1)`` 和右上角
``(ax2, ay2)`` 给出，第二个矩形由左下角 ``(bx1, by1)`` 和右上角 ``(bx2, by2)`` 给出。
返回它们覆盖区域的并集面积：被至少一个矩形盖住的平面只计算一次。

坐标均为整数，并满足 ``-10^4 <= ax1 <= ax2 <= 10^4``，另外三组坐标同样如此。因此每个矩形
的左边不晚于右边、下边不晚于上边，但允许宽或高为 0。矩形可以分离、部分重叠、完全包含，
也可以只在边或顶点处接触。题目返回覆盖面积，不要求输出重叠矩形的坐标；八个参数按值传入，
不存在需要修改的输入结构。

由约束可知单个矩形面积至多 ``2 \times 10^4 \times 2 \times 10^4 = 4 \times 10^8``，两个面积
之和不超过 ``8 \times 10^8``，结果落在 32 位有符号整数范围内。

自建示例
--------

部分重叠：

.. code-block:: text

   输入：ax1=-1, ay1=0, ax2=3, ay2=4, bx1=1, by1=2, bx2=5, by2=5
   输出：24
   解释：面积分别为 16 和 12；重叠区域宽 2、高 2、面积 4，并集为 16 + 12 - 4 = 24。

一个矩形完全落在另一个内部：

.. code-block:: text

   输入：ax1=0, ay1=0, ax2=4, ay2=4, bx1=1, by1=1, bx2=3, by2=2
   输出：16
   解释：内矩形面积 2 已经包含在外矩形的 16 中，并集仍是 16。

只在竖直边上接触：

.. code-block:: text

   输入：ax1=0, ay1=0, ax2=2, ay2=3, bx1=2, by1=1, bx2=4, by2=4
   输出：12
   解释：公共部分是 x=2 上的一段线段，没有二维面积，总面积为 6 + 6。

退化矩形：

.. code-block:: text

   输入：ax1=2, ay1=0, ax2=2, ay2=5, bx1=0, by1=1, bx2=4, by2=3
   输出：8
   解释：第一个矩形左右边重合，面积为 0；并集等于第二个矩形的面积 8。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>

   class Solution {
   public:
       int computeArea(int ax1, int ay1, int ax2, int ay2, int bx1, int by1, int bx2, int by2) {
           return unionByInclusionExclusion(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2);
       }

   private:
       int countCoveredUnitSquares(int ax1, int ay1, int ax2, int ay2,
                                   int bx1, int by1, int bx2, int by2) {
           const int left = std::min(ax1, bx1);
           const int right = std::max(ax2, bx2);
           const int bottom = std::min(ay1, by1);
           const int top = std::max(ay2, by2);
           int area = 0;
           for (int x = left; x < right; ++x) {
               for (int y = bottom; y < top; ++y) {
                   const bool in_a = x >= ax1 && x < ax2 && y >= ay1 && y < ay2;
                   const bool in_b = x >= bx1 && x < bx2 && y >= by1 && y < by2;
                   if (in_a || in_b) {
                       ++area;
                   }
               }
           }
           return area;
       }

       int unionByInclusionExclusion(int ax1, int ay1, int ax2, int ay2,
                                     int bx1, int by1, int bx2, int by2) {
           const long long area_a = static_cast<long long>(ax2 - ax1) * (ay2 - ay1);
           const long long area_b = static_cast<long long>(bx2 - bx1) * (by2 - by1);
           const long long overlap_left = std::max(ax1, bx1);
           const long long overlap_right = std::min(ax2, bx2);
           const long long overlap_bottom = std::max(ay1, by1);
           const long long overlap_top = std::min(ay2, by2);
           const long long overlap_width = std::max(0LL, overlap_right - overlap_left);
           const long long overlap_height = std::max(0LL, overlap_top - overlap_bottom);
           return static_cast<int>(area_a + area_b - overlap_width * overlap_height);
       }
   };

题解
----

覆盖区域的原始搜索空间
~~~~~~~~~~~~~~~~~~~~~~

坐标都是整数，轴对齐矩形 ``[x1, x2] \times [y1, y2]`` 的面积等于其中单位正方形的个数：每个
格子以整数点 ``(x, y)`` 为左下角，覆盖半开区域 ``[x, x+1) \times [y, y+1)``。并集面积就是
至少被一个矩形盖住的格子数量。

``countCoveredUnitSquares`` 取两个矩形的外接范围，枚举其中每个单位格子，判断左下角是否落在
A 或 B 的半开覆盖里。每个被覆盖格子恰好加 1，分离、包含、部分重叠和边界接触都不会漏计或
重复计：只接触边或点时，不存在同时满足 ``x < 右边界`` 且 ``x >= 左边界`` 的正宽度格子。

外接范围边长可达 ``2 \times 10^4``，双重循环最坏接近 ``4 \times 10^8`` 次判断。正确性来自
“逐格检查覆盖”，瓶颈也正是这层与面积同阶的枚举。真正重复的工作不是判断某个格子是否被盖住，
而是对整块连续矩形区域反复做同一种成员测试。

两次计入只发生在交集上
~~~~~~~~~~~~~~~~~~~~~~

每个矩形自身是连续块，面积可以直接用宽乘高得到，不必再数格子：

.. math::

   area(A) = (ax2 - ax1)\,(ay2 - ay1), \quad
   area(B) = (bx2 - bx1)\,(by2 - by1)

``area(A) + area(B)`` 已经覆盖全部格子，但交集中的格子被加了两次。容斥把并集改写成：

.. math::

   area(A \cup B) = area(A) + area(B) - area(A \cap B)

于是问题从二维枚举收缩为：求出两个轴对齐矩形的交集面积。若能在常数时间内得到交集，格子循环
就可以整段删除。

投影求交代替分情况讨论
~~~~~~~~~~~~~~~~~~~~~~

两个轴对齐矩形的交集（若存在正面积）仍是轴对齐矩形。点 ``(x, y)`` 同时落在两个矩形内，当且
仅当 ``x`` 落在两个 ``x`` 投影的交集里，并且 ``y`` 落在两个 ``y`` 投影的交集里。一维闭区间
``[p, q]`` 与 ``[r, s]`` 的交是 ``[\max(p, r), \min(q, s)]``。因此：

.. code-block:: text

   overlap_left   = max(ax1, bx1)
   overlap_right  = min(ax2, bx2)
   overlap_bottom = max(ay1, by1)
   overlap_top    = min(ay2, by2)

有效宽度为 ``max(0, overlap_right - overlap_left)``，高度同理。任一方向没有正长度，交集就
没有二维面积。这个公式统一处理分离、相切、部分重叠和包含，不再枚举几何关系。

未截断差值如何对应相交类型
~~~~~~~~~~~~~~~~~~~~~~~~~~

对部分重叠示例和另外两种边界，水平方向的未截断宽度分别为：

.. list-table::
   :header-rows: 1

   * - 情形
     - 左、右端
     - 未截断宽度
     - 有效宽度
   * - 部分重叠
     - ``1, 3``
     - ``2``
     - ``2``
   * - 包含
     - ``1, 3``
     - ``2``
     - ``2``
   * - 边接触
     - ``2, 2``
     - ``0``
     - ``0``
   * - 左右分离
     - ``3, 1``
     - ``-2``
     - ``0``

分离时两个方向都可能得到负数。若先把两个负数相乘再当作重叠面积，会得到正值，容斥反而把并集
算大。必须先把每个方向截断到 ``0``，再相乘。边接触得到宽度 0，乘积仍为 0，与“线段没有面积”
一致。包含关系不需要单独分支：内矩形的投影已经是外矩形投影的子集，交集面积等于较小者。

代码分析
~~~~~~~~

``countCoveredUnitSquares`` 保留原始定义：外接框内每个单位格子检查一次覆盖。公共入口调用
``unionByInclusionExclusion``，它删除整层格子循环，只保留两个矩形面积和四个投影端点。

宽和高先转成 ``long long`` 再相乘，避免把乘法写在 ``int`` 里依赖约束碰巧不溢出。重叠端点
同样提升后再相减，使 ``overlap_right - overlap_left`` 在分离时保持正确的负号，随后被
``max(0, ·)`` 截断。主解不分配与坐标范围成正比的容器，也不修改调用参数。

复杂度与边界
~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 主要代价
   * - 枚举单位格子
     - ``O(WH)``
     - ``O(1)``
     - 扫描两个矩形外接范围中的每个单位格子
   * - 容斥求并
     - ``O(1)``
     - ``O(1)``
     - 两次面积计算和四个投影端点比较

``W``、``H`` 是外接范围的宽和高，最坏约为 ``2 \times 10^4``。宽或高为 0 时，对应面积为 0，
容斥公式仍然成立。两个矩形完全重合时，减去的交集等于其中一个面积，并集不会变成 0。输入坐标
允许为负，投影取最大左端和最小右端与符号无关。
