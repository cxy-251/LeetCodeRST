0915. Partition Array into Disjoint Intervals
==============================================

题目信息
--------

:题号: 0915
:难度: Medium
:主题: 数组、连续分割、最短左区间
:原题: `LeetCode 0915 <https://leetcode.com/problems/partition-array-into-disjoint-intervals/>`_
:重点: ``left`` 与 ``right`` 都必须非空且保持原数组连续顺序；要求左侧任意元素不大于右侧任意元素，并返回最短 ``left`` 的长度

题目重述
--------

给定整数数组 ``nums``，需要在某个下标处分成两个连续部分 ``left`` 和 ``right``。``left`` 是原数组的非空前缀，``right`` 是紧随其后的非空后缀，两部分合起来必须包含全部元素。

分割必须满足 ``left`` 中的每个元素都小于或等于 ``right`` 中的每个元素，等价于 ``max(left) <= min(right)``。题目保证至少存在一种合法分割，请返回合法方案中 ``left`` 的最小长度。

``2 <= nums.length <= 10^5``，``0 <= nums[i] <= 10^6``。

自建示例
--------

只有最后一个元素可以放入右侧：

.. code-block:: text

   输入：nums = [2,0,3,4,1,5]
   输出：5
   解释：取 left = [2,0,3,4,1]、right = [5] 时，左侧最大值 4 不大于右侧最小值 5。任何更短前缀的右侧都包含 0 或 1，无法满足条件。

相等元素允许分居两侧：

.. code-block:: text

   输入：nums = [1,1]
   输出：1
   解释：取 left = [1]、right = [1] 时满足 max(left) = min(right) = 1，因此最短左区间长度为 1。