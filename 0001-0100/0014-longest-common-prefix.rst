0014. Longest Common Prefix
===========================

题目信息
--------

:题号: 0014
:难度: Easy
:主题: 字符串、纵向扫描、前缀
:原题: `LeetCode 0014 <https://leetcode.com/problems/longest-common-prefix/>`_
:重点: 所有字符串共同起始片段、首次分歧、空前缀

题目重述
--------

给定字符串数组 ``strs``，返回所有字符串共有的最长前缀。前缀必须从每个字符串的第一个字符开始并连续出现；若所有字符串从首字符起就无法形成公共前缀，返回空字符串 ``""``。

``strs`` 的长度位于 ``[1, 200]``，每个字符串的长度位于 ``[0, 200]``，并且只包含小写英文字母。
当数组只有一个字符串时，该字符串本身就是最长公共前缀。

自建示例
--------

公共前缀长度大于一个字符：

.. code-block:: text

   输入：strs = ["interact", "internet", "internal"]
   输出："inter"
   解释：三个字符串都以 "inter" 开头，第六个字符分别为 a、n、n，因此不能继续延长。

只有较短公共前缀：

.. code-block:: text

   输入：strs = ["stone", "stack", "style"]
   输出："st"
   解释：前两个字符相同，第三个字符分别为 o、a、y。

数组中包含空字符串：

.. code-block:: text

   输入：strs = ["alpha", "", "alpine"]
   输出：""
   解释：空字符串没有非空前缀，所以全体字符串的最长公共前缀只能为空。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <string>
   #include <vector>

   class Solution {
   private:
       std::string verticalScan(const std::vector<std::string>& strs) {
           for (int column = 0; column < static_cast<int>(strs[0].size()); ++column) {
               const char expected = strs[0][column];
               for (int row = 1; row < static_cast<int>(strs.size()); ++row) {
                   if (column >= static_cast<int>(strs[row].size()) ||
                       strs[row][column] != expected) {
                       return strs[0].substr(0, column);
                   }
               }
           }
           return strs[0];
       }

       std::string horizontalShrink(const std::vector<std::string>& strs) {
           std::string prefix = strs[0];
           for (int row = 1; row < static_cast<int>(strs.size()); ++row) {
               while (strs[row].compare(0, prefix.size(), prefix) != 0) {
                   prefix.pop_back();
                   if (prefix.empty()) return "";
               }
           }
           return prefix;
       }

       std::string sortedEndpoints(std::vector<std::string> strs) {
           std::sort(strs.begin(), strs.end());
           const std::string& first = strs.front();
           const std::string& last = strs.back();
           int length = 0;
           while (length < static_cast<int>(first.size()) &&
                  length < static_cast<int>(last.size()) &&
                  first[length] == last[length]) {
               ++length;
           }
           return first.substr(0, length);
       }

   public:
       std::string longestCommonPrefix(std::vector<std::string>& strs) {
           return verticalScan(strs);
       }
   };

题解
----

为什么公共前缀可以按列验证
~~~~~~~~~~~~~~~~~~~~~~~~~~

长度为 ``k`` 的公共前缀要求每个字符串的前 ``k`` 个字符逐列相同。前缀具有连续性：第 ``column`` 列失败后，
任何更长候选仍然包含该冲突。因此从第 0 列开始扫描，在首次字符串结束或字符不同时即可停止。

纵向扫描如何得到准确长度
~~~~~~~~~~~~~~~~~~~~~~~~

第一行给出当前列期望字符，其余字符串必须同时满足“该列存在”和“字符相同”。若第 ``column`` 列失败，
``[0,column)`` 已全部验证，而第 ``column`` 列不能加入答案，所以返回第一行前 ``column`` 个字符恰好最长。
若第一行所有列都通过，它本身就是公共前缀。

候选前缀为什么只能缩短
~~~~~~~~~~~~~~~~~~~~~~

横向方法先令 ``prefix = strs[0]``。加入新字符串后，只能从候选末尾删除字符，直到它成为该字符串前缀。
任何全局公共前缀都必须是当前候选的前缀，因此收缩不会删除潜在更优答案。处理完前 ``i`` 个字符串后，
``prefix`` 始终是它们的最长公共前缀。

排序后为什么首尾决定答案
~~~~~~~~~~~~~~~~~~~~~~~~

字典序排序后，具有同一前缀的字符串连续排列。首字符串和尾字符串代表最大字典序跨度：某列若首尾相同，
中间字符串不能越出这个共同前缀；首尾首次不同后，全体也不可能共享该列。因此只比较排序后的首尾即可。

状态演化
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 列
     - 第一行
     - 其余行
     - 动作
   * - 0
     - ``i``
     - ``i, i``
     - 继续
   * - 1
     - ``n``
     - ``n, n``
     - 继续
   * - 2
     - ``t``
     - ``t, t``
     - 继续
   * - 3
     - ``e``
     - ``e, e``
     - 继续
   * - 4
     - ``r``
     - ``r, r``
     - 继续
   * - 5
     - ``v``
     - ``n, n``
     - 返回 ``inter``

为什么首次冲突排除所有更长候选
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

任何长度大于 ``column`` 的前缀都必须包含第 ``column`` 列。该列已经出现越界或字符差异，所以这些候选全部
非法；继续扫描无法恢复前缀连续性。

复杂度来源
~~~~~~~~~~

设所有字符串总字符数为 ``S``。纵向扫描与横向收缩最坏检查 ``O(S)`` 个字符，除返回值外工作空间 ``O(1)``。
排序方法需要 ``O(n log n)`` 次字符串比较，并使用排序空间或修改输入副本。

九语言实现
----------

C
~

.. code-block:: c

   #include <stdlib.h>
   #include <string.h>

   char* longestCommonPrefix(char** strs, int strsSize) {
       int column = 0;
       while (strs[0][column] != '\0') {
           char expected = strs[0][column];
           for (int row = 1; row < strsSize; ++row) {
               if (strs[row][column] == '\0' || strs[row][column] != expected) {
                   char* result = malloc((size_t)column + 1);
                   memcpy(result, strs[0], (size_t)column);
                   result[column] = '\0';
                   return result;
               }
           }
           ++column;
       }
       char* result = malloc((size_t)column + 1);
       memcpy(result, strs[0], (size_t)column + 1);
       return result;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def longestCommonPrefix(self, strs: list[str]) -> str:
           for column, expected in enumerate(strs[0]):
               for text in strs[1:]:
                   if column == len(text) or text[column] != expected:
                       return strs[0][:column]
           return strs[0]

Java
~~~~

.. code-block:: java

   class Solution {
       public String longestCommonPrefix(String[] strs) {
           for (int column = 0; column < strs[0].length(); column++) {
               char expected = strs[0].charAt(column);
               for (int row = 1; row < strs.length; row++) {
                   if (column == strs[row].length() || strs[row].charAt(column) != expected)
                       return strs[0].substring(0, column);
               }
           }
           return strs[0];
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn longest_common_prefix(strs: Vec<String>) -> String {
           let first = strs[0].as_bytes();
           for column in 0..first.len() {
               for text in strs.iter().skip(1) {
                   let bytes = text.as_bytes();
                   if column == bytes.len() || bytes[column] != first[column] {
                       return String::from_utf8(first[..column].to_vec()).unwrap();
                   }
               }
           }
           strs[0].clone()
       }
   }

Go
~~

.. code-block:: go

   func longestCommonPrefix(strs []string) string {
       for column := 0; column < len(strs[0]); column++ {
           expected := strs[0][column]
           for row := 1; row < len(strs); row++ {
               if column == len(strs[row]) || strs[row][column] != expected {
                   return strs[0][:column]
               }
           }
       }
       return strs[0]
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function longestCommonPrefix(strs: string[]): string {
       for (let column = 0; column < strs[0].length; ++column) {
           const expected = strs[0][column];
           for (let row = 1; row < strs.length; ++row) {
               if (column === strs[row].length || strs[row][column] !== expected)
                   return strs[0].slice(0, column);
           }
       }
       return strs[0];
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public string LongestCommonPrefix(string[] strs) {
           for (int column = 0; column < strs[0].Length; column++) {
               char expected = strs[0][column];
               for (int row = 1; row < strs.Length; row++) {
                   if (column == strs[row].Length || strs[row][column] != expected)
                       return strs[0].Substring(0, column);
               }
           }
           return strs[0];
       }
   }

Julia
~~~~~

.. code-block:: julia

   function longest_common_prefix(strs::Vector{String})::String
       chars = [collect(s) for s in strs]
       for column in eachindex(chars[1])
           expected = chars[1][column]
           for row in Iterators.drop(eachindex(chars), 1)
               if column > length(chars[row]) || chars[row][column] != expected
                   return column == 1 ? "" : join(chars[1][1:(column - 1)])
               end
           end
       end
       strs[1]
   end

R
~

.. code-block:: r

   longestCommonPrefix <- function(strs) {
       chars <- lapply(strs, function(s) strsplit(s, "", fixed = TRUE)[[1]])
       if (length(chars[[1]]) == 0L) return("")
       for (column in seq_along(chars[[1]])) {
           expected <- chars[[1]][[column]]
           if (length(chars) > 1L) {
               for (row in 2:length(chars)) {
                   if (column > length(chars[[row]]) || chars[[row]][[column]] != expected) {
                       if (column == 1L) return("")
                       return(paste(chars[[1]][seq_len(column - 1L)], collapse = ""))
                   }
               }
           }
       }
       strs[[1]]
   }
