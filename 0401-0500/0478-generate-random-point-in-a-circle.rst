0478. Generate Random Point in a Circle
=======================================

题目信息
--------

:题号: 0478
:难度: Medium
:主题: 圆形区域、二维随机点、均匀面积分布、对象状态
:原题: `LeetCode 0478 <https://leetcode.com/problems/generate-random-point-in-a-circle/>`_
:重点: 返回点必须位于圆内或圆周、圆内等面积区域概率相同、构造参数在多次调用间保持

题目重述
--------

实现 ``Solution`` 类。构造函数接收圆的半径 ``radius`` 和圆心坐标 ``x_center``、``y_center``；``randPoint()`` 每次返回圆内或圆周上的一个随机点 ``[x, y]``。

随机分布必须在圆的面积上均匀：任意两个面积相等的子区域被选中的概率相同，不能让靠近圆心或圆周的区域获得额外概率。返回点必须满足：

.. code-block:: text

   (x - x_center)^2 + (y - y_center)^2 <= radius^2

``radius`` 位于 ``(0, 10^8]``，圆心坐标位于 ``[-10^7, 10^7]``，调用次数不超过 ``3 * 10^4``。具体单次输出不可预先确定。

自建示例
--------

检查输出范围：

.. code-block:: text

   构造：Solution(3, 2, -1)
   调用：randPoint()
   输出：例如 [3.2, 0.5]，也可能是圆内其他点
   解释：(3.2-2)^2 + (0.5+1)^2 = 3.69 <= 9，因此示例点位于圆内；每次调用可以返回不同结果。

均匀性要求：

.. code-block:: text

   调用：大量重复执行 randPoint()
   输出：所有点都在圆内
   解释：长期统计应按面积均匀分布，不能简单让半径在 0..radius 上均匀而导致圆心附近过密。

在外接正方形中拒绝采样
----------------------

先在 ``[-1,1] × [-1,1]`` 正方形中均匀生成偏移量 ``(dx,dy)``，若 ``dx^2 + dy^2 > 1`` 就丢弃并重试，否则把偏移量乘以半径再平移到圆心。正方形中被接受的点仍然保持均匀，而接受区域正是单位圆，因此得到按面积均匀的圆内点。

不能把半径直接均匀取在 ``[0,radius]`` 上，因为半径越小的同心圆环面积越小，会造成圆心附近过密；拒绝采样避免了这个偏差。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       double radius;
       double centerX;
       double centerY;

       double uniform(double left, double right) {
           return left + (right - left) *
                            (std::rand() / static_cast<double>(RAND_MAX));
       }

   public:
       Solution(double radius, double x_center, double y_center)
           : radius(radius), centerX(x_center), centerY(y_center) {}

       std::vector<double> randPoint() {
           double dx = 0;
           double dy = 0;
           do {
               dx = uniform(-1.0, 1.0);
               dy = uniform(-1.0, 1.0);
           } while (dx * dx + dy * dy > 1.0);

           return {centerX + radius * dx, centerY + radius * dy};
       }
   };

代码分析
--------

被接受的偏移点在单位圆内均匀分布，缩放和平移只改变坐标，不改变相对面积概率；边界是否恰好命中圆周不影响连续分布。每次尝试使用常数空间，接受概率为 ``pi/4``，因此期望尝试次数为常数，额外空间复杂度为 ``O(1)``。
