0062. Unique Paths
==================

题目信息
--------

:题号: 0062
:难度: Medium
:主题: 动态规划、网格、组合计数、滚动数组
:原题: `LeetCode 0062 <https://leetcode.com/problems/unique-paths/>`_
:教学重点: 最后一步分类、边界初始化、一维覆盖顺序、组合公式

题目重述
--------

机器人位于 ``m × n`` 网格左上角，每步只能向右或向下移动一格，返回到达右下角的不同路径数。单行、单列和单格网格都只有一条路径。

自建示例
--------

.. code-block:: text

   m = 3, n = 4 -> 10
   每条路径包含 2 次向下与 3 次向右。

.. code-block:: text

   m = 1, n = 5 -> 1
   m = 1, n = 1 -> 1

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       int plainRecursion(int row, int col, int m, int n) {
           if (row == m - 1 || col == n - 1) return 1;
           return plainRecursion(row + 1, col, m, n) +
                  plainRecursion(row, col + 1, m, n);
       }

       int tableDp(int m, int n) {
           std::vector<std::vector<int>> ways(m, std::vector<int>(n, 1));
           for (int row = 1; row < m; ++row)
               for (int col = 1; col < n; ++col)
                   ways[row][col] = ways[row - 1][col] + ways[row][col - 1];
           return ways[m - 1][n - 1];
       }

       int rollingDp(int m, int n) {
           if (n > m) std::swap(m, n);
           std::vector<int> dp(n, 1);
           for (int row = 1; row < m; ++row)
               for (int col = 1; col < n; ++col)
                   dp[col] += dp[col - 1];
           return dp[n - 1];
       }

       int combinatorics(int m, int n) {
           int choose = std::min(m - 1, n - 1);
           int total = m + n - 2;
           long long result = 1;
           for (int i = 1; i <= choose; ++i)
               result = result * (total - choose + i) / i;
           return static_cast<int>(result);
       }

   public:
       int uniquePaths(int m, int n) {
           return rollingDp(m, n);
       }
   };

题解
----

递归树为什么重复
~~~~~~~~~~~~~~~~

从每个格子分别尝试向右和向下会形成路径树。不同前缀经常到达同一格子，而从该格子到终点的剩余方案完全相同，朴素递归会反复计算同一子问题。

最后一步如何完整分类
~~~~~~~~~~~~~~~~~~~~

记 ``ways[row][col]`` 为到达当前格的路径数。除起点外，最后一步只能从上方或左方进入；两类路径最后方向不同，因此互不重叠，又覆盖全部合法路径：

.. code-block:: text

   ways[row][col] = ways[row-1][col] + ways[row][col-1]

边界为什么全部初始化为 1
~~~~~~~~~~~~~~~~~~~~~~

第一行只能一直向右，第一列只能一直向下，因此每个边界格恰有一条路径。单格网格的空移动序列也计作一条路径，初始化自然覆盖该边界。

3 × 4 状态表
~~~~~~~~~~~~~

.. code-block:: text

   1  1  1  1
   1  2  3  4
   1  3  6 10

每个内部值都是上方与左方之和，右下角得到 10。

一维压缩为何成立
~~~~~~~~~~~~~~~~

逐行扫描时，更新前的 ``dp[col]`` 保存上一行同列值，即上方路径数；当前行的 ``dp[col-1]`` 已更新，是左方路径数。因此执行 ``dp[col] += dp[col-1]`` 正好完成二维转移。

为什么必须从左向右更新
~~~~~~~~~~~~~~~~~~~~

若从右向左，``dp[col-1]`` 仍是上一行值，不是当前行左方状态，会把两个旧状态相加。左到右顺序保证每次读取一个旧上方值和一个新左方值。

组合公式如何直接计数
~~~~~~~~~~~~~~~~~~~~

任意路径都包含 ``m-1`` 次向下与 ``n-1`` 次向右，总步数 ``m+n-2``。选择其中哪些位置放较少的一类步长即可：

.. code-block:: text

   C(m+n-2, min(m-1,n-1))

逐步乘除避免先计算巨大阶乘；题目保证最终答案在 32 位范围内，中间使用 64 位。

为什么动态规划不重不漏
~~~~~~~~~~~~~~~~~~~~

每条到达当前格的路径按最后一步唯一归入上方或左方集合。边界正确，转移对行列归纳成立；因此右下角状态等于全部路径数。

复杂度来源
~~~~~~~~~~

朴素递归为指数级。二维 DP 时间 ``O(mn)``、空间 ``O(mn)``；一维 DP 时间 ``O(mn)``、空间 ``O(min(m,n))``；组合方法时间 ``O(min(m,n))``、空间 ``O(1)``。

九语言实现
----------

C
~

.. code-block:: c

   int uniquePaths(int m,int n){if(n>m){int t=m;m=n;n=t;}int*dp=malloc((size_t)n*sizeof(int));for(int c=0;c<n;c++)dp[c]=1;for(int r=1;r<m;r++)for(int c=1;c<n;c++)dp[c]+=dp[c-1];int answer=dp[n-1];free(dp);return answer;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def uniquePaths(self, m: int, n: int) -> int:
           if n > m: m, n = n, m
           dp = [1] * n
           for _ in range(1, m):
               for col in range(1, n): dp[col] += dp[col - 1]
           return dp[-1]

Java
~~~~

.. code-block:: java

   class Solution {public int uniquePaths(int m,int n){if(n>m){int t=m;m=n;n=t;}int[]dp=new int[n];Arrays.fill(dp,1);for(int r=1;r<m;r++)for(int c=1;c<n;c++)dp[c]+=dp[c-1];return dp[n-1];}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn unique_paths(mut m:i32,mut n:i32)->i32{if n>m{std::mem::swap(&mut m,&mut n)}let mut dp=vec![1;n as usize];for _ in 1..m{for c in 1..n as usize{dp[c]+=dp[c-1]}}dp[n as usize-1]}}

Go
~~

.. code-block:: go

   func uniquePaths(m int,n int)int{if n>m{m,n=n,m};dp:=make([]int,n);for i:=range dp{dp[i]=1};for r:=1;r<m;r++{for c:=1;c<n;c++{dp[c]+=dp[c-1]}};return dp[n-1]}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function uniquePaths(m:number,n:number):number{if(n>m)[m,n]=[n,m];const dp=Array(n).fill(1);for(let r=1;r<m;r++)for(let c=1;c<n;c++)dp[c]+=dp[c-1];return dp[n-1];}

C#
~~

.. code-block:: csharp

   public class Solution {public int UniquePaths(int m,int n){if(n>m)(m,n)=(n,m);int[]dp=Enumerable.Repeat(1,n).ToArray();for(int r=1;r<m;r++)for(int c=1;c<n;c++)dp[c]+=dp[c-1];return dp[n-1];}}

Julia
~~~~~

.. code-block:: julia

   function unique_paths(m::Int,n::Int)
       n>m&&((m,n)=(n,m));dp=ones(Int,n)
       for _ in 2:m, col in 2:n;dp[col]+=dp[col-1];end
       dp[end]
   end

R
~

.. code-block:: r

   unique_paths <- function(m,n){if(n>m){tmp<-m;m<-n;n<-tmp};dp<-rep(1,n);if(m>1L&&n>1L)for(row in 2:m)for(col in 2:n)dp[[col]]<-dp[[col]]+dp[[col-1L]];dp[[n]]}
