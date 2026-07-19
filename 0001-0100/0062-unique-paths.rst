0062. Unique Paths
==================

题目信息
--------

:题号: 0062
:难度: Medium
:主题: 动态规划、网格、组合计数、滚动数组
:原题: `LeetCode 0062 <https://leetcode.com/problems/unique-paths/>`_
:访问状态: Available
:教学重点: 最后一步分类、二维状态、一维压缩、覆盖顺序、计数上界

题目重述
--------

有一个 ``m × n`` 的矩形网格。机器人从左上角出发，每一步只能向右或向下移动一格，目标是到达
右下角。返回所有不同移动路径的数量。

题目保证：

* ``1 <= m, n <= 100``；
* 起点和终点都属于网格；
* 机器人不能向左、向上或停留；
* 正确答案不超过 ``2 × 10^9``；
* 输入只有两个尺寸参数，不存在需要修改的容器。

每条路径由方向序列唯一确定，路径数量使用整数表示。

自建示例
--------

普通矩形
~~~~~~~~

.. code-block:: text

   输入：m = 3, n = 4
   输出：10

   到达终点需要 2 次向下和 3 次向右，共有 C(5, 2) = 10 种排列。

单行网格
~~~~~~~~

.. code-block:: text

   输入：m = 1, n = 5
   输出：1

只有持续向右这一条路径。

单列网格
~~~~~~~~

.. code-block:: text

   输入：m = 6, n = 1
   输出：1

只有持续向下这一条路径。

单格网格
~~~~~~~~

.. code-block:: text

   输入：m = 1, n = 1
   输出：1

起点已经是终点，空移动序列也对应一条合法路径。

问题抽象
--------

记 ``ways[row][col]`` 为从左上角走到单元格 ``(row, col)`` 的路径数量。除起点外，进入当前单元格
的最后一步只有两种可能：

* 从上方 ``(row - 1, col)`` 向下进入；
* 从左方 ``(row, col - 1)`` 向右进入。

两类路径的最后一步方向不同，因此互不重叠；它们又覆盖了所有合法路径，所以：

.. code-block:: text

   ways[row][col] = ways[row - 1][col] + ways[row][col - 1]

越过网格上边界或左边界的来源视为 ``0``，起点状态单独设为 ``1``。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 算法额外空间
     - 定位
   * - 一维滚动动态规划
     - ``O(mn)``
     - ``O(n)``
     - 主解法；直接展示上方状态与左侧状态的覆盖关系
   * - 二维动态规划
     - ``O(mn)``
     - ``O(mn)``
     - 状态最直观，但保存了不再需要的历史行
   * - 组合数 ``C(m+n-2, m-1)``
     - ``O(min(m,n))``
     - ``O(1)``
     - 更快，但需要额外处理乘除顺序与中间整数宽度
   * - 朴素递归枚举
     - 指数级
     - ``O(m+n)`` 递归栈
     - 重复计算相同单元格，不适合作为主解法

主解法：一维滚动动态规划
------------------------

状态定义
~~~~~~~~

使用长度为 ``n`` 的数组 ``dp``。处理当前行的第 ``col`` 个单元格前：

* ``dp[col]`` 保存上一行同列单元格的路径数，也就是“从上方进入”的数量；
* 当 ``col > 0`` 时，``dp[col - 1]`` 已经更新为当前行左侧单元格的路径数；
* 当前单元格的新值应为两者之和。

初始化 ``dp[0] = 1``，其余位置为 ``0``。随后从第一行开始逐行扫描。第一行中每个位置都只能从左边
到达，因此连续更新后整行都会变成 ``1``；后续行使用同一转移。

核心不变量
~~~~~~~~~~

处理完当前行的前 ``col + 1`` 个单元格后：

* ``dp[0..col]`` 分别等于当前行这些列的正确路径数量；
* ``dp[col+1..n-1]`` 仍保存上一行尚未处理列的路径数量；
* 所有已经写入的状态只依赖其上方与左侧的已知状态；
* 更新从左向右进行，因此覆盖旧 ``dp[col]`` 后不会再需要该上方状态。

正确性依据
~~~~~~~~~~

**初始化正确。** 起点只有一条空移动路径，所以 ``dp[0] = 1``。第一行其余位置没有上方来源，旧值
为 ``0``；每次加入左侧路径数后得到 ``1``。第一列在每一行都没有左侧来源，``dp[0]`` 保持 ``1``。

**状态转移完整。** 任意到达非起点单元格的合法路径，其最后一步必定来自上方或左方。算法把这两类
路径数量相加，因此没有遗漏。

**状态转移无重复。** 来自上方的路径最后一步是向下，来自左方的路径最后一步是向右；同一条完整路径
不可能同时属于两类，所以相加不会重复计数。

**覆盖顺序合法。** 更新 ``dp[col]`` 前，它仍是上方状态；``dp[col - 1]`` 已经是左侧状态。写入当前
状态后，后续单元格只需要它作为左侧来源，不再需要被覆盖的旧值，因此一维压缩不改变二维转移语义。

**返回值正确。** 全部 ``m`` 行处理完成后，不变量说明 ``dp[n - 1]`` 等于右下角路径数。

**终止性。** 两层循环各自按有限的行数和列数单调前进，每个单元格恰好处理一次。

复杂度
~~~~~~

* 网格共有 ``m × n`` 个单元格，每个单元格执行常数次整数运算，时间复杂度为 ``O(mn)``；
* ``dp`` 保存一行状态，算法额外空间为 ``O(n)``；
* 返回结果是单个整数，不存在结果集合或复制成本；
* 题目保证最终答案不超过 ``2 × 10^9``。所有中间状态都是某个前缀子网格的路径数，不大于完整网格
  终点路径数，因此 32 位有符号整数足够；
* R 使用双精度 ``numeric`` 保存整数计数，本题数值远小于 ``2^53``，表示仍然精确。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stddef.h>
   #include <stdlib.h>

   int uniquePaths(int m, int n) {
       int *dp = calloc((size_t)n, sizeof(*dp));
       if (dp == NULL) {
           /* 合法答案至少为 1，因此 0 可作为分配失败哨兵。 */
           return 0;
       }

       dp[0] = 1;
       for (int row = 0; row < m; ++row) {
           for (int col = 1; col < n; ++col) {
               dp[col] += dp[col - 1];
           }
       }

       int answer = dp[n - 1];
       free(dp);
       return answer;
   }

平台保证 ``n >= 1``，所以 ``dp[0]`` 和 ``dp[n - 1]`` 都合法。``calloc`` 的元素数量来自
``n <= 100``，容量乘积安全。

C++
~~~

.. code-block:: cpp

   #include <cstddef>
   #include <vector>

   class Solution {
   public:
       int uniquePaths(int m, int n) {
           std::vector<int> dp(static_cast<std::size_t>(n), 0);
           dp[0] = 1;

           for (int row = 0; row < m; ++row) {
               for (int col = 1; col < n; ++col) {
                   dp[static_cast<std::size_t>(col)] +=
                       dp[static_cast<std::size_t>(col - 1)];
               }
           }

           return dp.back();
       }
   };

``n <= 100`` 支撑 ``int`` 到 ``std::size_t`` 的转换。结果数组由 ``vector`` 自动管理。

Python
~~~~~~

.. code-block:: python

   class Solution:
       def uniquePaths(self, m: int, n: int) -> int:
           dp = [0] * n
           dp[0] = 1

           for _ in range(m):
               for col in range(1, n):
                   dp[col] += dp[col - 1]

           return dp[-1]

Python 整数可自动扩展，但正确性仍依赖题目给出的统一计数边界。列表占 ``O(n)`` 空间。

Java
~~~~

.. code-block:: java

   class Solution {
       public int uniquePaths(int m, int n) {
           int[] dp = new int[n];
           dp[0] = 1;

           for (int row = 0; row < m; ++row) {
               for (int col = 1; col < n; ++col) {
                   dp[col] += dp[col - 1];
               }
           }

           return dp[n - 1];
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn unique_paths(m: i32, n: i32) -> i32 {
           let rows = m as usize;
           let cols = n as usize;
           let mut dp = vec![0i32; cols];
           dp[0] = 1;

           for _ in 0..rows {
               for col in 1..cols {
                   dp[col] += dp[col - 1];
               }
           }

           dp[cols - 1]
       }
   }

``m`` 与 ``n`` 都在 ``1..=100``，转换为 ``usize`` 安全，且 ``cols - 1`` 不会下溢。

Go
~~

.. code-block:: go

   func uniquePaths(m int, n int) int {
       dp := make([]int, n)
       dp[0] = 1

       for row := 0; row < m; row++ {
           for col := 1; col < n; col++ {
               dp[col] += dp[col-1]
           }
       }

       return dp[n-1]
   }

结果不超过 ``2 × 10^9``，即使在 32 位 Go 平台上也能由 ``int`` 表示。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function uniquePaths(m: number, n: number): number {
       const dp: number[] = Array<number>(n).fill(0);
       dp[0] = 1;

       for (let row = 0; row < m; row += 1) {
           for (let col = 1; col < n; col += 1) {
               dp[col] += dp[col - 1];
           }
       }

       return dp[n - 1];
   }

全部状态远小于 ``Number.MAX_SAFE_INTEGER``，代码不使用会转成 32 位有符号整数的位运算。

C#
~~

.. code-block:: csharp

   public class Solution {
       public int UniquePaths(int m, int n) {
           int[] dp = new int[n];
           dp[0] = 1;

           for (int row = 0; row < m; ++row) {
               for (int col = 1; col < n; ++col) {
                   dp[col] += dp[col - 1];
               }
           }

           return dp[n - 1];
       }
   }

Julia
~~~~~

.. code-block:: julia

   function unique_paths(m::Int, n::Int)::Int
       dp = zeros(Int, n)
       dp[1] = 1

       for _ in 1:m
           for col in 2:n
               dp[col] += dp[col - 1]
           end
       end

       return dp[n]
   end

Julia 容器使用一基索引。``n == 1`` 时 ``2:n`` 是空 ``UnitRange``，内层循环不会执行。

R
~

.. code-block:: r

   unique_paths <- function(m, n) {
     dp <- numeric(n)
     dp[1L] <- 1

     for (row in seq_len(m)) {
       if (n > 1L) {
         for (col in seq.int(2L, n)) {
           dp[col] <- dp[col] + dp[col - 1L]
         }
       }
     }

     dp[n]
   }

R 的 ``2:n`` 在 ``n == 1`` 时会产生 ``c(2, 1)``，因此必须先判断并使用 ``seq.int``。

语言边界说明
------------

* C 的分配失败返回 ``0``，它与本题最小合法答案 ``1`` 可区分；
* C++、Java、Rust、Go、TypeScript、C#、Julia 与 R 的数组都只保存当前一行状态；
* Rust 的固定宽返回类型由 ``2 × 10^9`` 上界支撑；
* TypeScript 使用精确整数 ``number``，没有 32 位位运算；
* Julia 把零基列坐标映射为一基位置，R 额外避开 ``2:1`` 的非空序列陷阱；
* 十语言都返回同一个整数计数，不修改任何输入对象。

对照解法：组合数直接计算
------------------------

每条路径恰好包含 ``m - 1`` 次向下和 ``n - 1`` 次向右，因此答案是：

.. code-block:: text

   C(m + n - 2, m - 1)

可以逐项乘除，在 ``O(min(m,n))`` 时间和 ``O(1)`` 空间内得到答案。该方法依赖组合数推导，并且固定宽
语言必须先扩宽乘法、选择较小的组合参数、证明每一步可整除并控制中间值。滚动动态规划更适合作为后续
障碍网格和最小路径和的共同基础。

验证计划与证据
--------------

``运行验证``
   覆盖 ``1 × 1``、单行、单列、普通矩形、对称尺寸、``17 × 18`` 大计数和 ``100 × 1`` 长边界。

``随机基准对拍``
   Python 对小尺寸 ``m``、``n`` 使用独立组合数 ``math.comb`` 计算期望值，与滚动动态规划逐项比较。

``编译验证``
   C 使用 C17、严格警告、AddressSanitizer 与 UndefinedBehaviorSanitizer；C++ 使用 C++17 严格警告和
   sanitizer；Java、Go 与 TypeScript 分别完成编译或严格类型检查。

``静态验证``
   Rust、C#、Julia 与 R 在当前环境缺少运行时，检查类型转换、一基索引、空范围和返回宽度，不宣称运行
   通过。

关键边界
--------

* ``m = 1`` 或 ``n = 1``：答案始终为 ``1``；
* ``m = n = 1``：起点即终点，不能返回 ``0``；
* 更新顺序必须从左向右，使 ``dp[col - 1]`` 表示当前行左侧状态；
* ``dp[col]`` 覆盖前必须先参与当前转移，否则会丢失上方路径数；
* 不能把组合数公式的中间乘法默认视为 32 位安全。

易错点
------

* 把起点初始化为 ``0``，导致整张表始终为零；
* 第一行和第一列重复初始化，令起点被计数两次；
* 从右向左更新一维数组，使左侧状态仍属于上一行；
* 返回 ``dp[n]`` 而不是零基容器的 ``dp[n - 1]``；
* 在 R 中直接循环 ``2:n``，当 ``n = 1`` 时发生越界访问；
* 只写 ``O(n)`` 空间，却没有说明 ``n`` 表示列数而不是全部单元格数。

本题新增知识
------------

* 网格路径计数可以按“最后一步来自上方或左方”建立动态规划；
* 二维转移只依赖上一行和当前行左侧，因此可以压缩为一维数组；
* 一维覆盖顺序本身是正确性条件，必须证明旧上方状态和新左侧状态同时可用；
* 最终计数上界可以反向约束全部非负中间状态的整数宽度。

本题强化知识
------------

* 0053 的滚动动态规划思想从两个标量扩展为一行状态；
* 0054 与 0059 的矩阵坐标继续要求 Julia、R 显式处理一基索引；
* TypeScript 的整数算法继续避免隐式 32 位位运算；
* 复杂度继续区分算法工作数组与单个整数返回值。

关联题目
--------

* `0053. Maximum Subarray <0053-maximum-subarray.rst>`_：两题都只保留下一次转移需要的动态规划状态，
  本题把常数状态扩展为一行网格状态。
* `0059. Spiral Matrix II <0059-spiral-matrix-ii.rst>`_：两题都遍历矩阵坐标；0059 维护几何边界，本题
  维护每个列位置的路径计数。

最小自检
--------

#. ``dp[col]`` 更新前和更新后分别表示哪一行的状态？
#. 为什么来自上方和来自左方的路径可以直接相加？
#. 为什么一维数组必须从左向右更新？
#. ``m = 1``、``n = 1`` 时循环和返回值是否仍正确？
#. 哪些语言经过运行验证，哪些只完成静态验证？

答案要点
~~~~~~~~

#. 更新前是上一行同列状态，更新后是当前行同列状态。
#. 任意路径的最后一步方向唯一，两类互斥且完整。
#. 左侧位置必须先成为当前行状态，同时当前列旧值仍保留上方状态。
#. 初始化 ``dp[0] = 1`` 后，空内层循环自然得到答案 ``1``。
#. C、C++、Python、Java、Go、TypeScript 实际运行；其余语言按环境完成静态检查。
