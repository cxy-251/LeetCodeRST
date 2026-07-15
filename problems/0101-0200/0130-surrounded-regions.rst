0130. Surrounded Regions
========================

题目信息
--------

:题号: 0130
:难度: Medium
:主题: 网格、广度优先搜索、连通分量、原地修改
:原题: `LeetCode 0130 <https://leetcode.com/problems/surrounded-regions/>`_
:访问状态: Available
:教学重点: 边界连通补集、入队即标记、两阶段改写

题目重述
--------

给定只含 ``X`` 和 ``O`` 的矩形网格。若一个 ``O`` 连通区域没有接触网格边界，
把该区域全部改成 ``X``；与边界连通的 ``O`` 必须保留。相邻关系只包含上下左右。

算法
----

真正需要保留的是所有“从边界能够到达的 ``O``”。先从四条边上的 ``O`` 启动 BFS，
并在入队时改成临时标记 ``#``；C++ 版本使用等价的递归 DFS 标记。搜索结束后：

* 剩余 ``O`` 与边界不连通，改成 ``X``；
* 临时标记 ``#`` 属于安全区域，恢复成 ``O``。

这把“判断哪些区域被包围”转化为“标记其补集”。

正确性
~~~~~~

边界上的 ``O`` 显然不能被包围。BFS 沿四方向访问，恰好标记所有与某个边界 ``O``
处于同一连通分量的单元格，因此所有 ``#`` 都必须保留，且所有必须保留的 ``O`` 都会被标记。

搜索后仍为 ``O`` 的单元格不与边界连通，其整个连通分量无法到达边界，所以被 ``X`` 包围。
最终翻转和恢复因此得到唯一正确网格。

复杂度
~~~~~~

每个单元格至多处理一次，时间 ``O(mn)``。BFS 队列最坏 ``O(mn)``；C++ 的递归栈最坏
``O(mn)``。除 R 适配器返回新矩阵外，其余实现原地修改输入网格。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdlib.h>

   static void add_cell(
       char **board,
       int row,
       int col,
       int *qr,
       int *qc,
       int *tail
   ) {
       if (board[row][col] == 'O') {
           board[row][col] = '#';
           qr[*tail] = row;
           qc[*tail] = col;
           ++*tail;
       }
   }

   void solve(char **board, int rows, int *boardColSize) {
       if (rows == 0 || boardColSize[0] == 0) {
           return;
       }
       int cols = boardColSize[0];
       int capacity = rows * cols;
       int *qr = malloc((size_t)capacity * sizeof(*qr));
       int *qc = malloc((size_t)capacity * sizeof(*qc));
       if (qr == NULL || qc == NULL) {
           free(qr);
           free(qc);
           return;
       }

       int head = 0;
       int tail = 0;
       for (int col = 0; col < cols; ++col) {
           add_cell(board, 0, col, qr, qc, &tail);
           add_cell(board, rows - 1, col, qr, qc, &tail);
       }
       for (int row = 1; row + 1 < rows; ++row) {
           add_cell(board, row, 0, qr, qc, &tail);
           add_cell(board, row, cols - 1, qr, qc, &tail);
       }

       const int dr[4] = {1, -1, 0, 0};
       const int dc[4] = {0, 0, 1, -1};
       while (head < tail) {
           int row = qr[head];
           int col = qc[head++];
           for (int direction = 0; direction < 4; ++direction) {
               int nr = row + dr[direction];
               int nc = col + dc[direction];
               if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                   add_cell(board, nr, nc, qr, qc, &tail);
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
       free(qr);
       free(qc);
   }

C++
~~~

.. code-block:: cpp

   #include <vector>

   class Solution {
       int rows = 0;
       int cols = 0;
       std::vector<std::vector<char>>* grid = nullptr;

       void mark(int row, int col) {
           if (row < 0 || row >= rows || col < 0 || col >= cols ||
               (*grid)[row][col] != 'O') {
               return;
           }
           (*grid)[row][col] = '#';
           mark(row + 1, col);
           mark(row - 1, col);
           mark(row, col + 1);
           mark(row, col - 1);
       }

   public:
       void solve(std::vector<std::vector<char>>& board) {
           if (board.empty() || board[0].empty()) return;
           grid = &board;
           rows = static_cast<int>(board.size());
           cols = static_cast<int>(board[0].size());
           for (int col = 0; col < cols; ++col) {
               mark(0, col);
               mark(rows - 1, col);
           }
           for (int row = 1; row + 1 < rows; ++row) {
               mark(row, 0);
               mark(row, cols - 1);
           }
           for (auto& row : board) {
               for (char& cell : row) {
                   if (cell == 'O') cell = 'X';
                   else if (cell == '#') cell = 'O';
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

           rows, cols = len(board), len(board[0])
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
               for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                   nr, nc = row + dr, col + dc
                   if 0 <= nr < rows and 0 <= nc < cols:
                       enqueue(nr, nc)

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
                   int nr = cell[0] + direction[0];
                   int nc = cell[1] + direction[1];
                   if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                       enqueue(board, nr, nc, queue);
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
               for (dr, dc) in directions {
                   let nr = row as i32 + dr;
                   let nc = col as i32 + dc;
                   if nr >= 0 && nr < rows as i32 &&
                       nc >= 0 && nc < cols as i32 {
                       enqueue(
                           board,
                           nr as usize,
                           nc as usize,
                           &mut queue,
                       );
                   }
               }
           }

           for row in board {
               for cell in row {
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
       rows, cols := len(board), len(board[0])
       queue := make([][2]int, 0)
       add := func(row, col int) {
           if board[row][col] == 'O' {
               board[row][col] = '#'
               queue = append(queue, [2]int{row, col})
           }
       }
       for col := 0; col < cols; col++ {
           add(0, col)
           add(rows-1, col)
       }
       for row := 1; row+1 < rows; row++ {
           add(row, 0)
           add(row, cols-1)
       }
       directions := [][2]int{{1, 0}, {-1, 0}, {0, 1}, {0, -1}}
       for head := 0; head < len(queue); head++ {
           row, col := queue[head][0], queue[head][1]
           for _, d := range directions {
               nr, nc := row+d[0], col+d[1]
               if nr >= 0 && nr < rows && nc >= 0 && nc < cols {
                   add(nr, nc)
               }
           }
       }
       for row := range board {
           for col := range board[row] {
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
       if (board.length === 0 || board[0].length === 0) return;
       const rows = board.length;
       const cols = board[0].length;
       const queue: Array<[number, number]> = [];
       const add = (row: number, col: number): void => {
           if (board[row][col] === "O") {
               board[row][col] = "#";
               queue.push([row, col]);
           }
       };
       for (let col = 0; col < cols; col++) {
           add(0, col);
           add(rows - 1, col);
       }
       for (let row = 1; row + 1 < rows; row++) {
           add(row, 0);
           add(row, cols - 1);
       }
       const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
       for (let head = 0; head < queue.length; head++) {
           const [row, col] = queue[head];
           for (const [dr, dc] of directions) {
               const nr = row + dr;
               const nc = col + dc;
               if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                   add(nr, nc);
               }
           }
       }
       for (let row = 0; row < rows; row++) {
           for (let col = 0; col < cols; col++) {
               if (board[row][col] === "O") board[row][col] = "X";
               else if (board[row][col] === "#") board[row][col] = "O";
           }
       }
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public void Solve(char[][] board) {
           if (board.Length == 0 || board[0].Length == 0) return;
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

           int[][] directions = {
               new[] {1, 0}, new[] {-1, 0},
               new[] {0, 1}, new[] {0, -1}
           };
           while (queue.Count > 0) {
               var (row, col) = queue.Dequeue();
               foreach (int[] direction in directions) {
                   int nr = row + direction[0];
                   int nc = col + direction[1];
                   if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                       Enqueue(nr, nc);
                   }
               }
           }

           for (int row = 0; row < rows; ++row) {
               for (int col = 0; col < cols; ++col) {
                   if (board[row][col] == 'O') board[row][col] = 'X';
                   else if (board[row][col] == '#') board[row][col] = 'O';
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
       queue = Tuple{Int,Int}[]
       head = 1

       function enqueue!(row::Int, col::Int)
           if board[row, col] == 'O'
               board[row, col] = '#'
               push!(queue, (row, col))
           end
       end

       for col in 1:cols
           enqueue!(1, col)
           enqueue!(rows, col)
       end
       if rows > 2
           for row in 2:(rows - 1)
               enqueue!(row, 1)
               enqueue!(row, cols)
           end
       end

       while head <= length(queue)
           row, col = queue[head]
           head += 1
           for (dr, dc) in ((1, 0), (-1, 0), (0, 1), (0, -1))
               nr, nc = row + dr, col + dc
               if 1 <= nr <= rows && 1 <= nc <= cols
                   enqueue!(nr, nc)
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

.. code-block:: r

   solve_regions <- function(board) {
     rows <- nrow(board)
     cols <- ncol(board)
     if (rows == 0L || cols == 0L) return(board)

     qr <- integer(0)
     qc <- integer(0)
     enqueue <- function(row, col) {
       if (board[row, col] == "O") {
         board[row, col] <<- "#"
         qr <<- c(qr, row)
         qc <<- c(qc, col)
       }
     }

     for (col in seq_len(cols)) {
       enqueue(1L, col)
       enqueue(rows, col)
     }
     if (rows > 2L) {
       for (row in 2L:(rows - 1L)) {
         enqueue(row, 1L)
         enqueue(row, cols)
       }
     }

     head <- 1L
     directions <- matrix(c(1L, 0L, -1L, 0L, 0L, 1L, 0L, -1L),
                          ncol = 2L, byrow = TRUE)
     while (head <= length(qr)) {
       row <- qr[[head]]
       col <- qc[[head]]
       head <- head + 1L
       for (i in seq_len(4L)) {
         nr <- row + directions[i, 1L]
         nc <- col + directions[i, 2L]
         if (nr >= 1L && nr <= rows && nc >= 1L && nc <= cols) {
           enqueue(nr, nc)
         }
       }
     }

     board[board == "O"] <- "X"
     board[board == "#"] <- "O"
     board
   }

关键边界
--------

* 空网格或零列网格无需处理；
* 单行、单列网格的所有 ``O`` 都在边界上，不会被翻转；
* 入队时立即标记，避免同一单元格重复入队；
* 临时标记必须在第二次扫描中恢复；
* 对角线不构成连通。

最小自检
---------

#. 为什么从边界出发比逐个判断内部区域更直接？
#. 为什么入队时就要标记？
#. 搜索结束后仍为 ``O`` 为什么一定可翻转？
