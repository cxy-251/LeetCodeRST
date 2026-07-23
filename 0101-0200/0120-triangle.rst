0120. Triangle
==============

题目信息
--------

:题号: 0120
:难度: Medium
:主题: 动态规划、三角形数组、最短路径、滚动数组
:原题: `LeetCode 0120 <https://leetcode.com/problems/triangle/>`_
:重点: 顶点到底边、下一行相邻位置、最小路径和

题目重述
--------

给定一个由整数行组成的三角形数组 ``triangle``。路径从顶点 ``triangle[0][0]`` 开始；若当前位置是第 ``row`` 行第 ``column`` 列，下一步只能进入第 ``row + 1`` 行的 ``column`` 或 ``column + 1`` 位置。路径必须一直到达最后一行，返回所有合法路径中最小的节点值总和。

三角形行数在 ``1..200`` 范围内，第 ``i`` 行恰有 ``i + 1`` 个元素，每个元素在 ``-10^4..10^4`` 范围内。仅使用与行数成正比的额外空间是进阶要求。

自建示例
--------

.. code-block:: text

   输入：triangle = [[4],[2,9],[7,1,3],[8,6,-5,2]]
   输出：2
   解释：路径 4 -> 2 -> 1 -> -5 合法且总和为 2；每一步都进入下一行的同列或右邻位置。

.. code-block:: text

   输入：triangle = [[-7]]
   输出：-7
   解释：只有一个元素时，顶点同时位于最后一行，唯一路径和就是 -7。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <climits>
   #include <vector>

   class Solution {
   private:
       long long plainRecursion(const std::vector<std::vector<int>>& triangle,
                                int row, int column) {
           if (row == static_cast<int>(triangle.size()) - 1)
               return triangle[row][column];
           return triangle[row][column] +
               std::min(plainRecursion(triangle, row + 1, column),
                        plainRecursion(triangle, row + 1, column + 1));
       }

       int topDownTable(const std::vector<std::vector<int>>& triangle) {
           int rows = triangle.size();
           const long long infinity = LLONG_MAX / 4;
           std::vector<std::vector<long long>> dp(rows);
           dp[0] = {triangle[0][0]};
           for (int row = 1; row < rows; ++row) {
               dp[row].assign(row + 1, infinity);
               for (int column = 0; column <= row; ++column) {
                   if (column < row)
                       dp[row][column] = std::min(
                           dp[row][column],
                           dp[row - 1][column] + triangle[row][column]);
                   if (column > 0)
                       dp[row][column] = std::min(
                           dp[row][column],
                           dp[row - 1][column - 1] + triangle[row][column]);
               }
           }
           return static_cast<int>(*std::min_element(dp.back().begin(), dp.back().end()));
       }

       int inPlace(std::vector<std::vector<int>> triangle) {
           for (int row = static_cast<int>(triangle.size()) - 2; row >= 0; --row)
               for (int column = 0; column <= row; ++column)
                   triangle[row][column] += std::min(
                       triangle[row + 1][column],
                       triangle[row + 1][column + 1]);
           return triangle[0][0];
       }

       int bottomUpRolling(const std::vector<std::vector<int>>& triangle) {
           std::vector<long long> best(triangle.back().begin(), triangle.back().end());
           for (int row = static_cast<int>(triangle.size()) - 2; row >= 0; --row)
               for (int column = 0; column <= row; ++column)
                   best[column] = triangle[row][column] +
                       std::min(best[column], best[column + 1]);
           return static_cast<int>(best[0]);
       }

   public:
       int minimumTotal(std::vector<std::vector<int>>& triangle) {
           return bottomUpRolling(triangle);
       }
   };

题解
----

为什么局部选择较小孩子不够
~~~~~~~~~~~~~~~~~~~~~~~~~~

下一行当前数值较小的孩子，后续可能连接很大的代价；较大孩子后续可能连接负数。正确比较对象不是两个孩子本身，而是从两个孩子分别到底部的完整最优路径和。

后缀状态
~~~~~~~~

定义：

.. code-block:: text

   best(row,column) =
       从 (row,column) 出发到底部的最小路径和

最后一行没有后续选择：

.. code-block:: text

   best(last,column) = triangle[last][column]

其他位置只有两个合法孩子：

.. code-block:: text

   best(row,column) = triangle[row][column]
       + min(best(row+1,column),
             best(row+1,column+1))

为什么自底向上更自然
~~~~~~~~~~~~~~~~~~~~

当前状态依赖下一行，因此从最后一行向上计算时所有依赖已完成。工作数组初始复制最后一行；处理某行后，前 ``row+1`` 个位置被覆盖为该行的最优后缀代价。

.. list-table::
   :header-rows: 1

   * - 处理阶段
     - 工作数组有效前缀
   * - 初始底行
     - ``[4,1,8,3]``
   * - 合并 ``[6,5,7]``
     - ``[7,6,10]``
   * - 合并 ``[3,4]``
     - ``[9,10]``
   * - 合并顶点 2
     - ``[11]``

为什么可以覆盖同一个数组
~~~~~~~~~~~~~~~~~~~~~~~~

更新 ``best[column]`` 时只读取下一行状态 ``best[column]`` 与 ``best[column+1]``。当前行按列从左向右覆盖；右邻 ``best[column+1]`` 尚未修改，同列旧值在赋值表达式求值前已读取，因此依赖保持正确。

顶点状态为什么就是答案
~~~~~~~~~~~~~~~~~~~~~~

所有合法路径从唯一顶点开始。递推已经在每个位置选择到底部的最小合法后缀，处理到第 0 行后，``best[0]`` 覆盖全部顶点到最后一行路径。

负数为何不影响递推
~~~~~~~~~~~~~~~~~~

转移没有基于代价正负做剪枝，只比较两个完整后缀状态。负数只参与普通加法，因此无需特殊分支，也不会破坏最优子结构。

输入只读与原地版本
~~~~~~~~~~~~~~~~~~

若允许修改输入，可以直接把每行覆盖为后缀最优值，额外空间 ``O(1)``。主实现复制最后一行，避免调用后改变用户传入的三角形，工作空间仍为线性。

复杂度来源
~~~~~~~~~~

三角形共有 ``1+2+...+rows = O(rows²)`` 个位置，每个位置常数转移，时间 ``O(rows²)``。滚动数组长度为最后一行宽度，空间 ``O(rows)``；裸递归最坏指数级。

九语言实现
----------

C
~

.. code-block:: c

   int minimumTotal(int**triangle,int rows,int*cols){long long*best=malloc((size_t)cols[rows-1]*sizeof(long long));for(int c=0;c<cols[rows-1];c++)best[c]=triangle[rows-1][c];for(int r=rows-2;r>=0;r--)for(int c=0;c<=r;c++)best[c]=(long long)triangle[r][c]+(best[c]<best[c+1]?best[c]:best[c+1]);int out=(int)best[0];free(best);return out;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def minimumTotal(self, triangle: list[list[int]]) -> int:
           best = triangle[-1].copy()
           for row in range(len(triangle) - 2, -1, -1):
               for column in range(row + 1):
                   best[column] = triangle[row][column] + min(best[column], best[column + 1])
           return best[0]

Java
~~~~

.. code-block:: java

   class Solution {public int minimumTotal(List<List<Integer>>a){int n=a.size();long[]best=new long[n];for(int c=0;c<n;c++)best[c]=a.get(n-1).get(c);for(int r=n-2;r>=0;r--)for(int c=0;c<=r;c++)best[c]=a.get(r).get(c)+Math.min(best[c],best[c+1]);return(int)best[0];}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn minimum_total(triangle:Vec<Vec<i32>>)->i32{let mut best:Vec<i64>=triangle.last().unwrap().iter().map(|&x|x as i64).collect();for r in(0..triangle.len()-1).rev(){for c in 0..=r{best[c]=triangle[r][c]as i64+best[c].min(best[c+1]);}}best[0]as i32}}

Go
~~

.. code-block:: go

   func minimumTotal(a [][]int)int{n:=len(a);best:=make([]int64,n);for c,v:=range a[n-1]{best[c]=int64(v)};for r:=n-2;r>=0;r--{for c:=0;c<=r;c++{if best[c+1]<best[c]{best[c]=best[c+1]};best[c]+=int64(a[r][c])}};return int(best[0])}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function minimumTotal(a:number[][]):number{const best=[...a[a.length-1]];for(let r=a.length-2;r>=0;r--)for(let c=0;c<=r;c++)best[c]=a[r][c]+Math.min(best[c],best[c+1]);return best[0];}

C#
~~

.. code-block:: csharp

   public class Solution {public int MinimumTotal(IList<IList<int>>a){int n=a.Count;var best=new long[n];for(int c=0;c<n;c++)best[c]=a[n-1][c];for(int r=n-2;r>=0;r--)for(int c=0;c<=r;c++)best[c]=a[r][c]+Math.Min(best[c],best[c+1]);return(int)best[0];}}

Julia
~~~~~

.. code-block:: julia

   function minimum_total(triangle)
       best=Int64.(copy(triangle[end]))
       for r in length(triangle)-1:-1:1
           for c in 1:r
               best[c]=Int64(triangle[r][c])+min(best[c],best[c+1])
           end
       end
       Int(best[1])
   end

R
~

.. code-block:: r

   minimum_total <- function(triangle){best<-as.numeric(triangle[[length(triangle)]]);if(length(triangle)>1L)for(r in seq.int(length(triangle)-1L,1L))for(c in seq_len(r))best[[c]]<-triangle[[r]][[c]]+min(best[[c]],best[[c+1L]]);as.integer(best[[1L]])}