1310. XOR Queries of a Subarray
===============================

题目信息
--------

:题号: 1310
:难度: Medium
:主题: 数组、前缀异或、区间查询
:原题: `LeetCode 1310 <https://leetcode.com/problems/xor-queries-of-a-subarray/>`_
:重点: 每个查询返回闭区间 ``[left,right]`` 中全部元素的按位异或结果

题目重述
--------

给定整数数组 ``arr`` 和查询数组 ``queries``。每个查询 ``[left, right]`` 要求计算 ``arr[left] XOR arr[left+1] XOR ... XOR arr[right]``。

请按查询原顺序返回所有结果。查询区间为闭区间，单元素区间的结果就是该元素本身。

``1 <= arr.length, queries.length <= 3 * 10^4``，``0 <= arr[i] <= 10^9``，查询下标合法。

自建示例
--------

不同查询区间可以重叠：

.. code-block:: text

   输入：arr = [5,2,7], queries = [[0,1],[1,2],[0,2]]
   输出：[7,5,0]
   解释：5 XOR 2=7，2 XOR 7=5，5 XOR 2 XOR 7=0。

单元素区间直接返回原值：

.. code-block:: text

   输入：arr = [8], queries = [[0,0]]
   输出：[8]
   解释：区间只包含一个元素。