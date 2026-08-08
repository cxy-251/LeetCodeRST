0070. Climbing Stairs
=====================

题目信息
--------

:题号: 0070. 爬楼梯
:难度: Easy
:主题: 动态规划、计数、斐波那契、矩阵快速幂
:原题: `LeetCode 0070 <https://leetcode.com/problems/climbing-stairs/>`_
:重点: 从枚举步长序列，推导到只保留相邻两个方案数，再用矩阵快速幂加速状态推进

题目重述
--------

共有 ``n`` 级楼梯。每次只能向上走 1 级或 2 级，需要返回恰好到达第 ``n`` 级的不同走法数量。

走法由完整步长序列决定。只要两个序列中至少一个位置选择的步长不同，就视为两种不同走法。

约束条件：

* ``1 <= n <= 45``。

自建示例
--------

* ``n = 1``：只有 ``1``，返回 ``1``；
* ``n = 4``：走法为 ``1+1+1+1``、``1+1+2``、``1+2+1``、``2+1+1`` 和 ``2+2``，返回 ``5``；
* ``n = 6``：到达第 6 级的方案数为到达第 5 级与第 4 级的方案数之和，即 ``8 + 5 = 13``；
* ``n = 45``：返回 ``1836311903``，仍位于 32 位有符号整数范围内。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       struct Matrix {
           long long a00;
           long long a01;
           long long a10;
           long long a11;
       };

       int plainRecursion(int step) {
           if (step <= 2) {
               return step;
           }
           return plainRecursion(step - 1) + plainRecursion(step - 2);
       }

       int memoDfs(int step, std::vector<int>& memo) {
           if (step <= 2) {
               return step;
           }
           if (memo[step] != 0) {
               return memo[step];
           }
           memo[step] = memoDfs(step - 1, memo) + memoDfs(step - 2, memo);
           return memo[step];
       }

       int memoizedRecursion(int n) {
           std::vector<int> memo(n + 1, 0);
           return memoDfs(n, memo);
       }

       int tableDp(int n) {
           if (n <= 2) {
               return n;
           }
           std::vector<int> ways(n + 1, 0);
           ways[1] = 1;
           ways[2] = 2;
           for (int step = 3; step <= n; ++step) {
               ways[step] = ways[step - 1] + ways[step - 2];
           }
           return ways[n];
       }

       int rollingDp(int n) {
           if (n <= 2) {
               return n;
           }
           int previousTwo = 1;
           int previousOne = 2;
           for (int step = 3; step <= n; ++step) {
               const int current = previousOne + previousTwo;
               previousTwo = previousOne;
               previousOne = current;
           }
           return previousOne;
       }

       Matrix multiply(const Matrix& left, const Matrix& right) {
           return {
               left.a00 * right.a00 + left.a01 * right.a10,
               left.a00 * right.a01 + left.a01 * right.a11,
               left.a10 * right.a00 + left.a11 * right.a10,
               left.a10 * right.a01 + left.a11 * right.a11
           };
       }

       Matrix power(Matrix base, int exponent) {
           Matrix result{1, 0, 0, 1};
           while (exponent > 0) {
               if ((exponent & 1) != 0) {
                   result = multiply(result, base);
               }
               base = multiply(base, base);
               exponent >>= 1;
           }
           return result;
       }

       int matrixPower(int n) {
           if (n <= 2) {
               return n;
           }
           const Matrix transition{1, 1, 1, 0};
           const Matrix factor = power(transition, n - 2);
           return static_cast<int>(factor.a00 * 2 + factor.a01);
       }

   public:
       int climbStairs(int n) {
           return rollingDp(n);
       }
   };

题解
----

最后一步分类
~~~~~~~~~~~~

设 ``ways(step)`` 表示恰好到达第 ``step`` 级的走法数量。任意完整走法的最后一步只有两种可能：

* 从第 ``step - 1`` 级走 1 级；
* 从第 ``step - 2`` 级走 2 级。

删除最后一步后，两类走法分别与到达 ``step - 1`` 和 ``step - 2`` 的走法一一对应。两类由最后步长区分，互不重叠，并覆盖全部合法走法，因此：

.. code-block:: text

   ways(step) = ways(step - 1) + ways(step - 2)

基础状态为 ``ways(1) = 1`` 和 ``ways(2) = 2``。也可以定义 ``ways(0) = 1``，表示尚未迈步的空序列，此时同一转移从第 2 级开始成立。

递归搜索树
~~~~~~~~~~

``plainRecursion`` 直接按照最后一步分类递归计算。它准确表达了问题结构，但同一个级数会在不同分支中被反复求解。

例如计算 ``ways(5)`` 时，``ways(3)`` 同时出现在 ``ways(4)`` 与 ``ways(3)`` 两条分支中。随着 ``n`` 增大，重复子树快速增长，朴素递归的时间复杂度达到指数级。

状态结果复用
~~~~~~~~~~~~

``memoizedRecursion`` 为每个级数保存一次计算结果。第一次访问 ``ways(step)`` 时继续递归，之后再次访问同一状态时直接返回缓存值。

级数只可能位于 ``1`` 到 ``n``，因此最多计算 ``n`` 个不同状态。记忆化保留递归结构，同时把时间复杂度降为线性；代价是保存 ``O(n)`` 个结果以及递归调用栈。

自底向上填表
~~~~~~~~~~~~

递推只依赖更小级数，所以可以按 ``3, 4, ..., n`` 的顺序主动计算。``tableDp`` 使用 ``ways[step]`` 保存每一级的方案数，不再需要递归调用。

以 ``n = 6`` 为例：

.. list-table::
   :header-rows: 1

   * - ``step``
     - ``ways(step - 2)``
     - ``ways(step - 1)``
     - ``ways(step)``
   * - 3
     - 1
     - 2
     - 3
   * - 4
     - 2
     - 3
     - 5
   * - 5
     - 3
     - 5
     - 8
   * - 6
     - 5
     - 8
     - 13

填表顺序保证计算当前状态时，它依赖的两个状态已经完成。

滚动状态
~~~~~~~~

计算 ``ways(step)`` 只需要 ``ways(step - 1)`` 与 ``ways(step - 2)``。当前值生成后，更早的状态不会再参与后续转移，因此完整数组可以压缩为两个变量：

* ``previousTwo`` 保存 ``ways(step - 2)``；
* ``previousOne`` 保存 ``ways(step - 1)``；
* ``current`` 保存两者之和。

更新时先计算 ``current``，再把旧的 ``previousOne`` 移到 ``previousTwo``，最后把 ``current`` 写入 ``previousOne``。这个顺序避免在使用旧状态之前将其覆盖。

``rollingDp`` 与表格 DP 执行相同的状态转移，时间仍为 ``O(n)``，工作空间降为 ``O(1)``。公开入口选择这一方法，因为题目规模下它已经足够快，且状态含义直接。

矩阵状态推进
~~~~~~~~~~~~

递推可以写成矩阵形式：

.. code-block:: text

   [ways(step)    ]   [1 1] [ways(step - 1)]
   [ways(step - 1)] = [1 0] [ways(step - 2)]

因此：

.. code-block:: text

   [ways(n)    ]             [ways(2)]
   [ways(n - 1)] = T^(n - 2) [ways(1)]

其中 ``T = [[1, 1], [1, 0]]``。``matrixPower`` 使用二进制快速幂计算 ``T^(n - 2)``，把状态推进次数从 ``O(n)`` 降为 ``O(log n)``。

矩阵元素使用 ``long long`` 完成中间乘法。题目保证 ``n <= 45``，最终答案不超过 ``1836311903``，转换回 ``int`` 安全。

方法关系
~~~~~~~~

五种实现使用同一个最后一步递推，差异只在状态的计算与保存方式：

* 朴素递归重复展开相同子问题；
* 记忆化递归缓存每个级数；
* 表格 DP 按级数顺序计算全部状态；
* 滚动 DP 只保留当前转移需要的两个状态；
* 矩阵快速幂把多次相同线性转移合并为幂运算。

复杂度分析
~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
   * - 朴素递归
     - ``O(2^n)``
     - ``O(n)`` 调用栈
   * - 记忆化递归
     - ``O(n)``
     - ``O(n)``
   * - 表格 DP
     - ``O(n)``
     - ``O(n)``
   * - 滚动 DP
     - ``O(n)``
     - ``O(1)``
   * - 矩阵快速幂
     - ``O(log n)``
     - ``O(1)``

边界处理
~~~~~~~~

* ``n = 1`` 时直接返回 ``1``；
* ``n = 2`` 时直接返回 ``2``，无需进入递推循环；
* 滚动循环从第 3 级开始，两个变量始终对应连续的前置状态；
* 矩阵方法对 ``n <= 2`` 单独返回，避免出现负指数；
* 约束上界确保所有答案均可由 ``int`` 表示。
