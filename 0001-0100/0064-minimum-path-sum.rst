0064. Minimum Path Sum
======================

题目信息
--------

:题号: 0064
:难度: Medium
:主题: 动态规划、网格、最短路径、滚动数组
:原题: `LeetCode 0064 <https://leetcode.com/problems/minimum-path-sum/>`_
:访问状态: Available
:教学重点: 最优子结构、边界初始化、最小值转移、滚动覆盖、和的上界

题目重述
--------

给定一个非空矩形网格，每个单元格保存一个非负整数。从左上角出发，每一步只能向右或向下，路径代价
是经过的全部单元格数值之和。返回到达右下角的最小路径和。

题目保证：

* ``1 <= grid.length, grid[row].length <= 200``；
* 每一行长度相同，输入是非空矩形；
* ``0 <= grid[row][col] <= 200``；
* 起点和终点的数值都计入路径和；
* 主实现只读取网格，不修改输入。

任意合法路径经过 ``m + n - 1`` 个单元格，最多经过 ``399`` 个位置，因此路径和不超过
``399 × 200 = 79800``，32 位有符号整数足够。

自建示例
--------

普通网格
~~~~~~~~

.. code-block:: text

   输入：
   [
     [1, 3, 1],
     [1, 5, 1],
     [4, 2, 1]
   ]
   输出：7

最优路径经过 ``1 -> 3 -> 1 -> 1 -> 1``。

单行网格
~~~~~~~~

.. code-block:: text

   输入：[[2, 0, 4, 1]]
   输出：7

没有方向选择，必须经过整行。

单列网格
~~~~~~~~

.. code-block:: text

   输入：[[3], [1], [2]]
   输出：6

包含零值
~~~~~~~~

.. code-block:: text

   输入：[[0, 0], [5, 0]]
   输出：0

零值是合法代价，不能被当作“尚未计算”或不可达哨兵。

问题抽象
--------

记 ``best[row][col]`` 为到达当前单元格的最小路径和。除起点外，当前单元格的最后一步只能来自上方或
左方，因此：

.. code-block:: text

   best[row][col] = min(
       best[row - 1][col],
       best[row][col - 1]
   ) + grid[row][col]

第一行只能从左侧到达，第一列只能从上方到达。转移只依赖上一行和当前行左侧，可以使用一维数组
``dp`` 保存最小和。

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
     - 主解法；保留上方状态并即时生成左侧状态
   * - 二维动态规划
     - ``O(mn)``
     - ``O(mn)``
     - 最容易观察状态，但保存全部历史行
   * - 原地改写输入网格
     - ``O(mn)``
     - ``O(1)``
     - 空间更少，但破坏输入，不符合本题主实现契约
   * - 记忆化递归
     - ``O(mn)``
     - ``O(mn)`` 缓存与递归栈
     - 状态等价，控制流和栈成本更复杂

主解法：一维最小路径和动态规划
------------------------------

状态定义
~~~~~~~~

先用第一行初始化 ``dp``：

.. code-block:: text

   dp[0] = grid[0][0]
   dp[col] = dp[col - 1] + grid[0][col]

这表示第一行只能持续向右。随后逐行处理：

* 当前行第一列只能从上方到达，执行 ``dp[0] += grid[row][0]``；
* 对 ``col >= 1``，更新前的 ``dp[col]`` 是上方最小和；
* ``dp[col - 1]`` 已经是当前行左侧最小和；
* 取两者较小值，再加当前单元格代价。

核心不变量
~~~~~~~~~~

处理第 ``row`` 行的第 ``col`` 个位置前：

* ``dp[col]`` 是到达上一行同列的最小路径和；
* ``dp[col - 1]`` 是到达当前行左侧位置的最小路径和；
* ``dp[0..col-1]`` 已完成当前行更新，``dp[col..n-1]`` 仍属于上一行；
* 每个已更新值都包含其目标单元格本身的代价；
* 所有状态只引用输入数值，不修改网格。

正确性依据
~~~~~~~~~~

**第一行和第一列初始化正确。** 第一行每个位置只有左侧前驱，所以前缀累加得到唯一合法路径代价；
后续行的第一列只有上方前驱，因此在原 ``dp[0]`` 上加入当前值即可。

**转移候选完整。** 任意到达内部单元格的合法路径，最后一步必定来自上方或左方，不存在第三种来源。
所以最优路径一定属于这两类之一。

**最优子结构成立。** 若一条到达当前单元格的最优路径来自上方，而其前缀不是到达上方单元格的最小
路径，就可以用更小的前缀替换并得到更小总和，与最优性矛盾。左方同理。因此只需比较两个前驱的最优值。

**一维覆盖顺序正确。** 从左向右更新时，当前 ``dp[col]`` 尚未覆盖，仍是上方状态；
``dp[col - 1]`` 已更新为左侧状态。写入当前最优值后，后续位置只需要它作为左侧来源，不再需要旧值。

**返回值正确。** 最后一行全部处理完成后，不变量说明 ``dp[n - 1]`` 是右下角最小路径和。

**终止性。** 第一行初始化和后续两层循环都在有限范围内单调前进，每个单元格恰好处理一次。

复杂度
~~~~~~

设网格为 ``m × n``：

* 每个单元格执行常数次加法和比较，时间复杂度为 ``O(mn)``；
* 一维 ``dp`` 数组占 ``O(n)`` 算法额外空间；
* 输入不修改、不复制，返回值是单个整数；
* 任意路径最多包含 ``m+n-1 <= 399`` 个值，每个值不超过 ``200``，所有中间和与答案都不超过
  ``79800``，32 位有符号整数安全；
* R 使用 ``numeric``，该整数范围能够被精确表示。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stddef.h>
   #include <stdlib.h>

   int minPathSum(
       int **grid,
       int gridSize,
       int *gridColSize
   ) {
       int cols = gridColSize[0];
       int *dp = malloc((size_t)cols * sizeof(*dp));
       if (dp == NULL) {
           /* 合法路径和非负，-1 明确表示分配失败。 */
           return -1;
       }

       dp[0] = grid[0][0];
       for (int col = 1; col < cols; ++col) {
           dp[col] = dp[col - 1] + grid[0][col];
       }

       for (int row = 1; row < gridSize; ++row) {
           dp[0] += grid[row][0];
           for (int col = 1; col < cols; ++col) {
               int predecessor = dp[col] < dp[col - 1]
                   ? dp[col]
                   : dp[col - 1];
               dp[col] = predecessor + grid[row][col];
           }
       }

       int answer = dp[cols - 1];
       free(dp);
       return answer;
   }

容量由 ``cols <= 200`` 支撑。函数借用输入网格，结果数组在返回前释放。

C++
~~~

.. code-block:: cpp

   #include <cstddef>
   #include <algorithm>
   #include <vector>

   class Solution {
   public:
       int minPathSum(const std::vector<std::vector<int>>& grid) {
           const std::size_t rows = grid.size();
           const std::size_t cols = grid[0].size();
           std::vector<int> dp(cols, 0);

           dp[0] = grid[0][0];
           for (std::size_t col = 1; col < cols; ++col) {
               dp[col] = dp[col - 1] + grid[0][col];
           }

           for (std::size_t row = 1; row < rows; ++row) {
               dp[0] += grid[row][0];
               for (std::size_t col = 1; col < cols; ++col) {
                   dp[col] = std::min(dp[col], dp[col - 1])
                       + grid[row][col];
               }
           }

           return dp.back();
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def minPathSum(self, grid: list[list[int]]) -> int:
           rows = len(grid)
           cols = len(grid[0])
           dp = [0] * cols

           dp[0] = grid[0][0]
           for col in range(1, cols):
               dp[col] = dp[col - 1] + grid[0][col]

           for row in range(1, rows):
               dp[0] += grid[row][0]
               for col in range(1, cols):
                   dp[col] = min(dp[col], dp[col - 1]) + grid[row][col]

           return dp[-1]

代码不使用 ``grid[0][:]`` 或其他行切片，额外空间只来自 ``dp``。

Java
~~~~

.. code-block:: java

   class Solution {
       public int minPathSum(int[][] grid) {
           int rows = grid.length;
           int cols = grid[0].length;
           int[] dp = new int[cols];

           dp[0] = grid[0][0];
           for (int col = 1; col < cols; ++col) {
               dp[col] = dp[col - 1] + grid[0][col];
           }

           for (int row = 1; row < rows; ++row) {
               dp[0] += grid[row][0];
               for (int col = 1; col < cols; ++col) {
                   dp[col] = Math.min(dp[col], dp[col - 1])
                       + grid[row][col];
               }
           }

           return dp[cols - 1];
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn min_path_sum(grid: Vec<Vec<i32>>) -> i32 {
           let rows = grid.len();
           let cols = grid[0].len();
           let mut dp = vec![0i32; cols];

           dp[0] = grid[0][0];
           for col in 1..cols {
               dp[col] = dp[col - 1] + grid[0][col];
           }

           for row in 1..rows {
               dp[0] += grid[row][0];
               for col in 1..cols {
                   dp[col] = dp[col].min(dp[col - 1]) + grid[row][col];
               }
           }

           dp[cols - 1]
       }
   }

按值接收 ``grid`` 会转移所有权；算法只借用内部行，不克隆或改写它们。

Go
~~

.. code-block:: go

   func minPathSum(grid [][]int) int {
       rows := len(grid)
       cols := len(grid[0])
       dp := make([]int, cols)

       dp[0] = grid[0][0]
       for col := 1; col < cols; col++ {
           dp[col] = dp[col-1] + grid[0][col]
       }

       for row := 1; row < rows; row++ {
           dp[0] += grid[row][0]
           for col := 1; col < cols; col++ {
               predecessor := dp[col]
               if dp[col-1] < predecessor {
                   predecessor = dp[col-1]
               }
               dp[col] = predecessor + grid[row][col]
           }
       }

       return dp[cols-1]
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function minPathSum(grid: number[][]): number {
       const rows = grid.length;
       const cols = grid[0].length;
       const dp: number[] = Array<number>(cols).fill(0);

       dp[0] = grid[0][0];
       for (let col = 1; col < cols; col += 1) {
           dp[col] = dp[col - 1] + grid[0][col];
       }

       for (let row = 1; row < rows; row += 1) {
           dp[0] += grid[row][0];
           for (let col = 1; col < cols; col += 1) {
               dp[col] = Math.min(dp[col], dp[col - 1])
                   + grid[row][col];
           }
       }

       return dp[cols - 1];
   }

最大中间和 ``79800`` 远小于安全整数上界，代码不使用位运算。

C#
~~

.. code-block:: csharp

   public class Solution {
       public int MinPathSum(int[][] grid) {
           int rows = grid.Length;
           int cols = grid[0].Length;
           int[] dp = new int[cols];

           dp[0] = grid[0][0];
           for (int col = 1; col < cols; ++col) {
               dp[col] = dp[col - 1] + grid[0][col];
           }

           for (int row = 1; row < rows; ++row) {
               dp[0] += grid[row][0];
               for (int col = 1; col < cols; ++col) {
                   dp[col] = System.Math.Min(dp[col], dp[col - 1])
                       + grid[row][col];
               }
           }

           return dp[cols - 1];
       }
   }

Julia
~~~~~

.. code-block:: julia

   function min_path_sum(grid::Matrix{Int})::Int
       rows, cols = size(grid)
       dp = zeros(Int, cols)

       dp[1] = grid[1, 1]
       for col in 2:cols
           dp[col] = dp[col - 1] + grid[1, col]
       end

       for row in 2:rows
           dp[1] += grid[row, 1]
           for col in 2:cols
               dp[col] = min(dp[col], dp[col - 1]) + grid[row, col]
           end
       end

       return dp[cols]
   end

当 ``rows == 1`` 或 ``cols == 1`` 时，Julia 的 ``2:1`` 是空 ``UnitRange``，对应循环自然跳过。

R
~

.. code-block:: r

   min_path_sum <- function(grid) {
     rows <- nrow(grid)
     cols <- ncol(grid)
     dp <- numeric(cols)

     dp[1L] <- grid[1L, 1L]
     if (cols > 1L) {
       for (col in seq.int(2L, cols)) {
         dp[col] <- dp[col - 1L] + grid[1L, col]
       }
     }

     if (rows > 1L) {
       for (row in seq.int(2L, rows)) {
         dp[1L] <- dp[1L] + grid[row, 1L]
         if (cols > 1L) {
           for (col in seq.int(2L, cols)) {
             dp[col] <- min(dp[col], dp[col - 1L]) + grid[row, col]
           }
         }
       }
     }

     dp[cols]
   }

R 不能直接使用 ``2:rows`` 或 ``2:cols`` 处理尺寸为 ``1`` 的情况，因此先判断后使用 ``seq.int``。

语言边界说明
------------

* C 的合法结果非负，分配失败使用 ``-1``，调用者可以与真实答案区分；
* C++、Python、Java、Go、TypeScript、C#、Julia 与 R 都只建立一维工作数组；
* Rust 消费外层向量所有权但不修改元素，不产生深拷贝；
* TypeScript 的所有加法保持安全整数语义；
* Julia 和 R 使用一基矩阵坐标，R 显式防止 ``2:1`` 生成逆向非空序列；
* 所有实现都把起点与终点数值计入路径和，并保持输入网格不变。

对照解法：原地改写网格
----------------------

可以直接把 ``grid[row][col]`` 改为到达该位置的最小路径和，从而把算法额外空间降为 ``O(1)``。转移与
主解法相同，时间仍为 ``O(mn)``。这种写法会永久覆盖输入数值；调用者若还需要原网格，就必须先复制
``O(mn)`` 数据，因此本题主实现选择只读输入和 ``O(n)`` 工作数组。

验证计划与证据
--------------

``运行验证``
   覆盖普通网格、单行、单列、单格、全零网格、较大单元值和不同最优转向位置。

``随机基准对拍``
   Python 对小尺寸随机非负网格使用独立递归枚举全部向右、向下路径并直接累计路径和，与滚动动态规划
   的最小值比较。

``编译验证``
   C 使用 C17、严格警告、AddressSanitizer 与 UndefinedBehaviorSanitizer；C++ 使用 C++17 严格警告和
   sanitizer；Java、Go、TypeScript 分别完成编译或严格类型检查。

``静态验证``
   Rust、C#、Julia、R 在当前环境缺少运行时，检查所有权、边界初始化、一基索引和数值上界，不宣称
   运行通过。

关键边界
--------

* 单格网格：答案就是唯一元素值；
* 单行或单列：没有选择，必须累加全部经过位置；
* 零值单元格：是合法代价，不能作为未初始化或不可达标记；
* 第一行、第一列只能从一个方向到达，不能使用两个前驱统一相加或取最小；
* 更新内部位置前，``dp[col]`` 必须仍代表上方，``dp[col - 1]`` 必须已代表左侧；
* 输入必须保持不变，不能把原地改写方案伪装成只读实现。

易错点
------

* 忘记计入起点或终点数值；
* 第一行从上方读取不存在的状态，或第一列从左方读取不存在的状态；
* 使用 ``0`` 作为无穷大哨兵，导致零值网格选择错误；
* 从右向左更新一维数组，使左侧状态仍属于上一行；
* 只证明“选择较小前驱”，没有证明最优前缀可以安全替换；
* R 使用 ``2:1``，在单行或单列输入上执行错误循环。

本题新增知识
------------

* 网格最小路径和由“最后一步来源分类 + 最优子结构”建立动态规划；
* 第一行和第一列的单一来源必须在初始化中明确表达；
* 非负权值和精确尺寸可以给出完整路径和上界，支撑十语言整数选择；
* 原地状态表虽然节省工作空间，却会改变输入契约和调用后状态。

本题强化知识
------------

* 0062、0063 的一维上方/左侧覆盖模型继续复用，只把加法计数改为取最小后累加代价；
* 0053 的最优子结构和滚动状态继续从线性数组扩展到网格；
* 0059 的矩阵容量与一基坐标边界继续强化；
* 复杂度继续区分输入副本、算法工作数组和标量返回值。

关联题目
--------

* `0062. Unique Paths <0062-unique-paths.rst>`_：两题使用相同上方/左侧网格状态，本题把路径数量转为
  最小累计代价。
* `0063. Unique Paths II <0063-unique-paths-ii.rst>`_：两题都在一维数组中同时读取上方旧状态和左侧
  新状态；0063 处理不可达，0064 处理最优代价。
* `0053. Maximum Subarray <0053-maximum-subarray.rst>`_：两题都只保留后续转移需要的最优状态，并证明
  次优前缀可以被最优前缀支配。

最小自检
--------

#. 为什么内部单元格只需比较上方和左方两个前驱？
#. 第一行与第一列为什么不能直接套用普通内部转移？
#. 更新 ``dp[col]`` 时两个候选分别保存在何处？
#. 题目约束如何推出 ``79800`` 的整数上界？
#. 原地改写网格会改变哪一项接口契约？

答案要点
~~~~~~~~

#. 合法移动只有向右和向下，最后一步来源只有两类。
#. 它们各自只有一个合法前驱，需要前缀累加初始化。
#. ``dp[col]`` 是上方旧状态，``dp[col - 1]`` 是左侧新状态。
#. 最长路径经过 ``200 + 200 - 1 = 399`` 个单元格，每个值至多 ``200``。
#. 调用后输入不再保存原始代价，若需要保留就必须额外复制整张网格。
