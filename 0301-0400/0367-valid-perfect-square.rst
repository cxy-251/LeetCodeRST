0367. Valid Perfect Square
==========================

题目信息
--------

:题号: 0367
:难度: Easy
:主题: 正整数、完全平方数、精确判断、禁用平方根函数
:原题: `LeetCode 0367 <https://leetcode.com/problems/valid-perfect-square/>`_
:重点: 判断是否存在整数平方根、输入可达 32 位上限、不能调用内置平方根函数、返回布尔值

题目重述
--------

给定正整数 ``num``，判断是否存在整数 ``x``，使 ``x * x = num``。若存在则返回 ``true``，否则返回 ``false``。

``num`` 位于 ``[1, 2^31-1]``。判断过程不能调用 ``sqrt`` 等内置平方根函数；乘法比较时还需要容纳可能超过 32 位有符号整数范围的中间结果。题目只要求判断，不需要返回平方根。

自建示例
--------

较大的完全平方数：

.. code-block:: text

   输入：num = 144
   输出：true
   解释：存在整数 12，且 12 * 12 = 144。

相邻的非完全平方数：

.. code-block:: text

   输入：num = 145
   输出：false
   解释：12^2 = 144，13^2 = 169，145 位于两者之间，不是任何整数的平方。

在可能的根区间上二分
----------------------

平方函数在非负整数上单调递增，因此可以在 ``[1, num]`` 中二分整数根。若 ``mid * mid`` 等于目标立即成功；若小于目标，根只能在右侧；若大于目标，根只能在左侧。二分结束仍未命中则不是完全平方数。

比较平方时使用 ``long long``，因为 ``mid`` 接近 ``sqrt(INT_MAX)`` 时乘积虽然通常仍可容纳，但显式提升类型使边界推理不依赖 32 位乘法规则，也满足不调用内置平方根函数的要求。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       bool isPerfectSquare(int num) {
           long long left = 1;
           long long right = num;
           while (left <= right) {
               long long middle = left + (right - left) / 2;
               long long square = middle * middle;
               if (square == num) return true;
               if (square < num) {
                   left = middle + 1;
               } else {
                   right = middle - 1;
               }
           }
           return false;
       }
   };

代码分析
--------

每次比较排除一半候选根，区间闭合条件也覆盖 ``num == 1``；搜索过程中没有浮点近似和平方根库调用。时间复杂度为 ``O(log num)``，额外空间为 ``O(1)``。
