0014. Longest Common Prefix
===========================

题目信息
--------

:题号: 0014
:难度: Easy
:主题: 字符串、数组、纵向扫描、公共前缀
:原题: `LeetCode 0014 <https://leetcode.com/problems/longest-common-prefix/>`_
:访问状态: Available
:教学重点: 逐列比较、最短字符串边界、首个不匹配位置、ASCII 切片

题目重述
--------

给定一个非空字符串数组 ``strs``，返回所有字符串共有的最长前缀。若第一个字符就无法在
所有字符串中保持一致，返回空字符串。

前缀必须从每个字符串的开头开始。它不是任意公共子串，也不能跳过中间字符。

输入字符串由小写英文字母组成，因此本文可以按单字节 ASCII 位置比较；各语言仍需注意自身
字符串索引和切片接口。

自建示例
--------

存在公共前缀
~~~~~~~~~~~~

.. code-block:: text

   输入：["flower", "flow", "flight"]
   位置 0：都为 'f'
   位置 1：都为 'l'
   位置 2："flower" 为 'o'，"flight" 为 'i'
   输出："fl"

没有公共前缀
~~~~~~~~~~~~

.. code-block:: text

   输入：["dog", "racecar", "car"]
   位置 0 已不一致。
   输出：""

某个字符串提前结束
~~~~~~~~~~~~~~~~~~

.. code-block:: text

   输入：["interview", "internet", "in"]
   前两位相同，第三个字符串已经结束。
   输出："in"

单个字符串
~~~~~~~~~~

.. code-block:: text

   输入：["algorithm"]
   唯一字符串本身就是所有字符串的最长公共前缀。
   输出："algorithm"

问题抽象
--------

最长公共前缀的每个位置都必须在所有字符串中存在并且字符相同。可以把字符串数组想成多行
字符表，从第一列开始纵向检查：

.. code-block:: text

   flower
   flow
   flight
   ^^
   两列全部相同，第三列首次不匹配

以第一个字符串作为候选上界。对于它的每个位置 ``index``，依次检查其他字符串：

* 若某个字符串长度等于 ``index``，该字符串已经结束，公共前缀到此为止；
* 若某个字符串在该位置字符不同，公共前缀到此为止；
* 只有所有字符串都通过，该位置才能加入公共前缀。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 空间复杂度
     - 取舍
   * - 以首串为上界的纵向扫描
     - ``O(S)``
     - ``O(1)`` 额外空间
     - 主解法；首次失败立即结束，边界与证明直接
   * - 逐个字符串缩短候选前缀
     - ``O(S)``
     - 取决于切片实现
     - 同样常用，但可能反复创建前缀子串
   * - 排序后只比较首尾字符串
     - ``O(n log n)``
     - 取决于排序
     - 代码短，但改变输入顺序并付出不必要的排序成本
   * - Trie
     - ``O(S)``
     - ``O(S)``
     - 适合大量重复查询，单次问题过度设计

``S`` 表示所有被检查字符的总数。最坏情况下会检查每个字符串直到最短字符串长度。

主解法：纵向扫描
----------------

状态含义
~~~~~~~~

算法维护：

* ``first``：第一个字符串，提供候选字符和最大前缀长度；
* ``prefix_length``：已经确认属于公共前缀的字符数；
* ``index``：当前准备验证的位置；
* ``str``：当前被检查的其他字符串。

当位置 ``index`` 在所有字符串中都存在且字符相等时，令：

.. code-block:: text

   prefix_length = index + 1

遇到第一个失败位置后立即返回 ``first[0:prefix_length]``。

为什么首个失败位置就是答案边界
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

前缀具有连续性。若位置 ``index`` 在某个字符串中不存在或字符不同，那么任何长度大于
``index`` 的候选前缀都会包含这个失败位置，因此不可能被所有字符串共有。

反过来，位置 ``0`` 到 ``index - 1`` 已经逐列验证过，确实在所有字符串中相同，所以长度
``index`` 的前缀合法。首个失败位置同时给出了“更长不可能”和“当前长度可行”两个结论。

核心不变量
~~~~~~~~~~

每轮检查位置 ``index`` 前：

* ``first[0:index]`` 已被证明是所有字符串的公共前缀；
* ``prefix_length == index``；
* 尚未检查的位置不会影响已确认前缀的正确性；
* 若本轮所有字符串都匹配，公共前缀可安全扩展一个字符；
* 若本轮任一字符串失败，任何更长前缀都不可能成立。

正确性依据
~~~~~~~~~~

算法从位置 ``0`` 开始。空前缀天然被所有字符串共有，因此不变量初始成立。

若位置 ``index`` 在每个字符串中都存在且字符等于 ``first[index]``，那么已经确认的公共
前缀后追加该字符仍被所有字符串共有，不变量保持。

若某个字符串在该位置结束或字符不同，则所有长度至少为 ``index + 1`` 的前缀都会包含失败
位置，因此都不是公共前缀。与此同时，长度 ``index`` 的前缀已经通过之前所有位置的验证。
算法此时返回它，既合法又无法继续扩展，所以是最长公共前缀。

若完整扫描完第一个字符串仍未失败，第一个字符串本身被所有字符串作为前缀；任何更长前缀
不可能存在，因为它已达到第一个字符串长度，因此返回整个第一个字符串正确。

复杂度
~~~~~~

设字符串数量为 ``n``，最短字符串长度为 ``m``：

* 最多比较 ``n × m`` 个字符，可写为 ``O(S)``；
* 算法状态只使用下标和局部变量，额外空间复杂度为 ``O(1)``；
* 返回结果字符串所占空间不计入额外工作空间。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdlib.h>
   #include <string.h>

   char* longestCommonPrefix(char** strs, int strsSize) {
       if (strsSize == 0) {
           char* empty = malloc(1);
           empty[0] = '\0';
           return empty;
       }

       int prefixLength = 0;
       while (strs[0][prefixLength] != '\0') {
           char expected = strs[0][prefixLength];

           for (int i = 1; i < strsSize; ++i) {
               if (strs[i][prefixLength] == '\0' ||
                   strs[i][prefixLength] != expected) {
                   char* result = malloc(prefixLength + 1);
                   memcpy(result, strs[0], prefixLength);
                   result[prefixLength] = '\0';
                   return result;
               }
           }

           ++prefixLength;
       }

       char* result = malloc(prefixLength + 1);
       memcpy(result, strs[0], prefixLength);
       result[prefixLength] = '\0';
       return result;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       string longestCommonPrefix(vector<string>& strs) {
           const string& first = strs[0];

           for (int index = 0;
                index < static_cast<int>(first.size());
                ++index) {
               char expected = first[index];

               for (int row = 1;
                    row < static_cast<int>(strs.size());
                    ++row) {
                   if (index >= static_cast<int>(strs[row].size()) ||
                       strs[row][index] != expected) {
                       return first.substr(0, index);
                   }
               }
           }

           return first;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def longestCommonPrefix(self, strs: list[str]) -> str:
           first = strs[0]

           for index, expected in enumerate(first):
               for row in range(1, len(strs)):
                   current = strs[row]
                   if index == len(current) or current[index] != expected:
                       return first[:index]

           return first

Java
~~~~

.. code-block:: java

   class Solution {
       public String longestCommonPrefix(String[] strs) {
           String first = strs[0];

           for (int index = 0; index < first.length(); ++index) {
               char expected = first.charAt(index);

               for (int row = 1; row < strs.length; ++row) {
                   if (index == strs[row].length() ||
                       strs[row].charAt(index) != expected) {
                       return first.substring(0, index);
                   }
               }
           }

           return first;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn longest_common_prefix(strs: Vec<String>) -> String {
           let first = strs[0].as_bytes();
           let mut prefix_length = 0;

           'columns: for index in 0..first.len() {
               let expected = first[index];

               for current in strs.iter().skip(1) {
                   let bytes = current.as_bytes();
                   if index == bytes.len() || bytes[index] != expected {
                       break 'columns;
                   }
               }

               prefix_length = index + 1;
           }

           // 题目只含小写英文字母，字节边界就是 UTF-8 字符边界。
           strs[0][..prefix_length].to_string()
       }
   }

Go
~~

.. code-block:: go

   func longestCommonPrefix(strs []string) string {
       first := strs[0]

       for index := 0; index < len(first); index++ {
           expected := first[index]

           for row := 1; row < len(strs); row++ {
               if index == len(strs[row]) || strs[row][index] != expected {
                   return first[:index]
               }
           }
       }

       return first
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function longestCommonPrefix(strs: string[]): string {
       const first = strs[0];

       for (let index = 0; index < first.length; index += 1) {
           const expected = first[index];

           for (let row = 1; row < strs.length; row += 1) {
               if (
                   index === strs[row].length ||
                   strs[row][index] !== expected
               ) {
                   return first.slice(0, index);
               }
           }
       }

       return first;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public string LongestCommonPrefix(string[] strs) {
           string first = strs[0];

           for (int index = 0; index < first.Length; ++index) {
               char expected = first[index];

               for (int row = 1; row < strs.Length; ++row) {
                   if (index == strs[row].Length ||
                       strs[row][index] != expected) {
                       return first.Substring(0, index);
                   }
               }
           }

           return first;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function longest_common_prefix(strs::Vector{String})::String
       first_bytes = codeunits(strs[1])
       prefix_length = 0

       for index in eachindex(first_bytes)
           expected = first_bytes[index]

           for row in 2:length(strs)
               current = codeunits(strs[row])
               if index > length(current) || current[index] != expected
                   if prefix_length == 0
                       return ""
                   end
                   return String(
                       Vector{UInt8}(first_bytes[1:prefix_length])
                   )
               end
           end

           prefix_length = index
       end

       return strs[1]
   end

R
~

.. code-block:: r

   longestCommonPrefix <- function(strs) {
       if (length(strs) == 1) {
           return(strs[[1]])
       }

       first <- utf8ToInt(strs[[1]])
       prefix_length <- 0

       for (index in seq_along(first)) {
           expected <- first[[index]]

           for (row in 2:length(strs)) {
               current <- utf8ToInt(strs[[row]])
               if (index > length(current) || current[[index]] != expected) {
                   if (prefix_length == 0) {
                       return("")
                   }
                   return(substr(strs[[1]], 1, prefix_length))
               }
           }

           prefix_length <- index
       }

       strs[[1]]
   }

关键边界与易错点
----------------

* 不能只比较字符串长度；相同长度仍可能在首字符处不同；
* 必须在访问字符前检查当前字符串是否已经结束；
* 单个字符串的答案是它本身；
* 最短字符串天然限制公共前缀最大长度；
* C 需要为返回字符串分配空间并补上结尾 ``'\0'``；
* Rust 和 Go 的字节切片依赖本题小写英文字母约束；一般 Unicode 字符串不能任意按字节切片；
* R 的实现先处理单字符串，避免 ``2:length(strs)`` 形成无效反向序列。

新增与强化知识
--------------

新增
~~~~

* **纵向公共前缀扫描**：按字符位置逐列验证所有字符串，而不是逐个构造候选子串；
* **首个失败边界**：第一个长度不足或字符不匹配的位置同时证明当前前缀最长；
* **ASCII 前缀切片**：在字符集受限时，字节下标可直接作为安全切片边界。

强化
~~~~

* 0003、0005、0010 中的字符串索引边界再次出现；
* Julia 与 R 的一基下标需要与“前缀长度”状态区分；
* 失败即返回可以避免继续检查不可能改变答案的后续字符。

关联题目
--------

* `0003. Longest Substring Without Repeating Characters
  <0003-longest-substring-without-repeating-characters.rst>`_：同样维护字符串位置边界，
  但目标是合法窗口而非公共前缀；
* `0005. Longest Palindromic Substring <0005-longest-palindromic-substring.rst>`_：同样依赖字符边界，
  但比较的是同一字符串中的对称区间。

最小自检
--------

#. 为什么任一字符串在位置 ``index`` 结束时可以立即返回？
#. 为什么第一个字符串可以作为候选长度上界？
#. ``["ab", "ac", "a"]`` 会在哪个位置停止？
#. 单字符串输入为什么直接返回自身？
#. Rust、Go 按字节切片为什么在本题安全？

答案要点
~~~~~~~~

#. 更长前缀必须包含该位置，而这个字符串没有对应字符；
#. 公共前缀不可能比其中任一字符串更长；
#. 位置 ``1``，返回 ``"a"``；
#. 它的所有前缀中最长者就是完整字符串；
#. 输入只含单字节小写英文字母，字节边界与字符边界一致。
