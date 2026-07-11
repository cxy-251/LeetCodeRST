0052. N-Queens II
=================

题目信息
--------

:题号: 0052
:难度: Hard
:主题: 回溯、位掩码、约束传播、计数搜索
:原题: `LeetCode 0052 <https://leetcode.com/problems/n-queens-ii/>`_
:访问状态: Available
:教学重点: 当前行攻击掩码、最低位提取、对角线位移、只计数不构造答案

题目重述
--------

给定整数 ``n``，统计在 ``n × n`` 棋盘上放置 ``n`` 个皇后的不同合法方案数。任意两个皇后不能
位于同一行、同一列或同一条对角线。题目保证 ``1 <= n <= 9``，返回值能够由平台 ``int`` 表示，
输入整数不会被修改。

与 0051 不同，本题只返回方案数量，不需要保存棋盘字符串。可以保留同一棵按行搜索树，把列和两类
对角线约束压缩为位掩码，并在完整布局处把计数加一。

自建示例
--------

四皇后
~~~~~~

.. code-block:: text

   输入：n = 4
   输出：2

四皇后存在两个不同布局，因此只返回整数 ``2``，不返回具体棋盘。

单格棋盘
~~~~~~~~

.. code-block:: text

   输入：n = 1
   输出：1

无解规模
~~~~~~~~

.. code-block:: text

   输入：n = 3
   输出：0

问题抽象
--------

使用最低 ``n`` 个二进制位表示当前行的列：第 ``col`` 位为 1，表示第 ``col`` 列在当前行不可用。
递归状态包含：

* ``columns``：此前皇后已经占用的列；
* ``diag_down``：此前皇后的 ``\`` 对角线在当前行攻击的列；
* ``diag_up``：此前皇后的 ``/`` 对角线在当前行攻击的列。

``full = (1 << n) - 1`` 的最低 ``n`` 位全部为 1。当前行可用列为：

.. code-block:: text

   available = full & ~(columns | diag_down | diag_up)

从 ``available`` 中提取最低位 ``bit = available & -available``，就在该位对应列放置皇后。进入下一行
时：

* 已占用列变为 ``columns | bit``；
* ``\`` 对角线的攻击列向更高位移动一格，因此使用 ``(diag_down | bit) << 1``；
* ``/`` 对角线的攻击列向更低位移动一格，因此使用 ``(diag_up | bit) >> 1``；
* 两类对角线都与 ``full`` 取交集，只保留棋盘范围内的最低 ``n`` 位。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 定位
   * - 位掩码按行回溯
     - ``O(V)``
     - ``O(n)``
     - 主解法；只计数，候选生成和冲突检查都是常数位运算
   * - 三组布尔占用数组
     - ``O(nV)``
     - ``O(n)``
     - 与 0051 相同，状态直观，但每个节点需要扫描 ``n`` 列
   * - 枚举列排列后校验对角线
     - ``O(n · n!)``
     - ``O(n)``
     - 对角线冲突发现较晚

其中 ``V`` 表示位掩码回溯实际访问的合法部分布局数量。

主解法：当前行攻击掩码
----------------------

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

进入一层递归时，已经在前若干行各放置一个互不攻击的皇后，并保持：

* ``columns`` 的第 ``c`` 位为 1，当且仅当列 ``c`` 已被使用；
* ``diag_down`` 的第 ``c`` 位为 1，当且仅当已有 ``\`` 对角线会攻击当前行的列 ``c``；
* ``diag_up`` 的第 ``c`` 位为 1，当且仅当已有 ``/`` 对角线会攻击当前行的列 ``c``；
* 三个掩码只保留最低 ``n`` 位；
* ``columns == full`` 时，恰好已经放置 ``n`` 个皇后。

候选生成
~~~~~~~~

把三类不可用列按位或合并，取反后与 ``full`` 相交，得到当前行全部且仅包含合法列的
``available``。最低位提取一次选择一个候选；执行 ``available ^= bit`` 后，该候选从本层待尝试集合中
删除，不会重复枚举。

对角线位移
~~~~~~~~~~

假设当前行在列 ``c`` 放置皇后。下一行中：

* ``\`` 对角线会攻击列 ``c + 1``，对应位左移一位；
* ``/`` 对角线会攻击列 ``c - 1``，对应位右移一位。

此前所有对角线的攻击位置也按照相同方向移动，所以先把 ``bit`` 加入当前对角线掩码，再整体移位，
即可得到下一行的攻击掩码。

正确性依据
~~~~~~~~~~

**合法性。** ``available`` 排除了已占用列和两类对角线攻击列，因此选择 ``bit`` 后，新皇后不会与
此前皇后冲突。递归每层只放置一个皇后，所以到达 ``columns == full`` 时，棋盘有 ``n`` 个皇后且
满足全部约束。

**对角线状态正确性。** 当前行列 ``c`` 的 ``\`` 对角线在下一行经过列 ``c+1``，位掩码左移一位
正好完成该映射；``/`` 对角线同理右移一位。对所有已有皇后同时移位，得到的掩码恰好表示下一行受到
攻击的列。

**完备性。** 任意合法棋盘按行得到唯一列序列。在每一层，该棋盘当前行的列不在三类不可用掩码中，
因此对应位一定包含在 ``available`` 中。算法会枚举所有置位，沿该列序列的分支不会被遗漏。

**无重复。** 每层从 ``available`` 中逐个删除已尝试的最低位，每个列选择只出现一次；不同合法棋盘
至少在一行选择不同列，因此对应不同递归路径。

**终止性。** 每次递归新增一个已占用列，已放置皇后数量增加一。最大深度为 ``n``，每层候选位有限，
搜索必然终止。

复杂度
~~~~~~

设 ``V`` 为搜索访问的合法部分布局数量：

* 每个节点使用常数次位运算生成和删除候选，搜索时间为 ``O(V)``；
* 忽略对角线限制时，搜索树受列排列树约束，可使用 ``O(n!)`` 作为较松上界；
* 三个掩码和局部变量为常数状态，递归栈深度为 ``n``，额外空间为 ``O(n)``；
* 本题只返回一个整数，没有随答案数量增长的输出空间。

核心语言实现
------------

C
~

.. code-block:: c

   static int count_queens(
       int full,
       int columns,
       int diag_down,
       int diag_up
   ) {
       if (columns == full) {
           return 1;
       }

       int available = full & ~(columns | diag_down | diag_up);
       int total = 0;

       while (available != 0) {
           int bit = available & -available;
           available ^= bit;
           total += count_queens(
               full,
               columns | bit,
               ((diag_down | bit) << 1) & full,
               ((diag_up | bit) >> 1) & full
           );
       }
       return total;
   }

   int totalNQueens(int n) {
       int full = (1 << n) - 1;
       return count_queens(full, 0, 0, 0);
   }

``n <= 9``，所以移位、掩码和方案总数都安全落在 32 位 ``int`` 内。

C++
~~~

.. code-block:: cpp

   class Solution {
       int countQueens(
           int full,
           int columns,
           int diagDown,
           int diagUp
       ) {
           if (columns == full) {
               return 1;
           }

           int available = full & ~(columns | diagDown | diagUp);
           int total = 0;
           while (available != 0) {
               int bit = available & -available;
               available ^= bit;
               total += countQueens(
                   full,
                   columns | bit,
                   ((diagDown | bit) << 1) & full,
                   ((diagUp | bit) >> 1) & full
               );
           }
           return total;
       }

   public:
       int totalNQueens(int n) {
           int full = (1 << n) - 1;
           return countQueens(full, 0, 0, 0);
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def totalNQueens(self, n: int) -> int:
           full = (1 << n) - 1

           def dfs(columns: int, diag_down: int, diag_up: int) -> int:
               if columns == full:
                   return 1

               available = full & ~(columns | diag_down | diag_up)
               total = 0
               while available:
                   bit = available & -available
                   available ^= bit
                   total += dfs(
                       columns | bit,
                       ((diag_down | bit) << 1) & full,
                       ((diag_up | bit) >> 1) & full,
                   )
               return total

           return dfs(0, 0, 0)

Java
~~~~

.. code-block:: java

   class Solution {
       private int countQueens(
           int full,
           int columns,
           int diagDown,
           int diagUp
       ) {
           if (columns == full) {
               return 1;
           }

           int available = full & ~(columns | diagDown | diagUp);
           int total = 0;
           while (available != 0) {
               int bit = available & -available;
               available ^= bit;
               total += countQueens(
                   full,
                   columns | bit,
                   ((diagDown | bit) << 1) & full,
                   ((diagUp | bit) >>> 1) & full
               );
           }
           return total;
       }

       public int totalNQueens(int n) {
           int full = (1 << n) - 1;
           return countQueens(full, 0, 0, 0);
       }
   }

Java 使用无符号右移 ``>>>``。当前掩码始终非负且只使用最低 9 位，``>>`` 也会得到同样结果；显式
使用 ``>>>`` 能直接表达“右移位集合”的意图。

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn total_n_queens(n: i32) -> i32 {
           fn dfs(
               full: u32,
               columns: u32,
               diag_down: u32,
               diag_up: u32,
           ) -> i32 {
               if columns == full {
                   return 1;
               }

               let mut available =
                   full & !(columns | diag_down | diag_up);
               let mut total = 0;
               while available != 0 {
                   let bit = available & available.wrapping_neg();
                   available ^= bit;
                   total += dfs(
                       full,
                       columns | bit,
                       ((diag_down | bit) << 1) & full,
                       ((diag_up | bit) >> 1) & full,
                   );
               }
               total
           }

           let full = (1_u32 << (n as u32)) - 1;
           dfs(full, 0, 0, 0)
       }
   }

``wrapping_neg`` 在无符号整数上构造二进制补码负值，用于最低位提取。``n <= 9``，移位量合法。

Go
~~

.. code-block:: go

   func totalNQueens(n int) int {
       full := (1 << n) - 1

       var dfs func(columns, diagDown, diagUp int) int
       dfs = func(columns, diagDown, diagUp int) int {
           if columns == full {
               return 1
           }

           available := full & ^(columns | diagDown | diagUp)
           total := 0
           for available != 0 {
               bit := available & -available
               available ^= bit
               total += dfs(
                   columns|bit,
                   ((diagDown|bit)<<1)&full,
                   ((diagUp|bit)>>1)&full,
               )
           }
           return total
       }

       return dfs(0, 0, 0)
   }

Go 的 ``^`` 是按位取反；与 ``full`` 相交后，只保留棋盘使用的最低 ``n`` 位。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function totalNQueens(n: number): number {
       const full = (1 << n) - 1;

       function dfs(
           columns: number,
           diagDown: number,
           diagUp: number,
       ): number {
           if (columns === full) {
               return 1;
           }

           let available = full & ~(columns | diagDown | diagUp);
           let total = 0;
           while (available !== 0) {
               const bit = available & -available;
               available ^= bit;
               total += dfs(
                   columns | bit,
                   ((diagDown | bit) << 1) & full,
                   ((diagUp | bit) >>> 1) & full,
               );
           }
           return total;
       }

       return dfs(0, 0, 0);
   }

TypeScript 位运算会转换为 32 位有符号整数。本题只使用最低 9 位，因此该转换在精确约束内安全。

C#
~~

.. code-block:: csharp

   public class Solution {
       private static int CountQueens(
           int full,
           int columns,
           int diagDown,
           int diagUp
       ) {
           if (columns == full) {
               return 1;
           }

           int available = full & ~(columns | diagDown | diagUp);
           int total = 0;
           while (available != 0) {
               int bit = available & -available;
               available ^= bit;
               total += CountQueens(
                   full,
                   columns | bit,
                   ((diagDown | bit) << 1) & full,
                   ((diagUp | bit) >> 1) & full
               );
           }
           return total;
       }

       public int TotalNQueens(int n) {
           int full = (1 << n) - 1;
           return CountQueens(full, 0, 0, 0);
       }
   }

Julia
~~~~~

.. code-block:: julia

   function total_n_queens(n::Int)::Int
       full = (UInt(1) << n) - UInt(1)

       function dfs(
           columns::UInt,
           diag_down::UInt,
           diag_up::UInt,
       )::Int
           if columns == full
               return 1
           end

           available = full & ~(columns | diag_down | diag_up)
           total = 0
           while available != 0
               bit = available & (-available)
               available = xor(available, bit)
               total += dfs(
                   columns | bit,
                   ((diag_down | bit) << 1) & full,
                   ((diag_up | bit) >> 1) & full,
               )
           end
           total
       end

       dfs(UInt(0), UInt(0), UInt(0))
   end

Julia 使用无符号掩码。无符号取负按模 ``2^w`` 运算，可以与原值按位与提取最低置位。

R
~

.. code-block:: r

   total_n_queens <- function(n) {
     full <- bitwShiftL(1L, n) - 1L

     dfs <- function(columns, diag_down, diag_up) {
       if (columns == full) {
         return(1L)
       }

       blocked <- bitwOr(columns, bitwOr(diag_down, diag_up))
       available <- bitwAnd(full, bitwNot(blocked))
       total <- 0L

       while (available != 0L) {
         bit <- bitwAnd(available, -available)
         available <- bitwXor(available, bit)
         total <- total + dfs(
           bitwOr(columns, bit),
           bitwAnd(
             bitwShiftL(bitwOr(diag_down, bit), 1L),
             full
           ),
           bitwAnd(
             bitwShiftR(bitwOr(diag_up, bit), 1L),
             full
           )
         )
       }
       total
     }

     dfs(0L, 0L, 0L)
   }

R 的位运算使用 32 位整数；``n <= 9``，所有掩码和计数都在可表示范围内。

验证计划与证据
--------------

本题以已知方案数和独立数组回溯实现共同验证：

* ``n = 1..9`` 应得到 ``1, 0, 0, 2, 10, 4, 40, 92, 352``；
* 与 0051 实际生成的棋盘数量逐项比较；
* 独立三组布尔数组回溯作为对拍基准，不复用位移状态；
* 检查每层 ``available`` 只包含 ``full`` 的最低 ``n`` 位。

已完成的验证：

* **运行验证：** C、C++、Python、Java、Go、TypeScript 执行 ``n = 1..9`` 数量测试；
* **编译验证：** C 使用 C17、``-Wall -Wextra -Werror``，C++ 使用 C++17，Java 使用
  ``javac -Xlint:all``，TypeScript 使用 ``tsc --strict``；
* **基准对拍：** 独立 Python 布尔占用数组回溯得到相同九组数量；
* **静态验证：** Rust、C#、Julia、R 检查位宽、移位方向、低位提取、接口和返回类型；当前环境
  未安装这四种语言运行时，因此不声称运行通过。

关键边界
--------

* ``n = 1``：唯一候选位直接形成一个完整布局；
* ``n = 2``、``n = 3``：所有候选分支耗尽后计数为 0；
* ``full``：取反之后必须与 ``full`` 相交，避免高位的 1 进入候选集合；
* 右移：Java、TypeScript 使用无符号右移更直接表达位集合；
* TypeScript：位运算只在 ``n <= 9`` 的精确约束内使用；
* 计数：本题只统计方案，不应在叶子构造棋盘字符串。

易错点
------

* 把当前行攻击掩码误解为所有行不变的绝对对角线编号；
* 左移和右移方向写反；
* 对角线移位后忘记与 ``full`` 相交；
* 最低位提取后没有从 ``available`` 删除 ``bit``；
* 用 ``columns == full`` 以外的模糊条件判断完整布局；
* 沿用 0051 的棋盘快照，造成无必要的 ``O(Sn²)`` 输出工作。

本题新增知识
------------

* 用当前行攻击掩码代替绝对对角线数组；
* 位移可以把当前行的对角线约束传递到下一行；
* ``x & -x`` 提取最低置位，``x ^= bit`` 删除已尝试候选；
* 计数型搜索不需要保存路径或答案对象。

本题强化知识
------------

* 0051 的按行回溯、完备性和无重复证明保持不变；
* 0037 的最低置位提取与可逆约束状态得到复现；
* TypeScript 只有在精确小位宽约束下才适合使用整数位运算；
* 复杂度继续使用实际访问节点数 ``V``，不把剪枝搜索机械写成严格 ``O(n!)``。

关联题目
--------

* `0051. N-Queens <0051-n-queens.rst>`_：生成所有棋盘，使用绝对列和对角线占用数组；
* `0037. Sudoku Solver <0037-sudoku-solver.rst>`_：位集合、最低置位和约束搜索；
* `0046. Permutations <0046-permutations.rst>`_：按位置建立排列型搜索树。

最小自检
--------

#. 三个掩码分别表示什么，为什么都是针对当前行解释？
#. 为什么 ``\`` 对角线进入下一行时左移，而 ``/`` 对角线右移？
#. 为什么 ``available & -available`` 只保留最低位？
#. 为什么到达 ``columns == full`` 就能计数一个完整答案？
#. 本题为何不再包含 ``O(Sn²)`` 的棋盘输出成本？

答案要点
~~~~~~~~

#. ``available`` 是当前行全部合法列的位集合。
#. 新皇后的两类对角线在下一行分别攻击相邻的高位列和低位列，所以对应左移与右移。
#. 二进制补码中 ``-x`` 只保留最低置位及其右侧零的关系，按位与后得到最低置位。
#. 每层恰好放一个皇后，``columns`` 的最低 ``n`` 位全为 1 时已经完成 ``n`` 行。
#. 0052 只返回计数，叶子不构造棋盘，因此没有答案字符串输出成本。
