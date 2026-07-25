1764. Form Array by Concatenating Subarrays of Another Array
============================================================

题目信息
--------

:题号: 1764
:难度: Medium
:主题: 数组、匹配、贪心
:原题: `LeetCode 1764 <https://leetcode.com/problems/form-array-by-concatenating-subarrays-of-another-array/>`_
:重点: ``groups`` 必须按顺序匹配为 ``nums`` 中互不重叠的连续子数组

题目重述
--------

判断是否能在 ``nums`` 中依次找到每个 ``groups[i]``，使每组内部连续、各组互不重叠且顺序不变。

自建示例
--------

.. code-block:: text

   输入：groups = [[1,2],[3]], nums = [0,1,2,4,3]
   输出：true
   解释：先匹配 [1,2]，再在后方匹配 [3]。

.. code-block:: text

   输入：groups = [[2],[1]], nums = [1,2]
   输出：false
   解释：按 groups 顺序匹配后无法再找到 1。