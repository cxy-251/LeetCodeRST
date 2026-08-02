0483. Smallest Good Base
========================

题目信息
--------

:题号: 0483
:难度: Hard
:主题: 大整数、进制表示、全为 1、最小底数
:原题: `LeetCode 0483 <https://leetcode.com/problems/smallest-good-base/>`_
:重点: 底数必须至少为 2、表示需包含至少两个数字 1、输入和输出都是十进制字符串、返回最小可行底数

题目重述
--------

给定表示整数 ``N`` 的十进制字符串 ``n``。若在底数 ``k >= 2`` 的进制中，``N`` 的表示由两个或更多连续数字 ``1`` 组成，则称 ``k`` 是 ``N`` 的好进制。返回最小的好进制，并使用十进制字符串表示。

等价地，需要找到最小 ``k`` 和某个整数 ``m >= 1``，使：

.. code-block:: text

   N = 1 + k + k^2 + ... + k^m

``N`` 位于 ``[3, 10^18]``。不能因输入超过普通 32 位整数范围而丢失精度；结果返回的是底数，不是该进制下的表示字符串。

自建示例
--------

存在三位全一表示：

.. code-block:: text

   输入：n = "13"
   输出："3"
   解释：13 = 1 + 3 + 3^2，所以在三进制中表示为 111；不存在更小的合法底数。

二进制就是最小好进制：

.. code-block:: text

   输入：n = "31"
   输出："2"
   解释：31 = 1 + 2 + 4 + 8 + 16，在二进制中为 11111，而底数不能小于 2。

枚举全 1 表示的位数并二分底数
------------------------------

若表示中有 ``terms`` 个连续的 1，则必须满足 ``N = 1 + k + ... + k^(terms-1)``。底数越大，这个和严格增加，因此固定 ``terms`` 后可以在 ``[2, N-1]`` 上二分寻找精确底数。为了得到最小底数，应从较大的 ``terms``（更多位的全 1 表示）向下枚举；最后 ``terms = 2`` 一定给出 ``k = N - 1``。

计算几何和时使用“超过目标就立即停止”的乘法检查，避免 ``k`` 的高次幂溢出 64 位整数。最多需要考虑的位数是 ``N`` 的二进制位数，因为底数至少为 2。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       long long target;

       long long geometricSum(long long base, int terms) {
           long long power = 1;
           long long sum = 1;
           for (int i = 1; i < terms; ++i) {
               if (power > target / base) return target + 1;
               power *= base;
               if (sum > target - power) return target + 1;
               sum += power;
           }
           return sum;
       }

   public:
       std::string smallestGoodBase(std::string n) {
           target = std::stoll(n);
           int maxTerms = 0;
           for (long long value = target; value > 0; value >>= 1) {
               ++maxTerms;
           }

           for (int terms = maxTerms; terms >= 2; --terms) {
               long long left = 2;
               long long right = target - 1;
               while (left <= right) {
                   long long base = left + (right - left) / 2;
                   long long sum = geometricSum(base, terms);
                   if (sum == target) return std::to_string(base);
                   if (sum < target) {
                       left = base + 1;
                   } else {
                       right = base - 1;
                   }
               }
           }
           return std::to_string(target - 1);
       }
   };

代码分析
--------

固定位数时几何和关于底数单调，二分不会漏掉该位数的唯一候选；从位数多到少搜索，则首次命中的底数小于所有更短表示的底数。乘法前用 ``target / base`` 判断下一幂是否会超过目标，保证中间值不溢出。位数枚举和二分共同带来 ``O(log^2 N)`` 时间，额外空间复杂度为 ``O(1)``。
