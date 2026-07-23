0220. Contains Duplicate III
============================

题目信息
--------

:题号: 0220
:难度: Hard
:主题: 数组、滑动窗口、有序集合、桶
:原题: `LeetCode 0220 <https://leetcode.com/problems/contains-duplicate-iii/>`_
:重点: 不同下标、下标距离与数值距离同时受限、差值溢出、零阈值

题目重述
--------

给定整数数组 ``nums``、非负整数 ``indexDiff`` 和 ``valueDiff``，判断是否存在两个不同的零基下标 ``i``、``j``，使 ``|i-j| <= indexDiff``，并且 ``|nums[i]-nums[j]| <= valueDiff``。两个条件必须由同一对下标同时满足。

``nums`` 的长度范围为 ``[1, 10^5]``，元素位于 ``[-10^9, 10^9]``；``indexDiff`` 位于 ``[0, 10^5]``，``valueDiff`` 位于 ``[0, 10^9]``。数值相减时可能超出较窄整数类型的安全范围。函数返回布尔值，不修改输入数组。

自建示例
--------

两个限制同时成立：

.. code-block:: text

   输入：nums = [12, 4, 10], indexDiff = 2, valueDiff = 2
   输出：true
   解释：下标 0 和 2 的距离为 2，对应数值 12 和 10 的差为 2，均未超过给定上限。

只有数值条件成立：

.. code-block:: text

   输入：nums = [7, 1, 8], indexDiff = 1, valueDiff = 1
   输出：false
   解释：7 与 8 的数值差为 1，但它们的下标距离为 2；相邻位置之间又没有满足数值差限制的组合。
