1640. Check Array Formation Through Concatenation
================================================

题目信息
--------

:题号: 1640
:难度: Easy
:主题: 数组、哈希表、拼接
:原题: `LeetCode 1640 <https://leetcode.com/problems/check-array-formation-through-concatenation/>`_
:重点: ``pieces`` 可任意排序，但每个片段内部元素顺序不能改变

题目重述
--------

给定元素互不相同的数组 ``arr`` 和若干片段 ``pieces``。判断是否能重排片段并依次拼接，恰好得到 ``arr``。

自建示例
--------

.. code-block:: text

   输入：arr = [3,1,2], pieces = [[1,2],[3]]
   输出：true
   解释：按 [3]、[1,2] 的顺序拼接即可。

.. code-block:: text

   输入：arr = [1,2,3], pieces = [[2,1],[3]]
   输出：false
   解释：片段 [2,1] 内部不能重排。