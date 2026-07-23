0048. Rotate Image
==================

题目信息
--------

:题号: 0048
:难度: Medium
:主题: 矩阵、坐标映射、转置、原地变换
:原题: `LeetCode 0048 <https://leetcode.com/problems/rotate-image/>`_
:重点: 顺时针映射、四元环、转置与行反转、覆盖安全性

题目重述
--------

给定 ``n × n`` 方阵，将其顺时针旋转 90 度。必须直接修改原矩阵，不能创建另一个同规模矩阵保存完整结果。

自建示例
--------

.. code-block:: text

   1 2 3      7 4 1
   4 5 6  ->  8 5 2
   7 8 9      9 6 3

单元素矩阵旋转后不变。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       void extraMatrix(std::vector<std::vector<int>>& matrix) {
           const int n = static_cast<int>(matrix.size());
           std::vector<std::vector<int>> rotated(n, std::vector<int>(n));
           for (int r = 0; r < n; ++r)
               for (int c = 0; c < n; ++c)
                   rotated[c][n - 1 - r] = matrix[r][c];
           matrix = std::move(rotated);
       }

       void fourWayCycles(std::vector<std::vector<int>>& matrix) {
           const int n = static_cast<int>(matrix.size());
           for (int layer = 0; layer < n / 2; ++layer) {
               int last = n - 1 - layer;
               for (int offset = 0; offset < last - layer; ++offset) {
                   int top = matrix[layer][layer + offset];
                   matrix[layer][layer + offset] = matrix[last - offset][layer];
                   matrix[last - offset][layer] = matrix[last][last - offset];
                   matrix[last][last - offset] = matrix[layer + offset][last];
                   matrix[layer + offset][last] = top;
               }
           }
       }

       void transposeAndReverse(std::vector<std::vector<int>>& matrix) {
           const int n = static_cast<int>(matrix.size());
           for (int r = 0; r < n; ++r)
               for (int c = r + 1; c < n; ++c)
                   std::swap(matrix[r][c], matrix[c][r]);
           for (auto& row : matrix) std::reverse(row.begin(), row.end());
       }

   public:
       void rotate(std::vector<std::vector<int>>& matrix) {
           transposeAndReverse(matrix);
       }
   };

题解
----

目标坐标映射是什么
~~~~~~~~~~~~~~~~~~

零基坐标 ``(r,c)`` 顺时针旋转后位于：

.. code-block:: text

   (r,c) -> (c,n-1-r)

额外矩阵可直接按该公式写入，但使用 ``O(n²)`` 空间，不满足原地要求。

四次映射为什么形成一个环
~~~~~~~~~~~~~~~~~~~~~~~~

连续应用旋转映射四次会回到原位置。一个非中心元素属于四元环：上边、右边、下边、左边相互搬运。分层遍历只处理每个环一次，可用一个临时变量完成原地轮换，但四组坐标较容易写错。

旋转如何拆成两个简单变换
~~~~~~~~~~~~~~~~~~~~~~~~

先沿主对角线转置：

.. code-block:: text

   (r,c) -> (c,r)

再反转每一行，把列坐标 ``r`` 变为 ``n-1-r``：

.. code-block:: text

   (c,r) -> (c,n-1-r)

复合映射正是顺时针旋转目标。两个阶段都由成对交换完成，不会丢失尚未读取的值。

三阶矩阵状态
~~~~~~~~~~~~

.. code-block:: text

   原矩阵          转置后          每行反转后
   1 2 3           1 4 7           7 4 1
   4 5 6     ->    2 5 8     ->    8 5 2
   7 8 9           3 6 9           9 6 3

转置为何只遍历主对角线上方
~~~~~~~~~~~~~~~~~~~~~~~~~~

交换 ``matrix[r][c]`` 与 ``matrix[c][r]`` 时，若遍历整个矩阵，同一对元素会被交换两次并恢复原状。只取 ``c > r``，每个非对角元素对恰好处理一次；主对角线元素无需移动。

为什么两个阶段都保持原地安全
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

转置使用对称位置互换，交换前同时取得两个值；行反转也只交换行内两端。每个动作是可逆置换，既不覆盖未保存数据，也不创建或删除元素。所有坐标经过复合置换后恰好到达目标位置。

复杂度来源
~~~~~~~~~~

三个方法都处理 ``n²`` 个矩阵元素，时间 ``O(n²)``。额外矩阵方法空间 ``O(n²)``；四元环和转置加反转仅使用临时变量，额外空间 ``O(1)``。

九语言实现
----------

C
~

.. code-block:: c

   void rotate(int **matrix,int n,int *cols){(void)cols;for(int r=0;r<n;r++)for(int c=r+1;c<n;c++){int t=matrix[r][c];matrix[r][c]=matrix[c][r];matrix[c][r]=t;}for(int r=0;r<n;r++)for(int l=0,h=n-1;l<h;l++,h--){int t=matrix[r][l];matrix[r][l]=matrix[r][h];matrix[r][h]=t;}}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def rotate(self, matrix: list[list[int]]) -> None:
           n=len(matrix)
           for r in range(n):
               for c in range(r+1,n): matrix[r][c],matrix[c][r]=matrix[c][r],matrix[r][c]
           for row in matrix: row.reverse()

Java
~~~~

.. code-block:: java

   class Solution {public void rotate(int[][]m){int n=m.length;for(int r=0;r<n;r++)for(int c=r+1;c<n;c++){int t=m[r][c];m[r][c]=m[c][r];m[c][r]=t;}for(int[]row:m)for(int l=0,h=n-1;l<h;l++,h--){int t=row[l];row[l]=row[h];row[h]=t;}}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn rotate(m:&mut Vec<Vec<i32>>){let n=m.len();for r in 0..n{for c in r+1..n{let t=m[r][c];m[r][c]=m[c][r];m[c][r]=t}}for row in m.iter_mut(){row.reverse()}}}

Go
~~

.. code-block:: go

   func rotate(m [][]int){n:=len(m);for r:=0;r<n;r++{for c:=r+1;c<n;c++{m[r][c],m[c][r]=m[c][r],m[r][c]}};for _,row:=range m{for l,h:=0,n-1;l<h;l,h=l+1,h-1{row[l],row[h]=row[h],row[l]}}}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function rotate(m:number[][]):void{const n=m.length;for(let r=0;r<n;r++)for(let c=r+1;c<n;c++)[m[r][c],m[c][r]]=[m[c][r],m[r][c]];for(const row of m)row.reverse();}

C#
~~

.. code-block:: csharp

   public class Solution {public void Rotate(int[][]m){int n=m.Length;for(int r=0;r<n;r++)for(int c=r+1;c<n;c++)(m[r][c],m[c][r])=(m[c][r],m[r][c]);foreach(var row in m)Array.Reverse(row);}}

Julia
~~~~~

.. code-block:: julia

   function rotate!(m::Matrix{Int})
       n=size(m,1)
       for r in 1:n,c in r+1:n;m[r,c],m[c,r]=m[c,r],m[r,c];end
       for r in 1:n;reverse!(@view m[r,:]);end
       m
   end

R
~

.. code-block:: r

   rotate_image <- function(m){n<-nrow(m);if(n>=2L)for(r in 1:n)if(r<n)for(c in (r+1L):n){temporary<-m[r,c];m[r,c]<-m[c,r];m[c,r]<-temporary};m[,n:1,drop=FALSE]}