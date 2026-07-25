1770. Maximum Score from Performing Multiplication Operations
=============================================================

题目信息
--------

:题号: 1770
:难度: Hard
:主题: 动态规划、区间选择
:原题: `LeetCode 1770 <https://leetcode.com/problems/maximum-score-from-performing-multiplication-operations/>`_
:重点: 每轮从 ``nums`` 左端或右端取一个数，与对应乘数相乘计分

题目重述
--------

按顺序使用 ``multipliers``。第 ``i`` 轮从当前数组一端移除一个数，获得其与 ``multipliers[i]`` 的乘积。返回全部操作后的最大得分。

自建示例
--------

.. code-block:: text

   输入：nums = [1,2,3], multipliers = [3,2,1]
   输出：14
   解释：依次取右端 3、右端 2、剩余 1，得分 9+4+1。

.. code-block:: text

   输入：nums = [-5], multipliers = [-2]
   输出：10
   解释：唯一乘积为 10。