1780. Check if Number is a Sum of Powers of Three
=================================================

题目信息
--------

:题号: 1780
:难度: Medium
:主题: 数学、三进制
:原题: `LeetCode 1780 <https://leetcode.com/problems/check-if-number-is-a-sum-of-powers-of-three/>`_
:重点: 每个三的幂最多使用一次，等价于三进制表示中不含数字 2

题目重述
--------

判断正整数 ``n`` 能否表示为若干个不同三的幂之和。

自建示例
--------

.. code-block:: text

   输入：n = 12
   输出：true
   解释：12 = 9 + 3。

.. code-block:: text

   输入：n = 2
   输出：false
   解释：需要重复使用 1 才能得到 2，不满足幂互不相同。