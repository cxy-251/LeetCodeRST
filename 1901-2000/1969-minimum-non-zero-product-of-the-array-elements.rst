1969. Minimum Non-Zero Product of the Array Elements
===================================================

题目信息
--------

:题号: 1969
:难度: Medium
:主题: 数学、快速幂、贪心
:原题: `LeetCode 1969 <https://leetcode.com/problems/minimum-non-zero-product-of-the-array-elements/>`_
:重点: 对 ``1`` 到 ``2^p - 1`` 的数组执行位交换，最小化非零乘积

题目重述
--------

数组包含 ``1`` 到 ``2^p - 1``。允许在任意两个元素之间交换同一位上的二进制值，要求所有元素保持非零。返回能得到的最小乘积并取模。

自建示例
--------

.. code-block:: text

   输入：p = 1
   输出：1
   解释：数组只有元素 1。

.. code-block:: text

   输入：p = 2
   输出：6
   解释：数组 [1,2,3] 的最小非零乘积为 1 × 2 × 3。
