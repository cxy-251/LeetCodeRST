0051. N-Queens
===============

题目信息
--------

:题号: 0051
:难度: Hard
:主题: 回溯、约束状态、棋盘搜索、对角线映射
:原题: `LeetCode 0051 <https://leetcode.com/problems/n-queens/>`_
:访问状态: Available
:教学重点: 按行建立搜索树、列与两类对角线占用、选择撤销、输出敏感复杂度

题目重述
--------

给定整数 ``n``，在 ``n × n`` 棋盘上放置 ``n`` 个皇后，使任意两个皇后都不在同一行、同一列
或同一条对角线上。返回全部不同的合法棋盘。

每个棋盘由 ``n`` 个长度为 ``n`` 的字符串组成：``'Q'`` 表示皇后，``'.'`` 表示空格。题目保证
``1 <= n <= 9``，结果顺序没有要求，输入整数不会被修改。

自建示例
--------

四皇后
~~~~~~

.. code-block:: text

   输入：n = 4
   输出可以是：
   [
     [".Q..", "...Q", "Q...", "..Q."],
     ["..Q.", "Q...", "...Q", ".Q.."]
   ]

单格棋盘
~~~~~~~~

.. code-block:: text

   输入：n = 1
   输出：[["Q"]]

无解规模
~~~~~~~~

.. code-block:: text

   输入：n = 2
   输出：[]

``n = 2`` 和 ``n = 3`` 都不存在合法布局。算法应自然搜索完全部分布局并返回空结果，不需要额外
硬编码这两个规模。

问题抽象
--------

每个合法答案恰好在每一行放置一个皇后。因此可以按行构造棋盘：递归深度 ``row`` 负责为第
``row`` 行选择一列。按行推进已经消除了行冲突，只需记录三类占用状态：

* ``columns[col]``：第 ``col`` 列是否已经有皇后；
* ``diag_down[row - col + n - 1]``：左上到右下的 ``\`` 对角线是否被占用；
* ``diag_up[row + col]``：右上到左下的 ``/`` 对角线是否被占用。

这里先使用零基坐标。``row - col`` 的范围是 ``-(n-1)..(n-1)``，加上 ``n-1`` 后映射到
``0..2n-2``；``row + col`` 也落在 ``0..2n-2``。因此两类对角线各需要 ``2n-1`` 个布尔槽位。

``placement[row] = col`` 保存当前路径中第 ``row`` 行皇后所在列。只有到达完整解时才把这组列坐标
转换为字符串棋盘，避免在搜索的每一步复制整个棋盘。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 算法额外空间
     - 定位
   * - 按行回溯 + 三组占用数组
     - ``O(nV + S n²)``
     - ``O(n)``
     - 主解法；状态直观，十语言语义一致
   * - 位掩码回溯
     - ``O(V + S n²)``
     - ``O(n)``
     - 常数更小，但移位方向和语言整数语义更难教学
   * - 枚举每行列号后整体校验
     - ``O(n^(n+1))``
     - ``O(n)``
     - 生成大量早已冲突的前缀

其中 ``V`` 表示搜索访问的合法部分布局数量，``S`` 表示合法答案数量。

主解法：按行回溯与对角线占用
----------------------------

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

进入 ``dfs(row)`` 时保持：

* ``0..row-1`` 每一行恰好放置一个皇后；
* 已放置皇后之间不存在列冲突或对角线冲突；
* 三组占用数组与 ``placement[0..row-1]`` 完全一致；
* ``row..n-1`` 尚未放置皇后；
* 当前递归返回前会撤销本层加入的三个占用标记。

当前行枚举所有列。某个 ``col`` 只有在列、``\`` 对角线和 ``/`` 对角线都未占用时才可选择。
选择后写入 ``placement[row]``，标记三个槽位，递归到下一行；返回后撤销同样三个槽位。

正确性依据
~~~~~~~~~~

**合法性。** 递归每层只处理一行，所以任意完整路径每行恰好一个皇后。选择列前同时检查列和两类
对角线占用，因此新皇后不会攻击此前皇后。归纳可得，到达 ``row = n`` 时构造出的棋盘满足全部约束。

**完备性。** 任意合法棋盘都能唯一写成列序列 ``c[0], c[1], ..., c[n-1]``。在第 ``row`` 层，
该棋盘的 ``c[row]`` 与更早行的皇后不冲突，所以不会被占用检查删除。算法枚举当前行全部合法列，
沿着这组列序列的分支一定能够到达完整解，因此不会漏解。

**无重复。** 两个不同棋盘至少有一行的皇后列不同，对应的递归选择序列也不同。每层的每个列只
枚举一次，所以同一列序列不会被生成两次。

**撤销正确性。** 本层只加入当前列和两条对角线的三个布尔标记。递归返回后清除同样的槽位，父层
状态恢复到选择前；失败分支不会污染后续候选。

**终止性。** 每次递归都令 ``row`` 增加 1，最大深度为 ``n``。每层最多枚举 ``n`` 列，搜索树有限。

复杂度
~~~~~~

设 ``V`` 为访问的合法部分布局数量，``S`` 为答案数量：

* 每个搜索节点最多检查 ``n`` 列，搜索时间为 ``O(nV)``；
* 忽略对角线后，部分布局数量受排列树限制，可写成较松上界 ``O(n · n!)``；
* 每个答案需要构造 ``n`` 行、每行 ``n`` 个字符，输出构造为 ``O(S n²)``；
* 总时间为 ``O(nV + S n²)``；
* ``placement``、列与对角线数组、递归栈合计 ``O(n)`` 算法额外空间；
* 返回结果占用 ``O(S n²)`` 字符空间，不计入算法额外空间。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stdlib.h>
   #include <string.h>

   typedef struct {
       char ***boards;
       int *column_sizes;
       int size;
       int capacity;
       int n;
       bool *columns;
       bool *diag_down;
       bool *diag_up;
       int *placement;
       bool failed;
   } Context;

   static void free_board(char **board, int n) {
       if (board == NULL) {
           return;
       }
       for (int row = 0; row < n; ++row) {
           free(board[row]);
       }
       free(board);
   }

   static bool grow_results(Context *ctx) {
       int new_capacity = ctx->capacity == 0 ? 4 : ctx->capacity * 2;
       char ***new_boards = malloc(
           (size_t)new_capacity * sizeof(*new_boards)
       );
       int *new_sizes = malloc(
           (size_t)new_capacity * sizeof(*new_sizes)
       );
       if (new_boards == NULL || new_sizes == NULL) {
           free(new_boards);
           free(new_sizes);
           return false;
       }

       if (ctx->size > 0) {
           memcpy(
               new_boards,
               ctx->boards,
               (size_t)ctx->size * sizeof(*new_boards)
           );
           memcpy(
               new_sizes,
               ctx->column_sizes,
               (size_t)ctx->size * sizeof(*new_sizes)
           );
       }
       free(ctx->boards);
       free(ctx->column_sizes);
       ctx->boards = new_boards;
       ctx->column_sizes = new_sizes;
       ctx->capacity = new_capacity;
       return true;
   }

   static bool append_board(Context *ctx) {
       if (ctx->size == ctx->capacity && !grow_results(ctx)) {
           return false;
       }

       char **board = malloc((size_t)ctx->n * sizeof(*board));
       if (board == NULL) {
           return false;
       }
       for (int row = 0; row < ctx->n; ++row) {
           board[row] = NULL;
       }

       for (int row = 0; row < ctx->n; ++row) {
           board[row] = malloc((size_t)ctx->n + 1U);
           if (board[row] == NULL) {
               free_board(board, ctx->n);
               return false;
           }
           memset(board[row], '.', (size_t)ctx->n);
           board[row][ctx->placement[row]] = 'Q';
           board[row][ctx->n] = '\0';
       }

       ctx->boards[ctx->size] = board;
       ctx->column_sizes[ctx->size] = ctx->n;
       ++ctx->size;
       return true;
   }

   static void search(Context *ctx, int row) {
       if (ctx->failed) {
           return;
       }
       if (row == ctx->n) {
           ctx->failed = !append_board(ctx);
           return;
       }

       for (int col = 0; col < ctx->n; ++col) {
           int down = row - col + ctx->n - 1;
           int up = row + col;
           if (ctx->columns[col] ||
               ctx->diag_down[down] ||
               ctx->diag_up[up]) {
               continue;
           }

           ctx->placement[row] = col;
           ctx->columns[col] = true;
           ctx->diag_down[down] = true;
           ctx->diag_up[up] = true;

           search(ctx, row + 1);

           ctx->columns[col] = false;
           ctx->diag_down[down] = false;
           ctx->diag_up[up] = false;
       }
   }

   char ***solveNQueens(
       int n,
       int *returnSize,
       int **returnColumnSizes
   ) {
       *returnSize = 0;
       *returnColumnSizes = NULL;

       Context ctx = {.n = n};
       ctx.columns = calloc((size_t)n, sizeof(*ctx.columns));
       ctx.diag_down = calloc(
           (size_t)(2 * n - 1),
           sizeof(*ctx.diag_down)
       );
       ctx.diag_up = calloc(
           (size_t)(2 * n - 1),
           sizeof(*ctx.diag_up)
       );
       ctx.placement = malloc((size_t)n * sizeof(*ctx.placement));

       if (ctx.columns == NULL ||
           ctx.diag_down == NULL ||
           ctx.diag_up == NULL ||
           ctx.placement == NULL) {
           free(ctx.columns);
           free(ctx.diag_down);
           free(ctx.diag_up);
           free(ctx.placement);
           return NULL;
       }

       search(&ctx, 0);
       free(ctx.columns);
       free(ctx.diag_down);
       free(ctx.diag_up);
       free(ctx.placement);

       if (ctx.failed) {
           for (int index = 0; index < ctx.size; ++index) {
               free_board(ctx.boards[index], n);
           }
           free(ctx.boards);
           free(ctx.column_sizes);
           return NULL;
       }

       *returnSize = ctx.size;
       *returnColumnSizes = ctx.column_sizes;
       return ctx.boards;
   }

C 版本的动态结果由外层棋盘数组、``returnColumnSizes``、每个棋盘的行指针和每行字符串组成。
扩容先建立两份新元数据数组，全部成功后再替换旧状态；任一分配失败时释放已创建的完整棋盘并
返回 ``NULL``，不会把部分答案伪装成正常结果。

C++
~~~

.. code-block:: cpp

   #include <string>
   #include <utility>
   #include <vector>

   using std::move;
   using std::string;
   using std::vector;

   class Solution {
       vector<vector<string>> answers;
       vector<int> placement;
       vector<bool> columns;
       vector<bool> diagDown;
       vector<bool> diagUp;
       int n = 0;

       void saveBoard() {
           vector<string> board(n, string(n, '.'));
           for (int row = 0; row < n; ++row) {
               board[row][placement[row]] = 'Q';
           }
           answers.push_back(move(board));
       }

       void dfs(int row) {
           if (row == n) {
               saveBoard();
               return;
           }

           for (int col = 0; col < n; ++col) {
               int down = row - col + n - 1;
               int up = row + col;
               if (columns[col] || diagDown[down] || diagUp[up]) {
                   continue;
               }

               placement[row] = col;
               columns[col] = true;
               diagDown[down] = true;
               diagUp[up] = true;

               dfs(row + 1);

               columns[col] = false;
               diagDown[down] = false;
               diagUp[up] = false;
           }
       }

   public:
       vector<vector<string>> solveNQueens(int size) {
           n = size;
           answers.clear();
           placement.assign(n, 0);
           columns.assign(n, false);
           diagDown.assign(2 * n - 1, false);
           diagUp.assign(2 * n - 1, false);
           dfs(0);
           return answers;
       }
   };

``answers.clear()`` 和四组状态的重新初始化使同一个 ``Solution`` 对象可以安全处理多次调用。

Python
~~~~~~

.. code-block:: python

   class Solution:
       def solveNQueens(self, n: int) -> list[list[str]]:
           answers: list[list[str]] = []
           placement = [0] * n
           columns = [False] * n
           diag_down = [False] * (2 * n - 1)
           diag_up = [False] * (2 * n - 1)

           def save_board() -> None:
               board: list[str] = []
               for row in range(n):
                   cells = ["."] * n
                   cells[placement[row]] = "Q"
                   board.append("".join(cells))
               answers.append(board)

           def dfs(row: int) -> None:
               if row == n:
                   save_board()
                   return

               for col in range(n):
                   down = row - col + n - 1
                   up = row + col
                   if columns[col] or diag_down[down] or diag_up[up]:
                       continue

                   placement[row] = col
                   columns[col] = True
                   diag_down[down] = True
                   diag_up[up] = True

                   dfs(row + 1)

                   columns[col] = False
                   diag_down[down] = False
                   diag_up[up] = False

           dfs(0)
           return answers

每个叶子重新构造 ``board``，因此保存的历史答案不会与后续回溯共享可变字符数组。

Java
~~~~

.. code-block:: java

   import java.util.ArrayList;
   import java.util.Arrays;
   import java.util.List;

   class Solution {
       private final List<List<String>> answers = new ArrayList<>();
       private int[] placement;
       private boolean[] columns;
       private boolean[] diagDown;
       private boolean[] diagUp;
       private int n;

       public List<List<String>> solveNQueens(int size) {
           n = size;
           answers.clear();
           placement = new int[n];
           columns = new boolean[n];
           diagDown = new boolean[2 * n - 1];
           diagUp = new boolean[2 * n - 1];
           dfs(0);
           return answers;
       }

       private void dfs(int row) {
           if (row == n) {
               saveBoard();
               return;
           }

           for (int col = 0; col < n; ++col) {
               int down = row - col + n - 1;
               int up = row + col;
               if (columns[col] || diagDown[down] || diagUp[up]) {
                   continue;
               }

               placement[row] = col;
               columns[col] = true;
               diagDown[down] = true;
               diagUp[up] = true;

               dfs(row + 1);

               columns[col] = false;
               diagDown[down] = false;
               diagUp[up] = false;
           }
       }

       private void saveBoard() {
           List<String> board = new ArrayList<>(n);
           for (int row = 0; row < n; ++row) {
               char[] cells = new char[n];
               Arrays.fill(cells, '.');
               cells[placement[row]] = 'Q';
               board.add(new String(cells));
           }
           answers.add(board);
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn solve_n_queens(n: i32) -> Vec<Vec<String>> {
           fn save_board(n: usize, placement: &[usize]) -> Vec<String> {
               let mut board = Vec::with_capacity(n);
               for row in 0..n {
                   let mut cells = vec![b'.'; n];
                   cells[placement[row]] = b'Q';
                   board.push(
                       String::from_utf8(cells)
                           .expect("棋盘只包含 ASCII 字符"),
                   );
               }
               board
           }

           fn dfs(
               row: usize,
               n: usize,
               placement: &mut [usize],
               columns: &mut [bool],
               diag_down: &mut [bool],
               diag_up: &mut [bool],
               answers: &mut Vec<Vec<String>>,
           ) {
               if row == n {
                   answers.push(save_board(n, placement));
                   return;
               }

               for col in 0..n {
                   let down = row + n - 1 - col;
                   let up = row + col;
                   if columns[col] ||
                       diag_down[down] ||
                       diag_up[up] {
                       continue;
                   }

                   placement[row] = col;
                   columns[col] = true;
                   diag_down[down] = true;
                   diag_up[up] = true;

                   dfs(
                       row + 1,
                       n,
                       placement,
                       columns,
                       diag_down,
                       diag_up,
                       answers,
                   );

                   columns[col] = false;
                   diag_down[down] = false;
                   diag_up[up] = false;
               }
           }

           let n = n as usize;
           let mut answers = Vec::new();
           let mut placement = vec![0_usize; n];
           let mut columns = vec![false; n];
           let mut diag_down = vec![false; 2 * n - 1];
           let mut diag_up = vec![false; 2 * n - 1];

           dfs(
               0,
               n,
               &mut placement,
               &mut columns,
               &mut diag_down,
               &mut diag_up,
               &mut answers,
           );
           answers
       }
   }

棋盘只包含 ``'.'`` 和 ``'Q'`` 两个 ASCII 字节，``String::from_utf8`` 的成功由构造过程保证。

Go
~~

.. code-block:: go

   func solveNQueens(n int) [][]string {
       answers := make([][]string, 0)
       placement := make([]int, n)
       columns := make([]bool, n)
       diagDown := make([]bool, 2*n-1)
       diagUp := make([]bool, 2*n-1)

       var dfs func(int)
       dfs = func(row int) {
           if row == n {
               board := make([]string, n)
               for currentRow := 0; currentRow < n; currentRow++ {
                   cells := make([]byte, n)
                   for index := range cells {
                       cells[index] = '.'
                   }
                   cells[placement[currentRow]] = 'Q'
                   board[currentRow] = string(cells)
               }
               answers = append(answers, board)
               return
           }

           for col := 0; col < n; col++ {
               down := row - col + n - 1
               up := row + col
               if columns[col] || diagDown[down] || diagUp[up] {
                   continue
               }

               placement[row] = col
               columns[col] = true
               diagDown[down] = true
               diagUp[up] = true

               dfs(row + 1)

               columns[col] = false
               diagDown[down] = false
               diagUp[up] = false
           }
       }

       dfs(0)
       return answers
   }

``string(cells)`` 复制当前字节切片，之后对其他行或其他答案的修改不会影响已经保存的字符串。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function solveNQueens(n: number): string[][] {
       const answers: string[][] = [];
       const placement = new Array<number>(n).fill(0);
       const columns = new Array<boolean>(n).fill(false);
       const diagDown = new Array<boolean>(2 * n - 1).fill(false);
       const diagUp = new Array<boolean>(2 * n - 1).fill(false);

       const saveBoard = (): void => {
           const board: string[] = [];
           for (let row = 0; row < n; row++) {
               const cells = new Array<string>(n).fill(".");
               cells[placement[row]] = "Q";
               board.push(cells.join(""));
           }
           answers.push(board);
       };

       const dfs = (row: number): void => {
           if (row === n) {
               saveBoard();
               return;
           }

           for (let col = 0; col < n; col++) {
               const down = row - col + n - 1;
               const up = row + col;
               if (columns[col] || diagDown[down] || diagUp[up]) {
                   continue;
               }

               placement[row] = col;
               columns[col] = true;
               diagDown[down] = true;
               diagUp[up] = true;

               dfs(row + 1);

               columns[col] = false;
               diagDown[down] = false;
               diagUp[up] = false;
           }
       };

       dfs(0);
       return answers;
   }

本题 ``n <= 9``，所有下标都处于精确安全整数范围；实现不依赖 JavaScript 的 32 位位运算。

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       private readonly List<IList<string>> answers = new();
       private int[] placement = null!;
       private bool[] columns = null!;
       private bool[] diagDown = null!;
       private bool[] diagUp = null!;
       private int n;

       public IList<IList<string>> SolveNQueens(int size) {
           n = size;
           answers.Clear();
           placement = new int[n];
           columns = new bool[n];
           diagDown = new bool[2 * n - 1];
           diagUp = new bool[2 * n - 1];
           Dfs(0);
           return answers;
       }

       private void Dfs(int row) {
           if (row == n) {
               SaveBoard();
               return;
           }

           for (int col = 0; col < n; ++col) {
               int down = row - col + n - 1;
               int up = row + col;
               if (columns[col] || diagDown[down] || diagUp[up]) {
                   continue;
               }

               placement[row] = col;
               columns[col] = true;
               diagDown[down] = true;
               diagUp[up] = true;

               Dfs(row + 1);

               columns[col] = false;
               diagDown[down] = false;
               diagUp[up] = false;
           }
       }

       private void SaveBoard() {
           var board = new List<string>(n);
           for (int row = 0; row < n; ++row) {
               var cells = new char[n];
               for (int col = 0; col < n; ++col) {
                   cells[col] = '.';
               }
               cells[placement[row]] = 'Q';
               board.Add(new string(cells));
           }
           answers.Add(board);
       }
   }

Julia
~~~~~

.. code-block:: julia

   function solve_n_queens(n::Int)::Vector{Vector{String}}
       answers = Vector{Vector{String}}()
       placement = zeros(Int, n)
       columns = falses(n)
       diag_down = falses(2n - 1)
       diag_up = falses(2n - 1)

       function save_board!()
           board = Vector{String}(undef, n)
           for row in 1:n
               cells = fill('.', n)
               cells[placement[row]] = 'Q'
               board[row] = join(cells)
           end
           push!(answers, board)
       end

       function dfs!(row::Int)
           if row > n
               save_board!()
               return
           end

           for col in 1:n
               down = row - col + n
               up = row + col - 1
               if columns[col] ||
                   diag_down[down] ||
                   diag_up[up]
                   continue
               end

               placement[row] = col
               columns[col] = true
               diag_down[down] = true
               diag_up[up] = true

               dfs!(row + 1)

               columns[col] = false
               diag_down[down] = false
               diag_up[up] = false
           end
       end

       dfs!(1)
       return answers
   end

Julia 使用一基位置：``row - col + n`` 与 ``row + col - 1`` 都映射到 ``1..2n-1``。普通
``1:n`` 在官方约束 ``n >= 1`` 下非空。

R
~

.. code-block:: r

   solve_n_queens <- function(n) {
     placement <- integer(n)
     columns <- rep(FALSE, n)
     diag_down <- rep(FALSE, 2L * n - 1L)
     diag_up <- rep(FALSE, 2L * n - 1L)

     state <- new.env(hash = TRUE, parent = emptyenv())
     state$size <- 0L

     save_board <- function() {
       board <- character(n)
       for (row in seq_len(n)) {
         cells <- rep(".", n)
         cells[[placement[[row]]]] <- "Q"
         board[[row]] <- paste0(cells, collapse = "")
       }

       state$size <- state$size + 1L
       assign(as.character(state$size), board, envir = state)
     }

     dfs <- function(row) {
       if (row > n) {
         save_board()
         return(invisible(NULL))
       }

       for (col in seq_len(n)) {
         down <- row - col + n
         up <- row + col - 1L
         if (columns[[col]] ||
             diag_down[[down]] ||
             diag_up[[up]]) {
           next
         }

         placement[[row]] <- col
         columns[[col]] <- TRUE
         diag_down[[down]] <- TRUE
         diag_up[[up]] <- TRUE

         dfs(row + 1L)

         columns[[col]] <- FALSE
         diag_down[[down]] <- FALSE
         diag_up[[up]] <- FALSE
       }
     }

     dfs(1L)
     lapply(
       seq_len(state$size),
       function(index) get(as.character(index), envir = state)
     )
   }

R 使用 ``environment`` 为每个答案建立独立绑定，避免在搜索叶子反复扩展一个越来越长的列表。
最后按编号一次性构造返回列表。列、对角线和路径仍是当前调用内的局部向量，递归通过闭包共享并撤销。

验证计划与证据
--------------

本题使用解数量和棋盘约束共同验证：

* ``n = 1..9`` 的答案数量应依次为 ``1, 0, 0, 2, 10, 4, 40, 92, 352``；
* 每个返回棋盘检查行数、行长度、皇后总数以及行、列、两类对角线唯一性；
* 使用独立的位掩码计数程序对拍答案数量；
* 分配型 C 实现使用 AddressSanitizer 与 UndefinedBehaviorSanitizer 检查资源路径。

已完成的验证：

* **运行验证：** C、C++、Python、Java、Go、TypeScript 均执行 ``n = 1..9`` 数量测试；
* **编译验证：** C 使用 C17、``-Wall -Wextra -Werror``，C++ 使用 C++17，Java 使用
  ``javac -Xlint:all``，TypeScript 使用 ``tsc --strict``；
* **基准对拍：** 独立 Python 位掩码计数器得到相同的九组答案数量；
* **静态验证：** Rust、C#、Julia、R 检查了接口、索引映射、撤销对称性、快照和返回结构；当前环境
  未安装这四种语言的运行时，因此不声称运行通过。

关键边界
--------

* ``n = 1``：第一次选择直接形成唯一完整棋盘；
* ``n = 2``、``n = 3``：搜索树耗尽后返回空结果；
* 对角线映射：零基 ``row-col+n-1`` 与 ``row+col`` 必须落在 ``0..2n-2``；
* 一基映射：Julia/R 使用 ``row-col+n`` 与 ``row+col-1``；
* 保存答案：必须复制完整棋盘，不能把仍会撤销的路径或字符数组直接放入结果；
* 多次调用：对象字段或闭包状态必须在公共入口重新初始化。

易错点
------

* 只检查列，不检查两类对角线；
* 把两类对角线使用同一个索引公式；
* ``row-col`` 未加偏移就作为数组下标；
* 递归返回后漏掉一个占用标记的撤销；
* 每层重新复制整个棋盘，造成无必要的搜索期 ``O(n²)`` 复制；
* 保存路径引用而不是棋盘快照，导致所有答案在回溯后变成相同内容；
* C 扩容直接覆盖旧指针，分配失败时丢失已经生成的答案。

本题新增知识
------------

* 棋盘攻击关系可以压缩为列、``row-col`` 对角线和 ``row+col`` 对角线三组占用状态；
* 每条 ``n × n`` 棋盘对角线可由一个整数不变量唯一标识；
* 输出型回溯应把搜索状态与最终字符串快照分开；
* 搜索复杂度应使用访问节点数 ``V`` 与答案数 ``S`` 表达，而不是只写一个粗略 ``O(n!)``。

本题强化知识
------------

* 0037 的可逆约束状态：选择时加入约束，返回时精确撤销；
* 0046 的按位置回溯：递归深度确定当前要填写的位置；
* 0047 的答案快照：结果必须与后续路径修改隔离；
* 十语言继续区分零基算法坐标和 Julia/R 一基容器位置。

关联题目
--------

* `0037. Sudoku Solver <0037-sudoku-solver.rst>`_：约束状态、回溯和撤销；
* `0046. Permutations <0046-permutations.rst>`_：按位置建立搜索树；
* `0047. Permutations II <0047-permutations-ii.rst>`_：回溯快照与分支唯一性。

最小自检
--------

#. 为什么按行递归后不再需要单独记录行占用？
#. ``\`` 对角线和 ``/`` 对角线分别由什么坐标表达式唯一标识？
#. 为什么任意合法棋盘都对应搜索树中的唯一一条路径？
#. 为什么复杂度需要单独写 ``S n²``？
#. 保存答案时为什么不能直接保存 ``placement`` 的引用？

答案要点
~~~~~~~~

#. 递归深度已经唯一确定当前行，每层只放一个皇后。
#. 零基坐标分别使用 ``row-col`` 和 ``row+col``；前者加 ``n-1`` 后作为数组下标。
#. 每个合法棋盘按行读取皇后列，得到唯一列序列；算法逐层枚举这组合法列。
#. 每个答案包含 ``n²`` 个字符，构造和保存全部答案至少需要 ``O(S n²)``。
#. ``placement`` 会在回溯中继续覆盖；必须在叶子把它转换为独立棋盘快照。
