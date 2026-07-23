0050. Pow(x, n)
================

题目信息
--------

:题号: 0050
:难度: Medium
:主题: 数学、快速幂、二进制分解、整数边界
:原题: `LeetCode 0050 <https://leetcode.com/problems/powx-n/>`_
:重点: 指数折半、平方倍增、负指数倒数、最小整数边界

题目重述
--------

实现 ``x`` 的整数次幂 ``x^n``，其中 ``x`` 是浮点数，``n`` 是 32 位有符号整数。零指数结果为 1；负指数满足 ``x^n = 1 / x^{-n}``。

约束为 ``-100.0 < x < 100.0``、``-2^31 <= n <= 2^31 - 1``；保证 ``x`` 不为零或 ``n`` 为正，并保证数学结果位于 ``[-10^4, 10^4]``。

自建示例
--------

.. code-block:: text

   输入：x = 3.0, n = 4
   输出：81.0

``3^4 = 81``。

.. code-block:: text

   输入：x = 4.0, n = -2
   输出：0.0625

负指数先取倒数，``4^-2 = 1 / 16``。处理 ``n = -2^31`` 时不能在 32 位整数中直接计算 ``-n``。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   private:
       double linear(double base, long long exponent) {
           double result = 1.0;
           for (long long i = 0; i < exponent; ++i) result *= base;
           return result;
       }

       double recursivePower(double base, long long exponent) {
           if (exponent == 0) return 1.0;
           double half = recursivePower(base, exponent / 2);
           double result = half * half;
           return exponent % 2 == 0 ? result : result * base;
       }

       double iterativePower(double base, long long exponent) {
           double result = 1.0;
           while (exponent > 0) {
               if (exponent & 1LL) result *= base;
               base *= base;
               exponent >>= 1;
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
           return iterativePower(x, exponent);
       }
   };

题解
----

线性乘法为何不可接受
~~~~~~~~~~~~~~~~~~~~

连续乘 ``|n|`` 次的时间为 ``O(|n|)``。32 位指数绝对值可超过二十亿，即使每轮只有一次乘法也无法接受。需要利用指数的代数结构消除重复乘积。

指数折半如何减少问题规模
~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: text

   x^(2k)   = (x^k)^2
   x^(2k+1) = (x^k)^2 * x

递归每层把指数减半，深度 ``O(log |n|)``。同一个 ``half`` 必须只计算一次；若写成两次递归调用，会恢复为线性数量的子问题。

二进制展开如何形成迭代快速幂
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

例如 ``13 = 1101₂ = 8+4+1``：

.. code-block:: text

   x^13 = x^8 * x^4 * x

从最低位扫描指数。当前底数依次表示 ``x,x²,x⁴,x⁸``；最低位为 1 时把该贡献乘入结果。每轮底数平方，指数右移一位。

指数 13 的状态演化
~~~~~~~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 指数
     - 当前底数
     - 最低位
     - 结果动作
   * - 13
     - ``x``
     - 1
     - 乘入 ``x``
   * - 6
     - ``x²``
     - 0
     - 不乘
   * - 3
     - ``x⁴``
     - 1
     - 乘入 ``x⁴``
   * - 1
     - ``x⁸``
     - 1
     - 乘入 ``x⁸``

最终结果为 ``x * x⁴ * x⁸ = x¹³``。

负指数为何先转换底数
~~~~~~~~~~~~~~~~~~~~

令 ``base = 1/x``、``exponent = |n|``，之后完全复用非负快速幂。这样循环中只处理非负指数，不需要为每个二进制位区分符号。

INT_MIN 为什么必须先提升
~~~~~~~~~~~~~~~~~~~~~~~~

32 位范围是 ``[-2147483648,2147483647]``，``2147483648`` 无法放入 ``int``。若先执行 ``-n`` 会溢出。正确顺序是先转换到 64 位，再取相反数。Python、R 等没有相同固定宽度问题，但实现仍保持统一流程。

为什么每个二进制位恰好贡献一次
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

第 ``k`` 轮底数是 ``x^(2^k)``，指数最低位就是原指数第 ``k`` 位。位为 1 时乘入，位为 0 时跳过；右移后该位永久删除。所有置位贡献乘积的指数和恰好等于原指数，因此结果正确。

复杂度来源
~~~~~~~~~~

线性方法为 ``O(|n|)``；递归和迭代快速幂执行 ``O(log |n|)`` 次平方与乘法。递归使用 ``O(log |n|)`` 栈，迭代只用 ``O(1)`` 额外空间。

九语言实现
----------

C
~

.. code-block:: c

   double myPow(double x,int n){long long exponent=n;if(exponent<0){x=1.0/x;exponent=-exponent;}double result=1.0;while(exponent>0){if(exponent&1LL)result*=x;x*=x;exponent>>=1;}return result;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def myPow(self, x: float, n: int) -> float:
           exponent = n
           if exponent < 0: x = 1.0 / x; exponent = -exponent
           result = 1.0
           while exponent:
               if exponent & 1: result *= x
               x *= x
               exponent >>= 1
           return result

Java
~~~~

.. code-block:: java

   class Solution {public double myPow(double x,int n){long exponent=n;if(exponent<0){x=1.0/x;exponent=-exponent;}double result=1.0;while(exponent>0){if((exponent&1L)!=0)result*=x;x*=x;exponent>>=1;}return result;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn my_pow(mut x:f64,n:i32)->f64{let mut exponent=n as i64;if exponent<0{x=1.0/x;exponent=-exponent}let mut result=1.0;while exponent>0{if exponent&1==1{result*=x}x*=x;exponent>>=1}result}}

Go
~~

.. code-block:: go

   func myPow(x float64,n int)float64{exponent:=int64(n);if exponent<0{x=1/x;exponent=-exponent};result:=1.0;for exponent>0{if exponent&1==1{result*=x};x*=x;exponent>>=1};return result}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function myPow(x:number,n:number):number{let exponent=n;if(exponent<0){x=1/x;exponent=-exponent;}let result=1;while(exponent>0){if(exponent%2===1)result*=x;x*=x;exponent=Math.floor(exponent/2);}return result;}

C#
~~

.. code-block:: csharp

   public class Solution {public double MyPow(double x,int n){long exponent=n;if(exponent<0){x=1.0/x;exponent=-exponent;}double result=1.0;while(exponent>0){if((exponent&1L)!=0)result*=x;x*=x;exponent>>=1;}return result;}}

Julia
~~~~~

.. code-block:: julia

   function fast_pow(x::Float64,n::Int)::Float64
       exponent=Int128(n)
       if exponent<0;x=1/x;exponent=-exponent;end
       result=1.0
       while exponent>0;if isodd(exponent);result*=x;end;x*=x;exponent>>=1;end
       result
   end

R
~

.. code-block:: r

   fast_pow <- function(x,n){exponent<-as.numeric(n);if(exponent<0){x<-1/x;exponent<--exponent};result<-1;while(exponent>0){if(exponent%%2==1)result<-result*x;x<-x*x;exponent<-floor(exponent/2)};result}