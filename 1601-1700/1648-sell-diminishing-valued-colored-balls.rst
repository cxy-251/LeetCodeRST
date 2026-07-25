1648. Sell Diminishing-Valued Colored Balls
===========================================

题目信息
--------

:题号: 1648
:难度: Medium
:主题: 贪心、排序、等差求和
:原题: `LeetCode 1648 <https://leetcode.com/problems/sell-diminishing-valued-colored-balls/>`_
:重点: 某颜色球当前价值等于该颜色剩余数量，每卖一个后价值减一

题目重述
--------

给定各颜色库存和订单数。每次卖出一颗球并获得该颜色当前库存数量作为收益，选择销售顺序最大化总收益。结果对 ``10^9+7`` 取模。

自建示例
--------

.. code-block:: text

   输入：inventory = [2,3], orders = 3
   输出：7
   解释：依次卖出价值 3、2、2 的球。

.. code-block:: text

   输入：inventory = [1], orders = 1
   输出：1
   解释：唯一球价值为 1。