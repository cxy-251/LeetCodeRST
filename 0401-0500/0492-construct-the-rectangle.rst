0492. Construct the Rectangle
=============================

题目信息
--------

:题号: 0492
:难度: Easy
:主题: 整数面积、长和宽、因数对、最小差值
:原题: `LeetCode 0492 <https://leetcode.com/problems/construct-the-rectangle/>`_
:重点: ``L * W = area``、必须满足 ``L >= W``、在合法整数因数对中最小化 ``L-W``、返回 ``[L,W]``

题目重述
--------

给定正整数 ``area``，寻找正整数长度 ``L`` 和宽度 ``W``，使矩形面积满足 ``L * W = area``，并且 ``L >= W``。在所有合法因数对中，选择 ``L - W`` 最小的一对，返回 ``[L, W]``。

``area`` 位于 ``[1, 10^7]``。答案保证存在且唯一。长度和宽度都必须是正整数，不能使用近似值或非整数边长。

自建示例
--------

存在接近平方的因数对：

.. code-block:: text

   输入：area = 30
   输出：[6,5]
   解释：30 的合法因数对包括 [30,1]、[15,2]、[10,3]、[6,5]，最后一对的长宽差最小。

面积为质数：

.. code-block:: text

   输入：area = 13
   输出：[13,1]
   解释：13 只有因数 1 和 13，因此这是唯一合法矩形。

从平方根向下寻找最接近因数
--------------------------

在因数对 ``L * W = area`` 中，若 ``W`` 越接近平方根，``L = area / W`` 就越接近 ``W``，长宽差越小。因此从 ``floor(sqrt(area))`` 向下枚举宽度，第一次整除时得到的 ``[area / W, W]`` 就是最优答案，同时天然满足 ``L >= W``。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::vector<int> constructRectangle(int area) {
           for (int width = static_cast<int>(std::sqrt(area));
                width >= 1; --width) {
               if (area % width == 0) {
                   return {area / width, width};
               }
           }
           return {area, 1};
       }
   };

代码分析
--------

因数对关于平方根对称，离平方根最近的可行宽度使 ``L-W`` 最小；向下枚举保证第一次命中就是该宽度。最多检查 ``sqrt(area)`` 个候选，时间复杂度为 ``O(sqrt(area))``，额外空间复杂度为 ``O(1)``。
