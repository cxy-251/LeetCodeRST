0054. Spiral Matrix
===================

题目信息
--------

:题号: 0054
:难度: Medium
:主题: 矩阵、边界模拟、方向状态、分层遍历
:原题: `LeetCode 0054 <https://leetcode.com/problems/spiral-matrix/>`_
:重点: 顺时针顺序、四边界收缩、单行单列、每格访问一次

题目重述
--------

给定 ``m × n`` 整数矩阵 ``matrix``，从左上角开始，按向右、向下、向左、向上的顺时针螺旋顺序返回所有元素。输出必须包含矩阵中的每个位置且恰好一次。

约束为 ``1 <= m, n <= 10``、``-100 <= matrix[i][j] <= 100``。

自建示例
--------

.. code-block:: text

   输入：
   [[1,2,3],
    [4,5,6],
    [7,8,9],
    [10,11,12]]

   输出：[1,2,3,6,9,12,11,10,7,4,5,8]

先遍历外层边界，最后访问内部剩余的 ``5`` 和 ``8``。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       std::vector<int> directionVisited(const std::vector<std::vector<int>>& matrix) {
           int rows = matrix.size(), cols = matrix[0].size();
           std::vector<std::vector<char>> visited(rows, std::vector<char>(cols));
           int dr[4] = {0, 1, 0, -1};
           int dc[4] = {1, 0, -1, 0};
           int row = 0, col = 0, direction = 0;
           std::vector<int> result;
           for (int count = 0; count < rows * cols; ++count) {
               result.push_back(matrix[row][col]);
               visited[row][col] = true;
               int nr = row + dr[direction], nc = col + dc[direction];
               if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || visited[nr][nc]) {
                   direction = (direction + 1) % 4;
                   nr = row + dr[direction]; nc = col + dc[direction];
               }
               row = nr; col = nc;
           }
           return result;
       }

       void peel(const std::vector<std::vector<int>>& matrix,
                 int top, int bottom, int left, int right,
                 std::vector<int>& result) {
           if (top > bottom || left > right) return;
           for (int col = left; col <= right; ++col) result.push_back(matrix[top][col]);
           for (int row = top + 1; row <= bottom; ++row) result.push_back(matrix[row][right]);
           if (top < bottom)
               for (int col = right - 1; col >= left; --col) result.push_back(matrix[bottom][col]);
           if (left < right)
               for (int row = bottom - 1; row > top; --row) result.push_back(matrix[row][left]);
           peel(matrix, top + 1, bottom - 1, left + 1, right - 1, result);
       }

       std::vector<int> fourBoundaries(const std::vector<std::vector<int>>& matrix) {
           int top = 0, bottom = matrix.size() - 1;
           int left = 0, right = matrix[0].size() - 1;
           std::vector<int> result;
           result.reserve(matrix.size() * matrix[0].size());
           while (top <= bottom && left <= right) {
               for (int col = left; col <= right; ++col) result.push_back(matrix[top][col]);
               ++top;
               for (int row = top; row <= bottom; ++row) result.push_back(matrix[row][right]);
               --right;
               if (top <= bottom) {
                   for (int col = right; col >= left; --col) result.push_back(matrix[bottom][col]);
                   --bottom;
               }
               if (left <= right) {
                   for (int row = bottom; row >= top; --row) result.push_back(matrix[row][left]);
                   ++left;
               }
           }
           return result;
       }

   public:
       std::vector<int> spiralOrder(std::vector<std::vector<int>>& matrix) {
           return fourBoundaries(matrix);
       }
   };

题解
----

方向模拟为何需要 visited
~~~~~~~~~~~~~~~~~~~~~~~

按右、下、左、上的方向移动很直观，但仅检查矩阵边界不足以判断转向，因为内部位置也可能已经访问。``visited`` 记录每个格子，使移动统一，却额外使用 ``O(mn)`` 空间。

剩余元素为何始终是矩形
~~~~~~~~~~~~~~~~~~~~

完成最外层上、右、下、左四条边后，未访问位置恰好是去掉一圈后的内部矩形。用 ``top``、``bottom``、``left``、``right`` 描述它，就不再需要逐格访问标记。

边界更新顺序
~~~~~~~~~~~~

每轮先输出上边并增加 ``top``，再输出右边并减少 ``right``。此时剩余矩形可能已经为空，因此输出下边前检查 ``top <= bottom``；输出左边前检查 ``left <= right``。

.. list-table::
   :header-rows: 1

   * - 阶段
     - 输出
     - 更新后边界
   * - 上边
     - ``1,2,3``
     - ``top = 1``
   * - 右边
     - ``6,9,12``
     - ``right = 1``
   * - 下边
     - ``11,10``
     - ``bottom = 2``
   * - 左边
     - ``7,4``
     - ``left = 1``
   * - 内层
     - ``5,8``
     - 矩形耗尽

单行为什么不能再走下边
~~~~~~~~~~~~~~~~~~~~~~

若剩余区域只有一行，上边已经输出这行全部元素，``top`` 增加后会超过 ``bottom``。缺少守卫时，下边会反向重复输出同一行。单列情况同理，右边已经输出剩余列，左边必须跳过。

每个元素为何恰好输出一次
~~~~~~~~~~~~~~~~~~~~~~

每条边只访问当前剩余矩形的边界，输出后立刻把该边移出矩形。不同轮次处理的矩形互相嵌套且边界不重合；循环结束条件表示没有剩余位置，因此不重不漏。

递归剥层与迭代边界的关系
~~~~~~~~~~~~~~~~~~~~~~~~

递归方法一次处理外圈，再调用内部矩形；它与四边界循环状态完全一致。迭代避免 ``O(min(m,n))`` 调用栈，更适合作为主实现。

复杂度来源
~~~~~~~~~~

每个元素访问一次，时间 ``O(mn)``。四边界方法除返回数组外只用常数状态；visited 方法额外使用 ``O(mn)``，递归剥层使用 ``O(min(m,n))`` 栈。

九语言实现
----------

C
~

.. code-block:: c

   int*spiralOrder(int**a,int rows,int*cols,int*returnSize){int n=cols[0],top=0,bottom=rows-1,left=0,right=n-1,k=0;int*out=malloc((size_t)rows*n*sizeof(int));while(top<=bottom&&left<=right){for(int c=left;c<=right;c++)out[k++]=a[top][c];top++;for(int r=top;r<=bottom;r++)out[k++]=a[r][right];right--;if(top<=bottom){for(int c=right;c>=left;c--)out[k++]=a[bottom][c];bottom--;}if(left<=right){for(int r=bottom;r>=top;r--)out[k++]=a[r][left];left++;}}*returnSize=k;return out;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def spiralOrder(self, matrix: list[list[int]]) -> list[int]:
           top, bottom, left, right = 0, len(matrix)-1, 0, len(matrix[0])-1
           result = []
           while top <= bottom and left <= right:
               result.extend(matrix[top][left:right+1]); top += 1
               for row in range(top, bottom+1): result.append(matrix[row][right])
               right -= 1
               if top <= bottom:
                   result.extend(reversed(matrix[bottom][left:right+1])); bottom -= 1
               if left <= right:
                   for row in range(bottom, top-1, -1): result.append(matrix[row][left])
                   left += 1
           return result

Java
~~~~

.. code-block:: java

   class Solution {public List<Integer> spiralOrder(int[][]a){List<Integer>o=new ArrayList<>();int t=0,b=a.length-1,l=0,r=a[0].length-1;while(t<=b&&l<=r){for(int c=l;c<=r;c++)o.add(a[t][c]);t++;for(int i=t;i<=b;i++)o.add(a[i][r]);r--;if(t<=b){for(int c=r;c>=l;c--)o.add(a[b][c]);b--;}if(l<=r){for(int i=b;i>=t;i--)o.add(a[i][l]);l++;}}return o;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn spiral_order(a:Vec<Vec<i32>>)->Vec<i32>{let(mut t,mut b,mut l,mut r)=(0i32,a.len()as i32-1,0i32,a[0].len()as i32-1);let mut o=vec![];while t<=b&&l<=r{for c in l..=r{o.push(a[t as usize][c as usize])}t+=1;for i in t..=b{o.push(a[i as usize][r as usize])}r-=1;if t<=b{for c in(l..=r).rev(){o.push(a[b as usize][c as usize])}b-=1}if l<=r{for i in(t..=b).rev(){o.push(a[i as usize][l as usize])}l+=1}}o}}

Go
~~

.. code-block:: go

   func spiralOrder(a [][]int)[]int{t,b,l,r:=0,len(a)-1,0,len(a[0])-1;o:=[]int{};for t<=b&&l<=r{for c:=l;c<=r;c++{o=append(o,a[t][c])};t++;for i:=t;i<=b;i++{o=append(o,a[i][r])};r--;if t<=b{for c:=r;c>=l;c--{o=append(o,a[b][c])};b--};if l<=r{for i:=b;i>=t;i--{o=append(o,a[i][l])};l++}};return o}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function spiralOrder(a:number[][]):number[]{let t=0,b=a.length-1,l=0,r=a[0].length-1;const o:number[]=[];while(t<=b&&l<=r){for(let c=l;c<=r;c++)o.push(a[t][c]);t++;for(let i=t;i<=b;i++)o.push(a[i][r]);r--;if(t<=b){for(let c=r;c>=l;c--)o.push(a[b][c]);b--;}if(l<=r){for(let i=b;i>=t;i--)o.push(a[i][l]);l++;}}return o;}

C#
~~

.. code-block:: csharp

   public class Solution {public IList<int> SpiralOrder(int[][]a){var o=new List<int>();int t=0,b=a.Length-1,l=0,r=a[0].Length-1;while(t<=b&&l<=r){for(int c=l;c<=r;c++)o.Add(a[t][c]);t++;for(int i=t;i<=b;i++)o.Add(a[i][r]);r--;if(t<=b){for(int c=r;c>=l;c--)o.Add(a[b][c]);b--;}if(l<=r){for(int i=b;i>=t;i--)o.Add(a[i][l]);l++;}}return o;}}

Julia
~~~~~

.. code-block:: julia

   function spiral_order(a)
       t=1;b=size(a,1);l=1;r=size(a,2);o=Int[]
       while t<=b&&l<=r
           for c in l:r;push!(o,a[t,c]);end;t+=1
           for i in t:b;push!(o,a[i,r]);end;r-=1
           if t<=b;for c in r:-1:l;push!(o,a[b,c]);end;b-=1;end
           if l<=r;for i in b:-1:t;push!(o,a[i,l]);end;l+=1;end
       end;o
   end

R
~

.. code-block:: r

   spiral_order <- function(a){t<-1L;b<-nrow(a);l<-1L;r<-ncol(a);o<-integer();while(t<=b&&l<=r){o<-c(o,a[t,l:r]);t<-t+1L;if(t<=b)o<-c(o,a[t:b,r]);r<-r-1L;if(t<=b&&l<=r){o<-c(o,a[b,seq.int(r,l)]);b<-b-1L};if(l<=r&&t<=b){o<-c(o,a[seq.int(b,t),l]);l<-l+1L}};o}
