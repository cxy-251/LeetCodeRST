1465. Maximum Area of a Piece of Cake After Horizontal and Vertical Cuts
========================================================================

题目信息
--------

:题号: 1465
:难度: Medium
:主题: 排序、间隔、取模
:原题: `LeetCode 1465 <https://leetcode.com/problems/maximum-area-of-a-piece-of-cake-after-horizontal-and-vertical-cuts/>`_
:重点: 所有切线贯穿整块蛋糕，最大面积等于最大水平间隔与最大竖直间隔的乘积，结果取模

题目重述
--------

给定高为 ``h``、宽为 ``w`` 的矩形蛋糕，以及水平切线位置数组 ``horizontalCuts`` 和竖直切线位置数组 ``verticalCuts``。

完成全部切割后，请返回面积最大的蛋糕块面积，对 ``10^9 + 7`` 取模。蛋糕边界也参与形成首尾间隔。

``2 <= h, w <= 10^9``，两组切线数量位于 ``[1,10^5]``，位置互不相同且严格位于对应边界内部。

自建示例
--------

最大面积由两个方向的最大间隔相乘得到：

.. code-block:: text

   输入：h = 5, w = 4, horizontalCuts = [2], verticalCuts = [1,3]
   输出：6
   解释：最大水平间隔为 3，最大竖直间隔为 2，面积为 6。

切线把两个方向都均匀分开：

.. code-block:: text

   输入：h = 2, w = 2, horizontalCuts = [1], verticalCuts = [1]
   输出：1
   解释：四块蛋糕面积都为 1。