1418. Display Table of Food Orders in a Restaurant
==================================================

题目信息
--------

:题号: 1418
:难度: Medium
:主题: 哈希表、排序、二维统计
:原题: `LeetCode 1418 <https://leetcode.com/problems/display-table-of-food-orders-in-a-restaurant/>`_
:重点: 按桌号汇总各食物数量；列按食物名字典序、行按桌号数值升序排列，首行首列为 ``Table``

题目重述
--------

给定订单数组 ``orders``，每条订单为 ``[customerName, tableNumber, foodItem]``。顾客姓名只用于描述订单，不出现在结果中。

构造展示表：首行是 ``"Table"`` 加所有不同食物名，食物名按字典序排列；之后每行对应一张桌子，桌号按数值升序排列，并以字符串形式记录该桌每种食物的订单数量。

``1 <= orders.length <= 5 * 10^4``，桌号位于 ``[1,500]``。

自建示例
--------

同一桌的不同顾客订单需要汇总：

.. code-block:: text

   输入：orders = [["A","2","Tea"],["B","1","Cake"],["C","2","Cake"]]
   输出：[["Table","Cake","Tea"],["1","1","0"],["2","1","1"]]
   解释：食物列按 Cake、Tea 排列，桌号按 1、2 排列。

只有一条订单时形成单行统计：

.. code-block:: text

   输入：orders = [["Lee","9","Soup"]]
   输出：[["Table","Soup"],["9","1"]]
   解释：唯一桌号与唯一食物各形成一行和一列。