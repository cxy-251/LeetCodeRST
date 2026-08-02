0003. Longest Substring Without Repeating Characters
====================================================

题目信息
--------

:题号: 0003
:难度: Medium
:主题: 字符串、哈希表、滑动窗口
:原题: `LeetCode 0003 <https://leetcode.com/problems/longest-substring-without-repeating-characters/>`_
:重点: 连续子串、重复字符、窗口边界、字符最近位置

题目重述
--------

给定字符串 ``s``，返回其中不含重复字符的最长连续子串长度。子串必须由原字符串中一段连续字符组成，不能跳过字符重新拼接；如果有多个等长的最长子串，只需返回这个长度。

``s`` 的长度位于 ``[0, 5 * 10^4]``，其中可能包含英文字母、数字、符号和空格；空字符串的答案为 ``0``。

自建示例
--------

最长区间位于字符串中部：

.. code-block:: text

   输入：s = "abcbadeaf"
   输出：5
   解释：连续子串 "cbade" 不含重复字符，长度为 5；不存在更长的无重复连续子串。

空字符串：

.. code-block:: text

   输入：s = ""
   输出：0
   解释：字符串中没有字符，因此最长无重复子串的长度为 0。

空格和符号也是字符：

.. code-block:: text

   输入：s = "a b!a"
   输出：4
   解释：``"a b!"`` 和 ``" b!a"`` 都是不含重复字符的长度 4 子串；空格和感叹号都参与字符比较。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <array>
   #include <string>

   class Solution {
   private:
       int enumerateStarts(const std::string& s) {
           int best = 0;

           for (int left = 0;
                left < static_cast<int>(s.size());
                ++left) {
               std::array<bool, 256> used{};

               for (int right = left;
                    right < static_cast<int>(s.size());
                    ++right) {
                   const auto ch =
                       static_cast<unsigned char>(s[right]);

                   if (used[ch]) {
                       break;  // 固定左端后，继续扩展只会保留该重复字符
                   }

                   used[ch] = true;
                   best = std::max(best, right - left + 1);
               }
           }

           return best;
       }

       int shrinkWithSet(const std::string& s) {
           std::array<bool, 256> in_window{};
           int left = 0;
           int best = 0;

           for (int right = 0;
                right < static_cast<int>(s.size());
                ++right) {
               const auto ch =
                   static_cast<unsigned char>(s[right]);

               while (in_window[ch]) {
                   const auto removed =
                       static_cast<unsigned char>(s[left]);
                   in_window[removed] = false;
                   ++left;  // 逐个移除失效前缀，直到当前字符可以进入窗口
               }

               in_window[ch] = true;
               best = std::max(best, right - left + 1);
           }

           return best;
       }

       int jumpWithLastPosition(const std::string& s) {
           std::array<int, 256> last;
           last.fill(-1);

           int left = 0;
           int best = 0;

           for (int right = 0;
                right < static_cast<int>(s.size());
                ++right) {
               const auto ch =
                   static_cast<unsigned char>(s[right]);

               left = std::max(
                   left,
                   last[ch] + 1
               );  // 旧位置在窗口内时，直接跳到它的下一位

               last[ch] = right;
               best = std::max(best, right - left + 1);
           }

           return best;
       }

   public:
       int lengthOfLongestSubstring(std::string s) {
           return jumpWithLastPosition(s);
       }
   };

题解
----

原始搜索空间：所有连续子串
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

长度为 ``n`` 的字符串共有：

.. math::

   \frac{n(n + 1)}{2}

个非空连续子串。最直接的方法是固定左端点 ``left``，再向右扩展 ``right``，用字符集合
判断当前区间是否出现重复。

``enumerateStarts`` 对每个左端点重新建立 ``used``。一旦扩展到重复字符，所有具有相同
左端点且右端更远的子串仍然包含这两个重复字符，因此可以停止当前内层循环。该方法已经利用了
“重复后无需继续扩展”的信息，但相邻左端点仍会反复检查大量相同字符，最坏需要二次时间。

从反复检查子串到维护一个合法窗口
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

右端点从左到右扫描时，相邻候选区间共享大部分字符。与其为每个左端点重新检查，不如维护一个
始终无重复的连续窗口 ``[left, right]``：

* ``right`` 每轮加入一个新字符；
* 若加入后产生重复，移动 ``left``，删除使窗口失效的前缀；
* 窗口恢复合法后，``right - left + 1`` 就是当前右端对应的候选长度。

新字符加入之前，窗口已经无重复，因此本轮唯一可能新增的冲突来自 ``s[right]`` 本身。算法只
需要找到并排除它在当前窗口中的旧位置，不必重新检查其他字符之间的关系。

集合窗口：逐个移除失效前缀
~~~~~~~~~~~~~~~~~~~~~~~~~~

``shrinkWithSet`` 使用 ``in_window`` 记录当前窗口中有哪些字符。若 ``s[right]`` 已经存在，
就从 ``s[left]`` 开始逐个删除字符并右移 ``left``，直到旧的同字符也被移出窗口，然后再加入
当前字符。

这个方案已经是线性算法。``right`` 只向右走一遍；每个字符进入窗口一次，并且最多从左端移出
一次。它只知道“字符当前是否在窗口中”，所以恢复合法性时必须逐个删除。

最后位置索引：一次跳到最早合法左边界
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

主解法进一步保存：

.. code-block:: text

   last[ch] = 字符 ch 在已扫描前缀中的最近下标

处理 ``right`` 处字符 ``ch`` 时，设它的旧位置为 ``p = last[ch]``：

* 若 ``p < left``，旧字符已经在当前窗口之外，不会造成窗口内重复，``left`` 保持不变；
* 若 ``p >= left``，任何左端点不超过 ``p`` 的区间都会同时包含旧字符和当前字符，必须把
  ``left`` 移到 ``p + 1``；
* 两种情况统一写成 ``left = max(left, p + 1)``。

``last`` 不只回答字符是否出现，还指出失效前缀的精确终点，因此能够一次跳过集合方案中需要
逐个删除的区间。更新 ``left`` 后再执行 ``last[ch] = right``，让当前字符成为后续扫描使用的
最近位置。

主解法状态演化
~~~~~~~~~~~~~~

使用自建示例 ``s = "abcbadeaf"``：

.. list-table::
   :header-rows: 1

   * - ``right``
     - 字符
     - 旧位置
     - 更新前 ``left``
     - 更新后 ``left``
     - 当前窗口
     - ``best``
   * - 0
     - ``a``
     - -1
     - 0
     - 0
     - ``a``
     - 1
   * - 1
     - ``b``
     - -1
     - 0
     - 0
     - ``ab``
     - 2
   * - 2
     - ``c``
     - -1
     - 0
     - 0
     - ``abc``
     - 3
   * - 3
     - ``b``
     - 1
     - 0
     - 2
     - ``cb``
     - 3
   * - 4
     - ``a``
     - 0
     - 2
     - 2
     - ``cba``
     - 3
   * - 5
     - ``d``
     - -1
     - 2
     - 2
     - ``cbad``
     - 4
   * - 6
     - ``e``
     - -1
     - 2
     - 2
     - ``cbade``
     - 5
   * - 7
     - ``a``
     - 4
     - 2
     - 5
     - ``dea``
     - 5
   * - 8
     - ``f``
     - -1
     - 5
     - 5
     - ``deaf``
     - 5

``right = 4`` 时，字符 ``a`` 的旧位置为 0，但当前窗口从 2 开始，所以旧 ``a`` 已经被排除。
这里使用 ``max(left, old + 1)`` 才能保持左边界为 2。``right = 7`` 时，旧 ``a`` 位于当前
窗口内，左边界直接跳到 5。

解法对比与主解法选择
~~~~~~~~~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 状态提供的信息
   * - 固定左端逐步扩展
     - ``O(n²)``
     - ``O(1)``
     - 为每个左端重新记录已见字符
   * - 集合滑动窗口
     - ``O(n)``
     - ``O(1)``
     - 只记录字符是否在当前窗口中
   * - 最后位置跳跃
     - ``O(n)``
     - ``O(1)``
     - 记录失效前缀的精确终点，可直接跳跃

空间复杂度按题目固定 ASCII 字符域计算，因此两个数组都只有 256 项。推广到任意字符集合并使用
哈希表时，工作空间为 ``O(k)``，其中 ``k`` 是已记录的不同字符数量。

本文 C++ 主解法采用最后位置跳跃。它与集合窗口具有相同的渐进时间复杂度，同时减少了恢复窗口时的
逐步删除操作。

为什么更新后窗口仍然无重复
~~~~~~~~~~~~~~~~~~~~~~~~~~

处理 ``right`` 之前，窗口 ``[left, right - 1]`` 已经无重复。加入 ``s[right]`` 后，旧窗口
中只有与当前字符相同的那个位置可能形成新冲突。

若最近旧位置 ``p`` 位于窗口内，把 ``left`` 移到 ``p + 1`` 会删除旧字符；旧窗口中的其他
字符原本互不重复，删除一段前缀也不会制造新的重复。若 ``p`` 位于窗口外，当前窗口中本来就没有
该字符。两种情况下，更新后的 ``[left, right]`` 都保持无重复。

为什么每个右端都得到最长合法窗口
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若当前字符的旧位置 ``p`` 位于窗口内，任何起点 ``start <= p`` 的区间 ``[start, right]``
都会同时包含两次当前字符，因此不合法；``p + 1`` 是能够排除这次冲突的最小新起点。

若 ``p < left``，本轮没有产生窗口内冲突，而当前 ``left`` 已经是此前字符约束允许的最小起点。
让左边界退回会重新引入之前排除的重复字符。因此 ``left`` 只能保持或右移，并且每轮得到的
``[left, right]`` 正是以 ``right`` 结尾的最长无重复子串。

任意合法子串都有唯一的右端点。算法计算了每个右端点对应的最长合法子串长度，``best`` 取这些
长度的最大值，所以覆盖了全局最优答案。

复杂度来源
~~~~~~~~~~

``enumerateStarts`` 最多为每个左端点扫描到字符串末尾，检查次数为二次数量级，时间复杂度
``O(n²)``。固定字符表占用 ``O(1)`` 工作空间。

``shrinkWithSet`` 中，每个字符被右端加入一次，并且最多被左端删除一次，两个边界的总移动次数
为 ``O(n)``，时间复杂度 ``O(n)``，工作空间 ``O(1)``。

``jumpWithLastPosition`` 对每个字符执行一次旧位置读取、一次左边界更新、一次位置写入和一次长度
更新，时间复杂度 ``O(n)``。固定 256 项位置表占用 ``O(1)`` 空间。使用哈希表适配更大字符域时，
工作空间为 ``O(k)``。

九语言实现
----------

题目字符域可以按 ASCII 处理。C、Rust、Go 和 Julia 使用 256 项字节位置表；Python、Java、
TypeScript、C# 和 R 使用各语言常见的映射结构。所有实现都维护同一状态和更新顺序：

.. code-block:: text

   left = max(left, last[current] + 1)
   last[current] = right
   best = max(best, right - left + 1)

C
~

.. code-block:: c

   int lengthOfLongestSubstring(char* s) {
       int last[256];
       for (int index = 0; index < 256; ++index) {
           last[index] = -1;
       }

       int left = 0;
       int best = 0;

       for (int right = 0; s[right] != '\0'; ++right) {
           const unsigned char ch = (unsigned char)s[right];
           const int next_left = last[ch] + 1;

           if (next_left > left) {
               left = next_left;  // 旧位置位于窗口内时才推进左边界
           }

           last[ch] = right;
           const int length = right - left + 1;
           if (length > best) {
               best = length;
           }
       }

       return best;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def lengthOfLongestSubstring(self, s: str) -> int:
           last: dict[str, int] = {}
           left = 0
           best = 0

           for right, char in enumerate(s):
               left = max(left, last.get(char, -1) + 1)
               last[char] = right  # 当前字符成为最近位置
               best = max(best, right - left + 1)

           return best

Java
~~~~

.. code-block:: java

   import java.util.HashMap;
   import java.util.Map;

   class Solution {
       public int lengthOfLongestSubstring(String s) {
           Map<Character, Integer> last = new HashMap<>();
           int left = 0;
           int best = 0;

           for (int right = 0; right < s.length(); right++) {
               char current = s.charAt(right);
               int nextLeft = last.getOrDefault(current, -1) + 1;

               left = Math.max(left, nextLeft);
               last.put(current, right);  // 当前字符成为最近位置
               best = Math.max(best, right - left + 1);
           }

           return best;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn length_of_longest_substring(s: String) -> i32 {
           let mut last = [-1_i32; 256];
           let mut left = 0_i32;
           let mut best = 0_i32;

           for (right, byte) in s.bytes().enumerate() {
               let right = right as i32;
               left = left.max(last[byte as usize] + 1);
               last[byte as usize] = right; // 当前字节成为最近位置
               best = best.max(right - left + 1);
           }

           best
       }
   }

Go
~~

.. code-block:: go

   func lengthOfLongestSubstring(s string) int {
       last := [256]int{}
       for index := range last {
           last[index] = -1
       }

       left, best := 0, 0
       for right, value := range []byte(s) {
           nextLeft := last[value] + 1
           if nextLeft > left {
               left = nextLeft // 旧位置位于窗口内时才推进左边界
           }

           last[value] = right
           length := right - left + 1
           if length > best {
               best = length
           }
       }

       return best
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function lengthOfLongestSubstring(s: string): number {
       const last = new Map<string, number>();
       let left = 0;
       let best = 0;

       for (let right = 0; right < s.length; right += 1) {
           const char = s[right];
           const nextLeft = (last.get(char) ?? -1) + 1;

           left = Math.max(left, nextLeft);
           last.set(char, right); // 当前字符成为最近位置
           best = Math.max(best, right - left + 1);
       }

       return best;
   }

C#
~~

.. code-block:: csharp

   using System;
   using System.Collections.Generic;

   public class Solution {
       public int LengthOfLongestSubstring(string s) {
           var last = new Dictionary<char, int>();
           int left = 0;
           int best = 0;

           for (int right = 0; right < s.Length; right++) {
               char current = s[right];
               int oldIndex = last.TryGetValue(
                   current,
                   out int found
               ) ? found : -1;

               left = Math.Max(left, oldIndex + 1);
               last[current] = right; // 当前字符成为最近位置
               best = Math.Max(best, right - left + 1);
           }

           return best;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function length_of_longest_substring(s::AbstractString)::Int
       last = fill(0, 256)
       left = 1
       best = 0

       for (right, byte) in enumerate(codeunits(s))
           slot = Int(byte) + 1
           left = max(left, last[slot] + 1)
           last[slot] = right # 当前字节成为最近位置
           best = max(best, right - left + 1)
       end

       return best
   end

R
~

.. code-block:: r

   length_of_longest_substring <- function(s) {
       chars <- strsplit(s, "", fixed = TRUE)[[1]]
       last <- new.env(hash = TRUE, parent = emptyenv())
       left <- 1L
       best <- 0L

       for (right in seq_along(chars)) {
           char <- chars[[right]]
           key <- paste0("c", utf8ToInt(char))
           old_index <- if (exists(
               key,
               envir = last,
               inherits = FALSE
           )) {
               get(key, envir = last, inherits = FALSE)
           } else {
               0L
           }

           left <- max(left, old_index + 1L)
           assign(key, right, envir = last) # 当前字符成为最近位置
           best <- max(best, right - left + 1L)
       }

       as.integer(best)
   }
