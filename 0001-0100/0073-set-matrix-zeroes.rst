0073. Set Matrix Zeroes
=======================

题目信息
--------

:题号: 0073
:难度: Medium
:主题: 数组、矩阵、原地标记
:原题: `LeetCode 0073 <https://leetcode.com/problems/set-matrix-zeroes/>`_
:访问状态: Available
:教学重点: 首行首列复用、原始零见证、分阶段写入、常数额外空间、原地副作用

题目重述
--------

给定一个非空 ``m × n`` 整数矩阵。若某个位置的原始值为 ``0``，把它所在的整行和整列全部设为
``0``。要求在原矩阵上完成修改，并把额外空间降为 ``O(1)``。

题目保证 ``1 <= m,n <= 200``，矩阵是规则矩形，元素位于 32 位有符号整数范围。新增的零不能继续
触发额外行列；触发集合只由输入的原始零决定。

自建示例
--------

.. code-block:: text

   输入：
   1  2  0  4
   5  6  7  8
   0 10 11 12

   输出：
   0  0  0  0
   0  6  0  8
   0  0  0  0

.. code-block:: text

   输入：[[1, 2], [3, 4]]
   输出：[[1, 2], [3, 4]]

问题抽象
--------

直接维护 ``m`` 个行标记和 ``n`` 个列标记需要 ``O(m+n)`` 空间。矩阵第一列可以保存每一行是否应归零，
第一行可以保存每一列是否应归零。位置 ``matrix[0][0]`` 同时属于首行与首列，无法独立表示两种状态，
所以额外用两个布尔值记录首行和首列是否包含原始零。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 取舍
   * - 独立行列标记数组
     - ``O(mn)``
     - ``O(m+n)``
     - 简单直接，但未达到常数空间目标
   * - 首行首列作为标记区
     - ``O(mn)``
     - ``O(1)``
     - 主解法；需要严格分阶段写入

主解法：首行首列原地标记
------------------------

四个阶段
~~~~~~~~

#. 只读检查首行和首列，把它们是否含原始零保存到两个布尔值；
#. 扫描内部区域 ``row >= 1``、``col >= 1``，每遇到原始零就把对应首列与首行标记设为零；
#. 再扫描内部区域，根据行标记或列标记把单元格设为零；
#. 最后依据两个布尔值处理首行与首列。

核心不变量
~~~~~~~~~~

标记阶段结束后，对每个内部行 ``r``，``matrix[r][0] == 0`` 当且仅当该行首列原本为零，或内部区域
存在原始零；列标记同理。首行与首列自身的原始零信息保存在布尔值中，因此标记写入不会丢失它们。

为什么必须最后处理首行首列
~~~~~~~~~~~~~~~~~~~~~~~~~~

若在应用内部标记前先把首行或首列整体清零，所有行或列标记都会变成零，从而错误地把整个矩阵清零。
先完成内部区域，再恢复首行首列，可以让标记在最后一次读取前保持有效。

正确性依据
~~~~~~~~~~

任意内部位置 ``(r,c)`` 应归零，当且仅当原始第 ``r`` 行或第 ``c`` 列存在零。标记阶段把每个内部原始
零同时投影到行标记与列标记；首行或首列的原始零由布尔值保留。应用阶段读取这两个标记的析取，恰好
覆盖所有应归零的位置，没有原始零见证的行列不会被标记。最后处理首行首列后，全部位置满足题意。

复杂度与语言适配
~~~~~~~~~~~~~~~~

矩阵被常数次扫描，时间复杂度为 ``O(mn)``，除两个布尔值和下标外额外空间为 ``O(1)``。C、C++、
Python、Java、Rust、Go、TypeScript、C# 与 Julia 直接修改传入矩阵。R 具有复制语义，适配器返回修改后
的矩阵；算法内部仍只复用首行首列，不创建行列标记数组。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>

   void setZeroes(int **matrix, int matrixSize, int *matrixColSize) {
       const int rows = matrixSize;
       const int cols = matrixColSize[0];
       bool first_row_zero = false;
       bool first_col_zero = false;

       for (int col = 0; col < cols; ++col) {
           if (matrix[0][col] == 0) {
               first_row_zero = true;
           }
       }
       for (int row = 0; row < rows; ++row) {
           if (matrix[row][0] == 0) {
               first_col_zero = true;
           }
       }

       for (int row = 1; row < rows; ++row) {
           for (int col = 1; col < cols; ++col) {
               if (matrix[row][col] == 0) {
                   matrix[row][0] = 0;
                   matrix[0][col] = 0;
               }
           }
       }

       // 先应用内部标记，最后再处理首行与首列，避免提前破坏标记。
       for (int row = 1; row < rows; ++row) {
           for (int col = 1; col < cols; ++col) {
               if (matrix[row][0] == 0 || matrix[0][col] == 0) {
                   matrix[row][col] = 0;
               }
           }
       }

       if (first_row_zero) {
           for (int col = 0; col < cols; ++col) {
               matrix[0][col] = 0;
           }
       }
       if (first_col_zero) {
           for (int row = 0; row < rows; ++row) {
               matrix[row][0] = 0;
           }
       }
   }

C++
~~~

.. code-block:: cpp

   #include <vector>

   class Solution {
   public:
       void setZeroes(std::vector<std::vector<int>> &matrix) {
           const int rows = static_cast<int>(matrix.size());
           const int cols = static_cast<int>(matrix[0].size());
           bool firstRowZero = false;
           bool firstColZero = false;

           for (int col = 0; col < cols; ++col) {
               firstRowZero = firstRowZero || matrix[0][col] == 0;
           }
           for (int row = 0; row < rows; ++row) {
               firstColZero = firstColZero || matrix[row][0] == 0;
           }

           for (int row = 1; row < rows; ++row) {
               for (int col = 1; col < cols; ++col) {
                   if (matrix[row][col] == 0) {
                       matrix[row][0] = 0;
                       matrix[0][col] = 0;
                   }
               }
           }

           for (int row = 1; row < rows; ++row) {
               for (int col = 1; col < cols; ++col) {
                   if (matrix[row][0] == 0 || matrix[0][col] == 0) {
                       matrix[row][col] = 0;
                   }
               }
           }

           if (firstRowZero) {
               for (int &value : matrix[0]) {
                   value = 0;
               }
           }
           if (firstColZero) {
               for (std::vector<int> &row : matrix) {
                   row[0] = 0;
               }
           }
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def setZeroes(self, matrix: list[list[int]]) -> None:
           rows = len(matrix)
           cols = len(matrix[0])
           first_row_zero = any(matrix[0][col] == 0 for col in range(cols))
           first_col_zero = any(matrix[row][0] == 0 for row in range(rows))

           for row in range(1, rows):
               for col in range(1, cols):
                   if matrix[row][col] == 0:
                       matrix[row][0] = 0
                       matrix[0][col] = 0

           for row in range(1, rows):
               for col in range(1, cols):
                   if matrix[row][0] == 0 or matrix[0][col] == 0:
                       matrix[row][col] = 0

           if first_row_zero:
               for col in range(cols):
                   matrix[0][col] = 0
           if first_col_zero:
               for row in range(rows):
                   matrix[row][0] = 0

Java
~~~~

.. code-block:: java

   class Solution {
       public void setZeroes(int[][] matrix) {
           int rows = matrix.length;
           int cols = matrix[0].length;
           boolean firstRowZero = false;
           boolean firstColZero = false;

           for (int col = 0; col < cols; ++col) {
               firstRowZero |= matrix[0][col] == 0;
           }
           for (int row = 0; row < rows; ++row) {
               firstColZero |= matrix[row][0] == 0;
           }

           for (int row = 1; row < rows; ++row) {
               for (int col = 1; col < cols; ++col) {
                   if (matrix[row][col] == 0) {
                       matrix[row][0] = 0;
                       matrix[0][col] = 0;
                   }
               }
           }

           for (int row = 1; row < rows; ++row) {
               for (int col = 1; col < cols; ++col) {
                   if (matrix[row][0] == 0 || matrix[0][col] == 0) {
                       matrix[row][col] = 0;
                   }
               }
           }

           if (firstRowZero) {
               for (int col = 0; col < cols; ++col) {
                   matrix[0][col] = 0;
               }
           }
           if (firstColZero) {
               for (int row = 0; row < rows; ++row) {
                   matrix[row][0] = 0;
               }
           }
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn set_zeroes(matrix: &mut Vec<Vec<i32>>) {
           let rows = matrix.len();
           let cols = matrix[0].len();
           let first_row_zero = matrix[0].iter().any(|&value| value == 0);
           let first_col_zero = (0..rows).any(|row| matrix[row][0] == 0);

           for row in 1..rows {
               for col in 1..cols {
                   if matrix[row][col] == 0 {
                       matrix[row][0] = 0;
                       matrix[0][col] = 0;
                   }
               }
           }

           for row in 1..rows {
               for col in 1..cols {
                   if matrix[row][0] == 0 || matrix[0][col] == 0 {
                       matrix[row][col] = 0;
                   }
               }
           }

           if first_row_zero {
               for value in &mut matrix[0] {
                   *value = 0;
               }
           }
           if first_col_zero {
               for row in matrix.iter_mut() {
                   row[0] = 0;
               }
           }
       }
   }

Go
~~

.. code-block:: go

   package main

   func setZeroes(matrix [][]int) {
       rows := len(matrix)
       cols := len(matrix[0])
       firstRowZero := false
       firstColZero := false

       for col := 0; col < cols; col++ {
           firstRowZero = firstRowZero || matrix[0][col] == 0
       }
       for row := 0; row < rows; row++ {
           firstColZero = firstColZero || matrix[row][0] == 0
       }

       for row := 1; row < rows; row++ {
           for col := 1; col < cols; col++ {
               if matrix[row][col] == 0 {
                   matrix[row][0] = 0
                   matrix[0][col] = 0
               }
           }
       }

       for row := 1; row < rows; row++ {
           for col := 1; col < cols; col++ {
               if matrix[row][0] == 0 || matrix[0][col] == 0 {
                   matrix[row][col] = 0
               }
           }
       }

       if firstRowZero {
           for col := 0; col < cols; col++ {
               matrix[0][col] = 0
           }
       }
       if firstColZero {
           for row := 0; row < rows; row++ {
               matrix[row][0] = 0
           }
       }
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function setZeroes(matrix: number[][]): void {
       const rows = matrix.length;
       const cols = matrix[0].length;
       let firstRowZero = false;
       let firstColZero = false;

       for (let col = 0; col < cols; col += 1) {
           firstRowZero ||= matrix[0][col] === 0;
       }
       for (let row = 0; row < rows; row += 1) {
           firstColZero ||= matrix[row][0] === 0;
       }

       for (let row = 1; row < rows; row += 1) {
           for (let col = 1; col < cols; col += 1) {
               if (matrix[row][col] === 0) {
                   matrix[row][0] = 0;
                   matrix[0][col] = 0;
               }
           }
       }

       for (let row = 1; row < rows; row += 1) {
           for (let col = 1; col < cols; col += 1) {
               if (matrix[row][0] === 0 || matrix[0][col] === 0) {
                   matrix[row][col] = 0;
               }
           }
       }

       if (firstRowZero) {
           matrix[0].fill(0);
       }
       if (firstColZero) {
           for (const row of matrix) {
               row[0] = 0;
           }
       }
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public void SetZeroes(int[][] matrix) {
           int rows = matrix.Length;
           int cols = matrix[0].Length;
           bool firstRowZero = false;
           bool firstColZero = false;

           for (int col = 0; col < cols; ++col) {
               firstRowZero |= matrix[0][col] == 0;
           }
           for (int row = 0; row < rows; ++row) {
               firstColZero |= matrix[row][0] == 0;
           }

           for (int row = 1; row < rows; ++row) {
               for (int col = 1; col < cols; ++col) {
                   if (matrix[row][col] == 0) {
                       matrix[row][0] = 0;
                       matrix[0][col] = 0;
                   }
               }
           }

           for (int row = 1; row < rows; ++row) {
               for (int col = 1; col < cols; ++col) {
                   if (matrix[row][0] == 0 || matrix[0][col] == 0) {
                       matrix[row][col] = 0;
                   }
               }
           }

           if (firstRowZero) {
               for (int col = 0; col < cols; ++col) {
                   matrix[0][col] = 0;
               }
           }
           if (firstColZero) {
               for (int row = 0; row < rows; ++row) {
                   matrix[row][0] = 0;
               }
           }
       }
   }

Julia
~~~~~

.. code-block:: julia

   function set_zeroes!(matrix::Matrix{Int})::Nothing
       rows, cols = size(matrix)
       first_row_zero = any(matrix[1, col] == 0 for col in 1:cols)
       first_col_zero = any(matrix[row, 1] == 0 for row in 1:rows)

       for row in 2:rows, col in 2:cols
           if matrix[row, col] == 0
               matrix[row, 1] = 0
               matrix[1, col] = 0
           end
       end

       for row in 2:rows, col in 2:cols
           if matrix[row, 1] == 0 || matrix[1, col] == 0
               matrix[row, col] = 0
           end
       end

       if first_row_zero
           matrix[1, :] .= 0
       end
       if first_col_zero
           matrix[:, 1] .= 0
       end
       return nothing
   end

R
~

.. code-block:: r

   set_zeroes <- function(matrix) {
     rows <- nrow(matrix)
     cols <- ncol(matrix)
     first_row_zero <- any(matrix[1, ] == 0)
     first_col_zero <- any(matrix[, 1] == 0)

     if (rows > 1 && cols > 1) {
       for (row in 2:rows) {
         for (col in 2:cols) {
           if (matrix[row, col] == 0) {
             matrix[row, 1] <- 0
             matrix[1, col] <- 0
           }
         }
       }

       for (row in 2:rows) {
         for (col in 2:cols) {
           if (matrix[row, 1] == 0 || matrix[1, col] == 0) {
             matrix[row, col] <- 0
           }
         }
       }
     }

     if (first_row_zero) {
       matrix[1, ] <- 0
     }
     if (first_col_zero) {
       matrix[, 1] <- 0
     }
     matrix
   }

关联题目
--------

* `0048. Rotate Image <0048-rotate-image.rst>`_：比较矩阵原地变换和写入顺序证明；
* `0054. Spiral Matrix <0054-spiral-matrix.rst>`_：比较矩阵边界与遍历不变量；
* `0059. Spiral Matrix II <0059-spiral-matrix-ii.rst>`_：比较每格恰好写入一次的构造过程。

知识记录
--------

* 新增：复用首行首列保存行列零标记，以两个布尔值消除交叉位置歧义；
* 新增：原地标记必须按“保存边界、写标记、应用内部、恢复边界”分阶段执行；
* 强化：矩阵原地算法的正确性依赖写入顺序，新增值不能被误认为原始见证。

语言边界与实现说明
------------------

* C 的资源分配、失败返回和所有权在代码附近明确；
* C++、Java、C#、Go 与 TypeScript 使用目标语言的可变或动态容器表达同一状态；
* Rust 通过借用或拥有的标准容器保持边界清晰；
* Julia 与 R 使用一基下标，正文中的零基状态需要显式换算；
* TypeScript 的整数运算不使用会隐式转成 32 位有符号数的位运算；
* R 的函数返回修改后的值时，这是复制语义适配，不改变算法核心状态。

验证证据
--------

本题代码块从 RST 中抽取后执行质量门。可用环境中的 C、C++、Python、Java、Go 与 TypeScript
完成编译或运行；Rust、C#、Julia 与 R 完成静态语义检查。Python 另使用独立基准进行随机或穷举
对拍。验证范围与具体用例在本批提交报告中记录，不把未执行语言描述为运行通过。

关键边界
--------

* 空字符串、根目录、单行单列或零长度前缀必须由初始化直接覆盖；
* 第一行、第一列、栈为空和滚动数组第零项不能套用内部区域的普通更新；
* C 的资源失败值必须与合法输出区分，调用者按接口说明处理。

易错点
------

* 把特殊标记和普通数据混为一谈；
* 更新状态后丢失下一步仍需要的旧值；
* 忽略空输入、单元素或第一行、第一列等边界；
* 只说明代码过程，没有证明状态足以覆盖全部合法解；
* 隐藏容器复制、字符串拆分、结果快照或返回值的空间成本。

最小自检
--------

#. 状态变量分别表示什么？
#. 当前更新会不会覆盖后续仍需读取的旧状态？
#. 边界初始化为什么与一般转移一致？
#. 返回结果是否满足题目要求的规范形式或原地副作用？
#. 复杂度是否包含必要的输入规范化和输出构造？

答案要点
--------

* 先用一句话写出状态含义，再解释更新所需的旧值；
* 正确性证明围绕分类完备性、不变量保持和边界恢复展开；
* 代码只实现正文已经证明的主解法，语言差异不改变问题语义。
