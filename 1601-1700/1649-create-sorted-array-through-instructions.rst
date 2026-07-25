1649. Create Sorted Array through Instructions
==============================================

题目信息
--------

:题号: 1649
:难度: Hard
:主题: 树状数组、顺序统计
:原题: `LeetCode 1649 <https://leetcode.com/problems/create-sorted-array-through-instructions/>`_
:重点: 插入代价为当前数组中严格小于和严格大于该值的数量较小者

题目重述
--------

按顺序把 ``instructions`` 中的数插入一个有序数组。每次插入代价是当前已有元素中严格小于该值的数量与严格大于该值的数量的较小值。返回总代价模 ``10^9+7``。

自建示例
--------

.. code-block:: text

   输入：instructions = [1,5,2,6]
   输出：1
   解释：只有插入 2 时产生代价 1。

.. code-block:: text

   输入：instructions = [3,3,3]
   输出：0
   解释：相等元素既不严格小于也不严格大于。