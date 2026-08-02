0479. Largest Palindrome Product
================================

题目信息
--------

:题号: 0479
:难度: Hard
:主题: ``n`` 位整数、两数乘积、最大回文数、模 1337
:原题: `LeetCode 0479 <https://leetcode.com/problems/largest-palindrome-product/>`_
:重点: 两个因数都必须恰好是 ``n`` 位正整数、先找最大回文乘积、最后才对 1337 取模

题目重述
--------

给定整数 ``n``，在所有两个 ``n`` 位正整数的乘积中，找出数值最大的回文数，并返回该回文数对 ``1337`` 取模后的结果。

回文数的十进制表示从左向右和从右向左完全相同。两个因数都必须位于 ``[10^(n-1), 10^n-1]``；返回值不是最大回文数本身，而是其余数。``n`` 位于 ``[1, 8]``，题目保证所需最大回文乘积存在。

自建示例
--------

一位数因数：

.. code-block:: text

   输入：n = 1
   输出：9
   解释：由两个一位正整数相乘能够得到的最大回文数是 9，例如 9 × 1 = 9；9 对 1337 取模仍为 9。

取模发生在确定最大值之后：

.. code-block:: text

   输入：任意合法 n
   输出：largestPalindrome mod 1337
   解释：不能比较各乘积取模后的大小来选择答案，必须先比较原始乘积并确定最大的回文数。

从最大半段生成回文并利用 11 的因子
----------------------------------

对 ``n > 1``，最大回文乘积可以按偶数位回文的形式搜索：取一个 ``n`` 位的左半段 ``half``，拼接它的逆序得到完整回文。按 ``half`` 从大到小生成，就已经按回文数值从大到小检查。

偶数位回文数能被 11 整除，因此两个因数中至少有一个是 11 的倍数。内层只枚举从最大 ``n`` 位数向下的 11 的倍数，并在“该因数乘最大因数都已小于当前回文”时停止；找到处于合法位数范围的整除关系后，立即对原始回文取模。``n = 1`` 单独处理，因为最大的结果是 ``9`` 而不是两位回文。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int largestPalindrome(int n) {
           if (n == 1) return 9;

           long long lower = 1;
           for (int i = 1; i < n; ++i) lower *= 10;
           long long upper = lower * 10 - 1;
           long long factorStart = upper - upper % 11;

           for (long long half = upper; half >= lower; --half) {
               std::string left = std::to_string(half);
               std::string right = left;
               std::reverse(right.begin(), right.end());
               long long palindrome = std::stoll(left + right);

               for (long long factor = factorStart;
                    factor >= lower; factor -= 11) {
                   if (factor * upper < palindrome) break;
                   if (palindrome % factor != 0) continue;
                   long long other = palindrome / factor;
                   if (other >= lower && other <= upper) {
                       return static_cast<int>(palindrome % 1337);
                   }
               }
           }
           return 0;
       }
   };

代码分析
--------

半段按降序生成保证第一次找到的就是原始值最大的可行回文；11 的因子性质把因数搜索缩小到约每 11 个数取一个，乘积上界剪枝又排除了不可能达到当前回文的因数。使用 ``long long`` 可容纳 ``n <= 8`` 时的最多 16 位乘积，取模只在确定最大回文后进行；额外空间复杂度为 ``O(n)``，时间取决于实际检查的半段和候选因数数量。
