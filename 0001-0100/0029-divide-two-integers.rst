0029. Divide Two Integers
=========================

题目信息
--------

:题号: 0029
:难度: Medium
:主题: 整数、倍增、二进制、贪心、溢出
:原题: `LeetCode 0029 <https://leetcode.com/problems/divide-two-integers/>`_
:重点: 从逐次减法推导到按二进制位试商，并安全处理向零截断、符号和 32 位边界

题目重述
--------

给定两个 32 位有符号整数 ``dividend`` 和 ``divisor``，计算整数商并返回。不得使用乘法、除法和取模运算符。

结果的小数部分必须向零截断。例如 ``7 / -3`` 返回 ``-2``，而不是向下取整得到 ``-3``。题目保证
``divisor != 0``。

输入范围为 ``[-2^31, 2^31 - 1]``。若数学结果超过 32 位有符号整数范围，只会发生在
``INT_MIN / -1``，此时必须返回 ``INT_MAX``。

自建示例
--------

* 正数且有余数：``dividend = 58``、``divisor = 7``，返回 ``8``，因为 ``58 = 7 * 8 + 2``；
* 异号并向零截断：``dividend = -58``、``divisor = 7``，返回 ``-8``；
* 被除数绝对值较小：``dividend = 3``、``divisor = 5``，返回 ``0``；
* 最小负数：``dividend = INT_MIN``、``divisor = 1``，返回 ``INT_MIN``；
* 唯一溢出：``dividend = INT_MIN``、``divisor = -1``，返回 ``INT_MAX``。

C++ 实现
--------

.. code-block:: cpp

   #include <climits>

   class Solution {
   private:
       long long magnitude(int value) {
           return value < 0 ? -static_cast<long long>(value) : static_cast<long long>(value);
       }

       int applySignAndClamp(long long quotient, bool negative) {
           if (!negative && quotient > INT_MAX) {
               return INT_MAX;
           }
           const long long signedQuotient = negative ? -quotient : quotient;
           return static_cast<int>(signedQuotient);
       }

       int repeatedSubtraction(int dividend, int divisor) {
           long long remaining = magnitude(dividend);
           const long long base = magnitude(divisor);
           long long quotient = 0;
           while (remaining >= base) {
               remaining -= base;
               ++quotient;
           }
           const bool negative = (dividend < 0) != (divisor < 0);
           return applySignAndClamp(quotient, negative);
       }

       int repeatedDoubling(int dividend, int divisor) {
           long long remaining = magnitude(dividend);
           const long long base = magnitude(divisor);
           long long quotient = 0;
           while (remaining >= base) {
               long long chunk = base;
               long long contribution = 1;
               while ((chunk << 1) <= remaining) {
                   chunk <<= 1;
                   contribution <<= 1;
               }
               remaining -= chunk;
               quotient += contribution;
           }
           const bool negative = (dividend < 0) != (divisor < 0);
           return applySignAndClamp(quotient, negative);
       }

       int binaryLongDivision(int dividend, int divisor) {
           long long remaining = magnitude(dividend);
           const long long base = magnitude(divisor);
           long long quotient = 0;
           for (int bit = 31; bit >= 0; --bit) {
               const long long chunk = base << bit;
               if (chunk <= remaining) {
                   remaining -= chunk;
                   quotient += 1LL << bit;
               }
           }
           const bool negative = (dividend < 0) != (divisor < 0);
           return applySignAndClamp(quotient, negative);
       }

   public:
       int divide(int dividend, int divisor) {
           return binaryLongDivision(dividend, divisor);
       }
   };

题解
----

除法的直接含义
~~~~~~~~~~~~~~

先忽略符号。若不断从 ``|dividend|`` 中减去 ``|divisor|``，能够成功减去的次数就是商的绝对值；当剩余量小于
除数绝对值时停止，未被消去的部分就是余数。

``repeatedSubtraction`` 直接实现这一含义。每次循环保持：

.. code-block:: text

   |dividend| = |divisor| * quotient + remaining

循环结束时 ``0 <= remaining < |divisor|``，因此 ``quotient`` 正是绝对值除法向下取整后的结果。最后再恢复符号，
就得到题目要求的向零截断商。

这个方法的问题不在正确性，而在每轮只增加 ``1``。例如 ``INT_MAX / 1`` 需要超过二十亿轮，时间与商的数值
大小成正比。

倍增删除重复减法
~~~~~~~~~~~~~~~~

一次减去一个除数过慢，可以通过加法倍增构造：

.. code-block:: text

   divisor, 2 * divisor, 4 * divisor, 8 * divisor, ...

代码不使用乘法，而是让 ``chunk`` 和对应的 ``contribution`` 同时左移一位。若当前剩余量至少容纳两倍
``chunk``，就继续倍增；否则当前 ``chunk`` 是本轮能够减去的最大二次幂倍数。

以 ``58 / 7`` 为例，第一轮依次得到 ``7、14、28、56``，一次减去 ``56``，商增加 ``8``，剩余 ``2``。
这相当于把八次重复减法压缩为一次减法和若干次倍增。

``repeatedDoubling`` 每轮都从 ``base`` 重新构造最大倍数。外层最多执行 ``O(log |quotient|)`` 轮，每轮又可能
倍增 ``O(log |quotient|)`` 次，因此最坏时间为 ``O(log² |quotient|)``。

商的二进制分解
~~~~~~~~~~~~~~

逐轮倍增仍在重复构造同一组二次幂倍数。商本身可以写成若干二次幂之和，例如：

.. code-block:: text

   13 = 8 + 4 + 1 = 1101₂

因此可以从最高位到最低位直接判断商的每一位是否为 ``1``。对于位 ``bit``，候选除数倍数为
``base << bit``：

* 候选不大于当前剩余量时，该位可以取 ``1``，减去候选并把 ``1 << bit`` 加入商；
* 候选大于当前剩余量时，该位只能取 ``0``，继续检查更低位。

处理完某一位后，更高位已经固定，剩余量只需要由更低位对应的倍数继续表示。这就是整数长除法在二进制中的形式。

降序试商
~~~~~~~~

必须从高位向低位判断。若最高可行位没有选入，只靠所有更低位之和也无法得到更大的合法商；选入后，算法再用
低位填充剩余量，最终得到不超过被除数绝对值的最大除数倍数。

以 ``58 / 7`` 为例：

.. list-table::
   :header-rows: 1

   * - 商位
     - 候选倍数
     - 剩余量
     - 动作
   * - ``2^3``
     - ``7 << 3 = 56``
     - 58
     - 选入，商变为 8，剩余 2
   * - ``2^2``
     - 28
     - 2
     - 跳过
   * - ``2^1``
     - 14
     - 2
     - 跳过
   * - ``2^0``
     - 7
     - 2
     - 跳过

最终商为 ``8``。剩余量 ``2`` 小于除数 ``7``，不能再增加任何商位。

固定扫描范围
~~~~~~~~~~~~

两个输入都是 32 位整数，商的绝对值最大为 ``2^31``，所以只需要检查 ``bit = 31`` 到 ``0`` 共 32 个位置。

``base`` 最大为 ``2^31``。计算 ``base << 31`` 时最大得到 ``2^62``，仍在 64 位有符号整数范围内。使用
``long long`` 保存绝对值、候选倍数和商，可以安全表示 ``|INT_MIN| = 2^31``，也避免对 ``INT_MIN`` 直接取
32 位绝对值产生溢出。

符号与截断方向
~~~~~~~~~~~~~~

主体算法只计算：

.. code-block:: text

   floor(|dividend| / |divisor|)

若两个输入符号不同，就对这个非负商取负。余数始终被直接舍弃，没有在负数结果上再减一，因此结果向零截断。
例如 ``-58 / 7`` 的绝对值商为 ``8``，恢复符号后得到 ``-8``。

两个输入是否异号可由 ``(dividend < 0) != (divisor < 0)`` 判断。零既不小于零，也不会造成符号歧义。

唯一溢出
~~~~~~~~

32 位正数最大值为 ``2^31 - 1``，负数最小值为 ``-2^31``。只有 ``INT_MIN / -1`` 会产生正数 ``2^31``，
超过 ``INT_MAX``；其他商都能放入 32 位有符号整数。

``applySignAndClamp`` 在恢复正号前检查这一情况并返回 ``INT_MAX``。当结果为负数 ``-2^31`` 时，它仍是合法的
``INT_MIN``，可以安全转换回 ``int``。

代码演进
~~~~~~~~

``repeatedSubtraction`` 每轮只删除一个除数，代码直接对应除法定义，但运行次数等于商的绝对值。

``repeatedDoubling`` 用左移构造二次幂倍数，一轮可以替代大量重复减法；它删除了线性于商的循环，却会在每个外层
阶段重新从 ``base`` 开始倍增。

``binaryLongDivision`` 直接枚举商的 32 个二进制位。逐轮重新构造倍数的内层循环消失，每个候选位只计算一次，
同时不再需要保存倍增表。公开入口采用这一方法。

复杂度分析
~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 主要代价
   * - 重复减法
     - ``O(|quotient|)``
     - ``O(1)``
     - 每次只消去一个除数
   * - 逐轮倍增
     - ``O(log² |quotient|)``
     - ``O(1)``
     - 每轮重新寻找最大二次幂倍数
   * - 二进制长除法
     - ``O(log C)``
     - ``O(1)``
     - 从高到低检查固定整数范围内的商位

``C`` 表示整数取值范围；对固定 32 位输入，主解法始终检查 32 个商位，因此运行次数具有常数上界。
