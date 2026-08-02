0497. Random Point in Non-overlapping Rectangles
================================================

题目信息
--------

:题号: 0497
:难度: Medium
:主题: 不重叠矩形、整数坐标点、随机抽样、全局均匀
:原题: `LeetCode 0497 <https://leetcode.com/problems/random-point-in-non-overlapping-rectangles/>`_
:重点: 矩形边界包含在内、只返回整数点、所有被覆盖整数点概率相同、矩形选择概率取决于点数

题目重述
--------

实现 ``Solution`` 类。构造函数接收若干互不重叠的轴对齐矩形 ``rects``，每个矩形表示为 ``[a, b, x, y]``，其中 ``(a,b)`` 是左下角，``(x,y)`` 是右上角，并且四条边都属于矩形。

``pick()`` 每次随机返回一个被任意矩形覆盖的整数坐标点 ``[px, py]``。所有可选整数点必须具有完全相同的返回概率；因此包含更多整数点的矩形应按点数获得更高的整体概率，而不是让每个矩形等概率。

``rects.length`` 位于 ``[1, 100]``，坐标位于 ``[-10^9, 10^9]``，且 ``a <= x``、``b <= y``。调用 ``pick`` 的次数不超过 ``10^4``。具体单次返回值不可预先确定。

自建示例
--------

两个矩形共覆盖四个整数点：

.. code-block:: text

   构造：rects = [[1,1,1,2], [3,0,4,0]]
   可选点：(1,1)、(1,2)、(3,0)、(4,0)
   调用：pick()
   输出：上述四点中的任意一个
   解释：四个整数点的理论概率都应为 1/4。

单点矩形：

.. code-block:: text

   构造：rects = [[-2,5,-2,5]]
   调用：pick()
   输出：[-2,5]
   解释：矩形只覆盖一个整数坐标点，因此每次调用都必须返回该点。

按整数点数量选择矩形
--------------------

闭区间矩形 ``[a,b,x,y]`` 覆盖的整数点数为 ``(x-a+1)(y-b+1)``。先计算每个矩形的前缀面积（整数点数量），在所有点的总范围内均匀抽取一个序号；前缀和定位到的矩形，其被选中的概率正比于覆盖点数，正好保证全体整数点等概率。

进入矩形后，再分别在横坐标和纵坐标的闭区间内均匀抽取一个整数即可。面积和使用 ``long long``，不能用几何连续面积或让每个矩形等概率替代整数点数量。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       std::vector<std::vector<int>> rectangles;
       std::vector<long long> prefix;
       std::mt19937 generator{std::random_device{}()};

   public:
       Solution(std::vector<std::vector<int>>& rects)
           : rectangles(rects) {
           long long total = 0;
           for (const auto& rect : rectangles) {
               long long width = static_cast<long long>(rect[2]) - rect[0] + 1;
               long long height = static_cast<long long>(rect[3]) - rect[1] + 1;
               total += width * height;
               prefix.push_back(total);
           }
       }

       std::vector<int> pick() {
           std::uniform_int_distribution<long long> choosePoint(
               1, prefix.back());
           long long serial = choosePoint(generator);
           int index = static_cast<int>(std::lower_bound(
               prefix.begin(), prefix.end(), serial) - prefix.begin());
           const auto& rect = rectangles[index];

           std::uniform_int_distribution<int> chooseX(rect[0], rect[2]);
           std::uniform_int_distribution<int> chooseY(rect[1], rect[3]);
           return {chooseX(generator), chooseY(generator)};
       }
   };

代码分析
--------

前缀和序号把所有矩形覆盖的整数点拼成一个不重叠的抽样空间，矩形内的每个点又等概率出现，所以任意可选点概率相同。构造函数时间和空间复杂度为 ``O(r)``，每次 ``pick`` 二分定位耗时 ``O(log r)``，额外抽样空间为 ``O(1)``。
