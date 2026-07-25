1577. Number of Ways Where Square of Number Is Equal to Product of Two Numbers
=============================================================================

题目信息
--------

:题号: 1577
:难度: Medium
:主题: 数组、哈希表、乘积计数
:原题: `LeetCode 1577 <https://leetcode.com/problems/number-of-ways-where-square-of-number-is-equal-to-product-of-two-numbers/>`_
:重点: 统计两类三元组：一个数组中的单个元素平方等于另一个数组中一对不同下标元素的乘积

题目重述
--------

给定两个正整数数组 ``nums1`` 和 ``nums2``。第一类三元组选择 ``nums1`` 的一个下标与 ``nums2`` 中两个满足 ``j < k`` 的下标，使单个元素平方等于这两个元素乘积；第二类交换两个数组的角色。

请返回两类合法三元组数量之和。

两个数组长度均在 ``1`` 到 ``1000`` 之间，元素位于 ``1`` 到 ``10^5``。

自建示例
--------

只有一个方向产生合法三元组：

.. code-block:: text

   输入：nums1 = [2], nums2 = [1,4]
   输出：1
   解释：2^2 = 1*4；nums1 中没有两个不同下标可供反向配对。

重复值按不同下标组合分别计数：

.. code-block:: text

   输入：nums1 = [1,1], nums2 = [1,1]
   输出：4
   解释：每个方向有两个单元素选择和一个元素对，共贡献两种，合计四种。