0130. Surrounded Regions
========================

题目信息
--------

:题号: 0130
:难度: Medium
:主题: 网格、广度优先搜索、连通分量、原地修改
:原题: `LeetCode 0130 <https://leetcode.com/problems/surrounded-regions/>`_
:访问状态: Available
:教学重点: 边界连通补集、入队即标记、两阶段改写、原地接口

题目重述
--------

给定一个只包含 ``X`` 和 ``O`` 的矩形网格。若某个 ``O`` 连通区域无法通过上下左右移动到达网格边界，
就把该区域中的全部 ``O`` 改成 ``X``；与边界连通的 ``O`` 保持不变。

本文采用以下契约：

* 网格可以为空；非空时各行长度相同；
* 字符域只有 ``X`` 和 ``O``；
* 连通关系只包含上下左右，不包含对角线；
* 除 R 适配器外，平台接口要求原地修改网格并且没有返回值；
* R 无法稳定表达平台的共享可变二维字符数组，适配器返回修改后的矩阵；
* 搜索期间使用临时字符 ``#``，它不属于合法输入字符域。

自建示例
--------

内部区域被翻转
~~~~~~~~~~~~~~

.. code-block:: text

   输入：
   X X X X
   X O O X
   X X O X
   X O X X

   输出：
   X X X X
   X X X X
   X X X X
   X O X X

右下角附近的 ``O`` 区域没有接触边界，因此被翻转；左下角 ``O`` 位于边界，必须保留。

单行网格
~~~~~~~~

.. code-block:: text

   输入：O X O O
   输出：O X O O

单行中的每个单元格都在边界上，不存在被完全包围的区域。

问题抽象
--------

直接逐个寻找“被包围区域”需要判断每个连通分量是否接触边界。更直接的反向思考是：

* 所有边界 ``O`` 一定安全；
* 与这些边界 ``O`` 连通的全部 ``O`` 也安全；
* 搜索结束后仍未标记的 ``O`` 才是应被翻转的补集。

因此先从边界多源 BFS 标记安全区域，再扫描整个网格完成翻转和恢复。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 定位
   * - 边界多源 BFS + 临时标记
     - ``O(mn)``
     - ``O(mn)``
     - 主解法；直接标记必须保留的补集
   * - 边界多源 DFS
     - ``O(mn)``
     - ``O(mn)`` 递归栈最坏
     - 代码短，深网格可能栈溢出
   * - 逐连通分量收集后决定
     - ``O(mn)``
     - ``O(mn)``
     - 每个分量需要暂存全部坐标
   * - 并查集连接虚拟边界节点
     - 近似 ``O(mn α(mn))``
     - ``O(mn)``
     - 状态更重，不适合本题主讲

这里 ``m`` 是行数，``n`` 是列数。BFS 避免递归深度风险，并让“入队即标记”的状态更明确。

主解法：从边界标记安全补集
--------------------------

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

搜索阶段维护：

* ``queue``：已经标记为 ``#``、等待扩展的安全单元格；
* ``#``：已经确认与边界连通的原始 ``O``；
* 仍为 ``O`` 的单元格：尚未证明安全；
* ``X``：阻断连通，不进入队列。

每次从队列取出坐标前保持：

#. 队列中的每个坐标原本都是 ``O``，并且存在一条只经过原始 ``O`` 的路径连接到边界；
#. 每个已标记 ``#`` 的单元格最多入队一次；
#. 所有已发现但尚未扩展的安全单元格都在队列中；
#. 搜索不会越界，也不会把 ``X`` 当作可通行节点。

为什么入队时就标记
~~~~~~~~~~~~~~~~~~

若等到出队时才把 ``O`` 改成 ``#``，同一个单元格可能被多个相邻节点重复加入队列。入队前检查 ``O``，
入队时立即改成 ``#``，使“仍为 ``O``”同时表示“尚未访问”，不需要额外布尔矩阵。

两阶段改写
~~~~~~~~~~

搜索完成后执行一次全网格扫描：

* ``O -> X``：它从未被边界搜索到，属于被包围区域；
* ``# -> O``：它与边界连通，只是搜索期间暂时改名；
* ``X`` 保持不变。

不能在 BFS 过程中直接把内部 ``O`` 改成 ``X``，因为搜索只知道安全区域，尚未访问不等于最终不安全。

正确性依据
~~~~~~~~~~

**标记合法。** 初始入队的单元格位于边界且为 ``O``，显然安全。若队列中的安全单元格扩展到相邻 ``O``，
把该相邻边连接到已有边界路径后，它也与边界连通，因此所有 ``#`` 都必须保留。

**安全区域完整。** 任取一个与边界连通的 ``O``。它存在一条从某个边界 ``O`` 到自身的四方向 ``O`` 路径。
多源 BFS 从路径起点出发，按路径顺序逐个访问相邻 ``O``，最终必然将该单元格标记为 ``#``。

**剩余 O 可翻转。** 搜索后仍为 ``O`` 的单元格若能到达边界，根据上一段应已被标记，产生矛盾。因此它所在
连通分量不接触边界，满足被包围定义，翻转为 ``X`` 正确。

**恢复正确。** 每个 ``#`` 都来自原始 ``O`` 且已证明安全，恢复成 ``O`` 恰好还原所有应保留区域。

**终止性。** 网格有限，每个 ``O`` 最多入队一次，队列最终耗尽；最终扫描也遍历有限单元格。

复杂度与语言边界
~~~~~~~~~~~~~~~~

* 每个单元格在边界初始化、BFS 和最终扫描中只被处理常数次，时间 ``O(mn)``；
* 队列最坏保存 ``O(mn)`` 个坐标，额外空间 ``O(mn)``；
* 临时字符直接复用网格存储，不需要额外访问矩阵；
* C 分别分配行、列队列，容量为 ``m*n``；乘法先转换为 ``size_t``；
* C++、Python、Java、Rust、Go、TypeScript、C# 和 Julia 都原地修改调用者可见网格；
* R 矩阵赋值遵循值语义适配，函数返回新矩阵，调用者必须接收返回值；
* Rust、Go 和 Julia 的字符表示不同，但这里只比较固定 ASCII 字符。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stddef.h>
   #include <stdlib.h>

   static void enqueue_if_open(
       char **board,
       int row,
       int col,
       int *queue_rows,
       int *queue_cols,
       int *tail
   ) {
       if (board[row][col] != 'O') {
           return;
       }
       board[row][col] = '#';
       queue_rows[*tail] = row;
       queue_cols[*tail] = col;
       ++*tail;
   }

   void solve(char **board, int boardSize, int *boardColSize) {
       if (boardSize == 0 || boardColSize[0] == 0) {
           return;
       }

       int rows = boardSize;
       int cols = boardColSize[0];
       size_t capacity = (size_t)rows * (size_t)cols;
       int *queue_rows = malloc(capacity * sizeof(*queue_rows));
       int *queue_cols = malloc(capacity * sizeof(*queue_cols));
       if (queue_rows == NULL || queue_cols == NULL) {
           free(queue_rows);
           free(queue_cols);
           return;
       }

       int head = 0;
       int tail = 0;
       for (int col = 0; col < cols; ++col) {
           enqueue_if_open(
               board, 0, col,
               queue_rows, queue_cols, &tail
           );
           if (rows > 1) {
               enqueue_if_open(
                   board, rows - 1, col,
                   queue_rows, queue_cols, &tail
               );
           }
       }
       for (int row = 1; row + 1 < rows; ++row) {
           enqueue_if_open(
               board, row, 0,
               queue_rows, queue_cols, &tail
           );
           if (cols > 1) {
               enqueue_if_open(
                   board, row, cols - 1,
                   queue_rows, queue_cols, &tail
               );
           }
       }

       const int row_step[4] = {1, -1, 0, 0};
       const int col_step[4] = {0, 0, 1, -1};
       while (head < tail) {
           int row = queue_rows[head];
           int col = queue_cols[head];
           ++head;

           for (int direction = 0; direction < 4; ++direction) {
               int next_row = row + row_step[direction];
               int next_col = col + col_step[direction];
               if (next_row >= 0 && next_row < rows &&
                   next_col >= 0 && next_col < cols) {
                   enqueue_if_open(
                       board, next_row, next_col,
                       queue_rows, queue_cols, &tail
                   );
               }
           }
       }

       for (int row = 0; row < rows; ++row) {
           for (int col = 0; col < cols; ++col) {
               if (board[row][col] == 'O') {
                   board[row][col] = 'X';
               } else if (board[row][col] == '#') {
                   board[row][col] = 'O';
               }
           }
       }

       free(queue_rows);
       free(queue_cols);
   }

C++
~~~

.. code-block:: cpp

   #include <array>
   #include <queue>
   #include <utility>
   #include <vector>

   class Solution {
   public:
       void solve(std::vector<std::vector<char>>& board) {
           if (board.empty() || board[0].empty()) {
               return;
           }

           const int rows = static_cast<int>(board.size());
           const int cols = static_cast<int>(board[0].size());
           std::queue<std::pair<int, int>> queue;

           auto enqueue = [&](int row, int col) {
               if (board[row][col] == 'O') {
                   board[row][col] = '#';
                   queue.push({row, col});
               }
           };

           for (int col = 0; col < cols; ++col) {
               enqueue(0, col);
               enqueue(rows - 1, col);
           }
           for (int row = 1; row + 1 < rows; ++row) {
               enqueue(row, 0);
               enqueue(row, cols - 1);
           }

           const std::array<int, 4> row_step{1, -1, 0, 0};
           const std::array<int, 4> col_step{0, 0, 1, -1};
           while (!queue.empty()) {
               auto [row, col] = queue.front();
               queue.pop();
               for (int direction = 0; direction < 4; ++direction) {
                   int next_row = row + row_step[direction];
                   int next_col = col + col_step[direction];
                   if (next_row >= 0 && next_row < rows &&
                       next_col >= 0 && next_col < cols) {
                       enqueue(next_row, next_col);
                   }
               }
           }

           for (auto& line : board) {
               for (char& cell : line) {
                   if (cell == 'O') {
                       cell = 'X';
                   } else if (cell == '#') {
                       cell = 'O';
                   }
               }
           }
       }
   };

Python
~~~~~~

.. code-block:: python

   from collections import deque

   class Solution:
       def solve(self, board: list[list[str]]) -> None:
           if not board or not board[0]:
               return

           rows = len(board)
           cols = len(board[0])
           queue: deque[tuple[int, int]] = deque()

           def enqueue(row: int, col: int) -> None:
               if board[row][col] == "O":
                   board[row][col] = "#"
                   queue.append((row, col))

           for col in range(cols):
               enqueue(0, col)
               enqueue(rows - 1, col)
           for row in range(1, rows - 1):
               enqueue(row, 0)
               enqueue(row, cols - 1)

           while queue:
               row, col = queue.popleft()
               for row_step, col_step in (
                   (1, 0),
                   (-1, 0),
                   (0, 1),
                   (0, -1),
               ):
                   next_row = row + row_step
                   next_col = col + col_step
                   if (
                       0 <= next_row < rows
                       and 0 <= next_col < cols
                   ):
                       enqueue(next_row, next_col)

           for row in range(rows):
               for col in range(cols):
                   if board[row][col] == "O":
                       board[row][col] = "X"
                   elif board[row][col] == "#":
                       board[row][col] = "O"

Java
~~~~

.. code-block:: java

   import java.util.ArrayDeque;
   import java.util.Queue;

   class Solution {
       public void solve(char[][] board) {
           if (board.length == 0 || board[0].length == 0) {
               return;
           }

           int rows = board.length;
           int cols = board[0].length;
           Queue<int[]> queue = new ArrayDeque<>();

           for (int col = 0; col < cols; ++col) {
               enqueue(board, 0, col, queue);
               enqueue(board, rows - 1, col, queue);
           }
           for (int row = 1; row + 1 < rows; ++row) {
               enqueue(board, row, 0, queue);
               enqueue(board, row, cols - 1, queue);
           }

           int[][] directions = {
               {1, 0}, {-1, 0}, {0, 1}, {0, -1}
           };
           while (!queue.isEmpty()) {
               int[] cell = queue.remove();
               for (int[] direction : directions) {
                   int next_row = cell[0] + direction[0];
                   int next_col = cell[1] + direction[1];
                   if (next_row >= 0 && next_row < rows &&
                       next_col >= 0 && next_col < cols) {
                       enqueue(board, next_row, next_col, queue);
                   }
               }
           }

           for (int row = 0; row < rows; ++row) {
               for (int col = 0; col < cols; ++col) {
                   if (board[row][col] == 'O') {
                       board[row][col] = 'X';
                   } else if (board[row][col] == '#') {
                       board[row][col] = 'O';
                   }
               }
           }
       }

       private void enqueue(
           char[][] board,
           int row,
           int col,
           Queue<int[]> queue
       ) {
           if (board[row][col] == 'O') {
               board[row][col] = '#';
               queue.add(new int[] {row, col});
           }
       }
   }

Rust
~~~~

.. code-block:: rust

   use std::collections::VecDeque;

   impl Solution {
       pub fn solve(board: &mut Vec<Vec<char>>) {
           if board.is_empty() || board[0].is_empty() {
               return;
           }

           let rows = board.len();
           let cols = board[0].len();
           let mut queue = VecDeque::new();

           fn enqueue(
               board: &mut [Vec<char>],
               row: usize,
               col: usize,
               queue: &mut VecDeque<(usize, usize)>,
           ) {
               if board[row][col] == 'O' {
                   board[row][col] = '#';
                   queue.push_back((row, col));
               }
           }

           for col in 0..cols {
               enqueue(board, 0, col, &mut queue);
               enqueue(board, rows - 1, col, &mut queue);
           }
           for row in 1..rows.saturating_sub(1) {
               enqueue(board, row, 0, &mut queue);
               enqueue(board, row, cols - 1, &mut queue);
           }

           let directions = [(1_i32, 0_i32), (-1, 0), (0, 1), (0, -1)];
           while let Some((row, col)) = queue.pop_front() {
               for (row_step, col_step) in directions {
                   let next_row = row as i32 + row_step;
                   let next_col = col as i32 + col_step;
                   if next_row >= 0 && next_row < rows as i32 &&
                      next_col >= 0 && next_col < cols as i32 {
                       enqueue(
                           board,
                           next_row as usize,
                           next_col as usize,
                           &mut queue,
                       );
                   }
               }
           }

           for row in board.iter_mut() {
               for cell in row.iter_mut() {
                   if *cell == 'O' {
                       *cell = 'X';
                   } else if *cell == '#' {
                       *cell = 'O';
                   }
               }
           }
       }
   }

Go
~~

.. code-block:: go

   func solve(board [][]byte) {
       if len(board) == 0 || len(board[0]) == 0 {
           return
       }

       rows := len(board)
       cols := len(board[0])
       queue := make([][2]int, 0, rows*cols)

       enqueue := func(row int, col int) {
           if board[row][col] == 'O' {
               board[row][col] = '#'
               queue = append(queue, [2]int{row, col})
           }
       }

       for col := 0; col < cols; col++ {
           enqueue(0, col)
           enqueue(rows-1, col)
       }
       for row := 1; row+1 < rows; row++ {
           enqueue(row, 0)
           enqueue(row, cols-1)
       }

       directions := [][2]int{{1, 0}, {-1, 0}, {0, 1}, {0, -1}}
       for head := 0; head < len(queue); head++ {
           row := queue[head][0]
           col := queue[head][1]
           for _, direction := range directions {
               next_row := row + direction[0]
               next_col := col + direction[1]
               if next_row >= 0 && next_row < rows &&
                   next_col >= 0 && next_col < cols {
                   enqueue(next_row, next_col)
               }
           }
       }

       for row := 0; row < rows; row++ {
           for col := 0; col < cols; col++ {
               if board[row][col] == 'O' {
                   board[row][col] = 'X'
               } else if board[row][col] == '#' {
                   board[row][col] = 'O'
               }
           }
       }
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function solve(board: string[][]): void {
       if (board.length === 0 || board[0].length === 0) {
           return;
       }

       const rows = board.length;
       const cols = board[0].length;
       const queue: Array<[number, number]> = [];

       const enqueue = (row: number, col: number): void => {
           if (board[row][col] === "O") {
               board[row][col] = "#";
               queue.push([row, col]);
           }
       };

       for (let col = 0; col < cols; col += 1) {
           enqueue(0, col);
           enqueue(rows - 1, col);
       }
       for (let row = 1; row + 1 < rows; row += 1) {
           enqueue(row, 0);
           enqueue(row, cols - 1);
       }

       const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
       for (let head = 0; head < queue.length; head += 1) {
           const [row, col] = queue[head];
           for (const [row_step, col_step] of directions) {
               const next_row = row + row_step;
               const next_col = col + col_step;
               if (
                   next_row >= 0 && next_row < rows &&
                   next_col >= 0 && next_col < cols
               ) {
                   enqueue(next_row, next_col);
               }
           }
       }

       for (let row = 0; row < rows; row += 1) {
           for (let col = 0; col < cols; col += 1) {
               if (board[row][col] === "O") {
                   board[row][col] = "X";
               } else if (board[row][col] === "#") {
                   board[row][col] = "O";
               }
           }
       }
   }

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       public void Solve(char[][] board) {
           if (board.Length == 0 || board[0].Length == 0) {
               return;
           }

           int rows = board.Length;
           int cols = board[0].Length;
           var queue = new Queue<(int Row, int Col)>();

           void Enqueue(int row, int col) {
               if (board[row][col] == 'O') {
                   board[row][col] = '#';
                   queue.Enqueue((row, col));
               }
           }

           for (int col = 0; col < cols; ++col) {
               Enqueue(0, col);
               Enqueue(rows - 1, col);
           }
           for (int row = 1; row + 1 < rows; ++row) {
               Enqueue(row, 0);
               Enqueue(row, cols - 1);
           }

           int[,] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
           while (queue.Count > 0) {
               var (row, col) = queue.Dequeue();
               for (int direction = 0; direction < 4; ++direction) {
                   int next_row = row + directions[direction, 0];
                   int next_col = col + directions[direction, 1];
                   if (next_row >= 0 && next_row < rows &&
                       next_col >= 0 && next_col < cols) {
                       Enqueue(next_row, next_col);
                   }
               }
           }

           for (int row = 0; row < rows; ++row) {
               for (int col = 0; col < cols; ++col) {
                   if (board[row][col] == 'O') {
                       board[row][col] = 'X';
                   } else if (board[row][col] == '#') {
                       board[row][col] = 'O';
                   }
               }
           }
       }
   }

Julia
~~~~~

.. code-block:: julia

   function solve!(board::Matrix{Char})::Nothing
       rows, cols = size(board)
       (rows == 0 || cols == 0) && return nothing

       queue = Tuple{Int, Int}[]
       function enqueue(row::Int, col::Int)::Nothing
           if board[row, col] == 'O'
               board[row, col] = '#'
               push!(queue, (row, col))
           end
           return nothing
       end

       for col in 1:cols
           enqueue(1, col)
           enqueue(rows, col)
       end
       if rows >= 3
           for row in 2:(rows - 1)
               enqueue(row, 1)
               enqueue(row, cols)
           end
       end

       directions = ((1, 0), (-1, 0), (0, 1), (0, -1))
       head = 1
       while head <= length(queue)
           row, col = queue[head]
           head += 1
           for (row_step, col_step) in directions
               next_row = row + row_step
               next_col = col + col_step
               if 1 <= next_row <= rows && 1 <= next_col <= cols
                   enqueue(next_row, next_col)
               end
           end
       end

       for index in eachindex(board)
           if board[index] == 'O'
               board[index] = 'X'
           elseif board[index] == '#'
               board[index] = 'O'
           end
       end
       return nothing
   end

R
~

R 适配器返回修改后的字符矩阵，调用方式为 ``board <- solve_regions(board)``。

.. code-block:: r

   solve_regions <- function(board) {
     rows <- nrow(board)
     cols <- ncol(board)
     if (rows == 0L || cols == 0L) {
       return(board)
     }

     queue_rows <- integer(rows * cols)
     queue_cols <- integer(rows * cols)
     head <- 1L
     tail <- 0L

     enqueue <- function(row, col) {
       if (board[row, col] == "O") {
         board[row, col] <<- "#"
         tail <<- tail + 1L
         queue_rows[tail] <<- row
         queue_cols[tail] <<- col
       }
       invisible(NULL)
     }

     for (col in seq_len(cols)) {
       enqueue(1L, col)
       enqueue(rows, col)
     }
     if (rows >= 3L) {
       for (row in 2L:(rows - 1L)) {
         enqueue(row, 1L)
         enqueue(row, cols)
       }
     }

     row_step <- c(1L, -1L, 0L, 0L)
     col_step <- c(0L, 0L, 1L, -1L)
     while (head <= tail) {
       row <- queue_rows[head]
       col <- queue_cols[head]
       head <- head + 1L
       for (direction in seq_len(4L)) {
         next_row <- row + row_step[direction]
         next_col <- col + col_step[direction]
         if (
           next_row >= 1L && next_row <= rows &&
           next_col >= 1L && next_col <= cols
         ) {
           enqueue(next_row, next_col)
         }
       }
     }

     board[board == "O"] <- "X"
     board[board == "#"] <- "O"
     board
   }

验证计划与证据
--------------

本次返工运行空网格、单行、单列、全 ``X``、全 ``O``、多个独立内部区域、边界细通道和对角线不连通案例。
Python 主实现与“逐连通分量收集坐标、检查是否接触边界”的独立基准完成 1000 个随机网格对拍，结果一致。
C++ 主实现使用 C++17 严格警告编译并运行代表案例。C、Java、Go、TypeScript 完成边界初始化、队列容量和
原地修改静态复核；Rust、C#、Julia、R 完成索引、可变捕获和适配器返回语义静态检查。未声称全部语言实际运行。

关键边界
--------

* 空网格或零列网格直接返回；
* 单行、单列中的全部 ``O`` 都位于边界，必须保留；
* 四个角可能被多次尝试入队，但入队即标记保证只进入一次；
* 对角线不构成连通；
* 临时标记必须选择输入域之外字符，并在最终扫描中恢复；
* R 调用者必须接收返回矩阵，不能假设函数原地修改外部绑定。

易错点
------

* 从内部 ``O`` 出发直接翻转，尚未确认该分量是否通过远处路径连接边界；
* 只从四个角搜索，遗漏边界中间的安全区域；
* 入队后不立即标记，导致同一单元格重复入队；
* 最终扫描只翻转 ``O``，忘记把 ``#`` 恢复为 ``O``；
* 把对角线当作连通边；
* 在 Julia 中无条件写 ``2:(rows-1)`` 前未证明边界，或在 R 中构造方向错误的序列；
* 把 R 的局部矩阵修改误称为调用者可见的原地修改。

本题新增知识
------------

* 从边界出发标记“必须保留集合”，再处理其补集；
* 用输入域外临时标记同时表达访问状态和安全状态；
* 多源 BFS 可以把全部边界起点放入同一队列。

本题强化知识
------------

* 入队即标记避免重复状态；
* 网格邻接的边界检查和四方向遍历；
* 原地算法、队列工作空间与语言值语义适配需要分别说明。

关联题目
--------

* `0079. Word Search <../0001-0100/0079-word-search.rst>`_：网格 DFS、访问标记与路径恢复；
* `0127. Word Ladder <0127-word-ladder.rst>`_：隐式图上的 BFS 与入队即标记；
* `0133. Clone Graph <0133-clone-graph.rst>`_：显式图上的访问映射。

最小自检
--------

#. 为什么从边界 ``O`` 出发能找到全部必须保留的区域？
#. 为什么搜索结束后仍为 ``O`` 的单元格一定可以翻转？
#. 为什么要在入队时改成 ``#``，而不是出队时再改？
#. R 适配器与其他语言的接口差异是什么？

答案要点
~~~~~~~~

#. 任意不应翻转的 ``O`` 都必须与某个边界 ``O`` 四方向连通，多源搜索会沿该路径到达它；
#. 若它能到边界，就应已被完整性证明标记为 ``#``，仍为 ``O`` 说明不接触边界；
#. 入队时标记让后续相邻节点无法重复加入同一坐标；
#. 其他语言修改调用者可见网格，R 函数返回修改后的矩阵，调用者需要重新绑定。
