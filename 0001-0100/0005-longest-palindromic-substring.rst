0005. Longest Palindromic Substring
===================================

题目信息
--------

:题号: 0005
:题名: Longest Palindromic Substring
:难度: Medium
:类型: Algorithms
:主题: 字符串、动态规划、中心扩展
:原题: `LeetCode 0005 <https://leetcode.com/problems/longest-palindromic-substring/>`_

题目重述
--------

给定字符串 ``s``，返回其中长度最长的回文子串。子串必须是原字符串中的连续区间；回文串从左向右和从右向左读取完全相同。若存在多个长度相同的最长答案，返回其中任意一个即可。

自建示例
--------

.. code-block:: text

   输入：s = "cabacx"
   输出："cabac"
   解释：前五个字符正向和反向读取都相同。

.. code-block:: text

   输入：s = "zabccbay"
   输出："abccba"
   解释：最长回文子串位于下标 1 到 6。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <string>
   #include <utility>
   #include <vector>

   class Solution {
   private:
       bool isPalindrome(
           const std::string& s,
           int left,
           int right
       ) {
           while (left < right) {
               if (s[left] != s[right]) {
                   return false;
               }
               ++left;
               --right;
           }
           return true;
       }

       std::string enumerateSubstrings(const std::string& s) {
           int best_start = 0;
           int best_length = 0;

           for (int left = 0;
                left < static_cast<int>(s.size());
                ++left) {
               for (int right = left;
                    right < static_cast<int>(s.size());
                    ++right) {
                   const int length = right - left + 1;
                   if (
                       length > best_length &&
                       isPalindrome(s, left, right)
                   ) {
                       best_start = left;
                       best_length = length;
                   }
               }
           }

           return s.substr(best_start, best_length);
       }

       std::string dynamicProgramming(const std::string& s) {
           const int n = static_cast<int>(s.size());
           std::vector<std::vector<bool>> dp(
               n,
               std::vector<bool>(n, false)
           );

           int best_start = 0;
           int best_length = 0;

           for (int right = 0; right < n; ++right) {
               for (int left = 0; left <= right; ++left) {
                   const bool inner_is_palindrome =
                       right - left <= 2 || dp[left + 1][right - 1];

                   dp[left][right] =
                       s[left] == s[right] && inner_is_palindrome;

                   const int length = right - left + 1;
                   if (dp[left][right] && length > best_length) {
                       best_start = left;
                       best_length = length;
                   }
               }
           }

           return s.substr(best_start, best_length);
       }

       std::pair<int, int> expand(
           const std::string& s,
           int left,
           int right
       ) {
           while (
               left >= 0 &&
               right < static_cast<int>(s.size()) &&
               s[left] == s[right]
           ) {
               --left;
               ++right;
           }

           // 循环结束时，两端已经越过该中心的最长合法回文。
           return {left + 1, right - left - 1};
       }

       std::string expandAroundCenters(const std::string& s) {
           int best_start = 0;
           int best_length = 0;

           for (int center = 0;
                center < static_cast<int>(s.size());
                ++center) {
               const auto odd = expand(s, center, center);
               if (odd.second > best_length) {
                   best_start = odd.first;
                   best_length = odd.second;
               }

               const auto even = expand(s, center, center + 1);
               if (even.second > best_length) {
                   best_start = even.first;
                   best_length = even.second;
               }
           }

           return s.substr(best_start, best_length);
       }

   public:
       std::string longestPalindrome(std::string s) {
           return expandAroundCenters(s);
       }
   };

题解
----

原始搜索空间：所有连续子串
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

长度为 ``n`` 的字符串共有 ``n(n + 1) / 2`` 个非空连续子串。最直接的方法是枚举闭区间
``[left, right]``，再从两端向中间检查字符是否相同。

``enumerateSubstrings`` 对每个候选区间调用 ``isPalindrome``。候选数量是二次数量级，单个区间
检查最坏需要线性时间，因此这种写法最坏达到 ``O(n³)``。它准确表达了题目要求，但同一个内部
区间会被不同候选反复验证。

例如判断 ``s[left..right]`` 时，两端字符相同之后，真正需要知道的是内部区间
``s[left + 1..right - 1]`` 是否为回文。直接检查会重新扫描这个内部区间，而此前其他候选可能
已经完成了相同工作。

区间动态规划如何复用内部结果
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

定义：

.. code-block:: text

   dp[left][right] = 闭区间 [left, right] 是否为回文

一个区间成为回文需要同时满足：

.. code-block:: text

   s[left] == s[right]
   内部区间 [left + 1, right - 1] 是回文

长度为 1、2 或 3 的区间可以统一处理。当 ``right - left <= 2`` 且两端字符相同时，内部为空或
只剩一个字符，天然满足回文条件。因此转移写成：

.. code-block:: text

   dp[left][right] =
       s[left] == s[right] &&
       (right - left <= 2 || dp[left + 1][right - 1])

C++ 代码按 ``right`` 从小到大填表。计算 ``dp[left][right]`` 时，依赖的右端点是
``right - 1``，对应状态已经完成。每个区间只计算一次，把时间降到 ``O(n²)``，代价是保存全部
区间状态。

从区间状态继续压缩到对称中心
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

动态规划仍然为所有 ``O(n²)`` 个区间保存真假状态，但回文有更强的几何结构：字符关于中心成对
相等。

长度为奇数的回文以一个字符为中心，例如 ``aba`` 的中心是 ``b``；长度为偶数的回文以两个
相邻字符之间的空隙为中心，例如 ``bb`` 的中心位于两个 ``b`` 之间。长度为 ``n`` 的字符串共有：

* ``n`` 个字符中心；
* ``n - 1`` 个字符间隙中心；
* 合计 ``2n - 1`` 个中心。

固定中心后，候选回文不再是任意区间，而是一组按长度嵌套的对称区间。只要当前两侧字符相同，
就继续向外扩一层；遇到边界或第一对不同字符时，该中心能够形成的最长回文已经确定。

奇数中心与偶数中心如何统一
~~~~~~~~~~~~~~~~~~~~~~~~~~

``expand`` 接收两个初始位置：

.. code-block:: text

   expand(center, center)      处理奇数长度回文
   expand(center, center + 1)  处理偶数长度回文

扩展循环始终维持 ``[left, right]`` 两侧字符相同，并在成功后执行 ``left--``、``right++``。
循环结束时，``left`` 和 ``right`` 已经位于最长合法区间之外，因此真实结果是：

.. code-block:: text

   start  = left + 1
   length = right - left - 1

同一个辅助函数由不同初始边界表达两类中心，使主循环只需要为每个 ``center`` 调用两次。

中心扩展状态演化
~~~~~~~~~~~~~~~~

奇数中心示例 ``s = "cabacx"``，初始中心为 ``(2, 2)``：

.. list-table::
   :header-rows: 1

   * - 步骤
     - ``left``
     - ``right``
     - 比较
     - 当前合法区间
     - 动作
   * - 1
     - 2
     - 2
     - ``b == b``
     - ``b``
     - 向两侧扩展
   * - 2
     - 1
     - 3
     - ``a == a``
     - ``aba``
     - 向两侧扩展
   * - 3
     - 0
     - 4
     - ``c == c``
     - ``cabac``
     - 向两侧扩展
   * - 4
     - -1
     - 5
     - 左端越界
     - ``cabac``
     - 停止并返回 ``start = 0``、``length = 5``

偶数中心示例 ``s = "cbbd"``，初始中心为 ``(1, 2)``：

.. list-table::
   :header-rows: 1

   * - 步骤
     - ``left``
     - ``right``
     - 比较
     - 当前合法区间
     - 动作
   * - 1
     - 1
     - 2
     - ``b == b``
     - ``bb``
     - 向两侧扩展
   * - 2
     - 0
     - 3
     - ``c != d``
     - ``bb``
     - 停止并返回 ``start = 1``、``length = 2``

主算法只在新长度严格大于 ``best_length`` 时更新答案。出现多个同长度最长回文时会保留较早发现
的一个，这与题目允许返回任意答案的要求一致。

解法对比与主解法选择
~~~~~~~~~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 复用的信息
   * - 枚举子串并逐个检查
     - ``O(n³)``
     - ``O(1)``
     - 每个候选独立检查
   * - 区间动态规划
     - ``O(n²)``
     - ``O(n²)``
     - 保存每个内部区间是否回文
   * - 中心扩展
     - ``O(n²)``
     - ``O(1)``
     - 利用固定中心下区间按层嵌套

中心扩展与动态规划具有相同的最坏时间复杂度，但只维护当前中心边界和全局最优区间，更适合本题
只返回一个最长回文子串的目标。九语言统一采用中心扩展。

为什么每个回文都会被某个中心覆盖
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

任意回文闭区间 ``[left, right]`` 的中心由两端位置唯一确定：

* ``left + right`` 为偶数时，中心落在一个字符上；
* ``left + right`` 为奇数时，中心落在两个相邻字符之间。

主循环枚举全部字符中心和全部字符间隙中心，因此任意回文对应的中心一定会被访问。该回文两侧
字符从内到外逐层相等，``expand`` 在到达它的边界之前不会停止。

为什么一次扩展得到该中心的最长回文
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

固定中心后，所有回文候选按半径递增。若当前 ``s[left] == s[right]``，把这一对字符加入内部
回文后仍然是回文；若两侧字符不同，任何更大半径的区间都会包含这对不同字符，不可能成为回文。
越界同样表示该方向已经没有更多字符。

因此第一次不匹配或越界之前的最后一个区间，就是该中心能够形成的最长回文。辅助函数返回的
``left + 1`` 和 ``right - left - 1`` 正好排除了停止时的两个无效位置。

为什么所有中心的最大值就是全局答案
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

任意回文都属于某个唯一中心，而算法为每个中心取得最长回文。某个中心的较短回文已经包含在该
中心的最长结果之内，不可能比它更优。比较全部 ``2n - 1`` 个中心的最长长度，就等价于比较全部
回文子串，最终 ``best_start`` 和 ``best_length`` 必然描述一个全局最长答案。

复杂度来源
~~~~~~~~~~

``enumerateSubstrings`` 枚举 ``O(n²)`` 个区间，每次回文检查最多比较 ``O(n)`` 对字符，时间复杂度
为 ``O(n³)``，只使用常数状态。

``dynamicProgramming`` 计算上三角区域中的 ``n(n + 1) / 2`` 个区间状态，每个状态执行常数工作，
时间和工作空间均为 ``O(n²)``。

``expandAroundCenters`` 枚举 ``2n - 1`` 个中心。单个中心最坏扩展 ``O(n)`` 层，例如字符串全部由
相同字符组成时，总时间为 ``O(n²)``。除返回子串外，只保存边界、长度和少量临时变量，工作空间
为 ``O(1)``。最终构造返回字符串需要与答案长度成正比的结果空间。

九语言实现
----------

题目字符范围允许按单字节或语言基础字符单位执行中心扩展。C、C++、Rust 和 Go 按字节访问；
Java、TypeScript 和 C# 按 UTF-16 代码单元访问；Python、Julia 与 R 按各自常见字符序列处理。
九种实现都返回 ``expand`` 停止前的最后一个合法区间。

C
~

C 版本为返回结果分配独立字符串；成功返回后由调用者或平台负责释放。

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
       while (
           left >= 0 &&
           right < length &&
           s[left] == s[right]
       ) {
           --left;
           ++right;
       }

       const int start = left + 1;
       const int current_length = right - left - 1;
       if (current_length > *best_length) {
           *best_start = start;
           *best_length = current_length;
       }
   }

   char* longestPalindrome(char* s) {
       const int length = (int)strlen(s);
       int best_start = 0;
       int best_length = 0;

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

Python
~~~~~~

.. code-block:: python

   class Solution:
       def longestPalindrome(self, s: str) -> str:
           best_start = 0
           best_length = 0

           def expand(left: int, right: int) -> tuple[int, int]:
               while (
                   left >= 0
                   and right < len(s)
                   and s[left] == s[right]
               ):
                   left -= 1
                   right += 1

               return left + 1, right - left - 1

           for center in range(len(s)):
               for left, right in (
                   (center, center),
                   (center, center + 1),
               ):
                   start, length = expand(left, right)
                   if length > best_length:
                       best_start = start
                       best_length = length

           return s[best_start : best_start + best_length]

Java
~~~~

.. code-block:: java

   class Solution {
       public String longestPalindrome(String s) {
           int bestStart = 0;
           int bestLength = 0;

           for (int center = 0; center < s.length(); center++) {
               int[] odd = expand(s, center, center);
               if (odd[1] > bestLength) {
                   bestStart = odd[0];
                   bestLength = odd[1];
               }

               int[] even = expand(s, center, center + 1);
               if (even[1] > bestLength) {
                   bestStart = even[0];
                   bestLength = even[1];
               }
           }

           return s.substring(bestStart, bestStart + bestLength);
       }

       private int[] expand(String s, int left, int right) {
           while (
               left >= 0 &&
               right < s.length() &&
               s.charAt(left) == s.charAt(right)
           ) {
               left--;
               right++;
           }

           return new int[] {left + 1, right - left - 1};
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn longest_palindrome(s: String) -> String {
           let bytes = s.as_bytes();
           let mut best_start = 0usize;
           let mut best_length = 0usize;

           fn expand(
               bytes: &[u8],
               mut left: i32,
               mut right: i32,
           ) -> (usize, usize) {
               while left >= 0
                   && (right as usize) < bytes.len()
                   && bytes[left as usize] == bytes[right as usize]
               {
                   left -= 1;
                   right += 1;
               }

               (
                   (left + 1) as usize,
                   (right - left - 1) as usize,
               )
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

           // 题目字符范围允许按 UTF-8 字节边界切片。
           s[best_start..best_start + best_length].to_string()
       }
   }

Go
~~

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
~~~~~~~~~~

.. code-block:: typescript

   function longestPalindrome(s: string): string {
       let bestStart = 0;
       let bestLength = 0;

       const expand = (left: number, right: number): [number, number] => {
           while (
               left >= 0 &&
               right < s.length &&
               s[left] === s[right]
           ) {
               left -= 1;
               right += 1;
           }

           return [left + 1, right - left - 1];
       };

       for (let center = 0; center < s.length; center += 1) {
           for (const [left, right] of [
               [center, center],
               [center, center + 1],
           ] as Array<[number, number]>) {
               const [start, length] = expand(left, right);
               if (length > bestLength) {
                   bestStart = start;
                   bestLength = length;
               }
           }
       }

       return s.slice(bestStart, bestStart + bestLength);
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public string LongestPalindrome(string s) {
           int bestStart = 0;
           int bestLength = 0;

           for (int center = 0; center < s.Length; center++) {
               int[] odd = Expand(s, center, center);
               if (odd[1] > bestLength) {
                   bestStart = odd[0];
                   bestLength = odd[1];
               }

               int[] even = Expand(s, center, center + 1);
               if (even[1] > bestLength) {
                   bestStart = even[0];
                   bestLength = even[1];
               }
           }

           return s.Substring(bestStart, bestLength);
       }

       private static int[] Expand(string s, int left, int right) {
           while (
               left >= 0 &&
               right < s.Length &&
               s[left] == s[right]
           ) {
               left--;
               right++;
           }

           return new int[] {left + 1, right - left - 1};
       }
   }

Julia
~~~~~

.. code-block:: julia

   function longest_palindrome(s::String)::String
       chars = collect(s)
       if isempty(chars)
           return ""
       end

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
           for (left, right) in (
               (center, center),
               (center, center + 1),
           )
               start, current_length = expand(left, right)
               if current_length > best_length
                   best_start = start
                   best_length = current_length
               end
           end
       end

       return join(
           chars[best_start:best_start + best_length - 1]
       )
   end

R
~

.. code-block:: r

   longest_palindrome <- function(s) {
       chars <- strsplit(s, "", fixed = TRUE)[[1]]
       if (length(chars) == 0L) {
           return("")
       }

       best_start <- 1L
       best_length <- 0L

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
