1486. XOR Operation in an Array
===============================

题目信息
--------

:题号: 1486
:难度: Easy
:主题: 位运算、数组生成
:原题: `LeetCode 1486 <https://leetcode.com/problems/xor-operation-in-an-array/>`_
:重点: 构造 ``nums[i] = start + 2*i``，返回全部 ``n`` 个元素的按位异或结果

题目重述
--------

给定整数 ``n`` 和 ``start``。定义长度为 ``n`` 的数组，其中 ``nums[i] = start + 2 * i``。

请返回数组所有元素按位异或后的结果。

``1 <= n <= 1000``，``0 <= start <= 1000``。

自建示例
--------

按公式生成后依次异或：

.. code-block:: text

   输入：n = 3, start = 1
   输出：7
   解释：数组为 [1,3,5]，1 XOR 3 XOR 5 = 7。

数组只有一个元素时结果就是起始值：

.. code-block:: text

   输入：n = 1, start = 8
   输出：8
   解释：无需与其他元素异或。