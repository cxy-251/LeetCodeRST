1906. Minimum Absolute Difference Queries
=========================================

题目信息
--------

:题号: 1906
:难度: Medium
:主题: 前缀计数、数组
:原题: `LeetCode 1906 <https://leetcode.com/problems/minimum-absolute-difference-queries/>`_
:重点: 每个查询统计区间内不同数值之间的最小绝对差

题目重述
--------

对每个闭区间查询，返回其中任意两个不同数值的最小绝对差；区间内不足两个不同值时返回 -1。

自建示例
--------

.. code-block:: text

   输入：nums = [1,3,4,8], queries = [[0,2],[3,3]]
   输出：[1,-1]
   解释：首个区间不同值为 1、3、4，最小差为 1；第二个区间只有一个值。

.. code-block:: text

   输入：nums = [5,5], queries = [[0,1]]
   输出：[-1]
   解释：区间中没有两个不同数值。
