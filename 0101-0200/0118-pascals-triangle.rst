0118. Pascal's Triangle
=======================

题目信息
--------

:题号: 0118. 杨辉三角
:难度: Easy
:主题: 数组、递归定义、动态规划、二维结果构造
:原题: `LeetCode 0118 <https://leetcode.com/problems/pascals-triangle/>`_
:重点: 从逐项递归展开父节点，识别重叠子问题，再利用已经返回的上一行直接构造当前行

题目重述
--------

给定正整数 ``numRows``，返回杨辉三角最上方的 ``numRows`` 行。使用零基行号时，第 ``row`` 行有
``row + 1`` 个整数；首尾均为 ``1``，其余位置等于上一行中左上方与右上方两个相邻元素之和。

第一行是 ``[1]``，约束为 ``1 <= numRows <= 30``。返回结果必须包含每一行的独立数组。

自建示例
--------

* ``numRows = 6`` 时返回
  ``[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1],[1,5,10,10,5,1]]``；
* ``numRows = 2`` 时返回 ``[[1],[1,1]]``，两行都没有需要父项相加的内部位置；
* ``numRows = 1`` 时只返回 ``[[1]]``。

C++ 实现
--------

.. code-block:: cpp

   #include <utility>
   #include <vector>

   class Solution {
   private:
       int recursiveValue(int row, int column) {
           if (column == 0 || column == row) {
               return 1;
           }
           return recursiveValue(row - 1, column - 1) + recursiveValue(row - 1, column);
       }

       std::vector<std::vector<int>> buildByRecursiveValues(int numRows) {
           std::vector<std::vector<int>> triangle;
           for (int row = 0; row < numRows; ++row) {
               std::vector<int> current;
               current.reserve(row + 1);
               for (int column = 0; column <= row; ++column) {
                   current.push_back(recursiveValue(row, column));
               }
               triangle.push_back(std::move(current));
           }
           return triangle;
       }

       std::vector<std::vector<int>> buildFromPreviousRow(int numRows) {
           std::vector<std::vector<int>> triangle;
           triangle.reserve(numRows);
           for (int row = 0; row < numRows; ++row) {
               std::vector<int> current(row + 1, 1);
               if (row > 0) {
                   const std::vector<int>& previous = triangle.back();
                   for (int column = 1; column < row; ++column) {
                       current[column] = previous[column - 1] + previous[column];
                   }
               }
               triangle.push_back(std::move(current));
           }
           return triangle;
       }

   public:
       std::vector<std::vector<int>> generate(int numRows) {
           return buildFromPreviousRow(numRows);
       }
   };

题解
----

逐项递归定义
~~~~~~~~~~~~

题目已经给出每个位置的直接定义。用 ``value(row, column)`` 表示零基坐标上的值：

.. code-block:: text

   value(row, 0) = 1
   value(row, row) = 1
   value(row, column) =
       value(row - 1, column - 1) + value(row - 1, column)

``recursiveValue`` 原样执行这个定义，``buildByRecursiveValues`` 再对结果中的每个坐标调用它。递归最终都
到达两侧边界 ``1``，所以每个位置能够得到正确值，逐项填满后自然形成要求的全部行。

重复父项
~~~~~~~~

直接递归的问题是同一父项会被许多后代重复求解。计算中心位置时，左右递归树会再次展开共同祖先；输出第
``row`` 行的多个位置时，又会各自从头展开前面各行。我们明明必须返回所有早期行，却没有复用已经算好的值。

记忆化能缓存 ``(row, column)``，但缓存表本身就是题目要求的三角形。与其从底部坐标向上递归查询，不如按
依赖方向从上到下构造，让上一行直接成为当前行的状态来源。

按行动态规划
~~~~~~~~~~~~

``buildFromPreviousRow`` 为第 ``row`` 行创建长度 ``row + 1`` 的独立向量，并先把全部位置初始化为 ``1``。
这样行首、行尾以及长度为 ``1``、``2`` 的小行都无需额外分支；只遍历 ``1 <= column < row`` 的内部位置，
从上一行读取两个父项。

当前行只能在上一行完成后构造。``previous`` 是 ``triangle.back()`` 的只读引用，而 ``current`` 是新分配的
行；计算期间不会覆盖父项，完成后再整体移动到结果。每行存储互不共享，后续构造不会修改历史行。

状态走读
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - ``row``
     - 上一行
     - 初始当前行
     - 内部更新
     - 完成行
   * - 0
     - 无
     - ``[1]``
     - 无
     - ``[1]``
   * - 1
     - ``[1]``
     - ``[1,1]``
     - 无
     - ``[1,1]``
   * - 2
     - ``[1,1]``
     - ``[1,1,1]``
     - ``1 + 1``
     - ``[1,2,1]``
   * - 3
     - ``[1,2,1]``
     - ``[1,1,1,1]``
     - ``1 + 2``、``2 + 1``
     - ``[1,3,3,1]``
   * - 5
     - ``[1,4,6,4,1]``
     - 六个 1
     - ``1+4``、``4+6``、``6+4``、``4+1``
     - ``[1,5,10,10,5,1]``

每个内部值只做一次加法。组合数公式也能独立计算一行，但需要乘除顺序和更宽中间类型；父项求和直接复用
题目给出的局部关系，更适合作为主解。

复杂度分析
~~~~~~~~~~

返回结果包含 ``1 + 2 + ... + numRows = Θ(numRows²)`` 个整数，任何方案至少要写入这些值。主解对每个位置
初始化或计算一次，时间 ``Θ(numRows²)``，返回空间也为 ``Θ(numRows²)``。当前行最长为 ``O(numRows)``，
完成后移动进结果，不产生另一份行副本。
