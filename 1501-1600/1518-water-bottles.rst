1518. Water Bottles
===================

题目信息
--------

:题号: 1518
:难度: Easy
:主题: 模拟、整除、循环
:原题: `LeetCode 1518 <https://leetcode.com/problems/water-bottles/>`_
:重点: 喝完一瓶得到一个空瓶；每 ``numExchange`` 个空瓶可换一瓶满水，交换可反复进行

题目重述
--------

初始有 ``numBottles`` 瓶装满水的瓶子。每喝完一瓶会留下一个空瓶；每次可以用 ``numExchange`` 个空瓶兑换一瓶新的满水。

可以按任意顺序喝水和兑换，并重复兑换直到无法继续。请返回最终能够喝到的总瓶数。

``1 <= numBottles <= 100``，``2 <= numExchange <= 100``。

自建示例
--------

兑换得到的新瓶子还能继续产生空瓶：

.. code-block:: text

   输入：numBottles = 5, numExchange = 2
   输出：9
   解释：先喝 5 瓶，之后依次兑换并喝 2、1、1 瓶，总计 9 瓶。

初始瓶数不足一次兑换时只能喝原有瓶子：

.. code-block:: text

   输入：numBottles = 1, numExchange = 2
   输出：1
   解释：喝完后只有一个空瓶，无法兑换。