0372. Super Pow
===============

题目信息
--------

:题号: 0372
:难度: Medium
:主题: 模幂、大指数、十进制数字数组、固定模数
:原题: `LeetCode 0372 <https://leetcode.com/problems/super-pow/>`_
:重点: 指数由十进制数字数组表示、不能假设指数可放入普通整数、结果对 ``1337`` 取模

题目重述
--------

给定正整数 ``a`` 和数字数组 ``b``。数组 ``b`` 按从高位到低位保存一个正整数指数，例如 ``[1,0,5]`` 表示指数 ``105``。返回 ``a`` 的该指数次幂除以 ``1337`` 后的余数。

``a`` 位于 ``[1, 2^31-1]``，``b`` 的长度位于 ``[1, 2000]``，每个元素都是 ``0`` 到 ``9`` 的十进制数字。指数可能远超普通整数范围，因此题目契约只提供数字数组，不能依赖先把完整指数转换为固定宽度整数。

自建示例
--------

两位指数：

.. code-block:: text

   输入：a = 2，b = [1,1]
   输出：711
   解释：指数为 11，2^11 = 2048，2048 除以 1337 的余数为 711。

底数可被模数整除：

.. code-block:: text

   输入：a = 1337，b = [5]
   输出：0
   解释：1337 的任意正整数次幂都能被 1337 整除。

按十进制位递推指数
--------------------

若已经处理了指数前缀 ``q``，再读入一位 ``d`` 后新指数是 ``10q + d``，所以
``a^(10q+d) = (a^q)^10 * a^d``。每一步都先把当前结果取十次方，再乘上底数的 ``d`` 次方，并对 1337 取模；整个过程中从未构造完整指数。

模幂函数用二进制快速幂计算小指数 10 或数字位 ``0..9``。底数和中间乘积使用 ``long long``，每次乘法前后都保持在可控范围内。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       static constexpr long long MOD = 1337;

       long long power(long long base, int exponent) {
           long long result = 1;
           base %= MOD;
           while (exponent > 0) {
               if (exponent & 1) result = result * base % MOD;
               base = base * base % MOD;
               exponent >>= 1;
           }
           return result;
       }

   public:
       int superPow(int a, std::vector<int>& b) {
           long long result = 1;
           for (int digit : b) {
               result = power(result, 10)
                      * power(a, digit) % MOD;
           }
           return static_cast<int>(result);
       }
   };

代码分析
--------

十进制位递推严格保持了指数的高位到低位顺序，``b`` 再长也只需保存一个模意义下的结果；快速幂则避免逐次相乘。若 ``b`` 长度为 ``L``，每一位只进行常数次模幂，时间复杂度为 ``O(L)``（常数来自最多 4 次平方/乘法），额外空间为 ``O(1)``。
