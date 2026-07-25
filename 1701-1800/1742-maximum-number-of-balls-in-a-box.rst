1742. Maximum Number of Balls in a Box
======================================

题目信息
--------

:题号: 1742
:难度: Easy
:主题: 数位和、计数
:原题: `LeetCode 1742 <https://leetcode.com/problems/maximum-number-of-balls-in-a-box/>`_
:重点: 编号球放入编号等于其十进制数位和的盒子

题目重述
--------

对闭区间 ``[lowLimit, highLimit]`` 中每个球号，计算数位和并放入对应盒子。返回装球数量最多的盒子中的球数。

自建示例
--------

.. code-block:: text

   输入：lowLimit = 1, highLimit = 10
   输出：2
   解释：球 1 和 10 的数位和都为 1，其余盒子至多一个球。

.. code-block:: text

   输入：lowLimit = 5, highLimit = 5
   输出：1
   解释：只有一个球。