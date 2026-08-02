0223. Rectangle Area
====================

题目信息
--------

:题号: 0223
:难度: Medium
:主题: 几何、矩形、区间交集、容斥
:原题: `LeetCode 0223 <https://leetcode.com/problems/rectangle-area/>`_
:重点: 左下角与右上角坐标、覆盖面积并集、边界接触不产生面积

题目重述
--------

平面上有两个边与坐标轴平行的矩形。第一个矩形由左下角 ``(ax1, ay1)`` 和右上角 ``(ax2, ay2)`` 描述，第二个矩形由左下角 ``(bx1, by1)`` 和右上角 ``(bx2, by2)`` 描述。返回两个矩形合计覆盖区域的面积；重叠部分只能计算一次。

所有坐标都位于 ``[-10^4, 10^4]``，并保证每个矩形的左边严格位于右边之前、下边严格位于上边之前。两个矩形可能分离、部分重叠、完全包含，也可能只在边或顶点处接触；边界接触的重叠面积为 ``0``。答案保证适合 32 位有符号整数。

自建示例
--------

部分重叠：

.. code-block:: text

   输入：A = (-1, 0, 3, 4)，B = (1, 2, 5, 5)
   输出：24
   解释：两个矩形面积分别为 16 和 12；重叠区域宽 2、高 2、面积 4，所以并集面积为 16 + 12 - 4 = 24。

仅边界相接：

.. code-block:: text

   输入：A = (0, 0, 2, 3)，B = (2, 1, 4, 4)
   输出：12
   解释：两个矩形只在 x=2 的线段上接触，该线段没有面积，因此总面积是 6 + 6。

面积并集
--------

先分别计算两个矩形面积，再减去重叠矩形的面积。重叠区域的边界为：

.. code-block:: text

   overlap_left   = max(ax1, bx1)
   overlap_right  = min(ax2, bx2)
   overlap_bottom = max(ay1, by1)
   overlap_top    = min(ay2, by2)

重叠宽度为 ``max(0, overlap_right-overlap_left)``，高度同理。任一方向没有正长度时，
两个矩形至多接触边或点，重叠面积就是 0。容斥公式为：

.. math::

   area(A \cup B) = area(A) + area(B) - area(A \cap B)

正确性说明
----------

两个单独面积把重叠区域计算了两次。交集的左右边界必须同时落在两个矩形内，因此取两个左边界的较大值和
两个右边界的较小值；上下方向完全相同。若得到的宽或高不为正，交集没有二维面积；否则交集是宽乘高的矩形。
减去这一个交集后，每个覆盖点恰好被计算一次。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int computeArea(int ax1, int ay1, int ax2, int ay2,
                       int bx1, int by1, int bx2, int by2) {
           const long long area_a =
               static_cast<long long>(ax2 - ax1) * (ay2 - ay1);
           const long long area_b =
               static_cast<long long>(bx2 - bx1) * (by2 - by1);

           const long long overlap_width = std::max(
               0LL, static_cast<long long>(std::min(ax2, bx2)) -
                    std::max(ax1, bx1));
           const long long overlap_height = std::max(
               0LL, static_cast<long long>(std::min(ay2, by2)) -
                    std::max(ay1, by1));

           return static_cast<int>(area_a + area_b -
                                   overlap_width * overlap_height);
       }
   };

代码分析
--------

坐标差先转入 ``long long`` 后参与面积计算，避免把乘法限制在 ``int`` 中。边界接触由宽度或高度为 0
自然处理，不需要额外枚举相交类型。算法只做固定次数的比较和乘法，时间、额外空间均为 ``O(1)``；
输入坐标不被修改。
