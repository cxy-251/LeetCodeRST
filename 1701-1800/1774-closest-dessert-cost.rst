1774. Closest Dessert Cost
==========================

题目信息
--------

:题号: 1774
:难度: Medium
:主题: 回溯、子集和
:原题: `LeetCode 1774 <https://leetcode.com/problems/closest-dessert-cost/>`_
:重点: 必须选择一种基料，每种配料可选零份、一份或两份；距离并列取较小成本

题目重述
--------

组合一份甜点，使总成本最接近 ``target``。返回最接近成本；若两个成本距离相同，返回较小者。

自建示例
--------

.. code-block:: text

   输入：baseCosts = [3,10], toppingCosts = [2,5], target = 9
   输出：8
   解释：成本 8 与 10 都相差 1，按规则选择较小的 8。

.. code-block:: text

   输入：baseCosts = [7], toppingCosts = [], target = 5
   输出：7
   解释：没有配料，只能选择唯一基料。