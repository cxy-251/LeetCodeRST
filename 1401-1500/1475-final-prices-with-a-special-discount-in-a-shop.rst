1475. Final Prices With a Special Discount in a Shop
====================================================

题目信息
--------

:题号: 1475
:难度: Easy
:主题: 数组、单调栈、下一个较小元素
:原题: `LeetCode 1475 <https://leetcode.com/problems/final-prices-with-a-special-discount-in-a-shop/>`_
:重点: 第 ``i`` 件商品使用右侧第一个价格不高于 ``prices[i]`` 的商品价格作为折扣；不存在则原价购买

题目重述
--------

给定商品价格数组 ``prices``。购买第 ``i`` 件商品时，寻找最小下标 ``j > i``，满足 ``prices[j] <= prices[i]``。

若找到，最终价格为 ``prices[i] - prices[j]``；否则最终价格保持不变。请返回所有商品的最终价格数组。

``1 <= prices.length <= 500``，``1 <= prices[i] <= 1000``。

自建示例
--------

每件商品使用右侧第一个满足条件的价格：

.. code-block:: text

   输入：prices = [5,3,4,2]
   输出：[2,1,2,2]
   解释：前三件商品的首个可用折扣分别为 3、2、2，最后一件没有右侧商品。

右侧价格都更高时没有折扣：

.. code-block:: text

   输入：prices = [1,2]
   输出：[1,2]
   解释：价格 1 的右侧没有不高于它的商品，末件也无折扣。