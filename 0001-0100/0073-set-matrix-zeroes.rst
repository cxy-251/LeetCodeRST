0073. Set Matrix Zeroes
=======================

题目信息
--------

:题号: 0073
:难度: Medium
:主题: 矩阵、原地标记、分阶段更新
:原题: `LeetCode 0073 <https://leetcode.com/problems/set-matrix-zeroes/>`_
:重点: 原始零见证、首行首列复用、标记冲突、写入顺序

题目重述
--------

给定非空整数矩阵。若某个位置的原始值为 0，就把它所在整行和整列设为 0。必须原地修改；新增的零不能继续触发更多行列。目标额外空间为常数。

自建示例
--------

.. code-block:: text

   1  2  0  4       0  0  0  0
   5  6  7  8  ->   0  6  0  8
   0 10 11 12       0  0  0  0

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       void copyAndCheck(std::vector<std::vector<int>>& matrix) {
           auto original = matrix;
           int rows = matrix.size(), cols = matrix[0].size();
           for (int row = 0; row < rows; ++row)
               for (int col = 0; col < cols; ++col)
                   if (original[row][col] == 0) {
                       for (int c = 0; c < cols; ++c) matrix[row][c] = 0;
                       for (int r = 0; r < rows; ++r) matrix[r][col] = 0;
                   }
       }

       void markerArrays(std::vector<std::vector<int>>& matrix) {
           int rows = matrix.size(), cols = matrix[0].size();
           std::vector<char> zero_row(rows), zero_col(cols);
           for (int row = 0; row < rows; ++row)
               for (int col = 0; col < cols; ++col)
                   if (matrix[row][col] == 0) zero_row[row] = zero_col[col] = true;
           for (int row = 0; row < rows; ++row)
               for (int col = 0; col < cols; ++col)
                   if (zero_row[row] || zero_col[col]) matrix[row][col] = 0;
       }

       void firstRowAndColumn(std::vector<std::vector<int>>& matrix) {
           int rows = matrix.size(), cols = matrix[0].size();
           bool first_row_zero = false, first_col_zero = false;
           for (int col = 0; col < cols; ++col) if (matrix[0][col] == 0) first_row_zero = true;
           for (int row = 0; row < rows; ++row) if (matrix[row][0] == 0) first_col_zero = true;

           for (int row = 1; row < rows; ++row)
               for (int col = 1; col < cols; ++col)
                   if (matrix[row][col] == 0) matrix[row][0] = matrix[0][col] = 0;

           for (int row = 1; row < rows; ++row)
               for (int col = 1; col < cols; ++col)
                   if (matrix[row][0] == 0 || matrix[0][col] == 0) matrix[row][col] = 0;

           if (first_row_zero) for (int col = 0; col < cols; ++col) matrix[0][col] = 0;
           if (first_col_zero) for (int row = 0; row < rows; ++row) matrix[row][0] = 0;
       }

   public:
       void setZeroes(std::vector<std::vector<int>>& matrix) {
           firstRowAndColumn(matrix);
       }
   };

题解
----

为什么不能边发现边扩散
~~~~~~~~~~~~~~~~~~~~

若读到零后立刻清空整行整列，新写入的零会在后续扫描中被误认为原始零，触发额外行列。因此必须先完整记录触发集合，再统一写入结果。

行列标记数组保存什么
~~~~~~~~~~~~~~~~~~~~

``zero_row[row]`` 表示该行含原始零，``zero_col[col]`` 表示该列含原始零。第二次扫描时，只要任一标记为真就写零。它把原始矩阵快照压缩成 ``O(m+n)`` 个布尔见证。

为什么可以复用首行首列
~~~~~~~~~~~~~~~~~~~~~~

每行只需要一个标记槽，每列也只需要一个标记槽。``matrix[row][0]`` 可表示行标记，``matrix[0][col]`` 可表示列标记；内部零只负责把对应两个槽写成 0。

matrix[0][0] 为什么不够
~~~~~~~~~~~~~~~~~~~~~~~

左上角同时属于首行和首列，一个值无法独立表示“首行原本有零”和“首列原本有零”。因此在覆盖标记区前先用两个布尔值保存这两项事实。

分阶段顺序
~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 阶段
     - 读取范围
     - 动作
   * - 保存边界
     - 首行、首列
     - 记录两个布尔值
   * - 写标记
     - 内部区域
     - 原始零写入首行首列
   * - 清内部
     - 内部区域
     - 根据标记归零
   * - 清边界
     - 首行、首列
     - 根据布尔值归零

为什么内部必须先于首行首列清零
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

首行首列在第二阶段仍充当标记区。若提前把它们整体归零，会把所有行列都标记为需要归零。先完成内部写入，再处理边界，标记信息才不会被破坏。

为什么只由原始零触发
~~~~~~~~~~~~~~~~~~~~

标记阶段只读取尚未被批量修改的内部矩阵；之后不再根据新值创建标记。首行首列原始零又提前保存，因此触发集合与输入完全一致。

复杂度来源
~~~~~~~~~~

三次线性扫描仍为 ``O(mn)`` 时间。首行首列方法只使用两个布尔值，额外空间 ``O(1)``；标记数组方法为 ``O(m+n)``。

九语言实现
----------

C
~

.. code-block:: c

   void setZeroes(int**a,int rows,int*cols){int n=cols[0];bool fr=false,fc=false;for(int c=0;c<n;c++)if(a[0][c]==0)fr=true;for(int r=0;r<rows;r++)if(a[r][0]==0)fc=true;for(int r=1;r<rows;r++)for(int c=1;c<n;c++)if(a[r][c]==0)a[r][0]=a[0][c]=0;for(int r=1;r<rows;r++)for(int c=1;c<n;c++)if(a[r][0]==0||a[0][c]==0)a[r][c]=0;if(fr)for(int c=0;c<n;c++)a[0][c]=0;if(fc)for(int r=0;r<rows;r++)a[r][0]=0;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def setZeroes(self, a: list[list[int]]) -> None:
           rows,cols=len(a),len(a[0]);fr=any(x==0 for x in a[0]);fc=any(a[r][0]==0 for r in range(rows))
           for r in range(1,rows):
               for c in range(1,cols):
                   if a[r][c]==0:a[r][0]=a[0][c]=0
           for r in range(1,rows):
               for c in range(1,cols):
                   if a[r][0]==0 or a[0][c]==0:a[r][c]=0
           if fr:a[0]=[0]*cols
           if fc:
               for r in range(rows):a[r][0]=0

Java
~~~~

.. code-block:: java

   class Solution {public void setZeroes(int[][]a){int m=a.length,n=a[0].length;boolean fr=false,fc=false;for(int x:a[0])if(x==0)fr=true;for(int[]row:a)if(row[0]==0)fc=true;for(int r=1;r<m;r++)for(int c=1;c<n;c++)if(a[r][c]==0){a[r][0]=0;a[0][c]=0;}for(int r=1;r<m;r++)for(int c=1;c<n;c++)if(a[r][0]==0||a[0][c]==0)a[r][c]=0;if(fr)Arrays.fill(a[0],0);if(fc)for(int[]row:a)row[0]=0;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn set_zeroes(a:&mut Vec<Vec<i32>>){let(m,n)=(a.len(),a[0].len());let fr=a[0].contains(&0);let fc=(0..m).any(|r|a[r][0]==0);for r in 1..m{for c in 1..n{if a[r][c]==0{a[r][0]=0;a[0][c]=0}}}for r in 1..m{for c in 1..n{if a[r][0]==0||a[0][c]==0{a[r][c]=0}}}if fr{a[0].fill(0)}if fc{for row in a{row[0]=0}}}}

Go
~~

.. code-block:: go

   func setZeroes(a [][]int){m,n:=len(a),len(a[0]);fr,fc:=false,false;for _,x:=range a[0]{if x==0{fr=true}};for r:=0;r<m;r++{if a[r][0]==0{fc=true}};for r:=1;r<m;r++{for c:=1;c<n;c++{if a[r][c]==0{a[r][0],a[0][c]=0,0}}};for r:=1;r<m;r++{for c:=1;c<n;c++{if a[r][0]==0||a[0][c]==0{a[r][c]=0}}};if fr{for c:=0;c<n;c++{a[0][c]=0}};if fc{for r:=0;r<m;r++{a[r][0]=0}}}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function setZeroes(a:number[][]):void{const m=a.length,n=a[0].length;const fr=a[0].includes(0),fc=a.some(r=>r[0]===0);for(let r=1;r<m;r++)for(let c=1;c<n;c++)if(a[r][c]===0)a[r][0]=a[0][c]=0;for(let r=1;r<m;r++)for(let c=1;c<n;c++)if(a[r][0]===0||a[0][c]===0)a[r][c]=0;if(fr)a[0].fill(0);if(fc)for(const row of a)row[0]=0;}

C#
~~

.. code-block:: csharp

   public class Solution {public void SetZeroes(int[][]a){int m=a.Length,n=a[0].Length;bool fr=Array.Exists(a[0],x=>x==0),fc=Array.Exists(a,r=>r[0]==0);for(int r=1;r<m;r++)for(int c=1;c<n;c++)if(a[r][c]==0)a[r][0]=a[0][c]=0;for(int r=1;r<m;r++)for(int c=1;c<n;c++)if(a[r][0]==0||a[0][c]==0)a[r][c]=0;if(fr)Array.Fill(a[0],0);if(fc)foreach(var row in a)row[0]=0;}}

Julia
~~~~~

.. code-block:: julia

   function set_zeroes!(a)
       m,n=size(a);fr=any(a[1,:].==0);fc=any(a[:,1].==0)
       for r in 2:m,c in 2:n;if a[r,c]==0;a[r,1]=a[1,c]=0;end;end
       for r in 2:m,c in 2:n;if a[r,1]==0||a[1,c]==0;a[r,c]=0;end;end
       fr&&(a[1,:].=0);fc&&(a[:,1].=0);a
   end

R
~

.. code-block:: r

   set_zeroes <- function(a){m<-nrow(a);n<-ncol(a);fr<-any(a[1,]==0);fc<-any(a[,1]==0);if(m>1&&n>1)for(r in 2:m)for(c in 2:n)if(a[r,c]==0){a[r,1]<-0;a[1,c]<-0};if(m>1&&n>1)for(r in 2:m)for(c in 2:n)if(a[r,1]==0||a[1,c]==0)a[r,c]<-0;if(fr)a[1,]<-0;if(fc)a[,1]<-0;a}
