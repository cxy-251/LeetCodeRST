0076. Minimum Window Substring
==============================

题目信息
--------

:题号: 0076
:难度: Hard
:主题: 字符串、滑动窗口、频次计数
:原题: `LeetCode 0076 <https://leetcode.com/problems/minimum-window-substring/>`_
:访问状态: Available
:教学重点: 缺口计数、可行窗口收缩、最短区间提交、ASCII 下标

题目重述
--------

给定两个非空字符串 ``s`` 和 ``t``，寻找 ``s`` 中最短的连续子串，使该子串包含 ``t`` 的全部字符，
并覆盖每个字符在 ``t`` 中的重复次数。若不存在合法子串，返回空字符串。

题目保证 ``1 <= len(s), len(t) <= 100000``，字符只包含大小写英文字母，大小写不同。输入只读，
返回值是独立字符串。题目保证最短答案唯一。

自建示例
--------

重复字符需求
~~~~~~~~~~~~

.. code-block:: text

   输入：s = "CABAA"，t = "AABC"
   输出："CABA"

``t`` 需要两个 ``A``、一个 ``B`` 和一个 ``C``。只检查字符种类是否出现会错误接受更短但数量不足
的窗口。

无解
~~~~

.. code-block:: text

   输入：s = "abc"，t = "AA"
   输出：""

问题抽象
--------

窗口右端负责加入字符，直到窗口覆盖全部需求；窗口一旦可行，左端持续右移，删除仍可删除的字符，
并在每次删除前提交当前长度。每个字符最多被右端加入一次、被左端移出一次。

使用 ``need[c]`` 表示当前窗口对字符 ``c`` 仍缺少的数量：

* ``need[c] > 0``：窗口还缺该字符；
* ``need[c] == 0``：数量刚好满足；
* ``need[c] < 0``：窗口包含多余副本。

``missing`` 保存全部字符缺口之和。它降为零时，窗口恰好满足所有字符及其重复次数。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 定位
   * - 缺口计数滑动窗口
     - ``O(|s| + |t|)``
     - ``O(1)``
     - 主解法；线性扫描并直接维护可行性
   * - 枚举左端并向右寻找覆盖
     - ``O(|s|²)``
     - ``O(1)``
     - 重复扫描相同区间

字符域固定为 ASCII 英文字母，因此频次数组大小固定，不随输入长度增长。

主解法：缺口计数滑动窗口
------------------------

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

维护半开窗口 ``s[left:right+1]``。处理每个右端字符后：

* ``need[c] = t 中 c 的数量 - 当前窗口中 c 的数量``；
* ``missing`` 等于所有 ``max(need[c], 0)`` 的总和；
* ``missing == 0`` 当且仅当当前窗口覆盖 ``t`` 的全部多重集需求；
* ``best_start`` 和 ``best_length`` 保存已见合法窗口中的最短者。

加入字符 ``c`` 前若 ``need[c] > 0``，该字符填补了一个真实缺口，``missing`` 减一。随后无论是否缺少，
都执行 ``need[c] -= 1``，让负数自然记录多余副本。

窗口为何可以持续收缩
~~~~~~~~~~~~~~~~~~~~

当 ``missing == 0`` 时，当前窗口合法。删除左端字符后执行 ``need[out] += 1``：

* 若新值仍不大于零，删除的只是多余副本，窗口继续合法；
* 若新值变为正数，窗口重新缺少一个字符，``missing`` 加一，收缩停止。

因此对固定右端，循环会依次检查所有合法左边界，最后一次合法窗口就是该右端下最短的窗口。未来右端
只会向右移动，已经跳过的更小左边界不会产生更短的新窗口。

正确性依据
~~~~~~~~~~

**可行性判定正确。** ``need`` 由目标频次初始化。每次字符进入或离开窗口时，只更新对应字符的差值；
``missing`` 只在正缺口被填补或重新出现时变化，所以始终等于总缺口。故 ``missing == 0`` 与窗口覆盖
目标多重集等价。

**不会漏掉最短窗口。** 对每个右端，算法在窗口可行期间连续推进左端，并在删除前记录窗口。于是该右端
对应的每个可行左边界都被检查。任意全局最优窗口有某个右端，处理该右端时必然被检查并参与比较。

**返回窗口最短。** ``best`` 只在当前窗口更短时更新；全部右端处理结束后，它不长于任何被检查的合法
窗口，而上一段证明所有合法最优候选都会被检查，因此返回全局最短窗口。

**终止性。** ``right`` 单调遍历字符串，``left`` 只向右移动且不超过字符串末尾，两个循环都有限。

复杂度
~~~~~~

设 ``n = |s|``、``m = |t|``：

* 建立目标频次需要 ``O(m)``；
* 每个 ``s`` 字符最多进入和离开窗口各一次，总时间 ``O(n + m)``；
* 频次数组固定为 128 项，算法额外空间 ``O(1)``；
* 返回子串需要复制 ``O(answer_length)`` 个字符；
* C 在返回阶段分配答案缓冲区，分配失败返回 ``NULL``，该情况不属于题目输入域。

核心语言实现
------------

C
~

.. code-block:: c

   #include <limits.h>
   #include <stdlib.h>
   #include <string.h>

   char *minWindow(char *s, char *t) {
       const int s_length = (int)strlen(s);
       const int t_length = (int)strlen(t);
       int need[128] = {0};

       for (int index = 0; index < t_length; ++index) {
           const unsigned char byte = (unsigned char)t[index];
           ++need[byte];
       }

       int missing = t_length;
       int left = 0;
       int best_start = 0;
       int best_length = INT_MAX;

       for (int right = 0; right < s_length; ++right) {
           const unsigned char incoming = (unsigned char)s[right];
           if (need[incoming] > 0) {
               --missing;
           }
           --need[incoming];

           while (missing == 0) {
               const int length = right - left + 1;
               if (length < best_length) {
                   best_start = left;
                   best_length = length;
               }

               const unsigned char outgoing = (unsigned char)s[left];
               ++left;
               ++need[outgoing];
               if (need[outgoing] > 0) {
                   ++missing;
               }
           }
       }

       if (best_length == INT_MAX) {
           char *empty = malloc(1);
           if (empty != NULL) {
               empty[0] = '\0';
           }
           return empty;
       }

       char *result = malloc((size_t)best_length + 1);
       if (result == NULL) {
           return NULL;
       }
       memcpy(result, s + best_start, (size_t)best_length);
       result[best_length] = '\0';
       return result;
   }

C++
~~~

.. code-block:: cpp

   #include <array>
   #include <limits>
   #include <string>

   class Solution {
   public:
       std::string minWindow(const std::string& s, const std::string& t) {
           std::array<int, 128> need{};
           for (const unsigned char byte : t) {
               ++need[byte];
           }

           int missing = static_cast<int>(t.size());
           std::size_t left = 0;
           std::size_t best_start = 0;
           std::size_t best_length = std::numeric_limits<std::size_t>::max();

           for (std::size_t right = 0; right < s.size(); ++right) {
               const unsigned char incoming =
                   static_cast<unsigned char>(s[right]);
               if (need[incoming] > 0) {
                   --missing;
               }
               --need[incoming];

               while (missing == 0) {
                   const std::size_t length = right - left + 1;
                   if (length < best_length) {
                       best_start = left;
                       best_length = length;
                   }

                   const unsigned char outgoing =
                       static_cast<unsigned char>(s[left]);
                   ++left;
                   ++need[outgoing];
                   if (need[outgoing] > 0) {
                       ++missing;
                   }
               }
           }

           if (best_length == std::numeric_limits<std::size_t>::max()) {
               return "";
           }
           return s.substr(best_start, best_length);
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def minWindow(self, s: str, t: str) -> str:
           need = [0] * 128
           for character in t:
               need[ord(character)] += 1

           missing = len(t)
           left = 0
           best_start = 0
           best_length = len(s) + 1

           for right, character in enumerate(s):
               incoming = ord(character)
               if need[incoming] > 0:
                   missing -= 1
               need[incoming] -= 1

               while missing == 0:
                   length = right - left + 1
                   if length < best_length:
                       best_start = left
                       best_length = length

                   outgoing = ord(s[left])
                   left += 1
                   need[outgoing] += 1
                   if need[outgoing] > 0:
                       missing += 1

           if best_length == len(s) + 1:
               return ""
           return s[best_start : best_start + best_length]

Java
~~~~

.. code-block:: java

   class Solution {
       public String minWindow(String s, String t) {
           int[] need = new int[128];
           for (int index = 0; index < t.length(); ++index) {
               ++need[t.charAt(index)];
           }

           int missing = t.length();
           int left = 0;
           int bestStart = 0;
           int bestLength = Integer.MAX_VALUE;

           for (int right = 0; right < s.length(); ++right) {
               char incoming = s.charAt(right);
               if (need[incoming] > 0) {
                   --missing;
               }
               --need[incoming];

               while (missing == 0) {
                   int length = right - left + 1;
                   if (length < bestLength) {
                       bestStart = left;
                       bestLength = length;
                   }

                   char outgoing = s.charAt(left++);
                   ++need[outgoing];
                   if (need[outgoing] > 0) {
                       ++missing;
                   }
               }
           }

           if (bestLength == Integer.MAX_VALUE) {
               return "";
           }
           return s.substring(bestStart, bestStart + bestLength);
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn min_window(s: String, t: String) -> String {
           let source = s.as_bytes();
           let mut need = [0_i32; 128];
           for &byte in t.as_bytes() {
               need[byte as usize] += 1;
           }

           let mut missing = t.len() as i32;
           let mut left = 0_usize;
           let mut best_start = 0_usize;
           let mut best_length = usize::MAX;

           for right in 0..source.len() {
               let incoming = source[right] as usize;
               if need[incoming] > 0 {
                   missing -= 1;
               }
               need[incoming] -= 1;

               while missing == 0 {
                   let length = right - left + 1;
                   if length < best_length {
                       best_start = left;
                       best_length = length;
                   }

                   let outgoing = source[left] as usize;
                   left += 1;
                   need[outgoing] += 1;
                   if need[outgoing] > 0 {
                       missing += 1;
                   }
               }
           }

           if best_length == usize::MAX {
               return String::new();
           }
           String::from_utf8(
               source[best_start..best_start + best_length].to_vec(),
           )
           .expect("题目字符域保证切片是 ASCII")
       }
   }

Go
~~

.. code-block:: go

   func minWindow(s string, t string) string {
       var need [128]int
       for index := 0; index < len(t); index++ {
           need[t[index]]++
       }

       missing := len(t)
       left := 0
       bestStart := 0
       bestLength := len(s) + 1

       for right := 0; right < len(s); right++ {
           incoming := s[right]
           if need[incoming] > 0 {
               missing--
           }
           need[incoming]--

           for missing == 0 {
               length := right - left + 1
               if length < bestLength {
                   bestStart = left
                   bestLength = length
               }

               outgoing := s[left]
               left++
               need[outgoing]++
               if need[outgoing] > 0 {
                   missing++
               }
           }
       }

       if bestLength == len(s)+1 {
           return ""
       }
       return s[bestStart : bestStart+bestLength]
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function minWindow(s: string, t: string): string {
       const need: number[] = Array<number>(128).fill(0);
       for (let index = 0; index < t.length; index += 1) {
           need[t.charCodeAt(index)] += 1;
       }

       let missing = t.length;
       let left = 0;
       let bestStart = 0;
       let bestLength = s.length + 1;

       for (let right = 0; right < s.length; right += 1) {
           const incoming = s.charCodeAt(right);
           if (need[incoming] > 0) {
               missing -= 1;
           }
           need[incoming] -= 1;

           while (missing === 0) {
               const length = right - left + 1;
               if (length < bestLength) {
                   bestStart = left;
                   bestLength = length;
               }

               const outgoing = s.charCodeAt(left);
               left += 1;
               need[outgoing] += 1;
               if (need[outgoing] > 0) {
                   missing += 1;
               }
           }
       }

       if (bestLength === s.length + 1) {
           return "";
       }
       return s.slice(bestStart, bestStart + bestLength);
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public string MinWindow(string s, string t) {
           int[] need = new int[128];
           foreach (char character in t) {
               ++need[character];
           }

           int missing = t.Length;
           int left = 0;
           int bestStart = 0;
           int bestLength = int.MaxValue;

           for (int right = 0; right < s.Length; ++right) {
               char incoming = s[right];
               if (need[incoming] > 0) {
                   --missing;
               }
               --need[incoming];

               while (missing == 0) {
                   int length = right - left + 1;
                   if (length < bestLength) {
                       bestStart = left;
                       bestLength = length;
                   }

                   char outgoing = s[left++];
                   ++need[outgoing];
                   if (need[outgoing] > 0) {
                       ++missing;
                   }
               }
           }

           if (bestLength == int.MaxValue) {
               return string.Empty;
           }
           return s.Substring(bestStart, bestLength);
       }
   }

Julia
~~~~~

.. code-block:: julia

   function minWindow(s::String, t::String)::String
       source = codeunits(s)
       target = codeunits(t)
       need = zeros(Int, 128)

       for byte in target
           need[Int(byte) + 1] += 1
       end

       missing = length(target)
       left = 1
       best_start = 1
       best_length = typemax(Int)

       for right in eachindex(source)
           incoming = Int(source[right]) + 1
           if need[incoming] > 0
               missing -= 1
           end
           need[incoming] -= 1

           while missing == 0
               length_now = right - left + 1
               if length_now < best_length
                   best_start = left
                   best_length = length_now
               end

               outgoing = Int(source[left]) + 1
               left += 1
               need[outgoing] += 1
               if need[outgoing] > 0
                   missing += 1
               end
           end
       end

       if best_length == typemax(Int)
           return ""
       end
       bytes = source[best_start:(best_start + best_length - 1)]
       return String(Vector{UInt8}(bytes))
   end

R
~

.. code-block:: r

   min_window <- function(s, t) {
     source <- as.integer(charToRaw(s))
     target <- as.integer(charToRaw(t))
     need <- integer(128L)

     for (byte in target) {
       need[byte + 1L] <- need[byte + 1L] + 1L
     }

     missing <- length(target)
     left <- 1L
     best_start <- 1L
     best_length <- .Machine$integer.max

     for (right in seq_along(source)) {
       incoming <- source[right] + 1L
       if (need[incoming] > 0L) {
         missing <- missing - 1L
       }
       need[incoming] <- need[incoming] - 1L

       while (missing == 0L) {
         length_now <- right - left + 1L
         if (length_now < best_length) {
           best_start <- left
           best_length <- length_now
         }

         outgoing <- source[left] + 1L
         left <- left + 1L
         need[outgoing] <- need[outgoing] + 1L
         if (need[outgoing] > 0L) {
           missing <- missing + 1L
         }
       }
     }

     if (best_length == .Machine$integer.max) {
       return("")
     }
     finish <- best_start + best_length - 1L
     rawToChar(as.raw(source[best_start:finish]))
   }

验证计划与证据
--------------

* 固定用例覆盖重复需求、大小写区别、答案等于整个字符串和无解；
* Python 与独立暴力枚举基准进行随机对拍；
* C、C++、Java、Go、TypeScript 编译并运行相同语义用例；
* Rust、C#、Julia、R 在缺少运行时的环境中执行静态接口和边界检查。

关键边界
--------

* 目标字符的重复次数必须逐个满足，不能只统计不同字符种类；
* C/C++ 必须把 ``char`` 转为无符号字节后再用作数组下标；
* ASCII 契约让字节下标、UTF-16 代码单元下标和字符位置一致；
* 没有答案时返回空字符串，不能返回最后一次扫描窗口；
* 只在更短时更新答案即可；题目保证最短答案唯一。

易错点
------

* 进入窗口时先递减 ``need`` 再判断，会丢失“此前是否真实缺少”的信息；
* 移出窗口时应在递增后判断是否变正，只有此时才重新产生缺口；
* ``missing`` 统计缺少的字符副本数，不是尚未满足的字符种类数；
* 收缩循环必须在移出字符前记录当前合法窗口。

本题新增知识
------------

* 用可正可负的频次差值同时表达缺口、刚好满足和多余副本；
* 用总缺口 ``missing`` 在常数时间判断窗口可行性；
* 对每个右端收缩到首个非法位置，从而覆盖全部最短候选。

本题强化知识
------------

* 滑动窗口的左右指针单调性；
* ASCII 字节与目标语言字符串索引的对应关系；
* 返回子串复制成本与算法工作空间分开计算。

关联题目
--------

* `0003. Longest Substring Without Repeating Characters
  <0003-longest-substring-without-repeating-characters.rst>`_
* `0030. Substring with Concatenation of All Words
  <0030-substring-with-concatenation-of-all-words.rst>`_

最小自检
--------

#. ``need[c]`` 为负数时代表什么？
#. 为什么 ``missing == 0`` 能同时处理重复字符需求？
#. 处理固定右端时，为什么持续收缩不会漏掉更短窗口？
#. 移出字符后，应在 ``need`` 更新前还是更新后判断缺口？

答案要点
~~~~~~~~

负数表示窗口中有多余副本。``missing`` 是所有正缺口的总和，归零才表示多重集全部满足。固定右端下
收缩会检查每个合法左边界；移出字符应先把 ``need`` 加一，再判断它是否变正。
