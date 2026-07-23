0220. Contains Duplicate III
============================

题目信息
--------

:题号: 0220
:难度: Hard
:主题: 数组、滑动窗口、有序集合、桶
:原题: `LeetCode 0220 <https://leetcode.com/problems/contains-duplicate-iii/>`_
:重点: 不同下标、下标距离、数值距离、宽整数差值

题目重述
--------

给定整数数组 ``nums``，以及非负整数 ``indexDiff`` 和 ``valueDiff``，判断是否存在两个不同下标 ``i``、``j``，同时满足 ``|i - j| <= indexDiff`` 和 ``|nums[i] - nums[j]| <= valueDiff``。存在时返回 ``true``，否则返回 ``false``。

数组元素可能接近 32 位有符号整数边界，因此数值距离应按数学整数差理解，不能让固定宽度减法溢出。函数只返回判断结果，不修改输入数组。

自建示例
--------

.. code-block:: text

   输入：nums = [1,9,4], indexDiff = 2, valueDiff = 3
   输出：true
   解释：下标 0 和 2 的距离为 2，对应数值 1 和 4 的距离为 3，两项条件都满足。

.. code-block:: text

   输入：nums = [-10,2,15], indexDiff = 1, valueDiff = 5
   输出：false
   解释：相邻元素的数值距离分别为 12 和 13；首尾元素又超过允许的下标距离，因此不存在合法下标对。
