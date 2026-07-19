
0118. Pascal's Triangle
=======================

题目信息
--------

:题号: 0118
:难度: Easy
:主题: 数组、动态规划、组合数、二维结果构造
:原题: `LeetCode 0118 <https://leetcode.com/problems/pascals-triangle/>`_
:访问状态: Available
:教学重点: 行边界、相邻父项递推、独立行所有权、输出主导复杂度

题目重述
--------

给定正整数 ``numRows``，返回帕斯卡三角形的前 ``numRows`` 行。
第 0 行是 ``[1]``。第 ``row`` 行包含 ``row + 1`` 个整数，首尾都为 1；
任意内部位置等于上一行左上与右上两个值之和。

题目约束 ``1 <= numRows <= 30``，因此所有结果都能放入 32 位有符号整数。
返回的每一行必须是独立容器，后续构造新行不能修改历史行。

自建示例
--------

五行结果
~~~~~~~~

.. code-block:: text

   numRows = 5
   输出：
   [
     [1],
     [1, 1],
     [1, 2, 1],
     [1, 3, 3, 1],
     [1, 4, 6, 4, 1]
   ]

最小输入
~~~~~~~~

``numRows = 1`` 时只返回 ``[[1]]``，不访问不存在的上一行。

内部值
~~~~~~

第 4 行下标 2 的值为 ``3 + 3 = 6``。两个父项来自第 3 行下标 1 和 2。

问题抽象
--------

令 ``value(row, column)`` 表示第 ``row`` 行、第 ``column`` 列的值，使用零基下标。
合法范围是 ``0 <= column <= row``。递推为：

.. code-block:: text

   value(row, 0) = 1
   value(row, row) = 1

   value(row, column) =
       value(row - 1, column - 1)
       + value(row - 1, column)

   其中 0 < column < row

因此构造顺序必须按行从上到下。创建当前行时，上一行已经完整且不会再修改。

基础类型约定
------------

返回值是长度为 ``numRows`` 的二维动态容器。第 ``row`` 行长度必须精确为 ``row + 1``。

C 返回 ``int **``，同时通过 ``returnSize`` 返回行数，通过 ``returnColumnSizes`` 返回每行长度。
外层指针数组、列宽数组和每一行都由函数分配，调用者按平台约定释放。
其余语言返回各自的嵌套列表或向量。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 定位
   * - 按行直接递推
     - ``Theta(numRows^2)``
     - ``O(1)``，另加输出
     - 主解法；上一行就是递推来源
   * - 组合数公式逐项计算
     - ``Theta(numRows^2)``
     - ``O(1)``，另加输出
     - 需要处理乘除顺序和中间数值
   * - 递归定义
     - 无记忆时指数级
     - 递归栈和缓存
     - 重复计算大量相同位置

输出本身包含 ``numRows * (numRows + 1) / 2`` 个整数，任何正确算法都需要
``Theta(numRows^2)`` 时间和返回空间。

主解法：按行直接递推
--------------------

构造状态与核心不变量
~~~~~~~~~~~~~~~~~~~~

进入第 ``row`` 轮时保持：

* ``triangle`` 已经包含第 0 至 ``row - 1`` 行；
* 每个历史行长度和内容正确；
* 历史行拥有独立存储，当前轮不会覆盖它们；
* 若 ``row > 0``，最后一行就是当前递推所需的上一行。

当前轮先创建长度 ``row + 1`` 的新行，把首尾设置为 1，再计算内部列：

.. code-block:: text

   for column = 1 .. row - 1:
       current[column] =
           previous[column - 1] + previous[column]

最后把完整 ``current`` 追加到二维结果。

为什么边界必须单独处理
~~~~~~~~~~~~~~~~~~~~~~

内部递推需要同时读取 ``column - 1`` 和 ``column``。在首列 ``column = 0`` 时左上位置不存在；
在尾列 ``column = row`` 时右上位置不存在。把边界直接设为 1，既符合组合数定义，
也避免越界和人为补零容器。

行所有权为什么独立
~~~~~~~~~~~~~~~~~~

当前行只读取上一行，不应复用并修改上一行容器。若多个结果行引用同一个可变数组，
后续填充会让历史行一起变化。十语言实现都为每一行创建新容器；C 每行单独分配，
嵌套容器语言每轮创建新的列表或向量。

正确性依据
~~~~~~~~~~

对行号做归纳。

**基础情况。** 第 0 行只包含一个边界位置，算法创建 ``[1]``，正确。

**归纳步骤。** 假设第 0 至 ``row - 1`` 行都正确。算法把第 ``row`` 行首尾设为 1，
满足边界定义。任意内部列 ``column`` 都读取上一行正确的两个父项并求和，
因此满足帕斯卡递推。所有位置均被覆盖，所以当前行完整正确。

**独立性。** 当前行使用新容器，历史行只读，因此归纳过程中不会破坏已经证明正确的行。

**终止性。** 外层执行 ``numRows`` 次，每行内部循环范围有限。

复杂度与语言边界
~~~~~~~~~~~~~~~~

* 返回元素总数为 ``R = numRows * (numRows + 1) / 2``；
* 时间复杂度 ``Theta(R) = Theta(numRows^2)``；
* 返回载荷 ``Theta(R)``；
* 除输出容器和少量索引外，算法工作空间 ``O(1)``；
* C 的外层目录和列宽数组各为 ``O(numRows)``，属于返回适配器元数据；
* Java/C# 的装箱整数属于返回容器实现成本；
* Julia 和 R 使用一基数组，正文零基 ``column`` 需要映射到槽位 ``column + 1``；
* 输入只有一个整数，没有输入修改问题。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stddef.h>
   #include <stdlib.h>

   int **generate(
       int numRows,
       int *returnSize,
       int **returnColumnSizes
   ) {
       *returnSize = 0;
       *returnColumnSizes = NULL;
       if (numRows <= 0) {
           return NULL;
       }

       int **rows = calloc((size_t)numRows, sizeof(*rows));
       int *widths = malloc((size_t)numRows * sizeof(*widths));
       if (rows == NULL || widths == NULL) {
           free(rows);
           free(widths);
           return NULL;
       }

       for (int row = 0; row < numRows; ++row) {
           const int width = row + 1;
           rows[row] = malloc((size_t)width * sizeof(*rows[row]));
           if (rows[row] == NULL) {
               for (int built = 0; built < row; ++built) {
                   free(rows[built]);
               }
               free(rows);
               free(widths);
               return NULL;
           }

           widths[row] = width;
           rows[row][0] = 1;
           rows[row][row] = 1;
           for (int column = 1; column < row; ++column) {
               rows[row][column] =
                   rows[row - 1][column - 1] + rows[row - 1][column];
           }
       }

       *returnSize = numRows;
       *returnColumnSizes = widths;
       return rows;
   }

C 在任一行分配失败时释放全部已完成行、外层目录和列宽数组；只有全部成功后才发布输出元数据。

C++
~~~

.. code-block:: cpp

   #include <utility>
   #include <vector>

   class Solution {
   public:
       std::vector<std::vector<int>> generate(int numRows) {
           std::vector<std::vector<int>> triangle;
           triangle.reserve(numRows);

           for (int row = 0; row < numRows; ++row) {
               std::vector<int> current(row + 1, 1);
               for (int column = 1; column < row; ++column) {
                   current[column] =
                       triangle[row - 1][column - 1] +
                       triangle[row - 1][column];
               }
               triangle.push_back(std::move(current));
           }

           return triangle;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def generate(self, numRows: int) -> list[list[int]]:
           triangle: list[list[int]] = []

           for row in range(numRows):
               current = [1] * (row + 1)
               for column in range(1, row):
                   current[column] = (
                       triangle[row - 1][column - 1]
                       + triangle[row - 1][column]
                   )
               triangle.append(current)

           return triangle

Java
~~~~

.. code-block:: java

   import java.util.ArrayList;
   import java.util.List;

   class Solution {
       public List<List<Integer>> generate(int numRows) {
           List<List<Integer>> triangle = new ArrayList<>(numRows);

           for (int row = 0; row < numRows; ++row) {
               List<Integer> current = new ArrayList<>(row + 1);
               for (int column = 0; column <= row; ++column) {
                   if (column == 0 || column == row) {
                       current.add(1);
                   } else {
                       current.add(
                           triangle.get(row - 1).get(column - 1)
                               + triangle.get(row - 1).get(column)
                       );
                   }
               }
               triangle.add(current);
           }

           return triangle;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn generate(num_rows: i32) -> Vec<Vec<i32>> {
           let mut triangle: Vec<Vec<i32>> =
               Vec::with_capacity(num_rows as usize);

           for row in 0..num_rows as usize {
               let mut current = vec![1; row + 1];
               for column in 1..row {
                   current[column] =
                       triangle[row - 1][column - 1]
                       + triangle[row - 1][column];
               }
               triangle.push(current);
           }

           triangle
       }
   }

Go
~~

.. code-block:: go

   func generate(numRows int) [][]int {
       triangle := make([][]int, 0, numRows)

       for row := 0; row < numRows; row++ {
           current := make([]int, row+1)
           current[0] = 1
           current[row] = 1
           for column := 1; column < row; column++ {
               current[column] =
                   triangle[row-1][column-1] + triangle[row-1][column]
           }
           triangle = append(triangle, current)
       }

       return triangle
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function generate(numRows: number): number[][] {
       const triangle: number[][] = [];

       for (let row = 0; row < numRows; row += 1) {
           const current = new Array<number>(row + 1).fill(1);
           for (let column = 1; column < row; column += 1) {
               current[column] = (
                   triangle[row - 1][column - 1]
                   + triangle[row - 1][column]
               );
           }
           triangle.push(current);
       }

       return triangle;
   }

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       public IList<IList<int>> Generate(int numRows) {
           var triangle = new List<IList<int>>(numRows);

           for (int row = 0; row < numRows; ++row) {
               var current = new List<int>(row + 1);
               for (int column = 0; column <= row; ++column) {
                   if (column == 0 || column == row) {
                       current.Add(1);
                   } else {
                       current.Add(
                           triangle[row - 1][column - 1]
                               + triangle[row - 1][column]
                       );
                   }
               }
               triangle.Add(current);
           }

           return triangle;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function generate_pascal(num_rows::Int)::Vector{Vector{Int}}
       triangle = Vector{Vector{Int}}()
       sizehint!(triangle, num_rows)

       for row in 0:(num_rows - 1)
           current = ones(Int, row + 1)
           for column in 1:(row - 1)
               current[column + 1] =
                   triangle[row][column] + triangle[row][column + 1]
           end
           push!(triangle, current)
       end

       return triangle
   end

当 ``row`` 为 0 或 1 时，``1:(row - 1)`` 是空 ``UnitRange``；内部循环不会执行。数组槽位用 ``column + 1`` 映射零基列号。

R
~

.. code-block:: r

   generate_pascal <- function(num_rows) {
     triangle <- vector("list", num_rows)

     for (row in seq_len(num_rows)) {
       current <- rep.int(1L, row)
       if (row >= 3L) {
         for (column in 2L:(row - 1L)) {
           current[column] <-
             triangle[[row - 1L]][column - 1L] +
             triangle[[row - 1L]][column]
         }
       }
       triangle[[row]] <- current
     }

     triangle
   }

R 只在 ``row >= 3`` 时构造内部列序列，避免下降方向或空区间产生意外索引。

验证计划与证据
--------------

* 固定检查 ``numRows = 1, 2, 5, 30``；
* 对每行检查长度等于行号加一、首尾为 1；
* 对每个内部位置检查等于上一行相邻两项之和；
* 检查每行对象或内存地址独立；
* 用组合数 ``C(row, column)`` 作为独立基准；
* Python 执行全部 ``1..30``；
* C/C++、Java、Go、TypeScript 编译并执行全部合法行数，C/C++ 额外使用 sanitizers；
* Rust、C#、Julia、R 缺少运行时时，记录接口、索引、空区间和所有权静态检查。

关键边界
--------

* 第 0 行没有上一行；
* 长度为 2 的行没有内部位置；
* 首尾不能套用内部递推；
* 每行必须拥有独立存储；
* C 只有全部行构造成功后才能发布 ``returnSize`` 与 ``returnColumnSizes``。

易错点
------

* 把第 ``row`` 行错误创建为长度 ``row``；
* 内部循环包含首尾，导致访问负下标或上一行越界；
* 复用同一个列表作为所有结果行；
* C 分配中途失败时只释放外层数组，泄漏已完成行；
* R 在没有内部列时仍构造 ``2:(row - 1)``，产生反向序列和错误写入。

本题新增知识
------------

* 帕斯卡三角形的二维相邻父项递推；
* 二维不规则结果的行长度契约；
* 输出规模本身决定 ``Theta(numRows^2)`` 下界；
* C 多行结果的事务式分配与失败清理。

本题强化知识
------------

* 动态规划按依赖方向确定构造顺序；
* 返回行必须拥有独立快照；
* Julia/R 的一基槽位需要明确映射；
* 复杂度要区分工作空间、返回载荷和适配器元数据。

关联题目
--------

* `0119. Pascal's Triangle II <0119-pascals-triangle-ii.rst>`_：只返回一行并用逆序覆盖压缩空间；
* `0062. Unique Paths <../0001-0100/0062-unique-paths.rst>`_：同样使用相邻状态加法；
* `0115. Distinct Subsequences <0115-distinct-subsequences.rst>`_：一行计数 DP 的逆序更新。

最小自检
--------

#. 为什么第 ``row`` 行长度是 ``row + 1``？
#. 为什么当前行不能直接复用上一行容器？
#. 本题的 ``Theta(numRows^2)`` 时间能否继续降低？

答案要点
--------

#. 零基第 ``row`` 行合法列为 ``0..row``，共 ``row + 1`` 个位置。
#. 结果需要同时保留所有历史行；覆盖上一行会破坏已经返回的内容。
#. 不能，返回值本身就包含二次方数量级的整数。
