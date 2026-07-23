0118. Pascal's Triangle
=======================

题目信息
--------

:题号: 0118
:难度: Easy
:主题: 数组、动态规划、组合数、二维结果构造
:原题: `LeetCode 0118 <https://leetcode.com/problems/pascals-triangle/>`_
:重点: 行边界、相邻父项、独立行容器、输出主导复杂度

题目重述
--------

给定正整数 ``numRows``，返回帕斯卡三角形的前 ``numRows`` 行。第 0 行是 ``[1]``；第 ``row`` 行长度为 ``row+1``，首尾为 1，内部值等于上一行相邻两项之和。

自建示例
--------

.. code-block:: text

   numRows = 5
   [
     [1],
     [1,1],
     [1,2,1],
     [1,3,3,1],
     [1,4,6,4,1]
   ]

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       int recursiveValue(int row, int column) {
           if (column == 0 || column == row) return 1;
           return recursiveValue(row - 1, column - 1) +
                  recursiveValue(row - 1, column);
       }

       std::vector<std::vector<int>> combinationRows(int numRows) {
           std::vector<std::vector<int>> result;
           for (int row = 0; row < numRows; ++row) {
               std::vector<int> current(row + 1, 1);
               long long value = 1;
               for (int column = 1; column < row; ++column) {
                   value = value * (row - column + 1) / column;
                   current[column] = static_cast<int>(value);
               }
               result.push_back(std::move(current));
           }
           return result;
       }

       std::vector<std::vector<int>> rowDynamicProgramming(int numRows) {
           std::vector<std::vector<int>> result;
           result.reserve(numRows);
           for (int row = 0; row < numRows; ++row) {
               std::vector<int> current(row + 1, 1);
               if (row > 0) {
                   const std::vector<int>& previous = result.back();
                   for (int column = 1; column < row; ++column)
                       current[column] = previous[column - 1] + previous[column];
               }
               result.push_back(std::move(current));
           }
           return result;
       }

   public:
       std::vector<std::vector<int>> generate(int numRows) {
           return rowDynamicProgramming(numRows);
       }
   };

题解
----

为什么按行构造
~~~~~~~~~~~~~~

第 ``row`` 行内部位置只依赖第 ``row-1`` 行。只要从上到下构造，计算当前行时上一行已经完整，不需要递归搜索或回退。

状态与边界
~~~~~~~~~~

使用零基坐标：

.. code-block:: text

   value(row, 0) = 1
   value(row, row) = 1
   value(row, column) =
       value(row-1, column-1) + value(row-1, column)

其中 ``0 < column < row``。先用 1 初始化整行，再覆盖内部位置，可以统一处理长度 1 和长度 2 的行。

.. list-table::
   :header-rows: 1

   * - 当前行
     - 上一行
     - 内部计算
   * - ``[1]``
     - 无
     - 无内部位置
   * - ``[1,1]``
     - ``[1]``
     - 无内部位置
   * - ``[1,2,1]``
     - ``[1,1]``
     - ``1+1=2``
   * - ``[1,3,3,1]``
     - ``[1,2,1]``
     - ``1+2=3``，``2+1=3``
   * - ``[1,4,6,4,1]``
     - ``[1,3,3,1]``
     - ``1+3``，``3+3``，``3+1``

为什么每一行必须独立分配
~~~~~~~~~~~~~~~~~~~~~~~~

结果是二维可变容器。若把同一个行缓冲区加入结果后继续修改，引用语义语言可能让历史行同时变化。每轮创建新容器并完成后加入结果，保证行之间互不共享可变存储。

递归定义为什么不适合作为主解法
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

递归值函数直接对应数学定义，但同一位置会被大量重复计算。例如中心值需要重复求相同父项。即使加入记忆化，最终仍需要组织二维输出；按行 DP 更直接。

组合数公式的取舍
~~~~~~~~~~~~~~~~

第 ``row`` 行第 ``column`` 项是组合数 ``C(row,column)``，可由前一项递推：

.. code-block:: text

   C(row,column) = C(row,column-1)
       * (row-column+1) / column

它不依赖上一行，但需要使用较宽中间类型并保证先乘后整除。按行父项求和更能体现题目给出的递推结构。

为什么结果完整且正确
~~~~~~~~~~~~~~~~~~~~

按行号归纳。第 0 行正确。假设上一行所有值正确，则当前行首尾按定义为 1，每个内部位置由正确的两个父项之和得到，因此整行正确。依次构造到 ``numRows-1``，得到要求的全部行。

复杂度来源
~~~~~~~~~~

返回结果包含 ``1+2+...+numRows = Theta(numRows²)`` 个整数，任何算法都至少需要相同数量的写入。主解法时间 ``Theta(numRows²)``；除返回结果和当前行外没有额外渐进空间，工作空间 ``O(numRows)``。

九语言实现
----------

C
~

.. code-block:: c

   int**generate(int numRows,int*returnSize,int**returnColumnSizes){int**out=malloc((size_t)numRows*sizeof(int*));int*cols=malloc((size_t)numRows*sizeof(int));for(int r=0;r<numRows;r++){cols[r]=r+1;out[r]=malloc((size_t)(r+1)*sizeof(int));for(int c=0;c<=r;c++)out[r][c]=1;for(int c=1;c<r;c++)out[r][c]=out[r-1][c-1]+out[r-1][c];}*returnSize=numRows;*returnColumnSizes=cols;return out;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def generate(self, numRows: int) -> list[list[int]]:
           result = []
           for row in range(numRows):
               current = [1] * (row + 1)
               if row:
                   previous = result[-1]
                   for column in range(1, row):
                       current[column] = previous[column - 1] + previous[column]
               result.append(current)
           return result

Java
~~~~

.. code-block:: java

   class Solution {public List<List<Integer>> generate(int n){List<List<Integer>>out=new ArrayList<>();for(int r=0;r<n;r++){List<Integer>row=new ArrayList<>(Collections.nCopies(r+1,1));if(r>0){List<Integer>prev=out.get(r-1);for(int c=1;c<r;c++)row.set(c,prev.get(c-1)+prev.get(c));}out.add(row);}return out;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn generate(num_rows:i32)->Vec<Vec<i32>>{let mut out=vec![];for r in 0..num_rows as usize{let mut row=vec![1;r+1];if r>0{for c in 1..r{row[c]=out[r-1][c-1]+out[r-1][c];}}out.push(row);}out}}

Go
~~

.. code-block:: go

   func generate(numRows int)[][]int{out:=make([][]int,0,numRows);for r:=0;r<numRows;r++{row:=make([]int,r+1);for c:=range row{row[c]=1};if r>0{prev:=out[r-1];for c:=1;c<r;c++{row[c]=prev[c-1]+prev[c]}};out=append(out,row)};return out}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function generate(numRows:number):number[][]{const out:number[][]=[];for(let r=0;r<numRows;r++){const row=Array(r+1).fill(1);if(r>0)for(let c=1;c<r;c++)row[c]=out[r-1][c-1]+out[r-1][c];out.push(row);}return out;}

C#
~~

.. code-block:: csharp

   public class Solution {public IList<IList<int>> Generate(int n){var o=new List<IList<int>>();for(int r=0;r<n;r++){var row=Enumerable.Repeat(1,r+1).ToList();if(r>0)for(int c=1;c<r;c++)row[c]=o[r-1][c-1]+o[r-1][c];o.Add(row);}return o;}}

Julia
~~~~~

.. code-block:: julia

   function generate_pascal(num_rows::Int)
       out=Vector{Vector{Int}}()
       for r in 0:num_rows-1
           row=ones(Int,r+1)
           if r>0;for c in 2:r;row[c]=out[r][c-1]+out[r][c];end;end
           push!(out,row)
       end
       out
   end

R
~

.. code-block:: r

   generate_pascal <- function(num_rows){out<-vector("list",num_rows);for(r in 0:(num_rows-1L)){row<-rep(1L,r+1L);if(r>1L)for(c in 2L:r)row[[c]]<-out[[r]][[c-1L]]+out[[r]][[c]];out[[r+1L]]<-row};out}