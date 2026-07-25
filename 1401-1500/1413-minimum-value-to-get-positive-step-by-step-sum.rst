1413. Minimum Value to Get Positive Step by Step Sum
====================================================

题目信息
--------

:题号: 1413
:难度: Easy
:主题: 数组、前缀和、最小值
:原题: `LeetCode 1413 <https://leetcode.com/problems/minimum-value-to-get-positive-step-by-step-sum/>`_
:重点: 选择最小正整数 ``startValue``，使加入数组每个前缀后的累计和始终至少为一

题目重述
--------

给定整数数组 ``nums``。从一个正整数 ``startValue`` 开始，依次把数组元素加入当前总和。

请返回最小的 ``startValue``，使每一步完成后的累计和都不小于 ``1``。

``1 <= nums.length <= 100``，``-100 <= nums[i] <= 100``。

自建示例
--------

最低前缀和决定所需起始值：

.. code-block:: text

   输入：nums = [-2,3,-4]
   输出：4
   解释：数组前缀和最低为 -3，起始值 4 可使对应累计和恰好为 1。

所有前缀和均为正时最小起始值为一：

.. code-block:: text

   输入：nums = [1,2]
   输出：1
   解释：从 1 开始后的累计和依次为 2 和 4。