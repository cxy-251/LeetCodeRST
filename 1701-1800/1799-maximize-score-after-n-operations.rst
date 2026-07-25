1799. Maximize Score After N Operations
=======================================

题目信息
--------

:题号: 1799
:难度: Hard
:主题: 状态压缩动态规划、最大公约数
:原题: `LeetCode 1799 <https://leetcode.com/problems/maximize-score-after-n-operations/>`_
:重点: 第 ``i`` 次操作选择两个未使用元素，得分为 ``i * gcd(a,b)``

题目重述
--------

给定长度为 ``2n`` 的数组。执行 ``n`` 次操作，每次取走两个未使用元素并按操作序号计分。返回最大总得分。

自建示例
--------

.. code-block:: text

   输入：nums = [3,4,6,8]
   输出：11
   解释：第一次选 3、6 得 3 分，第二次选 4、8 得 8 分。

.. code-block:: text

   输入：nums = [1,2]
   输出：1
   解释：唯一操作得分为 gcd(1,2)=1。