0452. Minimum Number of Arrows to Burst Balloons
================================================

题目信息
--------

:题号: 0452
:难度: Medium
:主题: 水平区间、垂直箭、闭区间命中、最少箭数
:原题: `LeetCode 0452 <https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/>`_
:重点: 气球横向范围是闭区间、箭的横坐标命中范围即可、同一箭可击破多个区间、端点命中有效

题目重述
--------

每个气球在水平轴上的直径范围由闭区间 ``[xstart, xend]`` 表示。可以从任意横坐标 ``x`` 垂直射出一支箭；当 ``xstart <= x <= xend`` 时，该箭会击破该气球。箭可无限向上飞行，因此同一支箭能够击破所有包含该横坐标的气球。

给定全部气球区间 ``points``，返回击破所有气球所需的最少箭数。``points.length`` 位于 ``[1, 10^5]``，每个区间满足 ``xstart < xend``，端点在 32 位有符号整数范围内。

自建示例
--------

端点处的一支箭命中两个气球：

.. code-block:: text

   输入：points = [[1,4], [2,3], [5,7], [7,9]]
   输出：2
   解释：在 x = 2 或 3 射一箭可击破前两个气球；在 x = 7 射一箭可同时击破后两个闭区间。

所有区间互不相交：

.. code-block:: text

   输入：points = [[0,1], [2,3], [4,5]]
   输出：3
   解释：不存在一个横坐标同时落入两个区间，因此每个气球都需要单独一箭。

按右端点贪心固定下一支箭
------------------------

将区间按右端点从小到大排序。处理当前区间时，如果它的左端点仍不大于上一支箭的位置，说明闭区间包含该箭，无需增加箭；若左端点已经大于箭的位置，当前区间与此前箭无法共同覆盖，必须在它的右端点重新射箭。

把新箭放在当前区间的最右端，能覆盖当前区间，并为后续区间留下最大的共同交集。每次新增箭都由当前最早结束、尚未被覆盖的区间强制产生，因此不会比其他选择使用更少的箭。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int findMinArrowShots(std::vector<std::vector<int>>& points) {
           std::sort(points.begin(), points.end(),
                     [](const auto& left, const auto& right) {
                         return left[1] < right[1];
                     });

           int arrows = 0;
           long long arrow = LLONG_MIN;
           for (const auto& interval : points) {
               if (arrows == 0 || interval[0] > arrow) {
                   ++arrows;
                   arrow = interval[1];
               }
           }
           return arrows;
       }
   };

代码分析
--------

闭区间端点有效，所以 ``interval[0] == arrow`` 时当前气球已经被命中，不能错误地再加一支箭。选择当前区间右端点作为箭位保持了对未来区间的最大兼容范围；排序耗时 ``O(n log n)``，扫描为 ``O(n)``，额外空间取决于排序实现，算法本身为 ``O(1)``。
