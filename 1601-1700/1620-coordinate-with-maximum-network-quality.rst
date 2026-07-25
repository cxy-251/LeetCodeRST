1620. Coordinate With Maximum Network Quality
==============================================

题目信息
--------

:题号: 1620
:难度: Medium
:主题: 枚举、几何、信号质量
:原题: `LeetCode 1620 <https://leetcode.com/problems/coordinate-with-maximum-network-quality/>`_
:重点: 半径内信号贡献为 ``floor(q/(1+distance))``；总质量并列时返回字典序最小坐标

题目重述
--------

每座信号塔给出整数坐标和质量。对任意整数坐标，统计距离不超过 ``radius`` 的塔的信号贡献之和。返回总网络质量最大的整数坐标；若并列，优先较小的 ``x``，再优先较小的 ``y``。

自建示例
--------

.. code-block:: text

   输入：towers = [[0,0,4],[2,0,4]], radius = 2
   输出：[0,0]
   解释：两个塔坐标的总质量并列，字典序更小的 [0,0] 被选中。

.. code-block:: text

   输入：towers = [[5,5,1]], radius = 0
   输出：[5,5]
   解释：只有塔所在坐标能获得质量 1。