0120. Triangle
==============

题目信息
--------

:题号: 0120. 三角形最小路径和
:难度: Medium
:主题: 动态规划、路径枚举、后缀状态、滚动数组
:原题: `LeetCode 0120 <https://leetcode.com/problems/triangle/>`_
:重点: 从二叉选择的完整路径搜索，合并重复的坐标状态，再按依赖方向自底向上压缩为一行

题目重述
--------

给定一个整数三角形 ``triangle``，路径从顶点 ``triangle[0][0]`` 开始。位于第 ``row`` 行第 ``column``
列时，下一步只能进入下一行的 ``column`` 或 ``column + 1``，路径必须一直到达最后一行。返回所有合法路径
中最小的节点值总和。

三角形行数在 ``1..200`` 范围内，第 ``i`` 行恰有 ``i + 1`` 个元素，每个值在 ``-10^4..10^4`` 范围内。
进阶目标是使用与行数成正比的额外空间；主解不修改输入。

自建示例
--------

* 含负数：``triangle = [[4],[2,9],[7,1,3],[8,6,-5,2]]``，返回 ``2``，最优路径为
  ``4 -> 2 -> 1 -> -5``；
* 局部贪心失败：``triangle = [[0],[1,2],[100,100,-100]]``，返回 ``-98``。第二行较小的 ``1`` 并不在
  最优路径上；
* 单元素：``triangle = [[-7]]``，返回 ``-7``。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       int enumeratePaths(const std::vector<std::vector<int>>& triangle, int row, int column) {
           if (row == static_cast<int>(triangle.size()) - 1) {
               return triangle[row][column];
           }
           const int sameColumn = enumeratePaths(triangle, row + 1, column);
           const int nextColumn = enumeratePaths(triangle, row + 1, column + 1);
           return triangle[row][column] + std::min(sameColumn, nextColumn);
       }

       int bottomUpTable(std::vector<std::vector<int>> best) {
           for (int row = static_cast<int>(best.size()) - 2; row >= 0; --row) {
               for (int column = 0; column <= row; ++column) {
                   best[row][column] += std::min(best[row + 1][column], best[row + 1][column + 1]);
               }
           }
           return best[0][0];
       }

       int bottomUpRolling(const std::vector<std::vector<int>>& triangle) {
           std::vector<int> best = triangle.back();
           for (int row = static_cast<int>(triangle.size()) - 2; row >= 0; --row) {
               for (int column = 0; column <= row; ++column) {
                   best[column] = triangle[row][column] + std::min(best[column], best[column + 1]);
               }
           }
           return best[0];
       }

   public:
       int minimumTotal(std::vector<std::vector<int>>& triangle) {
           return bottomUpRolling(triangle);
       }
   };

题解
----

完整路径搜索
~~~~~~~~~~~~

除最后一行外，每个位置都有两个合法后继，因此最直接的正确方案是递归尝试两侧，分别得到从两个孩子到底部
的最小路径和，再选择较小者。``enumeratePaths`` 覆盖每一步的全部选择组合，到达底行时返回终点值，所以
不会漏掉任何合法路径。

不能只比较下一行两个孩子的当前值。局部贪心示例在第二行会选择 ``1``，但它后面只能接 ``100``；选择当前
更大的 ``2`` 却能接 ``-100``，完整路径更小。正确比较对象是“从孩子到底部的最优后缀总和”，不是孩子
自身。

重复坐标状态
~~~~~~~~~~~~

递归搜索中，不同上方路径会汇合到同一坐标。例如 ``(row, column)`` 可以由上一行的 ``column - 1`` 或
``column`` 到达；一旦站在这个位置，后续最小代价只由当前位置决定，与之前怎样到达无关。

定义后缀状态：

.. code-block:: text

   best(row, column) =
       从 (row, column) 出发到底行的最小路径和

最后一行已经是终点：

.. code-block:: text

   best(last, column) = triangle[last][column]

其他位置只有两个后继：

.. code-block:: text

   best(row, column) = triangle[row][column]
       + min(best(row + 1, column),
             best(row + 1, column + 1))

把每个坐标结果保存一次，原先指数级搜索树中汇合后的重复分支就被删除。

自底向上填表
~~~~~~~~~~~~

状态依赖下一行，所以从底行向上计算时，两个孩子结果都已经完成。``bottomUpTable`` 复制整个三角形作为
``best`` 表：底行无需修改，每个更高位置覆盖为自己的最优后缀代价，最终唯一顶点 ``best[0][0]`` 覆盖
所有合法路径。

负数不需要特殊处理。转移比较的是两个已经包含全部后续代价的状态，没有依据当前值正负剪枝；普通加法与
最小值仍保持最优子结构。

滚动一行
~~~~~~~~

计算第 ``row`` 行只读取第 ``row + 1`` 行，完整二维表中的更低历史行不会再次使用。``bottomUpRolling``
把工作数组初始化为底行，处理某行后，前 ``row + 1`` 个位置覆盖为该行状态。

更新按列从左向右进行。计算 ``best[column]`` 时，同列旧值在赋值前读取，右邻 ``best[column + 1]`` 尚未在
本轮覆盖，两者都属于下一行。若从右向左，右邻会先变成当前行状态，依赖层次就会混合。

对第一个示例：

.. list-table::
   :header-rows: 1

   * - 处理阶段
     - 工作数组有效前缀
     - 关键计算
   * - 初始底行
     - ``[8,6,-5,2]``
     - 底行直接作为后缀代价
   * - 合并 ``[7,1,3]``
     - ``[13,-4,-2]``
     - ``1 + min(6,-5) = -4``
   * - 合并 ``[2,9]``
     - ``[-2,5]``
     - ``2 + min(13,-4) = -2``
   * - 合并 ``[4]``
     - ``[2]``
     - ``4 + min(-2,5) = 2``

数组后方已失效位置无需清空，下一轮只读取仍属于有效下一行的相邻位置。

主解与复杂度
~~~~~~~~~~~~

公开入口采用一维自底向上 DP。它保留后缀状态的直接含义，把二维表中不会再使用的各行删除，同时通过复制
底行避免修改调用者的 ``triangle``。若允许覆盖输入，可直接在原三角形上执行同一转移，额外空间降为常数，
但会改变参数内容。

设行数为 ``r``，三角形共有 ``Θ(r²)`` 个位置。二维与滚动 DP 都对每个位置做常数工作，时间 ``Θ(r²)``；
二维副本空间 ``Θ(r²)``，滚动数组空间 ``O(r)``。裸递归会重复坐标状态，最坏为指数时间。
