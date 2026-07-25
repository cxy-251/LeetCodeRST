1712. Ways to Split Array Into Three Subarrays
==============================================

题目信息
--------

:题号: 1712
:难度: Medium
:主题: 前缀和、二分查找、双指针
:原题: `LeetCode 1712 <https://leetcode.com/problems/ways-to-split-array-into-three-subarrays/>`_
:重点: 三个连续非空部分满足左侧和不大于中间和，中间和不大于右侧和

题目重述
--------

给定非负整数数组，统计选择两个切分点形成三个非空连续子数组，并满足 ``sum(left) <= sum(mid) <= sum(right)`` 的方案数。结果取模。

自建示例
--------

.. code-block:: text

   输入：nums = [1,1,1]
   输出：1
   解释：唯一切分得到三个和均为 1 的部分。

.. code-block:: text

   输入：nums = [0,0,0,0]
   输出：3
   解释：任意两个合法切分点都满足三个和为零。