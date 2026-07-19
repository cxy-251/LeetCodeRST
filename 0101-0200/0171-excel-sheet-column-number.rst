0171. Excel Sheet Column Number
===============================

题目信息
--------

:题号: 0171
:难度: Easy
:主题: 数学、字符串、无零位二十六进制、前缀折叠
:原题: `LeetCode 0171 <https://leetcode.com/problems/excel-sheet-column-number/>`_
:访问状态: Available
:教学重点: A=1 数位、高位乘加、不变量、与 0168 互逆

精确契约
--------

输入字符串 ``columnTitle``，满足：

* 长度为 1 至 7；
* 每个字符都是大写英文字母 ``A..Z``；
* ``A`` 表示 1，``B`` 表示 2，……，``Z`` 表示 26；
* 整个标题对应的数值位于有符号 32 位整数范围内。

返回对应的 Excel 列号。输入只包含 ASCII 大写字母，因此本题按字节或 UTF-16 代码单元读取
都不会拆分字符。

示例与反例
----------

单字符
~~~~~~

``A -> 1``，``Z -> 26``。字母的数位值从 1 开始，不存在值为 0 的字符。

两字符
~~~~~~

``AB -> 28``：先读 A 得 1，再读 B：``1 * 26 + 2 = 28``。

多字符
~~~~~~

``ZY -> 701``：``26 * 26 + 25 = 701``。

最大边界
~~~~~~~~

``FXSHRXW -> 2147483647``，结果恰为有符号 32 位整数最大值。

编码规则不能照搬
~~~~~~~~~~~~~~~~

0168 从数字生成标题时需要“先减一再取余”，因为编码侧要把无零位数位转成标准余数 ``0..25``。
本题已经拿到了合法数位 ``1..26``，直接乘 26 再加当前数位即可；再次减一会把 ``A`` 错算为 0。

问题抽象与解法选择
------------------

Excel 标题是无零位二十六进制。若字符数位依次为 ``d_1,d_2,...,d_L``，其中
``1 <= d_i <= 26``，数值为：

.. math::

   d_1 26^{L-1} + d_2 26^{L-2} + \cdots + d_L

从左到右读取时，不需要显式计算幂。维护前缀值 ``answer``，每读一个新数位 ``digit``：

.. math::

   answer \leftarrow answer \times 26 + digit

这就是 Horner 形式的高位折叠。

解法取舍
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间
     - 额外空间
     - 取舍
   * - 从左到右乘加
     - ``O(L)``
     - 核心 ``O(1)``
     - 主解法；状态最少
   * - 反向扫描并维护 ``26^k``
     - ``O(L)``
     - ``O(1)``
     - 正确但多维护一个幂，乘法边界更分散
   * - 转字符数组后再折叠
     - ``O(L)``
     - ``O(L)``
     - 某些语言适配需要物化，但不是算法要求

状态、不变量与实现映射
----------------------

处理完前 ``k`` 个字符后，保持：

.. math::

   answer_k = \sum_{i=1}^{k} d_i 26^{k-i}

也就是 ``answer`` 恰好等于已经读取前缀本身代表的 Excel 列号。

读入下一位 ``d_{k+1}`` 时，旧前缀整体左移一位，相当于乘 26，再加最低位：

.. math::

   answer_{k+1}=26answer_k+d_{k+1}

实现映射：

* C、C++、Rust、Go、Julia 可按 ASCII 字节扫描；
* Java、TypeScript、C# 用字符码差得到 ``1..26``；
* Python 用 ``ord``；
* R 的 ``utf8ToInt`` 会物化整数向量，属于语言适配成本；
* Julia 的 ``codeunits`` 是字符串代码单元包装，不要求复制整个字符串。

正确性证明
----------

引理一：每个字符被映射为正确数位
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

输入字符位于 ``A..Z``。对字符码 ``code``，计算 ``code-'A'+1``，结果唯一位于 ``1..26``，
与 Excel 数位定义一致。

引理二：前缀折叠不变量始终成立
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

初始未读取字符，``answer_0=0``，空前缀值为 0。

假设处理前 ``k`` 位后不变量成立。读入 ``d_{k+1}`` 后：

.. math::

   26answer_k+d_{k+1}
   =\sum_{i=1}^{k} d_i26^{k+1-i}+d_{k+1}
   =\sum_{i=1}^{k+1}d_i26^{k+1-i}

所以新状态正是长度 ``k+1`` 前缀的数值。不变量由归纳成立。

引理三：算法终止时结果等于整个标题数值
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

循环按顺序处理每个字符，终止时 ``k=L``。由引理二，``answer_L`` 等于全部数位的位权和，
即标题对应的列号。

引理四：本解码与 0168 的编码互逆
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

0168 每轮对正整数 ``current`` 写成：

.. math::

   current=26q+(r+1),\qquad 0\le r<26

并输出数位 ``r+1``。本题从高位到低位反复应用 ``value=26value+digit``，恰好按相反方向恢复这些
商和数位组成的原整数。因此对合同范围内的正整数，先编码再解码会得到原值。

定理：算法返回正确列号
~~~~~~~~~~~~~~~~~~~~~~

引理一保证每位合法转换，引理二和引理三保证全部位按正确权重合并，因此返回值正确。

复杂度与语言成本
----------------

设标题长度为 ``L``：

* 核心时间复杂度 ``O(L)``；
* 核心状态只有一个累计值，额外空间 ``O(1)``；
* C/C++/Java/Rust/Go/TypeScript/C#/Python 可直接扫描输入；
* Julia ``codeunits`` 使用常数级包装与扫描状态；
* R ``utf8ToInt`` 物化长度 ``L`` 的整数向量，因此 R 适配额外空间为 ``O(L)``；
* 结果不超过 ``2^31-1``。TypeScript 和 R 的双精度数值远在精确整数范围内；
  固定宽语言使用 32 位整数也合法。

十语言实现
----------

C
~

.. code-block:: c

   int titleToNumber(char* columnTitle) {
       int answer = 0;

       for (const char* cursor = columnTitle; *cursor != '\0'; ++cursor) {
           const int digit = (*cursor - 'A') + 1;
           answer = answer * 26 + digit;
       }

       return answer;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       int titleToNumber(const std::string& columnTitle) {
           int answer = 0;

           for (const char character : columnTitle) {
               const int digit = (character - 'A') + 1;
               answer = answer * 26 + digit;
           }

           return answer;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def titleToNumber(self, columnTitle: str) -> int:
           answer = 0

           for character in columnTitle:
               digit = ord(character) - ord("A") + 1
               answer = answer * 26 + digit

           return answer

Java
~~~~

.. code-block:: java

   class Solution {
       public int titleToNumber(String columnTitle) {
           int answer = 0;

           for (int index = 0; index < columnTitle.length(); ++index) {
               int digit = columnTitle.charAt(index) - 'A' + 1;
               answer = answer * 26 + digit;
           }

           return answer;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn title_to_number(column_title: String) -> i32 {
           let mut answer = 0_i32;

           for byte in column_title.bytes() {
               let digit = i32::from(byte - b'A' + 1);
               answer = answer * 26 + digit;
           }

           answer
       }
   }

Go
~~

.. code-block:: go

   func titleToNumber(columnTitle string) int {
       answer := 0

       for index := 0; index < len(columnTitle); index++ {
           digit := int(columnTitle[index]-'A') + 1
           answer = answer*26 + digit
       }

       return answer
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function titleToNumber(columnTitle: string): number {
       let answer = 0;

       for (let index = 0; index < columnTitle.length; index++) {
           const digit = columnTitle.charCodeAt(index) - 65 + 1;
           answer = answer * 26 + digit;
       }

       return answer;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int TitleToNumber(string columnTitle) {
           int answer = 0;

           foreach (char character in columnTitle) {
               int digit = character - 'A' + 1;
               answer = answer * 26 + digit;
           }

           return answer;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function title_to_number(column_title::String)::Int
       answer = 0

       for byte in codeunits(column_title)
           digit = Int(byte - UInt8('A')) + 1
           answer = answer * 26 + digit
       end

       return answer
   end

R
~

.. code-block:: r

   title_to_number <- function(column_title) {
     codes <- utf8ToInt(column_title)
     answer <- 0

     for (code in codes) {
       digit <- code - utf8ToInt("A") + 1
       answer <- answer * 26 + digit
     }

     answer
   }

静态审查记录
------------

本题代码未运行、未编译、未对拍。完成了以下人工推演和语义核对：

* ``A``：``0*26+1=1``；
* ``Z``：``0*26+26=26``；
* ``AB``：``1 -> 1*26+2=28``；
* ``ZY``：``26 -> 26*26+25=701``；
* ``FXSHRXW`` 按前缀乘加最终得到 ``2147483647``；
* 十语言均采用 ``A=1``，没有错误使用 ``A=0`` 或复制 0168 的减一步骤；
* 所有扫描都基于题目保证的 ASCII 大写字母，不涉及多字节字符边界；
* 固定宽语言累计值不超过 ``INT_MAX``；TypeScript/R 保持精确整数；
* R 的输入物化成本已单独记录，Julia 未把 ``codeunits`` 误写成复制数组。

剩余风险：未在各目标平台实际编译或执行；接口命名按仓库现有语言约定静态核对。

边界、失败路径与易错点
----------------------

* 空字符串、小写字母和其他字符不在官方合同内；当前实现不承担输入校验；
* 解码时不需要先减一；先减一只属于 0168 的编码侧余数转换；
* 乘加顺序必须从左到右，反向扫描需要显式维护位权；
* ``A`` 的数位值是 1，不能使用普通零基数字语义；
* 若外部扩展允许超过 7 位的标题，应提升累计类型并定义溢出处理。

知识更新与关联题目
------------------

新增
~~~~

* **无零位进制解码**：数位域是 ``1..26``，高位折叠仍使用普通乘加；
* **编码/解码非对称步骤**：编码要减一，解码直接读取数位；
* **编解码互逆证明**：0168 的商余分解由本题按相反方向逐位恢复。

强化
~~~~

* 复用 0008 已出现的“旧前缀乘基数再加入新数位”折叠模式，本题把基数和数位域改为 26 与 ``1..26``；
* 复用 0165 已明确的字符串适配差异：R 的 ``utf8ToInt`` 物化输入，Julia 的 ``codeunits``
  只是轻量包装。

关联题目
~~~~~~~~

* 0168 Excel Sheet Column Title：本题的逆过程；
* 0150 Evaluate Reverse Polish Notation：同样把输入序列逐项折叠为状态；
* 0007 Reverse Integer：同样涉及位构造与范围边界，但基数和方向不同。

自检问题
--------

#. 为什么处理新字符时要先乘 26？
#. 为什么本题不需要执行 0168 的“先减一”？
#. 前缀不变量具体表达什么？
#. R 与 Julia 的字符串适配空间为何不同？

答案要点
~~~~~~~~

#. 旧前缀在加入一个低位数位后整体左移一位，位权都乘 26。
#. 输入字符已经代表 ``1..26`` 的合法数位；减一只用于编码时转成标准余数。
#. 处理前 ``k`` 位后，累计值恰等于该前缀的完整列号。
#. R 的 ``utf8ToInt`` 物化整数向量；Julia ``codeunits`` 返回代码单元包装并可直接扫描。
