0063. Unique Paths II
=====================

题目信息
--------

:题号: 0063
:难度: Medium
:主题: 动态规划、网格、障碍、滚动数组
:原题: `LeetCode 0063 <https://leetcode.com/problems/unique-paths-ii/>`_
:教学重点: 障碍归零、起点阻断、一维覆盖顺序、路径切断

题目重述
--------

给定由 0 和 1 组成的矩形网格，0 表示可通行，1 表示障碍。机器人从左上角出发，只能向右或向下，返回到达右下角的路径数。起点或终点为障碍时答案为 0。

自建示例
--------

.. code-block:: text

   0 0 0
   0 1 0
   0 0 0
   -> 2

.. code-block:: text

   [[1,0],[0,0]] -> 0
   [[0,0,1,0]] -> 0

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       int memoDfs(const std::vector<std::vector<int>>& grid, int row, int col,
                   std::vector<std::vector<int>>& memo) {
           if (row < 0 || col < 0 || grid[row][col] == 1) return 0;
           if (row == 0 && col == 0) return 1;
           int& cached = memo[row][col];
           if (cached != -1) return cached;
           return cached = memoDfs(grid, row - 1, col, memo) +
                           memoDfs(grid, row, col - 1, memo);
       }

       int tableDp(const std::vector<std::vector<int>>& grid) {
           int rows = grid.size(), cols = grid[0].size();
           std::vector<std::vector<int>> ways(rows, std::vector<int>(cols));
           ways[0][0] = grid[0][0] == 0 ? 1 : 0;
           for (int row = 0; row < rows; ++row) {
               for (int col = 0; col < cols; ++col) {
                   if (grid[row][col] == 1) { ways[row][col] = 0; continue; }
                   if (row > 0) ways[row][col] += ways[row - 1][col];
                   if (col > 0) ways[row][col] += ways[row][col - 1];
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
                   else if (col > 0) dp[col] += dp[col - 1];
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

开放格的最后一步仍只能来自上方或左方，因此原转移保持不变。新增规则只影响障碍格：任何路径都不能以它为终点，也不能穿过它继续传播。

障碍为什么必须把状态归零
~~~~~~~~~~~~~~~~~~~~~~~~

一维数组中的 ``dp[col]`` 可能保存从上方到达该列的路径数。若当前格是障碍而不清零，这些路径会被错误传给右侧和下一行。写成 0 表示该位置没有可用路径，并形成后续转移的吸收状态。

.. code-block:: text

   obstacle -> dp[col] = 0
   open     -> dp[col] = dp[col] + dp[col-1]

起点初始化为何单独处理
~~~~~~~~~~~~~~~~~~~~

起点开放时存在一条尚未移动的路径，因此 ``dp[0]=1``；起点被阻断时为 0。之后第一列若遇到障碍会归零，障碍下方没有左侧来源，状态会持续为 0。

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

无障碍版本第一行只有一条路径，但障碍会截断它。例如 ``[0,0,1,0]`` 中，障碍右侧不可达。逐格更新 ``dp[0]`` 和后续列可以自然传播这个零状态。

为什么不重不漏
~~~~~~~~~~~~~~

开放格路径按最后一步唯一分为上方和左方两类；障碍格没有合法路径。对网格扫描顺序归纳，每个状态恰好统计全部合法路径，因此终点值正确。

复杂度来源
~~~~~~~~~~

记忆化递归、二维 DP 和一维 DP 都为 ``O(mn)`` 时间。二维状态使用 ``O(mn)`` 空间；一维滚动使用 ``O(n)`` 空间，也可选择较短维度进一步压缩。

九语言实现
----------

C
~

.. code-block:: c

   int uniquePathsWithObstacles(int**g,int rows,int*cols){int n=cols[0];int*dp=calloc((size_t)n,sizeof(int));dp[0]=g[0][0]==0;for(int r=0;r<rows;r++)for(int c=0;c<n;c++){if(g[r][c]==1)dp[c]=0;else if(c>0)dp[c]+=dp[c-1];}int answer=dp[n-1];free(dp);return answer;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def uniquePathsWithObstacles(self, grid: list[list[int]]) -> int:
           dp = [0] * len(grid[0]); dp[0] = int(grid[0][0] == 0)
           for row in grid:
               for col, cell in enumerate(row):
                   if cell == 1: dp[col] = 0
                   elif col > 0: dp[col] += dp[col - 1]
           return dp[-1]

Java
~~~~

.. code-block:: java

   class Solution {public int uniquePathsWithObstacles(int[][]g){int[]dp=new int[g[0].length];dp[0]=g[0][0]==0?1:0;for(int[]row:g)for(int c=0;c<row.length;c++){if(row[c]==1)dp[c]=0;else if(c>0)dp[c]+=dp[c-1];}return dp[dp.length-1];}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn unique_paths_with_obstacles(g:Vec<Vec<i32>>)->i32{let mut dp=vec![0;g[0].len()];dp[0]=(g[0][0]==0)as i32;for row in g{for(c,&cell)in row.iter().enumerate(){if cell==1{dp[c]=0}else if c>0{dp[c]+=dp[c-1]}}}dp[dp.len()-1]}}

Go
~~

.. code-block:: go

   func uniquePathsWithObstacles(g [][]int)int{dp:=make([]int,len(g[0]));if g[0][0]==0{dp[0]=1};for _,row:=range g{for c,cell:=range row{if cell==1{dp[c]=0}else if c>0{dp[c]+=dp[c-1]}}};return dp[len(dp)-1]}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function uniquePathsWithObstacles(g:number[][]):number{const dp=Array(g[0].length).fill(0);dp[0]=g[0][0]===0?1:0;for(const row of g)for(let c=0;c<row.length;c++){if(row[c]===1)dp[c]=0;else if(c>0)dp[c]+=dp[c-1];}return dp[dp.length-1];}

C#
~~

.. code-block:: csharp

   public class Solution {public int UniquePathsWithObstacles(int[][]g){int[]dp=new int[g[0].Length];dp[0]=g[0][0]==0?1:0;foreach(var row in g)for(int c=0;c<row.Length;c++){if(row[c]==1)dp[c]=0;else if(c>0)dp[c]+=dp[c-1];}return dp[^1];}}

Julia
~~~~~

.. code-block:: julia

   function unique_paths_with_obstacles(g)
       dp=zeros(Int,size(g,2));dp[1]=g[1,1]==0
       for r in axes(g,1),c in axes(g,2);if g[r,c]==1;dp[c]=0;elseif c>1;dp[c]+=dp[c-1];end;end
       dp[end]
   end

R
~

.. code-block:: r

   unique_paths_with_obstacles <- function(g){dp<-integer(ncol(g));dp[[1L]]<-as.integer(g[1L,1L]==0L);for(r in seq_len(nrow(g)))for(c in seq_len(ncol(g))){if(g[r,c]==1L)dp[[c]]<-0L else if(c>1L)dp[[c]]<-dp[[c]]+dp[[c-1L]]};dp[[length(dp)]]}
