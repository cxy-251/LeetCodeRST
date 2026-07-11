0043. Multiply Strings
======================

题目信息
--------

:题号: 0043
:难度: Medium
:主题: 字符串、竖式乘法、进位、数组模拟
:原题: `LeetCode 0043 <https://leetcode.com/problems/multiply-strings/>`_
:访问状态: Available
:教学重点: 位权对齐、长度上界、局部进位、前导零删除、禁止大整数转换

题目重述
--------

给定两个只包含十进制数字的非负整数字符串 ``num1`` 和 ``num2``，返回它们乘积的十进制
字符串。

不能把整个输入直接转换为语言内置的大整数，也不能调用现成的大整数乘法。需要按十进制
竖式乘法的规则模拟每一位乘积与进位。

自建示例
--------

普通乘法
~~~~~~~~

.. code-block:: text

   输入：num1 = "123"，num2 = "45"
   输出："5535"

   123 × 45 = 123 × 5 + 123 × 40 = 615 + 4920 = 5535。

包含连续进位
~~~~~~~~~~~~

.. code-block:: text

   输入：num1 = "99"，num2 = "99"
   输出："9801"

一方为零
~~~~~~~~

.. code-block:: text

   输入：num1 = "0"，num2 = "729"
   输出："0"

单数字
~~~~~~

.. code-block:: text

   输入：num1 = "8"，num2 = "7"
   输出："56"

问题抽象
--------

设 ``num1`` 长度为 ``m``，``num2`` 长度为 ``n``。两个数的乘积最多有 ``m + n`` 位，
因此可以准备一个长度为 ``m + n`` 的整数数组 ``digits`` 保存结果各位。

若使用零基字符串下标，``num1[i]`` 与 ``num2[j]`` 的乘积应影响：

.. code-block:: text

   低位槽：i + j + 1
   高位槽：i + j

例如两个个位数字位于各自字符串末尾，它们的乘积落在结果数组最后一位，进位落在前一位。
从右向左遍历两串，可以在每次乘法后立即把当前槽位规范为 0 至 9，并把进位加到左邻槽位。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 取舍
   * - 结果数组模拟竖式乘法
     - ``O(mn)``
     - ``O(m+n)``
     - 主解法；位权关系和进位都显式
   * - 为每个乘数位生成一行字符串再相加
     - ``O(mn)``
     - ``O(mn)``
     - 接近纸面竖式，但创建大量中间字符串
   * - 转换为内置整数后相乘
     - 取决于大整数实现
     - 取决于实现
     - 违反题目要求，也无法体现算法过程
   * - 快速傅里叶变换
     - 约 ``O(k log k)``
     - ``O(k)``
     - 适合极长整数，远超本题教学范围

主解法：长度 m+n 的十进制结果数组
----------------------------------

状态含义
~~~~~~~~

``digits`` 中每个槽位表示结果的一个十进制位。双层循环从右向左处理数字对：

.. code-block:: text

   product = digit1 * digit2
   total = digits[low] + product
   digits[low] = total % 10
   digits[high] += total / 10

其中 ``low = i + j + 1``，``high = i + j``。

为什么可以立即进位
~~~~~~~~~~~~~~~~~~

槽位 ``low`` 可能已经包含后续数字对贡献的低位。把新乘积加入后，``total % 10`` 是该槽位
最终应保留的个位，``total / 10`` 应加入左侧更高位。

左邻槽位暂时可能大于 9，这没有问题：之后处理映射到该槽位的数字对时，会把它作为
``digits[low]`` 再次参与 ``total`` 并继续向左进位。由于遍历顺序从右向左，所有进位最终都会
被规范化。

长度为什么最多是 m+n
~~~~~~~~~~~~~~~~~~~~~

长度为 ``m`` 的非负整数小于 ``10^m``，长度为 ``n`` 的非负整数小于 ``10^n``，所以乘积
小于 ``10^(m+n)``，最多有 ``m+n`` 位。乘积也可能只有 ``m+n-1`` 位，因此结果数组开头最多
出现一个或多个零，输出时跳过它们。

核心不变量
~~~~~~~~~~

处理某个数字对之前：

* 已处理数字对的所有乘积贡献都已加入 ``digits``；
* 当前数字对右侧的结果槽位已经规范为 0 至 9；
* 尚未规范的进位只可能保存在更高位槽中，不会丢失；
* ``digits`` 表示已处理部分乘积之和的十进制位权展开。

处理当前数字对后，它的完整贡献 ``digit1 * digit2 * 10^k`` 被拆成低位与进位写入相邻槽位，
不变量继续成立。

正确性依据
~~~~~~~~~~

十进制乘法的分配律给出：

.. code-block:: text

   num1 × num2 = Σ digit1[i] × digit2[j] × 10^position(i,j)

算法枚举所有 ``m × n`` 个数字对，因此每项部分乘积恰好加入一次。槽位 ``i+j+1`` 与
``i+j`` 分别保存该部分乘积在当前十进制位上的余数和进位，数值总和保持不变。

从右向左处理保证低位在结束时均被规范为合法十进制数字。双层循环结束后，``digits`` 表示
全部部分乘积的和，也就是原两数乘积。删除开头不影响数值的零并转换为字符后，得到规范的
十进制结果字符串。

复杂度
~~~~~~

设两个字符串长度分别为 ``m`` 和 ``n``：

* 双层循环枚举所有数字对，时间复杂度为 ``O(mn)``；
* 结果数组长度为 ``m+n``，额外空间复杂度为 ``O(m+n)``；
* 输出字符串本身也需要 ``O(m+n)`` 空间。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdlib.h>
   #include <string.h>

   char *multiply(char *num1, char *num2) {
       if (strcmp(num1, "0") == 0 || strcmp(num2, "0") == 0) {
           char *zero = malloc(2);
           zero[0] = '0';
           zero[1] = '\0';
           return zero;
       }

       int m = (int)strlen(num1);
       int n = (int)strlen(num2);
       int size = m + n;
       int *digits = calloc((size_t)size, sizeof(int));

       for (int i = m - 1; i >= 0; --i) {
           int left_digit = num1[i] - '0';

           for (int j = n - 1; j >= 0; --j) {
               int right_digit = num2[j] - '0';
               int low = i + j + 1;
               int total = digits[low] + left_digit * right_digit;

               digits[low] = total % 10;
               digits[low - 1] += total / 10;
           }
       }

       int start = 0;
       while (start < size - 1 && digits[start] == 0) {
           ++start;
       }

       int length = size - start;
       char *result = malloc((size_t)length + 1);

       for (int index = 0; index < length; ++index) {
           result[index] = (char)('0' + digits[start + index]);
       }
       result[length] = '\0';

       free(digits);
       return result;
   }

返回字符串由函数在堆上分配，调用者负责释放。每次单数字乘积最大为 81，局部 ``int`` 足够。

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       string multiply(string num1, string num2) {
           if (num1 == "0" || num2 == "0") {
               return "0";
           }

           int m = static_cast<int>(num1.size());
           int n = static_cast<int>(num2.size());
           vector<int> digits(m + n, 0);

           for (int i = m - 1; i >= 0; --i) {
               int leftDigit = num1[i] - '0';

               for (int j = n - 1; j >= 0; --j) {
                   int rightDigit = num2[j] - '0';
                   int low = i + j + 1;
                   int total = digits[low] + leftDigit * rightDigit;

                   digits[low] = total % 10;
                   digits[low - 1] += total / 10;
               }
           }

           int start = 0;
           while (start < m + n - 1 && digits[start] == 0) {
               ++start;
           }

           string result;
           result.reserve(m + n - start);
           for (int index = start; index < m + n; ++index) {
               result.push_back(static_cast<char>('0' + digits[index]));
           }
           return result;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def multiply(self, num1: str, num2: str) -> str:
           if num1 == "0" or num2 == "0":
               return "0"

           m = len(num1)
           n = len(num2)
           digits = [0] * (m + n)

           for i in range(m - 1, -1, -1):
               left_digit = ord(num1[i]) - ord("0")

               for j in range(n - 1, -1, -1):
                   right_digit = ord(num2[j]) - ord("0")
                   low = i + j + 1
                   total = digits[low] + left_digit * right_digit

                   digits[low] = total % 10
                   digits[low - 1] += total // 10

           start = 0
           while start < len(digits) - 1 and digits[start] == 0:
               start += 1

           return "".join(str(digit) for digit in digits[start:])

Python 虽然支持任意精度整数，本实现只把单个字符转换为 0 至 9，没有把整个字符串转为整数。

Java
~~~~

.. code-block:: java

   class Solution {
       public String multiply(String num1, String num2) {
           if (num1.equals("0") || num2.equals("0")) {
               return "0";
           }

           int m = num1.length();
           int n = num2.length();
           int[] digits = new int[m + n];

           for (int i = m - 1; i >= 0; --i) {
               int leftDigit = num1.charAt(i) - '0';

               for (int j = n - 1; j >= 0; --j) {
                   int rightDigit = num2.charAt(j) - '0';
                   int low = i + j + 1;
                   int total = digits[low] + leftDigit * rightDigit;

                   digits[low] = total % 10;
                   digits[low - 1] += total / 10;
               }
           }

           int start = 0;
           while (start < digits.length - 1 && digits[start] == 0) {
               ++start;
           }

           StringBuilder result = new StringBuilder(
               digits.length - start
           );
           for (int index = start; index < digits.length; ++index) {
               result.append(digits[index]);
           }
           return result.toString();
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn multiply(num1: String, num2: String) -> String {
           if num1 == "0" || num2 == "0" {
               return "0".to_string();
           }

           let left = num1.as_bytes();
           let right = num2.as_bytes();
           let mut digits = vec![0_i32; left.len() + right.len()];

           for i in (0..left.len()).rev() {
               let left_digit = i32::from(left[i] - b'0');

               for j in (0..right.len()).rev() {
                   let right_digit = i32::from(right[j] - b'0');
                   let low = i + j + 1;
                   let total = digits[low] + left_digit * right_digit;

                   digits[low] = total % 10;
                   digits[low - 1] += total / 10;
               }
           }

           let mut start = 0;
           while start < digits.len() - 1 && digits[start] == 0 {
               start += 1;
           }

           let mut result = String::with_capacity(digits.len() - start);
           for &digit in &digits[start..] {
               result.push(char::from(b'0' + digit as u8));
           }
           result
       }
   }

输入只含 ASCII 数字，``as_bytes`` 的字节下标与数字位置一致。每个规范化槽位都在 0 至 9，
转换为 ``u8`` 后加 ``b'0'`` 安全。

Go
~~

.. code-block:: go

   import "strings"

   func multiply(num1 string, num2 string) string {
       if num1 == "0" || num2 == "0" {
           return "0"
       }

       m := len(num1)
       n := len(num2)
       digits := make([]int, m+n)

       for i := m - 1; i >= 0; i-- {
           leftDigit := int(num1[i] - '0')

           for j := n - 1; j >= 0; j-- {
               rightDigit := int(num2[j] - '0')
               low := i + j + 1
               total := digits[low] + leftDigit*rightDigit

               digits[low] = total % 10
               digits[low-1] += total / 10
           }
       }

       start := 0
       for start < len(digits)-1 && digits[start] == 0 {
           start++
       }

       var result strings.Builder
       result.Grow(len(digits) - start)
       for _, digit := range digits[start:] {
           result.WriteByte(byte('0' + digit))
       }
       return result.String()
   }

Go 字符串按字节索引；ASCII 数字是一字节字符。``strings.Builder`` 避免循环拼接不可变字符串。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function multiply(num1: string, num2: string): string {
       if (num1 === "0" || num2 === "0") {
           return "0";
       }

       const m = num1.length;
       const n = num2.length;
       const digits = new Array<number>(m + n).fill(0);

       for (let i = m - 1; i >= 0; i--) {
           const leftDigit = num1.charCodeAt(i) - 48;

           for (let j = n - 1; j >= 0; j--) {
               const rightDigit = num2.charCodeAt(j) - 48;
               const low = i + j + 1;
               const total = digits[low] + leftDigit * rightDigit;

               digits[low] = total % 10;
               digits[low - 1] += Math.floor(total / 10);
           }
       }

       let start = 0;
       while (start < digits.length - 1 && digits[start] === 0) {
           start++;
       }

       return digits.slice(start).join("");
   }

``charCodeAt`` 只读取 ASCII 数字代码单元。所有中间值很小，JavaScript ``number`` 不会产生
安全整数精度问题。

C#
~~

.. code-block:: csharp

   using System.Text;

   public class Solution {
       public string Multiply(string num1, string num2) {
           if (num1 == "0" || num2 == "0") {
               return "0";
           }

           int m = num1.Length;
           int n = num2.Length;
           int[] digits = new int[m + n];

           for (int i = m - 1; i >= 0; --i) {
               int leftDigit = num1[i] - '0';

               for (int j = n - 1; j >= 0; --j) {
                   int rightDigit = num2[j] - '0';
                   int low = i + j + 1;
                   int total = digits[low] + leftDigit * rightDigit;

                   digits[low] = total % 10;
                   digits[low - 1] += total / 10;
               }
           }

           int start = 0;
           while (start < digits.Length - 1 && digits[start] == 0) {
               ++start;
           }

           StringBuilder result = new StringBuilder(
               digits.Length - start
           );
           for (int index = start; index < digits.Length; ++index) {
               result.Append(digits[index]);
           }
           return result.ToString();
       }
   }

Julia
~~~~~

.. code-block:: julia

   function multiply(num1::String, num2::String)::String
       (num1 == "0" || num2 == "0") && return "0"

       left = codeunits(num1)
       right = codeunits(num2)
       m = length(left)
       n = length(right)
       digits = zeros(Int, m + n)

       for i in m:-1:1
           left_digit = Int(left[i] - 0x30)

           for j in n:-1:1
               right_digit = Int(right[j] - 0x30)
               low = i + j
               total = digits[low] + left_digit * right_digit

               digits[low] = total % 10
               digits[low - 1] += div(total, 10)
           end
       end

       start = findfirst(!=(0), digits)
       return join(string.(digits[start:end]))
   end

Julia 使用一基索引，所以两个数字位置 ``i``、``j`` 的低位槽是 ``i+j``，高位槽是
``i+j-1``。零输入已提前返回，因此 ``findfirst`` 一定能找到非零位。

R
~

.. code-block:: r

   multiply_strings <- function(num1, num2) {
     if (num1 == "0" || num2 == "0") {
       return("0")
     }

     left <- utf8ToInt(num1) - utf8ToInt("0")
     right <- utf8ToInt(num2) - utf8ToInt("0")
     m <- length(left)
     n <- length(right)
     digits <- integer(m + n)

     for (i in m:1L) {
       for (j in n:1L) {
         low <- i + j
         total <- digits[[low]] + left[[i]] * right[[j]]

         digits[[low]] <- total %% 10L
         digits[[low - 1L]] <- digits[[low - 1L]] + total %/% 10L
       }
     }

     start <- which(digits != 0L)[[1L]]
     paste0(digits[start:length(digits)], collapse = "")
   }

R 与 Julia 相同，直接使用一基槽位 ``i+j``。输入非空且零值已提前返回，反向序列
``m:1L``、``n:1L`` 不会产生空范围问题。

关键边界
--------

* 任一输入为 ``"0"``：立即返回唯一规范表示 ``"0"``；
* 单数字乘法：仍可能产生两位结果，例如 ``8 × 7 = 56``；
* 连续进位：``99 × 99`` 会让多个相邻槽位先后接收进位；
* 结果长度：可能是 ``m+n``，也可能是 ``m+n-1``；
* 输入只含 ASCII 数字：字节或代码单元索引才可直接代表数字位置；
* 输出前导零：只删除结果数组开头未使用的零，不能删除内部或末尾的零。

易错点
------

* 把低位槽写成 ``i+j``，导致所有位权整体左移；
* 每次只写乘积个位，却忘记把 ``digits[low]`` 的旧贡献加入 ``total``；
* 先生成字符再做进位，混淆数字值和字符编码；
* 把整个字符串转换成 ``int``、``long`` 或大整数，违反题意；
* 删除所有零而不是只删除前导零；
* Julia/R 沿用零基槽位公式，产生一位偏移；
* C 返回局部栈数组地址，或忘记说明返回缓冲区的所有权。

新增与强化知识
--------------

新增
~~~~

* 两个长度分别为 ``m``、``n`` 的十进制整数乘积最多有 ``m+n`` 位；
* 数字对 ``(i,j)`` 的低位与进位落在相邻结果槽位；
* 从右向左处理允许把暂存进位交给后续更高位统一规范化。

强化
~~~~

* 复用 0002 的逐位进位思想，但本题需要累加 ``m×n`` 个部分乘积；
* 复用 0008、0038 的 ASCII 数字字符转换规则；
* 增量构造输出字符串时，应使用缓冲区或 builder，避免反复复制；
* Julia/R 一基索引需要重新推导槽位公式，不能机械照搬零基表达。

关联题目
--------

* `0002. Add Two Numbers <0002-add-two-numbers.rst>`_：链表表示的逐位加法与进位；
* `0008. String to Integer (atoi) <0008-string-to-integer-atoi.rst>`_：ASCII 数字解析与整数边界；
* `0029. Divide Two Integers <0029-divide-two-integers.rst>`_：在受限算术操作下模拟整数运算。

最小自检
--------

#. 为什么结果数组长度选择 ``m+n`` 而不是 ``max(m,n)``？
#. 零基下标 ``i``、``j`` 的乘积为什么写入 ``i+j+1``？
#. 为什么 ``digits[low - 1]`` 暂时大于 9 仍然安全？
#. 输出时为什么只能删除开头的零？
#. Julia/R 的低位槽为什么是 ``i+j``？

答案要点
~~~~~~~~

#. 两个数的乘积可能比任一输入都长，并且最多达到两者长度之和；
#. 结果数组末尾对应个位，两个数字的十进制位权相加后落在该槽位；
#. 后续处理更高位数字对时会把该槽位纳入 ``total`` 并继续进位；
#. 内部零和末尾零属于真实数值，只有最高位前的零没有位权贡献；
#. 一基位置比零基下标大一，零基 ``i+j+1`` 映射为一基 ``i+j``。
