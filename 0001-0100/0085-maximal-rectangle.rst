0085. Maximal Rectangle
=======================

题目信息
--------

:题号: 0085
:题名: Maximal Rectangle
:难度: Hard
:类型: Algorithms
:主题: 矩阵、动态柱高、单调栈
:原题: `LeetCode 0085 <https://leetcode.com/problems/maximal-rectangle/>`_
:教学重点: 固定底边、连续 1 高度、柱状图复用、二维覆盖

题目重述
--------

给定只包含字符 ``'0'`` 和 ``'1'`` 的矩阵，返回全部由 ``'1'`` 组成的最大轴对齐矩形面积。空矩阵返回 0，输入只读。

自建示例
--------

.. code-block:: text

   1 0 1 0 0
   1 0 1 1 1
   1 1 1 1 1
   1 0 0 1 0

   最大面积为 6：第三行作为底边，高度 2、宽度 3。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       int enumerateTopBottom(const std::vector<std::vector<char>>& matrix) {
           int rows = matrix.size(), cols = matrix[0].size(), best = 0;
           for (int top = 0; top < rows; ++top) {
               std::vector<char> valid(cols, true);
               for (int bottom = top; bottom < rows; ++bottom) {
                   int width = 0;
                   for (int col = 0; col < cols; ++col) {
                       valid[col] = valid[col] && matrix[bottom][col] == '1';
                       width = valid[col] ? width + 1 : 0;
                       best = std::max(best, width * (bottom - top + 1));
                   }
               }
           }
           return best;
       }

       int histogramArea(const std::vector<int>& heights) {
           std::vector<int> stack{-1};
           int best = 0, n = heights.size();
           for (int right = 0; right <= n; ++right) {
               int current = right == n ? 0 : heights[right];
               while (stack.back() != -1 && heights[stack.back()] > current) {
                   int middle = stack.back(); stack.pop_back();
                   best = std::max(best, heights[middle] * (right - stack.back() - 1));
               }
               stack.push_back(right);
           }
           return best;
       }

       int rowHistograms(const std::vector<std::vector<char>>& matrix) {
           if (matrix.empty()) return 0;
           std::vector<int> heights(matrix[0].size());
           int best = 0;
           for (const auto& row : matrix) {
               for (int col = 0; col < static_cast<int>(row.size()); ++col)
                   heights[col] = row[col] == '1' ? heights[col] + 1 : 0;
               best = std::max(best, histogramArea(heights));
           }
           return best;
       }

   public:
       int maximalRectangle(std::vector<std::vector<char>>& matrix) {
           return rowHistograms(matrix);
       }
   };

题解
----

为什么固定矩形底边
~~~~~~~~~~~~~~~~

任意全一矩形都有唯一底边行。处理某行 ``row`` 时，对每列维护向上连续 ``'1'`` 数量 ``heights[col]``，所有以该行为底边的矩形便转化为柱状图中的连续区间。

柱高如何更新
~~~~~~~~~~~~

若当前格为 ``'1'``，连续高度在上一行基础上加一；若为 ``'0'``，任何以当前行为底且经过该列的矩形都被截断，高度必须清零。

.. code-block:: text

   heights[col] = matrix[row][col] == '1' ? heights[col] + 1 : 0

示例状态
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 处理行
     - heights
     - 当前柱状图最大面积
   * - 0
     - ``[1,0,1,0,0]``
     - 1
   * - 1
     - ``[2,0,2,1,1]``
     - 3
   * - 2
     - ``[3,1,3,2,2]``
     - 6
   * - 3
     - ``[4,0,0,3,0]``
     - 4

为什么可以复用第 84 题
~~~~~~~~~~~~~~~~~~~~~~

固定底边后，连续列区间能组成矩形的最大高度等于该区间柱高最小值，正是柱状图最大矩形模型。单调栈会为每个限制高度找到左右首个更矮位置并结算面积。

每个二维矩形为何被覆盖
~~~~~~~~~~~~~~~~~~~~~~

任意合法矩形在处理其底边行时，覆盖列的柱高都至少等于矩形高度，因此对应一个柱状图候选。反过来，柱状图高度 ``h``、宽度 ``w`` 的候选表示这些列向上连续 ``h`` 行均为 1，映射回矩阵一定合法。

为什么不需要保存历史矩阵
~~~~~~~~~~~~~~~~~~~~~~~~

下一行高度只依赖上一行同列高度和当前字符，一维 ``heights`` 已包含所有必要纵向信息。更早行内容无需保留。

上下边界枚举重复了什么
~~~~~~~~~~~~~~~~~~~~~~

枚举每对 ``top,bottom`` 并检查连续合法列需要 ``O(rows²*cols)``。动态柱高把所有不同 ``top`` 对同一底边的纵向信息压缩到一个高度值，再用线性单调栈同时处理所有可能上边界。

复杂度来源
~~~~~~~~~~

每行更新柱高 ``O(cols)``，单调栈同为 ``O(cols)``，总时间 ``O(rows*cols)``。柱高和栈使用 ``O(cols)`` 空间。

九语言实现
----------

C
~

.. code-block:: c

   static int hist(int*h,int n){int*st=malloc((n+2)*sizeof(int)),top=0,best=0;st[0]=-1;for(int r=0;r<=n;r++){int cur=r==n?0:h[r];while(st[top]!=-1&&h[st[top]]>cur){int m=st[top--],area=h[m]*(r-st[top]-1);if(area>best)best=area;}st[++top]=r;}free(st);return best;}
   int maximalRectangle(char**a,int rows,int*cols){if(rows==0)return 0;int n=cols[0],*h=calloc(n,sizeof(int)),best=0;for(int r=0;r<rows;r++){for(int c=0;c<n;c++)h[c]=a[r][c]=='1'?h[c]+1:0;int area=hist(h,n);if(area>best)best=area;}free(h);return best;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def maximalRectangle(self, matrix: list[list[str]]) -> int:
           if not matrix:return 0
           heights=[0]*len(matrix[0]);best=0
           for row in matrix:
               for c,ch in enumerate(row):heights[c]=heights[c]+1 if ch=='1' else 0
               stack=[-1]
               for right in range(len(heights)+1):
                   current=0 if right==len(heights) else heights[right]
                   while stack[-1]!=-1 and heights[stack[-1]]>current:
                       middle=stack.pop();best=max(best,heights[middle]*(right-stack[-1]-1))
                   stack.append(right)
           return best

Java
~~~~

.. code-block:: java

   class Solution {public int maximalRectangle(char[][]a){if(a.length==0)return 0;int[]h=new int[a[0].length];int best=0;for(char[]row:a){for(int c=0;c<h.length;c++)h[c]=row[c]=='1'?h[c]+1:0;int[]st=new int[h.length+2];int top=0;st[0]=-1;for(int r=0;r<=h.length;r++){int cur=r==h.length?0:h[r];while(st[top]!=-1&&h[st[top]]>cur){int m=st[top--];best=Math.max(best,h[m]*(r-st[top]-1));}st[++top]=r;}}return best;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn maximal_rectangle(a:Vec<Vec<char>>)->i32{if a.is_empty(){return 0}let mut h=vec![0;a[0].len()];let mut best=0;for row in a{for c in 0..h.len(){h[c]=if row[c]=='1'{h[c]+1}else{0}}let mut st:Vec<i32>=vec![-1];for r in 0..=h.len(){let cur=if r==h.len(){0}else{h[r]};while *st.last().unwrap()!=-1&&h[*st.last().unwrap()as usize]>cur{let m=st.pop().unwrap()as usize;best=best.max(h[m]*(r as i32-*st.last().unwrap()-1));}st.push(r as i32);}}best}}

Go
~~

.. code-block:: go

   func maximalRectangle(a [][]byte)int{if len(a)==0{return 0};h:=make([]int,len(a[0]));best:=0;for _,row:=range a{for c:=range h{if row[c]=='1'{h[c]++}else{h[c]=0}};st:=[]int{-1};for r:=0;r<=len(h);r++{cur:=0;if r<len(h){cur=h[r]};for st[len(st)-1]!=-1&&h[st[len(st)-1]]>cur{m:=st[len(st)-1];st=st[:len(st)-1];area:=h[m]*(r-st[len(st)-1]-1);if area>best{best=area}};st=append(st,r)}};return best}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function maximalRectangle(a:string[][]):number{if(!a.length)return 0;const h=Array(a[0].length).fill(0);let best=0;for(const row of a){for(let c=0;c<h.length;c++)h[c]=row[c]==='1'?h[c]+1:0;const st=[-1];for(let r=0;r<=h.length;r++){const cur=r===h.length?0:h[r];while(st[st.length-1]!==-1&&h[st[st.length-1]]>cur){const m=st.pop()!;best=Math.max(best,h[m]*(r-st[st.length-1]-1));}st.push(r);}}return best;}

C#
~~

.. code-block:: csharp

   public class Solution {public int MaximalRectangle(char[][]a){if(a.Length==0)return 0;int[]h=new int[a[0].Length];int best=0;foreach(var row in a){for(int c=0;c<h.Length;c++)h[c]=row[c]=='1'?h[c]+1:0;var st=new List<int>{-1};for(int r=0;r<=h.Length;r++){int cur=r==h.Length?0:h[r];while(st[^1]!=-1&&h[st[^1]]>cur){int m=st[^1];st.RemoveAt(st.Count-1);best=Math.Max(best,h[m]*(r-st[^1]-1));}st.Add(r);}}return best;}}

Julia
~~~~~

.. code-block:: julia

   function maximal_rectangle(a)
       isempty(a)&&return 0;h=zeros(Int,size(a,2));best=0
       for row in 1:size(a,1)
           for c in eachindex(h);h[c]=a[row,c]=='1' ? h[c]+1 : 0;end
           stack=Int[0]
           for right in 1:length(h)+1
               current=right>length(h) ? 0 : h[right]
               while stack[end]!=0&&h[stack[end]]>current;middle=pop!(stack);best=max(best,h[middle]*(right-stack[end]-1));end
               push!(stack,right)
           end
       end;best
   end

R
~

.. code-block:: r

   maximal_rectangle <- function(a){if(length(a)==0L)return(0L);h<-integer(ncol(a));best<-0L;for(row in seq_len(nrow(a))){for(c in seq_along(h))h[[c]]<-if(a[row,c]=='1')h[[c]]+1L else 0L;stack<-0L;for(right in seq_len(length(h)+1L)){current<-if(right>length(h))0L else h[[right]];while(tail(stack,1)!=0L&&h[[tail(stack,1)]]>current){middle<-tail(stack,1);stack<-head(stack,-1);best<-max(best,h[[middle]]*(right-tail(stack,1)-1L))};stack<-c(stack,right)}};best}
