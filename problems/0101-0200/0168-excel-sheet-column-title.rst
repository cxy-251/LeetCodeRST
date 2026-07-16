0168. Excel Sheet Column Title
==============================

题目信息
--------

:题号: 0168
:难度: Easy
:主题: 数学、字符串、无零位二十六进制、逆序构造
:原题: `LeetCode 0168 <https://leetcode.com/problems/excel-sheet-column-title/>`_
:访问状态: Available
:教学重点: 先减一取余、位值不变量、表示唯一性、字符物化成本

精确契约
--------

输入正整数 ``columnNumber``，满足 ``1 <= columnNumber <= 2^31-1``。
返回对应的 Excel 列标题：

* ``1..26`` 对应 ``A..Z``；
* ``27`` 对应 ``AA``；
* ``28`` 对应 ``AB``；
* 每一位都只能是 ``A..Z``，不存在表示零的字符。

输入是数值，不修改外部对象。输出是新字符串。最大输入对应 ``FXSHRXW``，标题长度最多为 7。

示例与反例
----------

单字符
~~~~~~

``1 -> "A"``，``26 -> "Z"``。数字 26 仍由一位 ``Z`` 表示，不存在额外的零位。

两字符
~~~~~~

``28 -> "AB"``。最低位是 ``B``，高位是 ``A``。

跨位边界
~~~~~~~~

``52 -> "AZ"``，``53 -> "BA"``。到达 ``Z`` 后向高位进一，规则与普通进制相似，
但最低合法数位是 1，不是 0。

三字符
~~~~~~

``701 -> "ZY"``，``702 -> "ZZ"``，``703 -> "AAA"``。

直接取余的反例
~~~~~~~~~~~~~~

若直接计算 ``columnNumber % 26``，输入 26 会得到余数 0，却没有与 0 对应的字母；
输入 52 也会遇到同样问题。每轮必须先减一，再把标准余数 ``0..25`` 映射为 ``A..Z``。

问题抽象与解法选择
------------------

Excel 标题是“无零位二十六进制”：每位数值位于 ``1..26``，分别对应 ``A..Z``。
对当前正整数 ``current``，先执行：

.. math::

   adjusted = current - 1

然后进行普通欧几里得除法：

.. math::

   adjusted = 26q + r,\qquad 0\le r<26

当前最低位字符为 ``'A'+r``，其实际无零位数值是 ``r+1``；剩余高位由 ``q`` 继续编码。
也就是：

.. math::

   current = 26q + (r+1)

产生顺序从最低位到最高位，因此最后需要反转。

解法取舍
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间
     - 空间
     - 取舍
   * - 先减一、取余、反转
     - ``O(L)``
     - ``O(L)``
     - 主解法；状态直接对应位分解
   * - 递归处理高位
     - ``O(L)``
     - ``O(L)`` 调用栈
     - 公式相同，但增加递归边界
   * - 直接使用 ``n % 26``
     - 表面为 ``O(L)``
     - ``O(L)``
     - 在 26 的倍数处产生不存在的零位
   * - 建表枚举所有标题
     - 与输入值成正比
     - 与输入值成正比
     - 完全没有必要

状态、不变量与实现映射
----------------------

设原始输入为 ``N``。算法已从低到高生成 ``k`` 个数位，其数值为
``x_0, x_1, ..., x_{k-1}``，每个 ``x_i`` 位于 ``1..26``；当前尚未编码的高位状态为 ``current``。

循环入口保持不变量：

.. math::

   N = current\cdot 26^k
       + \sum_{i=0}^{k-1} x_i\cdot 26^i

初始化 ``k=0``、``current=N``，求和为空，不变量成立。

本轮令 ``adjusted=current-1``，唯一分解为 ``26q+r``，其中 ``0<=r<26``。
取 ``x_k=r+1``，再令 ``current=q``，则：

.. math::

   current_{old}=26q+x_k

代回原不变量后得到下一轮形式，因此状态与已经生成的低位始终精确覆盖原数。

生成数组按 ``x_0,x_1,...`` 保存，是从低位到高位的逆序。反转后得到标题从高位到低位的正常阅读顺序。

正确性证明
----------

引理一：每轮生成唯一合法的最低位
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

对任意正 ``current``，``current-1`` 是非负整数。欧几里得除法唯一给出
``q`` 和 ``r``，满足 ``current-1=26q+r``、``0<=r<26``。
因此 ``x=r+1`` 唯一落在 ``1..26``，对应唯一字符 ``A..Z``，并满足
``current=26q+x``。

引理二：循环不变量始终成立
~~~~~~~~~~~~~~~~~~~~~~~~~~

初始化成立。假设第 ``k`` 轮入口成立，由引理一有
``current_old=26*current_new+x_k``。乘以 ``26^k`` 并代入，
就把原来的高位剩余拆成新高位剩余和第 ``k`` 个低位贡献，
因此下一轮不变量成立。

引理三：循环必然终止
~~~~~~~~~~~~~~~~~~~~

当 ``current>0`` 时，新状态为 ``floor((current-1)/26)``。
若 ``current=1..26``，下一状态为 0；若更大，新状态严格小于旧状态。
正整数状态严格下降，有限轮后必到 0。

引理四：反转后的字符串数值等于输入
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

终止时 ``current=0``。循环不变量化为：

.. math::

   N = \sum_{i=0}^{L-1} x_i 26^i

这正是生成数位按低位到高位的位值和。把字符序列反转只改变存储顺序，
使最高位先输出，不改变各字符所代表的位值，因此输出标题对应 ``N``。

引理五：Excel 标题表示唯一
~~~~~~~~~~~~~~~~~~~~~~~~~~

任意正数的最低位由 ``(current-1) mod 26`` 唯一确定，高位商也由
``floor((current-1)/26)`` 唯一确定。递归应用这一唯一分解，
全部数位及长度都唯一，所以算法不会产生另一个同值标题。

定理：算法返回正确且唯一的 Excel 列标题
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

引理一保证每位合法，引理二和引理四保证输出数值等于输入，
引理三保证有限终止，引理五保证结果唯一，因此算法满足题目合同。

复杂度与字符成本
----------------

设标题长度为 ``L``。每轮生成一位，共 ``L`` 轮，反转和构造结果也需要 ``O(L)``，
总时间 ``O(L)``。保存字符并返回字符串需要 ``O(L)`` 空间；返回载荷不能忽略为 ``O(1)``。

在当前 32 位输入域中，``L<=7``。TypeScript 和 R 的数值运算都远低于 ``2^53``，
整数减法、取余和整除结果可精确表示。固定宽整数语言不发生乘法累计，只进行减一和除以 26，
32 位有符号整数已经足够。

十语言实现
----------

C
~

.. code-block:: c

   #include <stdlib.h>

   char *convertToTitle(int columnNumber) {
       char reversed[7];
       int length = 0;
       int current = columnNumber;

       while (current > 0) {
           --current;
           reversed[length++] = (char)('A' + current % 26);
           current /= 26;
       }

       char *answer = malloc((size_t)length + 1);
       if (answer == NULL) {
           return NULL;
       }
       for (int index = 0; index < length; ++index) {
           answer[index] = reversed[length - 1 - index];
       }
       answer[length] = '\0';
       return answer;
   }

C++
~~~

.. code-block:: cpp

   #include <algorithm>
   #include <string>

   class Solution {
   public:
       std::string convertToTitle(int columnNumber) {
           std::string answer;

           while (columnNumber > 0) {
               --columnNumber;
               answer.push_back(
                   static_cast<char>('A' + columnNumber % 26)
               );
               columnNumber /= 26;
           }

           std::reverse(answer.begin(), answer.end());
           return answer;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def convertToTitle(self, columnNumber: int) -> str:
           characters: list[str] = []

           while columnNumber > 0:
               columnNumber -= 1
               characters.append(chr(ord("A") + columnNumber % 26))
               columnNumber //= 26

           characters.reverse()
           return "".join(characters)

Java
~~~~

.. code-block:: java

   class Solution {
       public String convertToTitle(int columnNumber) {
           StringBuilder reversed = new StringBuilder();

           while (columnNumber > 0) {
               --columnNumber;
               reversed.append((char) ('A' + columnNumber % 26));
               columnNumber /= 26;
           }

           return reversed.reverse().toString();
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn convert_to_title(mut column_number: i32) -> String {
           let mut bytes: Vec<u8> = Vec::new();

           while column_number > 0 {
               column_number -= 1;
               bytes.push(b'A' + (column_number % 26) as u8);
               column_number /= 26;
           }

           bytes.reverse();
           String::from_utf8(bytes)
               .expect("生成字符始终位于 ASCII A..Z")
       }
   }

Go
~~

.. code-block:: go

   func convertToTitle(columnNumber int) string {
       reversed := make([]byte, 0, 7)

       for columnNumber > 0 {
           columnNumber--
           reversed = append(
               reversed,
               byte('A'+columnNumber%26),
           )
           columnNumber /= 26
       }

       for left, right := 0, len(reversed)-1; left < right; {
           reversed[left], reversed[right] =
               reversed[right], reversed[left]
           left++
           right--
       }
       return string(reversed)
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function convertToTitle(columnNumber: number): string {
       const characters: string[] = [];

       while (columnNumber > 0) {
           columnNumber -= 1;
           characters.push(
               String.fromCharCode(65 + (columnNumber % 26)),
           );
           columnNumber = Math.floor(columnNumber / 26);
       }

       characters.reverse();
       return characters.join("");
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public string ConvertToTitle(int columnNumber) {
           char[] reversed = new char[7];
           int length = 0;

           while (columnNumber > 0) {
               --columnNumber;
               reversed[length++] =
                   (char)('A' + columnNumber % 26);
               columnNumber /= 26;
           }

           char[] answer = new char[length];
           for (int index = 0; index < length; ++index) {
               answer[index] = reversed[length - 1 - index];
           }
           return new string(answer);
       }
   }

Julia
~~~~~

.. code-block:: julia

   function convert_to_title(column_number::Int)::String
       current = column_number
       bytes = UInt8[]

       while current > 0
           current -= 1
           push!(bytes, UInt8('A') + UInt8(current % 26))
           current ÷= 26
       end

       reverse!(bytes)
       return String(bytes)
   end

R
~

.. code-block:: r

   convert_to_title <- function(column_number) {
     current <- as.double(column_number)
     codes <- integer(7L)
     count <- 0L

     while (current > 0) {
       current <- current - 1
       count <- count + 1L
       codes[count] <- 65L + as.integer(current %% 26)
       current <- floor(current / 26)
     }

     intToUtf8(rev(codes[seq_len(count)]))
   }

人工推演与静态审查
------------------

本题没有运行、编译或测试题解代码，也没有执行对拍、穷举、属性测试、sanitizer
或目标语言最小程序。以下证据来自逐位纸面推演、位值不变量和逐语言静态语义审查。

关键输入推演
~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 输入
     - 逆序生成
     - 反转结果
   * - ``1``
     - ``A``
     - ``A``
   * - ``26``
     - ``Z``
     - ``Z``
   * - ``28``
     - ``B, A``
     - ``AB``
   * - ``52``
     - ``Z, A``
     - ``AZ``
   * - ``701``
     - ``Y, Z``
     - ``ZY``
   * - ``2147483647``
     - ``W, X, R, H, S, X, F``
     - ``FXSHRXW``

边界链
~~~~~~

``26 -> Z``、``27 -> AA``、``52 -> AZ``、``53 -> BA``、
``702 -> ZZ``、``703 -> AAA`` 均由先减一规则自然跨位，
没有任何一轮需要表示零的字符。

逐语言静态语义审查
~~~~~~~~~~~~~~~~~~

* **C**：32 位最大输入标题长度为 7，局部数组容量闭合；成功结果单独分配并补终止符，
  调用者负责释放；分配失败返回 ``NULL``。
* **C++ / Java / Python / TypeScript**：先保存逆序字符再反转；没有在字符串前端重复插入，
  因此总构造时间保持线性。
* **Rust / Go**：只生成 ASCII 字节；反转后一次构造字符串，字符合法性由 ``0..25`` 余数保证。
* **C#**：固定七字符缓冲只写 ``length`` 项，再复制为准确长度的返回数组。
* **Julia**：``UInt8('A')`` 与 ``0..25`` 相加始终位于 ASCII 大写区间；
  ``reverse!`` 原地调整字节向量。
* **R**：双精度精确覆盖 32 位整数域；``codes`` 预分配 7 项；
  ``seq_len(count)`` 在正输入下至少含一项，``rev`` 不触发下降序列边界问题。

剩余风险
~~~~~~~~

静态审查没有确认各判题机版本或 C 分配行为。所有实现依赖题目正整数合同；
输入 0 或负数会产生空字符串或不进入循环，不属于正式支持范围。

关键边界与失败方式
------------------

* 每轮必须先减一；把减一放在取余之后会在 26 的倍数处错误。
* 余数 ``0..25`` 映射到 ``A..Z``，实际无零位数值是 ``1..26``。
* 字符按低位到高位生成，返回前必须反转。
* 终止条件是高位商变为 0，不是当前余数为 0。
* 返回字符串需要 ``O(L)`` 空间，不能只报告几个整数状态为 ``O(1)``。
* C 和 C# 的七位容量依赖当前 ``2^31-1`` 上界，扩展输入域时必须重新证明容量。
* R 不应在循环中反复把字符前插到字符串，否则累计复制可能超过线性。

学习链与知识更新
----------------

本题的关键是把“没有零字符的位制”转换成普通余数系统。先减一把合法数位
``1..26`` 平移到标准余数 ``0..25``，再用普通整除提取高位。

新增或强化：

* 无零位进制通过“先减一”转为普通欧几里得除法；
* 位值不变量同时证明每位正确和整体还原；
* 每轮商严格下降给出终止证书；
* 唯一余数与唯一商递归推出表示唯一；
* 可与下一题 `0171. Excel Sheet Column Number
  <0171-excel-sheet-column-number.rst>`_ 形成互逆学习链：0168 编码，0171 解码。

带答案自检
----------

#. **为什么输入 26 不能直接使用 ``26 % 26``？**

   余数是 0，而 Excel 没有零字符；先减一得到 25，才能正确映射为 ``Z``。

#. **每轮的高位状态为什么是 ``floor((current-1)/26)``？**

   因为当前值唯一写成 ``26q+x``，其中合法最低位 ``x`` 位于 ``1..26``；
   减一后变成标准的 ``26q+(x-1)``。

#. **为什么需要反转？**

   取余先得到最低位，循环生成顺序与标题阅读顺序相反。

#. **算法为什么一定终止？**

   新状态 ``floor((current-1)/26)`` 对所有正 ``current`` 都严格小于旧状态，最终到 0。

#. **标题表示为什么唯一？**

   每一步的余数和商由欧几里得除法唯一确定，递归应用后全部数位唯一。
