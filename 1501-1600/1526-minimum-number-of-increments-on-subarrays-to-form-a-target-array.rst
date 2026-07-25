1526. Minimum Number of Increments on Subarrays to Form a Target Array
=====================================================================

题目信息
--------

:题号: 1526
:难度: Hard
:主题: 数组、贪心、差分
:原题: `LeetCode 1526 <https://leetcode.com/problems/minimum-number-of-increments-on-subarrays-to-form-a-target-array/>`_
:重点: 从全零数组开始，每次把一个连续子数组全部加一；最少操作数等于首项和所有正向增量之和

题目重述
--------

给定正整数数组 ``target``。初始有一个与其等长且所有元素均为 ``0`` 的数组。

一次操作可以选择任意非空连续子数组，并把其中每个元素都增加 ``1``。请返回把初始数组变成 ``target`` 所需的最少操作次数。

``1 <= target.length <= 10^5``，``1 <= target[i] <= 10^5``。

自建示例
--------

下降位置可以复用之前已经完成的操作层：

.. code-block:: text

   输入：target = [1,3,2]
   输出：3
   解释：先把全部位置加一，再把后两个位置加一，最后把中间位置加一。

单元素目标需要与目标值相同的操作次数：

.. code-block:: text

   输入：target = [5]
   输出：5
   解释：每次只能把该元素增加一。