0130. Surrounded Regions
=======================

题目信息
--------

:题号: 0130
:难度: Medium
:主题: 网格、广度优先搜索、连通分量、原地修改
:原题: `LeetCode 0130 <https://leetcode.com/problems/surrounded-regions/>`_
:教学重点: 边界连通补集、入队即标记、两阶段改写、单行单列

题目重述
--------

给定只含 ``X`` 和 ``O`` 的矩形网格。若一个 ``O`` 连通区域无法通过上下左右移动到达边界，就把其中全部 ``O`` 改为 ``X``；与边界连通的 ``O`` 保持不变。除 R 适配器外，接口原地修改网格。

自建示例
--------

.. code-block:: text

   X X X X        X X X X
   X O O X        X X X X
   X X O X   ->   X X X X
   X O X X        X O X X

.. code-block:: text

   单行 O X O O 中每个格子都在边界，全部保留。

C++ 实现
--------

.. code-block:: cpp

   #include <queue>
   #include <utility>
   #include <vector>

   class Solution {
   private:
       void componentDecision(std::vector<std::vector<char>>& board) {
           int rows = board.size(), cols = board[0].size();
           std::vector<std::vector<char>> visited(rows, std::vector<char>(cols));
           int dr[4] = {1,-1,0,0}, dc[4] = {0,0,1,-1};
           for (int sr = 0; sr < rows; ++sr) for (int sc = 0; sc < cols; ++sc) {
               if (board[sr][sc] != 'O' || visited[sr][sc]) continue;
               std::queue<std::pair<int,int>> queue; queue.push({sr,sc});
               visited[sr][sc] = true;
               std::vector<std::pair<int,int>> cells;
               bool touches_boundary = false;
               while (!queue.empty()) {
                   auto [r,c] = queue.front(); queue.pop(); cells.push_back({r,c});
                   if (r == 0 || r == rows-1 || c == 0 || c == cols-1) touches_boundary = true;
                   for (int k = 0; k < 4; ++k) {
                       int nr=r+dr[k], nc=c+dc[k];
                       if (nr>=0&&nr<rows&&nc>=0&&nc<cols&&board[nr][nc]=='O'&&!visited[nr][nc]) {
                           visited[nr][nc]=true; queue.push({nr,nc});
                       }
                   }
               }
               if (!touches_boundary) for (auto [r,c] : cells) board[r][c]='X';
           }
       }

       void boundaryDfs(std::vector<std::vector<char>>& board, int row, int col) {
           if (row < 0 || row >= static_cast<int>(board.size()) ||
               col < 0 || col >= static_cast<int>(board[0].size()) ||
               board[row][col] != 'O') return;
           board[row][col] = '#';
           boundaryDfs(board,row+1,col); boundaryDfs(board,row-1,col);
           boundaryDfs(board,row,col+1); boundaryDfs(board,row,col-1);
       }

       void boundaryBfs(std::vector<std::vector<char>>& board) {
           if (board.empty() || board[0].empty()) return;
           int rows = board.size(), cols = board[0].size();
           std::queue<std::pair<int,int>> queue;
           auto add = [&](int row, int col) {
               if (board[row][col] == 'O') {
                   board[row][col] = '#';
                   queue.push({row,col});
               }
           };
           for (int row = 0; row < rows; ++row) { add(row,0); add(row,cols-1); }
           for (int col = 0; col < cols; ++col) { add(0,col); add(rows-1,col); }
           int dr[4] = {1,-1,0,0}, dc[4] = {0,0,1,-1};
           while (!queue.empty()) {
               auto [row,col] = queue.front(); queue.pop();
               for (int k = 0; k < 4; ++k) {
                   int nr=row+dr[k], nc=col+dc[k];
                   if (nr>=0&&nr<rows&&nc>=0&&nc<cols&&board[nr][nc]=='O') add(nr,nc);
               }
           }
           for (auto& row : board) for (char& cell : row)
               cell = cell == '#' ? 'O' : 'X';
       }

   public:
       void solve(std::vector<std::vector<char>>& board) {
           boundaryBfs(board);
       }
   };

题解
----

为什么从边界反向搜索
~~~~~~~~~~~~~~~~~~

直接判断每个 ``O`` 分量是否被包围，需要收集分量并记录是否碰到边界。反向思考更简单：边界 ``O`` 必然安全，与它们连通的所有 ``O`` 也安全；搜索后剩余的 ``O`` 才是应翻转的补集。

多源 BFS 如何初始化
~~~~~~~~~~~~~~~~~~

把四条边上的所有 ``O`` 作为起点。加入队列时立即改为临时字符 ``#``，它同时表示“安全”和“已访问”。角点可能被边界循环检查两次，但第一次已经改成 ``#``，不会重复入队。

.. list-table::
   :header-rows: 1

   * - 阶段
     - ``O``
     - ``#``
   * - 初始
     - 全部候选区域
     - 无
   * - 边界入队
     - 未确认区域
     - 边界安全单元格
   * - BFS 扩张
     - 未与边界连通
     - 全部安全区域
   * - 最终扫描
     - 改为 ``X``
     - 恢复为 ``O``

为什么入队即标记
~~~~~~~~~~~~~~~~

若等到出队才标记，同一个安全格子可能被多个邻居重复加入。入队时改为 ``#``，保证每个格子最多进入队列一次，并防止边界重复起点造成重复工作。

两阶段改写为何安全
~~~~~~~~~~~~~~~~~~

搜索阶段不能直接把内部 ``O`` 改为 ``X``，因为尚未知道它是否通过更长通道连接边界。先只标记已证实安全的格子，完成全部连通搜索后再统一翻转补集，判断不会被中途修改污染。

单行单列为何全部保留
~~~~~~~~~~~~~~~~~~~~

单行或单列中的每个位置都属于边界。初始化会把所有 ``O`` 标成 ``#``，最终全部恢复，不存在完全被包围的区域。

为什么结果正确
~~~~~~~~~~~~~~

任意与边界连通的 ``O`` 都存在一条从边界起点出发的四方向路径，BFS 会沿该路径标记它；任意被标记格子也由真实 ``O`` 邻接路径到达边界，因此确实安全。未标记 ``O`` 恰好无法到达边界，全部应翻转。

复杂度来源
~~~~~~~~~~

每个格子最多入队一次并在最终阶段再扫描一次，时间 ``O(mn)``。队列最坏 ``O(mn)``；递归 DFS 最坏也需 ``O(mn)`` 调用栈。临时字符复用输入网格，不需要访问矩阵。

九语言实现
----------

C
~

.. code-block:: c

   void solve(char**board,int rows,int*columnSizes){if(!rows||!columnSizes[0])return;int cols=columnSizes[0],cap=rows*cols,*qr=malloc((size_t)cap*sizeof(int)),*qc=malloc((size_t)cap*sizeof(int)),h=0,t=0;#define ADD(r,c) do{if(board[(r)][(c)]=='O'){board[(r)][(c)]='#';qr[t]=(r);qc[t++]=(c);}}while(0)for(int r=0;r<rows;r++){ADD(r,0);ADD(r,cols-1);}for(int c=0;c<cols;c++){ADD(0,c);ADD(rows-1,c);}int dr[4]={1,-1,0,0},dc[4]={0,0,1,-1};while(h<t){int r=qr[h],c=qc[h++];for(int k=0;k<4;k++){int nr=r+dr[k],nc=c+dc[k];if(nr>=0&&nr<rows&&nc>=0&&nc<cols)ADD(nr,nc);}}for(int r=0;r<rows;r++)for(int c=0;c<cols;c++)board[r][c]=board[r][c]=='#'?'O':'X';free(qr);free(qc);#undef ADD}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def solve(self, board: list[list[str]]) -> None:
           from collections import deque
           if not board or not board[0]: return
           rows, cols, queue = len(board), len(board[0]), deque()
           def add(r, c):
               if board[r][c] == "O": board[r][c] = "#"; queue.append((r,c))
           for r in range(rows): add(r,0); add(r,cols-1)
           for c in range(cols): add(0,c); add(rows-1,c)
           while queue:
               r,c = queue.popleft()
               for dr,dc in ((1,0),(-1,0),(0,1),(0,-1)):
                   nr,nc=r+dr,c+dc
                   if 0<=nr<rows and 0<=nc<cols: add(nr,nc)
           for r in range(rows):
               for c in range(cols): board[r][c] = "O" if board[r][c] == "#" else "X"

Java
~~~~

.. code-block:: java

   class Solution {public void solve(char[][]b){if(b.length==0)return;int m=b.length,n=b[0].length;Queue<int[]>q=new ArrayDeque<>();java.util.function.BiConsumer<Integer,Integer>add=(r,c)->{if(b[r][c]=='O'){b[r][c]='#';q.add(new int[]{r,c});}};for(int r=0;r<m;r++){add.accept(r,0);add.accept(r,n-1);}for(int c=0;c<n;c++){add.accept(0,c);add.accept(m-1,c);}int[][]d={{1,0},{-1,0},{0,1},{0,-1}};while(!q.isEmpty()){int[]x=q.remove();for(int[]v:d){int r=x[0]+v[0],c=x[1]+v[1];if(r>=0&&r<m&&c>=0&&c<n)add.accept(r,c);}}for(int r=0;r<m;r++)for(int c=0;c<n;c++)b[r][c]=b[r][c]=='#'?'O':'X';}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn solve(board:&mut Vec<Vec<char>>){use std::collections::VecDeque;if board.is_empty(){return}let(m,n)=(board.len(),board[0].len());let mut q=VecDeque::new();fn add(b:&mut Vec<Vec<char>>,q:&mut VecDeque<(usize,usize)>,r:usize,c:usize){if b[r][c]=='O'{b[r][c]='#';q.push_back((r,c));}}for r in 0..m{add(board,&mut q,r,0);add(board,&mut q,r,n-1)}for c in 0..n{add(board,&mut q,0,c);add(board,&mut q,m-1,c)}while let Some((r,c))=q.pop_front(){for(dr,dc)in[(1,0),(-1,0),(0,1),(0,-1)]{let(nr,nc)=(r as i32+dr,c as i32+dc);if nr>=0&&nr<m as i32&&nc>=0&&nc<n as i32{add(board,&mut q,nr as usize,nc as usize)}}}for row in board{for x in row{*x=if *x=='#'{'O'}else{'X'}}}}}

Go
~~

.. code-block:: go

   func solve(b [][]byte){if len(b)==0{return};m,n:=len(b),len(b[0]);q:=[][2]int{};add:=func(r,c int){if b[r][c]=='O'{b[r][c]='#';q=append(q,[2]int{r,c})}};for r:=0;r<m;r++{add(r,0);add(r,n-1)};for c:=0;c<n;c++{add(0,c);add(m-1,c)};d:=[][2]int{{1,0},{-1,0},{0,1},{0,-1}};for h:=0;h<len(q);h++{for _,v:=range d{r,c:=q[h][0]+v[0],q[h][1]+v[1];if r>=0&&r<m&&c>=0&&c<n{add(r,c)}}};for r:=range b{for c:=range b[r]{if b[r][c]=='#'{b[r][c]='O'}else{b[r][c]='X'}}}}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function solve(b:string[][]):void{if(!b.length)return;const m=b.length,n=b[0].length,q:[number,number][]=[];const add=(r:number,c:number)=>{if(b[r][c]==="O"){b[r][c]="#";q.push([r,c]);}};for(let r=0;r<m;r++){add(r,0);add(r,n-1);}for(let c=0;c<n;c++){add(0,c);add(m-1,c);}for(let h=0;h<q.length;h++){const[r,c]=q[h];for(const[dr,dc]of[[1,0],[-1,0],[0,1],[0,-1]]){const nr=r+dr,nc=c+dc;if(nr>=0&&nr<m&&nc>=0&&nc<n)add(nr,nc);}}for(let r=0;r<m;r++)for(let c=0;c<n;c++)b[r][c]=b[r][c]==="#"?"O":"X";}

C#
~~

.. code-block:: csharp

   public class Solution {public void Solve(char[][]b){if(b.Length==0)return;int m=b.Length,n=b[0].Length;var q=new Queue<(int,int)>();void Add(int r,int c){if(b[r][c]=='O'){b[r][c]='#';q.Enqueue((r,c));}}for(int r=0;r<m;r++){Add(r,0);Add(r,n-1);}for(int c=0;c<n;c++){Add(0,c);Add(m-1,c);}int[,]d={{1,0},{-1,0},{0,1},{0,-1}};while(q.Count>0){var(r,c)=q.Dequeue();for(int k=0;k<4;k++){int nr=r+d[k,0],nc=c+d[k,1];if(nr>=0&&nr<m&&nc>=0&&nc<n)Add(nr,nc);}}for(int r=0;r<m;r++)for(int c=0;c<n;c++)b[r][c]=b[r][c]=='#'?'O':'X';}}

Julia
~~~~~

.. code-block:: julia

   function solve_surrounded!(b)
       isempty(b)&&return b;m=length(b);n=length(b[1]);q=Tuple{Int,Int}[];head=1;function add(r,c);if b[r][c]=='O';b[r][c]='#';push!(q,(r,c));end;end
       for r in 1:m;add(r,1);add(r,n);end;for c in 1:n;add(1,c);add(m,c);end
       while head<=length(q);r,c=q[head];head+=1;for(dr,dc)in((1,0),(-1,0),(0,1),(0,-1));nr,nc=r+dr,c+dc;if 1<=nr<=m&&1<=nc<=n;add(nr,nc);end;end;end
       for r in 1:m,c in 1:n;b[r][c]=b[r][c]=='#' ? 'O' : 'X';end;b
   end

R
~

.. code-block:: r

   solve_surrounded <- function(board){if(!length(board))return(board);m<-nrow(board);n<-ncol(board);q<-matrix(integer(),ncol=2);add<-function(r,c){if(board[r,c]=="O"){board[r,c]<<-"#";q<<-rbind(q,c(r,c))}};for(r in seq_len(m)){add(r,1L);add(r,n)};for(c in seq_len(n)){add(1L,c);add(m,c)};head<-1L;dirs<-matrix(c(1,0,-1,0,0,1,0,-1),ncol=2,byrow=TRUE);while(head<=nrow(q)){r<-q[head,1];c<-q[head,2];head<-head+1L;for(k in 1:4){nr<-r+dirs[k,1];nc<-c+dirs[k,2];if(nr>=1&&nr<=m&&nc>=1&&nc<=n)add(nr,nc)}};board[board=="O"]<-"X";board[board=="#"]<-"O";board}
