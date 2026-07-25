1707. Maximum XOR With an Element From Array
============================================

题目信息
--------

:题号: 1707
:难度: Hard
:主题: 字典树、离线查询、位运算
:原题: `LeetCode 1707 <https://leetcode.com/problems/maximum-xor-with-an-element-from-array/>`_
:重点: 每个查询只能选择 ``nums`` 中不大于 ``m`` 的元素，最大化与 ``x`` 的异或值

题目重述
--------

对查询 ``[x,m]``，在所有 ``nums[j] <= m`` 的元素中求 ``x XOR nums[j]`` 最大值；没有合法元素时返回 ``-1``。

自建示例
--------

.. code-block:: text

   输入：nums = [0,1,2], queries = [[3,1],[1,0]]
   输出：[3,1]
   解释：第一项可选 0 或 1，最大异或为 3；第二项只能选 0。

.. code-block:: text

   输入：nums = [5], queries = [[2,3]]
   输出：[-1]
   解释：没有元素不大于 3。