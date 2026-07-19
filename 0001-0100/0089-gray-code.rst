0089. Gray Code
===============

题目信息
--------

:题号: 0089
:难度: Medium
:主题: 位运算、构造、超立方体路径
:原题: `LeetCode 0089 <https://leetcode.com/problems/gray-code/>`_
:访问状态: Available
:教学重点: 二进制反射 Gray 公式、相邻一位差、循环首尾、输出规模

题目重述
--------

给定整数 ``n``，返回一个长度为 ``2^n`` 的整数序列。序列必须从 ``0`` 开始，每个整数都位于
``[0, 2^n)`` 且恰好出现一次；任意相邻元素的二进制表示只相差一位，最后一个元素与第一个元素也只
相差一位。

题目保证 ``1 <= n <= 16``，结果顺序不唯一。下面的实现自然支持 ``n = 0``，此时返回 ``[0]``。

自建示例
--------

.. code-block:: text

   输入：n = 3
   输出：[0, 1, 3, 2, 6, 7, 5, 4]

相邻异或值依次为 ``1, 2, 1, 4, 1, 2, 1``，首尾异或值为 ``4``，它们都只有一个二进制位为
``1``。

问题抽象
--------

把 ``0`` 到 ``2^n - 1`` 看作 ``n`` 维超立方体的全部顶点。两个整数只相差一个二进制位时，两个
顶点之间存在一条边。题目要求构造一条从 ``0`` 出发、访问每个顶点一次并回到起点邻居的 Hamilton
环。

二进制反射 Gray 编码给出直接公式：

.. code-block:: text

   gray(i) = i XOR (i >> 1)

依次计算 ``i = 0..2^n-1`` 即可得到满足要求的循环序列，不需要搜索或维护已访问集合。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 定位
   * - 公式 ``i XOR (i >> 1)``
     - ``Theta(2^n)``
     - ``O(1)``
     - 主解法；直接构造全部输出
   * - 反射已有序列并补最高位
     - ``Theta(2^n)``
     - ``Theta(2^n)``
     - 能解释 Gray 名称来源，但需要逐轮扩展容器
   * - 超立方体回溯
     - 指数搜索
     - ``O(2^n)``
     - 没有利用该题存在闭式构造

主解法：二进制反射 Gray 公式
----------------------------

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

循环变量 ``value`` 依次遍历全部 ``n`` 位二进制整数。第 ``value`` 个输出为：

.. code-block:: text

   value XOR (value >> 1)

循环开始时，结果中已经保存 ``0..value-1`` 的 Gray 编码。当前计算只依赖 ``value``，不会修改之前
结果。循环结束后恰好生成 ``2^n`` 个值。

为什么相邻编码只差一位
~~~~~~~~~~~~~~~~~~~~~~

设 ``value`` 的二进制末尾有 ``t`` 个连续 ``1``。从 ``value`` 加一到 ``value + 1`` 时，这 ``t``
个低位 ``1`` 变成 ``0``，再把第 ``t`` 位的 ``0`` 变成 ``1``，因此：

.. code-block:: text

   value XOR (value + 1) = 2^(t+1) - 1

右移后的两个数异或得到同一掩码右移一位。利用异或结合律：

.. code-block:: text

   gray(value) XOR gray(value + 1)
   = (2^(t+1) - 1) XOR (2^t - 1)
   = 2^t

结果是二的幂，只有一个二进制位为 ``1``，所以相邻编码只相差一位。

为什么没有重复值
~~~~~~~~~~~~~~~~

Gray 编码可以唯一还原二进制数：最高位保持不变，之后每个二进制位等于“前一个已还原的二进制位
XOR 当前 Gray 位”。因此映射 ``i -> gray(i)`` 可逆，也就具有单射性。

输入域和输出域都包含 ``2^n`` 个值。单射会覆盖整个 ``[0, 2^n)``，不会遗漏或重复任何整数。

为什么首尾也只差一位
~~~~~~~~~~~~~~~~~~~~

最后一个输入下标 ``2^n - 1`` 的低 ``n`` 位全是 ``1``。它右移一位后，低 ``n-1`` 位仍全是
``1``，两者异或只留下最高位：

.. code-block:: text

   gray(2^n - 1) = 2^(n - 1)

第一个值是 ``gray(0) = 0``，两者只相差最高位，因此序列首尾也满足循环条件。

正确性依据
~~~~~~~~~~

**范围正确。** ``value`` 和 ``value >> 1`` 都小于 ``2^n``，异或结果不会产生第 ``n`` 位之外的比特。

**相邻性正确。** 上面的末尾连续 ``1`` 推导证明任意连续输入的 Gray 编码异或值是二的幂。

**完整且唯一。** Gray 映射可逆，故 ``2^n`` 个输入产生 ``2^n`` 个互不相同的合法值。

**循环闭合。** 最后一个 Gray 值恰好只有最高位为 ``1``，与起点 ``0`` 只差一位。

**终止性。** 循环变量每次增加一，并在 ``2^n`` 处停止。

复杂度与数值边界
~~~~~~~~~~~~~~~~

输出本身包含 ``2^n`` 个整数，因此：

* 时间复杂度为 ``Theta(2^n)``；
* 返回空间为 ``Theta(2^n)``；
* 除结果外只保存循环变量和容量，工作空间为 ``O(1)``；
* ``n <= 16`` 给出 ``2^n <= 65536``，容量和结果都适合 32 位有符号整数；
* TypeScript 的位运算会转换为 32 位有符号整数，本题有效位数最多 16，不会发生截断；
* C 在分配失败时返回 ``NULL`` 且 ``returnSize = 0``，与官方非空结果区分。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stddef.h>
   #include <stdlib.h>

   int *grayCode(int n, int *returnSize) {
       *returnSize = 0;
       const int size = 1 << n;
       int *result = malloc((size_t)size * sizeof(*result));
       if (result == NULL) {
           return NULL;
       }

       for (int value = 0; value < size; ++value) {
           result[value] = value ^ (value >> 1);
       }

       *returnSize = size;
       return result;
   }

C++
~~~

.. code-block:: cpp

   #include <vector>

   class Solution {
   public:
       std::vector<int> grayCode(int n) {
           const int size = 1 << n;
           std::vector<int> result;
           result.reserve(size);

           for (int value = 0; value < size; ++value) {
               result.push_back(value ^ (value >> 1));
           }
           return result;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def grayCode(self, n: int) -> list[int]:
           size = 1 << n
           return [value ^ (value >> 1) for value in range(size)]

Java
~~~~

.. code-block:: java

   import java.util.ArrayList;
   import java.util.List;

   class Solution {
       public List<Integer> grayCode(int n) {
           int size = 1 << n;
           List<Integer> result = new ArrayList<>(size);

           for (int value = 0; value < size; ++value) {
               result.add(value ^ (value >> 1));
           }
           return result;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn gray_code(n: i32) -> Vec<i32> {
           let size = 1usize << n;
           let mut result = Vec::with_capacity(size);

           for value in 0..size {
               let value = value as i32;
               result.push(value ^ (value >> 1));
           }
           result
       }
   }

Go
~~

.. code-block:: go

   func grayCode(n int) []int {
       size := 1 << n
       result := make([]int, size)

       for value := 0; value < size; value++ {
           result[value] = value ^ (value >> 1)
       }
       return result
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function grayCode(n: number): number[] {
       const size = 2 ** n;
       const result: number[] = [];

       for (let value = 0; value < size; value += 1) {
           // n <= 16，位运算的 32 位转换不会截断有效比特。
           result.push(value ^ (value >> 1));
       }
       return result;
   }

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       public IList<int> GrayCode(int n) {
           int size = 1 << n;
           var result = new List<int>(size);

           for (int value = 0; value < size; ++value) {
               result.Add(value ^ (value >> 1));
           }
           return result;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function gray_code(n::Int)::Vector{Int}
       size = 1 << n
       result = Vector{Int}(undef, size)

       for value in 0:(size - 1)
           result[value + 1] = xor(value, value >> 1)
       end
       return result
   end

R
~

.. code-block:: r

   gray_code <- function(n) {
     size <- bitwShiftL(1L, n)
     result <- integer(size)

     for (value in seq.int(0L, size - 1L)) {
       result[value + 1L] <- bitwXor(value, bitwShiftR(value, 1L))
     }
     result
   }

验证计划与证据
--------------

本批次对 ``n = 0..16`` 的全部规模检查：

* 长度是否为 ``2^n``，首元素是否为 ``0``；
* 每个值是否位于合法范围并且互不重复；
* 每对相邻值的异或是否为二的幂；
* 非单元素序列的首尾异或是否为二的幂；
* C、C++ 使用严格警告、ASan 和 UBSan；Java、Go、TypeScript 完成编译与运行。

Rust、C#、Julia 和 R 在当前环境缺少运行时，执行接口、位宽、索引和容器语义的静态检查。

关键边界
--------

* ``n = 0`` 时容量为 1，结果只有 ``0``，不执行首尾不同元素检查；
* ``n = 16`` 时结果长度为 65536，仍在所有目标语言的安全整数范围内；
* 判断“一位差”必须检查异或值非零，并满足 ``x & (x - 1) == 0``；
* 结果顺序由公式固定，但题目只要求返回任意合法 Gray 序列。

易错点
------

* 只检查相邻元素而忘记检查最后一个与第一个，会得到非循环路径；
* 把 ``value ^ value >> 1`` 误读为 ``(value ^ value) >> 1``。各语言中移位优先级通常高于异或，正文仍
  显式使用括号表达公式；
* TypeScript 对大整数使用位运算会截断为 32 位。本题由 ``n <= 16`` 明确保证安全，不能把结论外推到
  任意位数；
* 用回溯搜索全部排列会忽略 Gray 编码的直接构造结构。

本题新增知识
------------

* 二进制反射 Gray 编码公式 ``i XOR (i >> 1)``；
* 通过末尾连续 ``1`` 推导相邻编码只差一位；
* 通过 Gray 解码可逆性证明输出唯一覆盖；
* 用最后一个编码的最高位证明循环首尾相邻。

本题强化知识
------------

* 输出规模决定时间和返回空间的下界；
* 固定宽位运算需要由题目约束证明有效位数安全；
* “异或值是二的幂”等价于两个整数恰好相差一个二进制位。

关联题目
--------

* `0060. Permutation Sequence <0060-permutation-sequence.rst>`_：
  同样直接定位组合结构中的第 ``k`` 个状态；
* `0078. Subsets <0078-subsets.rst>`_：结果规模同为 ``2^n``，但通过回溯枚举选择集合。

最小自检
--------

#. 为什么 ``gray(i) XOR gray(i+1)`` 必然是二的幂？
#. Gray 映射可逆为什么能够同时证明无重复和完整覆盖？
#. 为什么最后一个 Gray 值与 ``0`` 只差最高位？
#. TypeScript 的 32 位位运算为什么在本题安全？

答案要点
~~~~~~~~

#. ``i`` 到 ``i+1`` 翻转一个 ``0`` 和其后的全部 ``1``；该掩码与右移掩码异或后只剩一个比特。
#. 可逆映射是单射；有限且等大的输入域、输出域使单射同时成为满射。
#. ``2^n-1`` 与其右移值的低 ``n-1`` 位抵消，只保留第 ``n-1`` 位。
#. ``n <= 16`` 使所有参与位运算的值小于 ``2^16``，远低于 32 位有符号边界。
