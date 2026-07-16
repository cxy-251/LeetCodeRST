0151. Reverse Words in a String
===============================

题目信息
--------

:题号: 0151
:难度: Medium
:主题: 字符串、逆向扫描、输出构造
:原题: `LeetCode 0151 <https://leetcode.com/problems/reverse-words-in-a-string/>`_
:访问状态: Available
:教学重点: 最右单词提取、半开边界、单分隔符、输出物化

精确契约
--------

输入字符串 ``s`` 满足：

* ``1 <= len(s) <= 10000``；
* 只含大写英文字母、小写英文字母、数字和普通空格 ``' '``，因此全部字符都在 ASCII 内；
* 至少含一个单词；单词是一个最大的连续非空格字符片段；
* 相邻单词之间至少有一个空格，字符串首尾也可能有空格；
* 输入只读。C++ 的平台签名按值接收字符串，Rust 按值取得所有权，但本文实现都不修改字符内容。

返回一个新字符串，其中原单词顺序完全反转、每个单词内部字符顺序不变、相邻输出单词之间恰有一个空格，
且没有首尾空格。例如输入中的三段连续空格只承担“分隔”作用，不会原样进入结果。

设原串长度为 ``n``、单词数为 ``k``、单词字符总量为 ``w``，则结果长度
``r = w + k - 1``。原串至少含这 ``w`` 个字符和分隔相邻单词所需的 ``k-1`` 个空格，故
``r <= n``。这个上界直接支撑 C 的 ``n+1`` 返回缓冲区。

本文的字节扫描依赖官方 ASCII 字符域。若扩展到一般 Unicode，字节、UTF-16 代码单元和用户看到的字符
不再一一对应，必须重新定义“字符”和切片边界，不能直接沿用本文证明。

自建示例与反例
--------------

多余空格与数字
~~~~~~~~~~~~~~

.. code-block:: text

   输入："  x9   Y2 z  "
   输出："z Y2 x9"

从右向左依次找到 ``z``、``Y2``、``x9``。输出构造器只在已有单词之后、追加下一个单词之前写一个空格，
因此不会保留输入中的前导、尾随或重复空格。

不能翻转全部字符后直接返回
~~~~~~~~~~~~~~~~~~~~~~~~~~

若把 ``"ab cd"`` 的所有字符直接翻转，会得到 ``"dc ba"``；正确答案是 ``"cd ab"``。题目只反转
单词次序，不反转单词内部。可以先整体翻转再逐词翻回，但那更适合可变字符数组；当前跨语言
主方案直接从右向左复制完整单词，省去第二阶段恢复证明。

问题抽象与解法选择
------------------

把输入看作交替出现的“空格段”和“单词段”。目标只保留单词段，并按它们在原串中的相反顺序输出。于是无需
修改输入，也无需先解析所有空格长度：每轮在尚未处理前缀中选择最右单词即可。

为避免 ``end = -1`` 和无符号下溢，统一把 ``end`` 定义为半开前缀 ``s[0:end)`` 的右边界：

#. 从 ``end`` 向左跳过 ``s[end-1]`` 处的空格；
#. 跳空格后的位置就是当前最右单词的半开终点 ``word_end=end``；
#. 继续向左找到最小 ``start``，使单词为 ``s[start:word_end]``；
#. 把该片段按正向字符顺序写入结果，并令 ``end=start``。

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间
     - 工作与输出空间
     - 取舍
   * - 从右向左定位单词并构造结果
     - ``O(n+r)``
     - 核心 ``O(1)``，返回 ``O(r)``
     - 主解法；空格规范化和逆序同时完成
   * - ``split``、过滤、反转、``join``
     - 通常 ``O(n+r)``
     - 单词/切片容器与返回 ``O(n+r)``
     - 代码短，但容易隐藏输入拆分和多份字符串物化
   * - 整体翻转、逐词翻回、压缩空格
     - ``O(n)``
     - 可变数组核心 ``O(1)``
     - 适合原地 follow-up；跨语言不可变字符串适配差异更大
   * - 从左扫描后头插每个单词
     - 可达 ``O(n²)``
     - 依容器而定
     - 头部插入会反复移动已有输出

状态与代码映射
--------------

``end``
   当前未处理前缀 ``s[0:end)`` 的半开右边界，合法范围 ``0..n``。读取前必须先证明
   ``end > 0``，实际访问位置是 ``end-1``。

``word_end``
   跳过空格后，尚未处理最右单词的半开终点。部分实现复用变量 ``end`` 保存它。

``start``
   向左定位单词时的半开起点。单词是 ``[start,word_end)``，长度为 ``word_end-start > 0``。

``result`` 或 ``words``
   已按目标顺序写出的单词。C、C++、Java、Rust、Go、C# 直接写输出构造器；Python、TypeScript、
   Julia、R 先保存单词片段，再统一连接。

``write``
   C 结果缓冲区下一写入位置，也等于已经写出的结果字符数。

算法
----

#. 初始化 ``end=n``，结果为空。
#. 当 ``end>0`` 时：

   #. 只要 ``end>0`` 且 ``s[end-1]`` 是空格，就递减 ``end``；
   #. 若 ``end==0``，说明只剩前导空格，结束；
   #. 保存 ``word_end=end``，令 ``start=end``；
   #. 只要 ``start>0`` 且 ``s[start-1]`` 不是空格，就递减 ``start``；
   #. 若结果非空，先写一个空格；再正向写出 ``s[start:word_end]``；
   #. 令 ``end=start``，继续处理左侧前缀。

#. 返回结果。

核心不变量
----------

未处理前缀不变量
~~~~~~~~~~~~~~~~

每轮外层开始时，尚未提交的全部单词都完整位于 ``s[0:end)``，已经提交的单词都位于其右侧。前缀末端可能
只有空格；跳过这些空格不会删除任何单词。

最右单词不变量
~~~~~~~~~~~~~~~~

跳空格后若 ``end>0``，则 ``s[end-1]`` 是非空格。向左移动 ``start``，直到到达字符串左端或前一个空格，
得到的 ``[start,end)`` 恰是未处理前缀的最右完整单词：区间内全是非空格，左右边界都由字符串端点或空格
封闭。

输出不变量
~~~~~~~~~~

结果中的单词恰是原单词序列的一个后缀，并按从右到左的顺序出现；每个单词内部保持原顺序，相邻结果单词间
恰有一个空格，结果没有首尾空格。

覆盖与终止不变量
~~~~~~~~~~~~~~~~~~

每轮只提交当前最右未处理单词，随后把 ``end`` 移到该词起点。这个非空单词至少含一个字符，
所以新的边界严格小于跳空格前的正边界；没有单词会被重复提交，有限下标最终到达 0。

正确性证明
----------

引理一：跳空格后定位到尚未处理的最右单词
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

未处理前缀末尾的空格不属于任何单词，逐个跳过不改变未处理单词集合。题目保证至少一个单词；若跳到 0，
说明所有单词都已在此前提交，只剩前导空格。否则 ``s[end-1]`` 非空格。

从 ``end`` 向左经过连续非空格字符，直到左端或空格为止。根据“单词是最大连续非空格片段”的定义，
``[start,end)`` 既不会缺少该单词字符，也不会跨入左侧另一个单词，因此恰是未处理最右单词。

引理二：提交一步保持未处理前缀不变量
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

由引理一，提交的区间是未处理最右单词。令新 ``end=start`` 后，该词及其右侧字符全部位于新边界右侧；
所有其他未处理单词都在它左侧，仍完整位于 ``s[0:end)``。单词区间互不重叠，所以已提交集合新增且仅新增
这一词，不会重复或遗漏。未处理前缀不变量保持。

引理三：提交一步保持输出不变量
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

算法按 ``start`` 到 ``word_end-1`` 的正向次序复制字符，所以单词内部顺序不变。引理一说明新词是所有
未处理词中最靠右的，故它紧接在已经输出的右侧后缀之后，继续保持全局从右到左的顺序。

结果为空时直接写第一个词，不产生前导空格；结果非空时先且只先写一个空格，再写非空单词，因此相邻词之间
恰有一个空格且末尾总是单词字符。输入空格从未被复制，所以不会产生尾随空格。输出不变量保持。

引理四：循环终止且每个单词恰提交一次
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

每个成功迭代都提交一个长度至少为 1 的单词，并把 ``end`` 严格向左移动。空格跳过也只递减 ``end``；
``end`` 是非负整数，故循环有限。终止时 ``end=0``，由未处理前缀不变量可知没有未提交单词。引理二又说明
每轮只增加一个此前未提交的词，因此每个原单词恰好提交一次。

定理：算法返回符合要求的逆序单词字符串
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

引理四保证输出覆盖全部且仅覆盖原单词。输出不变量保证它们按原顺序的逆序出现，单词内部顺序不变，单词间
恰一个空格且无首尾空格。因此返回字符串满足题目全部要求。

复杂度与真实语言成本
--------------------

设输入长度为 ``n``、结果长度为 ``r``、单词数为 ``k``。每个输入字符至多被空格扫描或单词扫描访问一次，
定位时间 ``O(n)``；写出所有单词和 ``k-1`` 个空格需要 ``O(r)``，总时间 ``O(n+r)=O(n)``。
返回字符串本身是不可避免的 ``Theta(r)`` 载荷，不能用“只有三个下标”把总空间写成 ``O(1)``。

各实现的峰值和累计物化不同：

* C 分配 ``n+1`` 字节并直接作为返回值，算法索引 ``O(1)``，返回容量 ``O(n)``；
* C++ 的平台参数按值复制输入 ``O(n)``，另有最多 ``O(r)`` 的结果容量；返回时通常移动结果，但渐进峰值
  仍包含输入副本和结果；
* Java、C# 的构建器保存 ``O(r)`` 字符，``toString`` 会形成返回字符串，转换瞬间可能同时保留两份
  ``O(r)`` 载荷；
* Rust 按值拥有输入 ``String``，Go 的子串表达式临时共享输入字节；两者都把片段立即复制到
  独立结果构建器，
  峰值包含输入 ``O(n)`` 与结果 ``O(r)``；
* Python、TypeScript 先保存 ``k`` 个片段。按保守物化模型，片段字符总量 ``O(w)``、引用元数据
  ``O(k)``、最终 join ``O(r)``，连接时可能同时存活；
* Julia 的 ``codeunits`` 是 ``O(1)`` 轻量视图，但每个
  ``String(Vector{UInt8}(...))`` 都复制单词字节，
  再由 ``join`` 分配 ``O(r)`` 结果；
* R 的 ``utf8ToInt`` 先物化 ``O(n)`` 整数向量，``intToUtf8`` 物化各词，列表保存 ``O(k)`` 元数据，
  最终 ``paste`` 再分配 ``O(r)`` 返回；峰值为 ``O(n+r+k)``。

十语言实现
----------

C
~

.. code-block:: c

   #include <stddef.h>
   #include <stdlib.h>
   #include <string.h>

   char *reverseWords(char *s) {
       const size_t length = strlen(s);
       char *result = malloc(length + 1U);
       if (result == NULL) {
           return NULL;
       }

       size_t end = length;
       size_t write = 0U;
       while (end > 0U) {
           while (end > 0U && s[end - 1U] == ' ') {
               --end;
           }
           if (end == 0U) {
               break;
           }

           size_t start = end;
           while (start > 0U && s[start - 1U] != ' ') {
               --start;
           }

           if (write > 0U) {
               result[write++] = ' ';
           }
           const size_t word_length = end - start;
           memcpy(result + write, s + start, word_length);
           write += word_length;
           end = start;
       }

       result[write] = '\0';
       return result;
   }

C++
~~~

.. code-block:: cpp

   #include <cstddef>
   #include <string>

   class Solution {
   public:
       std::string reverseWords(std::string s) {
           std::string result;
           result.reserve(s.size());
           std::size_t end = s.size();

           while (end > 0U) {
               while (end > 0U && s[end - 1U] == ' ') {
                   --end;
               }
               if (end == 0U) {
                   break;
               }

               std::size_t start = end;
               while (start > 0U && s[start - 1U] != ' ') {
                   --start;
               }

               if (!result.empty()) {
                   result.push_back(' ');
               }
               result.append(s, start, end - start);
               end = start;
           }

           return result;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def reverseWords(self, s: str) -> str:
           words: list[str] = []
           end = len(s)

           while end > 0:
               while end > 0 and s[end - 1] == " ":
                   end -= 1
               if end == 0:
                   break

               start = end
               while start > 0 and s[start - 1] != " ":
                   start -= 1
               words.append(s[start:end])
               end = start

           return " ".join(words)

Java
~~~~

.. code-block:: java

   class Solution {
       public String reverseWords(String s) {
           StringBuilder result = new StringBuilder(s.length());
           int end = s.length();

           while (end > 0) {
               while (end > 0 && s.charAt(end - 1) == ' ') {
                   --end;
               }
               if (end == 0) {
                   break;
               }

               int start = end;
               while (start > 0 && s.charAt(start - 1) != ' ') {
                   --start;
               }

               if (result.length() > 0) {
                   result.append(' ');
               }
               result.append(s, start, end);
               end = start;
           }

           return result.toString();
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn reverse_words(s: String) -> String {
           let bytes = s.as_bytes();
           let mut result = String::with_capacity(s.len());
           let mut end = bytes.len();

           while end > 0 {
               while end > 0 && bytes[end - 1] == b' ' {
                   end -= 1;
               }
               if end == 0 {
                   break;
               }

               let mut start = end;
               while start > 0 && bytes[start - 1] != b' ' {
                   start -= 1;
               }

               if !result.is_empty() {
                   result.push(' ');
               }
               result.push_str(&s[start..end]);
               end = start;
           }

           result
       }
   }

Go
~~

.. code-block:: go

   import "strings"

   func reverseWords(s string) string {
       var result strings.Builder
       result.Grow(len(s))
       end := len(s)

       for end > 0 {
           for end > 0 && s[end-1] == ' ' {
               end--
           }
           if end == 0 {
               break
           }

           start := end
           for start > 0 && s[start-1] != ' ' {
               start--
           }

           if result.Len() > 0 {
               result.WriteByte(' ')
           }
           result.WriteString(s[start:end])
           end = start
       }

       return result.String()
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function reverseWords(s: string): string {
       const words: string[] = [];
       let end = s.length;

       while (end > 0) {
           while (end > 0 && s[end - 1] === " ") {
               end -= 1;
           }
           if (end === 0) {
               break;
           }

           let start = end;
           while (start > 0 && s[start - 1] !== " ") {
               start -= 1;
           }
           words.push(s.slice(start, end));
           end = start;
       }

       return words.join(" ");
   }

C#
~~

.. code-block:: csharp

   using System.Text;

   public class Solution {
       public string ReverseWords(string s) {
           var result = new StringBuilder(s.Length);
           int end = s.Length;

           while (end > 0) {
               while (end > 0 && s[end - 1] == ' ') {
                   --end;
               }
               if (end == 0) {
                   break;
               }

               int start = end;
               while (start > 0 && s[start - 1] != ' ') {
                   --start;
               }

               if (result.Length > 0) {
                   result.Append(' ');
               }
               result.Append(s, start, end - start);
               end = start;
           }

           return result.ToString();
       }
   }

Julia
~~~~~

.. code-block:: julia

   function reverse_words(s::String)::String
       bytes = codeunits(s)
       words = String[]
       stop = length(bytes)

       while stop > 0
           while stop > 0 && bytes[stop] == UInt8(' ')
               stop -= 1
           end
           stop == 0 && break

           start = stop
           while start > 1 && bytes[start - 1] != UInt8(' ')
               start -= 1
           end
           push!(
               words,
               String(Vector{UInt8}(bytes[start:stop])),
           )
           stop = start - 1
       end

       return join(words, " ")
   end

R
~

.. code-block:: r

   reverse_words <- function(s) {
     chars <- utf8ToInt(s)
     words <- vector("list", length(chars))
     count <- 0L
     stop <- length(chars)

     while (stop > 0L) {
       while (stop > 0L && chars[stop] == 32L) {
         stop <- stop - 1L
       }
       if (stop == 0L) {
         break
       }

       start <- stop
       while (start > 1L && chars[start - 1L] != 32L) {
         start <- start - 1L
       }
       count <- count + 1L
       words[[count]] <- intToUtf8(chars[start:stop])
       stop <- start - 1L
     }

     paste(
       unlist(words[seq_len(count)], use.names = FALSE),
       collapse = " "
     )
   }

人工推演与静态审查
------------------

本题没有运行、编译或测试任何题解代码，没有执行官方示例、随机对拍、穷举、属性测试、
sanitizer 或目标语言最小程序。以下内容均是半开边界纸面推演、字符域推导和逐语言静态
语义审查。

官方示例一
~~~~~~~~~~

``"the sky is blue"`` 长度为 15：

.. list-table::
   :header-rows: 1

   * - 进入时 ``end``
     - 跳空格后 ``word_end``
     - ``start``
     - 提交词
     - 当前结果
   * - 15
     - 15
     - 11
     - ``blue``
     - ``blue``
   * - 11
     - 10
     - 8
     - ``is``
     - ``blue is``
   * - 8
     - 7
     - 4
     - ``sky``
     - ``blue is sky``
   * - 4
     - 3
     - 0
     - ``the``
     - ``blue is sky the``

每轮复制的区间分别是 ``[11,15)``、``[8,10)``、``[4,7)``、``[0,3)``。

官方示例二
~~~~~~~~~~

``"  hello world  "`` 长度为 15。第一次从 ``end=15`` 跳过两个尾空格到 13，提交
``[8,13)="world"``；下一轮跳过索引 7 的分隔空格，提交 ``[2,7)="hello"``；最后把
``end=2`` 的两个前导空格跳到 0。结果是 ``"world hello"``，没有复制任何外围空格。

官方示例三
~~~~~~~~~~

``"a good   example"`` 的单词区间依次为 ``[9,16)``、``[2,6)``、``[0,1)``。中间三空格只让
边界从 9 移到 6，不写入结果；依次提交 ``example``、``good``、``a``，得到
``"example good a"``。

关键边界纸面推导
~~~~~~~~~~~~~~~~

* ``"a"``：``end=1``、``start=0``，一次提交后结束，结果无分隔符；
* ``"   abc   "``：两侧空格都被扫描但不复制，结果为 ``"abc"``；
* ``"a b"``：``r=n=3``，C 的 ``n+1`` 容量仍包含终止符；
* ``"  x9   Y2 z  "``：数字与字母都只是非空格字节，依次提交 ``z``、``Y2``、``x9``；
* 每次读取 ``s[end-1]`` 或 ``s[start-1]`` 前都先检查边界大于 0，因此零基无符号实现不会下溢；
* 至少一个单词保证 R 的 ``count>=1``，所以 ``seq_len(count)`` 不会构造错误的 ``1:0`` 范围。

C 容量与资源审查
~~~~~~~~~~~~~~~~

``strlen`` 首先得到 ``n<=10000``，所以 ``n+1`` 不会在 ``size_t`` 中溢出。证明中的 ``r<=n`` 保证每个
单词字符和最多 ``k-1`` 个输出空格都装入前 ``n`` 个槽，``result[write]='\0'`` 写在第 ``n+1`` 个容量
范围内。``memcpy`` 的源区间和目标区间不重叠，长度 ``end-start`` 为正且不越过输入或结果边界。

若 ``malloc`` 失败，函数在写入前返回 ``NULL``，没有部分结果或待释放资源。成功返回的缓冲区
由调用者释放；函数没有修改 ``s``。这是与合法空字符串结果不同的正式失败值，而本题输入至少
一个单词，正常结果也不会为空。

逐语言静态语义审查
~~~~~~~~~~~~~~~~~~

* **C / C++**：全部边界使用 ``size_t`` 半开下标，先检查正值再减一。C++ ``append(s,start,count)``
  复制正向单词，按值参数已经产生输入副本；两个实现都直接构造最终结果。
* **Python**：负下标从未参与读取；``s[start:end]`` 是半开复制，片段总字符数为 ``w``，``join`` 再生成
  独立返回字符串。
* **Java / C#**：两种构建器追加 API 都使用 ``start`` 与长度或半开 ``end``，没有创建每词 substring；
  ``toString`` 才生成返回字符串。ASCII 让代码单元与题目字符一致。
* **Rust**：字节扫描由 ASCII 契约支撑，所以 ``start``、``end`` 必是 UTF-8 字符边界，
  ``&s[start..end]``
  不会切断码点。借用片段只活到 ``push_str`` 调用，结果拥有独立字节。
* **Go**：字符串索引按字节，ASCII 合同使其正确；``s[start:end]`` 临时共享输入，
  ``WriteString`` 把字节
  复制到 builder。``Grow(n)`` 只预留上界，不改变逻辑长度。
* **TypeScript**：字符串下标和 ``slice`` 按 UTF-16 代码单元；当前 ASCII 域使它们与字符位置一致。
  ``words`` 按发现顺序已经是目标顺序，无需再 reverse。
* **Julia**：``codeunits`` 是轻量视图，不是 ``O(n)`` 复制。一基 ``stop`` 对应最后一个真实字节，
  ``start:stop`` 只在 ``start<=stop`` 时构造；每词转成独立 ``String``，再由 ``join`` 返回新串。
* **R**：``utf8ToInt`` 物化码点数组；ASCII 空格码为 32。一基 ``start:stop`` 始终非空正向，外层
  ``while`` 避免反向 ``seq.int``；预分配列表避免反复 ``c`` 追加。

剩余风险
~~~~~~~~

静态审查没有观察各运行时构建器的实际扩容倍数、字符串内部编码、返回值优化或垃圾回收峰值，
也没有确认判题机模板和版本。C 的分配失败、托管语言内存不足异常、Go
``Builder.String`` 的具体底层布局、Julia/R 的字符串分配常数都未运行确认；本文只声明
可由接口与语义规则静态推出的结论。

关键边界与失败方式
------------------

* 先找单词再跳空格，会把尾随空格误当空单词；两阶段顺序不能颠倒。
* ``end`` 是半开边界，最后真实字符在 ``end-1``；把它当闭区间会越界或漏掉字符。
* 复制单词必须按 ``start`` 到 ``word_end`` 的正向顺序，不能翻转单词内部。
* 结果分隔符只在结果非空时写一次；照抄输入空格会产生重复或首尾空格。
* 无符号下标先减后判零会绕回大值；本文所有实现都先检查 ``>0``。
* 字节切片只因 ASCII 合同安全；一般 UTF-8 字符串可能在多字节码点中间切开。
* “三个下标是 O(1)”只描述核心扫描状态，不能消除 ``Theta(r)`` 返回载荷和语言物化。
* C 的缓冲要包含终止符，分配失败要在首次写入前返回，成功结果的释放责任不能遗漏。
* C++ 按值 ``s``、Julia/R 输入物化、Python/TypeScript 片段与 join 都要计入真实峰值。

学习链与知识更新
----------------

本题把字符串规范化拆成两个互相独立的动作：扫描阶段只识别最大非空格片段，输出阶段只按“已有词才加一个
分隔符”的规则提交。这样重复空格不会进入核心状态，也不需要在末尾再删除多余空格。

新增或强化的知识包括：

* 用半开右边界统一有符号和无符号逆向扫描，避免 ``-1`` 哨兵；
* “每轮选择未处理最右对象”可直接构造逆序输出，不需要再反转片段数组；
* 输出格式不变量同时证明无前导、无尾随和单分隔符；
* 返回字符串的 ``Theta(r)`` 载荷与核心 ``O(1)`` 索引必须分开报告；
* ASCII 契约让字节、UTF-16 代码单元和字符位置一致，但这种一致性不能外推到 Unicode；
* 关联到 `0125. Valid Palindrome <0125-valid-palindrome.rst>`_ 的双向字符扫描；本题新增了片段提交和
  输出物化责任；
* 可继续关联到可变字符数组上的原地整体翻转与逐词恢复技术。

带答案自检
----------

#. **为什么从右向左发现的单词不需要再反转数组？**

   目标本来就是原单词从右到左的顺序；发现顺序与输出顺序相同。

#. **为什么 ``end`` 定义为半开边界更安全？**

   它可以合法取 0 和 n；只有在 ``end>0`` 时才读取 ``end-1``，无需负下标哨兵。

#. **怎样保证单词内部字符不被翻转？**

   虽然单词按从右到左发现，但每个区间都按 ``start..word_end`` 的正向次序复制。

#. **为什么输出没有首尾空格？**

   第一个词前不加分隔符，此后每个词前恰加一个；每次提交最终都以非空单词结束。

#. **为什么 C 分配 ``n+1`` 一定足够？**

   结果含全部单词字符和 ``k-1`` 个单空格，这些在原串中至少已占 ``w+k-1`` 个位置，所以 ``r<=n``；
   再加一槽保存 ``'\0'``。

#. **Rust 和 Go 为什么可以按字节下标切词？**

   官方字符域全是单字节 ASCII，因此每个字节边界也是合法字符边界。

#. **为什么总空间不能简单写成 ``O(1)``？**

   只有扫描下标是常数；返回字符串本身需要 ``Theta(r)``，部分语言还保存片段、输入副本或字符物化。
