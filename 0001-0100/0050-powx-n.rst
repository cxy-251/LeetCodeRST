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

直接方法：把乘方理解成重复乘法
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

当指数为非负整数时，最直接的定义是：

.. code-block:: text

   x^n = 1 × x × x × ... × x
                 共 n 个 x

``repeatedMultiplication`` 完全按照定义执行，因此容易确认正确。

问题在于它进行了 ``n`` 次乘法。32 位正指数最多接近 ``2.1 × 10^9``，线性次数无法接受。真正需要消除的
不是单次乘法成本，而是大量重复构造相同的幂。

指数中隐藏着什么重复结构
~~~~~~~~~~~~~~~~~~~~~~~~

偶数指数可以平分为两个完全相同的子问题：

.. code-block:: text

   x^(2k) = x^k × x^k = (x^k)^2

奇数指数只比偶数情况多一个 ``x``：

.. code-block:: text

   x^(2k+1) = (x^k)^2 × x

指数从 ``n`` 变为 ``n / 2``，每层规模减半。递归深度由 ``n`` 降为 ``log n``。

为什么半幂只能递归计算一次
~~~~~~~~~~~~~~~~~~~~~~~~~~

错误写法可能直接写成：

.. code-block:: text

   power(x, n/2) × power(x, n/2)

两个调用计算完全相同的值，却分别展开整棵递归子树。设调用次数为 ``T(n)``，它满足：

.. code-block:: text

   T(n) = 2T(n/2) + O(1)

总调用数仍为 ``O(n)``。正确做法先保存：

.. code-block:: text

   half = power(x, n/2)

随后只计算 ``half × half``。此时递推变为 ``T(n) = T(n/2) + O(1)``，时间才是
``O(log n)``。

递归快速幂为什么正确
~~~~~~~~~~~~~~~~~~~~

``recursiveFastPower(base, exponent)`` 只接收非负指数。

当 ``exponent = 0`` 时返回 1，符合零指数定义。设递归正确返回
``half = base^(exponent/2)``：

* 指数为偶数 ``2k`` 时，``half² = base^(2k)``；
* 指数为奇数 ``2k+1`` 时，``half² × base = base^(2k+1)``。

每次递归都把指数减半，最终一定到达零。

从指数折半到二进制分解
~~~~~~~~~~~~~~~~~~~~~~

不断判断奇偶、再除以 2，本质上是在从低位到高位读取指数的二进制表示。

以 ``13`` 为例：

.. code-block:: text

   13 = 1101₂ = 2³ + 2² + 2⁰

因此：

.. code-block:: text

   x^13 = x^(2³) × x^(2²) × x^(2⁰)
        = x^8 × x^4 × x

当前 ``base`` 依次代表：

.. code-block:: text

   x, x², x⁴, x⁸, ...

指数当前最低位为 1 时，该幂需要进入答案；最低位为 0 时跳过。每轮把 ``base`` 平方，并把指数除以 2，
便转向下一位。

迭代过程的不变量
~~~~~~~~~~~~~~~~

设负指数已经转换完毕，初始目标是 ``original_base^original_exponent``。循环每轮开始时保持：

.. code-block:: text

   result × base^exponent
   = original_base^original_exponent

初始时 ``result = 1``，等式成立。

若 ``exponent = 2k`` 为偶数，更新为：

.. code-block:: text

   base' = base²
   exponent' = k

于是：

.. code-block:: text

   result × (base²)^k = result × base^(2k)

目标值不变。

若 ``exponent = 2k+1`` 为奇数，先执行 ``result *= base``，再平方底数并把指数除以 2：

.. code-block:: text

   result' × (base²)^k
   = result × base × base^(2k)
   = result × base^(2k+1)

目标值仍不变。循环结束时 ``exponent = 0``，不变量变成：

.. code-block:: text

   result × base^0 = result

所以 ``result`` 就是原目标幂。

``2^13`` 的状态演化
~~~~~~~~~~~~~~~~~~~

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

每个二进制位只处理一次，因此只需与指数位数同阶的循环次数。

负指数如何复用同一算法
~~~~~~~~~~~~~~~~~~~~~~

对 ``n < 0``：

.. code-block:: text

   x^n = (1/x)^(-n)

先把底数改为 ``1/x``，把指数改为非负值，后续递归或迭代算法完全不需要处理符号。

这种变换也说明了为什么 ``x = 0`` 且 ``n < 0`` 不应出现：它需要计算 ``1/0``。题目已经排除了这一情况。

为什么必须先提升 ``n`` 再取反
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

32 位有符号整数范围不对称：

.. code-block:: text

   最小值：-2147483648
   最大值： 2147483647

当 ``n = -2147483648`` 时，数学上的 ``-n = 2147483648`` 超出 ``int`` 上界。若先在 ``int`` 中执行
``-n``，会发生溢出。

代码先执行：

.. code-block:: cpp

   long long exponent = n;

此时数值已进入更宽的类型，再执行 ``exponent = -exponent`` 就是安全的。

边界情况
~~~~~~~~

``n = 0``
   循环不会执行，返回初始值 1。

``n = 1``
   唯一二进制位为 1，底数恰好乘入一次。

``x = 0`` 且 ``n > 0``
   快速幂自然得到 0。

``x = 1`` 或 ``x = -1``
   算法无需特殊分支；平方和奇偶位会自然得到正确结果。

``n = INT_MIN``
   通过 ``long long`` 转换安全处理其绝对值。

复杂度来源
~~~~~~~~~~

设 ``N = |n|``。

重复乘法执行 ``N`` 次乘法，时间为 ``O(N)``，额外空间为 ``O(1)``。

递归快速幂每层把指数减半，时间为 ``O(log N)``，递归栈为 ``O(log N)``。

迭代快速幂每轮删除一个二进制位，时间为 ``O(log N)``，只保存底数、指数和结果，额外空间为
``O(1)``。当 ``n = 0`` 时，可把时间视为 ``O(1)``。
