1925. Count Square Sum Triples
==============================

题目信息
--------

:题号: 1925
:难度: Easy
:主题: 数学、枚举
:原题: `LeetCode 1925 <https://leetcode.com/problems/count-square-sum-triples/>`_
:重点: 统计 ``1 <= a,b,c <= n`` 且 ``a² + b² = c²`` 的有序三元组

题目重述
--------

返回正整数三元组 ``(a,b,c)`` 的数量，其中每个数不超过 ``n``，并满足勾股等式。``(a,b,c)`` 与 ``(b,a,c)`` 分别计数。

自建示例
--------

.. code-block:: text

   输入：n = 5
   输出：2
   解释：(3,4,5) 与 (4,3,5) 都满足条件。

.. code-block:: text

   输入：n = 2
   输出：0
   解释：范围内不存在勾股三元组。
