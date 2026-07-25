1802. Maximum Value at a Given Index in a Bounded Array
=======================================================

题目信息
--------

:题号: 1802
:难度: Medium
:主题: 二分查找、贪心、数学
:原题: `LeetCode 1802 <https://leetcode.com/problems/maximum-value-at-a-given-index-in-a-bounded-array/>`_
:重点: 正整数数组相邻差不超过 1，在总和上限内最大化指定位置

题目重述
--------

构造长度为 ``n`` 的正整数数组，使相邻元素差的绝对值至多为 1，且数组总和不超过 ``maxSum``。返回索引 ``index`` 处能够取得的最大值。

自建示例
--------

.. code-block:: text

   输入：n = 4, index = 1, maxSum = 8
   输出：3
   解释：[2,3,2,1] 满足全部条件，索引 1 处可取 3。

.. code-block:: text

   输入：n = 1, index = 0, maxSum = 7
   输出：7
   解释：数组只有一个元素，可以直接使用全部和上限。
