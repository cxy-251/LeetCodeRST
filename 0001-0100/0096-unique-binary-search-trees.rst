0096. Unique Binary Search Trees
================================

题目信息
--------

:题号: 0096
:难度: Medium
:主题: 动态规划、Catalan 数、二叉搜索树
:原题: `LeetCode 0096 <https://leetcode.com/problems/unique-binary-search-trees/>`_
:重点: ``1..n`` 全部使用、根节点划分、左右结构乘法、总数计算

题目重述
--------

给定整数 ``n``，计算由数值 ``1..n`` 各使用一次可以构成多少棵结构不同的二叉搜索树。只返回数量，不需要构造具体树。

约束为 ``1 <= n <= 19``。

自建示例
--------

.. code-block:: text

   输入：n = 4
   输出：14

依次选择 1、2、3、4 为根时，左右子树数量乘积分别为 ``1*5``、``1*2``、``2*1``、``5*1``，总数为 ``14``。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       long long plainRecursion(int nodes) {
           if (nodes <= 1) return 1;
           long long total = 0;
           for (int left_nodes = 0; left_nodes < nodes; ++left_nodes)
               total += plainRecursion(left_nodes) *
                        plainRecursion(nodes - 1 - left_nodes);
           return total;
       }

       int dynamicProgramming(int n) {
           std::vector<long long> count(n + 1);
           count[0] = 1;
           for (int nodes = 1; nodes <= n; ++nodes)
               for (int left_nodes = 0; left_nodes < nodes; ++left_nodes)
                   count[nodes] += count[left_nodes] *
                                   count[nodes - 1 - left_nodes];
           return static_cast<int>(count[n]);
       }

       int catalanFormula(int n) {
           long long value = 1;
           for (int k = 0; k < n; ++k)
               value = value * 2 * (2 * k + 1) / (k + 2);
           return static_cast<int>(value);
       }

   public:
       int numTrees(int n) {
           return dynamicProgramming(n);
       }
   };

题解
----

为什么具体键值不影响结构数
~~~~~~~~~~~~~~~~~~~~~~~~

BST 中序遍历严格递增。对于任意 ``nodes`` 个互异有序键，只要保持相对大小关系，相同树形会得到唯一合法标号。因此状态不需要记录区间起点，只需记录节点数量。

固定根后如何拆分
~~~~~~~~~~~~~~~~

若根在有序序列中的位置使左侧有 ``left_nodes`` 个键，则右侧有 ``nodes-1-left_nodes`` 个键。左结构和右结构独立选择，每个左树都能与每个右树组合，因此该根位置贡献两侧数量的乘积。

.. code-block:: text

   count[nodes] = sum(
       count[left_nodes] * count[nodes-1-left_nodes]
   )

空树为何计数为一
~~~~~~~~~~~~~~~~

``count[0]=1`` 表示唯一的“空子树选择”。叶节点左右都为空，它的贡献是 ``1*1``。若把空树数量设为 0，所有包含空侧的合法 BST 都无法生成。

状态演化
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 节点数
     - 根位置贡献
     - ``count``
   * - 0
     - 空树
     - 1
   * - 1
     - ``1*1``
     - 1
   * - 2
     - ``1*1 + 1*1``
     - 2
   * - 3
     - ``1*2 + 1*1 + 2*1``
     - 5

为什么按节点数递增填表
~~~~~~~~~~~~~~~~~~~~~~

计算 ``count[nodes]`` 时，两侧节点数都小于 ``nodes``，因此外层从 1 到 ``n`` 递增后，所有依赖已经完成。每个状态只写一次，不会像裸递归那样反复计算相同节点数。

为什么不重不漏
~~~~~~~~~~~~~~

任意非空 BST 有唯一根位置，决定唯一左右节点数，因此必计入某一项。固定根后，任意左右结构对产生唯一整树；不同根位置或不同结构对不可能产生相同树，所以各乘积项互不重叠。

Catalan 公式的取舍
~~~~~~~~~~~~~~~~

该递推正是 Catalan 数，可用 ``C_(k+1)=C_k*2*(2k+1)/(k+2)`` 在线性时间计算。整除在数学上成立，但固定宽实现需要谨慎安排乘除和溢出；DP 与 BST 根划分直接对应，更适合作为主解法。

复杂度来源
~~~~~~~~~~

裸递归指数级。DP 有 ``n`` 个状态，每个状态枚举 ``O(n)`` 个根位置，时间 ``O(n²)``、空间 ``O(n)``。乘法公式时间 ``O(n)``、空间 ``O(1)``。

九语言实现
----------

C
~

.. code-block:: c

   int numTrees(int n){long long dp[20]={0};dp[0]=1;for(int nodes=1;nodes<=n;nodes++)for(int left=0;left<nodes;left++)dp[nodes]+=dp[left]*dp[nodes-1-left];return(int)dp[n];}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def numTrees(self, n: int) -> int:
           dp = [0] * (n + 1); dp[0] = 1
           for nodes in range(1, n + 1):
               for left in range(nodes):
                   dp[nodes] += dp[left] * dp[nodes - 1 - left]
           return dp[n]

Java
~~~~

.. code-block:: java

   class Solution {public int numTrees(int n){long[]dp=new long[n+1];dp[0]=1;for(int nodes=1;nodes<=n;nodes++)for(int left=0;left<nodes;left++)dp[nodes]+=dp[left]*dp[nodes-1-left];return(int)dp[n];}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn num_trees(n:i32)->i32{let n=n as usize;let mut dp=vec![0i64;n+1];dp[0]=1;for nodes in 1..=n{for left in 0..nodes{dp[nodes]+=dp[left]*dp[nodes-1-left];}}dp[n]as i32}}

Go
~~

.. code-block:: go

   func numTrees(n int)int{dp:=make([]int64,n+1);dp[0]=1;for nodes:=1;nodes<=n;nodes++{for left:=0;left<nodes;left++{dp[nodes]+=dp[left]*dp[nodes-1-left]}};return int(dp[n])}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function numTrees(n:number):number{const dp=Array(n+1).fill(0);dp[0]=1;for(let nodes=1;nodes<=n;nodes++)for(let left=0;left<nodes;left++)dp[nodes]+=dp[left]*dp[nodes-1-left];return dp[n];}

C#
~~

.. code-block:: csharp

   public class Solution {public int NumTrees(int n){long[]dp=new long[n+1];dp[0]=1;for(int nodes=1;nodes<=n;nodes++)for(int left=0;left<nodes;left++)dp[nodes]+=dp[left]*dp[nodes-1-left];return(int)dp[n];}}

Julia
~~~~~

.. code-block:: julia

   function num_trees(n::Int)
       dp=zeros(Int64,n+1);dp[1]=1
       for nodes in 1:n,left in 0:nodes-1;dp[nodes+1]+=dp[left+1]*dp[nodes-left];end
       Int(dp[n+1])
   end

R
~

.. code-block:: r

   num_trees <- function(n){dp<-numeric(n+1L);dp[[1L]]<-1;for(nodes in seq_len(n))for(left in 0:(nodes-1L))dp[[nodes+1L]]<-dp[[nodes+1L]]+dp[[left+1L]]*dp[[nodes-left]];as.integer(dp[[n+1L]])}
