0058. Length of Last Word
=========================

题目信息
--------

:题号: 0058
:难度: Easy
:主题: 字符串、反向扫描、边界跳过
:原题: `LeetCode 0058 <https://leetcode.com/problems/length-of-last-word/>`_
:访问状态: Available
:教学重点: 尾部空格、最大非空后缀、字符单位、语言转换成本

题目重述
--------

给定字符串 ``s``，返回其中最后一个单词的长度。单词定义为由连续英文字母组成的最大非空子串，
单词之间由一个或多个空格分隔。

题目保证：

* ``1 <= s.length <= 10000``；
* ``s`` 只包含英文字母和普通空格 ``' '``；
* 字符串中至少存在一个单词。

主实现不修改输入字符串。由于字符域只有 ASCII 英文字母和空格，字节、UTF-16 代码单元与 Unicode
码点在本题中一一对应，返回长度单位没有歧义。

自建示例
--------

尾部没有空格
~~~~~~~~~~~~

.. code-block:: text

   输入："Hello World"
   输出：5

尾部有多个空格
~~~~~~~~~~~~~~

.. code-block:: text

   输入："  fly me   to   the moon  "
   输出：4

单个单词
~~~~~~~~

.. code-block:: text

   输入："algorithm"
   输出：9

单字符单词
~~~~~~~~~~

.. code-block:: text

   输入："a "
   输出：1

问题抽象
--------

从字符串末尾向左扫描分成两个阶段：

#. 跳过全部尾部空格；
#. 从最后一个非空格字符开始计数，直到遇到空格或字符串开头。

第二阶段访问的连续字符正是最后一个单词。题目保证至少存在一个单词，因此第一阶段结束后一定能找到
非空格字符。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 算法额外空间
     - 定位
   * - 从末尾两阶段扫描
     - ``O(n)``
     - ``O(1)``
     - 主解法；只访问必要后缀
   * - 分割成全部单词
     - ``O(n)``
     - ``O(n)``
     - 构造了不需要的中间数组
   * - 去除尾部空格后查找最后空格
     - ``O(n)``
     - 取决于字符串 API
     - 可能创建新字符串

主解法：跳过空格后计数
----------------------

核心不变量
~~~~~~~~~~

令 ``index`` 指向尚未处理后缀的最后一个字符：

* 第一阶段中，``index`` 右侧全部是尾部空格；
* 第一阶段结束时，``index`` 指向最后一个单词的最后一个字母；
* 第二阶段中，已经计数的字符全部属于同一个连续单词；
* 第二阶段遇到空格或越过字符串左边界时，计数恰好是最后一个单词长度。

为什么从末尾更直接
~~~~~~~~~~~~~~~~~~

从左到右扫描也可以持续记录当前单词长度，并在遇到空格时更新答案。但反向扫描只关心最后一个单词，
可以直接忽略前面所有内容；尾部空格和最后单词的边界也分别由两个简单循环负责。

正确性依据
~~~~~~~~~~

**尾部空格跳过正确。** 第一阶段只删除字符串结尾连续出现的空格。它们不属于任何单词，因此不会
改变最后一个单词。

**起点定位正确。** 题目保证至少存在一个单词，所以跳过尾部空格后，``index`` 必然指向最后一个
单词的最后一个字母。

**计数完整。** 第二阶段持续向左经过非空格字符，直到遇到分隔空格或字符串开头。根据单词是最大连续
字母子串的定义，这段字符全部且仅属于最后一个单词。

**终止性。** ``index`` 每轮减一，最多移动字符串长度次，有限步后结束。

复杂度
~~~~~~

设字符串长度为 ``n``：

* 最坏情况下扫描全部字符串，时间复杂度为 ``O(n)``；
* C、C++、Python、Java、Rust、Go、TypeScript、C# 和 Julia 主实现只保存下标与计数，算法额外空间
  为 ``O(1)``；
* R 的 ``charToRaw`` 会建立 ``O(n)`` ASCII 字节副本，因此该适配器额外空间为 ``O(n)``；
* 返回值是单个整数。

核心语言实现
------------

C
~

.. code-block:: c

   #include <string.h>

   int lengthOfLastWord(const char *s) {
       size_t index = strlen(s);

       while (index > 0U && s[index - 1U] == ' ') {
           --index;
       }

       size_t end = index;
       while (index > 0U && s[index - 1U] != ' ') {
           --index;
       }

       return (int)(end - index);
   }

精确约束保证结果不超过 ``10000``，从 ``size_t`` 窄化为 ``int`` 安全。

C++
~~~

.. code-block:: cpp

   #include <string>

   class Solution {
   public:
       int lengthOfLastWord(const std::string& s) {
           std::size_t index = s.size();

           while (index > 0U && s[index - 1U] == ' ') {
               --index;
           }

           std::size_t end = index;
           while (index > 0U && s[index - 1U] != ' ') {
               --index;
           }

           return static_cast<int>(end - index);
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def lengthOfLastWord(self, s: str) -> int:
           index = len(s) - 1

           while index >= 0 and s[index] == " ":
               index -= 1

           length = 0
           while index >= 0 and s[index] != " ":
               length += 1
               index -= 1

           return length

Java
~~~~

.. code-block:: java

   class Solution {
       public int lengthOfLastWord(String s) {
           int index = s.length() - 1;

           while (index >= 0 && s.charAt(index) == ' ') {
               --index;
           }

           int length = 0;
           while (index >= 0 && s.charAt(index) != ' ') {
               ++length;
               --index;
           }
           return length;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn length_of_last_word(s: String) -> i32 {
           let bytes = s.as_bytes();
           let mut index = bytes.len();

           while index > 0 && bytes[index - 1] == b' ' {
               index -= 1;
           }

           let end = index;
           while index > 0 && bytes[index - 1] != b' ' {
               index -= 1;
           }

           (end - index) as i32
       }
   }

按字节扫描由精确 ASCII 字符约束支撑；``as_bytes`` 借用原字符串，不复制内容。

Go
~~

.. code-block:: go

   func lengthOfLastWord(s string) int {
       index := len(s)

       for index > 0 && s[index-1] == ' ' {
           index--
       }

       end := index
       for index > 0 && s[index-1] != ' ' {
           index--
       }

       return end - index
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function lengthOfLastWord(s: string): number {
       let index = s.length - 1;

       while (index >= 0 && s[index] === " ") {
           index -= 1;
       }

       let length = 0;
       while (index >= 0 && s[index] !== " ") {
           length += 1;
           index -= 1;
       }

       return length;
   }

TypeScript 字符串下标返回 UTF-16 代码单元；ASCII 约束保证每个字母占一个代码单元。

C#
~~

.. code-block:: csharp

   public class Solution {
       public int LengthOfLastWord(string s) {
           int index = s.Length - 1;

           while (index >= 0 && s[index] == ' ') {
               --index;
           }

           int length = 0;
           while (index >= 0 && s[index] != ' ') {
               ++length;
               --index;
           }
           return length;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function length_of_last_word(s::String)::Int
       bytes = codeunits(s)
       index = length(bytes)

       while index >= 1 && bytes[index] == UInt8(' ')
           index -= 1
       end

       ending = index
       while index >= 1 && bytes[index] != UInt8(' ')
           index -= 1
       end

       ending - index
   end

``codeunits`` 提供字符串底层 UTF-8 代码单元视图；ASCII 约束保证按字节计数等于字母数量。

R
~

.. code-block:: r

   length_of_last_word <- function(s) {
     bytes <- charToRaw(s)
     index <- length(bytes)
     space <- charToRaw(" ")[[1L]]

     while (index >= 1L && bytes[[index]] == space) {
       index <- index - 1L
     }

     ending <- index
     while (index >= 1L && bytes[[index]] != space) {
       index <- index - 1L
     }

     as.integer(ending - index)
   }

``charToRaw`` 创建 ASCII 字节向量，因此 R 版本需要 ``O(n)`` 输入规范化空间；算法扫描状态仍为
常数规模。

语言语义与边界
--------------

* 题目保证至少一个单词，跳过尾部空格后存在非空格字符；
* 空格只指普通 ASCII 空格，不把制表符或其他 Unicode 空白当作分隔符；
* 字符域只有英文字母和空格，按字节、UTF-16 代码单元或码点计数都一致；
* C/C++ 使用无符号长度时，先检查 ``index > 0`` 再访问 ``index - 1``，避免下溢；
* 复杂度按语言真实转换成本报告，R 不沿用统一的 ``O(1)`` 空间结论。

验证
----

固定用例
~~~~~~~~

覆盖：

* 无尾部空格；
* 一个和多个尾部空格；
* 字符串只有一个单词；
* 单字符单词；
* 多个连续分隔空格；
* 字符串开头存在空格。

随机对拍
~~~~~~~~

随机生成仅含英文字母和普通空格、且至少包含一个单词的字符串。主算法与独立参考步骤比较：

#. 从右侧删除普通空格；
#. 找到剩余字符串最后一个空格；
#. 计算其后字符数量。

同时检查返回值严格大于零且不超过字符串长度。

关联题目
--------

* ``0028. Find the Index of the First Occurrence in a String``：字符单位与返回坐标；
* ``0058. Length of Last Word``：反向扫描最大非空后缀；
* ``0008. String to Integer (atoi)``：分阶段跳过前导字符并解析有效主体。
