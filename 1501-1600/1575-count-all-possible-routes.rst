1575. Count All Possible Routes
===============================

题目信息
--------

:题号: 1575
:难度: Hard
:主题: 动态规划、记忆化搜索、路径计数
:原题: `LeetCode 1575 <https://leetcode.com/problems/count-all-possible-routes/>`_
:重点: 城市位置互不相同，移动成本为坐标差绝对值；允许重复访问城市，并统计燃料不超限且最终停在终点的所有路线

题目重述
--------

给定互不相同的位置数组 ``locations``、起点下标 ``start``、终点下标 ``finish`` 和燃料 ``fuel``。从城市 ``i`` 移动到不同城市 ``j`` 会消耗 ``|locations[i]-locations[j]|`` 单位燃料。

可以访问城市任意多次，只要总消耗不超过燃料。请统计最终停在 ``finish`` 的不同路线数量；在终点继续移动后再返回也算不同路线。结果对 ``10^9 + 7`` 取模。

``2 <= locations.length <= 100``，``0 <= fuel <= 200``。

自建示例
--------

燃料只够一次直接移动时只有一条路线：

.. code-block:: text

   输入：locations = [0,2], start = 0, finish = 1, fuel = 2
   输出：1
   解释：唯一可行路线是从位置 0 直接移动到位置 2。

起点就是终点且没有燃料时仍有空路线：

.. code-block:: text

   输入：locations = [1,5], start = 0, finish = 0, fuel = 0
   输出：1
   解释：不进行任何移动即可在终点结束。