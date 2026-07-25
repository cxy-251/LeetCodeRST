1646. Get Maximum in Generated Array
====================================

题目信息
--------

:题号: 1646
:难度: Easy
:主题: 数组、递推
:原题: `LeetCode 1646 <https://leetcode.com/problems/get-maximum-in-generated-array/>`_
:重点: 按固定偶数和奇数下标递推生成 ``nums[0..n]``，返回最大值

题目重述
--------

根据题目规则生成长度 ``n+1`` 的数组：``nums[0]=0``，若存在则 ``nums[1]=1``；偶数下标继承一半下标值，奇数下标为相邻两个递推值之和。返回数组最大值。

自建示例
--------

.. code-block:: text

   输入：n = 7
   输出：3
   解释：生成数组为 [0,1,1,2,1,3,2,3]。

.. code-block:: text

   输入：n = 0
   输出：0
   解释：数组仅含 nums[0]。