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

   public:
       int totalNQueens(int n) {
           return bitDfs((1 << n) - 1, 0, 0, 0);
       }
   };

题解
----

这里不需要保存棋盘，因为题目只问方案数。每个递归分支表示“当前行选择了一个合法列”；走到完整布局时返回 ``1``，父层把所有子分支的数量相加即可。计数搜索保留的是约束状态，而不是最终棋盘的字符内容。

位掩码的含义
~~~~~~~~~~~~

``columns`` 的 1 表示该列已经放过皇后；``down`` 和 ``up`` 表示两类对角线在**下一行**会攻击哪些列。三者都只保留棋盘的最低 ``n`` 位，故当前行可选列为：

.. code-block:: text

   available = full & ~(columns | down | up)

``full`` 只保留棋盘范围内的位，取反产生的高位不会进入候选。

最低位提取如何枚举候选
~~~~~~~~~~~~~~~~~~~~~~

``bit = available & -available`` 提取最右侧的 1；``available ^= bit`` 删除该候选。循环结束时，每个合法列恰好尝试一次，不需要扫描 ``0..n-1``。

为什么递归时要移动对角线
~~~~~~~~~~~~~~~~~~~~~~~~

当前行列 ``c`` 的 ``\`` 对角线在下一行攻击 ``c+1``，对应左移一位；``/`` 对角线攻击 ``c-1``，对应右移一位。因此下一层状态为：

.. code-block:: text

   columns' = columns | bit
   down'    = ((down | bit) << 1) & full
   up'      = (up | bit) >> 1

递归状态里没有显式的 ``row``。每次选择一个新列就同时代表处理了一行，因此已经处理的行数等于 ``columns`` 中 1 的个数；当 ``columns == full`` 时，恰好有 ``n`` 行和 ``n`` 个不同列都已处理，且每一步都通过了攻击检查，所以可以返回一个完整方案。

以 ``n = 4`` 为例，初始 ``available`` 的四位都是 1。若首行选择最右侧位 ``0001``，下一层的列掩码为 ``0001``，``down`` 为 ``0010``，``up`` 为 ``0000``；因此下一行会排除首列和被对角线攻击的第二列，只从剩余位继续搜索。这个状态的每一位都直接对应代码中的一次位运算，而不是额外维护一个棋盘。

为什么计数不会漏解或重复
~~~~~~~~~~~~~~~~~~~~~~~~

每个合法棋盘从第一行到最后一行都有唯一的列选择序列，算法会逐层枚举每个未被攻击的位；合法序列不会被剪掉。不同的选择序列在某一行必然不同，因而对应不同棋盘。叶子返回 ``1``，父节点求和，正好把所有合法序列各计一次。

主入口使用完整位掩码搜索，没有启用按首行左右对称折半的额外分支；这样 ``totalNQueens`` 与 ``bitDfs`` 和上述状态定义保持直接对应。搜索树上界为排列量级 ``O(n!)``，每个候选只做常数位运算；递归深度为 ``O(n)``，除调用栈外只保存四个整数状态。

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
