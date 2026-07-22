0064. Minimum Path Sum
======================

题目信息
--------

:题号: 0064
:题名: Minimum Path Sum
:难度: Medium
:类型: Algorithms
:主题: 动态规划、网格、最短路径、滚动数组
:原题: `LeetCode 0064 <https://leetcode.com/problems/minimum-path-sum/>`_
:教学重点: 最优子结构、边界累加、一维覆盖、零值语义

题目重述
--------

给定非空非负整数网格，从左上角出发，每步只能向右或向下。路径代价是经过单元格之和，起点和终点都计入，返回到右下角的最小路径和。

自建示例
--------

.. code-block:: text

   1 3 1
   1 5 1
   4 2 1
   -> 7

.. code-block:: text

   [[2,0,4,1]] -> 7
   [[0,0],[5,0]] -> 0

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <climits>
   #include <vector>

   class Solution {
   private:
       int plainRecursion(const std::vector<std::vector<int>>& grid, int row, int col) {
           if (row == 0 && col == 0) return grid[0][0];
           int from_up = row > 0 ? plainRecursion(grid, row - 1, col) : INT_MAX;
           int from_left = col > 0 ? plainRecursion(grid, row, col - 1) : INT_MAX;
           return std::min(from_up, from_left) + grid[row][col];
       }

       int tableDp(const std::vector<std::vector<int>>& grid) {
           int rows = grid.size(), cols = grid[0].size();
           std::vector<std::vector<int>> best(rows, std::vector<int>(cols));
           best[0][0] = grid[0][0];
           for (int col = 1; col < cols; ++col) best[0][col] = best[0][col - 1] + grid[0][col];
           for (int row = 1; row < rows; ++row) best[row][0] = best[row - 1][0] + grid[row][0];
           for (int row = 1; row < rows; ++row)
               for (int col = 1; col < cols; ++col)
                   best[row][col] = std::min(best[row - 1][col], best[row][col - 1]) + grid[row][col];
           return best.back().back();
       }

       int inPlace(std::vector<std::vector<int>> grid) {
           for (int row = 0; row < static_cast<int>(grid.size()); ++row) {
               for (int col = 0; col < static_cast<int>(grid[0].size()); ++col) {
                   if (row == 0 && col == 0) continue;
                   if (row == 0) grid[row][col] += grid[row][col - 1];
                   else if (col == 0) grid[row][col] += grid[row - 1][col];
                   else grid[row][col] += std::min(grid[row - 1][col], grid[row][col - 1]);
               }
           }
           return grid.back().back();
       }

       int rollingDp(const std::vector<std::vector<int>>& grid) {
           int rows = grid.size(), cols = grid[0].size();
           std::vector<int> dp(cols);
           dp[0] = grid[0][0];
           for (int col = 1; col < cols; ++col) dp[col] = dp[col - 1] + grid[0][col];
           for (int row = 1; row < rows; ++row) {
               dp[0] += grid[row][0];
               for (int col = 1; col < cols; ++col)
                   dp[col] = std::min(dp[col], dp[col - 1]) + grid[row][col];
           }
           return dp[cols - 1];
       }

   public:
       int minPathSum(std::vector<std::vector<int>>& grid) {
           return rollingDp(grid);
       }
   };

题解
----

为什么枚举路径会指数增长
~~~~~~~~~~~~~~~~~~~~~~

每个内部位置都可能向右或向下，递归树包含大量共享后缀。到达同一格子后，之前的具体路径只影响累计代价，未来选择相同，因此应保存到达该格的最小代价。

最后一步如何形成最优子结构
~~~~~~~~~~~~~~~~~~~~~~~~

到达 ``(row,col)`` 的最后一步只能来自上方或左方。若最优路径来自上方，它的前缀必须是到达上方格的最优路径，否则替换为更小前缀可继续改进答案：

.. code-block:: text

   best[row][col] = min(best[row-1][col], best[row][col-1]) + grid[row][col]

边界为什么必须单独累加
~~~~~~~~~~~~~~~~~~~~

第一行没有上方来源，只能从左侧连续走来；第一列只能从上方连续走来。它们不是“取零作为另一来源”，因为零可能比合法路径更小并制造不存在的入口。

示例状态表
~~~~~~~~~~

.. code-block:: text

   原网格：       最小路径和：
   1 3 1          1 4 5
   1 5 1    ->    2 7 6
   4 2 1          6 8 7

每个内部值等于当前代价加上上方与左方中的较小值。

一维数组保存了什么
~~~~~~~~~~~~~~~~~~

逐行更新时，覆盖前的 ``dp[col]`` 是上方最小代价；当前行已更新的 ``dp[col-1]`` 是左方最小代价。因此 ``min(dp[col],dp[col-1])`` 正好对应二维转移。

为什么更新顺序必须从左向右
~~~~~~~~~~~~~~~~~~~~~~~~~~

从右向左时，``dp[col-1]`` 尚未更新，仍表示上一行左上位置，而不是当前格的左邻居。左到右更新使上方旧状态与左方新状态同时可用。

零值为什么不能作为未计算哨兵
~~~~~~~~~~~~~~~~~~~~~~~~~~

网格值允许为 0，合法路径和也可能为 0。若用 0 表示不可达或未计算，会把真实最优值与哨兵混淆。边界显式初始化或使用足够大的无穷值更安全。

原地修改与滚动数组如何取舍
~~~~~~~~~~~~~~~~~~~~~~~~~~

若允许修改输入，可以把每格覆盖为到达它的最小和，额外空间 ``O(1)``。主实现保持输入只读，用一维数组换取 ``O(n)`` 空间并保留原数据。

为什么最终答案正确
~~~~~~~~~~~~~~~~~~

边界路径唯一，初始化正确。内部格的所有路径按最后一步分为上方与左方两类，取两类最优值后加当前代价得到该格最优值。按行列归纳，右下角状态就是全局最小路径和。

复杂度来源
~~~~~~~~~~

朴素递归指数级。二维、原地和滚动 DP 都访问每格一次，时间 ``O(mn)``；二维空间 ``O(mn)``，滚动空间 ``O(n)``，原地算法额外空间 ``O(1)``。

九语言实现
----------

C
~

.. code-block:: c

   int minPathSum(int**g,int rows,int*cols){int n=cols[0];int*dp=malloc((size_t)n*sizeof(int));dp[0]=g[0][0];for(int c=1;c<n;c++)dp[c]=dp[c-1]+g[0][c];for(int r=1;r<rows;r++){dp[0]+=g[r][0];for(int c=1;c<n;c++)dp[c]=(dp[c]<dp[c-1]?dp[c]:dp[c-1])+g[r][c];}int answer=dp[n-1];free(dp);return answer;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def minPathSum(self, grid: list[list[int]]) -> int:
           dp = [0] * len(grid[0]); dp[0] = grid[0][0]
           for col in range(1, len(dp)): dp[col] = dp[col - 1] + grid[0][col]
           for row in range(1, len(grid)):
               dp[0] += grid[row][0]
               for col in range(1, len(dp)): dp[col] = min(dp[col], dp[col - 1]) + grid[row][col]
           return dp[-1]

Java
~~~~

.. code-block:: java

   class Solution {public int minPathSum(int[][]g){int[]dp=new int[g[0].length];dp[0]=g[0][0];for(int c=1;c<dp.length;c++)dp[c]=dp[c-1]+g[0][c];for(int r=1;r<g.length;r++){dp[0]+=g[r][0];for(int c=1;c<dp.length;c++)dp[c]=Math.min(dp[c],dp[c-1])+g[r][c];}return dp[dp.length-1];}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn min_path_sum(g:Vec<Vec<i32>>)->i32{let mut dp=vec![0;g[0].len()];dp[0]=g[0][0];for c in 1..dp.len(){dp[c]=dp[c-1]+g[0][c]}for r in 1..g.len(){dp[0]+=g[r][0];for c in 1..dp.len(){dp[c]=dp[c].min(dp[c-1])+g[r][c]}}dp[dp.len()-1]}}

Go
~~

.. code-block:: go

   func minPathSum(g [][]int)int{dp:=make([]int,len(g[0]));dp[0]=g[0][0];for c:=1;c<len(dp);c++{dp[c]=dp[c-1]+g[0][c]};for r:=1;r<len(g);r++{dp[0]+=g[r][0];for c:=1;c<len(dp);c++{if dp[c-1]<dp[c]{dp[c]=dp[c-1]};dp[c]+=g[r][c]}};return dp[len(dp)-1]}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function minPathSum(g:number[][]):number{const dp=Array(g[0].length).fill(0);dp[0]=g[0][0];for(let c=1;c<dp.length;c++)dp[c]=dp[c-1]+g[0][c];for(let r=1;r<g.length;r++){dp[0]+=g[r][0];for(let c=1;c<dp.length;c++)dp[c]=Math.min(dp[c],dp[c-1])+g[r][c];}return dp[dp.length-1];}

C#
~~

.. code-block:: csharp

   public class Solution {public int MinPathSum(int[][]g){int[]dp=new int[g[0].Length];dp[0]=g[0][0];for(int c=1;c<dp.Length;c++)dp[c]=dp[c-1]+g[0][c];for(int r=1;r<g.Length;r++){dp[0]+=g[r][0];for(int c=1;c<dp.Length;c++)dp[c]=Math.Min(dp[c],dp[c-1])+g[r][c];}return dp[^1];}}

Julia
~~~~~

.. code-block:: julia

   function min_path_sum(g)
       dp=zeros(Int,size(g,2));dp[1]=g[1,1]
       for c in 2:length(dp);dp[c]=dp[c-1]+g[1,c];end
       for r in 2:size(g,1);dp[1]+=g[r,1];for c in 2:length(dp);dp[c]=min(dp[c],dp[c-1])+g[r,c];end;end
       dp[end]
   end

R
~

.. code-block:: r

   min_path_sum <- function(g){dp<-integer(ncol(g));dp[[1L]]<-g[1L,1L];if(length(dp)>1L)for(c in 2:length(dp))dp[[c]]<-dp[[c-1L]]+g[1L,c];if(nrow(g)>1L)for(r in 2:nrow(g)){dp[[1L]]<-dp[[1L]]+g[r,1L];if(length(dp)>1L)for(c in 2:length(dp))dp[[c]]<-min(dp[[c]],dp[[c-1L]])+g[r,c]};dp[[length(dp)]]}
