1502. Can Make Arithmetic Progression From Sequence
===================================================

题目信息
--------

:题号: 1502
:难度: Easy
:主题: 数组、排序、等差数列
:原题: `LeetCode 1502 <https://leetcode.com/problems/can-make-arithmetic-progression-from-sequence/>`_
:重点: 可以任意重排数组；判断重排后相邻元素差是否全部相同

题目重述
--------

给定整数数组 ``arr``。可以按任意顺序重新排列全部元素。

若存在一种排列，使任意两个相邻元素之差都等于同一个整数，则返回 ``true``；否则返回 ``false``。重复值允许出现，此时公差可以为 ``0``。

``2 <= arr.length <= 1000``，``-10^6 <= arr[i] <= 10^6``。

自建示例
--------

乱序元素可以重排为等差数列：

.. code-block:: text

   输入：arr = [7,3,5,1]
   输出：true
   解释：重排为 [1,3,5,7] 后，相邻差都为 2。

相邻差无法统一时失败：

.. code-block:: text

   输入：arr = [1,2,4]
   输出：false
   解释：无论怎样重排，三个数都不能形成公差固定的长度三数列。