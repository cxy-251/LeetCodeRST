0174. Dungeon Game
==================

题目信息
--------

:题号: 0174
:难度: Hard
:主题: 动态规划、逆向状态、网格、最小初始资源
:原题: `LeetCode 0174 <https://leetcode.com/problems/dungeon-game/>`_
:访问状态: Available
:教学重点: 进入格前生命状态、必要性与充分性、边界哨兵、一维滚动 DP

精确契约
--------

给定 ``m x n`` 整数网格 ``dungeon``：

* ``1 <= m,n <= 200``；
* ``-1000 <= dungeon[i][j] <= 1000``；
* 骑士从左上角进入，只能向右或向下移动，最终到达右下角；
* 进入一个格子后，生命值立即加上该格的数值；
* 生命值在任何时刻都必须至少为 1，降到 0 或以下立即失败。

返回保证骑士能够到达右下角所需的最小初始生命值。输入网格只读。

本题不能只最大化终点生命，也不能使用“当前损失较小就走哪边”的局部贪心；
路径是否可行取决于沿途最低生命，而未来所需生命必须从终点反向推回。

示例与反例
----------

标准示例
~~~~~~~~

.. code-block:: text

   dungeon = [
     [-2, -3,  3],
     [-5,-10,  1],
     [10, 30, -5]
   ]

最小初始生命为 7。选择 ``-2 -> -3 -> 3 -> 1 -> -5`` 时，生命依次为
``7 -> 5 -> 2 -> 5 -> 6 -> 1``，全程不低于 1。

单格正数
~~~~~~~~

``[[5]]`` 的答案是 1。进入后生命变为 6；初始生命不能取 0，因为进入前也必须活着。

单格负数
~~~~~~~~

``[[-8]]`` 的答案是 9。进入后恰好剩 1。

全正路径
~~~~~~~~

只要所有可达格子非负，答案仍是 1，而不是 0。

局部贪心反例
~~~~~~~~~~~~

考虑：

.. code-block:: text

   [
     [0,    5, -100],
     [1, -100, -100],
     [1,    1,    1]
   ]

起点右侧的 5 大于下方的 1，但先向右后至少要以 96 点生命进入起点，
而沿第一列向下再走底行只需初始生命 1。因此状态必须概括
“从某格出发完成剩余旅程的最低进入生命”，不能只比较下一格数值。

只看最终总和也不够
~~~~~~~~~~~~~~~~~~

一条路径最终总和很高，仍可能在中途先跌到 0。目标约束是所有前缀生命均至少为 1，
不是只让终点生命最大。

问题抽象与解法选择
------------------

定义：

``need[i][j]``
   骑士在进入格子 ``(i,j)`` **之前**，为了从该格走到终点且全程存活所需的最小生命值。

设当前格数值为 ``x``，右侧和下方合法后继的需求分别为 ``right``、``down``。
只需选择其中需求较小的路径：

.. math::

   nextNeed = \min(right, down)

进入当前格后生命变化为 ``health + x``。为了满足后继需求，需要：

.. math::

   health + x \ge nextNeed

同时进入前生命至少为 1，所以：

.. math::

   need[i][j] = \max(1, nextNeed - x)

右下角也使用同一公式：把终点之后的虚拟后继需求设为 1，则
``need[last] = max(1, 1 - dungeon[last])``。

解法取舍
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间
     - 工作空间
     - 取舍
   * - 逆向一维动态规划
     - ``O(mn)``
     - ``O(n)``
     - 主解法；状态和边界最紧凑
   * - 逆向二维动态规划
     - ``O(mn)``
     - ``O(mn)``
     - 更直观，适合先理解状态
   * - 枚举所有路径
     - 指数级
     - ``O(m+n)`` 递归栈
     - 路径数量过大
   * - 从起点局部贪心
     - 无正确性保证
     - ``O(1)``
     - 未来伤害无法由局部数值决定
   * - 二分初始生命并做可达性检查
     - 多一个对数因子
     - 至少 ``O(n)``
     - 可行但没有直接 DP 简洁

状态、不变量与实现映射
----------------------

二维转移语义
~~~~~~~~~~~~

逆向扫描保证更新 ``(i,j)`` 时，右侧 ``need[i][j+1]`` 与下方 ``need[i+1][j]`` 已经确定。
只有这两个合法后继参与最小值；越界方向不可达。

一维滚动数组
~~~~~~~~~~~~

使用长度 ``n+1`` 的 ``dp``：

* 更新前，``dp[j]`` 保存下方格子的需求；
* 从右向左更新后，``dp[j+1]`` 已保存当前行右侧格子的需求；
* 因而 ``min(dp[j], dp[j+1])`` 就是当前格的最佳后继需求；
* 更新后 ``dp[j]`` 改为当前格需求，供左侧与上一行使用。

边界初始化必须精确：

* 全部位置先设为不可达大值 ``INF``；
* 只把最后一列对应的“公主格下方虚拟后继”设为 1；
* 额外的右边界 ``dp[n]`` 始终保持 ``INF``。

这样右下角恰好看到一个需求为 1 的合法虚拟后继；底行其他格只能选择已更新的右侧，
最右列其他格只能选择真实下方。若把整个右边界都设为 1，算法会错误允许从任意行向右逃出网格。

宽整数与哨兵
~~~~~~~~~~~~

C++ 使用 64 位状态，并把 ``INF`` 设为远小于类型上界的值。按扫描不变量，
每个真实格至少有一个有限合法后继，因此 ``min`` 结果总是有限值，``INF`` 不会参与减法。
任一路径恰经过 ``m+n-1 <= 399`` 个格子；即使每格都是 ``-1000``，初始生命
``399001`` 也能在终点恰剩 1。因此最优答案不超过 ``399001``，最终可安全转换为平台整数返回类型。

正确性证明
----------

对从右下到左上的逆拓扑顺序做归纳。

引理一：给定一个后继需求，当前格所需生命公式正确
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

设选择的后继进入需求为 ``s``，当前格效果为 ``x``。

**必要性。** 若进入当前格的生命 ``h < 1``，骑士在进入前已经失败；若
``h < s-x``，则应用当前格效果后 ``h+x < s``，无法以该后继所需的最低生命进入后继。
因此任何可行 ``h`` 都必须满足 ``h >= max(1,s-x)``。

**充分性。** 取 ``h=max(1,s-x)``。它至少为 1，并且 ``h+x >= s``。
因此骑士经过当前格后拥有足够生命进入该后继；若从后继开始存在可行策略，就能继续到终点。

所以针对固定后继的最小进入生命正是 ``max(1,s-x)``。

引理二：转移选择 ``min(right,down)`` 得到当前格最优需求
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

任意可行路径的第一步只能向右或向下。若选择某个后继 ``s``，由引理一需要
``max(1,s-x)``。函数 ``max(1,s-x)`` 关于 ``s`` 单调不减，因此在合法后继中选择较小需求
会得到不大于另一方向的当前需求。

反过来，选择达到 ``min(right,down)`` 的后继，并使用公式给出的生命，
由引理一充分性可安全进入该后继。故转移既不会低估，也不会高估最小需求。

引理三：右下角基础条件正确
~~~~~~~~~~~~~~~~~~~~~~~~~~

右下角没有真实后继。把“完成任务后仍活着”表示为需求 1 的虚拟后继，
引理一给出 ``max(1,1-dungeon[last])``：若格子为负，必须抵消伤害后至少剩 1；
若格子非负，初始 1 已足够。这与终点合同完全一致。

引理四：逆向 DP 计算的每个状态都等于其定义
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

基础状态由引理三正确。假设当前格右侧和下方的状态已经等于各自最小进入生命，
引理二证明转移得到当前格的最小进入生命。逆向扫描中每个依赖都先于当前格计算，
因此归纳可知所有 ``need[i][j]`` 正确。

引理五：一维滚动数组与二维状态等价
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

处理某行某列前，``dp[j]`` 仍是下方状态；由于列从右向左处理，``dp[j+1]`` 已是当前行右侧状态。
更新公式与二维转移完全相同，随后 ``dp[j]`` 保存当前状态。底行和最右列通过唯一有限哨兵维持同一含义，
所以滚动数组没有丢失依赖。

定理：``dp[0]`` 是最小可行初始生命
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

由引理四和引理五，扫描结束时 ``dp[0]=need[0][0]``。
状态定义就是进入起点前完成整条路径所需的最小生命，
因此返回值正确。

复杂度与实现边界
----------------

* 每个格子只更新一次，时间复杂度 ``O(mn)``；
* 一维数组长度为 ``n+1``，核心额外空间 ``O(n)``；
* 输入网格只读，没有完整二维 DP 副本和路径输出；
* C++ 使用 ``long long`` 保存状态，``INF`` 与合法答案之间有充足余量；
* 官方网格非空，因此访问 ``dungeon[0]`` 与长度为 ``n+1`` 的滚动数组均有定义。

十语言实现
----------

C
~

.. code-block:: c

   #include <limits.h>
   #include <stddef.h>
   #include <stdlib.h>

   int calculateMinimumHP(
       int **dungeon,
       int dungeonSize,
       int *dungeonColSize
   ) {
       if (dungeonSize <= 0 || dungeonColSize == NULL ||
           dungeonColSize[0] <= 0) {
           return 0;
       }

       const int columns = dungeonColSize[0];
       const long long inf = LLONG_MAX / 4;
       long long *dp = malloc(
           ((size_t)columns + 1U) * sizeof(*dp)
       );
       if (dp == NULL) {
           return 0;  // 合法答案至少为 1，0 表示平台外资源失败
       }

       for (int column = 0; column <= columns; ++column) {
           dp[column] = inf;
       }
       dp[columns - 1] = 1;  // 公主格下方的唯一虚拟后继

       for (int row = dungeonSize - 1; row >= 0; --row) {
           for (int column = columns - 1; column >= 0; --column) {
               const long long next_need =
                   dp[column] < dp[column + 1]
                       ? dp[column]
                       : dp[column + 1];
               const long long need =
                   next_need - (long long)dungeon[row][column];
               dp[column] = need <= 1 ? 1 : need;
           }
       }

       const int answer = (int)dp[0];
       free(dp);
       return answer;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       int calculateMinimumHP(
           const std::vector<std::vector<int>>& dungeon
       ) {
           const int rows = static_cast<int>(dungeon.size());
           const int columns = static_cast<int>(dungeon[0].size());
           const long long inf = std::numeric_limits<long long>::max() / 4;
           std::vector<long long> dp(columns + 1, inf);
           dp[columns - 1] = 1;

           for (int row = rows - 1; row >= 0; --row) {
               for (int column = columns - 1; column >= 0; --column) {
                   const long long nextNeed =
                       std::min(dp[column], dp[column + 1]);
                   const long long need =
                       nextNeed - static_cast<long long>(dungeon[row][column]);
                   dp[column] = std::max(1LL, need);
               }
           }

           return static_cast<int>(dp[0]);
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def calculateMinimumHP(self, dungeon: list[list[int]]) -> int:
           rows = len(dungeon)
           columns = len(dungeon[0])
           dp = [float("inf")] * (columns + 1)
           dp[columns - 1] = 1

           for row in range(rows - 1, -1, -1):
               for column in range(columns - 1, -1, -1):
                   next_need = min(dp[column], dp[column + 1])
                   dp[column] = max(1, next_need - dungeon[row][column])

           return int(dp[0])

Java
~~~~

.. code-block:: java

   import java.util.Arrays;

   class Solution {
       public int calculateMinimumHP(int[][] dungeon) {
           int rows = dungeon.length;
           int columns = dungeon[0].length;
           long inf = Long.MAX_VALUE / 4;
           long[] dp = new long[columns + 1];
           Arrays.fill(dp, inf);
           dp[columns - 1] = 1L;

           for (int row = rows - 1; row >= 0; --row) {
               for (int column = columns - 1; column >= 0; --column) {
                   long nextNeed = Math.min(dp[column], dp[column + 1]);
                   long need = nextNeed - (long)dungeon[row][column];
                   dp[column] = Math.max(1L, need);
               }
           }

           return (int)dp[0];
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn calculate_minimum_hp(dungeon: Vec<Vec<i32>>) -> i32 {
           let rows = dungeon.len();
           let columns = dungeon[0].len();
           let inf = i64::MAX / 4;
           let mut dp = vec![inf; columns + 1];
           dp[columns - 1] = 1;

           for row in (0..rows).rev() {
               for column in (0..columns).rev() {
                   let next_need = dp[column].min(dp[column + 1]);
                   let need = next_need - i64::from(dungeon[row][column]);
                   dp[column] = need.max(1);
               }
           }

           dp[0] as i32
       }
   }

Go
~~

.. code-block:: go

   func calculateMinimumHP(dungeon [][]int) int {
       rows := len(dungeon)
       columns := len(dungeon[0])
       const inf int64 = 1 << 60
       dp := make([]int64, columns+1)

       for column := range dp {
           dp[column] = inf
       }
       dp[columns-1] = 1

       for row := rows - 1; row >= 0; row-- {
           for column := columns - 1; column >= 0; column-- {
               nextNeed := dp[column]
               if dp[column+1] < nextNeed {
                   nextNeed = dp[column+1]
               }
               need := nextNeed - int64(dungeon[row][column])
               if need < 1 {
                   need = 1
               }
               dp[column] = need
           }
       }

       return int(dp[0])
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function calculateMinimumHP(dungeon: number[][]): number {
       const rows = dungeon.length;
       const columns = dungeon[0].length;
       const dp = new Array<number>(columns + 1).fill(Infinity);
       dp[columns - 1] = 1;

       for (let row = rows - 1; row >= 0; row--) {
           for (let column = columns - 1; column >= 0; column--) {
               const nextNeed = Math.min(dp[column], dp[column + 1]);
               dp[column] = Math.max(1, nextNeed - dungeon[row][column]);
           }
       }

       return dp[0];
   }

C#
~~

.. code-block:: csharp

   using System;

   public class Solution {
       public int CalculateMinimumHP(int[][] dungeon) {
           int rows = dungeon.Length;
           int columns = dungeon[0].Length;
           long inf = long.MaxValue / 4;
           long[] dp = new long[columns + 1];
           Array.Fill(dp, inf);
           dp[columns - 1] = 1L;

           for (int row = rows - 1; row >= 0; --row) {
               for (int column = columns - 1; column >= 0; --column) {
                   long nextNeed = Math.Min(dp[column], dp[column + 1]);
                   long need = nextNeed - (long)dungeon[row][column];
                   dp[column] = Math.Max(1L, need);
               }
           }

           return (int)dp[0];
       }
   }

Julia
~~~~~

.. code-block:: julia

   function calculate_minimum_hp(dungeon::Matrix{Int})::Int
       rows, columns = size(dungeon)
       inf = typemax(Int64) ÷ 4
       dp = fill(inf, columns + 1)
       dp[columns] = 1  # 最后一列对应公主格下方虚拟后继

       for row in rows:-1:1
           for column in columns:-1:1
               next_need = min(dp[column], dp[column + 1])
               need = next_need - Int64(dungeon[row, column])
               dp[column] = max(Int64(1), need)
           end
       end

       return Int(dp[1])
   end

R
~

.. code-block:: r

   calculate_minimum_hp <- function(dungeon) {
     rows <- nrow(dungeon)
     columns <- ncol(dungeon)
     dp <- rep(Inf, columns + 1L)
     dp[columns] <- 1

     for (row in seq.int(rows, 1L, by = -1L)) {
       for (column in seq.int(columns, 1L, by = -1L)) {
         next_need <- min(dp[column], dp[column + 1L])
         need <- next_need - dungeon[row, column]
         dp[column] <- max(1, need)
       }
     }

     dp[1L]
   }

静态审查记录
------------

本题题解代码未运行、未编译、未对拍。完成了以下人工与静态检查：

* 标准 ``3 x 3`` 示例逆推得到左上角需求 7，并人工沿选定路径验证最低生命为 1；
* ``[[5]]``：虚拟后继 1，公式得到 ``max(1,1-5)=1``；
* ``[[-8]]``：公式得到 9；
* 底行仅使用右侧已更新状态，最右列仅使用真实下方状态，没有从普通边界选择虚拟需求 1；
* 每种语言都从右下向左上更新；Julia 与 R 使用显式负步长；
* 固定宽语言在减法前把格值提升到 64 位，哨兵取类型上界的一小部分；
* 扫描不变量保证 ``min`` 至少选到一个有限后继，哨兵不直接参与减法；
* 由最多 399 个格子、每格最坏 ``-1000`` 推得答案不超过 ``399001``，覆盖最终整数转换；
* 一维数组更新前后含义与正文一致，没有把已更新的右侧和未更新的下方弄反；
* C 分配失败返回 0，正常路径释放 ``dp``；合法答案不可能为 0；
* 所有实现都不修改输入、不计算完整二维表、不保存路径。

剩余风险：未在目标平台实际编译或执行；固定宽返回转换依赖当前官方约束。
C 的 0 仅用于平台外资源失败，LeetCode 标准接口本身没有独立错误通道。

边界、失败路径与易错点
----------------------

* 状态是“进入当前格前”的最小生命，不能写成离开当前格后或从起点累计的最大生命；
* 生命下界是 1，``max`` 不能写成与 0 比较；
* 转移选择后继的较小需求，不是选择格子数值较大的邻居；
* 右下角基础条件应由同一转移和需求 1 的虚拟后继推出；
* 只有公主格拥有需求 1 的虚拟出口，其他边界必须不可达；
* 正向滚动若没有保留路径前缀最低值，无法判断某个累计总和是否可行；
* 使用 32 位中间减法可能在扩展约束后溢出；
* Julia 的 ``rows:1`` 不是递减遍历，必须写 ``rows:-1:1``；
* R 的 ``seq.int`` 必须显式使用 ``by=-1L`` 并保证起点不小于终点，本题行列均至少为 1。

知识更新与关联题目
------------------

新增
~~~~

* **最小所需资源状态**：从目标反推进入每个状态前的最低资源；
* **必要性/充分性转移证明**：既证明更小值必失败，也构造等于状态值时的可行路径；
* **单虚拟后继**：只在公主格下方开放需求 1，避免非法路径逃出状态空间；
* **地下城滚动不变量**：同一数组槽位在更新前表示下方、更新后表示当前。

强化
~~~~

* 复用 0115–0119 的逆序滚动更新纪律，保护尚未消费的旧状态并使用已经更新的新状态；
* 复用 0004 的无穷哨兵表达不可选边界，但在减法前必须由有限后继将其排除；
* 复用 0112–0113 的“先提升再减法”，并增加 ``399001`` 返回上界证书。
* Julia 与 R 延续 0115–0120 的显式递减范围，分别核对一基端点和 ``by=-1L``。

关联题目
~~~~~~~~

* 0064 Minimum Path Sum：也是网格 DP，但目标可直接累加，不含全程资源下界；
* 0120 Triangle：从下一层需求折叠当前层的另一种滚动 DP；
* 0172 Factorial Trailing Zeroes：同样用单调缩小状态避免构造巨大对象；
* 0322 Coin Change：状态也表示达到目标的最小资源，但转移方向和可达模型不同。

自检问题
--------

#. 为什么状态必须定义为进入格子前的生命，而不是到达格子后的最大剩余生命？
#. 转移为什么使用较小的后继需求？
#. 为什么还要对 1 取 ``max``？
#. 一维数组更新 ``dp[j]`` 前，``dp[j]`` 与 ``dp[j+1]`` 分别代表什么？
#. 为什么不能把整条右边界都初始化为 1？

答案要点
~~~~~~~~

#. 进入前状态能直接表达当前格伤害后是否仍满足后继最低需求，并统一处理沿途生命下界。
#. 只需选择一条可行路径；需求较小的后继需要的当前生命不会更大。
#. 骑士进入任何格前都必须活着，即使当前格提供大量治疗，初始生命也不能为 0。
#. 前者仍是下方状态，后者已经更新成当前行右侧状态。
#. 那会允许最右列任意格向右离开网格，产生不存在的更优路径。
