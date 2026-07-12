0066. Plus One
==============

题目信息
--------

:题号: 0066
:难度: Easy
:主题: 数组、进位、从右向左扫描
:原题: `LeetCode 0066 <https://leetcode.com/problems/plus-one/>`_
:访问状态: Available
:教学重点: 末位加一、连续进位、全 9 扩位、返回快照

题目重述
--------

给定一个非空整数数组 ``digits``，每个元素是一位十进制数字，整体按从高位到低位的顺序表示一个
非负整数。数组没有前导零。返回该整数加一后的数字数组。

题目保证：

* ``1 <= digits.length <= 100``；
* ``0 <= digits[i] <= 9``；
* 输入表示中除数字 ``0`` 本身外没有前导零。

主实现返回独立结果，不让调用者观察到输入数组被修改。结果长度要么仍为 ``n``，要么在输入全部为
``9`` 时增长为 ``n + 1``。

自建示例
--------

无需连续进位
~~~~~~~~~~~~

.. code-block:: text

   输入：digits = [1, 2, 7]
   输出：[1, 2, 8]

部分连续进位
~~~~~~~~~~~~

.. code-block:: text

   输入：digits = [4, 9, 9]
   输出：[5, 0, 0]

全部为 9
~~~~~~~~

.. code-block:: text

   输入：digits = [9, 9, 9]
   输出：[1, 0, 0, 0]

单个零
~~~~~~

.. code-block:: text

   输入：digits = [0]
   输出：[1]

问题抽象
--------

从最低位开始执行十进制加一：

* 当前数字小于 ``9`` 时，将它加一，进位立即结束；
* 当前数字等于 ``9`` 时，该位变为 ``0``，进位继续向左；
* 若扫描越过最高位仍有进位，说明原数组全部为 ``9``，结果是一个 ``1`` 后接 ``n`` 个 ``0``。

只有进位路径上的后缀会发生变化，因此无需把数组转换成整数，也不会遇到整数宽度限制。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 定位
   * - 从右向左传播进位
     - ``O(n)``
     - ``O(n)`` 返回快照
     - 主解法；最坏扫描全部数字
   * - 转换为整数后加一
     - 取决于整数实现
     - 取决于整数实现
     - 最长 100 位，固定宽整数无法表达
   * - 递归处理高位
     - ``O(n)``
     - ``O(n)`` 递归栈
     - 与进位逻辑等价，额外占用调用栈

主解法：从最低位传播进位
------------------------

核心不变量
~~~~~~~~~~

处理下标 ``index`` 之前：

* ``index`` 右侧的所有原始 ``9`` 已经变为 ``0``；
* 仍有且只有一个值为 ``1`` 的进位需要加入 ``result[index]``；
* ``index`` 左侧尚未修改，仍与输入相同；
* 一旦遇到小于 ``9`` 的数字，给它加一即可吸收全部进位，左侧无需变化。

为什么首次非 9 可以立即返回
~~~~~~~~~~~~~~~~~~~~~~~~~~

假设从右向左遇到的第一个非 ``9`` 数字是 ``d``。它右侧全是 ``9``，加一后这些位全部归零；
``d + 1 <= 9``，不会产生新的进位。更高位保持不变，因此结果已经完整确定。

为什么全 9 只需前置 1
~~~~~~~~~~~~~~~~~~~~

若没有遇到非 ``9`` 数字，原数形如 ``99...9``。每一位都因进位变为 ``0``，最终越过最高位的进位
成为新的最高位 ``1``，所以结果唯一为 ``10...0``。

正确性依据
~~~~~~~~~~

**局部转移正确。** 十进制中 ``9 + 1`` 的当前位是 ``0`` 并向左产生一个进位；``d + 1`` 在
``d < 9`` 时仍是一位数并终止进位。代码逐位执行这两个规则。

**结果完整。** 若扫描遇到非 ``9``，右侧连续 ``9`` 已全部归零，该位吸收进位，左侧不受影响；若扫描
结束，所有位均为 ``9``，新增最高位 ``1`` 表示剩余进位。两种情况覆盖全部输入。

**终止性。** 下标每轮向左移动一位，最多处理 ``n`` 个元素。

复杂度
~~~~~~

设输入长度为 ``n``：

* 最好情况只修改末位，算法扫描时间为 ``O(1)``；最坏情况输入全为 ``9``，时间复杂度为 ``O(n)``；
* 为保持输入不可观察修改，十语言都建立结果快照，返回空间与额外空间均为 ``O(n)``；
* 若平台允许原地修改，除扩位情况外可把算法工作空间降为 ``O(1)``，但返回数组仍占 ``O(n)``；
* C 分配 ``n + 1`` 个 ``int``，由 ``n <= 100`` 保证容量乘积安全。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stddef.h>
   #include <stdlib.h>
   #include <string.h>

   int *plusOne(int *digits, int digitsSize, int *returnSize) {
       const size_t capacity = (size_t)digitsSize + 1;
       int *result = malloc(capacity * sizeof(int));
       if (result == NULL) {
           *returnSize = 0;
           return NULL;
       }

       memcpy(result, digits, (size_t)digitsSize * sizeof(int));

       for (int index = digitsSize - 1; index >= 0; --index) {
           if (result[index] < 9) {
               ++result[index];
               *returnSize = digitsSize;
               return result;
           }
           result[index] = 0;
       }

       // 全部数字原来都是 9，分配的最后一个槽位也属于新结果。
       result[0] = 1;
       result[digitsSize] = 0;
       *returnSize = digitsSize + 1;
       return result;
   }

返回数组由函数分配，调用者负责释放。分配失败通过 ``NULL`` 与 ``returnSize = 0`` 表示；合法输入的返回
长度至少为 ``1``，因此失败状态与合法结果不冲突。

C++
~~~

.. code-block:: cpp

   #include <vector>

   class Solution {
   public:
       std::vector<int> plusOne(const std::vector<int>& digits) {
           std::vector<int> result = digits;

           for (int index = static_cast<int>(result.size()) - 1;
                index >= 0;
                --index) {
               if (result[index] < 9) {
                   ++result[index];
                   return result;
               }
               result[index] = 0;
           }

           result.insert(result.begin(), 1);
           return result;
       }
   };

``result.size() <= 100``，转换为 ``int`` 安全。只有全 ``9`` 时调用 ``insert``，
在开头移动 ``O(n)`` 个元素，总复杂度仍为 ``O(n)``。

Python
~~~~~~

.. code-block:: python

   class Solution:
       def plusOne(self, digits: list[int]) -> list[int]:
           result = digits.copy()

           for index in range(len(result) - 1, -1, -1):
               if result[index] < 9:
                   result[index] += 1
                   return result
               result[index] = 0

           return [1] + result

``copy`` 建立独立列表。``range(..., -1, -1)`` 在下标到达 ``0`` 后结束，不会访问 ``-1``。

Java
~~~~

.. code-block:: java

   class Solution {
       public int[] plusOne(int[] digits) {
           int[] result = digits.clone();

           for (int index = result.length - 1; index >= 0; --index) {
               if (result[index] < 9) {
                   ++result[index];
                   return result;
               }
               result[index] = 0;
           }

           int[] expanded = new int[result.length + 1];
           expanded[0] = 1;
           return expanded;
       }
   }

Java 新建的 ``int[]`` 默认填充为零，因此全 ``9`` 分支只需写入最高位 ``1``。

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn plus_one(digits: Vec<i32>) -> Vec<i32> {
           let mut result = digits.clone();

           for index in (0..result.len()).rev() {
               if result[index] < 9 {
                   result[index] += 1;
                   return result;
               }
               result[index] = 0;
           }

           result.insert(0, 1);
           result
       }
   }

平台按值传入 ``Vec``；这里仍显式 ``clone``，使十语言都表达“读取输入并返回独立快照”的统一语义。
全 ``9`` 时 ``insert(0, 1)`` 移动已有元素。

Go
~~

.. code-block:: go

   func plusOne(digits []int) []int {
       result := append([]int(nil), digits...)

       for index := len(result) - 1; index >= 0; index-- {
           if result[index] < 9 {
               result[index]++
               return result
           }
           result[index] = 0
       }

       expanded := make([]int, len(result)+1)
       expanded[0] = 1
       return expanded
   }

``append([]int(nil), digits...)`` 复制底层数组，后续修改不会影响调用者持有的切片。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function plusOne(digits: number[]): number[] {
       const result = digits.slice();

       for (let index = result.length - 1; index >= 0; index -= 1) {
           if (result[index] < 9) {
               result[index] += 1;
               return result;
           }
           result[index] = 0;
       }

       result.unshift(1);
       return result;
   }

``slice`` 建立数组快照。``unshift`` 只在全 ``9`` 分支发生，其元素移动成本为 ``O(n)``。

C#
~~

.. code-block:: csharp

   public class Solution {
       public int[] PlusOne(int[] digits) {
           int[] result = (int[])digits.Clone();

           for (int index = result.Length - 1; index >= 0; --index) {
               if (result[index] < 9) {
                   ++result[index];
                   return result;
               }
               result[index] = 0;
           }

           int[] expanded = new int[result.Length + 1];
           expanded[0] = 1;
           return expanded;
       }
   }

C# 新数组同样默认填充为零。

Julia
~~~~~

.. code-block:: julia

   function plusOne(digits::Vector{Int})::Vector{Int}
       result = copy(digits)

       for index in lastindex(result):-1:firstindex(result)
           if result[index] < 9
               result[index] += 1
               return result
           end
           result[index] = 0
       end

       pushfirst!(result, 1)
       return result
   end

Julia 使用一基索引，递减范围必须显式写成 ``lastindex:-1:firstindex``。``pushfirst!`` 在全 ``9`` 时
移动现有元素。

R
~

.. code-block:: r

   plusOne <- function(digits) {
     result <- as.integer(digits)

     for (index in rev(seq_along(result))) {
       if (result[index] < 9L) {
         result[index] <- result[index] + 1L
         return(result)
       }
       result[index] <- 0L
     }

     c(1L, result)
   }

``as.integer`` 创建适合本题的整数向量表示；R 修改向量时遵循写时复制语义。``rev(seq_along(result))``
安全生成一基递减下标。

对照解法：允许原地修改
----------------------

若接口允许修改输入，可以直接在原数组上执行相同扫描；只有全 ``9`` 时才新建 ``n + 1`` 长度的数组。
这样最好情况下不创建工作副本。当前教程选择统一的输入只读语义，使各语言调用后行为一致。

验证计划与证据
--------------

* 固定用例覆盖末位非 ``9``、部分连续 ``9``、全 ``9``、单元素 ``0`` 与单元素 ``9``；
* Python 与独立大整数基准对拍长度不超过 30 的随机数字数组；
* C、C++、Java、Go 和 TypeScript 编译并运行固定用例；
* C 使用 AddressSanitizer、UndefinedBehaviorSanitizer 和分配结果检查；
* Rust、C#、Julia、R 在缺少运行时时进行所有权、索引、复制成本和接口静态检查。

关键边界
--------

* 输入非空，反向循环起点始终存在；
* 第一个从右侧遇到的非 ``9`` 数字会吸收进位；
* 全 ``9`` 是唯一需要增加结果长度的情况；
* 返回快照与输入独立；
* C 的失败返回与合法非空结果可区分。

易错点
------

* 从左向右处理会在进位时重复回退或保存多余状态；
* 全 ``9`` 后只把首位改为 ``1``，却忘记结果需要多一个尾部 ``0``；
* Go、TypeScript 等语言直接复用输入容器会让调用者观察到修改；
* 使用固定宽整数转换无法处理最长 100 位输入。

本题新增知识
------------

* 进位只沿连续 ``9`` 后缀传播；
* 全 ``9`` 输入触发结果扩位；
* 返回快照与原地接口之间的语义取舍。

本题强化知识
------------

* 反向索引与一基语言的递减范围；
* 容器复制、开头插入及其 ``O(n)`` 成本；
* C 动态数组返回所有权和失败语义。

关联题目
--------

* `0043. Multiply Strings <0043-multiply-strings.rst>`_：两题都显式模拟十进制位与进位；本题只有一次
  加一和单向进位链。
* `0007. Reverse Integer <0007-reverse-integer.rst>`_：两题都逐位处理十进制表示；0007 受固定宽整数
  溢出约束，本题直接保留数字数组。

最小自检
--------

#. 为什么只需扫描连续 ``9`` 后缀？
#. 哪种输入会让结果长度增加？
#. 主实现为什么仍报告 ``O(n)`` 额外空间？
#. C 如何区分分配失败与合法结果？
#. 哪些语言的开头插入具有 ``O(n)`` 移动成本？

答案要点
~~~~~~~~

#. 第一个非 ``9`` 数字加一后不会继续产生进位，它左侧全部保持不变。
#. 所有数字都是 ``9``。
#. 十语言都建立独立结果快照，返回数组本身需要线性空间。
#. 返回 ``NULL`` 并把 ``returnSize`` 设为 ``0``；合法结果长度至少为 ``1``。
#. C++ ``insert(begin)``、Rust ``insert(0)``、TypeScript ``unshift`` 与 Julia
   ``pushfirst!`` 等都要移动后缀。
