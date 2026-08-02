0507. Perfect Number
====================

题目信息
--------

:题号: 0507
:难度: Easy
:主题: 正整数、真因子、因子和、完全数判定
:原题: `LeetCode 0507 <https://leetcode.com/problems/perfect-number/>`_
:重点: 真因子必须小于自身、只统计正因子、判断因子和是否恰好等于原数

题目重述
--------

给定正整数 ``num``。若 ``num`` 的所有正真因子之和恰好等于 ``num``，则称它为完全数。真因子是能够整除 ``num`` 且严格小于 ``num`` 的正整数。

判断 ``num`` 是否为完全数并返回布尔值。``num`` 位于 ``[1, 10^8]``；数字本身不能计入因子和，``1`` 没有除自身之外的正因子，因此不是完全数。

自建示例
--------

较大的完全数：

.. code-block:: text

   输入：num = 496
   输出：true
   解释：496 的正真因子为 1、2、4、8、16、31、62、124、248，它们的和为 496。

因子和超过原数：

.. code-block:: text

   输入：num = 12
   输出：false
   解释：12 的正真因子 1、2、3、4、6 之和为 16，不等于 12。

成对枚举到平方根
----------------

``1`` 是所有大于 1 的正整数的真因子，先把它加入和。对于每个除数 ``d``，若 ``d`` 整除 ``num``，则 ``num / d`` 也是因子；二者成对出现，只需枚举到平方根，并在完全平方数时避免把平方根加两次。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       bool checkPerfectNumber(int num) {
           if (num <= 1) return false;
           long long sum = 1;
           for (long long divisor = 2;
                divisor * divisor <= num; ++divisor) {
               if (num % divisor != 0) continue;
               sum += divisor;
               long long paired = num / divisor;
               if (paired != divisor) sum += paired;
           }
           return sum == num;
       }
   };

代码分析
--------

除数和商覆盖了除 1 与自身之外的全部正真因子，平方根的重复由条件排除；若累计和超过 ``num`` 也不会成为完全数，但完整求和仍保持逻辑直接。时间复杂度为 ``O(sqrt(num))``，额外空间复杂度为 ``O(1)``。
