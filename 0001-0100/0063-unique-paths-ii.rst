0063. Unique Paths II
=====================

题目信息
--------

:题号: 0063
:难度: Medium
:主题: 动态规划、网格、障碍、滚动数组
:原题: `LeetCode 0063 <https://leetcode.com/problems/unique-paths-ii/>`_
:重点: 障碍阻断、起点终点、右下移动、路径计数

题目重述
--------

给定由 ``0`` 和 ``1`` 组成的 ``m × n`` 网格 ``obstacleGrid``，``0`` 表示可通行单元格，``1`` 表示障碍。机器人从左上角出发，每步只能向右或向下，返回到达右下角且不经过障碍的不同路径数量。

约束为 ``1 <= m, n <= 100``，并保证答案不超过 ``2 * 10^9``。

自建示例
--------

.. code-block:: text

   输入：
   [[0,0,0,0],
    [0,1,0,0],
    [0,0,1,0]]

   输出：2

两条合法路径为 ``右、右、右、下、下`` 和 ``右、右、下、右、下``；它们都避开 ``(1,1)`` 与 ``(2,2)`` 两个障碍。

.. code-block:: text

   输入：[[1,0,0]]
   输出：0

起点本身是障碍，无法开始移动。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       static constexpr int LIMIT = 2'000'000'001;

       int cappedAdd(int left, int right) {
           return static_cast<int>(std::min<long long>(LIMIT, static_cast<long long>(left) + right));
       }

       int memoDfs(const std::vector<std::vector<int>>& grid, int row, int col,
                   std::vector<std::vector<int>>& memo) {
           if (row < 0 || col < 0 || grid[row][col] == 1) return 0;
           if (row == 0 && col == 0) return 1;
           int& cached = memo[row][col];
           if (cached != -1) return cached;
           return cached = cappedAdd(
               memoDfs(grid, row - 1, col, memo),
               memoDfs(grid, row, col - 1, memo)
           );
       }

       int tableDp(const std::vector<std::vector<int>>& grid) {
           int rows = grid.size(), cols = grid[0].size();
           std::vector<std::vector<int>> ways(rows, std::vector<int>(cols));
           ways[0][0] = grid[0][0] == 0 ? 1 : 0;
           for (int row = 0; row < rows; ++row) {
               for (int col = 0; col < cols; ++col) {
                   if (grid[row][col] == 1) { ways[row][col] = 0; continue; }
                   if (row == 0 && col == 0) continue;
                   int up = row > 0 ? ways[row - 1][col] : 0;
                   int left = col > 0 ? ways[row][col - 1] : 0;
                   ways[row][col] = cappedAdd(up, left);
               }
           }
           return ways.back().back();
       }

       int rollingDp(const std::vector<std::vector<int>>& grid) {
           int rows = grid.size(), cols = grid[0].size();
           std::vector<int> dp(cols);
           dp[0] = grid[0][0] == 0 ? 1 : 0;
           for (int row = 0; row < rows; ++row) {
               for (int col = 0; col < cols; ++col) {
                   if (grid[row][col] == 1) dp[col] = 0;
                   else if (col > 0) dp[col] = cappedAdd(dp[col], dp[col - 1]);
               }
           }
           return dp[cols - 1];
       }

   public:
       int uniquePathsWithObstacles(std::vector<std::vector<int>>& obstacleGrid) {
           return rollingDp(obstacleGrid);
       }
   };

题解
----

与无障碍版本共享什么
~~~~~~~~~~~~~~~~~~

开放格的最后一步仍只能来自上方或左方，因此转移仍是两侧路径数之和。新增规则只影响障碍格：任何路径都不能以它为终点，也不能穿过它继续传播。

障碍为什么必须把状态归零
~~~~~~~~~~~~~~~~~~~~~~~~

一维数组中的 ``dp[col]`` 可能保存从上方到达该列的路径数。若当前格是障碍而不清零，这些路径会被错误传给右侧和下一行。写成 0 表示该位置没有可用路径，并切断所有穿过它的转移。

.. code-block:: text

   obstacle -> dp[col] = 0
   open     -> dp[col] = dp[col] + dp[col-1]

起点初始化为何单独处理
~~~~~~~~~~~~~~~~~~~~

起点开放时存在一条尚未移动的路径，因此 ``dp[0]=1``；起点被阻断时为 0。第一列遇到障碍后会归零，障碍下方又没有左侧来源，状态自然持续为 0。

中央障碍状态演化
~~~~~~~~~~~~~~~~

.. code-block:: text

   网格：       路径数：
   0 0 0        1 1 1
   0 1 0   ->   1 0 1
   0 0 0        1 1 2

障碍位置归零，右侧只能从上方得到一条路径，最终两条路径分别绕过障碍。

一维状态为何仍然有效
~~~~~~~~~~~~~~~~~~~~

逐行从左向右更新时，更新前 ``dp[col]`` 是上方路径数；更新后的 ``dp[col-1]`` 是左方路径数。开放格相加，障碍格覆盖为 0，完全对应二维状态。

为什么不能预先把第一行全部设为 1
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

无障碍版本第一行只有一条路径，但障碍会截断它。例如 ``[0,0,1,0]`` 中，障碍右侧不可达。逐格更新才能把归零状态继续传播。

最终答案受限为何仍可能中间溢出
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

障碍前的大型开放区域可能产生远超 ``2 × 10^9`` 的路径数，之后这些路径在某个障碍处全部归零，所以最终答案仍可能很小。直接使用 32 位加法会在障碍出现前溢出。

为什么饱和到 LIMIT 不改变答案
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

所有转移只有非负加法或障碍归零。若某个超过 ``2 × 10^9`` 的状态能够到达终点而不被障碍切断，最终答案也必然超过题目上限；这与保证矛盾。因而超过上限的状态以后要么被障碍清零，要么不可能贡献到合法最终答案。把它统一截为 ``2,000,000,001`` 可防溢出且保留最终精确值。

为什么不重不漏
~~~~~~~~~~~~~~

开放格路径按最后一步唯一分为上方和左方两类；障碍格没有合法路径。按网格扫描顺序归纳，每个未饱和状态都精确统计合法路径，饱和状态又不会影响受保证的最终答案，因此终点值正确。

复杂度来源
~~~~~~~~~~

记忆化递归、二维 DP 和一维 DP 都为 ``O(mn)`` 时间。二维状态使用 ``O(mn)`` 空间；一维滚动使用 ``O(n)`` 空间。饱和比较只增加常数开销。

九语言实现
----------

C
~

.. code-block:: c

   int uniquePathsWithObstacles(int**g,int rows,int*cols){const long long LIMIT=2000000001LL;int n=cols[0];long long*dp=calloc((size_t)n,sizeof(long long));dp[0]=g[0][0]==0;for(int r=0;r<rows;r++)for(int c=0;c<n;c++){if(g[r][c]==1)dp[c]=0;else if(c>0){long long sum=dp[c]+dp[c-1];dp[c]=sum>LIMIT?LIMIT:sum;}}int answer=(int)dp[n-1];free(dp);return answer;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def uniquePathsWithObstacles(self, grid: list[list[int]]) -> int:
           limit = 2_000_000_001
           dp = [0] * len(grid[0]); dp[0] = int(grid[0][0] == 0)
           for row in grid:
               for col, cell in enumerate(row):
                   if cell == 1: dp[col] = 0
                   elif col > 0: dp[col] = min(limit, dp[col] + dp[col - 1])
           return dp[-1]

Java
~~~~

.. code-block:: java

   class Solution {public int uniquePathsWithObstacles(int[][]g){final long LIMIT=2000000001L;long[]dp=new long[g[0].length];dp[0]=g[0][0]==0?1:0;for(int[]row:g)for(int c=0;c<row.length;c++){if(row[c]==1)dp[c]=0;else if(c>0)dp[c]=Math.min(LIMIT,dp[c]+dp[c-1]);}return(int)dp[dp.length-1];}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn unique_paths_with_obstacles(g:Vec<Vec<i32>>)->i32{const LIMIT:i64=2_000_000_001;let mut dp=vec![0i64;g[0].len()];dp[0]=(g[0][0]==0)as i64;for row in g{for(c,&cell)in row.iter().enumerate(){if cell==1{dp[c]=0}else if c>0{dp[c]=(dp[c]+dp[c-1]).min(LIMIT)}}}dp[dp.len()-1]as i32}}

Go
~~

.. code-block:: go

   func uniquePathsWithObstacles(g [][]int)int{const limit int64=2000000001;dp:=make([]int64,len(g[0]));if g[0][0]==0{dp[0]=1};for _,row:=range g{for c,cell:=range row{if cell==1{dp[c]=0}else if c>0{sum:=dp[c]+dp[c-1];if sum>limit{sum=limit};dp[c]=sum}}};return int(dp[len(dp)-1])}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function uniquePathsWithObstacles(g:number[][]):number{const limit=2_000_000_001,dp=Array(g[0].length).fill(0);dp[0]=g[0][0]===0?1:0;for(const row of g)for(let c=0;c<row.length;c++){if(row[c]===1)dp[c]=0;else if(c>0)dp[c]=Math.min(limit,dp[c]+dp[c-1]);}return dp[dp.length-1];}

C#
~~

.. code-block:: csharp

   public class Solution {public int UniquePathsWithObstacles(int[][]g){const long Limit=2000000001L;long[]dp=new long[g[0].Length];dp[0]=g[0][0]==0?1:0;foreach(var row in g)for(int c=0;c<row.Length;c++){if(row[c]==1)dp[c]=0;else if(c>0)dp[c]=Math.Min(Limit,dp[c]+dp[c-1]);}return(int)dp[^1];}}

Julia
~~~~~

.. code-block:: julia

   function unique_paths_with_obstacles(g)
       limit=2_000_000_001;dp=zeros(Int,size(g,2));dp[1]=g[1,1]==0
       for r in axes(g,1),c in axes(g,2);if g[r,c]==1;dp[c]=0;elseif c>1;dp[c]=min(limit,dp[c]+dp[c-1]);end;end
       dp[end]
   end

R
~

.. code-block:: r

   unique_paths_with_obstacles <- function(g){limit<-2000000001;dp<-numeric(ncol(g));dp[[1L]]<-as.numeric(g[1L,1L]==0L);for(r in seq_len(nrow(g)))for(c in seq_len(ncol(g))){if(g[r,c]==1L)dp[[c]]<-0 else if(c>1L)dp[[c]]<-min(limit,dp[[c]]+dp[[c-1L]])};as.integer(dp[[length(dp)]])}
