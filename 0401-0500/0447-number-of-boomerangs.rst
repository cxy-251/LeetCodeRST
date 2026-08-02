0447. Number of Boomerangs
==========================

题目信息
--------

:题号: 0447
:难度: Medium
:主题: 平面点、相等距离、有序三元组、数量统计
:原题: `LeetCode 0447 <https://leetcode.com/problems/number-of-boomerangs/>`_
:重点: 三个下标必须互不相同、以第一个点为中心、后两个点顺序不同算不同答案、比较欧氏距离

题目重述
--------

给定平面上互不相同的点数组 ``points``。回旋镖定义为有序三元组 ``(i, j, k)``，其中三个下标互不相同，并且点 ``i`` 到点 ``j`` 的欧氏距离等于点 ``i`` 到点 ``k`` 的距离。返回所有回旋镖的数量。

``points.length`` 位于 ``[1, 500]``，坐标位于 ``[-10^4, 10^4]``。三元组是有序的，所以固定中心 ``i`` 后，交换 ``j`` 和 ``k`` 会得到另一个答案。函数只返回数量，不需要列出三元组。

自建示例
--------

三个共线且等距的点：

.. code-block:: text

   输入：points = [[-1,0], [0,0], [1,0]]
   输出：2
   解释：以 [0,0] 为中心时，两侧点距离都为 1；两个有序三元组分别交换左右点的顺序，因此计数为 2。

没有等距点对：

.. code-block:: text

   输入：points = [[0,0], [1,0], [0,2]]
   输出：0
   解释：对任何一个中心点，另外两点到它的距离都不相等。

固定中心统计等距点对
--------------------

枚举中心点 ``i``，计算所有其他点到它的平方距离。若某个距离已经出现 ``c`` 次，新遇到的同距离点可以和此前的 ``c`` 个点组成 ``c`` 个有序选择；由于新点可以放在有序三元组的第二或第三个位置，这一轮贡献 ``2c``。

使用平方距离即可避免浮点数开方和精度问题。每个中心都重新建立频次表，处理完一个中心后清空其局部统计，避免把不同中心的距离混在一起。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int numberOfBoomerangs(std::vector<std::vector<int>>& points) {
           int answer = 0;
           for (int i = 0; i < static_cast<int>(points.size()); ++i) {
               std::unordered_map<long long, int> frequency;
               for (int j = 0; j < static_cast<int>(points.size()); ++j) {
                   if (i == j) continue;
                   long long dx = points[i][0] - points[j][0];
                   long long dy = points[i][1] - points[j][1];
                   long long distance = dx * dx + dy * dy;
                   answer += 2 * frequency[distance];
                   ++frequency[distance];
               }
           }
           return answer;
       }
   };

代码分析
--------

对固定中心，频次为 ``c`` 的距离最终会贡献 ``c(c-1)`` 个有序点对；在线累加 ``2c`` 正好实现同样的组合数，并区分交换后的两种顺序。每个中心检查其余所有点一次，时间复杂度为 ``O(n^2)``，单个频次表占用 ``O(n)`` 额外空间。
