1912. Design Movie Rental System
================================

题目信息
--------

:题号: 1912
:难度: Hard
:主题: 设计、有序集合、哈希表
:原题: `LeetCode 1912 <https://leetcode.com/problems/design-movie-rental-system/>`_
:重点: 搜索与报告都按价格、商店编号排序并最多返回五项

题目重述
--------

实现电影租赁系统，支持搜索未出租电影的商店、出租、归还，以及报告当前最便宜的已出租电影。排序规则均先按价格，再按商店编号，报告还需再按电影编号。

自建示例
--------

.. code-block:: text

   输入：entries = [[0,1,5],[1,1,4],[0,2,7]]；search(1)；rent(1,1)；search(1)；report()
   输出：[null,[1,0],null,[0],[[1,1]]]
   解释：1 号商店价格更低；出租后搜索只剩商店 0，报告包含已出租的 [1,1]。

.. code-block:: text

   输入：entries = [[0,3,6]]；search(2)
   输出：[null,[]]
   解释：系统中没有电影 2。
