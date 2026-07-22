0051. N-Queens
===============

题目信息
--------

:题号: 0051
:题名: N-Queens
:难度: Hard
:类型: Algorithms
:主题: 回溯、约束状态、位掩码、棋盘构造
:原题: `LeetCode 0051 <https://leetcode.com/problems/n-queens/>`_
:教学重点: 按行决策、列与两类对角线、选择撤销、完整棋盘输出

题目重述
--------

给定 ``n``，在 ``n × n`` 棋盘上放置 ``n`` 个皇后，使任意两个皇后不同行、不同列，也不在同一条对角线上。返回全部合法棋盘；每行用 ``'.'`` 和 ``'Q'`` 表示。结果顺序不限。

自建示例
--------

.. code-block:: text

   n = 4
   两个答案的列序列分别是 [1,3,0,2] 与 [2,0,3,1]

.. code-block:: text

   n = 2 -> []
   第一行无论选哪一列，第二行都同时受到列或对角线攻击。

C++ 实现
--------

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
   private:
       std::vector<std::string> buildBoard(const std::vector<int>& placement) {
           int n = static_cast<int>(placement.size());
           std::vector<std::string> board(n, std::string(n, '.'));
           for (int row = 0; row < n; ++row) board[row][placement[row]] = 'Q';
           return board;
       }

       bool scanPreviousRows(const std::vector<int>& placement, int row, int col) {
           for (int previous = 0; previous < row; ++previous) {
               int previous_col = placement[previous];
               if (previous_col == col ||
                   previous - previous_col == row - col ||
                   previous + previous_col == row + col) return false;
           }
           return true;
       }

       void scanDfs(int row, std::vector<int>& placement,
                    std::vector<std::vector<std::string>>& result) {
           int n = static_cast<int>(placement.size());
           if (row == n) { result.push_back(buildBoard(placement)); return; }
           for (int col = 0; col < n; ++col) {
               if (!scanPreviousRows(placement, row, col)) continue;
               placement[row] = col;
               scanDfs(row + 1, placement, result);
           }
       }

       void booleanDfs(int row, std::vector<int>& placement,
                       std::vector<char>& columns,
                       std::vector<char>& down,
                       std::vector<char>& up,
                       std::vector<std::vector<std::string>>& result) {
           int n = static_cast<int>(placement.size());
           if (row == n) { result.push_back(buildBoard(placement)); return; }
           for (int col = 0; col < n; ++col) {
               int d = row - col + n - 1;
               int u = row + col;
               if (columns[col] || down[d] || up[u]) continue;
               placement[row] = col;
               columns[col] = down[d] = up[u] = true;
               booleanDfs(row + 1, placement, columns, down, up, result);
               columns[col] = down[d] = up[u] = false;
           }
       }

       void bitDfs(int row, int n, int columns, int down, int up,
                   std::vector<int>& placement,
                   std::vector<std::vector<std::string>>& result) {
           if (row == n) { result.push_back(buildBoard(placement)); return; }
           int full = (1 << n) - 1;
           int available = full & ~(columns | down | up);
           while (available) {
               int bit = available & -available;
               available ^= bit;
               int col = 0;
               while ((1 << col) != bit) ++col;
               placement[row] = col;
               bitDfs(row + 1, n, columns | bit,
                      ((down | bit) << 1) & full,
                      (up | bit) >> 1, placement, result);
           }
       }

   public:
       std::vector<std::vector<std::string>> solveNQueens(int n) {
           std::vector<std::vector<std::string>> result;
           std::vector<int> placement(n);
           std::vector<char> columns(n), down(2 * n - 1), up(2 * n - 1);
           booleanDfs(0, placement, columns, down, up, result);
           return result;
       }
   };

题解
----

从逐格枚举到按行决策
~~~~~~~~~~~~~~~~~~~~

逐个格子决定放或不放会制造大量不可能包含 ``n`` 个皇后的状态。合法棋盘每行恰好一个皇后，因此递归深度直接表示行号；本层只需选择列，行冲突从模型中消失。

三类冲突如何编码
~~~~~~~~~~~~~~~~

对位置 ``(row,col)``：列编号是 ``col``；``\`` 对角线由 ``row-col`` 唯一确定；``/`` 对角线由 ``row+col`` 唯一确定。前者加 ``n-1`` 后落在 ``0..2n-2``，因此三组布尔表都能常数时间判断冲突。

扫描旧皇后为何可以被状态表替代
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

基准方法每次尝试都扫描之前所有行，重复询问相同的列和对角线占用。布尔表把已放置皇后的攻击信息累积为可查询状态，选择与撤销各只修改三个槽位。

状态演化
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 层级
     - 已放列
     - 当前候选
     - 动作
   * - row 0
     - ``{}``
     - ``0,1,2,3``
     - 选择列 1
   * - row 1
     - ``{1}``
     - 仅列 3 不冲突
     - 选择列 3
   * - row 2
     - ``{1,3}``
     - 仅列 0 不冲突
     - 选择列 0
   * - row 3
     - ``{0,1,3}``
     - 仅列 2 不冲突
     - 得到 ``[1,3,0,2]``

选择与撤销为何必须对称
~~~~~~~~~~~~~~~~~~~~~~

进入子树前，棋盘路径与三组状态同时加入当前皇后；子树返回后清除完全相同的三个标记。这样父层状态恢复到尝试前，失败分支不会影响同层其他列。

为什么不重不漏
~~~~~~~~~~~~~~

任意合法棋盘都唯一对应一个列序列。该序列在每一层都通过冲突检查，因此对应分支不会被剪掉；算法枚举每行所有合法列，所以不会漏解。不同列序列至少在一行选择不同，生成的棋盘也不同，因此不会重复。

位掩码如何压缩候选
~~~~~~~~~~~~~~~~~~

最低 ``n`` 位表示当前行各列。``available = full & ~(columns|down|up)`` 一次得到全部合法列；提取 ``bit = available & -available`` 后，进入下一行时两类对角线攻击分别左移和右移一位。它与布尔表搜索同一棵树，只把状态更新压缩为位运算。

复杂度来源
~~~~~~~~~~

搜索树上界可写为 ``O(n!)`` 量级，实际受对角线剪枝显著缩小。布尔表每个候选常数检查；每个答案构造 ``n²`` 个字符。递归、列序列和约束状态使用 ``O(n)`` 额外空间，不计输出。

九语言实现
----------

C
~

.. code-block:: c

   static void dfs(int row,int n,bool*cols,bool*down,bool*up,int*place,char****out,int*size,int*cap){
       if(row==n){if(*size==*cap){*cap*=2;*out=realloc(*out,(size_t)*cap*sizeof(char**));}char**b=malloc((size_t)n*sizeof(char*));for(int r=0;r<n;r++){b[r]=malloc((size_t)n+1);memset(b[r],'.',(size_t)n);b[r][place[r]]='Q';b[r][n]='\0';}(*out)[(*size)++]=b;return;}
       for(int c=0;c<n;c++){int d=row-c+n-1,u=row+c;if(cols[c]||down[d]||up[u])continue;place[row]=c;cols[c]=down[d]=up[u]=true;dfs(row+1,n,cols,down,up,place,out,size,cap);cols[c]=down[d]=up[u]=false;}}
   char***solveNQueens(int n,int*returnSize,int**returnColumnSizes){bool*cols=calloc(n,sizeof(bool)),*down=calloc(2*n-1,sizeof(bool)),*up=calloc(2*n-1,sizeof(bool));int*place=malloc((size_t)n*sizeof(int)),size=0,cap=4;char***out=malloc((size_t)cap*sizeof(char**));dfs(0,n,cols,down,up,place,&out,&size,&cap);int*sizes=malloc((size_t)size*sizeof(int));for(int i=0;i<size;i++)sizes[i]=n;free(cols);free(down);free(up);free(place);*returnSize=size;*returnColumnSizes=sizes;return out;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def solveNQueens(self, n: int) -> list[list[str]]:
           result, placement = [], [-1] * n
           columns, down, up = set(), set(), set()
           def dfs(row: int) -> None:
               if row == n:
                   result.append(["." * c + "Q" + "." * (n-c-1) for c in placement]); return
               for col in range(n):
                   if col in columns or row-col in down or row+col in up: continue
                   placement[row]=col; columns.add(col); down.add(row-col); up.add(row+col)
                   dfs(row+1)
                   columns.remove(col); down.remove(row-col); up.remove(row+col)
           dfs(0); return result

Java
~~~~

.. code-block:: java

   class Solution {List<List<String>> out=new ArrayList<>();int n;int[] place;boolean[] cols,down,up;
       void dfs(int r){if(r==n){List<String>b=new ArrayList<>();for(int c:place){char[]row=new char[n];Arrays.fill(row,'.');row[c]='Q';b.add(new String(row));}out.add(b);return;}for(int c=0;c<n;c++){int d=r-c+n-1,u=r+c;if(cols[c]||down[d]||up[u])continue;place[r]=c;cols[c]=down[d]=up[u]=true;dfs(r+1);cols[c]=down[d]=up[u]=false;}}
       public List<List<String>> solveNQueens(int n){this.n=n;place=new int[n];cols=new boolean[n];down=new boolean[2*n-1];up=new boolean[2*n-1];dfs(0);return out;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn solve_n_queens(n:i32)->Vec<Vec<String>>{fn dfs(r:usize,n:usize,p:&mut Vec<usize>,c:&mut Vec<bool>,d:&mut Vec<bool>,u:&mut Vec<bool>,o:&mut Vec<Vec<String>>){if r==n{o.push(p.iter().map(|&x|".".repeat(x)+"Q"+&".".repeat(n-x-1)).collect());return}for x in 0..n{let a=r+n-1-x;let b=r+x;if c[x]||d[a]||u[b]{continue}p[r]=x;c[x]=true;d[a]=true;u[b]=true;dfs(r+1,n,p,c,d,u,o);c[x]=false;d[a]=false;u[b]=false}}let n=n as usize;let mut o=vec![];dfs(0,n,&mut vec![0;n],&mut vec![false;n],&mut vec![false;2*n-1],&mut vec![false;2*n-1],&mut o);o}}

Go
~~

.. code-block:: go

   func solveNQueens(n int)[][]string{out:=[][]string{};place:=make([]int,n);cols:=make([]bool,n);down:=make([]bool,2*n-1);up:=make([]bool,2*n-1);var dfs func(int);dfs=func(r int){if r==n{b:=make([]string,n);for i,c:=range place{row:=make([]byte,n);for j:=range row{row[j]='.'};row[c]='Q';b[i]=string(row)};out=append(out,b);return};for c:=0;c<n;c++{d,u:=r-c+n-1,r+c;if cols[c]||down[d]||up[u]{continue};place[r]=c;cols[c],down[d],up[u]=true,true,true;dfs(r+1);cols[c],down[d],up[u]=false,false,false}};dfs(0);return out}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function solveNQueens(n:number):string[][]{const out:string[][]=[],p=Array(n).fill(0),c=Array(n).fill(false),d=Array(2*n-1).fill(false),u=Array(2*n-1).fill(false);const dfs=(r:number)=>{if(r===n){out.push(p.map(x=>".".repeat(x)+"Q"+".".repeat(n-x-1)));return;}for(let x=0;x<n;x++){const a=r-x+n-1,b=r+x;if(c[x]||d[a]||u[b])continue;p[r]=x;c[x]=d[a]=u[b]=true;dfs(r+1);c[x]=d[a]=u[b]=false;}};dfs(0);return out;}

C#
~~

.. code-block:: csharp

   public class Solution {List<IList<string>> o=new();int n;int[]p;bool[]c,d,u;void Dfs(int r){if(r==n){var b=new List<string>();foreach(int x in p)b.Add(new string('.',x)+"Q"+new string('.',n-x-1));o.Add(b);return;}for(int x=0;x<n;x++){int a=r-x+n-1,b=r+x;if(c[x]||d[a]||u[b])continue;p[r]=x;c[x]=d[a]=u[b]=true;Dfs(r+1);c[x]=d[a]=u[b]=false;}}public IList<IList<string>> SolveNQueens(int n){this.n=n;p=new int[n];c=new bool[n];d=new bool[2*n-1];u=new bool[2*n-1];Dfs(0);return o;}}

Julia
~~~~~

.. code-block:: julia

   function solve_n_queens(n::Int)
       out=Vector{Vector{String}}();p=zeros(Int,n);cols=falses(n);down=falses(2n-1);up=falses(2n-1)
       function dfs(r)
           if r>n;push!(out,[repeat(".",c-1)*"Q"*repeat(".",n-c) for c in p]);return;end
           for c in 1:n;d=r-c+n;u=r+c-1;if cols[c]||down[d]||up[u];continue;end;p[r]=c;cols[c]=down[d]=up[u]=true;dfs(r+1);cols[c]=down[d]=up[u]=false;end
       end;dfs(1);out
   end

R
~

.. code-block:: r

   solve_n_queens <- function(n){out<-list();p<-integer(n);cols<-rep(FALSE,n);down<-rep(FALSE,2*n-1);up<-rep(FALSE,2*n-1)
     dfs<-function(r){if(r>n){out[[length(out)+1L]]<<-vapply(p,function(c)paste0(strrep(".",c-1L),"Q",strrep(".",n-c)),"");return()};for(c in seq_len(n)){d<-r-c+n;u<-r+c-1L;if(cols[[c]]||down[[d]]||up[[u]])next;p[[r]]<<-c;cols[[c]]<<-down[[d]]<<-up[[u]]<<-TRUE;dfs(r+1L);cols[[c]]<<-down[[d]]<<-up[[u]]<<-FALSE}}
     dfs(1L);out}
