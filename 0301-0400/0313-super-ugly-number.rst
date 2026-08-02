0313. Super Ugly Number
=======================

题目信息
--------

:题号: 0313
:难度: Medium
:主题: 正整数序列、指定质因子、第 n 项、结果去重
:原题: `LeetCode 0313 <https://leetcode.com/problems/super-ugly-number/>`_
:重点: ``1`` 是第一项、所有质因子必须来自给定集合、相同数值只占一个序列位置

题目重述
--------

超级丑数是所有质因子都属于数组 ``primes`` 的正整数，数值 ``1`` 也被定义为超级丑数。给定正整数 ``n`` 和严格递增、互不相同的质数数组 ``primes``，返回按数值从小到大排列的第 ``n`` 个超级丑数。

``n`` 位于 ``[1, 10^5]``，``primes`` 的长度位于 ``[1, 100]``，每个质数位于 ``[2, 1000]``。不同质因子乘积可能生成同一个数，该数在序列中只能出现一次。题目保证第 ``n`` 个超级丑数可以由 32 位有符号整数表示。

自建示例
--------

由两个指定质数生成序列：

.. code-block:: text

   输入：n = 6，primes = [3, 5]
   输出：25
   解释：前六个超级丑数为 1、3、5、9、15、25，因此第六项是 25。

第一项与质数集合无关：

.. code-block:: text

   输入：n = 1，primes = [7, 13]
   输出：1
   解释：按照题目定义，1 始终是超级丑数序列的第一项。

多路合并所有可生成的候选
--------------------------

超级丑数序列从 ``1`` 开始。若已经得到排好序的前缀 ``ugly``，下一项必然可以写成某个已出现的超级丑数乘以一个 ``primes`` 中的质数。为每个质数维护一个指针 ``index[j]``，表示当前还没有使用的候选 ``ugly[index[j]] * primes[j]``；所有候选的最小值就是下一个超级丑数。

一个数可能由多条路生成，例如质数集合包含 2 和 3 时，6 既可能来自 ``2 * 3``，也可能来自 ``3 * 2``。选出最小候选后，必须把所有等于该值的指针一起前进，否则同一个数会在序列中重复出现，后续第 ``n`` 项也会错位。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int nthSuperUglyNumber(
           int n, std::vector<int>& primes) {
           int primeCount = static_cast<int>(primes.size());
           std::vector<int> index(primeCount, 0);
           std::vector<long long> ugly(n, 0);
           ugly[0] = 1;

           for (int i = 1; i < n; ++i) {
               long long next = LLONG_MAX;
               for (int j = 0; j < primeCount; ++j) {
                   next = std::min(
                       next, ugly[index[j]] * primes[j]);
               }
               ugly[i] = next;

               for (int j = 0; j < primeCount; ++j) {
                   if (ugly[index[j]] * primes[j] == next) {
                       ++index[j];
                   }
               }
           }
           return static_cast<int>(ugly[n - 1]);
       }
   };

代码分析
--------

每个质数对应一路已经有序的候选流，取各路头部最小值等价于多路归并；所有相等头部同步前进实现去重。``n == 1`` 时循环不会执行，直接返回初始化的 1。每生成一项扫描一次质数数组，时间复杂度为 ``O(n * p)``（``p`` 为质数个数），空间复杂度为 ``O(n + p)``；内部用 ``long long`` 计算乘积后再按题目保证转回 ``int``。
