1095. Find in Mountain Array
============================

题目信息
--------

:题号: 1095
:难度: Hard
:主题: 交互接口、山脉数组、最小下标查找
:原题: `LeetCode 1095 <https://leetcode.com/problems/find-in-mountain-array/>`_
:重点: 只能通过 ``MountainArray.get`` 和 ``length`` 访问数组，``get`` 调用不得超过 100 次；目标可能在峰值两侧出现，需返回最小下标

题目重述
--------

给定整数 ``target`` 和 ``MountainArray`` 接口。底层数组长度至少为 ``3``，存在峰值下标 ``p``，使数组从下标 ``0`` 到 ``p`` 严格递增，并从 ``p`` 到末尾严格递减。

只能调用 ``mountainArr.get(index)`` 获取指定元素，并调用 ``mountainArr.length()`` 获取长度，不能直接读取数组。请返回值等于 ``target`` 的最小下标；若不存在则返回 ``-1``。判题限制 ``get`` 的调用次数不超过 ``100``。

数组长度在 ``[3, 10^4]`` 范围内，``0 <= target, mountainArr.get(i) <= 10^9``。

自建示例
--------

目标在峰值两侧都出现时返回左侧下标：

.. code-block:: text

   输入：mountainArr = [1,4,7,9,6,4,2], target = 4
   输出：1
   解释：值 4 出现在下标 1 和 5；题目要求返回较小的下标 1。
