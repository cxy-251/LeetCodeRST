0200. Number of Islands
=======================

题目信息
--------

:题号: 0200
:难度: Medium
:主题: 网格、连通分量、深度优先搜索、原地标记
:原题: `LeetCode 0200 <https://leetcode.com/problems/number-of-islands/>`_
:访问状态: Available
:教学重点: 四邻接分量、首次发现计数、入栈前标记、输入变异与资源边界

精确契约
--------

给定一个只包含字符 ``'0'`` 与 ``'1'`` 的矩形网格：

* ``'1'`` 表示陆地，``'0'`` 表示水；
* 两个陆地格只有在上、下、左、右相邻时才直接连通；
* 对角接触不算连通；
* 一个岛屿是一个极大的四邻接陆地连通分量；
* 返回岛屿数量；
* 主算法允许把访问过的 ``'1'`` 原地改成 ``'0'``，因此输入网格会被破坏；
* 官方范围是 ``1 <= m,n <= 300``，本章额外兼容空网格并返回 ``0``。

主算法原地把访问过的 ``'1'`` 改成 ``'0'``，因此会修改输入网格；若调用方需要保留原网格，
应在调用前自行复制。该修改是访问标记的一部分，不影响岛屿数量的计算。

示例与反例
----------

一个岛屿
~~~~~~~~

.. code-block:: text

   1 1 1 1 0
   1 1 0 1 0
   1 1 0 0 0
   0 0 0 0 0

全部陆地通过四方向连通，答案为 ``1``。

多个岛屿
~~~~~~~~

.. code-block:: text

   1 1 0 0 0
   1 1 0 0 0
   0 0 1 0 0
   0 0 0 1 1

左上、中央和右下分别构成三个连通分量，答案为 ``3``。

对角线不能合并
~~~~~~~~~~~~~~

.. code-block:: text

   1 0
   0 1

两个陆地只在对角线上接触，答案是 ``2``，不能按八邻接误判为一个岛屿。

边界情况
~~~~~~~~

* 全水网格返回 ``0``；
* 全陆网格返回 ``1``；
* 单行与单列仍按左右或上下相邻；
* 空网格和零列网格扩展返回 ``0``；
* 网格必须是矩形，平台输入保证各行列数一致。

问题抽象与解法选择
------------------

把每个陆地格看成图中的一个顶点，四邻接陆地之间存在边。题目要求的是这个隐式无向图的连通分量数量。

按行扫描网格。遇到仍为 ``'1'`` 的格子时：

#. 它尚未属于任何已处理分量，因此发现了一个新岛屿，计数加一；
#. 把该格立即改成 ``'0'`` 并压入工作栈；
#. 迭代弹出坐标，检查四个邻居；
#. 每个仍为 ``'1'`` 的邻居在压栈前立即改成 ``'0'``；
#. 栈耗尽时，当前岛屿全部被清除，外层扫描继续。

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 核心工作空间
     - 取舍
   * - 外层扫描 + 迭代 DFS 原地标记
     - ``O(mn)``
     - 最坏 ``O(mn)``
     - 主解法；无递归深度风险，不分配 visited
   * - 外层扫描 + BFS 原地标记
     - ``O(mn)``
     - 最坏 ``O(mn)``
     - 同样正确，队列语义更接近波纹扩展
   * - 递归 DFS
     - ``O(mn)``
     - 最坏 ``O(mn)`` 调用栈
     - 代码短，狭长全陆网格可能栈溢出
   * - 额外 ``visited`` 矩阵
     - ``O(mn)``
     - ``O(mn)`` 加工作队列或栈
     - 保留输入，但重复存储访问状态
   * - 并查集
     - 近似 ``O(mn α(mn))``
     - ``O(mn)``
     - 适合动态合并扩展，本题状态更重

这里 ``m`` 是行数，``n`` 是列数。迭代栈在最坏情况下可同时保存大量已发现但尚未扩展的
陆地，不能声称 ``O(1)``。

发现、标记与工作栈不变量
------------------------

外层扫描按固定行列顺序访问每个格子。仍为 ``'1'`` 的格子表示：它既未被更早岛屿的洪泛
访问，也未被当前洪泛发现。

开始一次洪泛时，先执行：

.. code-block:: text

   islands += 1
   grid[row][col] = '0'
   stack.push((row, col))

洪泛循环开始前保持：

* 栈中的每个坐标原本是陆地，并且已经改成 ``'0'``；
* 栈中坐标与本次起点四邻接连通；
* 已从栈弹出的坐标已经检查全部四个邻居；
* 当前分量中已发现但尚未扩展的格子全部在栈中；
* 仍为 ``'1'`` 的格子尚未被任何洪泛发现；
* 每个格子最多入栈一次。

为什么必须入栈前标记
~~~~~~~~~~~~~~~~~~~~

同一个陆地格可能同时邻接多个已发现格子。若等到出栈时才标记，它会在第一次出栈前被
多个邻居重复压入栈。入栈前立即改成 ``'0'`` 后，后续邻居看到的已不是 ``'1'``，因此无法
重复压栈。

为什么修改输入足以替代 visited
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

合法输入只有 ``'0'`` 和 ``'1'``。把已发现陆地改成 ``'0'`` 后，“是否仍为 ``'1'``”
同时承担“是陆地”和“尚未访问”两层判断。算法不需要单独的布尔矩阵，代价是原网格内容
不再保留。

正确性证明
----------

引理一：一次洪泛访问的格子都属于起点岛屿
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

起点显然属于自身连通分量。之后只有从已属于当前分量的格子，沿一条上、下、左、右边
扩展到仍为陆地的邻居。把这条边接到已有路径上，新格子也与起点四邻接连通。因此洪泛
不会越过水格，也不会吞并仅对角接触的其他岛屿。

引理二：一次洪泛会访问起点岛屿的全部格子
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

任取与起点同属一个岛屿的陆地格。根据连通定义，存在一条只经过陆地的四邻接路径从起点
到该格。洪泛从起点开始，处理路径上每个已发现格子时都会检查下一格；下一格若尚未发现
仍为 ``'1'``，就会被标记并压栈。沿路径归纳，目标格最终必然被访问。

引理三：每个格子最多入栈一次
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

格子只有在值为 ``'1'`` 时才会入栈，并且在入栈之前立即改为 ``'0'``。此后它永远不再
满足入栈条件，因此最多入栈一次。

引理四：外层扫描每次计数恰好对应一个尚未计数的岛屿
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若扫描到 ``'1'``，该格未被此前任何洪泛访问。根据引理二，若它属于已计数岛屿，那个岛屿
的洪泛应已把它改成 ``'0'``，矛盾。因此它属于一个新岛屿，计数加一正确。

反过来，任意岛屿在外层扫描中都有一个最早被访问的位置。在此之前没有同岛格子启动洪泛，
所以该位置仍为 ``'1'``，必然触发一次计数。根据引理二，这次洪泛清除整个岛屿，后续
同岛格子不会再次计数。

定理：算法返回岛屿总数
~~~~~~~~~~~~~~~~~~~~~~

由引理四，每个岛屿恰好触发一次计数，且每次计数都对应一个真实岛屿。因此最终计数与
四邻接陆地连通分量数量完全相等。

终止性
~~~~~~

外层扫描遍历有限的 ``m*n`` 个格子。由引理三，每个格子最多入栈一次，洪泛循环也只执行
有限次。所有循环最终终止。

人工状态推演
------------

对角接触
~~~~~~~~

网格 ``[[1,0],[0,1]]``：

#. 扫描 ``(0,0)``，计数变为 1；洪泛找不到四邻接陆地；
#. ``(0,1)`` 与 ``(1,0)`` 是水；
#. 扫描 ``(1,1)``，它仍为陆地，计数变为 2；
#. 返回 2。

多个岛屿
~~~~~~~~

对示例三岛网格，左上第一个 ``'1'`` 启动洪泛并清除左上四格；中央 ``'1'`` 第二次启动；
右下第一个 ``'1'`` 第三次启动并清除两个相邻格。之后不存在 ``'1'``，返回 3。

全陆与狭长网格
~~~~~~~~~~~~~~

全陆网格第一次扫描就启动洪泛，所有格子通过四邻接路径被标记，之后不再计数，答案为 1。
单行或单列全陆网格也可能形成长度 ``mn`` 的深路径；迭代栈避免递归调用栈溢出。

复杂度与实现边界
----------------

* 外层扫描检查每格一次；每个陆地格最多入栈、出栈和检查四邻居一次，时间复杂度 ``O(mn)``；
* 工作栈最坏保存 ``O(mn)`` 个坐标；
* 没有额外 ``visited`` 矩阵，访问状态复用输入网格；
* C++ 工作栈最坏保存 ``O(mn)`` 个坐标，访问状态复用输入网格，不另建 ``visited`` 矩阵；
* 官方 ``m,n <= 300``，编码坐标和岛屿计数均处于普通整数安全范围；
* 输入网格在遍历过程中被清零，返回值只表示岛屿数量。

十语言实现
----------

C
~

.. code-block:: c

   #include <stddef.h>
   #include <stdint.h>
   #include <stdlib.h>

   int numIslands(char **grid, int gridSize, int *gridColSize) {
       if (grid == NULL || gridSize <= 0 ||
           gridColSize == NULL || gridColSize[0] <= 0) {
           return 0;
       }

       int columns = gridColSize[0];
       for (int row = 1; row < gridSize; ++row) {
           if (gridColSize[row] != columns) {
               return -1;
           }
       }

       size_t rows = (size_t)gridSize;
       size_t cols = (size_t)columns;
       if (cols != 0 && rows > SIZE_MAX / cols) {
           return -1;
       }
       size_t capacity = rows * cols;
       if (capacity > SIZE_MAX / sizeof(size_t)) {
           return -1;
       }

       size_t *stack = malloc(capacity * sizeof(*stack));
       if (stack == NULL) {
           return -1;
       }

       const int row_step[4] = {1, -1, 0, 0};
       const int col_step[4] = {0, 0, 1, -1};
       int islands = 0;

       for (int row = 0; row < gridSize; ++row) {
           for (int col = 0; col < columns; ++col) {
               if (grid[row][col] != '1') {
                   continue;
               }

               ++islands;
               size_t top = 0;
               grid[row][col] = '0';
               stack[top++] = (size_t)row * cols + (size_t)col;

               while (top > 0) {
                   size_t encoded = stack[--top];
                   int current_row = (int)(encoded / cols);
                   int current_col = (int)(encoded % cols);

                   for (int direction = 0; direction < 4; ++direction) {
                       int next_row = current_row + row_step[direction];
                       int next_col = current_col + col_step[direction];

                       if (next_row >= 0 && next_row < gridSize &&
                           next_col >= 0 && next_col < columns &&
                           grid[next_row][next_col] == '1') {
                           grid[next_row][next_col] = '0';
                           stack[top++] =
                               (size_t)next_row * cols + (size_t)next_col;
                       }
                   }
               }
           }
       }

       free(stack);
       return islands;
   }

C++
~~~

.. code-block:: cpp

   #include <utility>
   #include <vector>

   class Solution {
   public:
       int numIslands(std::vector<std::vector<char>>& grid) {
           if (grid.empty() || grid[0].empty()) {
               return 0;
           }

           const int rows = static_cast<int>(grid.size());
           const int cols = static_cast<int>(grid[0].size());
           const int rowStep[4] = {1, -1, 0, 0};
           const int colStep[4] = {0, 0, 1, -1};
           int islands = 0;
           std::vector<std::pair<int, int>> stack;

           for (int row = 0; row < rows; ++row) {
               for (int col = 0; col < cols; ++col) {
                   if (grid[row][col] != '1') {
                       continue;
                   }

                   ++islands;
                   grid[row][col] = '0';
                   stack.push_back({row, col});

                   while (!stack.empty()) {
                       auto [currentRow, currentCol] = stack.back();
                       stack.pop_back();

                       for (int direction = 0; direction < 4; ++direction) {
                           int nextRow = currentRow + rowStep[direction];
                           int nextCol = currentCol + colStep[direction];
                           if (nextRow >= 0 && nextRow < rows &&
                               nextCol >= 0 && nextCol < cols &&
                               grid[nextRow][nextCol] == '1') {
                               grid[nextRow][nextCol] = '0';
                               stack.push_back({nextRow, nextCol});
                           }
                       }
                   }
               }
           }

           return islands;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def numIslands(self, grid: list[list[str]]) -> int:
           if not grid or not grid[0]:
               return 0

           rows = len(grid)
           cols = len(grid[0])
           directions = ((1, 0), (-1, 0), (0, 1), (0, -1))
           islands = 0

           for row in range(rows):
               for col in range(cols):
                   if grid[row][col] != "1":
                       continue

                   islands += 1
                   grid[row][col] = "0"
                   stack = [(row, col)]

                   while stack:
                       current_row, current_col = stack.pop()
                       for row_step, col_step in directions:
                           next_row = current_row + row_step
                           next_col = current_col + col_step
                           if (
                               0 <= next_row < rows
                               and 0 <= next_col < cols
                               and grid[next_row][next_col] == "1"
                           ):
                               grid[next_row][next_col] = "0"
                               stack.append((next_row, next_col))

           return islands

Java
~~~~

.. code-block:: java

   class Solution {
       public int numIslands(char[][] grid) {
           if (grid.length == 0 || grid[0].length == 0) {
               return 0;
           }

           int rows = grid.length;
           int cols = grid[0].length;
           int[] stack = new int[rows * cols];
           int[] rowStep = {1, -1, 0, 0};
           int[] colStep = {0, 0, 1, -1};
           int islands = 0;

           for (int row = 0; row < rows; row++) {
               for (int col = 0; col < cols; col++) {
                   if (grid[row][col] != '1') {
                       continue;
                   }

                   islands++;
                   int top = 0;
                   grid[row][col] = '0';
                   stack[top++] = row * cols + col;

                   while (top > 0) {
                       int encoded = stack[--top];
                       int currentRow = encoded / cols;
                       int currentCol = encoded % cols;

                       for (int direction = 0; direction < 4; direction++) {
                           int nextRow = currentRow + rowStep[direction];
                           int nextCol = currentCol + colStep[direction];
                           if (nextRow >= 0 && nextRow < rows
                               && nextCol >= 0 && nextCol < cols
                               && grid[nextRow][nextCol] == '1') {
                               grid[nextRow][nextCol] = '0';
                               stack[top++] = nextRow * cols + nextCol;
                           }
                       }
                   }
               }
           }

           return islands;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn num_islands(mut grid: Vec<Vec<char>>) -> i32 {
           if grid.is_empty() || grid[0].is_empty() {
               return 0;
           }

           let rows = grid.len();
           let cols = grid[0].len();
           let directions = [(1_i32, 0_i32), (-1, 0), (0, 1), (0, -1)];
           let mut islands = 0_i32;
           let mut stack: Vec<(usize, usize)> = Vec::new();

           for row in 0..rows {
               for col in 0..cols {
                   if grid[row][col] != '1' {
                       continue;
                   }

                   islands += 1;
                   grid[row][col] = '0';
                   stack.push((row, col));

                   while let Some((current_row, current_col)) = stack.pop() {
                       for &(row_step, col_step) in &directions {
                           let next_row = current_row as i32 + row_step;
                           let next_col = current_col as i32 + col_step;
                           if next_row >= 0
                               && next_row < rows as i32
                               && next_col >= 0
                               && next_col < cols as i32
                           {
                               let next_row = next_row as usize;
                               let next_col = next_col as usize;
                               if grid[next_row][next_col] == '1' {
                                   grid[next_row][next_col] = '0';
                                   stack.push((next_row, next_col));
                               }
                           }
                       }
                   }
               }
           }

           islands
       }
   }

Go
~~

.. code-block:: go

   func numIslands(grid [][]byte) int {
       if len(grid) == 0 || len(grid[0]) == 0 {
           return 0
       }

       rows := len(grid)
       cols := len(grid[0])
       rowStep := [4]int{1, -1, 0, 0}
       colStep := [4]int{0, 0, 1, -1}
       stack := make([]int, 0)
       islands := 0

       for row := 0; row < rows; row++ {
           for col := 0; col < cols; col++ {
               if grid[row][col] != '1' {
                   continue
               }

               islands++
               grid[row][col] = '0'
               stack = append(stack, row*cols+col)

               for len(stack) > 0 {
                   encoded := stack[len(stack)-1]
                   stack = stack[:len(stack)-1]
                   currentRow := encoded / cols
                   currentCol := encoded % cols

                   for direction := 0; direction < 4; direction++ {
                       nextRow := currentRow + rowStep[direction]
                       nextCol := currentCol + colStep[direction]
                       if nextRow >= 0 && nextRow < rows &&
                           nextCol >= 0 && nextCol < cols &&
                           grid[nextRow][nextCol] == '1' {
                           grid[nextRow][nextCol] = '0'
                           stack = append(stack, nextRow*cols+nextCol)
                       }
                   }
               }
           }
       }

       return islands
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function numIslands(grid: string[][]): number {
       if (grid.length === 0 || grid[0].length === 0) {
           return 0;
       }

       const rows = grid.length;
       const cols = grid[0].length;
       const rowStep = [1, -1, 0, 0];
       const colStep = [0, 0, 1, -1];
       const stack: number[] = [];
       let islands = 0;

       for (let row = 0; row < rows; row++) {
           for (let col = 0; col < cols; col++) {
               if (grid[row][col] !== "1") {
                   continue;
               }

               islands++;
               grid[row][col] = "0";
               stack.push(row * cols + col);

               while (stack.length > 0) {
                   const encoded = stack.pop()!;
                   const currentRow = Math.floor(encoded / cols);
                   const currentCol = encoded % cols;

                   for (let direction = 0; direction < 4; direction++) {
                       const nextRow = currentRow + rowStep[direction];
                       const nextCol = currentCol + colStep[direction];
                       if (
                           nextRow >= 0
                           && nextRow < rows
                           && nextCol >= 0
                           && nextCol < cols
                           && grid[nextRow][nextCol] === "1"
                       ) {
                           grid[nextRow][nextCol] = "0";
                           stack.push(nextRow * cols + nextCol);
                       }
                   }
               }
           }
       }

       return islands;
   }

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       public int NumIslands(char[][] grid) {
           if (grid.Length == 0 || grid[0].Length == 0) {
               return 0;
           }

           int rows = grid.Length;
           int cols = grid[0].Length;
           int[] rowStep = { 1, -1, 0, 0 };
           int[] colStep = { 0, 0, 1, -1 };
           var stack = new Stack<int>();
           int islands = 0;

           for (int row = 0; row < rows; row++) {
               for (int col = 0; col < cols; col++) {
                   if (grid[row][col] != '1') {
                       continue;
                   }

                   islands++;
                   grid[row][col] = '0';
                   stack.Push(row * cols + col);

                   while (stack.Count > 0) {
                       int encoded = stack.Pop();
                       int currentRow = encoded / cols;
                       int currentCol = encoded % cols;

                       for (int direction = 0; direction < 4; direction++) {
                           int nextRow = currentRow + rowStep[direction];
                           int nextCol = currentCol + colStep[direction];
                           if (nextRow >= 0 && nextRow < rows
                               && nextCol >= 0 && nextCol < cols
                               && grid[nextRow][nextCol] == '1') {
                               grid[nextRow][nextCol] = '0';
                               stack.Push(nextRow * cols + nextCol);
                           }
                       }
                   }
               }
           }

           return islands;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function num_islands!(grid::Matrix{Char})
       rows, cols = size(grid)
       (rows == 0 || cols == 0) && return 0

       row_step = (1, -1, 0, 0)
       col_step = (0, 0, 1, -1)
       stack = Tuple{Int, Int}[]
       islands = 0

       for row in 1:rows
           for col in 1:cols
               grid[row, col] == '1' || continue

               islands += 1
               grid[row, col] = '0'
               push!(stack, (row, col))

               while !isempty(stack)
                   current_row, current_col = pop!(stack)
                   for direction in 1:4
                       next_row = current_row + row_step[direction]
                       next_col = current_col + col_step[direction]
                       if 1 <= next_row <= rows &&
                          1 <= next_col <= cols &&
                          grid[next_row, next_col] == '1'
                           grid[next_row, next_col] = '0'
                           push!(stack, (next_row, next_col))
                       end
                   end
               end
           end
       end

       return islands
   end

R
~

.. code-block:: r

   num_islands <- function(grid) {
     if (length(grid) == 0L || nrow(grid) == 0L || ncol(grid) == 0L) {
       return(0L)
     }

     rows <- nrow(grid)
     cols <- ncol(grid)
     stack_rows <- integer(rows * cols)
     stack_cols <- integer(rows * cols)
     row_step <- c(1L, -1L, 0L, 0L)
     col_step <- c(0L, 0L, 1L, -1L)
     islands <- 0L

     for (row in seq_len(rows)) {
       for (col in seq_len(cols)) {
         if (grid[row, col] != "1") {
           next
         }

         islands <- islands + 1L
         top <- 1L
         grid[row, col] <- "0"
         stack_rows[top] <- row
         stack_cols[top] <- col

         while (top > 0L) {
           current_row <- stack_rows[top]
           current_col <- stack_cols[top]
           top <- top - 1L

           for (direction in seq_len(4L)) {
             next_row <- current_row + row_step[direction]
             next_col <- current_col + col_step[direction]
             if (next_row >= 1L && next_row <= rows &&
                 next_col >= 1L && next_col <= cols &&
                 grid[next_row, next_col] == "1") {
               grid[next_row, next_col] <- "0"
               top <- top + 1L
               stack_rows[top] <- next_row
               stack_cols[top] <- next_col
             }
           }
         }
       }
     }

     islands
   }

静态审查记录
------------

本章未运行、未编译、未提交到在线判题，也未进行随机对拍、穷举、属性测试或 sanitizer。已完成：

* 人工推演单岛、多岛、全水、全陆、单行、单列、对角接触和空网格扩展；
* 证明外层首次发现与岛屿一一对应、洪泛不跨越水格、完整覆盖当前四邻接分量；
* 核对所有实现都在压栈前标记，保证每格最多入栈一次；
* 逐语言核对矩形尺寸、坐标边界、字符类型、栈操作和输入变异；
* 专项检查 C 的 ``rows*cols`` 溢出、字节数溢出、单块释放与 ``-1`` 失败返回；
* 专项检查 Rust 的有符号邻居坐标转换，避免负数直接转 ``usize``；
* 专项检查 TypeScript 编码坐标仍处于精确整数范围；
* 专项检查 Julia 一基索引和 R 的 ``seq_len``、预分配栈、调用帧重绑定与写时复制成本。

剩余风险：十语言代码只经过静态审查，未实际确认目标平台的容器定义、编译器版本和内存行为。
C 的 ``-1`` 是资源或非矩形输入的扩展错误值；官方合法输入上的岛屿数始终非负。R 是否实际
复制底层矩阵由运行时对象共享状态决定，但语言层面的调用者绑定不会被本函数改写；核心算法
虽不分配 visited，适配器仍可能复制整个矩阵。

关键边界与失败模式
------------------

* 把对角线算作邻接：会错误合并独立岛屿；
* 每扫描到一个 ``'1'`` 就计数，但不先洪泛清除分量：同一岛屿会重复计数；
* 出栈后才标记：同一格可能被多个邻居重复压栈；
* 修改输入却在接口说明中声称只读；
* 使用递归但忽略 ``mn`` 深度的狭长全陆网格；
* 未检查空网格就访问第一行；
* C 直接用有符号 ``int`` 计算 ``rows*cols``：乘法可能先溢出；
* 宣称不分配 visited 就是 ``O(1)``：工作栈最坏仍为 ``O(mn)``。

知识更新与关联题目
------------------

本题新增：

* “扫描到未访问顶点就计数并遍历整个分量”这一无向图连通分量计数模式；
* 外层首次发现与连通分量之间的一一对应证明；
* 迭代栈清除分量时，最坏前沿仍可能达到 ``O(mn)``。

本题强化：

* ``0130`` 的四邻接与加入搜索前立即标记；本题永久清零，不能混同于 ``0212`` 的路径标记后恢复；
* ``0073``、``0130`` 的 R 矩阵返回适配，以及 ``0189`` 的跨语言可变输入可见性；
* C 中二维容量先提升到 ``size_t``、检查乘法与字节数，再形成可完整清理的资源路径；
* 递归 DFS 与显式栈具有相同渐进深度，显式栈把调用栈溢出风险转成堆上工作空间。

自检问题与答案
--------------

#. 为什么外层扫描到 ``'1'`` 时一定发现了新岛屿？

   已计数岛屿在启动洪泛时会完整清除其所有四邻接陆地；仍为 ``'1'`` 的格子不属于任何已处理分量。

#. 为什么标记时机必须在压栈前？

   这样其他邻居再次检查该格时已经看到 ``'0'``，不能重复压栈，保证每格最多处理一次。

#. 对角接触为什么不连通？

   契约只允许上、下、左、右移动；对角两个格子之间没有合法边。

#. 没有 visited 矩阵，为什么空间仍可能是 ``O(mn)``？

   一个巨大分量的显式工作栈最坏可以同时保存线性数量的已发现格子。

#. 哪些语言不会让调用者看到原网格被清零？

   Rust 平台按值消费网格，调用后原值已移动；R 的矩阵局部修改只重新绑定当前调用帧中的 ``grid``。
   其他本章接口修改共享或引用传递的网格。
