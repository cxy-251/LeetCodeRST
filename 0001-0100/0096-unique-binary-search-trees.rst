0096. Unique Binary Search Trees
================================

题目信息
--------

:题号: 0096
:难度: Medium
:主题: 动态规划、Catalan 数、二叉搜索树
:原题: `LeetCode 0096 <https://leetcode.com/problems/unique-binary-search-trees/>`_
:访问状态: Available
:教学重点: 节点数状态、根位置划分、左右计数乘法、64 位中间值

题目重述
--------

给定整数 ``n``，计算由 ``1..n`` 组成的结构不同二叉搜索树数量。题目保证 ``1 <= n <= 19``，答案
适合 32 位有符号整数。下面实现也自然支持 ``n = 0``，空树数量定义为 ``1``。

自建示例
--------

``n = 3`` 时答案为 ``5``。选择三个不同根位置后，左右节点数分别为 ``(0,2)``、``(1,1)``、
``(2,0)``，贡献 ``1×2 + 1×1 + 2×1 = 5``。

问题抽象
--------

BST 的具体键值不影响结构数量，只需记录节点数。定义：

.. code-block:: text

   counts[nodes] = 使用 nodes 个有序键能形成的不同 BST 数量

若根左侧有 ``left_nodes`` 个键，右侧就有 ``nodes-1-left_nodes`` 个键。任意左结构可以与任意右结构
组合，因此：

.. code-block:: text

   counts[nodes] += counts[left_nodes] * counts[right_nodes]

基础状态 ``counts[0] = 1`` 表示唯一空树选择。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 定位
   * - Catalan 动态规划
     - ``O(n^2)``
     - ``O(n)``
     - 主解法；转移与 BST 根划分直接对应
   * - Catalan 乘法公式
     - ``O(n)``
     - ``O(1)``
     - 更快，但需要更细致的整除与溢出证明
   * - 生成全部树后计数
     - ``Theta(n × C_n)``
     - ``Theta(n × C_n)``
     - 做了 `0095` 的全部构造工作

主解法：节点数 Catalan DP
------------------------

状态与遍历顺序
~~~~~~~~~~~~~~

外层按 ``nodes = 1..n`` 递增。计算 ``counts[nodes]`` 时，左右节点数都严格小于 ``nodes``，所需状态
已经完成。内层枚举 ``left_nodes = 0..nodes-1``，右侧节点数由总数唯一决定。

为什么使用乘法
~~~~~~~~~~~~~~

固定根位置后，左子树结构和右子树结构是独立选择。每个左结构都能与每个右结构组合，组合数量是两侧
数量的乘积。不同根位置对应不同左节点数量，所得结构集合互不重叠，因此再对全部根位置求和。

正确性依据
~~~~~~~~~~

**基础状态正确。** 空区间只有一种空树，它是叶节点组合时的单位元。

**转移合法。** 每个乘积项组合的左右结构分别使用更小和更大的键，挂到根下后一定是 BST。

**完整性。** 任意非空 BST 都有唯一根位置，对应唯一的左右节点数量，必然计入某个乘积项。

**无重复。** 不同根位置的根值不同；同一根位置下，不同左右结构对也产生不同整树。

**终止性。** 两层循环范围有限，且每个状态只依赖更小下标。

复杂度与数值边界
~~~~~~~~~~~~~~~~

* 状态数为 ``n+1``，每个状态枚举至多 ``n`` 个根位置，时间 ``O(n^2)``；
* DP 数组占 ``O(n)`` 空间；
* ``C_19 = 1767263190 < 2^31-1``；
* 固定宽语言使用 64 位数组或中间乘法，再按题目保证转换为 32 位返回值；
* TypeScript 的 ``number`` 可精确表示远大于本题范围的整数；
* R 使用双精度数值累加，最终值仍低于精确整数边界并转换为整数。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdint.h>

   int numTrees(int n) {
       int64_t counts[20] = {0};
       counts[0] = 1;

       for (int nodes = 1; nodes <= n; ++nodes) {
           for (int left_nodes = 0; left_nodes < nodes; ++left_nodes) {
               counts[nodes] +=
                   counts[left_nodes] * counts[nodes - 1 - left_nodes];
           }
       }
       return (int)counts[n];
   }

C++
~~~

.. code-block:: cpp

   #include <cstdint>
   #include <vector>

   class Solution {
   public:
       int numTrees(int n) {
           std::vector<std::int64_t> counts(n + 1, 0);
           counts[0] = 1;

           for (int nodes = 1; nodes <= n; ++nodes) {
               for (int leftNodes = 0; leftNodes < nodes; ++leftNodes) {
                   counts[nodes] +=
                       counts[leftNodes] * counts[nodes - 1 - leftNodes];
               }
           }
           return static_cast<int>(counts[n]);
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def numTrees(self, n: int) -> int:
           counts = [0] * (n + 1)
           counts[0] = 1

           for nodes in range(1, n + 1):
               for left_nodes in range(nodes):
                   counts[nodes] += (
                       counts[left_nodes]
                       * counts[nodes - 1 - left_nodes]
                   )
           return counts[n]

Java
~~~~

.. code-block:: java

   class Solution {
       public int numTrees(int n) {
           long[] counts = new long[n + 1];
           counts[0] = 1;

           for (int nodes = 1; nodes <= n; ++nodes) {
               for (int leftNodes = 0; leftNodes < nodes; ++leftNodes) {
                   counts[nodes] +=
                       counts[leftNodes] * counts[nodes - 1 - leftNodes];
               }
           }
           return (int)counts[n];
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn num_trees(n: i32) -> i32 {
           let n = n as usize;
           let mut counts = vec![0i64; n + 1];
           counts[0] = 1;

           for nodes in 1..=n {
               for left_nodes in 0..nodes {
                   counts[nodes] +=
                       counts[left_nodes] * counts[nodes - 1 - left_nodes];
               }
           }
           counts[n] as i32
       }
   }

Go
~~

.. code-block:: go

   func numTrees(n int) int {
       counts := make([]int64, n+1)
       counts[0] = 1

       for nodes := 1; nodes <= n; nodes++ {
           for leftNodes := 0; leftNodes < nodes; leftNodes++ {
               counts[nodes] +=
                   counts[leftNodes] * counts[nodes-1-leftNodes]
           }
       }
       return int(counts[n])
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function numTrees(n: number): number {
       const counts = new Array<number>(n + 1).fill(0);
       counts[0] = 1;

       for (let nodes = 1; nodes <= n; nodes += 1) {
           for (let leftNodes = 0; leftNodes < nodes; leftNodes += 1) {
               counts[nodes] +=
                   counts[leftNodes] * counts[nodes - 1 - leftNodes];
           }
       }
       return counts[n];
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int NumTrees(int n) {
           long[] counts = new long[n + 1];
           counts[0] = 1;

           for (int nodes = 1; nodes <= n; ++nodes) {
               for (int leftNodes = 0; leftNodes < nodes; ++leftNodes) {
                   counts[nodes] +=
                       counts[leftNodes] * counts[nodes - 1 - leftNodes];
               }
           }
           return (int)counts[n];
       }
   }

Julia
~~~~~

.. code-block:: julia

   function num_trees(n::Int)::Int
       counts = zeros(Int, n + 1)
       counts[1] = 1

       for nodes in 1:n
           for left_nodes in 0:(nodes - 1)
               counts[nodes + 1] +=
                   counts[left_nodes + 1] * counts[nodes - left_nodes]
           end
       end
       return counts[n + 1]
   end

R
~

.. code-block:: r

   num_trees <- function(n) {
     counts <- numeric(n + 1L)
     counts[1L] <- 1

     for (nodes in seq_len(n)) {
       for (left_nodes in seq.int(0L, nodes - 1L)) {
         counts[nodes + 1L] <- counts[nodes + 1L] +
           counts[left_nodes + 1L] * counts[nodes - left_nodes]
       }
     }
     as.integer(counts[n + 1L])
   }

验证计划与证据
--------------

对 ``n = 0..19`` 逐项检查已知 Catalan 序列：

.. code-block:: text

   1, 1, 2, 5, 14, 42, 132, 429, 1430, 4862,
   16796, 58786, 208012, 742900, 2674440, 9694845,
   35357670, 129644790, 477638700, 1767263190

并检查 ``numTrees(5)`` 与 `0095` 实际生成树数量一致。C、C++ 使用严格警告、ASan 和 UBSan；Java、
Go、TypeScript 完成编译运行。其余四种语言完成索引和数值宽度静态检查。

易错点
------

* 把 ``counts[0]`` 设为 ``0`` 会让所有叶节点组合贡献消失；
* 左右节点数之和必须是 ``nodes-1``，根本身占用一个节点；
* 只相加左右数量而不是相乘，会忽略独立组合；
* 使用 32 位中间变量依赖隐含边界，统一使用 64 位更稳妥；
* Julia、R 的数组下标需要把零节点状态映射到第一个槽位。

本题新增知识
------------

* BST 结构计数的 Catalan 递推；
* 固定根位置后左右结构独立相乘；
* 空树计数作为组合单位元。

本题强化知识
------------

* 与 `0095` 相同的根值分治，只保留数量状态；
* 动态规划的状态充分性、初始化、转移和遍历顺序；
* 固定宽语言的中间值类型证明。

关联题目
--------

* `0095. Unique Binary Search Trees II <0095-unique-binary-search-trees-ii.rst>`_：显式生成被本题计数的全部树；
* `0070. Climbing Stairs <0070-climbing-stairs.rst>`_：较简单的一维计数动态规划。

最小自检
--------

#. 为什么状态只需要节点数，不需要记录具体键值？
#. 为什么 ``counts[0]`` 必须等于一？
#. 固定根位置后为什么贡献是左右计数的乘积？
#. 为什么外层必须按节点数递增？

答案要点
~~~~~~~~

#. 有序键经过相对次序保持的重命名后，BST 结构不变。
#. 空子树是一种合法且唯一的选择，是组合乘法单位元。
#. 左右结构可独立任选，使用笛卡尔积计数。
#. 当前状态只依赖更少节点的状态，递增顺序保证它们已经计算。
