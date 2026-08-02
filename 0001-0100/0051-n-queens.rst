0051. N-Queens
===============

题目信息
--------

:题号: 0051
:难度: Hard
:主题: 回溯、约束状态、位掩码、棋盘构造
:原题: `LeetCode 0051 <https://leetcode.com/problems/n-queens/>`_
:重点: 行列约束、两类对角线、不同棋盘、完整结果输出

题目重述
--------

给定整数 ``n``，在 ``n × n`` 棋盘上放置 ``n`` 个皇后，使任意两个皇后都不在同一行、同一列或同一条对角线上。返回所有不同的合法棋盘，答案顺序不限。每个棋盘由 ``n`` 个长度为 ``n`` 的字符串组成，``'Q'`` 表示皇后，``'.'`` 表示空格。

约束为 ``1 <= n <= 9``。

自建示例
--------

.. code-block:: text

   输入：n = 5
   输出：
   [
     ["Q....","..Q..","....Q",".Q...","...Q."],
     ["Q....","...Q.",".Q...","....Q","..Q.."],
     [".Q...","...Q.","Q....","..Q..","....Q"],
     [".Q...","....Q","..Q..","Q....","...Q."],
     ["..Q..","Q....","...Q.",".Q...","....Q"],
     ["..Q..","....Q",".Q...","...Q.","Q...."],
     ["...Q.","Q....","..Q..","....Q",".Q..."],
     ["...Q.",".Q...","....Q","..Q..","Q...."],
     ["....Q",".Q...","...Q.","Q....","..Q.."],
     ["....Q","..Q..","Q....","...Q.",".Q..."]
   ]

共有 10 个合法棋盘；每个棋盘的每一行都恰有一个皇后。

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

合法棋盘有 ``n`` 个皇后，而同一行不能放两个，所以每一行必然恰好放一个。递归层数可以直接当作 ``row``，每层只决定这一行的列；``placement[row]`` 保存这条搜索路径上的列序列，不再枚举“这个格子放不放皇后”的无效状态。

对候选位置 ``(row, col)``，列冲突由 ``col`` 判断；同一条 ``\`` 对角线的 ``row - col`` 相同，同一条 ``/`` 对角线的 ``row + col`` 相同。``row - col`` 的范围是 ``[-(n-1), n-1]``，加上 ``n-1`` 后可以作为 ``down`` 数组下标；``row + col`` 直接落在 ``[0, 2n-2]``，对应 ``up`` 数组。三张布尔表保存当前路径已经占用的列和对角线，因此每次尝试只需常数时间判断。

主入口调用的是 ``booleanDfs``：通过检查后写入 ``placement[row]``，同时把三个占用标记设为真；递归返回后再把同一组标记恢复为假。恢复动作必须和选择动作完全对应，否则某个失败分支留下的列或对角线会错误剪掉后续合法分支。到达 ``row == n`` 时，列序列已经包含每一行的选择，``buildBoard`` 再把它转换成题目要求的字符串棋盘。

用自建的 ``n = 5`` 示例看一条成功路径：列序列 ``[0,2,4,1,3]`` 生成第一块棋盘。它不是因为预先知道答案才被保留，而是每一步都通过列、``row-col`` 和 ``row+col`` 三项检查；如果某一行没有可选列，递归回退并撤销上一行的标记，继续尝试其他列。

为什么不重不漏
~~~~~~~~~~~~~~~~

每个合法棋盘在每一行只有一个列选择，因此对应唯一的 ``placement`` 序列。算法逐行尝试全部列，只剪掉与已放皇后冲突的选择；合法序列不会被剪掉，所有到达叶子的序列也都满足三类约束。不同序列至少有一行的列不同，构造出的棋盘也不同，所以既不漏解也不重复。

代码中只保留实际入口使用的布尔状态搜索；把候选约束放在三张表中，比每次尝试重新扫描之前所有行更直接，也使代码中的状态与上面的证明一一对应。

输出本身需要为每个方案写出 ``n²`` 个字符。若合法方案数为 ``S``，按当前“每层扫描全部列”的代码写法，搜索和构造的时间可写为 ``O(n · n! + S n²)`` 的上界量级，实际搜索会受到列和对角线剪枝；不计返回结果，递归栈、列序列和三张状态表共使用 ``O(n)`` 额外空间。

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
