1281. Subtract the Product and Sum of Digits of an Integer
==========================================================

题目信息
--------

:题号: 1281
:难度: Easy
:主题: 整数、数位处理
:原题: `LeetCode 1281 <https://leetcode.com/problems/subtract-the-product-and-sum-of-digits-of-an-integer/>`_
:重点: 分别计算十进制各位数字的乘积与总和，返回乘积减总和

题目重述
--------

给定正整数 ``n``。把它写成十进制形式，计算所有数位数字的乘积 ``product`` 和总和 ``sum``。

请返回 ``product - sum``。

``1 <= n <= 10^5``。

自建示例
--------

所有数位都参与乘积和求和：

.. code-block:: text

   输入：n = 234
   输出：15
   解释：数位乘积为 2 * 3 * 4 = 24，数位和为 2 + 3 + 4 = 9，二者之差为 15。

包含零时数位乘积为零：

.. code-block:: text

   输入：n = 10
   输出：-1
   解释：乘积为 1 * 0 = 0，数位和为 1，因此结果为 -1。