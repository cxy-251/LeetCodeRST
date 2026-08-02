0201. Bitwise AND of Numbers Range
==================================

题目信息
--------

:题号: 0201
:难度: Medium
:主题: 位运算、连续整数、二进制公共前缀
:原题: `LeetCode 0201 <https://leetcode.com/problems/bitwise-and-of-numbers-range/>`_
:重点: 闭区间内全部整数参与、端点相等、变化低位归零、非负 32 位范围

题目重述
--------

给定两个非负整数 ``left`` 和 ``right``，并保证 ``left <= right``。返回闭区间 ``[left, right]`` 中每一个整数按位与后的结果，也就是依次计算 ``left & (left+1) & ... & right``。

``left`` 和 ``right`` 均位于 ``[0, 2^31-1]``。区间包含两个端点；当 ``left == right`` 时，结果就是该整数本身。某个二进制位只有在区间内所有整数的对应位都为 ``1`` 时，才会在最终结果中保留为 ``1``。

自建示例
--------

相邻整数只有最低位变化：

.. code-block:: text

   输入：left = 10，right = 11
   输出：10
   解释：10 的二进制为 1010，11 为 1011；按位与得到 1010，即十进制 10。

区间跨过多个低位组合：

.. code-block:: text

   输入：left = 12，right = 15
   输出：12
   解释：1100、1101、1110、1111 的共同高位为 11，变化的两个低位按位与后归零，结果为 1100。

单点区间：

.. code-block:: text

   输入：left = 37，right = 37
   输出：37
   解释：区间中只有一个整数，因此没有其他数会清除它的任何置位。

问题抽象与解法选择
------------------

区间内所有整数从 ``left`` 连续增长到 ``right``。二进制高位若在两个端点中相同，
并且端点没有跨出该高位前缀对应的块，那么这一高位在区间内保持不变。
端点第一次不同的位置及其右侧属于变化后缀：连续区间会跨过某个二进制块边界，
使这些低位至少出现一次 0，所以按位与后全部清零。

因此答案等于：

* ``left`` 与 ``right`` 的最长公共二进制前缀；
* 在该前缀后补上被移除数量相同的 0。

主算法同步右移两个端点，直到它们相等：

.. code-block:: text

   shifts = 0
   while left != right:
       left  = left  logical_shift_right 1
       right = right logical_shift_right 1
       shifts += 1
   answer = left << shifts

解法取舍
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 取舍
   * - 同步右移寻找公共前缀
     - ``O(W)``
     - ``O(1)``
     - 主解法；证明和固定宽语义直接对应
   * - 反复清除 ``right`` 的最低有效 1
     - ``O(W)``
     - ``O(1)``
     - 同样高效，但公共前缀含义较隐式
   * - 枚举区间逐个按位与
     - ``O(right-left+1)``
     - ``O(1)``
     - 宽区间不可接受

``W`` 是整数位宽；在本题 32 位输入中最多循环 31 次。

状态与核心不变量
----------------

设原始端点为 ``L`` 和 ``R``。循环已经执行 ``s`` 次时保持：

.. math::

   left = \left\lfloor \frac{L}{2^s} \right\rfloor,
   \qquad
   right = \left\lfloor \frac{R}{2^s} \right\rfloor

并且：

* 已删除原始端点的最低 ``s`` 位；
* ``left`` 与 ``right`` 仍分别是原区间端点去掉这些低位后的前缀；
* 被删除的 ``s`` 个位置都属于不能在最终按位与中稳定保留的变化后缀；
* ``shifts=s``；
* 原始输入值在调用者可见范围内没有被修改。

当 ``left==right`` 时，二者共同值就是最长公共前缀。把它左移 ``s`` 位，相当于在末尾补 ``s`` 个 0。

正确性证明
----------

引理一：循环状态等于端点删除相同数量低位后的前缀
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

逻辑右移一位等价于对非负整数做向下取整除以 2。基础情况 ``s=0`` 时状态等于原端点。
每轮对两个状态各右移一位，因此归纳可得执行 ``s`` 轮后，它们分别等于
``floor(L/2^s)`` 与 ``floor(R/2^s)``。

引理二：循环停止时得到最长公共二进制前缀
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若 ``left != right``，当前剩余前缀仍存在至少一位差异，
因此公共前缀还没有完整暴露，必须继续删除一个低位。

循环第一次达到 ``left==right`` 时，原始端点删除 ``s`` 个低位后前缀相同；
删除 ``s-1`` 个低位时仍不同。故相同部分正是最长公共前缀，
而被删除的 ``s`` 位正是从第一个差异位开始的全部后缀。

引理三：公共前缀的每一位在整个区间中保持不变
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

停止时记公共前缀为 ``P``。由

.. math::

   \left\lfloor L/2^s \right\rfloor
   =
   \left\lfloor R/2^s \right\rfloor
   =P

可知 ``L`` 与 ``R`` 都位于同一个长度为 ``2^s`` 的连续块：

.. math::

   [P\cdot 2^s,(P+1)\cdot 2^s-1]

闭区间 ``[L,R]`` 完全包含在该块中，所以区间内每个整数的高位前缀都是 ``P``。
这些位若在 ``P`` 中为 1，就在所有数中为 1；若为 0，也在所有数中为 0。
因此区间按位与的高位部分恰好是 ``P``。

引理四：被删除后缀中的每一位在区间按位与中都是 0
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若 ``s=0``，没有被删除位，本引理的结论为空真。以下设 ``s>=1``。
``s`` 是使端点前缀首次相同的最小删除位数。删除 ``s-1`` 位后，两个端点仍不同；删除
``s`` 位后却同为 ``P``。因此二者删除 ``s-1`` 位后的值只能分别是 ``2P`` 与
``2P+1``，原区间必然包含边界值

.. math::

   B=(2P+1)\cdot 2^{s-1}.

``B`` 的第 ``s-1`` 位为 1，而 ``B-1`` 的该位为 0；两者都位于 ``[L,R]``，所以首个差异位
按位与为 0。更低的每个位置 ``t<s-1`` 在 ``B`` 中也都是 0，因为 ``B`` 能被
``2^(s-1)`` 整除。于是同一个区间内边界值 ``B`` 就为全部更低位提供了零见证，所有被删除位
按位与后都必须为 0。

定理：算法返回闭区间内所有整数的按位与
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

由引理三，最终结果的高位必须等于公共前缀 ``P``；由引理四，
剩余 ``s`` 个低位必须全部为 0。算法返回 ``P << s``，
恰好组合了这两部分，所以结果正确。

终止性
~~~~~~

每轮都同时删除两个非负整数的一位。固定 32 位输入最多删除 31 个有效位后
二者都成为 0，因此循环必然终止。

人工推演
--------

``[5,7]``
~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 轮次
     - ``left``
     - ``right``
     - ``shifts``
   * - 0
     - ``101``
     - ``111``
     - 0
   * - 1
     - ``10``
     - ``11``
     - 1
   * - 2
     - ``1``
     - ``1``
     - 2

公共前缀为 ``1``，恢复两个 0 得到 ``100``，返回 4。

``[26,30]``
~~~~~~~~~~~~~

.. code-block:: text

   11010 -> 1101 -> 110 -> 11
   11110 -> 1111 -> 111 -> 11

执行三轮后相等，返回 ``11 << 3 = 11000``，即 24。

复杂度与语言成本
----------------

* 设端点第一次不同位置后的后缀长度为 ``k``，循环执行 ``k`` 次，时间 ``O(k)``，
  固定 32 位下为 ``O(1)``；
* 只保存两个端点状态和移位次数，额外空间 ``O(1)``；
* C、C++、Rust、Go 与 C# 使用 ``uint32`` 状态，避免算术右移；
* Java 使用 ``>>>`` 逻辑右移；
* TypeScript 位运算内部是有符号 32 位，输入和每轮状态都用 ``>>> 0``
  重新解释为无符号位模式；本题最终结果不超过 ``2^31-1``；
* Julia 使用 ``UInt32`` 状态，再转换回 ``Int``；
* R 的整数位运算会涉及有符号 32 位解释，本实现改用精确 double 的
  ``floor(x/2)`` 与乘 ``2^shifts``。输入上界小于 ``2^31``，
  这些整数在 IEEE 754 double 中都能精确表示；
* 算法不分配与区间宽度相关的容器，也不枚举区间元素。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int rangeBitwiseAnd(int left, int right) {
           int shifts = 0;
           while (left != right) {
               left >>= 1;
               right >>= 1;
               ++shifts;
           }
           return left << shifts;
       }
   };

代码分析
--------

区间按位与只可能保留 ``left`` 和 ``right`` 的公共高位前缀。只要两端仍不同，它们在某个低位上存在分歧；从 ``left`` 到 ``right`` 的连续区间一定覆盖了该位为 0 和为 1 的数，因此这一位以及更低位的结果都必须为 0。同步右移两端，直到公共前缀对齐，最后再把这个前缀左移回原来的位宽，正好恢复所有仍可能为 1 的高位。

例如 ``[26,30]`` 的二进制端点为 ``11010`` 和 ``11110``。逐次右移后公共前缀为 ``11``，移回三位得到 ``11000``，这与区间内每个数按位相与的结果一致。区间只有一个数时循环不进入，直接返回该数。

循环每次至少去掉一位不同的低位，迭代次数不超过整数位宽 ``W``；因此时间复杂度为 ``O(W)``，除返回值外额外空间复杂度为 ``O(1)``。算法从未枚举区间中的每个整数，所以不会随 ``right-left`` 的宽度增长。

十语言实现
----------

C
~

.. code-block:: c

   #include <stdint.h>

   int rangeBitwiseAnd(int left, int right) {
       uint32_t low = (uint32_t)left;
       uint32_t high = (uint32_t)right;
       unsigned int shifts = 0;

       while (low != high) {
           low >>= 1;
           high >>= 1;
           ++shifts;
       }

       return (int)(low << shifts);
   }

C++
~~~

.. code-block:: cpp

   #include <cstdint>

   class Solution {
   public:
       int rangeBitwiseAnd(int left, int right) {
           std::uint32_t low = static_cast<std::uint32_t>(left);
           std::uint32_t high = static_cast<std::uint32_t>(right);
           unsigned int shifts = 0;

           while (low != high) {
               low >>= 1;
               high >>= 1;
               ++shifts;
           }

           return static_cast<int>(low << shifts);
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def rangeBitwiseAnd(self, left: int, right: int) -> int:
           shifts = 0
           while left != right:
               left >>= 1
               right >>= 1
               shifts += 1
           return left << shifts

Java
~~~~

.. code-block:: java

   class Solution {
       public int rangeBitwiseAnd(int left, int right) {
           int shifts = 0;
           while (left != right) {
               left >>>= 1;
               right >>>= 1;
               shifts++;
           }
           return left << shifts;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn range_bitwise_and(left: i32, right: i32) -> i32 {
           let mut low = left as u32;
           let mut high = right as u32;
           let mut shifts: u32 = 0;

           while low != high {
               low >>= 1;
               high >>= 1;
               shifts += 1;
           }

           (low << shifts) as i32
       }
   }

Go
~~

.. code-block:: go

   func rangeBitwiseAnd(left int, right int) int {
       low := uint32(left)
       high := uint32(right)
       shifts := uint(0)

       for low != high {
           low >>= 1
           high >>= 1
           shifts++
       }

       return int(low << shifts)
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function rangeBitwiseAnd(left: number, right: number): number {
       let low = left >>> 0;
       let high = right >>> 0;
       let shifts = 0;

       while (low !== high) {
           low = low >>> 1;
           high = high >>> 1;
           shifts += 1;
       }

       return (low << shifts) >>> 0;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int RangeBitwiseAnd(int left, int right) {
           uint low = (uint)left;
           uint high = (uint)right;
           int shifts = 0;

           while (low != high) {
               low >>= 1;
               high >>= 1;
               shifts++;
           }

           return (int)(low << shifts);
       }
   }

Julia
~~~~~

.. code-block:: julia

   function range_bitwise_and(left::Int, right::Int)::Int
       low = UInt32(left)
       high = UInt32(right)
       shifts = 0

       while low != high
           low >>= 1
           high >>= 1
           shifts += 1
       end

       return Int(low << shifts)
   end

R
~

.. code-block:: r

   range_bitwise_and <- function(left, right) {
     low <- as.double(left)
     high <- as.double(right)
     shifts <- 0

     while (low != high) {
       low <- floor(low / 2)
       high <- floor(high / 2)
       shifts <- shifts + 1
     }

     low * (2 ^ shifts)
   }

静态审查记录
------------

本章未运行、未编译、未对拍题解代码，只执行以下静态检查：

* 人工推演 ``[5,7]``、``[0,0]``、``[1,2]``、``[26,30]`` 与跨高位边界区间；
* 核对最大单点 ``[2147483647,2147483647]`` 不进入循环并原样返回；
* 核对 ``[0,2147483647]`` 恰好删除 31 位，公共前缀为 0，恢复后仍返回 0；
* 对照代码确认循环每轮同时右移两个端点，停止后恢复相同移位数量；
* 核对 C/C++/Rust/Go/C# 的无符号状态、Java 的 ``>>>``、TypeScript 的 ``>>>0``；
* 核对 R 仅处理可由 double 精确表示的 32 位非负整数，并且没有调用有符号 ``bitw`` 适配；
* 核对所有实现均未枚举区间，输入参数只在函数局部状态中改变；
* 核对单点区间不会进入循环，移位计数为 0。

剩余风险：实现未经过目标平台编译；不同平台若把题目签名或整数范围改为 64 位，
需要同步扩大无符号类型和 TypeScript/R 适配说明。

关键错误模式
------------

* 枚举 ``left`` 到 ``right``：宽区间会超时；
* 只计算两个端点的按位与：中间数可能继续清除位；
* 使用算术右移处理可能带符号位的适配状态：会补入 1；
* 忘记把公共前缀左移恢复：返回的是前缀值，不是原位宽结果；
* 在 R 中直接依赖 32 位有符号 ``bitwShiftR`` 覆盖完整无符号域；
* 把复杂度写成与区间长度相关；主算法只与位宽相关。

知识更新与关联题目
------------------

* ``0136 Single Number``：按位异或利用位级抵消；本题利用连续区间的公共前缀；
* ``0190 Reverse Bits``：强调固定 32 位和逻辑右移；
* ``0191 Number of 1 Bits``：使用最低有效 1 消除；
* 另一等价写法是反复执行 ``right &= right-1``，直到 ``right <= left``，
  它持续清除区间变化后缀中的 1。

自检问题与答案
--------------

问题一：为什么只保留 ``left`` 与 ``right`` 的公共前缀？
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

答案：公共前缀对应的高位在整个连续区间中不变；从第一个差异位开始，
区间跨越二进制块边界，每个低位都至少在某个区间元素中为 0，
所以按位与后全部归零。

问题二：为什么循环最多执行固定次数？
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

答案：每轮删除一个二进制低位。32 位非负输入最多删除 31 个有效位后两个状态都成为 0。

问题三：TypeScript 为什么要反复使用 ``>>>0``？
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

答案：JavaScript/TypeScript 位运算以有符号 32 位执行，``>>>0`` 把结果重新解释为
0 到 ``2^32-1`` 的无符号数值，避免后续比较和右移受符号显示影响。

问题四：算法是否修改调用者传入的端点？
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

答案：不会。各语言中的 ``left``、``right`` 或其无符号副本都是函数局部值；循环只修改局部状态。
