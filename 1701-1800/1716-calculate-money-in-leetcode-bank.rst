1716. Calculate Money in Leetcode Bank
======================================

题目信息
--------

:题号: 1716
:难度: Easy
:主题: 数学、模拟
:原题: `LeetCode 1716 <https://leetcode.com/problems/calculate-money-in-leetcode-bank/>`_
:重点: 每周一比上周一多存一美元，同一周每天比前一天多存一美元

题目重述
--------

第一周周一存 ``$1``，随后每天增加 ``$1``；下一周周一从 ``$2`` 开始并重复规律。返回前 ``n`` 天总存款。

自建示例
--------

.. code-block:: text

   输入：n = 10
   输出：37
   解释：第一周存 28，第二周前三天存 2+3+4=9。

.. code-block:: text

   输入：n = 1
   输出：1
   解释：第一天存一美元。