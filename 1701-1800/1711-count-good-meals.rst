1711. Count Good Meals
======================

题目信息
--------

:题号: 1711
:难度: Medium
:主题: 哈希表、两数之和、计数
:原题: `LeetCode 1711 <https://leetcode.com/problems/count-good-meals/>`_
:重点: 两道不同餐品美味值之和必须是二的幂，按下标对计数

题目重述
--------

给定 ``deliciousness``。统计 ``i < j`` 且两项之和为二的幂的下标对数量，结果对 ``10^9+7`` 取模。

自建示例
--------

.. code-block:: text

   输入：deliciousness = [1,3,5,7]
   输出：3
   解释：有效对为 (1,3)、(1,7)、(3,5)。

.. code-block:: text

   输入：deliciousness = [1,1,1]
   输出：3
   解释：任意两项之和均为 2。