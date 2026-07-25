1523. Count Odd Numbers in an Interval Range
============================================

题目信息
--------

:题号: 1523
:难度: Easy
:主题: 数学、区间计数、奇偶性
:原题: `LeetCode 1523 <https://leetcode.com/problems/count-odd-numbers-in-an-interval-range/>`_
:重点: 统计闭区间 ``[low,high]`` 内的奇数数量，两个端点都包含

题目重述
--------

给定两个非负整数 ``low`` 和 ``high``，且 ``low <= high``。

请返回闭区间 ``[low,high]`` 中奇数的数量。

``0 <= low <= high <= 10^9``。

自建示例
--------

两个端点都为奇数时均需计数：

.. code-block:: text

   输入：low = 3, high = 9
   输出：4
   解释：区间中的奇数为 3、5、7、9。

单点偶数区间中没有奇数：

.. code-block:: text

   输入：low = 8, high = 8
   输出：0
   解释：唯一整数 8 为偶数。