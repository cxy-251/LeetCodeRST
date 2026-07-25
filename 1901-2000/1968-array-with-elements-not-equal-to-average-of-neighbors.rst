1968. Array With Elements Not Equal to Average of Neighbors
==========================================================

题目信息
--------

:题号: 1968
:难度: Medium
:主题: 贪心、排序、构造
:原题: `LeetCode 1968 <https://leetcode.com/problems/array-with-elements-not-equal-to-average-of-neighbors/>`_
:重点: 重排后每个内部元素不能等于左右邻居平均值

题目重述
--------

重排互不相同的数组，使每个非首尾元素都不等于其左右相邻元素的平均值。返回任意合法排列。

自建示例
--------

.. code-block:: text

   输入：nums = [1,2,3]
   输出：[1,3,2]
   解释：中间元素 3 不等于 (1 + 2) / 2。

.. code-block:: text

   输入：nums = [1,2]
   输出：[1,2]
   解释：没有内部位置，任意排列都合法。
