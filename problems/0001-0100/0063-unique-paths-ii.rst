0063. Unique Paths II
=====================

题目信息
--------

:题号: 0063
:难度: Medium
:主题: 动态规划、网格、障碍、滚动数组
:原题: `LeetCode 0063 <https://leetcode.com/problems/unique-paths-ii/>`_
:访问状态: Available
:教学重点: 障碍吸收状态、起点阻断、一维覆盖顺序、计数饱和保护

题目重述
--------

给定一个由 ``0`` 和 ``1`` 组成的矩形网格。``0`` 表示可以经过的单元格，``1`` 表示障碍。机器人从
左上角出发，每一步只能向右或向下移动，不能进入障碍，返回到达右下角的不同路径数量。

题目保证：

* ``1 <= obstacleGrid.length, obstacleGrid[row].length <= 100``；
* 每一行长度相同，输入是非空矩形；
* 每个元素只能是 ``0`` 或 ``1``；
* 起点或终点允许是障碍，此时答案为 ``0``；
* 正确答案不超过 ``2 × 10^9``；
* 主实现只读取网格，不修改输入。

自建示例
--------

中央障碍
~~~~~~~~

.. code-block:: text

   输入：
   [
     [0, 0, 0],
     [0, 1, 0],
     [0, 0, 0]
   ]
   输出：2

两条合法路径分别绕过中央障碍的上侧和左侧。

起点被阻断
~~~~~~~~~~

.. code-block:: text

   输入：[[1, 0], [0, 0]]
   输出：0

机器人无法离开起点。

终点被阻断
~~~~~~~~~~

.. code-block:: text

   输入：[[0, 0], [0, 1]]
   输出：0

单行中断
~~~~~~~~

.. code-block:: text

   输入：[[0, 0, 1, 0]]
   输出：0

障碍后的单元格没有其他来源，路径数持续为零。

问题抽象
--------

与 0062 相同，开放单元格的路径只可能来自上方或左方。障碍单元格不能成为任何路径的终点，也不能把
路径继续传给右侧或下方，所以其状态必须立即归零：

.. code-block:: text

   如果 obstacle[row][col] == 1：
       ways[row][col] = 0
   否则：
       ways[row][col] = ways[row - 1][col] + ways[row][col - 1]

使用一维数组时，更新前的 ``dp[col]`` 是上方路径数，更新后的 ``dp[col - 1]`` 是左方路径数。遇到
障碍时覆盖为 ``0``，恰好切断所有穿过该位置的后续转移。由于障碍可能让巨大前缀计数最终失效，
实现把状态饱和到 ``limit = 2_000_000_001``，避免固定宽整数溢出。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 算法额外空间
     - 定位
   * - 一维滚动动态规划
     - ``O(mn)``
     - ``O(n)``
     - 主解法；在 0062 转移上加入障碍归零
   * - 二维动态规划
     - ``O(mn)``
     - ``O(mn)``
     - 状态直观，但保留全部历史行
   * - 记忆化深度优先搜索
     - ``O(mn)``
     - ``O(mn)`` 缓存与递归栈
     - 可行，但递归边界和栈成本更复杂
   * - 枚举全部方向序列
     - 指数级
     - ``O(m+n)`` 递归栈
     - 会探索大量被障碍截断或重复到达的状态

主解法：障碍归零的一维动态规划
------------------------------

状态定义
~~~~~~~~

初始化长度为列数 ``n`` 的 ``dp``，令 ``dp[0] = 1``，然后从左上角开始逐行、从左到右扫描每个
单元格：

* 若当前单元格是障碍，执行 ``dp[col] = 0``；
* 若当前单元格开放且 ``col > 0``，执行
  ``dp[col] = min(dp[col] + dp[col - 1], limit)``；
* 若当前单元格开放且 ``col == 0``，保留原 ``dp[0]``，它只可能来自上方。

这种初始化不需要单独判断起点。若起点是障碍，处理第一个单元格时会把 ``dp[0]`` 从 ``1`` 改为
``0``；后续状态自然全部不可达。

核心不变量
~~~~~~~~~~

处理完当前行的前 ``col + 1`` 个单元格后：

* ``dp[0..col]`` 保存当前行真实路径数与 ``limit`` 的较小值，障碍位置为 ``0``；
* ``dp[col+1..n-1]`` 仍保存上一行尚未处理位置的路径数；
* 任意 ``dp`` 状态只统计没有经过障碍的路径；
* 某位置一旦被障碍归零，它不会再向右侧或下一行贡献路径；
* 输入网格始终保持不变。

正确性依据
~~~~~~~~~~

**起点初始化正确。** 临时令 ``dp[0] = 1`` 表示起点的空路径。若起点开放，该值保留；若起点是
障碍，统一规则立即把它归零，因此两种情况都正确。

**开放单元格转移完整且无重复。** 到达开放单元格的最后一步只能来自上方或左方。两类路径最后一步
方向不同，互斥且覆盖全部合法路径，因此真实路径数应相加。对非负整数有
``min(min(a,L) + min(b,L), L) = min(a+b, L)``，所以饱和转移始终保存真实计数与上限的较小值。

**障碍归零正确。** 任何合法路径都不能以障碍为终点，所以该位置路径数必须是 ``0``。覆盖旧上方状态
也阻止该状态在后续行继续向下传播；右侧转移读取到的左方状态同样为 ``0``，因此所有穿过障碍的路径都
被准确排除。

**一维覆盖顺序正确。** 开放位置更新前，``dp[col]`` 仍保存上方状态，``dp[col - 1]`` 已保存当前行
左侧状态。障碍位置不需要两者，直接覆盖为零。所有代码分支都与二维转移完全一致。

**返回值正确。** 扫描结束后，``dp[n - 1]`` 等于真实终点计数与 ``limit`` 的较小值。题目保证真实
答案不超过 ``2 × 10^9``，严格小于 ``limit``，所以返回值没有被截断；终点若为障碍则为 ``0``。

**终止性。** 每个单元格恰好处理一次，两层有限循环结束后算法终止。

复杂度
~~~~~~

设网格为 ``m × n``：

* 每个单元格执行常数次判断、加法或赋值，时间复杂度为 ``O(mn)``；
* 一维状态数组占 ``O(n)`` 算法额外空间；
* 输入不被复制或修改，返回值是单个整数；
* 障碍可能让大量前缀路径最终全部失效，所以中间计数不一定小于最终答案；
* 主实现把每个状态保存为 ``min(真实计数, 2_000_000_001)``。两个饱和值相加最多为
  ``4_000_000_002``，使用 64 位整数或精确 ``number`` / ``numeric`` 安全；
* 最终答案保证不超过 ``2 × 10^9``，严格小于饱和上限，因此返回状态仍是精确答案；
* 一维工作数组占 ``O(n)``，返回值是单个整数。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stddef.h>
   #include <stdlib.h>

   int uniquePathsWithObstacles(
       int **obstacleGrid,
       int obstacleGridSize,
       int *obstacleGridColSize
   ) {
       int cols = obstacleGridColSize[0];
       const long long limit = 2000000001LL;
       long long *dp = calloc((size_t)cols, sizeof(*dp));
       if (dp == NULL) {
           /* 合法答案非负，-1 明确表示分配失败。 */
           return -1;
       }

       dp[0] = 1;
       for (int row = 0; row < obstacleGridSize; ++row) {
           for (int col = 0; col < cols; ++col) {
               if (obstacleGrid[row][col] == 1) {
                   dp[col] = 0;
               } else if (col > 0) {
                   long long total = dp[col] + dp[col - 1];
                   dp[col] = total < limit ? total : limit;
               }
           }
       }

       int answer = (int)dp[cols - 1];
       free(dp);
       return answer;
   }

平台保证至少一行一列，且 ``obstacleGridColSize[0]`` 是真实列数。函数不拥有输入行，不负责释放网格。

C++
~~~

.. code-block:: cpp

   #include <cstddef>
   #include <algorithm>
   #include <vector>

   class Solution {
   public:
       int uniquePathsWithObstacles(
           const std::vector<std::vector<int>>& obstacleGrid
       ) {
           const std::size_t rows = obstacleGrid.size();
           const std::size_t cols = obstacleGrid[0].size();
           constexpr long long limit = 2000000001LL;
           std::vector<long long> dp(cols, 0);
           dp[0] = 1;

           for (std::size_t row = 0; row < rows; ++row) {
               for (std::size_t col = 0; col < cols; ++col) {
                   if (obstacleGrid[row][col] == 1) {
                       dp[col] = 0;
                   } else if (col > 0U) {
                       dp[col] = std::min(
                           dp[col] + dp[col - 1U],
                           limit
                       );
                   }
               }
           }

           return static_cast<int>(dp.back());
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def uniquePathsWithObstacles(
           self,
           obstacleGrid: list[list[int]],
       ) -> int:
           cols = len(obstacleGrid[0])
           limit = 2_000_000_001
           dp = [0] * cols
           dp[0] = 1

           for row in obstacleGrid:
               for col, cell in enumerate(row):
                   if cell == 1:
                       dp[col] = 0
                   elif col > 0:
                       dp[col] = min(dp[col] + dp[col - 1], limit)

           return dp[-1]

代码只迭代原行，不建立行切片或网格副本。

Java
~~~~

.. code-block:: java

   class Solution {
       public int uniquePathsWithObstacles(int[][] obstacleGrid) {
           int rows = obstacleGrid.length;
           int cols = obstacleGrid[0].length;
           final long limit = 2_000_000_001L;
           long[] dp = new long[cols];
           dp[0] = 1;

           for (int row = 0; row < rows; ++row) {
               for (int col = 0; col < cols; ++col) {
                   if (obstacleGrid[row][col] == 1) {
                       dp[col] = 0;
                   } else if (col > 0) {
                       dp[col] = Math.min(dp[col] + dp[col - 1], limit);
                   }
               }
           }

           return (int)dp[cols - 1];
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn unique_paths_with_obstacles(
           obstacle_grid: Vec<Vec<i32>>,
       ) -> i32 {
           let cols = obstacle_grid[0].len();
           let limit = 2_000_000_001i64;
           let mut dp = vec![0i64; cols];
           dp[0] = 1;

           for row in &obstacle_grid {
               for (col, &cell) in row.iter().enumerate() {
                   if cell == 1 {
                       dp[col] = 0;
                   } else if col > 0 {
                       dp[col] = (dp[col] + dp[col - 1]).min(limit);
                   }
               }
           }

           dp[cols - 1] as i32
       }
   }

函数按值接收网格，但循环只借用各行，不克隆内部数据。非空矩形约束支撑 ``[0]`` 和 ``cols - 1``。

Go
~~

.. code-block:: go

   func uniquePathsWithObstacles(obstacleGrid [][]int) int {
       cols := len(obstacleGrid[0])
       const limit int64 = 2_000_000_001
       dp := make([]int64, cols)
       dp[0] = 1

       for _, row := range obstacleGrid {
           for col, cell := range row {
               if cell == 1 {
                   dp[col] = 0
               } else if col > 0 {
                   total := dp[col] + dp[col-1]
                   if total < limit {
                       dp[col] = total
                   } else {
                       dp[col] = limit
                   }
               }
           }
       }

       return int(dp[cols-1])
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function uniquePathsWithObstacles(obstacleGrid: number[][]): number {
       const cols = obstacleGrid[0].length;
       const limit = 2_000_000_001;
       const dp: number[] = Array<number>(cols).fill(0);
       dp[0] = 1;

       for (const row of obstacleGrid) {
           for (let col = 0; col < cols; col += 1) {
               if (row[col] === 1) {
                   dp[col] = 0;
               } else if (col > 0) {
                   dp[col] = Math.min(dp[col] + dp[col - 1], limit);
               }
           }
       }

       return dp[cols - 1];
   }

``number`` 对最多 ``4_000_000_002`` 的暂存和保持精确；障碍判断使用严格相等。

C#
~~

.. code-block:: csharp

   public class Solution {
       public int UniquePathsWithObstacles(int[][] obstacleGrid) {
           int rows = obstacleGrid.Length;
           int cols = obstacleGrid[0].Length;
           const long Limit = 2_000_000_001L;
           long[] dp = new long[cols];
           dp[0] = 1;

           for (int row = 0; row < rows; ++row) {
               for (int col = 0; col < cols; ++col) {
                   if (obstacleGrid[row][col] == 1) {
                       dp[col] = 0;
                   } else if (col > 0) {
                       dp[col] = System.Math.Min(
                           dp[col] + dp[col - 1],
                           Limit
                       );
                   }
               }
           }

           return (int)dp[cols - 1];
       }
   }

Julia
~~~~~

.. code-block:: julia

   function unique_paths_with_obstacles(
       obstacle_grid::Matrix{Int}
   )::Int
       rows, cols = size(obstacle_grid)
       limit = Int64(2_000_000_001)
       dp = zeros(Int64, cols)
       dp[1] = 1

       for row in 1:rows
           for col in 1:cols
               if obstacle_grid[row, col] == 1
                   dp[col] = 0
               elseif col > 1
                   dp[col] = min(dp[col] + dp[col - 1], limit)
               end
           end
       end

       return Int(dp[cols])
   end

Julia 的矩阵和 ``dp`` 都使用一基索引，代码不把零基算法坐标直接用于容器访问。

R
~

.. code-block:: r

   unique_paths_with_obstacles <- function(obstacle_grid) {
     rows <- nrow(obstacle_grid)
     cols <- ncol(obstacle_grid)
     limit <- 2000000001
     dp <- numeric(cols)
     dp[1L] <- 1

     for (row in seq_len(rows)) {
       for (col in seq_len(cols)) {
         if (obstacle_grid[row, col] == 1L) {
           dp[col] <- 0
         } else if (col > 1L) {
           dp[col] <- min(dp[col] + dp[col - 1L], limit)
         }
       }
     }

     dp[cols]
   }

矩阵读取不会修改输入。``seq_len`` 对正尺寸矩形产生明确的一基索引序列。

语言边界说明
------------

* C 的合法答案可能为 ``0``，所以分配失败使用输出域之外的 ``-1``；
* C、C++、Java、Rust、Go 与 C# 使用 64 位状态并在 ``2_000_000_001`` 饱和；
* C++ 与 Rust 以只读方式借用网格内容，Rust 的按值参数只转移所有权，不产生深拷贝；
* Python、Java、Go、TypeScript 与 C# 不修改任何行；
* TypeScript、Python、Julia 与 R 也执行相同饱和语义；最大暂存和约为 ``4 × 10^9``，精确安全；
* Julia 与 R 直接使用一基矩阵坐标，R 以 ``numeric`` 保存精确整数计数；
* 十语言都在障碍位置覆盖旧状态，而不是仅跳过加法。

对照解法：二维状态表
--------------------

建立与输入同尺寸的 ``ways`` 矩阵，障碍位置写 ``0``，开放位置累加上方和左方。该方法时间仍为
``O(mn)``，额外空间为 ``O(mn)``。它更容易直接观察每个单元格状态，适合调试；一维版本利用当前转移
只依赖上一行和左侧，把空间压缩为 ``O(n)``。

验证计划与证据
--------------

``运行验证``
   覆盖无障碍、中央障碍、起点障碍、终点障碍、单行阻断、单列阻断和完全不可达网格。

``随机基准对拍``
   Python 对小尺寸随机 ``0/1`` 网格使用独立递归枚举所有向右、向下路径，遇到障碍立即返回 ``0``，
   与滚动动态规划结果比较。

``编译验证``
   C 使用 C17、严格警告与 AddressSanitizer、UndefinedBehaviorSanitizer；C++ 使用 C++17 严格警告和
   sanitizer；Java、Go、TypeScript 分别完成编译或严格类型检查。

``静态验证``
   Rust、C#、Julia、R 在当前环境缺少运行时，检查所有权、矩阵索引、障碍分支和返回类型，不宣称运行
   通过。

关键边界
--------

* 起点是障碍：第一次更新必须把临时 ``1`` 归零；
* 终点是障碍：最终答案必须为 ``0``；
* 第一行障碍：其右侧若没有上方来源，应持续不可达；
* 第一列障碍：其下方若没有左方来源，应持续不可达；
* 合法答案可以是 ``0``，错误处理不能把 ``0`` 当成唯一失败信号；
* 障碍位置必须覆盖旧的上方状态，不能简单 ``continue``。

易错点
------

* 先根据起点是否开放初始化，又在循环中再次处理起点，导致重复分支；
* 遇到障碍只跳过加法，旧 ``dp[col]`` 仍向下传播；
* 把障碍后的第一行位置继续初始化为 ``1``；
* 使用两条独立 ``if``，障碍归零后又执行左侧加法；
* 修改输入网格作为状态表，却仍声称输入保持不变；
* C 在分配失败时返回 ``0``，无法与合法的无路径结果区分；
* 直接使用 32 位计数，忽略障碍后方可能存在巨大但最终失效的前缀状态。

本题新增知识
------------

* 障碍是动态规划中的吸收状态：当前计数归零，并阻断向右与向下传播；
* ``dp[0] = 1`` 配合统一单元格循环可以自然处理起点开放或阻断；
* 当合法答案包含 ``0`` 时，C 的资源失败哨兵必须选择输出域之外的值；
* 障碍可能制造巨大但最终失效的前缀计数；饱和运算可限制宽度，同时保持受保证的最终答案精确；
* 正确性证明需要说明被障碍排除的路径不会以其他状态重新出现。

本题强化知识
------------

* 0062 的上方加左方转移和一维覆盖顺序原样复用；
* 0055 的不可达状态思想从一维数组断点迁移到二维障碍网格；
* Julia、R 的一基矩阵坐标继续强化；
* 路径计数仍需区分 ``0`` 个结果与运行时失败；
* 0062 的最终上界可直接约束全部中间状态，本题则需要饱和保护死路上的巨大前缀计数。

关联题目
--------

* `0062. Unique Paths <0062-unique-paths.rst>`_：本题保留相同网格转移，并在障碍位置加入归零规则。
* `0055. Jump Game <0055-jump-game.rst>`_：两题都维护可达性；0055 用最远前缀，本题用每个网格位置的
  路径计数表达可达与不可达。

最小自检
--------

#. 为什么障碍位置必须执行 ``dp[col] = 0``？
#. 起点是障碍时，统一初始化为什么仍能得到正确结果？
#. 开放位置更新时，``dp[col]`` 与 ``dp[col - 1]`` 分别来自哪里？
#. 为什么 C 的分配失败不能返回 ``0``？
#. 为什么需要 ``2_000_000_001`` 饱和，而最终结果仍保持精确？
#. 随机对拍使用的基准与主算法有何不同？

答案要点
~~~~~~~~

#. 旧值代表从上方到达的路径；障碍不允许这些路径继续向下传播。
#. 临时 ``dp[0] = 1`` 会在处理障碍起点时立即被统一规则归零。
#. 前者是上一行同列，后者是当前行左侧。
#. ``0`` 是合法的无路径答案，无法区分资源失败。
#. 饱和数组始终保存 ``min(真实计数, limit)``；最终答案严格小于 ``limit``，所以未被截断。
#. 基准直接递归枚举方向选择，不复用滚动数组转移。
