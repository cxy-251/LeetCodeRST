1611. Minimum One Bit Operations to Make Integers Zero
=====================================================

题目信息
--------

:题号: 1611
:难度: Hard
:主题: 位运算、格雷码、递归
:原题: `LeetCode 1611 <https://leetcode.com/problems/minimum-one-bit-operations-to-make-integers-zero/>`_
:重点: 按题目限定条件翻转单个二进制位，求把 ``n`` 变为零的最少次数

题目重述
--------

可以翻转最低位；也可以翻转第 ``i`` 位，但此时第 ``i-1`` 位必须为 ``1``，且更低各位必须为 ``0``。返回把非负整数 ``n`` 变为 ``0`` 的最少操作数。

``0 <= n <= 10^9``。

自建示例
--------

.. code-block:: text

   输入：n = 6
   输出：4
   解释：按合法翻转规则，110 可以在四步内变为 000，且不存在更短序列。

.. code-block:: text

   输入：n = 0
   输出：0
   解释：初始值已经为零。