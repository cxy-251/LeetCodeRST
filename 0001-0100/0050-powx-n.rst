0050. Pow(x, n)
================

题目信息
--------

:题号: 0050
:难度: Medium
:主题: 数学、快速幂、二进制分解、整数边界
:原题: `LeetCode 0050 <https://leetcode.com/problems/powx-n/>`_
:访问状态: Available
:教学重点: 指数二进制展开、平方倍增、负指数倒数、最小整数溢出

题目重述
--------

实现 ``x`` 的整数次幂 ``x^n``，其中 ``x`` 是浮点数，``n`` 是 32 位有符号整数。

不能通过连续乘 ``|n|`` 次完成，因为 ``|n|`` 最多接近 ``2^31``。需要把指数按二进制位拆分，
在 ``O(log |n|)`` 次乘法内得到结果。

自建示例
--------

正指数
~~~~~~

.. code-block:: text

   输入：x = 2.0, n = 10
   输出：1024.0

负指数
~~~~~~

.. code-block:: text

   输入：x = 2.0, n = -3
   输出：0.125

零指数
~~~~~~

.. code-block:: text

   输入：x = 7.25, n = 0
   输出：1.0

负底数
~~~~~~

.. code-block:: text

   输入：x = -2.0, n = 5
   输出：-32.0

最小指数边界
~~~~~~~~~~~~

.. code-block:: text

   输入：x = 2.0, n = -2147483648
   关键点：不能先在 32 位 int 中计算 -n

问题抽象
--------

指数可以写成二进制位之和。例如：

.. code-block:: text

   13 = 8 + 4 + 1 = 1101₂
   x^13 = x^8 × x^4 × x

从低位到高位扫描指数：

* 当前最低位为 ``1`` 时，把当前底数贡献乘入答案；
* 每轮把底数平方，使其依次表示 ``x, x², x⁴, x⁸, ...``；
* 每轮把指数除以 2，丢弃已经处理的最低位。

负指数利用：

.. code-block:: text

   x^(-n) = (1 / x)^n

因此先把底数取倒数，再对非负指数执行相同的快速幂循环。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 取舍
   * - 迭代二进制快速幂
     - ``O(log |n|)``
     - ``O(1)``
     - 主解法；状态固定，不依赖递归栈
   * - 递归快速幂
     - ``O(log |n|)``
     - ``O(log |n|)``
     - 公式直观，但需要处理递归和负指数边界
   * - 连续乘法
     - ``O(|n|)``
     - ``O(1)``
     - 指数接近 32 位边界时不可接受
   * - 调用标准库 ``pow``
     - 实现相关
     - 实现相关
     - 规避了题目要求实现的核心算法

主解法：迭代二进制快速幂
------------------------

状态含义
~~~~~~~~

维护三个状态：

* ``answer``：已经选中的指数位所贡献的乘积；
* ``factor``：当前二进制位对应的幂，依次为 ``x^(2^0)``、``x^(2^1)``、``x^(2^2)``；
* ``exponent``：尚未处理的非负指数。

初始化：

.. code-block:: text

   answer = 1
   factor = x
   exponent = |n|

若原指数为负，先令 ``factor = 1 / x``。

核心不变量
~~~~~~~~~~

循环每次开始时，设初始规范化后的底数为 ``base``，初始非负指数为 ``E``，则始终满足：

.. code-block:: text

   answer × factor^exponent = base^E

若 ``exponent`` 为奇数：

.. code-block:: text

   answer' = answer × factor
   exponent = 2q + 1

随后平方 ``factor`` 并把指数变为 ``q``：

.. code-block:: text

   answer' × (factor²)^q
   = answer × factor × factor^(2q)
   = answer × factor^(2q + 1)

若指数为偶数，同样有：

.. code-block:: text

   answer × (factor²)^(exponent / 2)
   = answer × factor^exponent

因此每轮后不变量保持。循环结束时 ``exponent = 0``，于是 ``answer = base^E``。

为什么必须先扩宽指数
~~~~~~~~~~~~~~~~~~~~

32 位有符号整数范围是 ``[-2^31, 2^31 - 1]``。最小值 ``-2^31`` 没有对应的正 32 位表示，
所以在 ``int`` 中计算 ``-n`` 会溢出。

正确顺序是：

#. 先把 ``n`` 转成更宽的有符号类型；
#. 再判断正负并取相反数。

例如 C、C++、Java、Rust、Go 和 C# 都先转为 64 位整数。Python 整数自动扩展；TypeScript 的
``number`` 可精确表示所有 32 位整数；R 使用双精度数保存 32 位指数，整数部分仍可精确表示。

正确性依据
~~~~~~~~~~

**指数位覆盖完整：** 每轮读取 ``exponent`` 的最低二进制位，然后整数除以 2。所有二进制位
恰好被访问一次，不会遗漏或重复。

**每个置位贡献正确：** 第 ``k`` 轮的 ``factor`` 等于 ``base^(2^k)``。若该位为 1，答案乘入
这个因子，正好加入指数的 ``2^k`` 部分；若为 0，不应加入。

**负指数转换正确：** 对 ``n < 0``，算法计算 ``(1/x)^(-n)``。根据幂的倒数规则，它等于
``x^n``。

**终止结果正确：** 指数不断除以 2，最终变为 0。根据循环不变量，结束时
``answer × factor^0 = base^E``，因此 ``answer`` 就是目标幂。

复杂度
~~~~~~

设 ``E = |n|``：

* 指数每轮减半，共执行 ``O(log E)`` 轮；
* 每轮最多两次浮点乘法；
* 时间复杂度为 ``O(log |n|)``；
* 只使用固定数量变量，额外空间复杂度为 ``O(1)``。

当 ``n = 0`` 时循环不执行，直接返回 ``1``。

核心语言实现
------------

C
~

.. code-block:: c

   double myPow(double x, int n) {
       long long exponent = (long long)n;
       double factor = x;
       double answer = 1.0;

       if (exponent < 0) {
           factor = 1.0 / factor;
           exponent = -exponent;
       }

       while (exponent > 0) {
           if ((exponent & 1LL) != 0) {
               answer *= factor;
           }
           factor *= factor;
           exponent >>= 1;
       }

       return answer;
   }

先转成 ``long long``，再对负指数取相反数，避免 ``INT_MIN`` 溢出。

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       double myPow(double x, int n) {
           long long exponent = n;
           double factor = x;
           double answer = 1.0;

           if (exponent < 0) {
               factor = 1.0 / factor;
               exponent = -exponent;
           }

           while (exponent > 0) {
               if ((exponent & 1LL) != 0) {
                   answer *= factor;
               }
               factor *= factor;
               exponent >>= 1;
           }

           return answer;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def myPow(self, x: float, n: int) -> float:
           exponent = n
           factor = x
           answer = 1.0

           if exponent < 0:
               factor = 1.0 / factor
               exponent = -exponent

           while exponent > 0:
               if exponent & 1:
                   answer *= factor
               factor *= factor
               exponent >>= 1

           return answer

Python 整数没有固定 32 位溢出，但仍按同一状态模型实现。

Java
~~~~

.. code-block:: java

   class Solution {
       public double myPow(double x, int n) {
           long exponent = n;
           double factor = x;
           double answer = 1.0;

           if (exponent < 0) {
               factor = 1.0 / factor;
               exponent = -exponent;
           }

           while (exponent > 0) {
               if ((exponent & 1L) != 0L) {
                   answer *= factor;
               }
               factor *= factor;
               exponent >>= 1;
           }

           return answer;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn my_pow(x: f64, n: i32) -> f64 {
           let mut exponent = i64::from(n);
           let mut factor = x;
           let mut answer = 1.0_f64;

           if exponent < 0 {
               factor = 1.0 / factor;
               exponent = -exponent;
           }

           while exponent > 0 {
               if exponent & 1 == 1 {
                   answer *= factor;
               }
               factor *= factor;
               exponent >>= 1;
           }

           answer
       }
   }

Go
~~

.. code-block:: go

   func myPow(x float64, n int) float64 {
       exponent := int64(n)
       factor := x
       answer := 1.0

       if exponent < 0 {
           factor = 1.0 / factor
           exponent = -exponent
       }

       for exponent > 0 {
           if exponent&1 == 1 {
               answer *= factor
           }
           factor *= factor
           exponent >>= 1
       }

       return answer
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function myPow(x: number, n: number): number {
       let exponent = n;
       let factor = x;
       let answer = 1;

       if (exponent < 0) {
           factor = 1 / factor;
           exponent = -exponent;
       }

       while (exponent > 0) {
           if (exponent % 2 === 1) {
               answer *= factor;
           }
           factor *= factor;
           exponent = Math.floor(exponent / 2);
       }

       return answer;
   }

不要使用 JavaScript 位运算处理 ``exponent``。位运算会先把 ``number`` 转为 32 位有符号整数，
``2147483648`` 会变成负数；这里使用取模和 ``Math.floor`` 保持正确数值。

C#
~~

.. code-block:: csharp

   public class Solution {
       public double MyPow(double x, int n) {
           long exponent = n;
           double factor = x;
           double answer = 1.0;

           if (exponent < 0) {
               factor = 1.0 / factor;
               exponent = -exponent;
           }

           while (exponent > 0) {
               if ((exponent & 1L) != 0L) {
                   answer *= factor;
               }
               factor *= factor;
               exponent >>= 1;
           }

           return answer;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function my_pow(x::Float64, n::Int)::Float64
       exponent = Int64(n)
       factor = x
       answer = 1.0

       if exponent < 0
           factor = 1.0 / factor
           exponent = -exponent
       end

       while exponent > 0
           if isodd(exponent)
               answer *= factor
           end
           factor *= factor
           exponent ÷= 2
       end

       return answer
   end

题目指数是 32 位范围；先转换为 ``Int64`` 后，最小 32 位指数可安全取相反数。

R
~

.. code-block:: r

   my_pow <- function(x, n) {
     exponent <- as.double(n)
     factor <- x
     answer <- 1.0

     if (exponent < 0) {
       factor <- 1.0 / factor
       exponent <- -exponent
     }

     while (exponent > 0) {
       if (exponent %% 2 == 1) {
         answer <- answer * factor
       }
       factor <- factor * factor
       exponent <- floor(exponent / 2)
     }

     answer
   }

R 的普通数值是双精度浮点数，但所有 32 位整数都能被精确表示。不要先用 32 位 ``integer`` 对
``-2147483648`` 取相反数。

关键边界
--------

* ``n = 0``：任意允许的非零底数返回 ``1``；
* ``n = 1`` 或 ``-1``：分别返回 ``x`` 或 ``1/x``；
* ``n = -2147483648``：必须先扩宽，不能在 32 位整数中执行 ``-n``；
* 负底数：奇数指数结果为负，偶数指数结果为正，算法由普通乘法自然处理；
* ``x = 1`` 或 ``-1``：大量指数仍只需对数轮数；
* 浮点上溢、下溢和舍入：遵循各语言双精度浮点语义，不应期望任意实数精确值；
* TypeScript：不能用位运算右移超过 32 位符号边界的指数。

易错点
------

* 使用 ``O(|n|)`` 次连续乘法，无法处理大指数；
* 在 32 位整数中先执行 ``n = -n``，遇到最小整数溢出；
* 对负指数只把指数改正，却忘记把底数取倒数；
* 每轮平方后忘记把指数减半，导致死循环；
* 指数最低位为 0 时仍然把 ``factor`` 乘入答案；
* TypeScript 使用 ``>>``，把 ``2147483648`` 强制转换成负的 32 位整数；
* 递归实现没有清楚处理奇数指数和负指数，产生额外分支错误。

新增与强化知识
--------------

新增
~~~~

* 二进制快速幂把指数展开为 ``2`` 的幂次之和；
* 循环不变量 ``answer × factor^exponent = base^E`` 可统一证明奇偶两种更新；
* 固定宽度整数的取绝对值操作也可能溢出；
* JavaScript 位运算的 32 位转换规则会破坏最小指数边界。

强化
~~~~

* 复用 0029 中“先扩宽再处理最小负整数”的边界策略；
* 倍增思想既可用于除法，也可用于幂运算；
* 复杂度由指数位数决定，而不是指数数值本身；
* 浮点算法的正确性证明描述数学运算结构，实际结果仍受 IEEE 754 舍入影响。

最小自检
--------

#. ``13`` 的二进制展开如何决定需要乘入哪些 ``factor``？
#. 为什么 ``factor`` 每轮都要平方？
#. 为什么 ``n = -2147483648`` 不能直接在 32 位整数中取相反数？
#. 负指数为什么可以通过底数取倒数转化为非负指数？
#. TypeScript 为什么不能直接使用 ``exponent >>= 1``？

答案要点
~~~~~~~~

#. ``13 = 8 + 4 + 1``，需要乘入 ``x^8``、``x^4`` 和 ``x``。
#. 下一二进制位的权重翻倍，当前 ``x^(2^k)`` 平方后成为 ``x^(2^(k+1))``。
#. 正 32 位范围最大只有 ``2147483647``，无法表示 ``2147483648``。
#. ``x^(-k) = (1/x)^k``。
#. JavaScript 位运算强制转成 32 位有符号整数，会把边界指数变成错误负值。
