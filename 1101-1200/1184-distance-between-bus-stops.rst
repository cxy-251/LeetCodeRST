1184. Distance Between Bus Stops
================================

题目信息
--------

:题号: 1184
:难度: Easy
:主题: 环形数组、路径距离、前缀和
:原题: `LeetCode 1184 <https://leetcode.com/problems/distance-between-bus-stops/>`_
:重点: 公交站构成环，``distance[i]`` 是站点 ``i`` 到下一站的距离；比较顺时针与逆时针两条路径

题目重述
--------

环形线路上有 ``n`` 个公交站，编号为 ``0`` 到 ``n - 1``。``distance[i]`` 表示从站点 ``i`` 顺时针前往站点 ``(i + 1) mod n`` 的距离。

给定起点 ``start`` 和终点 ``destination``，可以沿环的任一方向行驶。请返回两站之间的最短行驶距离。

``2 <= distance.length <= 10^4``，``1 <= distance[i] <= 10^4``，起点与终点编号合法。

自建示例
--------

逆时针路径更短：

.. code-block:: text

   输入：distance = [2,5,3,4], start = 1, destination = 3
   输出：6
   解释：顺时针距离为 5 + 3 = 8；另一方向距离为 4 + 2 = 6，因此返回 6。

两个站点组成的环：

.. code-block:: text

   输入：distance = [7,2], start = 0, destination = 1
   输出：2
   解释：两个方向的距离分别为 7 和 2，选择较短方向。