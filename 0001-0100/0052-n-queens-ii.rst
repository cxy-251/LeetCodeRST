0052. N-Queens II
=================

题目信息
--------

:题号: 0052
:难度: Hard
:主题: 回溯、位掩码、计数搜索
:原题: `LeetCode 0052 <https://leetcode.com/problems/n-queens-ii/>`_
:重点: 行列与对角线约束、合法分支计数、位掩码候选、无需构造棋盘

题目重述
--------

给定整数 ``n``，统计在 ``n × n`` 棋盘上放置 ``n`` 个互不攻击皇后的不同方案数。任意两个皇后不能位于同一行、同一列或同一条对角线上；本题只返回方案数量。

约束为 ``1 <= n <= 9``。

自建示例
--------

.. code-block:: text

   输入：n = 6
   输出：4

六皇后问题共有 4 种不同摆放方案。

.. code-block:: text

   输入：n = 2
   输出：0

第一行放置皇后后，第二行的两个位置都会受到列或对角线攻击。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   private:
       int booleanDfs(int row, int n, bool columns[], bool down[], bool up[]) {
           if (row == n) return 1;
           int total = 0;
           for (int col = 0; col < n; ++col) {
               int d = row - col + n - 1;
               int u = row + col;
               if (columns[col] || down[d] || up[u]) continue;
               columns[col] = down[d] = up[u] = true;
               total += booleanDfs(row + 1, n, columns, down, up);
               columns[col] = down[d] = up[u] = false;
           }
           return total;
       }

       int bitDfs(int full, int columns, int down, int up) {
           if (columns == full) return 1;
           int available = full & ~(columns | down | up);
           int total = 0;
           while (available) {
               int bit = available & -available;
               available ^= bit;
               total += bitDfs(full, columns | bit,
                               ((down | bit) << 1) & full,
                               (up | bit) >> 1);
           }
           return total;
       }

       int symmetryCount(int n) {
           int full = (1 << n) - 1;
           int half = n / 2;
           int total = 0;
           for (int col = 0; col < half; ++col) {
               int bit = 1 << col;
               total += bitDfs(full, bit, (bit << 1) & full, bit >> 1);
           }
           total *= 2;
           if (n % 2 == 1) {
               int bit = 1 << half;
               total += bitDfs(full, bit, (bit << 1) & full, bit >> 1);
           }
           return total;
       }

   public:
       int totalNQueens(int n) {
           return bitDfs((1 << n) - 1, 0, 0, 0);
       }
   };

题解
----

为什么第 51 题的搜索树可以直接复用
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

两题的合法布局完全相同，只是叶子处理不同：第 51 题把列序列转换为棋盘；本题到达完整布局时返回 1，父层把各候选子树的计数相加。删除输出构造后，状态只需表达攻击范围。

当前行为什么只需要三个掩码
~~~~~~~~~~~~~~~~~~~~~~~~~~

``columns`` 记录已占列；``down`` 和 ``up`` 记录已有两类对角线在当前行攻击的列。最低 ``n`` 位中，1 表示不可用。于是当前行合法列为：

.. code-block:: text

   available = full & ~(columns | down | up)

``full`` 只保留棋盘范围内的位，取反产生的高位不会进入候选。

最低位提取如何枚举全部候选
~~~~~~~~~~~~~~~~~~~~~~~~~~

``bit = available & -available`` 提取最右侧的 1；``available ^= bit`` 删除该候选。循环结束时，每个合法列恰好尝试一次，不需要扫描 ``0..n-1``。

对角线为什么要位移
~~~~~~~~~~~~~~~~~~

当前行列 ``c`` 的 ``\`` 对角线在下一行攻击 ``c+1``，对应左移一位；``/`` 对角线攻击 ``c-1``，对应右移一位。因此下一层状态为：

.. code-block:: text

   columns' = columns | bit
   down'    = ((down | bit) << 1) & full
   up'      = (up | bit) >> 1

状态演化
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 行
     - ``columns``
     - ``available``
     - 说明
   * - 0
     - ``0000``
     - ``1111``
     - 四列都可选
   * - 1，首行选列 1
     - ``0010``
     - ``1000``
     - 列与两条对角线排除其余位置
   * - 2
     - ``1010``
     - ``0001``
     - 只能选列 0
   * - 4
     - ``1111``
     - —
     - 完成布局，返回 1

为什么 ``columns == full`` 就是完整布局
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

递归每层恰好加入一个此前未占用列，且所有皇后合法。``columns`` 的 ``n`` 位全部为 1 时已经使用 ``n`` 个不同列，也就已经处理 ``n`` 行，因此形成一个完整方案。

对称性剪枝的取舍
~~~~~~~~~~~~~~~~

首行选择左半列与右半列的方案关于竖直轴成对出现，可以只搜索左半并乘 2；奇数 ``n`` 的中间列需要单独搜索。该优化减少常数，但增加边界分支，标准入口保留更直接的完整位掩码搜索。

复杂度来源
~~~~~~~~~~

最坏搜索规模为排列树量级 ``O(n!)``，对角线约束会大量剪枝。每个候选由常数次位运算处理；递归深度 ``O(n)``，除调用栈外只使用固定整数状态。

九语言实现
----------

C
~

.. code-block:: c

   static int dfs(int full,int columns,int down,int up){if(columns==full)return 1;int available=full&~(columns|down|up),total=0;while(available){int bit=available&-available;available^=bit;total+=dfs(full,columns|bit,((down|bit)<<1)&full,(up|bit)>>1);}return total;}
   int totalNQueens(int n){return dfs((1<<n)-1,0,0,0);}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def totalNQueens(self, n: int) -> int:
           full = (1 << n) - 1
           def dfs(columns: int, down: int, up: int) -> int:
               if columns == full: return 1
               available, total = full & ~(columns | down | up), 0
               while available:
                   bit = available & -available; available ^= bit
                   total += dfs(columns | bit, ((down | bit) << 1) & full, (up | bit) >> 1)
               return total
           return dfs(0, 0, 0)

Java
~~~~

.. code-block:: java

   class Solution {int full;int dfs(int c,int d,int u){if(c==full)return 1;int a=full&~(c|d|u),total=0;while(a!=0){int bit=a&-a;a^=bit;total+=dfs(c|bit,((d|bit)<<1)&full,(u|bit)>>>1);}return total;}public int totalNQueens(int n){full=(1<<n)-1;return dfs(0,0,0);}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn total_n_queens(n:i32)->i32{fn dfs(full:u32,c:u32,d:u32,u:u32)->i32{if c==full{return 1}let mut a=full&!(c|d|u);let mut total=0;while a!=0{let bit=a&a.wrapping_neg();a^=bit;total+=dfs(full,c|bit,((d|bit)<<1)&full,(u|bit)>>1);}total}let full=(1u32<<n)-1;dfs(full,0,0,0)}}

Go
~~

.. code-block:: go

   func totalNQueens(n int)int{full:=(1<<n)-1;var dfs func(int,int,int)int;dfs=func(c,d,u int)int{if c==full{return 1};a,total:=full & ^(c|d|u),0;for a!=0{bit:=a&-a;a^=bit;total+=dfs(c|bit,((d|bit)<<1)&full,(u|bit)>>1)};return total};return dfs(0,0,0)}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function totalNQueens(n:number):number{const full=(1<<n)-1;const dfs=(c:number,d:number,u:number):number=>{if(c===full)return 1;let a=full&~(c|d|u),total=0;while(a){const bit=a&-a;a^=bit;total+=dfs(c|bit,((d|bit)<<1)&full,(u|bit)>>>1);}return total;};return dfs(0,0,0);}

C#
~~

.. code-block:: csharp

   public class Solution {int full;int Dfs(int c,int d,int u){if(c==full)return 1;int a=full&~(c|d|u),total=0;while(a!=0){int bit=a&-a;a^=bit;total+=Dfs(c|bit,((d|bit)<<1)&full,(int)((uint)(u|bit)>>1));}return total;}public int TotalNQueens(int n){full=(1<<n)-1;return Dfs(0,0,0);}}

Julia
~~~~~

.. code-block:: julia

   function total_n_queens(n::Int)
       full=(1<<n)-1
       function dfs(c,d,u);c==full&&return 1;a=full&~(c|d|u);total=0;while a!=0;bit=a&-a;a=xor(a,bit);total+=dfs(c|bit,((d|bit)<<1)&full,(u|bit)>>1);end;total;end
       dfs(0,0,0)
   end

R
~

.. code-block:: r

   total_n_queens <- function(n){full<-bitwShiftL(1L,n)-1L;dfs<-function(c,d,u){if(c==full)return(1L);a<-bitwAnd(full,bitwNot(bitwOr(c,bitwOr(d,u))));total<-0L;while(a!=0L){bit<-bitwAnd(a,-a);a<-bitwXor(a,bit);total<-total+dfs(bitwOr(c,bit),bitwAnd(bitwShiftL(bitwOr(d,bit),1L),full),bitwShiftR(bitwOr(u,bit),1L))};total};dfs(0L,0L,0L)}
