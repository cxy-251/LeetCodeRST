0067. Add Binary
================

题目信息
--------

:题号: 0067
:难度: Easy
:主题: 字符串、二进制、进位、双指针
:原题: `LeetCode 0067 <https://leetcode.com/problems/add-binary/>`_
:访问状态: Available
:教学重点: 从低位对齐、二进制进位、结果长度上界、反向构造

题目重述
--------

给定两个只包含 ``'0'`` 和 ``'1'`` 的非空字符串 ``a`` 与 ``b``，它们分别表示一个二进制非负整数。
返回两数之和的规范二进制字符串。

题目保证：

* ``1 <= a.length, b.length <= 10000``；
* 两个字符串只包含 ASCII 字符 ``'0'`` 和 ``'1'``；
* 除字符串 ``"0"`` 外，输入没有前导零；
* 不能依赖固定宽整数保存整个输入。

若较长输入长度为 ``k``，结果最多有 ``k + 1`` 位：最高位相加可能再产生一个进位。

自建示例
--------

长度不同
~~~~~~~~

.. code-block:: text

   输入：a = "1011"，b = "110"
   输出："10001"

连续进位
~~~~~~~~

.. code-block:: text

   输入：a = "1111"，b = "1"
   输出："10000"

没有进位
~~~~~~~~

.. code-block:: text

   输入：a = "1000"，b = "10"
   输出："1010"

两个零
~~~~~~

.. code-block:: text

   输入：a = "0"，b = "0"
   输出："0"

问题抽象
--------

二进制位从字符串末尾开始对齐。维护两个从右向左移动的下标和一个进位 ``carry``。每轮取出仍存在的
两个数字位，计算：

.. code-block:: text

   total = left_bit + right_bit + carry
   result_bit = total % 2
   carry = total / 2

``left_bit``、``right_bit`` 和 ``carry`` 都只可能是 ``0`` 或 ``1``，因此 ``total`` 最大为 ``3``。
结果从低位到高位产生，可以先追加到缓冲区末尾，扫描结束后整体反转一次。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 定位
   * - 反向双指针与进位
     - ``O(m+n)``
     - ``O(max(m,n))``
     - 主解法；不受整数宽度限制
   * - 转换成整数后相加
     - 取决于整数实现
     - 取决于整数实现
     - 最长 10000 位，固定宽整数不可用
   * - 递归处理高位
     - ``O(m+n)``
     - ``O(max(m,n))`` 调用栈
     - 会产生过深递归，迭代更稳定

主解法：反向双指针与进位
------------------------

核心不变量
~~~~~~~~~~

每轮开始时：

* 两个下标右侧的输入位已经全部处理；
* 反向缓冲区按从低位到高位顺序保存这些已处理位的正确和；
* ``carry`` 恰好是已处理低位向尚未处理高位产生的唯一进位；
* 未处理前缀的数值加上 ``carry`` 对应的下一位贡献，仍等于原两数去掉已输出低位后的剩余和。

为什么缺失位可以当作 0
~~~~~~~~~~~~~~~~~~~~~~

二进制竖式按最低位对齐。较短字符串左侧没有字符的位置等价于补前导零，不改变数值，因此某个下标
越界后，对应数字位取 ``0`` 即可继续统一转移。

为什么结果最多多一位
~~~~~~~~~~~~~~~~~~~~

长度不超过 ``k`` 的两个二进制数都小于 ``2^k``，它们的和小于 ``2^(k+1)``，所以结果最多有
``k + 1`` 位。主实现据此预留缓冲区；循环结束后的剩余进位正是可能新增的最高位。

正确性依据
~~~~~~~~~~

**单步正确。** ``total % 2`` 是当前二进制位应保留的余数，``total / 2`` 是传给高一位的进位。
这正是二进制加法定义。

**不变量保持。** 每轮读取当前最低的尚未处理位，把其结果位追加到反向缓冲区，并把唯一进位保存到
``carry``。处理过的低位已经最终确定，后续高位不会再改变它们。

**结果完整。** 循环持续到两个输入下标均越界且 ``carry == 0``，因此所有输入位与最终进位都恰好处理
一次。反转缓冲区后，字符顺序从最高位到最低位，得到完整二进制和。

**终止性。** 每轮至少有一个下标向左移动，或消费最后一个进位；输入有限，循环必然结束。

复杂度
~~~~~~

设字符串长度分别为 ``m`` 和 ``n``，``k = max(m, n)``：

* 主循环最多执行 ``k + 1`` 次，反转结果也需要 ``O(k)``，总时间复杂度为 ``O(m+n)``；
* 反向缓冲区和最终字符串占 ``O(k)`` 空间；部分语言反转后复用同一缓冲区，峰值仍为 ``O(k)``；
* R 的 ``utf8ToInt`` 为两个输入创建 ``O(m+n)`` 码点向量；
* C 的容量是 ``k + 2`` 字节，覆盖最多 ``k + 1`` 个结果字符和结尾 ``'\0'``。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stddef.h>
   #include <stdlib.h>
   #include <string.h>

   char *addBinary(char *a, char *b) {
       const size_t a_length = strlen(a);
       const size_t b_length = strlen(b);
       const size_t max_length = a_length > b_length ? a_length : b_length;
       char *result = malloc(max_length + 2);
       if (result == NULL) {
           return NULL;
       }

       size_t a_remaining = a_length;
       size_t b_remaining = b_length;
       size_t length = 0;
       int carry = 0;

       while (a_remaining > 0 || b_remaining > 0 || carry != 0) {
           int total = carry;
           if (a_remaining > 0) {
               total += a[--a_remaining] - '0';
           }
           if (b_remaining > 0) {
               total += b[--b_remaining] - '0';
           }

           result[length++] = (char)('0' + total % 2);
           carry = total / 2;
       }

       for (size_t left = 0, right = length - 1; left < right;
            ++left, --right) {
           const char temporary = result[left];
           result[left] = result[right];
           result[right] = temporary;
       }
       result[length] = '\0';
       return result;
   }

输入非空，因此 ``length`` 至少为 ``1``，反转初始化 ``length - 1`` 安全。返回字符串由调用者释放；
``NULL`` 表示分配失败。

C++
~~~

.. code-block:: cpp

   #include <algorithm>
   #include <string>

   class Solution {
   public:
       std::string addBinary(const std::string& a, const std::string& b) {
           int left = static_cast<int>(a.size()) - 1;
           int right = static_cast<int>(b.size()) - 1;
           int carry = 0;
           std::string reversed;
           reversed.reserve(std::max(a.size(), b.size()) + 1);

           while (left >= 0 || right >= 0 || carry != 0) {
               int total = carry;
               if (left >= 0) {
                   total += a[left--] - '0';
               }
               if (right >= 0) {
                   total += b[right--] - '0';
               }
               reversed.push_back(static_cast<char>('0' + total % 2));
               carry = total / 2;
           }

           std::reverse(reversed.begin(), reversed.end());
           return reversed;
       }
   };

字符串长度不超过 ``10000``，转换为 ``int`` 安全。``reserve`` 使用精确长度上界减少扩容。

Python
~~~~~~

.. code-block:: python

   class Solution:
       def addBinary(self, a: str, b: str) -> str:
           left = len(a) - 1
           right = len(b) - 1
           carry = 0
           reversed_digits: list[str] = []

           while left >= 0 or right >= 0 or carry:
               total = carry
               if left >= 0:
                   total += ord(a[left]) - ord("0")
                   left -= 1
               if right >= 0:
                   total += ord(b[right]) - ord("0")
                   right -= 1

               reversed_digits.append(str(total % 2))
               carry = total // 2

           reversed_digits.reverse()
           return "".join(reversed_digits)

列表先保存单字符结果，最后一次 ``join`` 构造字符串；反转与连接都计入 ``O(k)`` 时间。

Java
~~~~

.. code-block:: java

   class Solution {
       public String addBinary(String a, String b) {
           int left = a.length() - 1;
           int right = b.length() - 1;
           int carry = 0;
           StringBuilder reversed = new StringBuilder(
               Math.max(a.length(), b.length()) + 1
           );

           while (left >= 0 || right >= 0 || carry != 0) {
               int total = carry;
               if (left >= 0) {
                   total += a.charAt(left--) - '0';
               }
               if (right >= 0) {
                   total += b.charAt(right--) - '0';
               }
               reversed.append((char)('0' + total % 2));
               carry = total / 2;
           }

           return reversed.reverse().toString();
       }
   }

``StringBuilder`` 预留 ``k + 1`` 容量，``reverse`` 原地调整其字符数组，``toString`` 创建返回字符串。

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn add_binary(a: String, b: String) -> String {
           let left_bytes = a.as_bytes();
           let right_bytes = b.as_bytes();
           let mut left = left_bytes.len();
           let mut right = right_bytes.len();
           let mut carry = 0u8;
           let mut reversed = Vec::with_capacity(left.max(right) + 1);

           while left > 0 || right > 0 || carry != 0 {
               let mut total = carry;
               if left > 0 {
                   left -= 1;
                   total += left_bytes[left] - b'0';
               }
               if right > 0 {
                   right -= 1;
                   total += right_bytes[right] - b'0';
               }

               reversed.push(b'0' + total % 2);
               carry = total / 2;
           }

           reversed.reverse();
           String::from_utf8(reversed).unwrap()
       }
   }

``unwrap`` 由构造不变量支撑：向量只包含 ASCII ``'0'`` 与 ``'1'``，必然是合法 UTF-8。
使用剩余长度而不是无符号负下标，避免 ``usize`` 下溢。

Go
~~

.. code-block:: go

   func addBinary(a string, b string) string {
       left := len(a)
       right := len(b)
       carry := byte(0)
       reversed := make([]byte, 0, max(len(a), len(b))+1)

       for left > 0 || right > 0 || carry != 0 {
           total := carry
           if left > 0 {
               left--
               total += a[left] - '0'
           }
           if right > 0 {
               right--
               total += b[right] - '0'
           }

           reversed = append(reversed, '0'+total%2)
           carry = total / 2
       }

       for low, high := 0, len(reversed)-1; low < high; low, high = low+1, high-1 {
           reversed[low], reversed[high] = reversed[high], reversed[low]
       }
       return string(reversed)
   }

代码使用 Go 1.21 的预声明 ``max``。输入是 ASCII，按字节索引安全；
``string(reversed)`` 构造返回字符串。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function addBinary(a: string, b: string): string {
       let left = a.length - 1;
       let right = b.length - 1;
       let carry = 0;
       const reversed: string[] = [];

       while (left >= 0 || right >= 0 || carry !== 0) {
           let total = carry;
           if (left >= 0) {
               total += a.charCodeAt(left) - 48;
               left -= 1;
           }
           if (right >= 0) {
               total += b.charCodeAt(right) - 48;
               right -= 1;
           }

           reversed.push(String(total % 2));
           carry = Math.floor(total / 2);
       }

       reversed.reverse();
       return reversed.join("");
   }

所有算术值都不超过 ``3``，``number`` 精确；实现没有使用会触发 32 位转换的位运算。

C#
~~

.. code-block:: csharp

   public class Solution {
       public string AddBinary(string a, string b) {
           int left = a.Length - 1;
           int right = b.Length - 1;
           int carry = 0;
           char[] buffer = new char[Math.Max(a.Length, b.Length) + 1];
           int write = buffer.Length;

           while (left >= 0 || right >= 0 || carry != 0) {
               int total = carry;
               if (left >= 0) {
                   total += a[left--] - '0';
               }
               if (right >= 0) {
                   total += b[right--] - '0';
               }

               buffer[--write] = (char)('0' + total % 2);
               carry = total / 2;
           }

           return new string(buffer, write, buffer.Length - write);
       }
   }

C# 从缓冲区末尾向前写，避免最终反转；``write`` 左侧未使用区域不会进入返回字符串。

Julia
~~~~~

.. code-block:: julia

   function addBinary(a::String, b::String)::String
       left_bytes = codeunits(a)
       right_bytes = codeunits(b)
       left = length(left_bytes)
       right = length(right_bytes)
       carry = 0
       reversed = UInt8[]
       sizehint!(reversed, max(left, right) + 1)

       while left > 0 || right > 0 || carry != 0
           total = carry
           if left > 0
               total += left_bytes[left] - UInt8('0')
               left -= 1
           end
           if right > 0
               total += right_bytes[right] - UInt8('0')
               right -= 1
           end

           push!(reversed, UInt8('0') + UInt8(total % 2))
           carry = total ÷ 2
       end

       reverse!(reversed)
       return String(reversed)
   end

``codeunits`` 提供一基 UTF-8 字节视图；题目字符为 ASCII，因此每个索引对应一个二进制字符。

R
~

.. code-block:: r

   addBinary <- function(a, b) {
     left_bytes <- utf8ToInt(a) - utf8ToInt("0")
     right_bytes <- utf8ToInt(b) - utf8ToInt("0")
     left <- length(left_bytes)
     right <- length(right_bytes)
     carry <- 0L
     buffer <- integer(max(left, right) + 1L)
     write <- length(buffer)

     while (left > 0L || right > 0L || carry != 0L) {
       total <- carry
       if (left > 0L) {
         total <- total + left_bytes[left]
         left <- left - 1L
       }
       if (right > 0L) {
         total <- total + right_bytes[right]
         right <- right - 1L
       }

       buffer[write] <- total %% 2L
       write <- write - 1L
       carry <- total %/% 2L
     }

     start <- write + 1L
     paste0(buffer[start:length(buffer)], collapse = "")
   }

R 预分配固定上界缓冲区并从右向左写，避免在循环中反复 ``c`` 扩展造成平方级复制。

对照解法：从高位递归
--------------------

可以递归到两个字符串的最低位，再在回溯阶段计算进位。该写法使控制流接近“先对齐再返回”，却需要
``O(k)`` 递归栈；长度可达 ``10000``，部分语言可能栈溢出，因此主解法使用迭代。

验证计划与证据
--------------

* 固定用例覆盖不同长度、连续进位、两个零和最高位扩展；
* Python 与独立任意精度整数基准对拍长度不超过 200 的随机二进制字符串；
* C、C++、Java、Go 和 TypeScript 编译并运行固定用例；
* C 使用严格警告、AddressSanitizer 和 UndefinedBehaviorSanitizer；
* Rust、C#、Julia、R 在缺少运行时时进行缓冲区、索引、ASCII 与所有权静态检查。

关键边界
--------

* 两个输入非空，结果也至少包含一位；
* 较短字符串越界后，其高位按 ``0`` 处理；
* 最终进位可能让结果比最长输入多一位；
* ``total`` 最大为 ``3``，所有语言的小整数运算安全；
* C 缓冲区包含额外最高位与字符串终止符。

易错点
------

* 从字符串开头对齐会把不同位权错误相加；
* 循环条件只检查两个下标，会遗漏最后的 ``carry``；
* 在循环中不断把字符前置到不可变字符串，可能退化为 ``O(k^2)``；
* Rust 使用 ``usize`` 下标直接递减到负数会下溢；
* R 使用 ``c(result, bit)`` 逐轮扩展会反复复制。

本题新增知识
------------

* 两个不同长度数字串的低位对齐；
* 二进制余数与进位转移；
* 反向生成再反转，以及从缓冲区末尾直接写入两种构造方式。

本题强化知识
------------

* 结果长度上界决定容量；
* ASCII 字节扫描与字符串索引边界；
* 输出字符串构造与复制成本。

关联题目
--------

* `0043. Multiply Strings <0043-multiply-strings.rst>`_：两题都不能转换整个大数，并用字符位数组模拟
  竖式运算；本题的局部状态只有两个位和一个进位。
* `0066. Plus One <0066-plus-one.rst>`_：两题都从最低位向高位传播进位；本题同时扫描两个
  不同长度输入。

最小自检
--------

#. 为什么两个字符串必须从末尾对齐？
#. ``total`` 的最大值是多少？
#. 为什么循环条件必须包含 ``carry``？
#. 结果缓冲区为什么最多需要 ``max(m,n)+1`` 个字符？
#. 哪些实现避免了最终反转？

答案要点
~~~~~~~~

#. 末尾代表最低位，相同距离的字符具有相同二进制位权。
#. ``1 + 1 + 1 = 3``。
#. 两个输入都处理完后仍可能有最高位进位。
#. 两个不足 ``2^k`` 的数相加小于 ``2^(k+1)``。
#. C# 和 R 从固定缓冲区末尾向前写；其他主实现通常先反向追加再反转。
