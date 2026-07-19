0003. Longest Substring Without Repeating Characters
====================================================

题目信息
--------

:题号: 0003
:难度: Medium
:主题: 字符串、哈希表、滑动窗口
:原题: `LeetCode 0003 <https://leetcode.com/problems/longest-substring-without-repeating-characters/>`_
:访问状态: Available
:教学重点: 滑动窗口、最后出现位置、左边界单调移动

题目重述
--------

给定一个字符串，求其中不含重复字符的最长连续子串长度。子串必须在原字符串中
连续，不能跳过中间字符。

自建示例
--------

.. code-block:: text

   输入：s = "abcaef"
   输出：5
   解释：最长无重复子串是 "bcaef"

问题抽象
--------

维护一个窗口 ``[left, right]``，要求窗口中的字符互不重复。右端点逐个向右扩展；
如果当前字符曾经出现在现有窗口中，左端点直接跳到该字符旧位置的下一位。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 空间复杂度
     - 定位
   * - 记录最后位置并跳跃左边界
     - ``O(n)``
     - ``O(k)``
     - 主解法
   * - 集合窗口逐个删除左端字符
     - ``O(n)``
     - ``O(k)``
     - 对照解法
   * - 枚举所有子串
     - ``O(n²)`` 或更高
     - ``O(k)``
     - 只用于说明优化来源

其中 ``k`` 是字符种类数量。

主解法：最后位置滑动窗口
------------------------

思路
~~~~

哈希表 ``last`` 保存每个字符最近一次出现的位置。处理 ``right`` 处的字符时：

#. 若旧位置在当前窗口左边界之前，它不会影响当前窗口；
#. 若旧位置仍在窗口中，把 ``left`` 移到旧位置的下一位；
#. 更新当前字符的最后位置和窗口最大长度。

左边界只能向右移动，绝不能退回更小的位置。

状态图
~~~~~~

.. mermaid::

   flowchart LR
       L["左边界 left"] --> W["当前无重复窗口"]
       W --> R["右边界 right"]
       P["当前字符旧位置 p"] -. "若 p 在窗口内" .-> M["left = p + 1"]
       M --> L

需要观察的是：遇到重复字符时只移动左边界，右边界仍然继续向前。旧位置位于窗口
之外时，``left`` 保持不变。

核心不变量
~~~~~~~~~~

每轮更新完成后：

* 窗口 ``[left, right]`` 内没有重复字符；
* ``last`` 保存已经扫描字符的最近位置；
* ``left`` 从不向左移动；
* ``best`` 是所有已处理窗口中的最大长度。

正确性依据
~~~~~~~~~~

若当前字符在窗口内上次出现于 ``p``，任何包含 ``p`` 和 ``right`` 的窗口都会重复，
所以新左边界至少是 ``p + 1``。移动到 ``p + 1`` 后，当前字符在窗口中只保留
最新一次出现，其他字符仍保持唯一。若 ``p < left``，旧字符已在窗口外，无需移动。
因此每一步得到的都是以 ``right`` 结尾的最长合法窗口，所有 ``right`` 的最大值
就是答案。

复杂度
~~~~~~

* 时间复杂度：``O(n)``，每个字符只被右端点处理一次；
* 空间复杂度：``O(k)``；
* C、C++、Rust 和 Go 按本题字符范围使用 256 项字节位置表。

核心语言实现
~~~~~~~~~~~~

C
^

.. code-block:: c

   #include <string.h>

   int lengthOfLongestSubstring(char* s) {
       int last[256];
       for (int i = 0; i < 256; ++i) {
           last[i] = -1;
       }

       int left = 0;
       int best = 0;

       for (int right = 0; s[right] != '\0'; ++right) {
           const unsigned char ch = (unsigned char)s[right];
           if (last[ch] >= left) {
               left = last[ch] + 1;
           }

           last[ch] = right;
           const int length = right - left + 1;
           if (length > best) {
               best = length;
           }
       }

       return best;
   }

C++
^^^

.. code-block:: cpp

   class Solution {
   public:
       int lengthOfLongestSubstring(const std::string& s) {
           std::array<int, 256> last;
           last.fill(-1);

           int left = 0;
           int best = 0;

           for (int right = 0;
                right < static_cast<int>(s.size());
                ++right) {
               const auto ch = static_cast<unsigned char>(s[right]);
               left = std::max(left, last[ch] + 1);
               last[ch] = right;
               best = std::max(best, right - left + 1);
           }

           return best;
       }
   };

Python
^^^^^^

.. code-block:: python

   class Solution:
       def lengthOfLongestSubstring(self, s: str) -> int:
           last: dict[str, int] = {}
           left = 0
           best = 0

           for right, char in enumerate(s):
               old_index = last.get(char, -1)
               if old_index >= left:
                   left = old_index + 1

               last[char] = right
               best = max(best, right - left + 1)

           return best

Java
^^^^

.. code-block:: java

   class Solution {
       public int lengthOfLongestSubstring(String s) {
           Map<Character, Integer> last = new HashMap<>();
           int left = 0;
           int best = 0;

           for (int right = 0; right < s.length(); right++) {
               char current = s.charAt(right);
               int oldIndex = last.getOrDefault(current, -1);

               if (oldIndex >= left) {
                   left = oldIndex + 1;
               }

               last.put(current, right);
               best = Math.max(best, right - left + 1);
           }

           return best;
       }
   }

Rust
^^^^

.. code-block:: rust

   impl Solution {
       pub fn length_of_longest_substring(s: String) -> i32 {
           let mut last = [-1_i32; 256];
           let mut left = 0_i32;
           let mut best = 0_i32;

           for (right, byte) in s.bytes().enumerate() {
               let right = right as i32;
               let old_index = last[byte as usize];

               if old_index >= left {
                   left = old_index + 1;
               }

               last[byte as usize] = right;
               best = best.max(right - left + 1);
           }

           best
       }
   }

Go
^^

.. code-block:: go

   func lengthOfLongestSubstring(s string) int {
       last := [256]int{}
       for index := range last {
           last[index] = -1
       }

       left, best := 0, 0
       for right, value := range []byte(s) {
           oldIndex := last[value]
           if oldIndex >= left {
               left = oldIndex + 1
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
^^^^^^^^^^

.. code-block:: typescript

   function lengthOfLongestSubstring(s: string): number {
       const last = new Map<string, number>();
       let left = 0;
       let best = 0;

       for (let right = 0; right < s.length; right += 1) {
           const char = s[right];
           const oldIndex = last.get(char);

           if (oldIndex !== undefined && oldIndex >= left) {
               left = oldIndex + 1;
           }

           last.set(char, right);
           best = Math.max(best, right - left + 1);
       }

       return best;
   }

C#
^^

.. code-block:: csharp

   public class Solution {
       public int LengthOfLongestSubstring(string s) {
           var last = new Dictionary<char, int>();
           int left = 0;
           int best = 0;

           for (int right = 0; right < s.Length; right++) {
               char current = s[right];

               if (last.TryGetValue(current, out int oldIndex) &&
                   oldIndex >= left) {
                   left = oldIndex + 1;
               }

               last[current] = right;
               best = Math.Max(best, right - left + 1);
           }

           return best;
       }
   }

Julia
^^^^^

.. code-block:: julia

   function length_of_longest_substring(s::AbstractString)::Int
       last = Dict{Char, Int}()
       left = 1
       best = 0

       # enumerate 提供连续计数，不依赖字符串内部的字节索引。
       for (right, char) in enumerate(s)
           old_index = get(last, char, 0)
           if old_index >= left
               left = old_index + 1
           end

           last[char] = right
           best = max(best, right - left + 1)
       end

       return best
   end

R
^

.. code-block:: r

   length_of_longest_substring <- function(s) {
       chars <- strsplit(s, "", fixed = TRUE)[[1]]
       last <- new.env(hash = TRUE, parent = emptyenv())
       left <- 1L
       best <- 0L

       for (right in seq_along(chars)) {
           char <- chars[[right]]
           # 加前缀避免特殊字符直接成为环境绑定名。
           key <- paste0("u", utf8ToInt(char))
           old_index <- 0L

           if (exists(key, envir = last, inherits = FALSE)) {
               old_index <- get(key, envir = last, inherits = FALSE)
           }

           if (old_index >= left) {
               left <- old_index + 1L
           }

           assign(key, right, envir = last)
           best <- max(best, right - left + 1L)
       }

       as.integer(best)
   }

字符单位说明
~~~~~~~~~~~~

本题的常见测试字符可以直接按字节或语言的基础字符单位处理。上述 C、C++、Rust
和 Go 实现按字节计数；Java、TypeScript 和 C# 按 UTF-16 代码单元处理；Python、
Julia 与 R 的写法更接近 Unicode 字符遍历。

若工程需求要求把组合字符或表情序列视为一个用户可见字符，需要使用字形簇
（grapheme cluster）分割库。这属于字符串国际化问题，不是本题算法核心。

对照解法：集合窗口
------------------

另一种滑动窗口只保存窗口中的字符集合。右端字符重复时，不断删除左端字符并让
``left`` 加一，直到重复消失。每个字符至多进入和离开集合一次，所以仍是
``O(n)``，只是不能像主解法一样直接跳过一段窗口。

.. code-block:: text

   创建空集合 window
   对每个 right：
       当 s[right] 已经在 window 中：
           从 window 删除 s[left]
           left 向右移动一位
       把 s[right] 加入 window
       更新最大长度

主解法额外保存最后位置，用更多状态换取更直接的左边界跳跃。

易错点
------

* 左边界必须使用 ``max(left, oldIndex + 1)`` 的语义，不能向左退回；
* 求的是连续子串（substring），不是可以跳过字符的子序列；
* TypeScript 查询结果 ``0`` 合法，仍需显式判断 ``undefined``；
* 不同语言的“字符”可能表示字节、代码单元、码点或字形簇；
* R 的环境键需要编码，避免空白和特殊符号带来绑定名问题。

本题新增知识
------------

* 滑动窗口（sliding window）通过两个边界维护连续区间；
* 最近出现位置允许左边界跨越无效区间；
* 窗口合法性是本题的核心不变量；
* 多语言字符串索引单位存在差异。

本题强化知识
------------

* 哈希表继续保存“值到位置”的映射，基础容器语法不再逐项重复解释；
* TypeScript、Java 和 C# 再次练习安全读取映射中的可选结果。

关联题目
--------

* `0001. Two Sum <0001-two-sum.rst>`_：两题都保存元素到最近位置的映射；
* `0002. Add Two Numbers <0002-add-two-numbers.rst>`_：上一题按节点推进，
  本题按区间边界推进。

最小自检
--------

#. 为什么旧位置小于 ``left`` 时不能修改左边界？
#. 为什么左边界在整个算法中只能向右移动？
#. “最后出现位置”方案比字符集合方案多保存了什么信息？

答案要点
~~~~~~~~

#. 该次出现已经位于当前窗口之外，不会造成窗口内重复；
#. 已经排除的前缀不可能重新加入以当前右端点结尾的合法窗口；
#. 它不仅记录字符是否存在，还记录字符最近一次出现的具体位置。
