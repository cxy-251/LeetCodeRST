0214. Shortest Palindrome
=========================

题目信息
--------

:题号: 0214
:难度: Hard
:主题: 字符串、回文、KMP 前缀函数
:原题: `LeetCode 0214 <https://leetcode.com/problems/shortest-palindrome/>`_
:重点: 只能在最前面添加、原字符串顺序不变、结果必须回文、添加字符数最少

题目重述
--------

给定字符串 ``s``，可以在它的最前面添加任意数量的小写英文字母。返回通过这种操作能够得到的最短回文字符串。原字符串必须完整保留为结果的后缀，不能重排、删除或修改原字符，也不能在字符串中间或末尾添加字符。

``s`` 的长度位于 ``[0, 5 * 10^4]``，只包含小写英文字母。若 ``s`` 为空或本身已经是回文，直接返回 ``s``。若存在多种构造方式，题目要求的是最终长度最短的回文结果。

自建示例
--------

只有首字符构成最长回文前缀：

.. code-block:: text

   输入：s = "abb"
   输出："bbabb"
   解释：在前面添加 "bb" 后得到回文串 bbabb。只添加一个字符无法让原串 abb 成为回文，因此这是最短结果。

原字符串已经是回文：

.. code-block:: text

   输入：s = "aabaa"
   输出："aabaa"
   解释：原字符串正读反读相同，不需要添加任何字符。

问题转化：找到最长回文前缀
--------------------------

设 ``s`` 的最长回文前缀长度为 ``L``，把字符串写成：

.. code-block:: text

   s = P + R
   |P| = L
   P 是回文

将剩余后缀 ``R`` 反转并放到最前面：

.. code-block:: text

   answer = reverse(R) + P + R

因为 ``P=reverse(P)``，整个字符串反转后仍为 ``reverse(R)+P+R``，所以该构造一定是回文。

构造添加了 ``|R|=n-L`` 个字符。接下来需要证明两件事：

#. 任何更短的前置字符串都不可能成功；
#. ``L`` 可以在线性时间内求出。

为什么最长回文前缀给出最短答案
------------------------------

假设在 ``s`` 前添加长度为 ``m`` 的字符串 ``x``，得到回文串 ``q=x+s``。

对于非空 ``s``，总能保留首字符这个回文前缀并添加 ``n-1`` 个字符，因此最优解一定满足 ``m<n``。

考察 ``s`` 的前 ``n-m`` 个字符。它们在 ``q`` 中的位置是 ``m..n-1``，镜像位置仍落在原字符串 ``s`` 的区域内。对 ``0<=i<n-m``，回文关系给出：

.. code-block:: text

   s[i] = s[n-m-1-i]

因此 ``s[0:n-m]`` 必须是一个回文前缀。

最长回文前缀长度为 ``L``，所以任何可行方案都满足：

.. code-block:: text

   n - m <= L
   m >= n - L

而 ``reverse(R)+s`` 恰好添加 ``n-L`` 个字符，达到这个下界，因此它就是最短答案。

用 KMP 找最长回文前缀
---------------------

令：

.. code-block:: text

   rev = reverse(s)
   T = s + "#" + rev

对 ``T`` 计算 KMP 前缀函数 ``pi``。

``pi[i]`` 表示 ``T[0:i]`` 的最长真前缀长度，并且该前缀同时也是这个子串的后缀。最终值 ``pi[|T|-1]`` 就是整个 ``T`` 的最长 border 长度。

前缀函数转移
~~~~~~~~~~~~

处理位置 ``i`` 时，从上一位置的最长 border 开始尝试：

.. code-block:: text

   j = pi[i - 1]

若 ``T[i] != T[j]``，长度 ``j`` 无法继续延长，退到它的下一个候选 border：

.. code-block:: text

   j = pi[j - 1]

持续回退直到字符相等或 ``j=0``。若字符相等，将 ``j`` 增加 1，并令 ``pi[i]=j``。

扫描下标 ``i`` 只向前移动；``j`` 的回退总量不会超过此前的增长总量，因此整个前缀函数计算是线性的。

最终 border 为什么等于回文前缀
------------------------------

分隔符 ``#`` 只出现一次，并且不属于原字符串字符域。因此整个 ``T`` 的真 border 不可能跨过分隔符，长度一定不超过 ``n``。

设最终 border 长度为 ``b``：

* ``T`` 的长度 ``b`` 前缀是 ``s[0:b]``；
* ``T`` 的长度 ``b`` 后缀是 ``rev`` 的最后 ``b`` 个字符；
* 这段后缀恰好等于 ``reverse(s[0:b])``。

border 的前后两段相等，所以：

.. code-block:: text

   s[0:b] = reverse(s[0:b])

即 ``s[0:b]`` 是回文前缀。

反过来，若 ``s[0:b]`` 是回文，则它等于自己的反转，也就同时等于 ``T`` 的长度 ``b`` 前缀和后缀，因此它一定构成 border。

所以 ``T`` 的 border 与 ``s`` 的回文前缀一一对应，最终前缀函数值就是最长回文前缀长度 ``L``。

完整算法
--------

#. 构造 ``rev=reverse(s)``；
#. 构造 ``T=s+'#'+rev``；
#. 计算 ``T`` 的前缀函数；
#. 令 ``L=pi[|T|-1]``；
#. 取 ``reverse(s[L:n])`` 放到 ``s`` 前面。

也可以直接取 ``rev`` 的前 ``n-L`` 个字符，因为它正是 ``reverse(s[L:n])``。

正确性证明
----------

**引理一：KMP 最终值 ``L`` 等于 ``s`` 的最长回文前缀长度。**

由分隔符保证，最终 border 完全由 ``s`` 前缀和 ``reverse(s)`` 后缀组成。二者相等当且仅当对应的 ``s`` 前缀等于自身反转。最长 border 因而对应最长回文前缀。

**引理二：算法返回的字符串是回文。**

设 ``s=P+R``，其中 ``P`` 是长度为 ``L`` 的回文前缀。算法返回 ``reverse(R)+P+R``，反转后得到 ``reverse(R)+reverse(P)+R``。由于 ``P`` 是回文，结果保持不变。

**引理三：算法添加的字符数最少。**

算法添加 ``n-L`` 个字符。前面的下界证明说明任何可行方案至少添加 ``n-L`` 个字符，因此没有更短结果。

**定理：算法返回能够通过前置添加得到的最短回文字符串。**

引理二保证结果可行，引理三保证结果最短。

复杂度
------

设 ``n=|s|``：
* 构造反转串和组合串耗时 ``O(n)``；
* 前缀函数耗时 ``O(n)``；
* 构造结果耗时 ``O(n)``；
* 总时间复杂度为 ``O(n)``；
* 组合串、前缀函数和结果占 ``O(n)`` 空间。

返回字符串最长为 ``2n-1``：非空字符串至少保留首字符作为回文前缀。

十语言实现
----------

C
~

.. code-block:: c

   #include <stdlib.h>
   #include <string.h>

   char *shortestPalindrome(char *s) {
       const size_t n = strlen(s);
       const size_t total = n * 2 + 1;

       char *combined = (char *)malloc(total + 1);
       int *prefix = (int *)malloc(total * sizeof(int));
       if (combined == NULL || prefix == NULL) {
           free(combined);
           free(prefix);
           return NULL;
       }

       for (size_t i = 0; i < n; ++i) combined[i] = s[i];
       combined[n] = '#';
       for (size_t i = 0; i < n; ++i) {
           combined[n + 1 + i] = s[n - 1 - i];
       }
       combined[total] = '\0';

       prefix[0] = 0;
       for (size_t i = 1; i < total; ++i) {
           int j = prefix[i - 1];
           while (j > 0 && combined[i] != combined[(size_t)j]) {
               j = prefix[(size_t)j - 1];
           }
           if (combined[i] == combined[(size_t)j]) ++j;
           prefix[i] = j;
       }

       const size_t palindrome_length = (size_t)prefix[total - 1];
       const size_t added = n - palindrome_length;
       char *answer = (char *)malloc(n + added + 1);
       if (answer == NULL) {
           free(combined);
           free(prefix);
           return NULL;
       }

       for (size_t i = 0; i < added; ++i) {
           answer[i] = s[n - 1 - i];
       }
       memcpy(answer + added, s, n);
       answer[n + added] = '\0';

       free(combined);
       free(prefix);
       return answer;
   }

``#`` 不会与官方输入字符匹配。返回的字符串由调用方负责释放。

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       std::string shortestPalindrome(std::string s) {
           std::string reversed(s.rbegin(), s.rend());
           std::string combined = s + "#" + reversed;
           std::vector<int> prefix(combined.size(), 0);

           for (std::size_t i = 1; i < combined.size(); ++i) {
               int j = prefix[i - 1];
               while (j > 0 && combined[i] != combined[j]) {
                   j = prefix[j - 1];
               }
               if (combined[i] == combined[j]) ++j;
               prefix[i] = j;
           }

           const std::size_t length = prefix.back();
           return reversed.substr(0, s.size() - length) + s;
       }
   };

需要 ``<string>`` 与 ``<vector>``。``reversed`` 的前 ``n-L`` 个字符就是需要添加的部分。

Python
~~~~~~

.. code-block:: python

   class Solution:
       def shortestPalindrome(self, s: str) -> str:
           reversed_s = s[::-1]
           combined = s + "#" + reversed_s
           prefix = [0] * len(combined)

           for i in range(1, len(combined)):
               j = prefix[i - 1]
               while j > 0 and combined[i] != combined[j]:
                   j = prefix[j - 1]
               if combined[i] == combined[j]:
                   j += 1
               prefix[i] = j

           length = prefix[-1]
           return reversed_s[:len(s) - length] + s

官方输入只含 ASCII 小写字母，字符串索引与反转对应题目字符单位。

Java
~~~~

.. code-block:: java

   class Solution {
       public String shortestPalindrome(String s) {
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

           int length = prefix[combined.length() - 1];
           return reversed.substring(0, s.length() - length) + s;
       }
   }

``StringBuilder.reverse`` 在官方小写字母字符域内与按字符反转一致。

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn shortest_palindrome(s: String) -> String {
           let bytes = s.as_bytes();
           let n = bytes.len();
           let mut combined = Vec::with_capacity(n * 2 + 1);
           combined.extend_from_slice(bytes);
           combined.push(b'#');
           combined.extend(bytes.iter().rev().copied());

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

           let length = *prefix.last().unwrap();
           let mut answer = Vec::with_capacity(n * 2 - length);
           answer.extend(bytes[length..].iter().rev().copied());
           answer.extend_from_slice(bytes);
           String::from_utf8(answer).unwrap()
       }
   }

官方字符均为单字节 UTF-8，按字节处理不会拆分字符。

Go
~~

.. code-block:: go

   func shortestPalindrome(s string) string {
       n := len(s)
       combined := make([]byte, 0, n*2+1)
       combined = append(combined, s...)
       combined = append(combined, '#')
       for i := n - 1; i >= 0; i-- {
           combined = append(combined, s[i])
       }

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

       length := prefix[len(prefix)-1]
       answer := make([]byte, 0, n*2-length)
       for i := n - 1; i >= length; i-- {
           answer = append(answer, s[i])
       }
       answer = append(answer, s...)
       return string(answer)
   }

空字符串时第一个反向循环不会执行，组合串只包含 ``#``，最终返回空串。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function shortestPalindrome(s: string): string {
       const reversed = s.split("").reverse().join("");
       const combined = s + "#" + reversed;
       const prefix = new Array<number>(combined.length).fill(0);

       for (let i = 1; i < combined.length; i += 1) {
           let j = prefix[i - 1];
           while (j > 0 && combined[i] !== combined[j]) {
               j = prefix[j - 1];
           }
           if (combined[i] === combined[j]) j += 1;
           prefix[i] = j;
       }

       const length = prefix[combined.length - 1];
       return reversed.slice(0, s.length - length) + s;
   }

官方输入字符都由单个 UTF-16 代码单元表示。

C#
~~

.. code-block:: csharp

   public class Solution {
       public string ShortestPalindrome(string s) {
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

           int length = prefix[combined.Length - 1];
           return reversed.Substring(0, s.Length - length) + s;
       }
   }

字符数组只用于构造反转串，输入字符串本身不可变。

Julia
~~~~~

.. code-block:: julia

   function shortest_palindrome(s::String)::String
       bytes = collect(codeunits(s))
       reversed = reverse(bytes)
       combined = vcat(bytes, UInt8(0x23), reversed)
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

       length_palindrome = prefix[end]
       answer = vcat(reverse(bytes[length_palindrome + 1:end]), bytes)
       String(answer)
   end

Julia 使用一基下标：长度为 ``j`` 的 border 的下一个待比较字符位于 ``j+1``。

R
~

.. code-block:: r

   shortest_palindrome <- function(s) {
     chars <- strsplit(s, "", fixed = TRUE)[[1L]]
     reversed <- rev(chars)
     combined <- c(chars, "#", reversed)
     prefix <- integer(length(combined))

     if (length(combined) >= 2L) {
       for (i in 2L:length(combined)) {
         j <- prefix[i - 1L]
         while (j > 0L && combined[i] != combined[j + 1L]) {
           j <- prefix[j]
         }
         if (combined[i] == combined[j + 1L]) j <- j + 1L
         prefix[i] <- j
       }
     }

     length_palindrome <- prefix[length(prefix)]
     added <- length(chars) - length_palindrome
     prefix_chars <- if (added == 0L) character(0) else reversed[seq_len(added)]
     paste0(c(prefix_chars, chars), collapse = "")
   }

空字符串的组合序列仍包含一个 ``#``，因此 ``prefix[length(prefix)]`` 有定义。

关键易错点
----------

* 寻找最长回文子串，而题目真正需要的是最长回文前缀；
* 把剩余后缀原样放到前面，而不是先反转；
* 构造 ``s+reverse(s)`` 时省略分隔符，使 border 跨越边界；
* 选择可能出现在输入中的分隔符；
* 把 KMP 最终值误解为整个字符串的最长回文长度；
* 前缀函数失配时直接归零，漏掉较短 border 候选；
* 找到回文前缀后没有证明添加字符数最少；
* 将按字节实现无条件推广到任意 Unicode 字符串。

知识联系
--------

这道题把构造问题转化为边界匹配问题：最短添加量由最长可复用前缀决定。KMP 前缀函数不仅用于搜索模式串，也可以求字符串的 border、周期、重复结构和前后缀重叠。

若允许在末尾添加字符，可以对 ``reverse(s)+'#'+s`` 做对称处理；若允许在两端任意添加，问题会转化为保留更一般的回文子序列或回文子串结构，不能直接沿用本题结论。

自检问题
--------

#. 为什么只需要找到最长回文前缀，而不是最长回文子串？
#. 设最长回文前缀长度为 ``L``，为什么添加内容必须是 ``reverse(s[L:n])``？
#. 任意可行方案添加 ``m`` 个字符时，为什么 ``s[0:n-m]`` 必须是回文？
#. 分隔符在 ``s+'#'+reverse(s)`` 中起什么作用？
#. 为什么最终前缀函数值恰好是最长回文前缀长度？

参考答案
~~~~~~~~

#. 原字符串必须完整成为结果后缀，只有从开头开始的回文部分能够与自身镜像重叠。
#. 剩余后缀必须由结果左端提供镜像，按相反顺序添加才能与右端对应。
#. 这段前缀在最终回文中的镜像位置仍位于原字符串区域，因此它必须与自身反转相等。
#. 它阻止 border 跨越两部分边界，并保证 border 长度不超过原字符串长度。
#. 长度 ``b`` 的 border 等价于 ``s[0:b]=reverse(s[0:b])``，也就是长度 ``b`` 的回文前缀；取最长 border 即取最长回文前缀。
