0059. Spiral Matrix II
======================

题目信息
--------

:题号: 0059
:难度: Medium
:主题: 矩阵、边界模拟、螺旋构造、坐标状态
:原题: `LeetCode 0059 <https://leetcode.com/problems/spiral-matrix-ii/>`_
:教学重点: 递增写入、剩余矩形、四边界收缩、中心点处理

题目重述
--------

给定正整数 ``n``，生成 ``n × n`` 矩阵，把 ``1`` 到 ``n²`` 按顺时针螺旋顺序写入。返回矩阵本身；输出空间不计入算法额外空间。

自建示例
--------

.. code-block:: text

   n = 3
   [1,2,3]
   [8,9,4]
   [7,6,5]

.. code-block:: text

   n = 1 -> [[1]]

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       std::vector<std::vector<int>> directionSimulation(int n) {
           std::vector<std::vector<int>> matrix(n, std::vector<int>(n));
           int dr[4] = {0, 1, 0, -1};
           int dc[4] = {1, 0, -1, 0};
           int row = 0, col = 0, direction = 0;
           for (int value = 1; value <= n * n; ++value) {
               matrix[row][col] = value;
               int nr = row + dr[direction], nc = col + dc[direction];
               if (nr < 0 || nr >= n || nc < 0 || nc >= n || matrix[nr][nc] != 0) {
                   direction = (direction + 1) % 4;
                   nr = row + dr[direction]; nc = col + dc[direction];
               }
               row = nr; col = nc;
           }
           return matrix;
       }

       std::vector<std::vector<int>> layerCoordinates(int n) {
           std::vector<std::vector<int>> matrix(n, std::vector<int>(n));
           int value = 1;
           for (int layer = 0; layer < (n + 1) / 2; ++layer) {
               int last = n - 1 - layer;
               if (layer == last) { matrix[layer][layer] = value++; continue; }
               for (int col = layer; col < last; ++col) matrix[layer][col] = value++;
               for (int row = layer; row < last; ++row) matrix[row][last] = value++;
               for (int col = last; col > layer; --col) matrix[last][col] = value++;
               for (int row = last; row > layer; --row) matrix[row][layer] = value++;
           }
           return matrix;
       }

       std::vector<std::vector<int>> fourBoundaries(int n) {
           std::vector<std::vector<int>> matrix(n, std::vector<int>(n));
           int top = 0, bottom = n - 1, left = 0, right = n - 1;
           int value = 1;
           while (top <= bottom && left <= right) {
               for (int col = left; col <= right; ++col) matrix[top][col] = value++;
               ++top;
               for (int row = top; row <= bottom; ++row) matrix[row][right] = value++;
               --right;
               if (top <= bottom) {
                   for (int col = right; col >= left; --col) matrix[bottom][col] = value++;
                   --bottom;
               }
               if (left <= right) {
                   for (int row = bottom; row >= top; --row) matrix[row][left] = value++;
                   ++left;
               }
           }
           return matrix;
       }

   public:
       std::vector<std::vector<int>> generateMatrix(int n) {
           return fourBoundaries(n);
       }
   };

题解
----

如何从第 54 题得到本题
~~~~~~~~~~~~~~~~~~~~

第 54 题给定矩阵并按螺旋顺序读取。本题的访问顺序完全相同，只需先建立空矩阵，把每次读取操作替换为写入当前 ``value``，随后令 ``value++``。

方向模拟如何判断转向
~~~~~~~~~~~~~~~~~~

矩阵初始为 0，而合法写入值从 1 开始，因此 ``matrix[next] != 0`` 可以兼作访问标记。下一位置越界或已写入时顺时针转向。该方法直观，但把“0 表示未写入”与题目值域绑定。

四边界为何更稳定
~~~~~~~~~~~~~~~~

尚未写入的位置始终构成矩形。每轮依次写上边、右边、下边、左边，并将对应边界向内移动。它不依赖哨兵值，也不需要方向数组。

状态演化
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 阶段
     - 写入值
     - 三阶矩阵位置
   * - 上边
     - ``1,2,3``
     - ``(0,0)..(0,2)``
   * - 右边
     - ``4,5``
     - ``(1,2),(2,2)``
   * - 下边
     - ``6,7``
     - ``(2,1),(2,0)``
   * - 左边
     - ``8``
     - ``(1,0)``
   * - 中心
     - ``9``
     - ``(1,1)``

为什么守卫仍然必要
~~~~~~~~~~~~~~~~~~

奇数阶矩阵最终只剩中心点，上边写入后剩余矩形立即耗尽；若继续执行下边或左边，会重复覆盖中心。更新 ``top`` 和 ``right`` 后重新检查边界，可统一处理中心、单行及单列。

按圈坐标方法的取舍
~~~~~~~~~~~~~~~~~~

已知 ``layer`` 时可以计算该圈四条边的坐标范围，避免在循环中维护四个边界。但四段循环的端点需要刻意排除角点，中心层还需单独处理；四边界写法更接近第 54 题并更易验证。

值与位置为什么一一对应
~~~~~~~~~~~~~~~~~~~~~~

每次边界遍历只写当前剩余矩形的一条尚未处理边，写完后把它移出矩形。所有位置恰好访问一次；``value`` 每次访问后增加 1，从初始 1 到最后 ``n²``，因此每个目标值也恰好写入一次。

为什么最终矩阵满足螺旋顺序
~~~~~~~~~~~~~~~~~~~~~~~~~~

同一轮四条边按右、下、左、上的方向连接成外圈；下一轮处理严格位于其内部的矩形。外圈先于内圈且每圈内部顺时针，因此整个写入序列正是顺时针螺旋顺序。

复杂度来源
~~~~~~~~~~

必须写入 ``n²`` 个位置，时间 ``O(n²)``。除返回矩阵外，四边界方法只使用常数变量，算法额外空间 ``O(1)``；方向方法同样复用输出矩阵作为访问状态。

九语言实现
----------

C
~

.. code-block:: c

   int**generateMatrix(int n,int*returnSize,int**returnCols){int**a=malloc((size_t)n*sizeof(int*));int*sizes=malloc((size_t)n*sizeof(int));for(int i=0;i<n;i++){a[i]=calloc((size_t)n,sizeof(int));sizes[i]=n;}int t=0,b=n-1,l=0,r=n-1,v=1;while(t<=b&&l<=r){for(int c=l;c<=r;c++)a[t][c]=v++;t++;for(int i=t;i<=b;i++)a[i][r]=v++;r--;if(t<=b){for(int c=r;c>=l;c--)a[b][c]=v++;b--;}if(l<=r){for(int i=b;i>=t;i--)a[i][l]=v++;l++;}}*returnSize=n;*returnCols=sizes;return a;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def generateMatrix(self, n: int) -> list[list[int]]:
           matrix = [[0] * n for _ in range(n)]
           top, bottom, left, right, value = 0, n-1, 0, n-1, 1
           while top <= bottom and left <= right:
               for col in range(left, right+1): matrix[top][col] = value; value += 1
               top += 1
               for row in range(top, bottom+1): matrix[row][right] = value; value += 1
               right -= 1
               if top <= bottom:
                   for col in range(right, left-1, -1): matrix[bottom][col] = value; value += 1
                   bottom -= 1
               if left <= right:
                   for row in range(bottom, top-1, -1): matrix[row][left] = value; value += 1
                   left += 1
           return matrix

Java
~~~~

.. code-block:: java

   class Solution {public int[][] generateMatrix(int n){int[][]a=new int[n][n];int t=0,b=n-1,l=0,r=n-1,v=1;while(t<=b&&l<=r){for(int c=l;c<=r;c++)a[t][c]=v++;t++;for(int i=t;i<=b;i++)a[i][r]=v++;r--;if(t<=b){for(int c=r;c>=l;c--)a[b][c]=v++;b--;}if(l<=r){for(int i=b;i>=t;i--)a[i][l]=v++;l++;}}return a;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn generate_matrix(n:i32)->Vec<Vec<i32>>{let n=n as usize;let mut a=vec![vec![0;n];n];let(mut t,mut b,mut l,mut r,mut v)=(0i32,n as i32-1,0i32,n as i32-1,1);while t<=b&&l<=r{for c in l..=r{a[t as usize][c as usize]=v;v+=1}t+=1;for i in t..=b{a[i as usize][r as usize]=v;v+=1}r-=1;if t<=b{for c in(l..=r).rev(){a[b as usize][c as usize]=v;v+=1}b-=1}if l<=r{for i in(t..=b).rev(){a[i as usize][l as usize]=v;v+=1}l+=1}}a}}

Go
~~

.. code-block:: go

   func generateMatrix(n int)[][]int{a:=make([][]int,n);for i:=range a{a[i]=make([]int,n)};t,b,l,r,v:=0,n-1,0,n-1,1;for t<=b&&l<=r{for c:=l;c<=r;c++{a[t][c]=v;v++};t++;for i:=t;i<=b;i++{a[i][r]=v;v++};r--;if t<=b{for c:=r;c>=l;c--{a[b][c]=v;v++};b--};if l<=r{for i:=b;i>=t;i--{a[i][l]=v;v++};l++}};return a}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function generateMatrix(n:number):number[][]{const a=Array.from({length:n},()=>Array(n).fill(0));let t=0,b=n-1,l=0,r=n-1,v=1;while(t<=b&&l<=r){for(let c=l;c<=r;c++)a[t][c]=v++;t++;for(let i=t;i<=b;i++)a[i][r]=v++;r--;if(t<=b){for(let c=r;c>=l;c--)a[b][c]=v++;b--;}if(l<=r){for(let i=b;i>=t;i--)a[i][l]=v++;l++;}}return a;}

C#
~~

.. code-block:: csharp

   public class Solution {public int[][] GenerateMatrix(int n){var a=new int[n][];for(int i=0;i<n;i++)a[i]=new int[n];int t=0,b=n-1,l=0,r=n-1,v=1;while(t<=b&&l<=r){for(int c=l;c<=r;c++)a[t][c]=v++;t++;for(int i=t;i<=b;i++)a[i][r]=v++;r--;if(t<=b){for(int c=r;c>=l;c--)a[b][c]=v++;b--;}if(l<=r){for(int i=b;i>=t;i--)a[i][l]=v++;l++;}}return a;}}

Julia
~~~~~

.. code-block:: julia

   function generate_matrix(n::Int)
       a=zeros(Int,n,n);t=1;b=n;l=1;r=n;v=1
       while t<=b&&l<=r
           for c in l:r;a[t,c]=v;v+=1;end;t+=1
           for i in t:b;a[i,r]=v;v+=1;end;r-=1
           if t<=b;for c in r:-1:l;a[b,c]=v;v+=1;end;b-=1;end
           if l<=r;for i in b:-1:t;a[i,l]=v;v+=1;end;l+=1;end
       end;a
   end

R
~

.. code-block:: r

   generate_matrix <- function(n){a<-matrix(0L,n,n);t<-1L;b<-n;l<-1L;r<-n;v<-1L;while(t<=b&&l<=r){for(c in l:r){a[t,c]<-v;v<-v+1L};t<-t+1L;if(t<=b)for(i in t:b){a[i,r]<-v;v<-v+1L};r<-r-1L;if(t<=b&&l<=r){for(c in seq.int(r,l)){a[b,c]<-v;v<-v+1L};b<-b-1L};if(l<=r&&t<=b){for(i in seq.int(b,t)){a[i,l]<-v;v<-v+1L};l<-l+1L}};a}
