0223. Rectangle Area
====================

题目信息
--------

:题号: 0223
:难度: Medium
:主题: 几何、数学
:原题: `LeetCode 0223 <https://leetcode.com/problems/rectangle-area/>`_
:教学重点: 投影交集、容斥、无重叠边界

题目重述
--------

给定两个与坐标轴平行的矩形，每个矩形由左下角和右上角坐标描述，接口为 ``int computeArea(int ax1, int ay1, int ax2, int ay2, int bx1, int by1, int bx2, int by2)``。返回两个矩形覆盖区域的总面积；边界接触不产生重叠面积。坐标绝对值最多约 ``10^4``，结果适合 32 位整数。

自建示例
--------

.. code-block:: text

   输入：A=(0,0,4,3), B=(2,1,5,4)
   输出：17
   说明：面积 12 + 9 - 重叠面积 4。

   输入：A=(0,0,1,1), B=(1,0,2,1)
   输出：2
