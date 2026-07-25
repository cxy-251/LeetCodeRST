1887. Reduction Operations to Make the Array Elements Equal
===========================================================

题目信息
--------

:题号: 1887
:难度: Medium
:主题: 排序、计数
:原题: `LeetCode 1887 <https://leetcode.com/problems/reduction-operations-to-make-the-array-elements-equal/>`_
:重点: 每次把一个当前最大元素降为数组中的下一个较小值

题目重述
--------

每次选择一个最大元素，将它改成严格小于它的最大现有数组值。返回使所有元素相等所需的操作次数。

自建示例
--------

.. code-block:: text

   输入：nums = [5,1,3]
   输出：3
   解释：5 先降为 3，随后两个 3 分别降为 1。

.. code-block:: text

   输入：nums = [2,2]
   输出：0
   解释：所有元素已经相等。
