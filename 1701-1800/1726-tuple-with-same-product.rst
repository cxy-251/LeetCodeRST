1726. Tuple with Same Product
=============================

题目信息
--------

:题号: 1726
:难度: Medium
:主题: 哈希表、乘积计数
:原题: `LeetCode 1726 <https://leetcode.com/problems/tuple-with-same-product/>`_
:重点: 四个元素下标互不相同且 ``a*b=c*d``，有序四元组分别计数

题目重述
--------

给定互不相同的正整数数组。统计由四个不同元素组成、满足两对乘积相等的有序四元组数量。

自建示例
--------

.. code-block:: text

   输入：nums = [2,3,4,6]
   输出：8
   解释：2*6=3*4，这两对可形成八种有序排列。

.. code-block:: text

   输入：nums = [1,2,4]
   输出：0
   解释：不足四个元素。