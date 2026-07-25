1710. Maximum Units on a Truck
==============================

题目信息
--------

:题号: 1710
:难度: Easy
:主题: 贪心、排序
:原题: `LeetCode 1710 <https://leetcode.com/problems/maximum-units-on-a-truck/>`_
:重点: 卡车容量按箱子数量限制，优先装单位数更多的箱子

题目重述
--------

每种箱子给出箱数和每箱单位数。卡车最多装 ``truckSize`` 个箱子，返回可装载的最大单位总数。

自建示例
--------

.. code-block:: text

   输入：boxTypes = [[1,3],[2,2]], truckSize = 2
   输出：5
   解释：装一个三单位箱和一个两单位箱。

.. code-block:: text

   输入：boxTypes = [[4,1]], truckSize = 1
   输出：1
   解释：只能装一个箱子。