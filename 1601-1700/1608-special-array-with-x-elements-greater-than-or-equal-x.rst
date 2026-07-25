1608. Special Array With X Elements Greater Than or Equal X
===========================================================

题目信息
--------

:题号: 1608
:难度: Easy
:主题: 数组、排序、计数
:原题: `LeetCode 1608 <https://leetcode.com/problems/special-array-with-x-elements-greater-than-or-equal-x/>`_
:重点: 寻找恰有 ``x`` 个元素大于等于 ``x`` 的非负整数；答案至多一个

题目重述
--------

给定非负整数数组 ``nums``。若存在非负整数 ``x``，使数组中恰好有 ``x`` 个元素满足 ``nums[i] >= x``，返回 ``x``；不存在时返回 ``-1``。

``x`` 不要求出现在数组中。

自建示例
--------

.. code-block:: text

   输入：nums = [0,4,4]
   输出：2
   解释：恰有两个元素大于等于 2。

.. code-block:: text

   输入：nums = [0,0]
   输出：-1
   解释：x=0 时应有零个元素大于等于 0，但实际有两个；其他 x 也不满足。