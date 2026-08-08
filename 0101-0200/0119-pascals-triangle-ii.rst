0119. Pascal's Triangle II
==========================

题目信息
--------

:题号: 0119. 杨辉三角 II
:难度: Easy
:主题: 数组、动态规划、逆序更新、组合数
:原题: `LeetCode 0119 <https://leetcode.com/problems/pascals-triangle-ii/>`_
:重点: 从保存全部历史行压缩为原地滚动数组，再利用目标行的组合数结构删除前面各行的构造

题目重述
--------

给定非负整数 ``rowIndex``，返回杨辉三角中零基编号为 ``rowIndex`` 的一整行。第 ``0`` 行是 ``[1]``；
第 ``rowIndex`` 行共有 ``rowIndex + 1`` 个元素，首尾为 ``1``，内部元素由上一行相邻两项之和得到。

约束为 ``0 <= rowIndex <= 33``。题目只要求目标行，不需要返回或保留之前各行。

自建示例
--------

* ``rowIndex = 6`` 时返回 ``[1,6,15,20,15,6,1]``；
* ``rowIndex = 2`` 时返回 ``[1,2,1]``；
* ``rowIndex = 1`` 时返回 ``[1,1]``；
* ``rowIndex = 0`` 时返回 ``[1]``，不需要执行任何转移。

C++ 实现
--------

.. code-block:: cpp

   #include <utility>
   #include <vector>

   class Solution {
   private:
       std::vector<int> buildFullTriangle(int rowIndex) {
           std::vector<std::vector<int>> triangle;
           for (int row = 0; row <= rowIndex; ++row) {
               std::vector<int> current(row + 1, 1);
               if (row > 0) {
                   for (int column = 1; column < row; ++column) {
                       current[column] = triangle.back()[column - 1] + triangle.back()[column];
                   }
               }
               triangle.push_back(std::move(current));
           }
           return triangle.back();
       }

       std::vector<int> rollingRow(int rowIndex) {
           std::vector<int> row(rowIndex + 1);
           row[0] = 1;
           for (int currentRow = 1; currentRow <= rowIndex; ++currentRow) {
               for (int column = currentRow; column >= 1; --column) {
                   row[column] += row[column - 1];
               }
           }
           return row;
       }

       std::vector<int> combinationRow(int rowIndex) {
           std::vector<int> row(rowIndex + 1);
           long long value = 1;
           for (int column = 0; column <= rowIndex; ++column) {
               row[column] = static_cast<int>(value);
               if (column < rowIndex) {
                   value = value * (rowIndex - column) / (column + 1);
               }
           }
           return row;
       }

   public:
       std::vector<int> getRow(int rowIndex) {
           return combinationRow(rowIndex);
       }
   };

题解
----

完整三角形基线
~~~~~~~~~~~~~~

最直接的正确方案是从第 ``0`` 行开始，按“首尾为 ``1``、内部等于上一行相邻父项之和”依次构造到目标行。
``buildFullTriangle`` 保存每一行，最终返回最后一行。依赖顺序自上而下，所有父项在读取前都已正确计算。

但历史行只服务于下一行，完成目标后全部被丢弃。保存三角形需要 ``1 + 2 + ... + (rowIndex + 1)`` 个整数，
而返回值只有 ``rowIndex + 1`` 个。首先应删除的是不属于输出的历史行。

一维逆序滚动
~~~~~~~~~~~~

上一行与当前行的关系为：

.. code-block:: text

   new[column] = old[column] + old[column - 1]

预先分配长度 ``rowIndex + 1`` 的数组，令 ``row[0] = 1``，其余位置为 ``0``。每轮只更新当前行会使用的
前缀，数组便可同时表示旧行和新行。

更新必须从右向左。计算 ``row[column]`` 时，右侧当前位置仍保存 ``old[column]``，左邻位置也还没有在本轮
修改，因而能读取 ``old[column - 1]``。若从左向右，左邻已经变成 ``new[column - 1]``，同一轮的新值会
被再次使用，递推关系被改变。

尾部的 ``1`` 也无需单独赋值：进入第 ``currentRow`` 轮前，``row[currentRow]`` 仍为 ``0``；本轮第一个
逆序更新把它加上上一行末尾的 ``1``，自然得到新行尾。

.. list-table::
   :header-rows: 1

   * - 完成行号
     - 工作数组有效前缀
   * - 0
     - ``[1]``
   * - 1
     - ``[1,1]``
   * - 2
     - ``[1,2,1]``
   * - 3
     - ``[1,3,3,1]``
   * - 4
     - ``[1,4,6,4,1]``

``rollingRow`` 把空间从完整三角形的 ``O(rowIndex²)`` 压缩到返回数组本身，但仍要构造从第 ``0`` 行到目标
行的全部中间状态，总更新次数为 ``O(rowIndex²)``。

只构造目标行
~~~~~~~~~~~~

杨辉三角第 ``rowIndex`` 行第 ``column`` 项也是组合数 ``C(rowIndex, column)``。相邻项满足：

.. code-block:: text

   C(rowIndex, 0) = 1
   C(rowIndex, column + 1) =
       C(rowIndex, column) * (rowIndex - column) / (column + 1)

因此已知当前 ``value`` 后，可以在常数时间得到下一列，不再构造任何前置行。组合数关系保证每步整除；代码
先乘后除，并用 ``long long`` 保存中间乘积，避免虽然最终元素适合 ``int``，乘法过程却超出 32 位。

对 ``rowIndex = 6``，状态依次为：

.. code-block:: text

   1
   1 * 6 / 1 = 6
   6 * 5 / 2 = 15
   15 * 4 / 3 = 20
   20 * 3 / 4 = 15
   15 * 2 / 5 = 6
   6 * 1 / 6 = 1

这直接得到 ``[1,6,15,20,15,6,1]``。首尾和对称性都由同一递推自然产生，不需要特殊列分支。

主解与复杂度
~~~~~~~~~~~~

公开入口采用组合数递推，因为它把一维 DP 中仍然存在的全部前置行更新删除，时间从 ``O(rowIndex²)`` 降为
``O(rowIndex)``。代价是依赖组合数恒等式和较宽中间类型；若题目只提供局部父项关系，逆序滚动 DP 更通用。

完整三角形时间、空间均为 ``O(rowIndex²)``；滚动 DP 时间 ``O(rowIndex²)``、返回数组空间
``O(rowIndex)``；组合数主解时间 ``O(rowIndex)``，除返回数组外只用常数状态。返回数组本身需要
``O(rowIndex)`` 空间，无法再减少。
