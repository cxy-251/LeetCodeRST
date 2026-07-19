
0120. Triangle
==============

题目信息
--------

:题号: 0120
:难度: Medium
:主题: 动态规划、三角形数组、最短路径、滚动数组
:原题: `LeetCode 0120 <https://leetcode.com/problems/triangle/>`_
:访问状态: Available
:教学重点: 后缀最优状态、相邻孩子选择、自底向上覆盖、输入只读适配

题目重述
--------

给定一个三角形整数数组。第 ``row`` 行有 ``row + 1`` 个元素。
从顶点开始，每一步从位置 ``(row, column)`` 只能走到下一行的
``(row + 1, column)`` 或 ``(row + 1, column + 1)``。返回到达最后一行的最小路径和。

三角形行数在 1 到 200 之间，节点值可为负数。本文实现只读输入三角形，
使用最后一行的副本作为工作数组，不把中间结果写回调用者容器。

自建示例
--------

普通三角形
~~~~~~~~~~

.. code-block:: text

        2
       3 4
      6 5 7
     4 1 8 3

   最小路径：2 -> 3 -> 5 -> 1
   输出：11

包含负数
~~~~~~~~

.. code-block:: text

       -1
       2  3
      1 -5 4

   最小路径：-1 -> 2 -> -5
   输出：-4

负数存在时不能使用“当前和已经较大就剪枝”的贪心规则。

单行
~~~~

``triangle = [[-10]]`` 时直接返回 ``-10``。

局部较小不等于全局最优
~~~~~~~~~~~~~~~~~~~~~~

若顶点下一行左值比右值小，左分支后续可能连接极大值。只比较当前下一步数值的贪心会失败，
必须比较从两个孩子到底部的完整最优代价。

问题抽象
--------

定义后缀状态：

.. code-block:: text

   best(row, column) =
       从位置 (row, column) 出发到最后一行的最小路径和

最后一行没有后续选择：

.. code-block:: text

   best(last, column) = triangle[last][column]

其余位置只有两个合法孩子：

.. code-block:: text

   best(row, column) = triangle[row][column]
       + min(
           best(row + 1, column),
           best(row + 1, column + 1)
         )

当前行只依赖下一行，因此可以只保存一行状态并从底向上覆盖。

基础类型约定
------------

输入是行长逐次增加 1 的二维整数容器。本文把输入视为只读。
工作数组初始复制最后一行，长度等于总行数。

C 使用 ``triangleColSize`` 读取真实行宽，并用 ``long long`` 工作数组；
C++、Java、C# 同样用较宽中间类型。题目范围下最终结果适合平台 ``int`` 返回类型。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 定位
   * - 自底向上一行 DP
     - ``O(N)``
     - ``O(r)``
     - 主解法；无递归且输入只读
   * - 自顶向下二维 DP
     - ``O(N)``
     - ``O(N)``
     - 需要处理每行左右边界
   * - 记忆化递归
     - ``O(N)``
     - ``O(N)`` 缓存加 ``O(r)`` 栈
     - 状态直观，依赖递归深度
   * - 朴素枚举所有路径
     - ``O(2^r)``
     - ``O(r)`` 路径
     - 重复计算相同后缀

这里 ``r`` 是行数，``N = r * (r + 1) / 2`` 是元素总数。

主解法：自底向上一行 DP
-----------------------

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

先令 ``dp`` 等于最后一行的副本。处理完原三角形第 ``row + 1`` 行到末行后，
进入第 ``row`` 轮时保持：

* 对所有 ``0 <= column <= row + 1``，``dp[column]`` 等于
  ``best(row + 1, column)``；
* ``dp`` 的右侧未使用槽位不会影响当前行；
* 输入三角形未修改；
* 当前轮只读取 ``dp[column]`` 与 ``dp[column + 1]``，再写回 ``dp[column]``。

当前行从左到右或从右到左都可以，因为更新 ``dp[column]`` 不会成为同一行其他位置的孩子：

* 处理 ``column + 1`` 时读取的是 ``dp[column + 1]`` 和 ``dp[column + 2]``；
* 处理 ``column - 1`` 时读取的是 ``dp[column - 1]`` 和 ``dp[column]``，
  若从左到右，后者尚未更新；本文统一从左到右。

因此转移为：

.. code-block:: text

   dp[column] = triangle[row][column]
       + min(dp[column], dp[column + 1])

处理到顶点后，``dp[0]`` 就是答案。

为什么自底向上更自然
~~~~~~~~~~~~~~~~~~~~

从顶点向下时，一个位置可能由左上和右上两个父位置到达，需要在行边界分别处理来源。
从底向上时，每个非底层位置始终恰好有两个孩子，转移公式统一，
最后一行又天然提供基础状态。

为什么不能只选较小孩子节点值
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

合法决策应比较两个孩子的完整后缀最优代价，而不是孩子自身数值。
``dp[column]`` 已经把该孩子到底部的全部未来选择压缩成一个数，
所以局部取较小 ``dp`` 才满足最优子结构。

输入只读与工作副本
~~~~~~~~~~~~~~~~~~

可以把 DP 直接写入 ``triangle`` 最后一行或原位置，但这会改变调用者可观察的输入。
本文复制最后一行：

* 工作空间为 ``O(r)``；
* 输入保持原样，便于调用后复用和验证；
* 返回值只是一项整数，没有输出载荷需要排除。

正确性依据
~~~~~~~~~~

对 ``row`` 从底向上归纳。

**基础情况。** 最后一行的任意位置已经到达终点，唯一合法路径只包含自身。
初始化 ``dp[column] = triangle[last][column]``，等于对应 ``best``。

**归纳步骤。** 假设 ``dp[column]`` 与 ``dp[column + 1]`` 分别等于当前节点两个孩子的
最小后缀和。任何从当前节点到底部的路径第一步必须进入其中一个孩子；
选择较小后缀并加上当前值，得到所有合法路径中的最小值。因此更新后的
``dp[column]`` 等于 ``best(row, column)``。

**完整性。** 两个孩子覆盖题目允许的全部下一步，没有遗漏其他合法路径。

**最优性。** 若存在更小路径，它的第一步必落在某个孩子；该孩子后缀不会小于归纳假设中的
最小后缀，矛盾。

**终止性。** 行号每轮减一，有限行最终处理到第 0 行。

复杂度与语言边界
~~~~~~~~~~~~~~~~

* 每个非底层元素执行一次转移，时间 ``O(N)``；
* 工作数组长度为最后一行宽度 ``r``，额外空间 ``O(r)``；
* 没有返回容器，返回载荷 ``O(1)``；
* 输入复制只发生在最后一行，属于上述 ``O(r)`` 工作空间；
* C、C++、Java、C# 使用较宽中间类型，避免路径加法边界依赖平台 ``int``；
* C 的整数接口无法单独报告分配失败，分配失败时返回 0，调用协议应在生产环境另行设计；
* Rust 按值取得输入所有权，但算法逻辑不修改行内容；
* Julia/R 的下降行序列必须显式使用负步长并处理单行空循环。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stddef.h>
   #include <stdlib.h>

   int minimumTotal(
       int **triangle,
       int triangleSize,
       int *triangleColSize
   ) {
       if (triangleSize <= 0) {
           return 0;
       }

       const int width = triangleColSize[triangleSize - 1];
       long long *dp = malloc((size_t)width * sizeof(*dp));
       if (dp == NULL) {
           return 0;
       }

       for (int column = 0; column < width; ++column) {
           dp[column] = triangle[triangleSize - 1][column];
       }

       for (int row = triangleSize - 2; row >= 0; --row) {
           for (int column = 0; column < triangleColSize[row]; ++column) {
               const long long best_child =
                   dp[column] < dp[column + 1]
                       ? dp[column]
                       : dp[column + 1];
               dp[column] = triangle[row][column] + best_child;
           }
       }

       const int answer = (int)dp[0];
       free(dp);
       return answer;
   }

C 使用 ``long long`` 保存中间路径和，分配失败时整数返回接口无法区分合法 0 与失败，本文按平台惯例返回 0 并在正文明确该限制。

C++
~~~

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   public:
       int minimumTotal(std::vector<std::vector<int>>& triangle) {
           std::vector<long long> dp(
               triangle.back().begin(),
               triangle.back().end()
           );

           for (int row = static_cast<int>(triangle.size()) - 2;
                row >= 0;
                --row) {
               for (int column = 0; column <= row; ++column) {
                   dp[column] = triangle[row][column]
                       + std::min(dp[column], dp[column + 1]);
               }
           }

           return static_cast<int>(dp[0]);
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def minimumTotal(self, triangle: list[list[int]]) -> int:
           dp = triangle[-1].copy()

           for row in range(len(triangle) - 2, -1, -1):
               for column in range(row + 1):
                   dp[column] = (
                       triangle[row][column]
                       + min(dp[column], dp[column + 1])
                   )

           return dp[0]

Java
~~~~

.. code-block:: java

   import java.util.List;

   class Solution {
       public int minimumTotal(List<List<Integer>> triangle) {
           int last = triangle.size() - 1;
           long[] dp = new long[triangle.get(last).size()];
           for (int column = 0; column < dp.length; ++column) {
               dp[column] = triangle.get(last).get(column);
           }

           for (int row = last - 1; row >= 0; --row) {
               for (int column = 0; column <= row; ++column) {
                   dp[column] = triangle.get(row).get(column)
                       + Math.min(dp[column], dp[column + 1]);
               }
           }

           return (int)dp[0];
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn minimum_total(triangle: Vec<Vec<i32>>) -> i32 {
           let mut dp: Vec<i64> = triangle
               .last()
               .expect("triangle is non-empty")
               .iter()
               .map(|&value| i64::from(value))
               .collect();

           for row in (0..triangle.len() - 1).rev() {
               for column in 0..=row {
                   dp[column] = i64::from(triangle[row][column])
                       + dp[column].min(dp[column + 1]);
               }
           }

           dp[0] as i32
       }
   }

Rust 平台签名按值接收二维向量；代码只读其内容，但调用边界已经取得所有权。

Go
~~

.. code-block:: go

   func minimumTotal(triangle [][]int) int {
       last := len(triangle) - 1
       dp := append([]int(nil), triangle[last]...)

       for row := last - 1; row >= 0; row-- {
           for column := 0; column <= row; column++ {
               bestChild := dp[column]
               if dp[column+1] < bestChild {
                   bestChild = dp[column+1]
               }
               dp[column] = triangle[row][column] + bestChild
           }
       }

       return dp[0]
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function minimumTotal(triangle: number[][]): number {
       const dp = triangle[triangle.length - 1].slice();

       for (let row = triangle.length - 2; row >= 0; row -= 1) {
           for (let column = 0; column <= row; column += 1) {
               dp[column] = (
                   triangle[row][column]
                   + Math.min(dp[column], dp[column + 1])
               );
           }
       }

       return dp[0];
   }

C#
~~

.. code-block:: csharp

   using System;
   using System.Collections.Generic;

   public class Solution {
       public int MinimumTotal(IList<IList<int>> triangle) {
           int last = triangle.Count - 1;
           long[] dp = new long[triangle[last].Count];
           for (int column = 0; column < dp.Length; ++column) {
               dp[column] = triangle[last][column];
           }

           for (int row = last - 1; row >= 0; --row) {
               for (int column = 0; column <= row; ++column) {
                   dp[column] = triangle[row][column]
                       + Math.Min(dp[column], dp[column + 1]);
               }
           }

           return (int)dp[0];
       }
   }

Julia
~~~~~

.. code-block:: julia

   function minimum_total(triangle::Vector{Vector{Int}})::Int
       dp = copy(triangle[end])

       for row in (length(triangle) - 1):-1:1
           for column in 1:row
               dp[column] = triangle[row][column] +
                   min(dp[column], dp[column + 1])
           end
       end

       return dp[1]
   end

下降行范围显式写成负步长；当三角形只有一行时，起点为 0，范围为空。

R
~

.. code-block:: r

   minimum_total <- function(triangle) {
     dp <- as.numeric(triangle[[length(triangle)]])

     if (length(triangle) >= 2L) {
       rows <- seq.int(length(triangle) - 1L, 1L, by = -1L)
       for (row in rows) {
         for (column in seq_len(row)) {
           dp[column] <- triangle[[row]][column] +
             min(dp[column], dp[column + 1L])
         }
       }
     }

     dp[1L]
   }

R 在至少两行时才构造下降序列，避免 ``seq.int`` 的方向参数与端点冲突。

验证计划与证据
--------------

* 固定用例覆盖单行、全正数、全负数、混合符号、局部贪心失败和多条同值路径；
* 对小行数枚举全部 ``2^(r-1)`` 根到底路径，作为独立基准；
* 随机生成合法三角形，比较一行 DP 与穷举结果；
* 调用前后深比较输入，确认没有被修改；
* Python 执行 3000 组随机小三角形；
* C/C++、Java、Go、TypeScript 执行固定与 500 组随机对拍，C/C++ 使用 sanitizers；
* Rust、C#、Julia、R 缺少运行时时，记录索引、下降区间、数值宽度和接口静态检查。

关键边界
--------

* 单行时没有转移，直接返回底行副本首项；
* 每个位置的两个孩子下标是 ``column`` 与 ``column + 1``；
* 节点值可为负，不能按当前和做单调剪枝；
* 工作数组必须复制底行，不能与输入行共享后再声称输入只读；
* C 必须使用真实行宽，不能假设外部二维数组连续存储。

易错点
------

* 使用贪心选择数值较小的直接孩子；
* 把右孩子写成 ``column - 1`` 或越过行边界；
* 自顶向下时没有分别处理左右边界；
* 直接修改输入，却在正文和验证中声称只读；
* 只计算完整二维表，却仍声称空间 ``O(r)``；
* Julia/R 对单行输入构造错误方向的下降序列。

本题新增知识
------------

* 三角形路径的后缀最优状态；
* 自底向上使每个位置统一拥有两个合法孩子；
* 一行 DP 可以把下一行后缀最优值原地压缩；
* 输入只读契约需要显式复制工作底行。

本题强化知识
------------

* 动态规划方向由依赖关系和边界复杂度共同决定；
* 滚动数组的覆盖安全要检查同一轮读写关系；
* 负数输入排除基于单调性的贪心剪枝；
* 复杂度区分输入适配、工作数组与返回载荷。

关联题目
--------

* `0119. Pascal's Triangle II <0119-pascals-triangle-ii.rst>`_：同样复用一维相邻状态；
* `0064. Minimum Path Sum <../0001-0100/0064-minimum-path-sum.rst>`_：矩形网格最短路径 DP；
* `0070. Climbing Stairs <../0001-0100/0070-climbing-stairs.rst>`_：最小状态依赖的滚动压缩。

最小自检
--------

#. ``dp[column]`` 在处理第 ``row`` 行前表示什么？
#. 为什么比较直接孩子值不够？
#. 为什么本文复制最后一行而不直接修改输入？

答案要点
--------

#. 它表示从下一行位置 ``(row + 1, column)`` 到底部的最小后缀路径和。
#. 孩子之后仍有多步选择，应比较完整后缀最优代价。
#. 保持输入只读，同时只需 ``O(r)`` 工作空间。
