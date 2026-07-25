1814. Count Nice Pairs in an Array
==================================

题目信息
--------

:题号: 1814
:难度: Medium
:主题: 哈希表、数学、计数
:原题: `LeetCode 1814 <https://leetcode.com/problems/count-nice-pairs-in-an-array/>`_
:重点: 好数对等价于 ``nums[i] - rev(nums[i])`` 相等

题目重述
--------

统计满足 ``nums[i] + rev(nums[j]) = nums[j] + rev(nums[i])`` 的下标对 ``i < j``，结果对 ``10^9 + 7`` 取模。

自建示例
--------

.. code-block:: text

   输入：nums = [13,31,20,2]
   输出：1
   解释：31 - 13 与 20 - 2 都等于 18，因此这两个元素构成好数对。

.. code-block:: text

   输入：nums = [5,5,5]
   输出：3
   解释：三个下标两两组合均满足条件。
