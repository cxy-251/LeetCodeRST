0010. Regular Expression Matching
=================================

题目信息
--------

:题号: 0010
:难度: Hard
:主题: 字符串、动态规划、记忆化搜索、正则语义
:原题: `LeetCode 0010 <https://leetcode.com/problems/regular-expression-matching/>`_
:访问状态: Available
:教学重点: 状态定义、完整匹配、点号通配、星号零次或多次、递归分支与记忆化

题目重述
--------

给定字符串 ``s`` 和模式 ``p``，判断模式能否匹配字符串的全部字符。

模式只包含普通小写字母、点号 ``.`` 和星号 ``*``：

* 普通字母只能匹配相同字母；
* ``.`` 可以匹配任意单个字符；
* ``*`` 修饰它前面的元素，使该元素可以出现零次或多次。

这里要求完整匹配。模式只匹配字符串的一段前缀或中间片段时，结果仍为 ``false``。
题目保证 ``*`` 总有可修饰的前一个元素，不会单独出现在模式开头。

自建示例
--------

星号匹配多次
~~~~~~~~~~~~

.. code-block:: text

   输入：s = "aaab", p = "a*b"
   a* 先消费三个 a，随后 b 匹配最后一个 b。
   输出：true

星号匹配零次
~~~~~~~~~~~~

.. code-block:: text

   输入：s = "b", p = "a*b"
   a* 选择出现零次，模式直接跳到 b。
   输出：true

点号与星号组合
~~~~~~~~~~~~~~

.. code-block:: text

   输入：s = "ab", p = ".*"
   . 可以匹配任意单个字符，.* 可以重复消费整个字符串。
   输出：true

必须完整匹配
~~~~~~~~~~~~

.. code-block:: text

   输入：s = "abc", p = "ab"
   模式虽然匹配前两个字符，但没有覆盖末尾 c。
   输出：false

问题抽象
--------

从当前位置开始，真正需要回答的问题不是“当前两个字符是否相同”，而是：

``s[i:]`` 能否被 ``p[j:]`` 完整匹配。

因此定义状态 ``match(i, j)``：

* ``i`` 是字符串中尚未匹配部分的起点；
* ``j`` 是模式中尚未处理部分的起点；
* 返回值表示两个后缀能否完整匹配。

当前位置是否能匹配一个字符记为 ``first_match``：

.. code-block:: text

   i < len(s) 并且 (p[j] == s[i] 或 p[j] == '.')

普通模式元素只产生一个后继状态。后面跟有 ``*`` 的元素会产生两个语义分支：

* 零次：跳过模式中的 ``元素 + *``，进入 ``match(i, j + 2)``；
* 一次或更多次：当前位置先匹配一个字符，模式仍停在 ``j``，进入
  ``match(i + 1, j)``。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 空间复杂度
     - 取舍
   * - 记忆化搜索
     - ``O(mn)``
     - ``O(mn)``
     - 主解法；递归结构直接对应 ``*`` 的两个语义分支
   * - 自底向上动态规划
     - ``O(mn)``
     - ``O(mn)``
     - 避免递归栈，但遍历顺序和边界初始化更容易写错
   * - 朴素回溯
     - 指数级
     - 与递归深度相关
     - 会重复计算相同后缀状态，不能满足稳定性能要求
   * - 调用语言内建正则引擎
     - 依实现而定
     - 依实现而定
     - 隐藏题目要求的状态转移，不适合作为教学主解法

主解法：记忆化搜索
------------------

状态与终止条件
~~~~~~~~~~~~~~

设字符串长度为 ``m``，模式长度为 ``n``。

``match(i, j)`` 只依赖 ``i`` 和 ``j``。当 ``j == n`` 时，模式已经耗尽；此时只有
``i == m``，即字符串也恰好耗尽，才算完整匹配。

注意 ``i == m`` 时不能立刻返回 ``false``。剩余模式可能是 ``a*b*c*`` 这类每组都选择
零次的结构，仍有机会匹配空字符串。

普通元素转移
~~~~~~~~~~~~

若 ``p[j + 1]`` 不是 ``*``，当前模式元素必须恰好消费一个字符串字符：

.. code-block:: text

   match(i, j) = first_match && match(i + 1, j + 1)

只要当前位置不匹配，该状态立即为 ``false``。

星号转移
~~~~~~~~

若 ``j + 1 < n`` 且 ``p[j + 1] == '*'``，有两种合法选择：

.. code-block:: text

   match(i, j) = match(i, j + 2)
                 或
                 (first_match && match(i + 1, j))

第一项表示前一个元素出现零次。第二项表示先出现一次；模式位置保持不变，允许下一轮继续
选择同一个元素，因此自然覆盖一次、两次和更多次。

这里不能在消费一个字符后跳到 ``j + 2``。那只能表达“恰好一次”，会丢失重复匹配能力。

记忆化为什么必要
~~~~~~~~~~~~~~~~

星号的两个分支可能通过不同路径回到同一个 ``(i, j)``。例如 ``s = "aaaa"``、
``p = "a*a*"`` 中，前一个 ``a*`` 多消费或后一个 ``a*`` 多消费会产生大量重叠子问题。

为每个 ``(i, j)`` 保存三态结果：

* 未计算；
* 已计算且为 ``false``；
* 已计算且为 ``true``。

这样每个状态最多展开一次，后续访问直接复用结果。

执行过程示例
~~~~~~~~~~~~

以 ``s = "aab"``、``p = "c*a*b"`` 为例：

.. code-block:: text

   match(0, 0): c* 无法消费 a，选择零次 -> match(0, 2)
   match(0, 2): a* 可消费 a
       可选零次 -> match(0, 4)，a 与 b 不匹配，失败
       选择消费 -> match(1, 2)
   match(1, 2): a* 再消费一个 a -> match(2, 2)
   match(2, 2): 当前 b 不匹配 a，a* 选择结束 -> match(2, 4)
   match(2, 4): b 匹配 b -> match(3, 5)
   字符串与模式同时耗尽，返回 true

核心不变量
~~~~~~~~~~

每次调用 ``match(i, j)`` 时：

* ``s[:i]`` 与 ``p[:j]`` 已通过先前选择形成合法匹配；
* 当前调用只负责判断两个剩余后缀 ``s[i:]`` 与 ``p[j:]``；
* 普通元素若成功，字符串和模式各前进一个位置；
* 星号零次分支不消费字符串，只跳过完整的 ``元素 + *``；
* 星号重复分支恰好消费一个字符串字符，保留模式位置以允许继续重复；
* 所有转移都严格推进 ``i`` 或 ``j``，不会形成无限递归。

正确性依据
~~~~~~~~~~

对模式后缀 ``p[j:]`` 的结构进行讨论。

当模式为空时，完整匹配成立当且仅当字符串后缀也为空，终止条件正确。

当当前元素后面没有 ``*`` 时，任何合法匹配都必须让该元素匹配 ``s[i]``，随后剩余后缀
继续完整匹配。转移 ``first_match && match(i + 1, j + 1)`` 恰好覆盖这一唯一可能。

当当前元素后面有 ``*`` 时，该元素在任意合法匹配中的出现次数只有两类：零次，或至少一次。
零次时必须跳过该元素和 ``*``，对应 ``match(i, j + 2)``。至少一次时，当前元素必须先匹配
``s[i]``，消费该字符后仍可继续使用同一个带星号元素，对应
``first_match && match(i + 1, j)``。两个分支互相补全了所有合法出现次数，没有遗漏其他情况。

递归对子问题使用同一完整匹配定义，因此根据后缀长度的归纳，``match(0, 0)`` 为 ``true``
当且仅当整个模式完整匹配整个字符串。记忆化只缓存已经证明的状态值，不改变转移结果。

复杂度
~~~~~~

设 ``m = len(s)``，``n = len(p)``。

* 状态数量最多为 ``(m + 1)(n + 1)``；
* 每个状态只执行常数次判断和至多两个转移；
* 时间复杂度：``O(mn)``；
* 记忆表空间复杂度：``O(mn)``；
* 递归栈最深为 ``O(m + n)``，包含在总辅助空间的说明中。

核心语言实现
~~~~~~~~~~~~

C
^

.. code-block:: c

   #include <stdbool.h>
   #include <stdlib.h>
   #include <string.h>

   static bool dfs(
       const char *s,
       const char *p,
       int i,
       int j,
       int m,
       int n,
       signed char *memo
   ) {
       int key = i * (n + 1) + j;
       if (memo[key] != -1) {
           return memo[key] == 1;
       }

       bool answer;
       if (j == n) {
           answer = i == m;
       } else {
           bool first_match =
               i < m && (p[j] == s[i] || p[j] == '.');

           if (j + 1 < n && p[j + 1] == '*') {
               // 零次跳过两格；重复分支消费一个字符但保留模式位置。
               answer = dfs(s, p, i, j + 2, m, n, memo) ||
                   (first_match && dfs(s, p, i + 1, j, m, n, memo));
           } else {
               answer = first_match &&
                   dfs(s, p, i + 1, j + 1, m, n, memo);
           }
       }

       memo[key] = answer ? 1 : 0;
       return answer;
   }

   bool isMatch(char *s, char *p) {
       int m = (int)strlen(s);
       int n = (int)strlen(p);
       size_t count = (size_t)(m + 1) * (size_t)(n + 1);
       signed char *memo = malloc(count * sizeof(*memo));
       if (memo == NULL) {
           return false;
       }
       memset(memo, -1, count * sizeof(*memo));

       bool answer = dfs(s, p, 0, 0, m, n, memo);
       free(memo);  // 记忆表由本函数分配，也必须由本函数释放。
       return answer;
   }

C++
^^^

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
       std::string s_;
       std::string p_;
       std::vector<std::vector<int>> memo_;

       bool dfs(int i, int j) {
           int &cached = memo_[i][j];
           if (cached != -1) {
               return cached == 1;
           }

           bool answer;
           if (j == static_cast<int>(p_.size())) {
               answer = i == static_cast<int>(s_.size());
           } else {
               bool firstMatch = i < static_cast<int>(s_.size()) &&
                   (p_[j] == s_[i] || p_[j] == '.');
               bool hasStar = j + 1 < static_cast<int>(p_.size()) &&
                   p_[j + 1] == '*';

               answer = hasStar
                   ? dfs(i, j + 2) || (firstMatch && dfs(i + 1, j))
                   : firstMatch && dfs(i + 1, j + 1);
           }

           cached = answer ? 1 : 0;
           return answer;
       }

   public:
       bool isMatch(std::string s, std::string p) {
           s_ = std::move(s);
           p_ = std::move(p);
           memo_.assign(s_.size() + 1, std::vector<int>(p_.size() + 1, -1));
           return dfs(0, 0);
       }
   };

Python
^^^^^^

.. code-block:: python

   from functools import lru_cache


   class Solution:
       def isMatch(self, s: str, p: str) -> bool:
           @lru_cache(maxsize=None)
           def match(i: int, j: int) -> bool:
               if j == len(p):
                   return i == len(s)

               first_match = (
                   i < len(s) and (p[j] == s[i] or p[j] == ".")
               )
               if j + 1 < len(p) and p[j + 1] == "*":
                   # Python 的短路 or 避免在零次分支成功后继续递归。
                   return match(i, j + 2) or (
                       first_match and match(i + 1, j)
                   )
               return first_match and match(i + 1, j + 1)

           return match(0, 0)

Java
^^^^

.. code-block:: java

   class Solution {
       private String s;
       private String p;
       private Boolean[][] memo;

       public boolean isMatch(String s, String p) {
           this.s = s;
           this.p = p;
           this.memo = new Boolean[s.length() + 1][p.length() + 1];
           return match(0, 0);
       }

       private boolean match(int i, int j) {
           if (memo[i][j] != null) {
               return memo[i][j];
           }

           boolean answer;
           if (j == p.length()) {
               answer = i == s.length();
           } else {
               boolean firstMatch = i < s.length() &&
                   (p.charAt(j) == s.charAt(i) || p.charAt(j) == '.');
               boolean hasStar = j + 1 < p.length() &&
                   p.charAt(j + 1) == '*';

               answer = hasStar
                   ? match(i, j + 2) || (firstMatch && match(i + 1, j))
                   : firstMatch && match(i + 1, j + 1);
           }

           memo[i][j] = answer;
           return answer;
       }
   }

Rust
^^^^

.. code-block:: rust

   impl Solution {
       pub fn is_match(s: String, p: String) -> bool {
           fn dfs(
               i: usize,
               j: usize,
               s: &[u8],
               p: &[u8],
               memo: &mut Vec<Vec<Option<bool>>>,
           ) -> bool {
               if let Some(value) = memo[i][j] {
                   return value;
               }

               let answer = if j == p.len() {
                   i == s.len()
               } else {
                   let first_match =
                       i < s.len() && (p[j] == s[i] || p[j] == b'.');
                   if j + 1 < p.len() && p[j + 1] == b'*' {
                       dfs(i, j + 2, s, p, memo) ||
                           (first_match && dfs(i + 1, j, s, p, memo))
                   } else {
                       first_match && dfs(i + 1, j + 1, s, p, memo)
                   }
               };

               memo[i][j] = Some(answer);
               answer
           }

           // 题目字符限定为 ASCII，按字节索引不会切开多字节字符。
           let s = s.as_bytes();
           let p = p.as_bytes();
           let mut memo = vec![vec![None; p.len() + 1]; s.len() + 1];
           dfs(0, 0, s, p, &mut memo)
       }
   }

Go
^^

.. code-block:: go

   func isMatch(s string, p string) bool {
       memo := make([][]int8, len(s)+1)
       for i := range memo {
           memo[i] = make([]int8, len(p)+1)
           for j := range memo[i] {
               memo[i][j] = -1
           }
       }

       var match func(int, int) bool
       match = func(i int, j int) bool {
           if memo[i][j] != -1 {
               return memo[i][j] == 1
           }

           var answer bool
           if j == len(p) {
               answer = i == len(s)
           } else {
               // 题目只含 ASCII 字符，字符串字节索引与字符位置一致。
               firstMatch := i < len(s) && (p[j] == s[i] || p[j] == '.')
               if j+1 < len(p) && p[j+1] == '*' {
                   answer = match(i, j+2) ||
                       (firstMatch && match(i+1, j))
               } else {
                   answer = firstMatch && match(i+1, j+1)
               }
           }

           if answer {
               memo[i][j] = 1
           } else {
               memo[i][j] = 0
           }
           return answer
       }

       return match(0, 0)
   }

TypeScript
^^^^^^^^^^

.. code-block:: typescript

   function isMatch(s: string, p: string): boolean {
       const memo: Array<Array<boolean | undefined>> = Array.from(
           { length: s.length + 1 },
           () => Array<boolean | undefined>(p.length + 1).fill(undefined),
       );

       const match = (i: number, j: number): boolean => {
           const cached = memo[i][j];
           if (cached !== undefined) {
               return cached;
           }

           let answer: boolean;
           if (j === p.length) {
               answer = i === s.length;
           } else {
               // 题目字符属于 ASCII；这里按 UTF-16 代码单元索引也保持一致。
               const firstMatch = i < s.length &&
                   (p[j] === s[i] || p[j] === ".");
               const hasStar = j + 1 < p.length && p[j + 1] === "*";
               answer = hasStar
                   ? match(i, j + 2) || (firstMatch && match(i + 1, j))
                   : firstMatch && match(i + 1, j + 1);
           }

           memo[i][j] = answer;
           return answer;
       };

       return match(0, 0);
   }

C#
^^

.. code-block:: csharp

   public class Solution {
       private string s = "";
       private string p = "";
       private bool?[,] memo = new bool?[0, 0];

       public bool IsMatch(string s, string p) {
           this.s = s;
           this.p = p;
           memo = new bool?[s.Length + 1, p.Length + 1];
           return Match(0, 0);
       }

       private bool Match(int i, int j) {
           if (memo[i, j].HasValue) {
               return memo[i, j]!.Value;
           }

           bool answer;
           if (j == p.Length) {
               answer = i == s.Length;
           } else {
               bool firstMatch = i < s.Length &&
                   (p[j] == s[i] || p[j] == '.');
               bool hasStar = j + 1 < p.Length && p[j + 1] == '*';
               answer = hasStar
                   ? Match(i, j + 2) || (firstMatch && Match(i + 1, j))
                   : firstMatch && Match(i + 1, j + 1);
           }

           memo[i, j] = answer;
           return answer;
       }
   }

Julia
^^^^^

.. code-block:: julia

   function is_match(s::String, p::String)::Bool
       # 题目限定 ASCII；collect 后使用 Julia 一基数组，状态 i、j 仍表示零基数量。
       text = collect(s)
       pattern = collect(p)
       memo = fill(Int8(-1), length(text) + 1, length(pattern) + 1)

       function match_suffix(i::Int, j::Int)::Bool
           cached = memo[i + 1, j + 1]
           cached != -1 && return cached == 1

           answer = if j == length(pattern)
               i == length(text)
           else
               first_match = i < length(text) &&
                   (pattern[j + 1] == text[i + 1] || pattern[j + 1] == '.')
               has_star = j + 1 < length(pattern) && pattern[j + 2] == '*'
               has_star ?
                   (match_suffix(i, j + 2) ||
                       (first_match && match_suffix(i + 1, j))) :
                   (first_match && match_suffix(i + 1, j + 1))
           end

           memo[i + 1, j + 1] = answer ? Int8(1) : Int8(0)
           answer
       end

       match_suffix(0, 0)
   end

R
^

.. code-block:: r

   isMatch <- function(s, p) {
       text <- strsplit(s, "", fixed = TRUE)[[1]]
       pattern <- strsplit(p, "", fixed = TRUE)[[1]]
       m <- length(text)
       n <- length(pattern)
       memo <- matrix(NA, nrow = m + 1, ncol = n + 1)

       match_suffix <- function(i, j) {
           # i、j 表示已消费数量；R 矩阵访问时转换为一基下标。
           cached <- memo[i + 1, j + 1]
           if (!is.na(cached)) {
               return(cached)
           }

           if (j == n) {
               answer <- i == m
           } else {
               first_match <- i < m &&
                   (pattern[j + 1] == text[i + 1] || pattern[j + 1] == ".")
               has_star <- j + 1 < n && pattern[j + 2] == "*"
               if (has_star) {
                   answer <- match_suffix(i, j + 2) ||
                       (first_match && match_suffix(i + 1, j))
               } else {
                   answer <- first_match && match_suffix(i + 1, j + 1)
               }
           }

           memo[i + 1, j + 1] <<- answer
           answer
       }

       match_suffix(0, 0)
   }

关键边界与易错点
----------------

* 模式耗尽时必须同时检查字符串是否耗尽，防止把前缀匹配误当完整匹配；
* 字符串耗尽时不能立即失败，剩余的 ``x*y*z*`` 可以全部选择零次；
* ``*`` 修饰前一个元素，判断位置是 ``p[j + 1]``，处理时必须整体跨过两格；
* 星号重复分支消费字符串后保留 ``j``，写成 ``j + 2`` 会退化成最多匹配一次；
* 重复分支必须受 ``first_match`` 约束，否则会在不匹配时错误消费字符；
* 不做记忆化会反复展开相同后缀，复杂度可能指数增长；
* 布尔记忆表需要区分“未计算”和 ``false``，因此使用三态值、可空布尔或 ``Option``；
* C 需要检查记忆表分配结果并释放内存；
* Rust 和 Go 按字节索引依赖题目 ASCII 约束；
* Julia 与 R 的状态坐标使用零基数量，数组访问时必须加一。

新增与强化知识
--------------

新增
~~~~

* **正则后缀状态**：用 ``(i, j)`` 表示字符串后缀与模式后缀的完整匹配关系；
* **星号二分语义**：零次跳过模式，多次分支消费字符并保留模式位置；
* **布尔三态记忆化**：明确区分未计算、失败和成功；
* **结构归纳证明**：按当前模式元素是否带 ``*`` 穷尽所有合法匹配结构。

强化
~~~~

* 0003 的字符串位置状态扩展为二维后缀状态；
* 0004 的边界哨兵思想在本题表现为允许 ``i == m``、``j == n`` 的额外状态行列；
* 记忆化搜索与动态规划共享同一状态转移，区别只在求值顺序。

关联题目
--------

* `0044. Wildcard Matching <0044-wildcard-matching.rst>`_：同样是二维字符串匹配动态规划，
  但通配符 ``*`` 自身匹配任意字符序列，语义不同；
* `0091. Decode Ways <0091-decode-ways.rst>`_：同样可用后缀状态和记忆化搜索消除重复子问题。

最小自检
--------

#. 为什么 ``match(i, j)`` 必须表示完整匹配两个后缀，而不能只记录当前字符是否相同？
#. ``x*`` 的零次分支与至少一次分支分别如何移动 ``i`` 和 ``j``？
#. 字符串已经耗尽时，为什么不能直接返回 ``false``？
#. 为什么星号重复分支必须递归到 ``match(i + 1, j)``？
#. 记忆化如何把朴素回溯的指数级搜索降为 ``O(mn)``？

答案要点
~~~~~~~~

#. 后续是否匹配取决于两个剩余位置；局部字符相同不足以决定完整结果；
#. 零次为 ``(i, j + 2)``，至少一次先要求当前位置匹配，再转到 ``(i + 1, j)``；
#. 剩余模式可能全部由可取零次的星号组构成；
#. 保留 ``j`` 才能继续使用同一个带星号元素，覆盖任意正次数；
#. ``i`` 有 ``m + 1`` 种、``j`` 有 ``n + 1`` 种，每个状态只展开一次。
