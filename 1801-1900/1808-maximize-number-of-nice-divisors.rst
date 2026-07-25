1808. Maximize Number of Nice Divisors
======================================

题目信息
--------

:题号: 1808
:难度: Hard
:主题: 数学、快速幂
:原题: `LeetCode 1808 <https://leetcode.com/problems/maximize-number-of-nice-divisors/>`_
:重点: 将质因数数量拆分为乘积最大的整数分组

题目重述
--------

给定目标整数拥有的质因数总数 ``primeFactors``，在所有满足条件的整数中最大化其优质因数数量，并将结果对 ``10^9 + 7`` 取模。

自建示例
--------

.. code-block:: text

   输入：primeFactors = 5
   输出：6
   解释：将 5 拆成 3 和 2，乘积 3 × 2 = 6 最大。

.. code-block:: text

   输入：primeFactors = 1
   输出：1
   解释：只有一个质因数时无法进一步拆分。
