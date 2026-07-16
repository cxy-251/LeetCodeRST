0204. Count Primes
==================

题目信息
--------

:题号: 0204
:难度: Medium
:主题: 数论、埃氏筛、最小质因子、溢出安全
:原题: `LeetCode 0204 <https://leetcode.com/problems/count-primes/>`_
:访问状态: Available
:教学重点: 严格小于 n、从 p*p 开始标记、筛法不变量、线性筛数组成本

精确契约
--------

给定非负整数 ``n``，返回严格小于 ``n`` 的质数数量。

质数是大于 1、正因数只有 1 和自身的整数。契约中的范围是半开区间 ``[0,n)``：

* ``n`` 本身永远不计入；
* ``0`` 和 ``1`` 不是质数；
* ``n<=2`` 时答案为 ``0``；
* 输入只读；
* 返回值只表示数量，不要求返回质数列表。

例如 ``n=10`` 时参与判断的是 ``0..9``，质数为 ``2,3,5,7``，答案是 ``4``。

示例与边界
----------

小边界
~~~~~~

* ``n=0``：区间为空，返回 ``0``；
* ``n=1``：只包含 ``0``，返回 ``0``；
* ``n=2``：只包含 ``0,1``，返回 ``0``；
* ``n=3``：只有质数 ``2``，返回 ``1``。

普通示例
~~~~~~~~

``n=10`` 时：

.. code-block:: text

   候选：2 3 4 5 6 7 8 9
   质数：2 3   5   7
   数量：4

``n=20`` 时质数为 ``2,3,5,7,11,13,17,19``，答案为 ``8``。

平方边界
~~~~~~~~

``n=25`` 的统计范围止于 ``24``，所以 ``25`` 本身不参与；答案是 ``9``。

``n=26`` 包含候选 ``25``。处理质数 ``5`` 时必须从 ``5*5=25`` 开始标记，确保 ``25`` 被识别为合数；答案仍是 ``9``。

问题抽象与解法选择
------------------

逐个判断每个整数是否为质数会重复试除。埃拉托斯特尼筛法把问题改写为：

#. 建立长度为 ``n`` 的标记数组，索引与整数 ``0..n-1`` 一一对应；
#. 初始假设 ``2..n-1`` 都可能是质数，明确把 ``0`` 和 ``1`` 标记为非质数；
#. 从 ``p=2`` 开始扫描；
#. 若 ``p`` 尚未被标记为合数，则 ``p`` 是质数；
#. 从 ``p*p`` 开始，把所有小于 ``n`` 的 ``p`` 的倍数标记为合数；
#. 最后统计仍未被标记的索引。

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 取舍
   * - 埃氏筛
     - ``O(n log log n)``
     - ``O(n)``
     - 主解法；一次性复用所有较小质数的标记结果
   * - 对每个候选试除到平方根
     - 约 ``O(n sqrt(n))``
     - ``O(1)``
     - 不分配筛数组，但重复做大量整除
   * - 对每个候选试除全部较小数
     - ``O(n^2)``
     - ``O(1)``
     - 明显不可取

筛数组的含义
------------

令 ``composite[x]`` 表示整数 ``x`` 是否已经被证明为合数：

* ``composite[x]=false``：尚未被较小质数证明为合数；
* ``composite[x]=true``：已经找到一个不小于 2、严格小于 ``x`` 的因数；
* ``composite[0]`` 与 ``composite[1]`` 直接设为真，因为它们不属于质数；
* 只有 ``2..n-1`` 会进入最终计数。

外层循环不直接写 ``p*p<n``，而使用等价且不会先乘法溢出的条件：

.. code-block:: text

   p <= (n - 1) / p

对正整数 ``p``，它等价于 ``p*p <= n-1``，也就是 ``p*p < n``。

核心不变量
----------

在外层循环准备处理候选 ``p`` 时保持：

#. 对每个小于 ``p`` 的质数 ``q``，所有位于 ``[q*q,n)`` 的 ``q`` 的倍数都已经标记；
#. 对每个 ``x<p*p`` 的合数，``composite[x]`` 已经为真；
#. 所有已标记索引确实是合数，质数从未被标记；
#. ``0`` 与 ``1`` 保持非质数状态；
#. 尚未标记的 ``p`` 若大于等于 2，就没有小于 ``p`` 的质因子。

若 ``p`` 已被标记，它是合数，不需要用它再次划去倍数；它的倍数会由其质因子负责。

若 ``p`` 未被标记，算法从 ``p*p`` 开始，以步长 ``p`` 标记：

.. code-block:: text

   p*p, p*(p+1), p*(p+2), ... < n

为什么从 p*p 开始
-----------------

``p`` 的更小正倍数可以写成 ``p*k``，其中 ``2<=k<p``。整数 ``k`` 至少包含一个质因子 ``q<=k<p``，所以 ``p*k`` 也是更小质数 ``q`` 的倍数。

当算法此前处理 ``q`` 时，``p*k`` 已经被标记。因此：

* 从 ``2*p`` 开始不会错，但会重复大量工作；
* 从 ``p*p`` 开始不会漏掉任何合数；
* ``p*p`` 是尚可能需要由 ``p`` 首次负责的最小倍数。

正确性证明
----------

引理一：未被更小质数标记的候选 p 必为质数
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

假设 ``p>=2`` 未被标记却是合数。令 ``q`` 是 ``p`` 的最小质因子，则 ``q<p``，并且 ``p=q*k``，其中 ``k>=q``；否则 ``k<q`` 中还会含有更小质因子，和 ``q`` 最小矛盾。

所以 ``p>=q*q``。算法处理质数 ``q`` 时会从 ``q*q`` 开始按步长 ``q`` 标记所有更大的 ``q`` 倍数，必然标记 ``p``，与 ``p`` 未被标记矛盾。因此未标记候选 ``p`` 必为质数。

引理二：从 p*p 开始不会遗漏 p 的任何必要倍数
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

任取小于 ``p*p`` 的 ``p`` 的倍数 ``x=p*k``。因为 ``x<p*p``，有 ``k<p``。``k>=2`` 时至少有一个质因子 ``q<=k<p``，于是 ``x`` 是更小质数 ``q`` 的倍数。

算法在处理 ``q`` 时已经标记 ``x``。因此小于 ``p*p`` 的 ``p`` 倍数都无需由 ``p`` 重复处理，从 ``p*p`` 开始完整且安全。

引理三：算法标记的每个数都是合数
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

标记只发生在 ``p*p + t*p``，其中 ``p>=2``、``t>=0``。该数等于 ``p*(p+t)``，两个因子都至少为 2，因此一定是合数。故算法不会把质数误标。

引理四：每个严格小于 n 的合数最终都会被标记
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

任取合数 ``x<n``，令 ``p`` 为它的最小质因子。由因子成对性质，``p<=sqrt(x)``，所以 ``p*p<=x<=n-1``，外层循环一定会处理到 ``p``。

由引理一，``p`` 处理时未被标记并被确认是质数。因为 ``x`` 是 ``p`` 的倍数且 ``x>=p*p``，从 ``p*p`` 开始的倍数序列必然到达 ``x``，所以 ``x`` 被标记。

引理五：外层循环结束后不再需要新的质因子
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

外层循环结束意味着下一个候选 ``p`` 满足 ``p*p>=n``。任意 ``x<n`` 的合数至少有一个质因子不超过 ``sqrt(x)<sqrt(n)``，这个质因子已经在循环范围内处理过。因此所有合数已经被标记，无需继续以更大的候选作为标记起点。

定理：最终未标记索引与 [0,n) 内质数一一对应
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``0`` 和 ``1`` 被显式排除。由引理三，质数不会被标记；由引理四和引理五，每个 ``2..n-1`` 中的合数都会被标记。因此最终 ``2..n-1`` 中未标记的索引恰好是全部严格小于 ``n`` 的质数，计数结果正确。

终止性
~~~~~~

外层候选 ``p`` 每轮加一，最多推进到 ``sqrt(n-1)``。内层倍数每次至少增加 ``p>=2``，并且只处理小于 ``n`` 的有限索引。最终计数循环也只扫描有限长度数组，所以算法必然终止。

人工状态推演
------------

n=10
~~~~

初始把 ``0`` 和 ``1`` 排除。

* ``p=2`` 未标记，从 ``4`` 开始标记 ``4,6,8``；
* ``p=3`` 满足 ``3*3<10`` 且未标记，从 ``9`` 开始标记 ``9``；
* 下一候选 ``4`` 已满足 ``4*4>=10``，外层结束；
* 未标记的 ``2,3,5,7`` 共 4 个。

n=20
~~~~

* ``p=2`` 标记 ``4,6,8,10,12,14,16,18``；
* ``p=3`` 标记 ``9,12,15,18``；
* ``p=4`` 已标记，跳过；
* ``5*5>=20``，无需让 ``5`` 启动标记；
* 未标记质数为 ``2,3,5,7,11,13,17,19``，共 8 个。

平方边界 25 与 26
~~~~~~~~~~~~~~~~~

* ``n=25`` 时外层条件对应 ``p*p<=24``，最大只处理 ``p=4``；``25`` 不在范围内；
* ``n=26`` 时 ``p=5`` 满足 ``5<=25/5``，算法从 ``25`` 开始标记，确保平方数不会漏掉。

复杂度与语言成本
----------------

* 埃氏筛的总标记次数为 ``n/2+n/3+n/5+...``，只对质数求和，标准上界为 ``O(n log log n)``；
* 最终计数再扫描一次 ``O(n)``，不改变总量级；
* 核心筛数组保存 ``n`` 个状态，额外空间 ``O(n)``；
* C、C++、Rust、Go、TypeScript 和 C# 实现使用字节数组，通常约为每个候选 1 字节；
* Python ``bytearray`` 同样按字节保存；
* Java ``boolean[]`` 的真实字节布局由 JVM 实现决定，但渐近空间仍为 ``O(n)``；
* Julia ``falses(n)`` 返回位压缩 ``BitVector``，索引 ``value+1`` 对应整数 ``value``；
* R ``logical`` 向量通常比位压缩结构更重，可能为每个元素使用数个字节，仍是 ``O(n)``；
* TypeScript 使用 ``Uint8Array``，避免普通 ``Array<boolean>`` 的对象与槽位开销；
* C 分配失败返回 ``-1``，它位于合法质数计数域外，避免把资源失败伪装成答案 0。

十语言实现
----------

C
~

.. code-block:: c

   #include <stdint.h>
   #include <stdlib.h>

   int countPrimes(int n) {
       if (n <= 2) {
           return 0;
       }

       if ((uintmax_t)n > (uintmax_t)SIZE_MAX / sizeof(unsigned char)) {
           return -1;
       }

       size_t length = (size_t)n;
       unsigned char *composite = calloc(length, sizeof(*composite));
       if (composite == NULL) {
           return -1;
       }

       composite[0] = 1;
       composite[1] = 1;

       for (int p = 2; p <= (n - 1) / p; ++p) {
           if (composite[p] != 0) {
               continue;
           }

           size_t multiple = (size_t)p * (size_t)p;
           while (multiple < length) {
               composite[multiple] = 1;
               multiple += (size_t)p;
           }
       }

       int count = 0;
       for (int value = 2; value < n; ++value) {
           if (composite[value] == 0) {
               ++count;
           }
       }

       free(composite);
       return count;
   }

C++
~~~

.. code-block:: cpp

   #include <cstdint>
   #include <vector>

   class Solution {
   public:
       int countPrimes(int n) {
           if (n <= 2) {
               return 0;
           }

           std::vector<std::uint8_t> composite(
               static_cast<std::size_t>(n), 0
           );
           composite[0] = 1;
           composite[1] = 1;

           for (int p = 2; p <= (n - 1) / p; ++p) {
               if (composite[static_cast<std::size_t>(p)] != 0) {
                   continue;
               }

               for (long long multiple = 1LL * p * p;
                    multiple < n;
                    multiple += p) {
                   composite[static_cast<std::size_t>(multiple)] = 1;
               }
           }

           int count = 0;
           for (int value = 2; value < n; ++value) {
               if (composite[static_cast<std::size_t>(value)] == 0) {
                   ++count;
               }
           }
           return count;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def countPrimes(self, n: int) -> int:
           if n <= 2:
               return 0

           composite = bytearray(n)
           composite[0] = 1
           composite[1] = 1

           p = 2
           while p <= (n - 1) // p:
               if composite[p] == 0:
                   multiple = p * p
                   while multiple < n:
                       composite[multiple] = 1
                       multiple += p
               p += 1

           return sum(1 for value in range(2, n) if composite[value] == 0)

Java
~~~~

.. code-block:: java

   class Solution {
       public int countPrimes(int n) {
           if (n <= 2) {
               return 0;
           }

           boolean[] composite = new boolean[n];
           composite[0] = true;
           composite[1] = true;

           for (int p = 2; p <= (n - 1) / p; p++) {
               if (composite[p]) {
                   continue;
               }

               for (long multiple = (long) p * p;
                    multiple < n;
                    multiple += p) {
                   composite[(int) multiple] = true;
               }
           }

           int count = 0;
           for (int value = 2; value < n; value++) {
               if (!composite[value]) {
                   count++;
               }
           }
           return count;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn count_primes(n: i32) -> i32 {
           if n <= 2 {
               return 0;
           }

           let limit = n as usize;
           let mut composite = vec![0_u8; limit];
           composite[0] = 1;
           composite[1] = 1;

           let mut p = 2_usize;
           while p <= (limit - 1) / p {
               if composite[p] == 0 {
                   let mut multiple = p * p;
                   while multiple < limit {
                       composite[multiple] = 1;
                       multiple += p;
                   }
               }
               p += 1;
           }

           let mut count = 0_i32;
           for value in 2..limit {
               if composite[value] == 0 {
                   count += 1;
               }
           }
           count
       }
   }

Go
~~

.. code-block:: go

   func countPrimes(n int) int {
       if n <= 2 {
           return 0
       }

       composite := make([]byte, n)
       composite[0] = 1
       composite[1] = 1

       for p := 2; p <= (n-1)/p; p++ {
           if composite[p] != 0 {
               continue
           }

           for multiple := int64(p) * int64(p);
               multiple < int64(n);
               multiple += int64(p) {
               composite[int(multiple)] = 1
           }
       }

       count := 0
       for value := 2; value < n; value++ {
           if composite[value] == 0 {
               count++
           }
       }
       return count
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function countPrimes(n: number): number {
       if (n <= 2) {
           return 0;
       }

       const composite = new Uint8Array(n);
       composite[0] = 1;
       composite[1] = 1;

       for (let p = 2; p <= Math.floor((n - 1) / p); p += 1) {
           if (composite[p] !== 0) {
               continue;
           }

           for (let multiple = p * p; multiple < n; multiple += p) {
               composite[multiple] = 1;
           }
       }

       let count = 0;
       for (let value = 2; value < n; value += 1) {
           if (composite[value] === 0) {
               count += 1;
           }
       }
       return count;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int CountPrimes(int n) {
           if (n <= 2) {
               return 0;
           }

           byte[] composite = new byte[n];
           composite[0] = 1;
           composite[1] = 1;

           for (int p = 2; p <= (n - 1) / p; p++) {
               if (composite[p] != 0) {
                   continue;
               }

               for (long multiple = (long)p * p;
                    multiple < n;
                    multiple += p) {
                   composite[(int)multiple] = 1;
               }
           }

           int count = 0;
           for (int value = 2; value < n; value++) {
               if (composite[value] == 0) {
                   count++;
               }
           }
           return count;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function count_primes(n::Int)::Int
       if n <= 2
           return 0
       end

       # Julia 索引 value + 1 对应整数 value。
       composite = falses(n)
       composite[1] = true
       composite[2] = true

       p = 2
       while p <= (n - 1) ÷ p
           if !composite[p + 1]
               multiple = p * p
               while multiple < n
                   composite[multiple + 1] = true
                   multiple += p
               end
           end
           p += 1
       end

       count = 0
       value = 2
       while value < n
           if !composite[value + 1]
               count += 1
           end
           value += 1
       end
       return count
   end

R
~

.. code-block:: r

   count_primes <- function(n) {
     n <- as.integer(n)
     if (n <= 2L) {
       return(0L)
     }

     # R 索引 value + 1 对应整数 value。
     composite <- rep.int(FALSE, n)
     composite[1L] <- TRUE
     composite[2L] <- TRUE

     p <- 2L
     while (p <= (n - 1L) %/% p) {
       if (!composite[p + 1L]) {
         # double 在当前非负整数输入域中精确保存这些索引，
         # 避免 R 32 位整数乘法边界参与循环控制。
         multiple <- as.double(p) * as.double(p)
         while (multiple < n) {
           composite[as.integer(multiple) + 1L] <- TRUE
           multiple <- multiple + p
         }
       }
       p <- p + 1L
     }

     indices <- seq.int(3L, n)
     as.integer(sum(!composite[indices]))
   }

逐语言静态审查
--------------

C
~

* ``n<=2`` 在访问索引 0、1 前返回；
* ``uintmax_t`` 容量检查发生在分配前；
* ``calloc`` 失败返回 ``-1``，成功路径最终释放；
* 外层除法条件保证 ``p*p<n``，倍数索引用 ``size_t``；
* 只读取输入整数，没有其他所有权。

C++、Java、C#
~~~~~~~~~~~~~

* 三者都把内层倍数提升到 64 位，避免尾部加法和乘法触碰 32 位上界；
* C++ 使用 ``uint8_t``，不依赖 ``vector<bool>`` 的代理引用语义；
* Java ``boolean[]`` 与 C# ``byte[]`` 均按长度 ``n`` 分配；
* 最终循环严格使用 ``value<n``。

Python、Go、TypeScript
~~~~~~~~~~~~~~~~~~~~~

* Python ``bytearray``、Go ``[]byte`` 和 TypeScript ``Uint8Array`` 明确使用字节标记；
* Go 内层倍数使用 ``int64``；
* TypeScript 的整数索引处于安全整数与平台约束范围，数组元素只有 0/1；
* 三者都没有把 ``n`` 自身计入。

Rust
~~~~

* ``n<=2`` 后再转换为 ``usize``，不会把负数转换成巨大无符号值；
* ``p <= (limit-1)/p`` 保证 ``p*p`` 对当前平台长度安全；
* ``Vec<u8>`` 的容量与 ``n`` 成正比；
* 返回计数不超过 ``n``，平台题目接口使用 ``i32``。

Julia
~~~~~

* ``falses(n)`` 是一基索引位向量，整数 ``value`` 映射到 ``value+1``；
* ``n<=2`` 分支避免空范围和 0/1 索引问题；
* 外层与内层都使用显式 ``while``，不依赖反向或空 ``UnitRange``；
* 最终计数只访问 ``2..n-1`` 对应位置。

R
~

* ``n>=3`` 后 ``seq.int(3L,n)`` 方向确定，不触发相反步长问题；
* logical 向量索引 ``value+1`` 与整数域一致；
* 倍数状态用精确 double，避免 32 位整数乘法边界；
* 结果只统计逻辑向量第 3 到第 ``n`` 个位置，对应整数 ``2..n-1``。

静态审查证据与剩余风险
----------------------

本章只进行了：

* ``n=0,1,2,3,10,20,25,26`` 的人工推演；
* ``p*p`` 起点、最小质因子、标记完整性和质数不误标的静态证明；
* 十语言筛长度、索引、循环边界、乘法位宽、容器成本和失败路径核对；
* RST 单文件、十语言内联和仓库状态一致性检查。

题解代码没有运行、没有编译、没有对拍、没有属性测试或 sanitizer。剩余风险主要是不同运行时对大数组的实际内存上限、Java/R/C# 容器的具体字节布局，以及平台外极端 ``n`` 导致的分配失败；这些不改变算法证明，但会影响可执行资源上限。

关键易错点
----------

#. 把循环写成 ``value<=n``，错误地把 ``n`` 本身计入；
#. 忘记排除 ``0`` 和 ``1``；
#. 不判断 ``p`` 是否已标记，导致合数也重复启动倍数扫描；
#. 从 ``2*p`` 开始却忽略重复标记成本；
#. 从 ``p*p`` 开始但没有证明较小倍数已经处理；
#. 直接用可能溢出的 ``p*p<n`` 控制外层循环；
#. 把筛数组的 ``O(n)`` 空间误写为 ``O(1)``；
#. C 分配失败返回 0，把资源错误伪装成合法答案。

知识更新与关联题目
------------------

* ``0172 Factorial Trailing Zeroes`` 同样需要用除法形式表达乘法边界；
* 本题建立“最小质因子保证合数在平方根前被发现”的数论模板；
* 后续分解质因数、区间筛和欧拉筛都可以复用筛数组与标记不变量；
* ``p*p`` 起点体现了常见优化原则：只省略那些已经由更早状态完整覆盖的工作。

自检问题与答案
--------------

问题一
~~~~~~

为什么 ``n=25`` 时外层不需要处理 ``p=5``，而 ``n=26`` 时需要？

答案：统计范围是 ``[0,n)``。``n=25`` 时最大候选是 24，``25`` 不参与；``n=26`` 时 25 在范围内，需要由 ``5*5`` 标记。

问题二
~~~~~~

为什么未标记的 ``p`` 一定是质数？

答案：若 ``p`` 是合数，它有一个严格小于 ``p`` 的最小质因子 ``q``，且 ``p>=q*q``；处理 ``q`` 时本应已经标记 ``p``，产生矛盾。

问题三
~~~~~~

为什么可以跳过小于 ``p*p`` 的 ``p`` 倍数？

答案：这些倍数写成 ``p*k`` 且 ``k<p``；``k`` 含有某个更小质因子，所以该倍数已经由更小质数的扫描标记。

问题四
~~~~~~

为什么外层使用 ``p <= (n-1)/p``？

答案：它与 ``p*p<n`` 等价，却在比较前不计算平方，因此避免固定宽整数乘法溢出。

问题五
~~~~~~

本题为什么不是 ``O(1)`` 额外空间？

答案：算法为 ``0..n-1`` 的每个整数保存一个筛状态；无论状态是位、字节还是 logical 元素，数量都与 ``n`` 成正比，因此空间是 ``O(n)``。
