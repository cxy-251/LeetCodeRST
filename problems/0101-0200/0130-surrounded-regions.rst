0130. Surrounded Regions
========================

题目信息
--------

:题号: 0130
:难度: Medium
:主题: 矩阵、图搜索、边界连通
:原题: `LeetCode 0130 <https://leetcode.com/problems/surrounded-regions/>`_
:访问状态: Available
:教学重点: 从边界标记安全区域

题目重述
--------

把被 ``X`` 完全包围的 ``O`` 区域改成 ``X``；与边界 ``O`` 连通的区域保持不变。原地修改矩阵。

自建示例
--------

.. code-block:: text

   输入：board = [["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]
   输出：[["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]

问题抽象
--------

从所有边界 ``O`` 出发标记为安全占位符。随后把未标记 ``O`` 翻成 ``X``，安全标记恢复成 ``O``。

主解法：边界多源 DFS/BFS
------------------

思路
~~~~

边界多源 DFS/BFS。 从边界标记安全区域

核心状态与不变量
~~~~~~~~~~~~~~~~

从所有边界 ``O`` 出发标记为安全占位符。随后把未标记 ``O`` 翻成 ``X``，安全标记恢复成 ``O``。

正确性依据
~~~~~~~~~~

区域不被包围当且仅当存在到边界的四邻接路径。多源搜索恰标记所有此类节点；剩余 ``O`` 与边界不连通，必被 ``X`` 包围，可安全翻转。

复杂度与语言边界
~~~~~~~~~~~~~~~~

矩阵 ``m×n``，时间 ``O(mn)``；显式队列/栈最坏 ``O(mn)``，原地标记不需额外访问集合。

核心语言实现
------------

C
~

.. code-block:: c

   static void mark(char**b,int m,int n,int r,int c) {
       if(r<0||r>=m||c<0||c>=n||b[r][c]!='O')return;
       b[r][c]='#';
       mark(b,m,n,r-1,c);
       mark(b,m,n,r+1,c);
       mark(b,m,n,r,c-1);
       mark(b,m,n,r,c+1);
   }
   void solve(char**b,int m,int*ncols) {
       if(!m)return;
       int n=ncols[0];
       for(int r=0;r<m;r++) {
           mark(b,m,n,r,0);
           mark(b,m,n,r,n-1);
       }
       for(int c=0;c<n;c++) {
           mark(b,m,n,0,c);
           mark(b,m,n,m-1,c);
       }
       for(int r=0;r<m;r++)for(int c=0;c<n;c++)b[r][c]=b[r][c]=='#'?'O':'X';
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       int m,n;
       void mark(vector<vector<char>>&b,int r,int c) {
           if(r<0||r>=m||c<0||c>=n||b[r][c]!='O')return;
           b[r][c]='#';
           mark(b,r-1,c);
           mark(b,r+1,c);
           mark(b,r,c-1);
           mark(b,r,c+1);
       }
       public:void solve(vector<vector<char>>&b) {
           if(b.empty())return;
           m=b.size();
           n=b[0].size();
           for(int r=0;r<m;r++) {
               mark(b,r,0);
               mark(b,r,n-1);
           }
           for(int c=0;c<n;c++) {
               mark(b,0,c);
               mark(b,m-1,c);
           }
           for(auto&row:b)for(char&x:row)x=x=='#'?'O':'X';
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def solve(self, b: list[list[str]]) -> None:
           if not b:
               return
           m, n = (len(b), len(b[0]))

           def mark(r, c):
               if not (0 <= r < m and 0 <= c < n) or b[r][c] != 'O':
                   return
               b[r][c] = '#'
               mark(r - 1, c)
               mark(r + 1, c)
               mark(r, c - 1)
               mark(r, c + 1)
           for r in range(m):
               mark(r, 0)
               mark(r, n - 1)
           for c in range(n):
               mark(0, c)
               mark(m - 1, c)
           for r in range(m):
               for c in range(n):
                   b[r][c] = 'O' if b[r][c] == '#' else 'X'
Java
~~~~

.. code-block:: java

   class Solution {
       int m,n;
       public void solve(char[][]b) {
           if(b.length==0)return;
           m=b.length;
           n=b[0].length;
           for(int r=0;r<m;r++) {
               mark(b,r,0);
               mark(b,r,n-1);
           }
           for(int c=0;c<n;c++) {
               mark(b,0,c);
               mark(b,m-1,c);
           }
           for(char[]row:b)for(int c=0;c<n;c++)row[c]=row[c]=='#'?'O':'X';
       }
       void mark(char[][]b,int r,int c) {
           if(r<0||r>=m||c<0||c>=n||b[r][c]!='O')return;
           b[r][c]='#';
           mark(b,r-1,c);
           mark(b,r+1,c);
           mark(b,r,c-1);
           mark(b,r,c+1);
       }
   }
Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn solve(b:&mut Vec<Vec<char>>) {
           if b.is_empty() {
               return
           }
           let(m,n)=(b.len(),b[0].len());
           fn mark(b:&mut Vec<Vec<char>>,r:isize,c:isize) {
               if r<0||c<0||r as usize>=b.len()||c as usize>=b[0].len()||b[r as usize][c as
                   usize]!='O' {
                   return
               }
               b[r as usize][c as usize]='#';
               mark(b,r-1,c);
               mark(b,r+1,c);
               mark(b,r,c-1);
               mark(b,r,c+1);
           }
           for r in 0..m {
               mark(b,r as isize,0);
               mark(b,r as isize,n as isize-1);
           }
           for c in 0..n {
               mark(b,0,c as isize);
               mark(b,m as isize-1,c as isize);
           }
           for row in b {
               for x in row {
                   *x=if *x=='#' {
                       'O'
                   } else {
                       'X'
                   };
               }
           }
       }
   }
Go
~~

.. code-block:: go

   func solve(b [][]byte) {
   	if len(b) == 0 {
   		return
   	}
   	m, n := len(b), len(b[0])
   	var mark func(int, int)
   	mark = func(r, c int) {
   		if r < 0 || r >= m || c < 0 || c >= n || b[r][c] != 'O' {
   			return
   		}
   		b[r][c] = '#'
   		mark(r-1, c)
   		mark(r+1, c)
   		mark(r, c-1)
   		mark(r, c+1)
   	}
   	for r := 0; r < m; r++ {
   		mark(r, 0)
   		mark(r, n-1)
   	}
   	for c := 0; c < n; c++ {
   		mark(0, c)
   		mark(m-1, c)
   	}
   	for r := range b {
   		for c := range b[r] {
   			if b[r][c] == '#' {
   				b[r][c] = 'O'
   			} else {
   				b[r][c] = 'X'
   			}
   		}
   	}
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function solve(b: string[][]): void {
       if (!b.length)
           return;
       const m = b.length, n = b[0].length;
       const mark = (r: number, c: number) => {
           if (r < 0 || r >= m || c < 0 || c >= n || b[r][c] !== 'O')
               return;
           b[r][c] = '#';
           mark(r - 1, c);
           mark(r + 1, c);
           mark(r, c - 1);
           mark(r, c + 1);
       };
       for (let r = 0; r < m; r++) {
           mark(r, 0);
           mark(r, n - 1);
       }
       for (let c = 0; c < n; c++) {
           mark(0, c);
           mark(m - 1, c);
       }
       for (let r = 0; r < m; r++)
           for (let c = 0; c < n; c++)
               b[r][c] = b[r][c] === '#' ? 'O' :
                   'X';
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       int m,n;
       public void Solve(char[][]b) {
           if(b.Length==0)return;
           m=b.Length;
           n=b[0].Length;
           for(int r=0;r<m;r++) {
               Mark(b,r,0);
               Mark(b,r,n-1);
           }
           for(int c=0;c<n;c++) {
               Mark(b,0,c);
               Mark(b,m-1,c);
           }
           for(int r=0;r<m;r++)for(int c=0;c<n;c++)b[r][c]=b[r][c]=='#'?'O':'X';
       }
       void Mark(char[][]b,int r,int c) {
           if(r<0||r>=m||c<0||c>=n||b[r][c]!='O')return;
           b[r][c]='#';
           Mark(b,r-1,c);
           Mark(b,r+1,c);
           Mark(b,r,c-1);
           Mark(b,r,c+1);
       }
   }
Julia
~~~~~

.. code-block:: julia

   function solve!(b::Vector{Vector{Char}})
       isempty(b)&&return
       m=length(b)
       n=length(b[1])
       function mark(r,c)
           (1<=r<=m&&1<=c<=n&&b[r][c]=='O')||return
           b[r][c]='#'
           mark(r-1,c)
           mark(r+1,c)
           mark(r,c-1)
           mark(r,c+1)
       end
       for r in 1:m
           mark(r,1)
           mark(r,n)
       end
       for c in 1:n
           mark(1,c)
           mark(m,c)
       end
       for r in 1:m,c in 1:n
           b[r][c]=b[r][c]=='#' ? 'O' : 'X'
       end
       nothing
   end
R
~

.. code-block:: r

   solve_board <- function(b) {
       if(length(b)==0L)return(b)
       m<-length(b)
       n<-length(b[[1L]])
       mark<-function(r,c) {
           if(r<1L||r>m||c<1L||c>n||b[[r]][[c]]!='O')return()
           b[[r]][[c]]<<-'#'
           mark(r-1L,c)
           mark(r+1L,c)
           mark(r,c-1L)
           mark(r,c+1L)
       }
       for(r in seq_len(m)) {
           mark(r,1L)
           mark(r,n)
       }
       for(c in seq_len(n)) {
           mark(1L,c)
           mark(m,c)
       }
       for(r in seq_len(m))for(c in seq_len(n))b[[r]][[c]]<-if(b[[r]][[c]]=='#')'O' else 'X'
       b
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 空矩阵直接返回。
* 单行或单列所有 ``O`` 都在边界连通区域。

易错点
------

* 从内部区域出发尝试判断是否触边导致重复搜索。
* 标记字符与合法输入字符冲突。

本题新增知识
------------

* 从边界标记安全区域
* 题号 0130 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0079. Word Search <../0001-0100/0079-word-search.rst>`_；
* `0133. Clone Graph <0133-clone-graph.rst>`_；

最小自检
--------

#. ``边界多源 DFS/BFS`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

区域不被包围当且仅当存在到边界的四邻接路径。多源搜索恰标记所有此类节点；剩余 ``O`` 与边界不连通，必被 ``X`` 包围，可安全翻转。
