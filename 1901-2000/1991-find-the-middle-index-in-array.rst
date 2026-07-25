1991. Find the Middle Index in Array
===================================

题目信息
--------

:题号: 1991
:难度: Easy
:主题: 前缀和、数组
:原题: `LeetCode 1991 <https://leetcode.com/problems/find-the-middle-index-in-array/>`_
:重点: 返回最左侧左右元素和相等的下标，不存在返回 -1

题目重述
--------

寻找最小下标 ``i``，使 ``i`` 左侧全部元素和等于右侧全部元素和。边界一侧为空时其和为 0。

自建示例
--------

.. code-block:: text

   输入：nums = [2,3,-1,8,4]
   输出：3
   解释：下标 3 左侧和为 4，右侧和也为 4。

.. code-block:: text

   输入：nums = [1,2,3]
   输出：-1
   解释：没有下标满足左右和相等。
