0089. Gray Code
===============

题目信息
--------

:题号: 0089. 格雷编码
:难度: Medium
:主题: 位运算、构造、二进制反射
:原题: `LeetCode 0089 <https://leetcode.com/problems/gray-code/>`_
:重点: 从超立方体路径搜索，推导到镜像反射与 ``i ^ (i >> 1)`` 闭式

题目重述
--------

给定整数 ``n``，返回一个长度为 ``2^n`` 的整数序列，满足：

- 第一个整数为 0；
- ``0`` 到 ``2^n - 1`` 中的每个整数恰好出现一次；
- 任意相邻两个整数的二进制表示恰好有一位不同；
- 最后一个整数与第一个整数也恰好有一位不同。

任意满足条件的序列均可返回。约束为 ``1 <= n <= 16``。

自建示例
--------

.. code-block:: text

   输入：n = 2
   输出：[0,1,3,2]

对应二进制序列为 ``00,01,11,10``。相邻项只改变一位，末项 ``10`` 与首项 ``00``
也只改变一位。

.. code-block:: text

   输入：n = 3
   输出：[0,1,3,2,6,7,5,4]

它在二位 Gray 序列后拼接反向序列，并为后半部分补上新的最高位。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       bool differsByOneBit(int first, int second) {
           int difference = first ^ second;
           return difference != 0 &&
                  (difference & (difference - 1)) == 0;
       }

       bool buildCycle(int current, int n,
                       std::vector<char>& used,
                       std::vector<int>& path) {
           if (path.size() == used.size()) {
               return differsByOneBit(path.back(), path.front());
           }

           for (int bit = 0; bit < n; ++bit) {
               int next = current ^ (1 << bit);
               if (used[next]) {
                   continue;
               }

               used[next] = true;
               path.push_back(next);

               if (buildCycle(next, n, used, path)) {
                   return true;
               }

               path.pop_back();
               used[next] = false;
           }
           return false;
       }

       std::vector<int> hypercubeSearch(int n) {
           int total = 1 << n;
           std::vector<char> used(total);
           std::vector<int> path{0};
           used[0] = true;
           buildCycle(0, n, used, path);
           return path;
       }

       std::vector<int> reflection(int n) {
           int total = 1 << n;
           std::vector<int> result{0};
           result.reserve(total);

           for (int bit = 0; bit < n; ++bit) {
               int prefix = 1 << bit;
               int oldSize = static_cast<int>(result.size());

               for (int index = oldSize - 1; index >= 0; --index) {
                   result.push_back(prefix | result[index]);
               }
           }
           return result;
       }

       std::vector<int> directFormula(int n) {
           int total = 1 << n;
           std::vector<int> result;
           result.reserve(total);

           for (int value = 0; value < total; ++value) {
               result.push_back(value ^ (value >> 1));
           }
           return result;
       }

   public:
       std::vector<int> grayCode(int n) {
           return directFormula(n);
       }
   };

题解
----

超立方体搜索
~~~~~~~~~~~~

把每个 ``n`` 位整数看作一个顶点。两个整数只相差一位时，它们之间连一条边。题目要求从顶点 0
出发，访问全部 ``2^n`` 个顶点一次，并让末顶点还能通过一条边回到 0。

最直接的回溯维护当前顶点、已访问集合和路径。下一步枚举翻转哪一位，得到：

.. code-block:: text

   next = current XOR (1 << bit)

路径包含全部顶点后，再检查首尾异或值是否为 2 的幂。这个模型准确，但它在大量候选路径之间搜索，
没有利用 Gray Code 的确定结构。

镜像反射
~~~~~~~~

从一位序列 ``[0,1]`` 继续增加位数。假设已有 ``k`` 位 Gray 序列：

.. code-block:: text

   00, 01, 11, 10

构造 ``k+1`` 位序列时：

- 前半部分保持原顺序，新最高位补 0；
- 后半部分按原序列的逆序排列，新最高位补 1。

.. code-block:: text

   原序列：00, 01, 11, 10
   逆序列：10, 11, 01, 00
   新序列：000,001,011,010,110,111,101,100

前半内部沿用旧序列的一位差性质。后半只统一增加一个最高位，内部差异仍由低位决定。
两半连接处是 ``010`` 与 ``110``，低位完全相同，只改变新增最高位。

首尾成环
~~~~~~~~

反射构造的首项始终为全 0。后半最后一项来自旧序列首项 0，只增加当前最高位，因此新序列末项
恰好只有最高位为 1。它与首项也只相差一位，循环条件随位数扩展一直成立。

闭式生成
~~~~~~~~

二进制反射 Gray Code 的第 ``i`` 项可直接写成：

.. code-block:: text

   gray(i) = i XOR (i >> 1)

设二进制位为 ``b``，Gray 位为 ``g``，则：

.. code-block:: text

   g[k] = b[k + 1] XOR b[k]

每个 Gray 位记录相邻两层二进制位是否不同，这正是镜像反射在各层产生的翻转关系。

相邻一位差
~~~~~~~~~~

从 ``i`` 增加到 ``i+1`` 时，二进制会把末尾连续的 1 变为 0，并把它们上方第一个 0 变为 1。
因此 ``i XOR (i+1)`` 是一段连续的低位 1。

Gray 公式还会把该差异右移一位再异或，连续低位 1 中除最高位外都两两抵消，最终只剩一个置位。
所以：

.. code-block:: text

   gray(i) XOR gray(i + 1)

始终是 2 的幂，相邻编码恰好相差一位。

完整覆盖
~~~~~~~~

Gray 映射可以从高位向低位恢复原二进制数：最高二进制位等于最高 Gray 位，之后使用
``b[k] = b[k + 1] XOR g[k]`` 逐位恢复。映射可逆，因此不同输入不会得到相同输出。

公式枚举 ``0`` 到 ``2^n - 1`` 后，会得到 ``2^n`` 个互不相同且仍在该范围内的整数，因而完整覆盖
所有 ``n`` 位整数。

复杂度
~~~~~~

回溯搜索最坏需要探索指数级路径。反射构造和闭式生成都输出 ``2^n`` 个整数，时间与输出空间均为
``Theta(2^n)``。闭式方法除返回结果外只使用常量额外空间，达到输出规模决定的下界。
