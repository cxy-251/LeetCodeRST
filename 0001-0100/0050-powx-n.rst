0050. Pow(x, n)
================

题目信息
--------

:题号: 0050
:难度: Medium
:主题: 数学、递归、二进制、快速幂
:原题: `LeetCode 0050 <https://leetcode.com/problems/powx-n/>`_
:重点: 从逐次相乘推导到指数折半，并安全处理负指数与 ``INT_MIN``

题目重述
--------

给定浮点数 ``x`` 和 32 位有符号整数 ``n``，计算并返回 ``x`` 的 ``n`` 次幂。

不能依赖把答案预先存入表中。零指数满足 ``x^0 = 1``；负指数满足
``x^n = (1 / x)^(-n)``。题目保证不会要求计算无定义的零的非正整数次幂，并保证结果位于题目规定的
浮点范围内。

``n`` 的范围为 ``[-2^31, 2^31 - 1]``，因此处理负指数时必须考虑最小 32 位整数无法在
``int`` 中直接取相反数。

自建示例
--------

.. code-block:: text

   输入：x = 2.0, n = 13
   输出：8192.0

   13 = 8 + 4 + 1
   2^13 = 2^8 × 2^4 × 2

负指数示例：

.. code-block:: text

   输入：x = 4.0, n = -3
   输出：0.015625

   4^-3 = (1/4)^3 = 1/64

边界示例：

.. code-block:: text

   输入：x = 1.0, n = -2147483648
   输出：1.0

``-n`` 无法由 32 位 ``int`` 表示；必须先把 ``n`` 提升到更宽的整数类型。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   private:
       double repeatedMultiplication(double base, long long exponent) {
           double result = 1.0;
           for (long long count = 0; count < exponent; ++count) {
               result *= base;
           }
           return result;
       }

       double recursiveFastPower(double base, long long exponent) {
           if (exponent == 0) return 1.0;

           double half = recursiveFastPower(base, exponent / 2);
           double squared = half * half;
           if (exponent % 2 == 0) return squared;
           return squared * base;
       }

       double iterativeFastPower(double base, long long exponent) {
           double result = 1.0;

           while (exponent > 0) {
               if (exponent % 2 == 1) {
                   result *= base;
               }
               base *= base;
               exponent /= 2;
           }
           return result;
       }

   public:
       double myPow(double x, int n) {
           long long exponent = n;
           if (exponent < 0) {
               x = 1.0 / x;
               exponent = -exponent;
           }
           return iterativeFastPower(x, exponent);
       }
   };

题解
----

重复乘法基线
~~~~~~~~~~~~

当指数为非负整数时，乘方定义可以直接写成：

.. code-block:: text

   x^n = 1 × x × x × ... × x
                 共 n 个 x

``repeatedMultiplication`` 完全按照定义执行，因此不会遗漏任何乘因子。它需要 ``n`` 次乘法；32 位正指数最多接近
``2.1 × 10^9``，线性次数无法接受。

需要利用的结构不是底数，而是指数可以不断折半。

指数折半
~~~~~~~~

设非负指数为 ``n``。若 ``n = 2k``：

.. code-block:: text

   x^n = x^(2k) = (x^k)^2

若 ``n = 2k + 1``：

.. code-block:: text

   x^n = x^(2k+1) = (x^k)^2 × x

每次只需求一次 ``x^k``，再平方得到偶数部分。若把 ``power(x, n / 2)`` 调用两次，两棵递归子树会重复计算，
调用数仍会退化到线性级。``recursiveFastPower`` 先保存 ``half``，其递推关系因此为：

.. code-block:: text

   T(n) = T(n / 2) + O(1)

指数每层减半，递归深度和乘法次数都降为 ``O(log n)``。零指数返回 ``1``；随后根据奇偶性返回
``half²`` 或 ``half² × base``，与上面的代数分解完全一致。

二进制迭代
~~~~~~~~~~

不断判断奇偶并除以 ``2``，等价于从低位到高位读取指数的二进制表示。以 ``13`` 为例：

.. code-block:: text

   13 = 1101₂ = 2³ + 2² + 2⁰
   x^13 = x^8 × x^4 × x

循环中的 ``base`` 依次代表：

.. code-block:: text

   x, x², x⁴, x⁸, ...

当前最低位为 ``1`` 时，把对应幂乘入 ``result``；最低位为 ``0`` 时跳过。每轮把 ``base`` 平方，并把指数除以
``2``，从而转向下一位。

快速幂不变量
~~~~~~~~~~~~

负指数归一化之后，设初始目标为：

.. code-block:: text

   originalBase^originalExponent

迭代过程始终保持：

.. code-block:: text

   result × base^exponent
   = originalBase^originalExponent

初始 ``result = 1``，等式成立。

若 ``exponent = 2k``，更新 ``base = base²``、``exponent = k`` 后：

.. code-block:: text

   result × (base²)^k
   = result × base^(2k)

若 ``exponent = 2k + 1``，先执行 ``result *= base``，再平方底数并折半指数：

.. code-block:: text

   result' × (base²)^k
   = result × base × base^(2k)
   = result × base^(2k+1)

两种更新都保持目标值不变。循环结束时 ``exponent = 0``，不变量变为：

.. code-block:: text

   result × base^0 = result

因此 ``result`` 就是原目标幂。每轮删除一个二进制位，所以迭代次数与指数位数同阶。

负指数归一化
~~~~~~~~~~~~

对 ``n < 0``：

.. code-block:: text

   x^n = (1 / x)^(-n)

先把底数改为 ``1 / x``，再把指数改为非负值，递归和迭代核心就无需处理符号。

32 位有符号整数范围不对称：

.. code-block:: text

   最小值：-2147483648
   最大值： 2147483647

当 ``n = INT_MIN`` 时，数学上的 ``-n`` 超出 ``int`` 上界。代码先执行：

.. code-block:: cpp

   long long exponent = n;

数值提升到更宽类型后，再执行 ``exponent = -exponent`` 才不会溢出。这一步必须发生在取相反数之前。

状态演化
~~~~~~~~

对 ``2^13``：

.. list-table::
   :header-rows: 1

   * - ``exponent``
     - ``base``
     - 最低位
     - ``result`` 更新后
   * - 13
     - ``2``
     - 1
     - ``2``
   * - 6
     - ``4``
     - 0
     - ``2``
   * - 3
     - ``16``
     - 1
     - ``32``
   * - 1
     - ``256``
     - 1
     - ``8192``
   * - 0
     - ``65536``
     - 结束
     - ``8192``

每一行都满足 ``result × base^exponent = 2^13``。

边界处理
~~~~~~~~

``n = 0``
   循环不执行，返回初始值 ``1``。

``n = 1``
   唯一二进制位为 ``1``，底数恰好乘入一次。

``x = 0`` 且 ``n > 0``
   快速幂自然得到 ``0``。

``x = 1`` 或 ``x = -1``
   平方和指数奇偶会自然得到正确结果，不需要特殊分支。

``n = INT_MIN``
   通过 ``long long`` 安全保存其绝对值。

代码演进
~~~~~~~~

``repeatedMultiplication`` 直接执行乘方定义，时间随指数绝对值线性增长。

``recursiveFastPower`` 利用奇偶分解把指数每次减半，并且只计算一次半幂。

``iterativeFastPower`` 进一步把递归过程改写为二进制扫描，以 ``result × base^exponent`` 为不变量，只保存常量个状态。
公开入口先归一化负指数，再调用该方法。

复杂度分析
~~~~~~~~~~

设 ``N = |n|``。

重复乘法执行 ``N`` 次乘法，时间为 ``O(N)``，额外空间为 ``O(1)``。

递归快速幂每层把指数减半，时间为 ``O(log N)``，递归栈为 ``O(log N)``。

迭代快速幂每轮删除一个二进制位，时间为 ``O(log N)``，额外空间为 ``O(1)``。当 ``n = 0`` 时，时间为
``O(1)``。
