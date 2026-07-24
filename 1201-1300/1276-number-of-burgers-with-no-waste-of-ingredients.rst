1276. Number of Burgers with No Waste of Ingredients
====================================================

题目信息
--------

:题号: 1276
:难度: Medium
:主题: 方程、整数解、配料计数
:原题: `LeetCode 1276 <https://leetcode.com/problems/number-of-burgers-with-no-waste-of-ingredients/>`_
:重点: 巨无霸汉堡使用四片番茄和一片奶酪，小汉堡使用两片番茄和一片奶酪；必须用完全部配料

题目重述
--------

制作一个巨无霸汉堡需要 ``4`` 片番茄和 ``1`` 片奶酪，制作一个小汉堡需要 ``2`` 片番茄和 ``1`` 片奶酪。

给定 ``tomatoSlices`` 和 ``cheeseSlices``，请找到非负整数数量的两种汉堡，使所有番茄片和奶酪片都恰好用完。若存在，返回 ``[巨无霸数量, 小汉堡数量]``；否则返回空数组。

``0 <= tomatoSlices, cheeseSlices <= 10^7``。

自建示例
--------

两种汉堡可以共同用完配料：

.. code-block:: text

   输入：tomatoSlices = 14, cheeseSlices = 5
   输出：[2,3]
   解释：两个巨无霸使用 8 片番茄，三个小汉堡使用 6 片番茄，共使用 14 片番茄和 5 片奶酪。

番茄片数量为奇数时无解：

.. code-block:: text

   输入：tomatoSlices = 5, cheeseSlices = 2
   输出：[]
   解释：两种汉堡使用的番茄片数量都为偶数，不可能恰好使用五片。