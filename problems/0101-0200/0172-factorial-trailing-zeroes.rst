0172. Factorial Trailing Zeroes
===============================

题目信息
--------

:题号: 0172
:难度: Medium
:主题: 数学、质因数分解、整除计数、对数循环
:原题: `LeetCode 0172 <https://leetcode.com/problems/factorial-trailing-zeroes/>`_
:访问状态: Available
:教学重点: 因子 5 分层计数、不重不漏、避免计算阶乘、对数复杂度

精确契约
--------

输入非负整数 ``n``，满足 ``0 <= n <= 10^4``。返回 ``n!`` 的十进制表示末尾连续零的数量。

``0!`` 定义为 1，因此 ``n=0`` 时答案为 0。题目追问要求算法时间优于线性扫描；主解法不计算阶乘，
不构造十进制字符串，只统计质因数 5 在 ``n!`` 中的总指数。

示例与反例
----------

没有尾零
~~~~~~~~

``n=3``，``3!=6``，答案为 0。

第一个尾零
~~~~~~~~~~

``n=5``，``5!=120``，答案为 1。

25 的额外贡献
~~~~~~~~~~~~~

``n=25``。5、10、15、20 各贡献一个因子 5，25 贡献两个，因此总数为
``floor(25/5)+floor(25/25)=5+1=6``。

较大示例
~~~~~~~~

``n=10000``：

.. math::

   2000+400+80+16+3=2499

所以 ``10000!`` 末尾有 2499 个零。

只数 5 的倍数会漏计
~~~~~~~~~~~~~~~~~~

若只返回 ``floor(n/5)``，``n=25`` 会错误得到 5。25 含有 ``5^2``，125 含有 ``5^3``，
这些高次幂必须在后续层继续贡献。

问题抽象与解法选择
------------------

一个十进制尾零来自一个因子 10，而：

.. math::

   10=2\times5

因此尾零数等于 ``n!`` 中因子 2 与因子 5 指数的较小者。阶乘中偶数远多于 5 的倍数，
并且对每个 ``k>=1`` 都有：

.. math::

   \left\lfloor\frac{n}{2^k}\right\rfloor
   \ge
   \left\lfloor\frac{n}{5^k}\right\rfloor

所以因子 2 的总数不少于因子 5，答案就是 ``v_5(n!)``。

每个 ``5^k`` 的倍数至少额外贡献第 ``k`` 个因子 5，因此：

.. math::

   v_5(n!)=
   \left\lfloor\frac{n}{5}\right\rfloor+
   \left\lfloor\frac{n}{25}\right\rfloor+
   \left\lfloor\frac{n}{125}\right\rfloor+\cdots

主循环不显式计算 ``5^k``。令 ``current=n``，每轮执行：

``current = floor(current / 5)``，然后把 ``current`` 加入答案。

解法取舍
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间
     - 空间
     - 取舍
   * - 反复除以 5 累加
     - ``O(log_5 n)``
     - ``O(1)``
     - 主解法；无幂乘法溢出
   * - 枚举 1 至 n 并逐个除 5
     - ``O(n log n)`` 最坏
     - ``O(1)``
     - 直接但不满足追问
   * - 计算 ``n!`` 后转字符串
     - 数值和输出规模巨大
     - 巨大
     - 完全绕开数学结构，不可取
   * - 显式维护 ``power *= 5``
     - ``O(log_5 n)``
     - ``O(1)``
     - 可行，但扩展范围时需额外防乘法溢出

状态、不变量与实现映射
----------------------

完成 ``t`` 轮循环后保持：

.. math::

   current_t=\left\lfloor\frac{n}{5^t}\right\rfloor

以及：

.. math::

   answer_t=\sum_{k=1}^{t}\left\lfloor\frac{n}{5^k}\right\rfloor

初始化 ``t=0`` 时，``current_0=n``，``answer_0=0``。

每轮先做整数除法 ``current=floor(current/5)``。利用：

.. math::

   \left\lfloor\frac{\lfloor n/5^t\rfloor}{5}\right\rfloor
   =\left\lfloor\frac{n}{5^{t+1}}\right\rfloor

可知 ``current`` 更新为下一层倍数数量；再把它加入 ``answer``，两个不变量同时推进。

正确性证明
----------

引理一：尾零数等于 ``n!`` 中因子 5 的总指数
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

每个尾零需要一对因子 ``2`` 和 ``5``。``v_2(n!)`` 与 ``v_5(n!)`` 都可写成各自质数幂倍数数量之和。
因为 ``2^k < 5^k``，对每层都有 ``floor(n/2^k) >= floor(n/5^k)``，因此
``v_2(n!) >= v_5(n!)``。每个因子 5 都能配到因子 2，尾零数就是 ``v_5(n!)``。

引理二：第 ``k`` 层恰好统计每个数的第 ``k`` 个因子 5
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``1..n`` 中能提供至少 ``k`` 个因子 5 的整数，恰好是 ``5^k`` 的倍数，共
``floor(n/5^k)`` 个。把所有层相加时，一个整数含有几个因子 5，就会在前几层各被统计一次。
例如 125 在 ``k=1,2,3`` 三层各出现一次，正好贡献三个因子 5。

因此分层求和既不会漏掉高次幂的额外因子，也不会把同一个因子重复超过一次。

引理三：循环不变量始终成立
~~~~~~~~~~~~~~~~~~~~~~~~~~

初始化已经成立。假设第 ``t`` 轮后成立，下一次整数除以 5 得到
``floor(n/5^(t+1))``，随后累加该值，正好把求和扩展到第 ``t+1`` 层。
由归纳，不变量对所有轮次成立。

引理四：循环终止时已经统计全部非零层
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``current`` 每轮被除以 5。对正 ``current``，更新后严格变小；有限轮后会成为 0。
当 ``floor(n/5^k)=0`` 时，更高次幂对应的项也全为 0，因此循环停止时没有遗漏任何贡献。

定理：算法返回 ``n!`` 的尾零数
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

由引理一，目标等于因子 5 总数；引理二给出其完整分层表达式；引理三和引理四证明循环恰好累计全部非零层，
所以返回值正确。

复杂度与语言成本
----------------

* 每轮把 ``current`` 除以 5，循环次数为 ``floor(log_5 n)+1`` 的数量级，时间 ``O(log_5 n)``；
* 只维护 ``current`` 和 ``answer``，额外空间 ``O(1)``；
* 不计算 ``n!``，不存在阶乘中间值或十进制输出载荷；
* 当前 ``n<=10^4`` 时答案很小，所有语言普通整数类型都安全；
* TypeScript 与 R 的数值运算处于精确整数范围；
* R 使用 ``%/%``，Julia 使用 ``div``，TypeScript 使用 ``Math.trunc``，均明确执行整数除法。

十语言实现
----------

C
~

.. code-block:: c

   int trailingZeroes(int n) {
       int answer = 0;
       int current = n;

       while (current > 0) {
           current /= 5;
           answer += current;
       }

       return answer;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       int trailingZeroes(int n) {
           int answer = 0;

           while (n > 0) {
               n /= 5;
               answer += n;
           }

           return answer;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def trailingZeroes(self, n: int) -> int:
           answer = 0
           current = n

           while current > 0:
               current //= 5
               answer += current

           return answer

Java
~~~~

.. code-block:: java

   class Solution {
       public int trailingZeroes(int n) {
           int answer = 0;

           while (n > 0) {
               n /= 5;
               answer += n;
           }

           return answer;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn trailing_zeroes(n: i32) -> i32 {
           let mut current = n;
           let mut answer = 0_i32;

           while current > 0 {
               current /= 5;
               answer += current;
           }

           answer
       }
   }

Go
~~

.. code-block:: go

   func trailingZeroes(n int) int {
       answer := 0

       for n > 0 {
           n /= 5
           answer += n
       }

       return answer
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function trailingZeroes(n: number): number {
       let answer = 0;
       let current = n;

       while (current > 0) {
           current = Math.trunc(current / 5);
           answer += current;
       }

       return answer;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int TrailingZeroes(int n) {
           int answer = 0;

           while (n > 0) {
               n /= 5;
               answer += n;
           }

           return answer;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function trailing_zeroes(n::Int)::Int
       current = n
       answer = 0

       while current > 0
           current = div(current, 5)
           answer += current
       end

       return answer
   end

R
~

.. code-block:: r

   trailing_zeroes <- function(n) {
     current <- n
     answer <- 0

     while (current > 0) {
       current <- current %/% 5
       answer <- answer + current
     }

     answer
   }

静态审查记录
------------

本题代码未运行、未编译、未对拍。完成了以下人工推演和静态核对：

* ``n=0``：循环不进入，返回 0；
* ``n=3``：第一次除法即得 0，返回 0；
* ``n=5``：层值 ``1 -> 0``，累计 1；
* ``n=25``：层值 ``5,1,0``，累计 6；
* ``n=10000``：层值 ``2000,400,80,16,3,0``，累计 2499；
* 十语言都在每轮先除以 5 再累加，未错误把初始 ``n`` 加入答案；
* 没有显式计算 ``5^k``，因此不存在幂更新溢出路径；
* R、Julia、TypeScript 的整数除法语义已明确；
* 所有实现只维护常数状态，没有计算阶乘、字符串或列表。

剩余风险：题解代码未在目标平台编译或执行；公开签名和整数除法语义仅做静态复核。

边界、失败路径与易错点
----------------------

* ``n`` 为负数不在合同内；当前实现不会定义负阶乘行为；
* 只统计 ``floor(n/5)`` 会漏掉 25、125 等高次幂的额外因子；
* 显式计算 ``n!`` 会迅速溢出，也不满足复杂度追问；
* 显式维护 ``power *= 5`` 时，扩展到更大整数范围必须防止乘法溢出；
* 循环条件可以写 ``current > 0``，因为除到 0 后后续所有层都为 0；
* 尾零数不是 5 的倍数个数，而是所有整数中因子 5 的指数总和。

知识更新与关联题目
------------------

本题新增：

* **质因数指数计数**：把十进制尾零转成 ``v_5(n!)``；
* **按幂分层**：``floor(n/p^k)`` 统计至少含 ``k`` 个质因子的整数；
* **除法状态替代幂状态**：反复除以 5 避免 ``5^k`` 乘法风险；
* **对数循环不变量**：状态同时表示当前层数量与已累计层和。

关联题目：

* 0793 Preimage Size of Factorial Zeroes Function：把本题函数作为单调函数做二分；
* 0204 Count Primes：同样利用质数结构，但目标是筛选而不是指数求和；
* 0171 Excel Sheet Column Number：同批另一种循环折叠，一个按字符推进，一个按整除缩小。

自检问题
--------

#. 为什么只统计因子 5，而不用同时统计因子 2？
#. ``floor(n/25)`` 这一层具体补上了什么？
#. 循环完成 ``t`` 轮后，``current`` 与 ``answer`` 分别表示什么？
#. 为什么反复除以 5 比显式维护 ``5^k`` 更稳健？

答案要点
~~~~~~~~

#. 阶乘中因子 2 的总数逐层不少于因子 5，每个 5 都能配到一个 2。
#. 补上每个 25 的倍数所含的第二个因子 5；更高层同理。
#. ``current=floor(n/5^t)``，``answer`` 是前 ``t`` 层的求和。
#. 除法状态单调缩小，不需要可能溢出的幂乘法。
