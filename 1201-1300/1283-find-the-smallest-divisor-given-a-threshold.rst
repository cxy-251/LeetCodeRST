1283. Find the Smallest Divisor Given a Threshold
=================================================

题目信息
--------

:题号: 1283
:难度: Medium
:主题: 数组、二分查找、向上取整
:原题: `LeetCode 1283 <https://leetcode.com/problems/find-the-smallest-divisor-given-a-threshold/>`_
:重点: 用同一个正整数除数处理所有元素，每项结果向上取整；寻找使总和不超过 ``threshold`` 的最小除数

题目重述
--------

给定正整数数组 ``nums`` 和整数 ``threshold``。选择一个正整数 ``divisor``，把每个 ``nums[i]`` 除以它并向上取整，再把所有结果相加。

请返回使该总和不超过 ``threshold`` 的最小正整数除数。题目保证答案存在。

``1 <= nums.length <= 5 * 10^4``，``1 <= nums[i] <= 10^6``，``nums.length <= threshold <= 10^6``。

自建示例
--------

较小除数超限时继续增大：

.. code-block:: text

   输入：nums = [2,3,5], threshold = 5
   输出：3
   解释：除数 2 得到 1 + 2 + 3 = 6；除数 3 得到 1 + 1 + 2 = 4，因此最小合法除数为 3。

除数一已经满足阈值：

.. code-block:: text

   输入：nums = [1,2], threshold = 3
   输出：1
   解释：使用除数 1 时总和恰好为 3，不能选择更小的正整数。