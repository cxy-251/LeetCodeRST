1509. Minimum Difference Between Largest and Smallest Value in Three Moves
=========================================================================

题目信息
--------

:题号: 1509
:难度: Medium
:主题: 数组、排序、极值
:原题: `LeetCode 1509 <https://leetcode.com/problems/minimum-difference-between-largest-and-smallest-value-in-three-moves/>`_
:重点: 每次可把一个元素改为任意值，最多三次；只需比较删除三端极值的四种分配方式

题目重述
--------

给定整数数组 ``nums``。一次操作可以选择任意一个元素，并把它改成任意整数。最多执行三次操作。

请返回操作后数组最大值与最小值之差能够达到的最小值。可以少于三次或完全不操作。

``1 <= nums.length <= 10^5``，``-10^9 <= nums[i] <= 10^9``。

自建示例
--------

最优方案可能同时修改两端元素：

.. code-block:: text

   输入：nums = [1,5,10,14,20]
   输出：4
   解释：修改 1、5、20 后可让所有值落入 [10,14]；四种保留区间中的最小跨度为 4。

元素数量不超过四时可以全部改成同一值：

.. code-block:: text

   输入：nums = [8,1,6,3]
   输出：0
   解释：保留任意一个元素，并用至多三次操作把其余元素改成相同值。