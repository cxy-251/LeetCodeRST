1333. Filter Restaurants by Vegan-Friendly, Price and Distance
==============================================================

题目信息
--------

:题号: 1333
:难度: Medium
:主题: 数组、筛选、排序
:原题: `LeetCode 1333 <https://leetcode.com/problems/filter-restaurants-by-vegan-friendly-price-and-distance/>`_
:重点: 餐厅记录依次为编号、评分、纯素标志、价格、距离；过滤后按评分降序、编号降序返回编号

题目重述
--------

每家餐厅记录为 ``[id, rating, veganFriendly, price, distance]``。只保留价格不超过 ``maxPrice``、距离不超过 ``maxDistance`` 的餐厅；若参数 ``veganFriendly == 1``，还必须要求餐厅纯素标志为 ``1``。

把符合条件的餐厅按评分从高到低排序，评分相同时按编号从大到小排序，返回编号数组。

餐厅数不超过 ``10^4``，编号互不相同。

自建示例
--------

纯素条件会排除其他合格餐厅：

.. code-block:: text

   输入：restaurants = [[1,5,1,40,5],[2,5,1,30,6],[3,4,0,20,2]], veganFriendly = 1, maxPrice = 50, maxDistance = 5
   输出：[1]
   解释：编号 2 距离超限，编号 3 不满足纯素条件。

评分相同时编号较大者在前：

.. code-block:: text

   输入：同上，veganFriendly = 0, maxPrice = 40, maxDistance = 6
   输出：[2,1,3]
   解释：三家都合格；编号 1 和 2 评分相同，因此编号 2 在前。