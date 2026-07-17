0214. Shortest Palindrome
=========================

题目信息
--------

:题号: 0214
:难度: Hard
:主题: 字符串、回文、KMP、前缀函数、最优构造
:原题: `LeetCode 0214 <https://leetcode.com/problems/shortest-palindrome/>`_
:访问状态: Available
:教学重点: 最长回文前缀、最少前置字符、KMP 最终 border、安全分隔符、字符串资源

精确契约
--------

给定一个只含小写英文字母的字符串 ``s``，只能在 ``s`` 的前面添加字符。返回能够得到的最短回文字符串。

本文采用以下合同：

* 原字符串 ``s`` 必须作为结果的完整后缀，字符顺序不能改变；
* 只能向前添加字符，不能在中间或尾部插入、删除、替换字符；
* 返回结果必须从左到右与从右到左完全相同；
* 若存在多个同长度答案，题目结构仍会确定本文构造的标准答案；
* 输入字符串保持只读；
* 空字符串返回空字符串；
* 官方字符域为 ``a`` 到 ``z``，因此可以按 ASCII 字节或等价代码单元处理。

最后一条只适用于官方字符域。本文的字节实现不能无条件推广为“任意 Unicode 字符或用户感知字素都正确”。

自建示例
--------

经典示例一
~~~~~~~~~~

.. code-block:: text

   s = "aacecaaa"
   最长回文前缀 = "aacecaa"
   剩余后缀 = "a"
   添加 reverse("a") = "a"
   result = "aaacecaaa"

只需添加一个字符。

经典示例二
~~~~~~~~~~

.. code-block:: text

   s = "abcd"
   最长回文前缀 = "a"
   剩余后缀 = "bcd"
   添加 reverse("bcd") = "dcb"
   result = "dcbabcd"

``abcd`` 没有长度大于 1 的回文前缀，因此必须添加三个字符。

空串、单字符与完整回文
~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: text

   ""        -> ""
   "a"       -> "a"
   "racecar" -> "racecar"
   "aaaa"    -> "aaaa"

整个字符串已经是回文时，不需要添加任何字符。

接近完整回文
~~~~~~~~~~~~

.. code-block:: text

   s = "aaab"
   最长回文前缀 = "aaa"
   剩余后缀 = "b"
   result = "baaab"

重复字符不能让算法简单地假定整个字符串回文；仍需找到精确的最长回文前缀。

较长后缀
~~~~~~~~

.. code-block:: text

   s = "abbacd"
   最长回文前缀 = "abba"
   剩余后缀 = "cd"
   result = "dcabbacd"

问题抽象
--------

设原字符串长度为 ``n``。若它的最长回文前缀长度为 ``L``，可写成：

.. code-block:: text

   s = P + R
   |P| = L
   P 是回文

把 ``R`` 反转后添加到前面：

.. code-block:: text

   answer = reverse(R) + P + R

因为 ``P = reverse(P)``，整个结果反转后仍是：

.. code-block:: text

   reverse(R) + reverse(P) + R
   = reverse(R) + P + R

所以构造结果一定是回文。问题剩下两个核心部分：

#. 为什么任何更短的前置字符串都不可能成功；
#. 如何在线性时间内找到最长回文前缀长度 ``L``。

最少添加字符与最长回文前缀
--------------------------

构造使用 ``n-L`` 个新字符。下面证明这是最少数量。

任意可行结果的重叠区域
~~~~~~~~~~~~~~~~~~~~~~

假设在 ``s`` 前添加长度为 ``k`` 的字符串 ``x``，得到回文串：

.. code-block:: text

   q = x + s
   |x| = k
   |q| = n + k

当 ``k<n`` 时，考察 ``s`` 的前 ``n-k`` 个字符。结果串位置 ``k+i`` 保存 ``s[i]``，其中
``0 <= i < n-k``。它在回文中的镜像位置是：

.. code-block:: text

   n + k - 1 - (k + i) = n - 1 - i

由于 ``i<n-k``，有 ``n-1-i >= k``，镜像位置仍落在原字符串 ``s`` 的区域中，对应字符下标：

.. code-block:: text

   (n - 1 - i) - k = n - k - 1 - i

因此：

.. code-block:: text

   s[i] = s[n-k-1-i]

这正说明 ``s[0:n-k]`` 是回文前缀。

为什么只需考虑 k<n
~~~~~~~~~~~~~~~~~~

当 ``n>0`` 时，保留至少首字符作为长度 1 的回文前缀，总能通过添加 ``n-1`` 个字符构造答案。
因此最优解不会添加 ``n`` 个或更多字符。空串单独返回空串。

最优性结论
~~~~~~~~~~

任何添加 ``k`` 个字符的可行方案都会留下长度 ``n-k`` 的回文前缀。最长回文前缀长度为 ``L``，所以：

.. code-block:: text

   n - k <= L
   k >= n - L

而 ``reverse(R)+s`` 恰好只添加 ``n-L`` 个字符，因此它达到下界，是最短答案。

KMP 前缀函数
------------

为了在线性时间找到 ``L``，构造序列：

.. code-block:: text

   T = s + "#" + reverse(s)

``#`` 不属于官方小写字母字符域，只出现一次。对 ``T`` 计算 KMP 前缀函数 ``pi``：

``pi[i]``
   子串 ``T[0:i]`` 的最长真前缀长度，该前缀同时也是这个子串的后缀。

最终值 ``pi[|T|-1]`` 是整个 ``T`` 的最长 border（既是前缀又是后缀的真子串）长度。

前缀函数转移
~~~~~~~~~~~~

扫描位置 ``i`` 时，先尝试延长前一位置的最长 border：

.. code-block:: text

   j = pi[i-1]

若 ``T[i] != T[j]``，当前长度 ``j`` 无法延长。所有仍可能成功的候选 border 都位于 ``j`` 自身的 border 链上，
因此回退：

.. code-block:: text

   j = pi[j-1]

反复回退直到字符相等或 ``j=0``。若字符相等，就把长度增加 1。每次 ``i`` 只前进，``j`` 的总回退量受总前进量限制，
所以前缀函数为线性时间。

安全分隔符为什么必要
--------------------

若直接构造 ``s+reverse(s)``，一个 border 可能跨越两部分边界，把并非原串回文前缀的重复结构错误地计入。
唯一分隔符将两部分隔开，并给出两个重要性质。

性质一：最终 border 长度不超过 n
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

设整个 ``T`` 长度为 ``2n+1``。若某个真 border 长度 ``b>n``，它的前缀和后缀都包含唯一的 ``#``。

``#`` 在前缀中的相对位置是 ``n``。长度为 ``b`` 的后缀起点为 ``2n+1-b``，因此 ``#`` 在后缀中的相对位置是：

.. code-block:: text

   n - (2n + 1 - b) = b - n - 1

两个字符串若相等，唯一 ``#`` 的相对位置必须相同：

.. code-block:: text

   n = b - n - 1
   b = 2n + 1

这只能是整个字符串长度，不是真 border。矛盾。因此任何真 border 都满足 ``b<=n``，不会跨越分隔符。

性质二：分隔符不能与普通字符匹配
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``#`` 不属于 ``a..z``，前缀函数在回退和延长时不会把分隔符当成原字符串字符。若输入域允许 ``#``，就必须选择另一个
确定不在输入域中的标记，或改用带类型标签的整数序列。

最终 border 与回文前缀等价
---------------------------

设 ``rev=reverse(s)``。

引理一：长度 b 的最终 border 必对应回文前缀
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

由安全分隔符证明，``b<=n``。因此：

* ``T`` 的长度 ``b`` 前缀是 ``s[0:b]``；
* ``T`` 的长度 ``b`` 后缀完全位于 ``rev`` 的末尾；
* ``rev`` 的最后 ``b`` 个字符恰好是 ``reverse(s[0:b])``。

border 相等意味着：

.. code-block:: text

   s[0:b] = reverse(s[0:b])

所以 ``s[0:b]`` 是回文前缀。

引理二：任意长度 b 的回文前缀都对应最终 border
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若 ``P=s[0:b]`` 是回文，则 ``P=reverse(P)``。而 ``T`` 的长度 ``b`` 后缀正是 ``reverse(P)``，
长度 ``b`` 前缀正是 ``P``，二者相等，因此 ``b`` 是整个 ``T`` 的 border 长度。

定理：最终前缀函数值等于最长回文前缀长度
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

引理一说明每个最终 border 都是回文前缀；引理二说明每个回文前缀都会成为最终 border。
KMP 最终值选择最长 border，因此它恰好等于最长回文前缀长度 ``L``。

完整算法
--------

#. 若 ``s`` 为空，返回空串；
#. 构造 ``rev=reverse(s)``；
#. 构造 ``T=s + '#' + rev``；
#. 计算 ``T`` 的前缀函数；
#. 令 ``L=pi[|T|-1]``；
#. 取 ``rev`` 的前 ``n-L`` 个字符，即 ``reverse(s[L:n])``；
#. 把它接到 ``s`` 前面并返回。

正确性证明
----------

引理三：算法构造的结果是回文
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

令 ``s=P+R``，其中 ``P`` 是算法找到的最长回文前缀。算法返回 ``reverse(R)+P+R``。
反转后得到 ``reverse(R)+reverse(P)+R``，而 ``P`` 是回文，所以结果不变。

引理四：算法添加的字符数最少
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

算法添加 ``|R|=n-L`` 个字符。前面的重叠区域证明表明，任意添加 ``k`` 个字符的可行结果都要求
``s[0:n-k]`` 是回文前缀，因此 ``n-k<=L``，即 ``k>=n-L``。算法达到下界。

定理：算法返回最短回文字符串
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

引理三保证返回值合法，引理四保证不存在添加更少字符的合法结果，因此返回值满足题目要求。

终止性
~~~~~~

反转和序列构造都扫描有限长度字符串。前缀函数外层索引严格增加；回退变量 ``j`` 每次替换为更短 border 长度，
严格下降并最终到达 0。所有循环均终止。

复杂度与真实资源
----------------

设 ``n=|s|``：

* 反转字符串耗时 ``O(n)``；
* 拼接序列长度为 ``2n+1``；
* KMP 前缀函数耗时 ``O(n)``；
* 构造答案耗时 ``O(n)``；
* 总时间复杂度为 ``O(n)``；
* 前缀表、反转材料和拼接序列合计额外空间为 ``O(n)``；
* 返回字符串长度为 ``2n-L``，输出载荷为 ``O(2n-L)``。

不同语言的“``O(n)`` 空间”包含不同常数和物化行为：

* C 显式分配拼接字节、``size_t`` 前缀表和答案；
* C++、Python、Java、C#、TypeScript 通常会物化反转串、拼接串和前缀表；
* Rust 与 Go 主实现按官方 ASCII 使用字节向量；
* Julia 的 ``codeunits(s)`` 是包装视图，但本文仍显式物化拼接和答案字节向量；
* R 的 ``charToRaw``、``rev``、``c`` 和整数前缀表都会物化线性容器。

十语言实现
----------

C
~

.. code-block:: c

   #include <stddef.h>
   #include <stdint.h>
   #include <stdlib.h>
   #include <string.h>

   char *shortestPalindrome(char *s) {
       if (s == NULL) return NULL;

       const size_t n = strlen(s);
       if (n == 0) {
           char *empty = (char *)malloc(1);
           if (empty != NULL) empty[0] = '\0';
           return empty;
       }

       /* 需要 2*n+1 个序列元素；该检查也保证答案加终止符不溢出。 */
       if (n > (SIZE_MAX - 1) / 2) return NULL;
       const size_t sequence_length = 2 * n + 1;
       if (sequence_length > SIZE_MAX / sizeof(size_t)) return NULL;

       unsigned char *sequence =
           (unsigned char *)malloc(sequence_length * sizeof(unsigned char));
       size_t *prefix =
           (size_t *)malloc(sequence_length * sizeof(size_t));
       if (sequence == NULL || prefix == NULL) {
           free(sequence);
           free(prefix);
           return NULL;
       }

       for (size_t i = 0; i < n; ++i) {
           sequence[i] = (unsigned char)s[i];
           sequence[n + 1 + i] = (unsigned char)s[n - 1 - i];
       }
       sequence[n] = (unsigned char)'#';

       prefix[0] = 0;
       for (size_t i = 1; i < sequence_length; ++i) {
           size_t j = prefix[i - 1];
           while (j > 0 && sequence[i] != sequence[j]) {
               j = prefix[j - 1];
           }
           if (sequence[i] == sequence[j]) ++j;
           prefix[i] = j;
       }

       const size_t palindrome_prefix = prefix[sequence_length - 1];
       const size_t added = n - palindrome_prefix;
       const size_t answer_length = n + added;
       char *answer = (char *)malloc(answer_length + 1);
       if (answer == NULL) {
           free(sequence);
           free(prefix);
           return NULL;
       }

       for (size_t i = 0; i < added; ++i) {
           answer[i] = s[n - 1 - i];
       }
       memcpy(answer + added, s, n);
       answer[answer_length] = '\0';

       free(sequence);
       free(prefix);
       return answer;
   }

C 平台接口返回堆分配字符串。任一分配失败时释放已取得资源并返回 ``NULL``；成功时答案所有权交给调用方。
``#`` 在官方小写字符域外。长度检查覆盖 ``2*n+1``、前缀表字节数和答案终止符。

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       std::string shortestPalindrome(std::string s) {
           const int n = static_cast<int>(s.size());
           if (n == 0) return "";

           std::string reversed(s.rbegin(), s.rend());
           std::string combined;
           combined.reserve(static_cast<std::size_t>(2) * s.size() + 1);
           combined += s;
           combined.push_back('#');
           combined += reversed;

           std::vector<int> prefix(combined.size(), 0);
           for (int i = 1; i < static_cast<int>(combined.size()); ++i) {
               int j = prefix[i - 1];
               while (j > 0 && combined[i] != combined[j]) {
                   j = prefix[j - 1];
               }
               if (combined[i] == combined[j]) ++j;
               prefix[i] = j;
           }

           const int palindromePrefix = prefix.back();
           return reversed.substr(0, n - palindromePrefix) + s;
       }
   };

平台签名按值接收 ``s``，该参数本身已经是线性大小字符串对象；反转串、拼接串、前缀表和返回串继续占用线性空间。

Python
~~~~~~

.. code-block:: python

   class Solution:
       def shortestPalindrome(self, s: str) -> str:
           if not s:
               return ""

           reversed_s = s[::-1]
           combined = s + "#" + reversed_s
           prefix = [0] * len(combined)

           for index in range(1, len(combined)):
               border = prefix[index - 1]
               while border > 0 and combined[index] != combined[border]:
                   border = prefix[border - 1]
               if combined[index] == combined[border]:
                   border += 1
               prefix[index] = border

           palindrome_prefix = prefix[-1]
           return reversed_s[: len(s) - palindrome_prefix] + s

切片反转、字符串拼接、整数列表和最终答案都物化线性对象。官方字符域为 ASCII，因此 Python 字符迭代与字节语义一致。

Java
~~~~

.. code-block:: java

   class Solution {
       public String shortestPalindrome(String s) {
           int n = s.length();
           if (n == 0) return "";

           String reversed = new StringBuilder(s).reverse().toString();
           String combined = s + "#" + reversed;
           int[] prefix = new int[combined.length()];

           for (int i = 1; i < combined.length(); ++i) {
               int j = prefix[i - 1];
               while (j > 0 && combined.charAt(i) != combined.charAt(j)) {
                   j = prefix[j - 1];
               }
               if (combined.charAt(i) == combined.charAt(j)) ++j;
               prefix[i] = j;
           }

           int palindromePrefix = prefix[prefix.length - 1];
           return reversed.substring(0, n - palindromePrefix) + s;
       }
   }

Java 按 UTF-16 ``char`` 计算长度和前缀表。官方小写 ASCII 每个字符占一个代码单元；对任意补充平面字符不能沿用该结论。

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn shortest_palindrome(s: String) -> String {
           let bytes = s.as_bytes();
           let n = bytes.len();
           if n == 0 {
               return String::new();
           }

           let reversed: Vec<u8> = bytes.iter().rev().copied().collect();
           let mut combined = Vec::with_capacity(2 * n + 1);
           combined.extend_from_slice(bytes);
           combined.push(b'#');
           combined.extend_from_slice(&reversed);

           let mut prefix = vec![0_usize; combined.len()];
           for i in 1..combined.len() {
               let mut j = prefix[i - 1];
               while j > 0 && combined[i] != combined[j] {
                   j = prefix[j - 1];
               }
               if combined[i] == combined[j] {
                   j += 1;
               }
               prefix[i] = j;
           }

           let palindrome_prefix = prefix[combined.len() - 1];
           let added = n - palindrome_prefix;
           let mut answer = Vec::with_capacity(n + added);
           answer.extend_from_slice(&reversed[..added]);
           answer.extend_from_slice(bytes);

           String::from_utf8(answer)
               .expect("official lowercase ASCII remains valid UTF-8")
       }
   }

Rust 只借用输入 ``String`` 的字节切片，反转、拼接、前缀表和答案向量为线性材料。按字节反转依赖官方 ASCII 合同。

Go
~~

.. code-block:: go

   func shortestPalindrome(s string) string {
       n := len(s)
       if n == 0 {
           return ""
       }

       reversed := make([]byte, n)
       for i := 0; i < n; i++ {
           reversed[i] = s[n-1-i]
       }

       combined := make([]byte, 0, 2*n+1)
       combined = append(combined, s...)
       combined = append(combined, '#')
       combined = append(combined, reversed...)

       prefix := make([]int, len(combined))
       for i := 1; i < len(combined); i++ {
           j := prefix[i-1]
           for j > 0 && combined[i] != combined[j] {
               j = prefix[j-1]
           }
           if combined[i] == combined[j] {
               j++
           }
           prefix[i] = j
       }

       palindromePrefix := prefix[len(prefix)-1]
       added := n - palindromePrefix
       answer := make([]byte, 0, n+added)
       answer = append(answer, reversed[:added]...)
       answer = append(answer, s...)
       return string(answer)
   }

Go 的字符串索引是字节索引；官方小写 ASCII 允许直接反转字节。``[]byte`` 反转串、拼接、前缀表和答案均为线性容器。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function shortestPalindrome(s: string): string {
       const n = s.length;
       if (n === 0) return "";

       const reversed = s.split("").reverse().join("");
       const combined = s + "#" + reversed;
       const prefix = new Int32Array(combined.length);

       for (let i = 1; i < combined.length; i += 1) {
           let j = prefix[i - 1];
           while (j > 0 && combined.charCodeAt(i) !== combined.charCodeAt(j)) {
               j = prefix[j - 1];
           }
           if (combined.charCodeAt(i) === combined.charCodeAt(j)) {
               j += 1;
           }
           prefix[i] = j;
       }

       const palindromePrefix = prefix[combined.length - 1];
       return reversed.slice(0, n - palindromePrefix) + s;
   }

TypeScript/JavaScript 的 ``length``、``charCodeAt`` 和切片按 UTF-16 代码单元工作。官方 ASCII 安全；``split`` 数组、反转串、拼接串与
``Int32Array`` 都是线性材料。

C#
~~

.. code-block:: csharp

   public class Solution {
       public string ShortestPalindrome(string s) {
           int n = s.Length;
           if (n == 0) return string.Empty;

           char[] reversedChars = s.ToCharArray();
           System.Array.Reverse(reversedChars);
           string reversed = new string(reversedChars);
           string combined = s + "#" + reversed;
           int[] prefix = new int[combined.Length];

           for (int i = 1; i < combined.Length; ++i) {
               int j = prefix[i - 1];
               while (j > 0 && combined[i] != combined[j]) {
                   j = prefix[j - 1];
               }
               if (combined[i] == combined[j]) ++j;
               prefix[i] = j;
           }

           int palindromePrefix = prefix[prefix.Length - 1];
           return reversed.Substring(0, n - palindromePrefix) + s;
       }
   }

C# ``char`` 是 UTF-16 代码单元。官方 ASCII 下字符边界与代码单元边界一致；字符数组、两个字符串和前缀表均占线性空间。

Julia
~~~~~

.. code-block:: julia

   function shortest_palindrome(s::String)::String
       units = codeunits(s)
       n = length(units)
       n == 0 && return ""

       combined = Vector{UInt8}(undef, 2n + 1)
       for i in 1:n
           combined[i] = units[i]
           combined[n + 1 + i] = units[n - i + 1]
       end
       combined[n + 1] = UInt8('#')

       prefix = zeros(Int, length(combined))
       for i in 2:length(combined)
           j = prefix[i - 1]
           while j > 0 && combined[i] != combined[j + 1]
               j = prefix[j]
           end
           if combined[i] == combined[j + 1]
               j += 1
           end
           prefix[i] = j
       end

       palindrome_prefix = prefix[end]
       added = n - palindrome_prefix
       answer = Vector{UInt8}(undef, n + added)
       for i in 1:added
           answer[i] = units[n - i + 1]
       end
       for i in 1:n
           answer[added + i] = units[i]
       end
       return String(answer)
   end

``codeunits(s)`` 返回包装视图，不复制源字符串字节；``combined``、``prefix`` 和 ``answer`` 显式物化。
一基索引下，长度 ``j`` 的下一个比较位置是 ``j+1``。官方 ASCII 保证按 UTF-8 代码单元反转仍是合法字符反转。

R
~

.. code-block:: r

   shortest_palindrome <- function(s) {
     bytes <- charToRaw(s)
     n <- length(bytes)
     if (n == 0L) return("")

     reversed <- rev(bytes)
     combined <- c(bytes, charToRaw("#"), reversed)
     m <- length(combined)
     prefix <- integer(m)

     if (m >= 2L) {
       for (i in seq.int(2L, m)) {
         j <- prefix[i - 1L]
         while (j > 0L && combined[i] != combined[j + 1L]) {
           j <- prefix[j]
         }
         if (combined[i] == combined[j + 1L]) {
           j <- j + 1L
         }
         prefix[i] <- j
       }
     }

     palindrome_prefix <- prefix[m]
     added <- n - palindrome_prefix
     front <- if (added > 0L) reversed[seq_len(added)] else raw(0L)
     rawToChar(c(front, bytes))
   }

R 的 ``charToRaw`` 和 ``rawToChar`` 按字节处理，适用于官方 ASCII。``m>=2`` 守卫避免构造错误方向的迭代序列；
``seq_len(added)`` 在正长度下安全，零长度时显式使用 ``raw(0)``。

人工推演
--------

``aacecaaa``
~~~~~~~~~~~~

``reverse(s)=aaacecaa``。KMP 最终 border 长度为 7，对应 ``aacecaa``。取反转串前 ``8-7=1`` 个字符 ``a``，
返回 ``aaacecaaa``。

``abcd``
~~~~~~~~

最终最长 border 长度为 1，只对应首字符 ``a``。取反转串 ``dcba`` 的前 3 个字符 ``dcb``，返回 ``dcbabcd``。

空串与单字符
~~~~~~~~~~~~

空串直接返回，不构造前缀表。单字符 ``a`` 的组合串为 ``a#a``，最终 border 为 1，添加长度为 0。

已是回文
~~~~~~~~

``racecar`` 的最长回文前缀长度等于 7，添加长度为 0，结果保持不变。

重复字符
~~~~~~~~

``aaaa`` 的最终 border 长度为 4，而不是因重复结构跨过分隔符得到更长值。唯一 ``#`` 阻止任何长度大于 ``n`` 的真 border。

最长回文前缀只有 1
~~~~~~~~~~~~~~~~~~

``abcd``、``abca`` 等字符串至少有长度 1 的回文前缀。算法返回的 ``L`` 不会是 0；空串是唯一 ``L=0`` 的边界。

静态审查记录
------------

本题未运行、未编译、未对拍、未穷举、未做属性测试或 sanitizer。完成了以下静态审查：

* 人工推演 ``aacecaaa``、``abcd``、空串、单字符、完整回文、重复字符、``aaab`` 与 ``abbacd``；
* 逐下标证明任意前置方案留下的原串前缀必须回文；
* 双向证明最终 KMP border 与回文前缀完全等价；
* 证明唯一分隔符使真 border 长度不超过 ``n``；
* 核对十语言的前缀函数回退下标，尤其是零基 ``prefix[j-1]`` 与一基 ``prefix[j]``；
* 核对反转串取前 ``n-L`` 个单位，不把整个反转串都添加到前面；
* 核对 C 的长度加法、前缀表乘法、三处分配失败清理和终止符；
* 核对 Rust/Go 字节、Java/C#/TypeScript UTF-16、Julia ``codeunits`` 与 R raw 的官方 ASCII 适用边界；
* 核对 R 的循环守卫和零长度下标构造；
* 核对输入字符串未被修改。

剩余风险：十语言代码未经过编译器或平台执行；标准库导入由 LeetCode 对应语言模板提供或需按本地工程补齐。

关键边界与失败模式
------------------

``把最长相等前后缀直接称为回文``
   对普通字符串不成立。只有在 ``s + separator + reverse(s)`` 的结构中，并证明 border 不跨分隔符后，最终 border 才对应回文前缀。

``省略分隔符``
   重复结构可能跨越 ``s`` 与 ``reverse(s)`` 的边界，破坏长度和语义证明。

``分隔符属于输入域``
   唯一性证明失效。必须选择输入中不可能出现的标记。

``取最长回文子串而非前缀``
   只能在前面添加字符，原串与新增部分的重叠要求保留的是回文前缀，任意内部回文子串没有同样作用。

``反转整个 s 并全部添加``
   能得到回文，却通常添加 ``n`` 个字符，不是最短答案。

``按字节处理任意 Unicode``
   多字节字符会被拆开。本文代码依赖官方小写 ASCII 合同。

``前缀函数回退写成 prefix[j]``
   在零基语言中会停留在错误位置甚至无法严格缩短；应使用 ``prefix[j-1]``。一基 Julia/R 的长度状态才使用 ``prefix[j]``。

知识更新与关联题目
------------------

本题新增或强化以下知识链：

* 最优构造：先证明任意答案必须保留某种结构，再最大化可保留部分；
* 回文前缀：区别于最长回文子串和最长回文后缀；
* KMP 前缀函数：不仅用于模式匹配，也可在线性时间提取 border；
* 安全分隔符：把两个字符域片段组合成一个序列时，阻止跨边界伪匹配；
* 字符单位：ASCII 合同下字节、UTF-16 代码单元和 Unicode 字符恰好一致，扩展字符域时必须重新设计。

关联题目：

* ``0005 Longest Palindromic Substring``：寻找任意位置的回文子串，目标结构不同；
* ``0028 Find the Index of the First Occurrence in a String``：KMP 模式匹配与前缀函数基础；
* ``0125 Valid Palindrome``：双端回文判定；
* ``0131 Palindrome Partitioning``：枚举回文分割；
* ``0647 Palindromic Substrings``：统计全部回文子串。

自检问题
--------

问题一
~~~~~~

为什么答案由最长回文前缀决定，而不是最长回文子串？

答案：只能在原串前添加字符。若添加 ``k`` 个字符，结果回文的重叠区域会迫使原串前 ``n-k`` 个字符互为镜像，
所以必须保留回文前缀；内部回文子串不能覆盖原串起点。

问题二
~~~~~~

为什么 ``T=s+'#'+reverse(s)`` 的最终 border 是回文前缀？

答案：唯一分隔符保证 border 长度不超过 ``n``。它的前缀是 ``s`` 的前缀，后缀是该前缀的反转；二者相等当且仅当前缀回文。

问题三
~~~~~~

找到长度 ``L`` 后，应添加哪部分？

答案：把剩余后缀 ``s[L:n]`` 反转后放到最前面，等价于取 ``reverse(s)`` 的前 ``n-L`` 个字符。

问题四
~~~~~~

为什么 C 不能只检查 ``2*n`` 的算术溢出？

答案：还需要一个分隔符、答案终止符，并要分配 ``sequence_length*sizeof(size_t)`` 的前缀表；加法和乘法都必须分别证明安全。

问题五
~~~~~~

这些实现能否直接正确处理任意 emoji？

答案：不能。Rust、Go、Julia、R 和 C 的主实现按字节处理；Java、C#、TypeScript 按 UTF-16 代码单元处理。官方小写 ASCII 下等价，任意 Unicode 需要统一到代码点或字素模型后重新实现。