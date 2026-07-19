0137. Single Number II
======================

题目信息
--------

:题号: 0137
:难度: Medium
:主题: 数组、位运算、有限状态机、模计数
:原题: `LeetCode 0137 <https://leetcode.com/problems/single-number-ii/>`_
:访问状态: Available
:教学重点: 用 ``ones`` 与 ``twos`` 并行编码每一位的出现次数模 ``3``，并处理完整有符号 32 位输入域

题目重述
--------

给定一个非空整数数组，恰好有一个整数只出现一次，其余每个不同整数都恰好出现三次。返回只出现一次的整数。

算法需要在线性时间内完成，并且只能使用不随输入长度增长的额外空间。

精确契约
~~~~~~~~

* ``1 <= nums.length <= 3 * 10^4``；根据出现次数条件，数组长度模 ``3`` 等于 ``1``。
* 每个元素位于 ``[-2^31, 2^31-1]``，必须保留完整 32 位有符号值，包括 ``-2^31``。
* 恰有一个值出现一次，其他值各出现三次；相同值不保证相邻。
* 返回唯一值，算法只读取输入，不排序也不修改数组。
* 目标复杂度为 ``O(n)`` 时间和 ``O(1)`` 算法额外空间。

自建示例
~~~~~~~~

对 ``nums = [6, -9, 6, 12, 12, 6, 12]``，``6`` 和 ``12`` 各出现三次，答案为 ``-9``。
算法不需要先把相同值放在一起，而是让所有整数的同一二进制位共同通过一个模三状态机。

边界例 ``nums = [-2147483648, 7, 7, 7]`` 的答案是 ``-2147483648``。这个例子会区分两类实现：
固定 32 位语言可以直接保留符号位；R 的普通整数无法无损表示这个端点，不能把输入盲目交给
``as.integer`` 和 ``bitwXor``。

问题抽象
--------

先只看某一个二进制位。处理前缀时，这一位出现 ``1`` 的次数只需保留模 ``3`` 的余数：``0``、``1``、
``2``。读到下一个输入位后，状态按下面的循环转移：

.. code-block:: text

   输入位为 0：状态不变
   输入位为 1：0 -> 1 -> 2 -> 0

32 个二进制位彼此独立。可以为每一位建立一个计数器，也可以用两个机器整数让所有位并行执行相同的三状态转移。
主解采用第二种表示。

解法取舍
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间
     - 算法额外空间
     - 取舍
   * - 排序后按三元组检查
     - ``O(n log n)``
     - 依排序实现而定
     - 不满足线性时间，并可能修改输入
   * - 哈希频次表
     - 期望 ``O(n)``
     - ``O(n)``
     - 直观，但不满足常量空间
   * - 32 个逐位计数器
     - ``O(32n)``
     - ``O(32) = O(1)``
     - 容易证明；R 适配器采用这一方案
   * - ``ones/twos`` 位并行状态机
     - ``O(n)``
     - ``O(1)``
     - 主解；每个整数操作同时推进全部位

有限状态表示
------------

对任意位 ``b``，用 ``twos_b`` 和 ``ones_b`` 编码这一位出现次数模 ``3``：

.. list-table::
   :header-rows: 1

   * - 余数
     - ``twos_b``
     - ``ones_b``
     - 状态记号 ``(twos_b, ones_b)``
   * - ``0``
     - ``0``
     - ``0``
     - ``00``
   * - ``1``
     - ``0``
     - ``1``
     - ``01``
   * - ``2``
     - ``1``
     - ``0``
     - ``10``

``11`` 不是合法状态。两个完整整数 ``ones`` 与 ``twos`` 的第 ``b`` 位，分别保存表中对应列；因此只用
两个标量就能并行表示 32 个状态机。

状态转移与更新顺序
------------------

读入整数 ``value`` 后，依次执行：

.. code-block:: text

   ones = (ones XOR value) AND (NOT twos)
   twos = (twos XOR value) AND (NOT ones)

第二行读取的是 **更新后的** ``ones``。考察一位输入 ``x``，合法状态的完整转移如下：

.. list-table::
   :header-rows: 1

   * - 旧余数
     - ``x``
     - 新 ``ones``
     - 新 ``twos``
     - 新余数
   * - ``0``
     - ``0``
     - ``0``
     - ``0``
     - ``0``
   * - ``1``
     - ``0``
     - ``1``
     - ``0``
     - ``1``
   * - ``2``
     - ``0``
     - ``0``
     - ``1``
     - ``2``
   * - ``0``
     - ``1``
     - ``1``
     - ``0``
     - ``1``
   * - ``1``
     - ``1``
     - ``0``
     - ``1``
     - ``2``
   * - ``2``
     - ``1``
     - ``0``
     - ``0``
     - ``0``

输入位为 ``0`` 时状态保持；输入位为 ``1`` 时恰好执行 ``00 -> 01 -> 10 -> 00``。掩码
``NOT twos`` 与 ``NOT ones`` 同时保证 ``ones``、``twos`` 不会在同一位都为 ``1``。

核心不变量
~~~~~~~~~~

处理完任意前缀后，对每个二进制位 ``b``：

* ``(twos_b, ones_b)`` 是合法状态 ``00``、``01`` 或 ``10``；
* 该状态准确编码此前所有元素在第 ``b`` 位上 ``1`` 的数量模 ``3``；
* ``ones & twos == 0``；
* 输入数组仍未修改。

代码中的两个赋值就是不变量的唯一状态转移。不能把它们理解为两个互不相关的频次集合。

正确性证明
----------

引理一：单个位的更新式实现正确的模三状态转移。
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

合法旧状态只有 ``00``、``01``、``10``。上表穷尽了每个旧状态与输入位 ``0``、``1`` 的六种组合。
当输入为 ``0`` 时余数不变；输入为 ``1`` 时余数增加一并对 ``3`` 取模。因此更新式对任意一位都正确，
并且不会产生非法状态 ``11``。

引理二：处理任意前缀后，核心不变量成立。
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

空前缀时 ``ones = twos = 0``，每一位的出现次数也是 ``0``，不变量成立。假设某个前缀后不变量成立，
读入下一个整数时，位运算对每一位独立执行引理一的转移，所以每一位的新状态准确表示新前缀计数模 ``3``。
由归纳法，不变量始终成立。

定理：扫描结束后 ``ones`` 等于唯一元素。
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

设唯一元素为 ``u``。对任意位 ``b``，所有出现三次的整数在这一位贡献 ``3k`` 个 ``1``，模 ``3`` 后为
``0``；``u`` 只出现一次，额外贡献恰好是 ``u`` 的第 ``b`` 位。因此最终余数只能是 ``0`` 或 ``1``，
``twos_b = 0``，而 ``ones_b`` 恰好等于 ``u`` 的第 ``b`` 位。所有位都成立，所以 ``ones`` 的完整位模式
就是 ``u``，算法返回正确答案。

负数与符号位
~~~~~~~~~~~~

上述证明对包括符号位在内的每一位成立，不依赖整数为正。固定宽语言把负数视作其机器位模式；三个相同负数的
每一位仍贡献三次并归零。Python 使用任意精度整数，``~x = -(x+1)`` 的无限符号扩展模型同样逐位满足
这组三状态等式，因此不会因为缺少显式 32 位掩码而丢失负数答案。

R 适配器的独立证明
~~~~~~~~~~~~~~~~~~

R 版本不用 ``ones/twos``，而是把每个输入映射到 ``[0, 2^32-1]`` 中完全相同的 32 位无符号位模式，
对 32 位分别计数并对 ``3`` 取模。三次出现的值在每位留下 ``0``，唯一值留下自己的位。重建结果若不小于
``2^31``，再减去 ``2^32`` 恢复有符号值。因此 R 特化实现与主解返回同一个数学答案，并覆盖 ``-2^31``。

复杂度与最优性
--------------

主解对数组扫描一次，每个元素只执行固定数量的整数位运算，时间为 ``Theta(n)``，算法额外空间为
``Theta(1)``。R 版本执行固定 32 位循环，时间为 ``Theta(32n) = Theta(n)``，32 个计数器仍是
``Theta(1)`` 空间。所有版本返回一个标量，没有额外输出载荷。

任何正确算法都必须读取每个位置，否则未读位置可以改变哪个值没有组成三元组。因此读取下界为
``Omega(n)``，主解已经达到渐近最优时间。

十语言实现
----------

C
~

.. code-block:: c

   int singleNumber(int *nums, int numsSize) {
       int ones = 0;
       int twos = 0;

       for (int index = 0; index < numsSize; ++index) {
           ones = (ones ^ nums[index]) & ~twos;
           twos = (twos ^ nums[index]) & ~ones;
       }
       return ones;
   }

C++
~~~

.. code-block:: cpp

   #include <vector>

   class Solution {
   public:
       int singleNumber(std::vector<int>& nums) {
           int ones = 0;
           int twos = 0;

           for (int value : nums) {
               ones = (ones ^ value) & ~twos;
               twos = (twos ^ value) & ~ones;
           }
           return ones;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def singleNumber(self, nums: list[int]) -> int:
           ones = 0
           twos = 0

           for value in nums:
               ones = (ones ^ value) & ~twos
               twos = (twos ^ value) & ~ones
           return ones

Java
~~~~

.. code-block:: java

   class Solution {
       public int singleNumber(int[] nums) {
           int ones = 0;
           int twos = 0;

           for (int value : nums) {
               ones = (ones ^ value) & ~twos;
               twos = (twos ^ value) & ~ones;
           }
           return ones;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn single_number(nums: Vec<i32>) -> i32 {
           let mut ones = 0_i32;
           let mut twos = 0_i32;

           for value in nums {
               ones = (ones ^ value) & !twos;
               twos = (twos ^ value) & !ones;
           }
           ones
       }
   }

Go
~~

.. code-block:: go

   func singleNumber(nums []int) int {
       ones, twos := 0, 0

       for _, value := range nums {
           ones = (ones ^ value) &^ twos
           twos = (twos ^ value) &^ ones
       }
       return ones
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function singleNumber(nums: number[]): number {
       let ones = 0;
       let twos = 0;

       for (const value of nums) {
           ones = (ones ^ value) & ~twos;
           twos = (twos ^ value) & ~ones;
       }
       return ones;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int SingleNumber(int[] nums) {
           int ones = 0;
           int twos = 0;

           foreach (int value in nums) {
               ones = (ones ^ value) & ~twos;
               twos = (twos ^ value) & ~ones;
           }
           return ones;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function single_number(nums::Vector{Int})::Int
       ones = 0
       twos = 0

       for value in nums
           ones = xor(ones, value) & ~twos
           twos = xor(twos, value) & ~ones
       end
       return ones
   end

R
~

R 的普通整数不能覆盖完整官方输入域，所以这里使用能精确表示所有 32 位整数的 ``double`` 数值和 32 个固定
计数器，不调用会把越界数值强制转为 ``NA`` 的 ``as.integer``。

.. code-block:: r

   single_number <- function(nums) {
     bit_counts <- integer(32L)
     two31 <- 2147483648
     two32 <- 4294967296

     for (value in nums) {
       unsigned <- if (value < 0) value + two32 else value
       for (bit in seq_len(32L)) {
         current_bit <- as.integer(unsigned %% 2)
         bit_counts[[bit]] <-
           (bit_counts[[bit]] + current_bit) %% 3L
         unsigned <- unsigned %/% 2
       }
     }

     result <- 0
     place_value <- 1
     for (bit in seq_len(32L)) {
       if (bit_counts[[bit]] == 1L) {
         result <- result + place_value
       }
       place_value <- place_value * 2
     }

     if (result >= two31) result - two32 else result
   }

语言适配与位宽语义
------------------

* **C、C++**：LeetCode 平台的 ``int`` 对应题目的 32 位域；``~``、``&``、``^`` 作用于同一整数
  表示。实现不做加减乘法，不存在算术溢出路径。
* **Python**：整数任意精度，按位非定义为 ``-(x+1)``；无限符号扩展仍保持状态机的逐位布尔等式。
* **Java、C#、Rust**：分别使用固定 32 位的 ``int``、``int``、``i32``，包括符号位在内直接执行状态机。
* **Go**：``int`` 可能是 32 或 64 位；官方 32 位值被符号扩展到宿主宽度后，三次相同模式仍逐位归零。
  ``&^`` 是 Go 的按位 AND NOT，正好对应公式中的 ``AND (NOT mask)``。
* **TypeScript**：对 ``number`` 使用 ``~``、``&``、``^`` 时进入有符号 32 位位运算语义；官方输入恰好
  限定在该范围内，输出再以 ``number`` 承载。超出 32 位的自定义扩展会被截断。
* **Julia**：``Int`` 使用宿主字长；官方值在常见目标上可表示，``xor``、``&``、``~`` 在同一字长内运算。
* **R**：R 的位运算先把 numeric 强制为 32 位 integer，越界可能产生 ``NA``；而官方域包含
  ``-2^31``。特化实现用精确的双精度整数运算拆出 32 位，返回值可能是 R ``double``，但数值与平台答案一致。

相关语义可在 `Python 表达式参考 <https://docs.python.org/3/reference/expressions.html#binary-bitwise-operations>`_、
`ECMAScript 规范 <https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numberbitwiseop>`_
和 `R bitwise 文档 <https://stat.ethz.ch/R-manual/R-devel/library/base/html/bitwise.html>`_ 中核对。

静态审查记录
------------

本题按现行规则完成了以下静态审查：

* 人工推演题目页面示例，以及单元素、唯一值为零、唯一值为负数、重复值为负数和 ``-2^31`` 端点；
* 逐位核对合法状态 ``00``、``01``、``10`` 在输入位为 ``0``、``1`` 时的六种转移；
* 确认十种实现中第二条更新都读取新 ``ones``，Go ``&^`` 与其他语言的 AND NOT 语义一致；
* 静态核对 Python 无限符号扩展、TypeScript 32 位转换、Go/Julia 宿主位宽，以及 R 对完整 32 位域的
  数值适配和独立逐位证明；
* 对照代码确认输入只读、返回类型和复杂度表述与各语言实际实现一致。

本轮没有运行或编译任何题解代码，没有执行示例、对拍、穷举、属性测试、sanitizer 或目标语言最小程序。
剩余风险主要是十语言提交模板与真实编译器未被动态确认，尤其是 Julia/R 平台适配边界；本文不把静态审查
表述为运行通过。

关键边界与易错点
----------------

* ``ones`` 与 ``twos`` 的状态位顺序必须写清；本文状态 ``01`` 表示 ``twos=0, ones=1``。
* 第二条转移必须读取更新后的 ``ones``。若读取旧值，余数 ``1`` 接收下一个 ``1`` 时无法正确进入余数 ``2``。
* 不能只处理 31 个“数值位”而遗漏符号位；唯一元素可以是任意 32 位负数。
* ``ones`` 与 ``twos`` 在同一位不能同时为 ``1``，最终在合法输入上 ``twos`` 应回到 ``0``。
* 普通异或只能消去出现两次的值，不能直接解决出现三次的契约。
* R 的 ``as.integer(-2147483648)`` 不适合作为本题完整输入域适配，必须保留数值双精度表示。
* 解法严格依赖“其他值恰好出现三次”；出现次数改为其他 ``k`` 时需要重新设计模 ``k`` 状态。

学习链
------

本题把 `0136. Single Number <0136-single-number.rst>`_ 的“每位模 ``2`` 消去”推广为“每位模 ``3``
有限状态机”。可以继续学习：

* ``0260. Single Number III``：先异或得到两个唯一值的差异，再按一个置位分组；
* 数字电路中的状态编码：用少量寄存器并行表达多个独立有限状态机；
* 一般化“其他值出现 ``k`` 次”：逐位计数容易推广，压缩布尔公式则需要为模 ``k`` 设计状态编码。

带答案自检
----------

**问：``ones`` 和 ``twos`` 的某一位分别表示什么？**

答：``ones`` 位为 ``1`` 表示这一位的出现次数模三为 ``1``；``twos`` 位为 ``1`` 表示余数为 ``2``；
两者都为 ``0`` 表示余数为 ``0``。

**问：为什么可以只证明一个二进制位？**

答：按位非、与、异或都独立作用于每个位，没有进位。单个位状态机正确，就能并行推广到整个整数位模式。

**问：为什么最终答案在 ``ones`` 而不是 ``ones | twos``？**

答：三次出现的值全部贡献 ``0``，唯一值每位只贡献 ``0`` 或 ``1``，所以最终每位余数不可能是 ``2``；
``twos`` 全零，``ones`` 恰好保存唯一值。

**问：R 为什么没有直接翻译两条状态公式？**

答：R 的普通整数与位运算无法无损覆盖官方的 ``-2^31`` 端点。32 个计数器仍是常量空间，并通过精确
双精度整数拆位覆盖完整题目域，因此这是保持问题语义的必要适配，而不是随意换算法。
