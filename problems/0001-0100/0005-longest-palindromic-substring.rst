0005. Longest Palindromic Substring
===================================

题目信息
--------

:题号: 0005
:难度: Medium
:主题: 字符串、回文、中心扩展
:原题: `LeetCode 0005 <https://leetcode.com/problems/longest-palindromic-substring/>`_
:访问状态: Available
:教学重点: 奇偶中心统一、向两侧扩展、区间更新、字符单位差异

题目重述
--------

给定一个字符串，返回其中最长的回文连续子串。回文表示从左向右和从右向左读取时
字符顺序相同。若存在多个同长度答案，返回任意一个即可。

自建示例
--------

.. code-block:: text

   输入：s = "cabacx"
   输出："cabac"

问题抽象
--------

任意回文串都围绕一个中心对称。中心可能落在某个字符上，也可能落在两个相邻字符
之间。枚举所有中心并向两侧扩展，就能覆盖所有奇数长度和偶数长度回文串。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 空间复杂度
     - 定位
   * - 中心扩展
     - ``O(n²)``
     - ``O(1)``
     - 主解法
   * - 动态规划
     - ``O(n²)``
     - ``O(n²)``
     - 对照解法
   * - Manacher 算法
     - ``O(n)``
     - ``O(n)``
     - 高级算法，后续专题复现

主解法：中心扩展
----------------

思路
~~~~

对每个位置 ``i`` 执行两次扩展：

* ``left = i, right = i``，处理奇数长度回文；
* ``left = i, right = i + 1``，处理偶数长度回文。

只要左右位置仍在字符串范围内，并且两侧字符相等，就继续扩大区间。每次扩展结束
后，用得到的长度更新当前最长答案。

中心示意
~~~~~~~~

.. mermaid::

   flowchart LR
       L2["更左字符"] --> L1["left"]
       L1 --> C["中心"]
       C --> R1["right"]
       R1 --> R2["更右字符"]

扩展过程只比较关于中心对称的两个字符。遇到第一对不相等字符时，当前中心能够
形成的最长回文已经确定。

核心不变量
~~~~~~~~~~

在每次扩展循环开始时，``left + 1`` 到 ``right - 1`` 已经构成回文。若
``s[left] == s[right]``，加入这一对相同字符后仍然是回文；否则无法继续扩展。

正确性依据
~~~~~~~~~~

每个回文子串都有唯一的几何中心。奇数长度回文的中心是一个字符，偶数长度回文的
中心是两个字符之间的空隙。算法枚举所有这两类中心，并对每个中心扩展到最大范围，
因此不会漏掉任何回文子串。所有中心得到的最大长度就是全局答案。

复杂度
~~~~~~

* 时间复杂度：``O(n²)``，最坏情况下每个中心都扩展接近整个字符串；
* 辅助空间：``O(1)``，不计算返回字符串所占空间。

核心语言实现
~~~~~~~~~~~~

C
^

.. code-block:: c

   #include <stdlib.h>
   #include <string.h>

   static void expand(
       const char* s,
       int length,
       int left,
       int right,
       int* best_start,
       int* best_length
   ) {
       while (left >= 0 && right < length && s[left] == s[right]) {
           const int current_length = right - left + 1;
           if (current_length > *best_length) {
               *best_start = left;
               *best_length = current_length;
           }

           --left;
           ++right;
       }
   }

   char* longestPalindrome(char* s) {
       const int length = (int)strlen(s);
       int best_start = 0;
       int best_length = length == 0 ? 0 : 1;

       for (int center = 0; center < length; ++center) {
           expand(
               s,
               length,
               center,
               center,
               &best_start,
               &best_length
           );
           expand(
               s,
               length,
               center,
               center + 1,
               &best_start,
               &best_length
           );
       }

       char* result = malloc((size_t)best_length + 1);
       if (result == NULL) {
           return NULL;
       }

       memcpy(result, s + best_start, (size_t)best_length);
       result[best_length] = '\0';
       return result;
   }

C++
^^^

.. code-block:: cpp

   class Solution {
   public:
       std::string longestPalindrome(std::string s) {
           int bestStart = 0;
           int bestLength = s.empty() ? 0 : 1;

           auto expand = [&](int left, int right) {
               while (
                   left >= 0 &&
                   right < static_cast<int>(s.size()) &&
                   s[left] == s[right]
               ) {
                   const int length = right - left + 1;
                   if (length > bestLength) {
                       bestStart = left;
                       bestLength = length;
                   }

                   --left;
                   ++right;
               }
           };

           for (int center = 0; center < s.size(); ++center) {
               expand(center, center);
               expand(center, center + 1);
           }

           return s.substr(bestStart, bestLength);
       }
   };

Python
^^^^^^

.. code-block:: python

   class Solution:
       def longestPalindrome(self, s: str) -> str:
           best_start = 0
           best_length = 0

           def expand(left: int, right: int) -> None:
               nonlocal best_start, best_length

               while (
                   left >= 0
                   and right < len(s)
                   and s[left] == s[right]
               ):
                   current_length = right - left + 1
                   if current_length > best_length:
                       best_start = left
                       best_length = current_length

                   left -= 1
                   right += 1

           for center in range(len(s)):
               expand(center, center)
               expand(center, center + 1)

           return s[best_start : best_start + best_length]

Java
^^^^

.. code-block:: java

   class Solution {
       public String longestPalindrome(String s) {
           int bestStart = 0;
           int bestEnd = 0;

           for (int center = 0; center < s.length(); center++) {
               int oddLength = expandLength(s, center, center);
               int evenLength = expandLength(s, center, center + 1);
               int length = Math.max(oddLength, evenLength);

               if (length > bestEnd - bestStart + 1) {
                   bestStart = center - (length - 1) / 2;
                   bestEnd = center + length / 2;
               }
           }

           return s.substring(bestStart, bestEnd + 1);
       }

       private int expandLength(String s, int left, int right) {
           while (
               left >= 0 &&
               right < s.length() &&
               s.charAt(left) == s.charAt(right)
           ) {
               left--;
               right++;
           }

           // 循环结束时两端已经各越过一个位置。
           return right - left - 1;
       }
   }

Rust
^^^^

.. code-block:: rust

   impl Solution {
       pub fn longest_palindrome(s: String) -> String {
           let bytes = s.as_bytes();
           let mut best_start = 0usize;
           let mut best_length = 0usize;

           fn expand(bytes: &[u8], mut left: i32, mut right: i32) -> (usize, usize) {
               while left >= 0
                   && (right as usize) < bytes.len()
                   && bytes[left as usize] == bytes[right as usize]
               {
                   left -= 1;
                   right += 1;
               }

               let start = (left + 1) as usize;
               let length = (right - left - 1) as usize;
               (start, length)
           }

           for center in 0..bytes.len() {
               for (left, right) in [
                   (center as i32, center as i32),
                   (center as i32, center as i32 + 1),
               ] {
                   let (start, length) = expand(bytes, left, right);
                   if length > best_length {
                       best_start = start;
                       best_length = length;
                   }
               }
           }

           // 本题输入字符范围允许按 UTF-8 字节切片。
           s[best_start..best_start + best_length].to_string()
       }
   }

Go
^^

.. code-block:: go

   func longestPalindrome(s string) string {
       bestStart, bestLength := 0, 0

       expand := func(left int, right int) (int, int) {
           for left >= 0 && right < len(s) && s[left] == s[right] {
               left--
               right++
           }

           return left + 1, right - left - 1
       }

       for center := 0; center < len(s); center++ {
           starts := [2]int{center, center}
           ends := [2]int{center, center + 1}

           for index := 0; index < 2; index++ {
               start, length := expand(starts[index], ends[index])
               if length > bestLength {
                   bestStart = start
                   bestLength = length
               }
           }
       }

       return s[bestStart : bestStart+bestLength]
   }

TypeScript
^^^^^^^^^^

.. code-block:: typescript

   function longestPalindrome(s: string): string {
       let bestStart = 0;
       let bestLength = 0;

       const expand = (initialLeft: number, initialRight: number): void => {
           let left = initialLeft;
           let right = initialRight;

           while (
               left >= 0 &&
               right < s.length &&
               s[left] === s[right]
           ) {
               const length = right - left + 1;
               if (length > bestLength) {
                   bestStart = left;
                   bestLength = length;
               }

               left -= 1;
               right += 1;
           }
       };

       for (let center = 0; center < s.length; center += 1) {
           expand(center, center);
           expand(center, center + 1);
       }

       return s.slice(bestStart, bestStart + bestLength);
   }

C#
^^

.. code-block:: csharp

   public class Solution {
       public string LongestPalindrome(string s) {
           int bestStart = 0;
           int bestLength = 0;

           void Expand(int left, int right) {
               while (
                   left >= 0 &&
                   right < s.Length &&
                   s[left] == s[right]
               ) {
                   int length = right - left + 1;
                   if (length > bestLength) {
                       bestStart = left;
                       bestLength = length;
                   }

                   left--;
                   right++;
               }
           }

           for (int center = 0; center < s.Length; center++) {
               Expand(center, center);
               Expand(center, center + 1);
           }

           return s.Substring(bestStart, bestLength);
       }
   }

Julia
^^^^^

.. code-block:: julia

   function longest_palindrome(s::String)::String
       chars = collect(s)
       best_start = 1
       best_length = 0

       function expand(left::Int, right::Int)
           while (
               left >= 1 &&
               right <= length(chars) &&
               chars[left] == chars[right]
           )
               left -= 1
               right += 1
           end

           return left + 1, right - left - 1
       end

       for center in eachindex(chars)
           for (left, right) in ((center, center), (center, center + 1))
               start, current_length = expand(left, right)
               if current_length > best_length
                   best_start = start
                   best_length = current_length
               end
           end
       end

       return String(chars[best_start:best_start + best_length - 1])
   end

R
^

.. code-block:: r

   longest_palindrome <- function(s) {
       chars <- strsplit(s, "", fixed = TRUE)[[1]]
       if (length(chars) == 0L) {
           return("")
       }

       best_start <- 1L
       best_length <- 1L

       expand <- function(left, right) {
           while (
               left >= 1L &&
               right <= length(chars) &&
               chars[[left]] == chars[[right]]
           ) {
               left <- left - 1L
               right <- right + 1L
           }

           c(left + 1L, right - left - 1L)
       }

       for (center in seq_along(chars)) {
           for (offset in 0:1) {
               result <- expand(center, center + offset)
               start <- result[[1]]
               current_length <- result[[2]]

               if (current_length > best_length) {
                   best_start <- start
                   best_length <- current_length
               }
           }
       }

       paste(
           chars[best_start:(best_start + best_length - 1L)],
           collapse = ""
       )
   }

字符单位说明
~~~~~~~~~~~~

C、C++、Rust 和 Go 的实现按字节访问；Java、TypeScript 和 C# 按 UTF-16 代码单元
访问；Python、Julia 与 R 更接近按 Unicode 字符处理。题目常见字符范围允许这些实现
保持相同算法语义。

若真实产品要求把组合字符或表情序列视为一个用户可见字符，需要先按字形簇
（grapheme cluster）切分，再应用相同的中心扩展算法。

对照解法：动态规划
------------------

定义 ``dp[left][right]`` 表示闭区间 ``[left, right]`` 是否为回文。状态成立需要：

* 两端字符相同；
* 区间长度不超过 3，或者内部区间 ``dp[left + 1][right - 1]`` 已经是回文。

该方法能清楚展示区间状态依赖，也容易扩展到回文计数等问题。它需要 ``O(n²)``
额外空间，本题只求最长子串时不如中心扩展直接。

易错点
------

* 必须同时处理奇数中心和偶数中心；
* 扩展停止时，``left`` 和 ``right`` 已经位于合法回文之外；
* 返回的是连续子串，不是可以删除字符得到的回文子序列；
* C 返回的新字符串由调用者或平台负责释放；
* Rust 和 Go 的字节索引只适用于题目给定字符范围；
* 多个最长答案同时存在时，返回任意一个都符合要求。

本题新增知识
------------

* 回文的对称中心可以是字符，也可以是字符间隙；
* 中心扩展用局部对称性枚举全部回文子串；
* 辅助函数返回越界前最后一个合法区间；
* 区间答案只需保存起点和长度，不必反复创建子串。

本题强化知识
------------

* 字符串索引单位继续因语言而异；
* 闭区间长度统一使用 ``right - left + 1``。

最小自检
--------

#. 为什么每个位置都需要执行两次扩展？
#. 扩展结束后为什么长度是 ``right - left - 1``？
#. 动态规划和中心扩展的主要空间差异是什么？

答案要点
~~~~~~~~

#. 分别覆盖奇数长度中心和偶数长度中心；
#. 两端已经各越过一个不匹配或越界位置，需要排除这两个位置；
#. 动态规划保存所有区间状态，需要 ``O(n²)`` 空间，中心扩展只保存边界。
