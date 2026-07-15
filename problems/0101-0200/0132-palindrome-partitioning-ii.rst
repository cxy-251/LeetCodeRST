0132. Palindrome Partitioning II
================================

题目信息
--------

:题号: 0132
:难度: Hard
:主题: 字符串、区间动态规划、前缀最优值
:原题: `LeetCode 0132 <https://leetcode.com/problems/palindrome-partitioning-ii/>`_
:访问状态: Available
:教学重点: 最后一段分解、回文区间依赖、切割数与片段数转换

题目重述与精确契约
------------------

给定字符串 ``s``，在若干相邻字符之间切割，使得到的每个连续非空片段都是回文串。
返回完成这种分割所需的最少切割次数。

本文采用官方输入域与接口：

* ``1 <= len(s) <= 2000``；
* ``s`` 只包含小写英文字母，十语言按 ASCII 字节或等价代码单元比较时语义一致；
* 切割只能发生在相邻字符之间，片段按原顺序首尾相接并完整覆盖字符串；
* 若最优方案包含 ``k`` 个片段，返回值是 ``k - 1``，不是 ``k``；
* 返回值位于 ``[0, n - 1]``；整串已经是回文时返回 ``0``；
* 输入字符串只读，不需要返回具体切分方案，也不修改调用者可观察的数据。

官方输入不包含空串。本文实现依赖这一前提；若业务接口允许空串，应先明确它的返回约定并增加入口分支。

自建示例
--------

最后一段带来一次切割
~~~~~~~~~~~~~~~~~~~~

.. code-block:: text

   输入：s = "aab"
   最优分割："aa" | "b"
   输出：1

逐字符切分需要两刀，利用回文前缀 ``"aa"`` 后只需一刀。

整串回文
~~~~~~~~

.. code-block:: text

   输入：s = "abba"
   最优分割："abba"
   输出：0

不能把一个片段误计为一次切割。

最优方案包含内部长回文
~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: text

   输入：s = "abccbc"
   最优分割："a" | "bccb" | "c"
   输出：2

只看相邻相等字符会得到局部信息；全局最优需要比较所有可能的最后回文片段。

问题抽象
--------

仍把位置 ``0, 1, ..., n`` 看成顶点。若 ``s[start..end]`` 是回文，就有边
``start -> end + 1``。题目等价于求从 ``0`` 到 ``n`` 的最少边数，再减一得到切割次数。

直接枚举 0131 的全部路径再取最短，会生成指数级方案。这里只需要最优值，因此可以按前缀终点做动态规划：
任意前缀的最后一个片段一定是某个 ``s[start..end]``。枚举这个最后片段的起点，
就把全局问题拆成“更短前缀的最优值 + 最后一刀”。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 定位
   * - 枚举全部回文分割后取最小
     - 最坏指数级
     - 由搜索树与输出决定
     - 计算了题目不要求的全部方案
   * - 逐个前缀反复扫描子串判断回文
     - 最坏 ``O(n^3)``
     - ``O(n)``
     - 相同区间被重复检查
   * - 回文区间表 + 前缀最优 DP
     - ``Theta(n^2)``
     - ``Theta(n^2)``
     - 主解法；依赖关系直接、验证稳定

主解法保留二维回文表。虽然还存在更复杂的空间优化技巧，但在 ``n <= 2000`` 的官方范围内，
二维状态能清楚证明“哪些最后片段可用”，并避免把优化后的更新顺序写错。

主解法：按最后一个回文片段转移
--------------------------------

回文区间状态
~~~~~~~~~~~~

定义 ``pal[start][end]`` 表示闭区间 ``s[start..end]`` 是否为回文：

.. code-block:: text

   pal[start][end] =
       s[start] == s[end]
       and (
           end - start <= 1
           or pal[start + 1][end - 1]
       )

外层按 ``end = 0..n-1`` 增加，内层按 ``start = end..0`` 减少。
长区间依赖的内部状态右端是 ``end - 1``，已在更早的外层迭代完成。
短区间分支使用短路求值，不读取不存在的内部槽位。

前缀最优状态
~~~~~~~~~~~~

定义 ``cuts[end]`` 为前缀 ``s[0..end]`` 的最少切割次数。
在处理 ``end`` 前先令

.. code-block:: text

   cuts[end] = end

这对应每个字符独立成段，共 ``end + 1`` 个片段和 ``end`` 刀，是始终合法的上界。

对每个满足 ``pal[start][end]`` 的起点：

.. code-block:: text

   start == 0  -> candidate = 0
   start > 0   -> candidate = cuts[start - 1] + 1

第一种情况说明整个前缀本身是回文，不需要切割；第二种情况把最优前缀
``s[0..start-1]`` 与最后回文片段 ``s[start..end]`` 用一刀连接。所有候选取最小值。

循环不变量
~~~~~~~~~~

每次开始处理外层终点 ``end`` 时：

* 所有右端小于 ``end`` 的 ``pal`` 状态已经准确；
* ``cuts[0..end-1]`` 已经分别是对应前缀的全局最少切割数；
* ``cuts[end] = end`` 是当前前缀的合法上界；
* 内层处理完起点 ``start`` 后，``cuts[end]`` 是已检查的所有最后回文片段候选中的最小值；
* ``pal`` 和 ``cuts`` 都是新建工作状态，输入 ``s`` 保持只读。

正确性证明
----------

引理一：回文表正确
~~~~~~~~~~~~~~~~~~

对区间长度归纳。长度一总是回文；长度二当且仅当两端字符相等。
长度至少三时，按回文定义，当前区间是回文当且仅当两端相等且内部区间是回文。
内部区间更短、右端更小，已经由外层顺序正确计算，所以转移得到当前区间的真实值。

引理二：每个转移候选都可行
~~~~~~~~~~~~~~~~~~~~~~~~~~

若 ``start == 0`` 且 ``pal[0][end]`` 为真，整个前缀是一个回文片段，候选 ``0`` 可行。
若 ``start > 0``，归纳假设保证 ``cuts[start - 1]`` 对应一个合法的最优前缀分割；
再切一刀并接上回文片段 ``s[start..end]``，得到候选
``cuts[start - 1] + 1`` 的合法完整分割。因此算法不会用不可行值降低答案。

引理三：算法不会错过最优值
~~~~~~~~~~~~~~~~~~~~~~~~~~

任取 ``s[0..end]`` 的一个最优分割，设最后片段从 ``start`` 开始。最后片段必须是回文，
所以算法一定枚举到该 ``start``。若 ``start == 0``，最优值只能是 ``0``；否则前面部分若不是
``s[0..start-1]`` 的最优分割，就能用更优前缀替换它并减少总刀数，与原方案最优矛盾。
因此该最优方案的值恰好出现在算法候选中。

定理：``cuts[end]`` 是前缀最优值
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

由引理二，取最小后的 ``cuts[end]`` 不低于任何不可行值；由引理三，全局最优候选一定被枚举，
所以它也不会高于全局最优值。两边合并，``cuts[end]`` 恰为前缀最少切割数。
按 ``end`` 归纳到 ``n - 1``，返回值就是整串答案。

终止性与副作用
~~~~~~~~~~~~~~

两个循环分别遍历有限的 ``n`` 个终点和至多 ``n`` 个起点，没有递归。
所有读取都在短路条件保护或有效下标范围内；算法只写新建表和数组，不修改输入字符串。

复杂度与语言成本
----------------

共有 ``n(n + 1) / 2`` 个有效闭区间。每个区间只做常数次比较、表读取和最优值更新，因此：

* 时间复杂度为 ``Theta(n^2)``；
* 回文表核心空间为 ``Theta(n^2)``，``cuts`` 为 ``Theta(n)``；
* 没有递归栈，返回值是一个整数，返回载荷 ``Theta(1)``；
* 峰值核心空间仍为 ``Theta(n^2)``。

语言适配成本需要单独说明：

* C 使用一块扁平 ``bool`` 表和一块 ``int`` 数组，并检查容量乘法与分配失败；
* C++ 的平台签名按值接收字符串，调用边界可能额外复制 ``Theta(n)`` 字符；
* Rust 消费 ``String`` 后只借用其字节，不再复制；Go 同样直接读取不可变字符串字节；
* Python、Java、TypeScript 与 C# 直接按各自索引单位读取原字符串，不额外物化字符数组；
* Julia 的 ``codeunits(s)`` 是 ``O(1)`` 的 ``CodeUnits`` 包装；
* R 的 ``strsplit`` 先物化 ``Theta(n)`` 字符向量，之后才执行二维 DP；
* 这些线性输入适配成本不会改变 ``Theta(n^2)`` 峰值阶，但不能被描述成“所有语言都没有输入物化”。

核心语言实现
------------

C
~

平台签名没有独立错误通道。代码用官方答案域之外的 ``-1`` 表示防御性长度或分配失败；
在线评测的合法输入与正常资源条件下只会返回 ``[0, n - 1]``。生产接口应改用状态码或输出参数，
而不是把失败伪装成合法答案 ``0``。

.. code-block:: c

   #include <stdbool.h>
   #include <stddef.h>
   #include <stdint.h>
   #include <stdlib.h>
   #include <string.h>

   int minCut(char *s) {
       size_t n_size = strlen(s);
       if (n_size == 0U || n_size > 2000U) {
           return -1;
       }
       if (
           n_size > SIZE_MAX / n_size ||
           n_size > SIZE_MAX / sizeof(int)
       ) {
           return -1;
       }

       size_t cell_count = n_size * n_size;
       if (cell_count > SIZE_MAX / sizeof(bool)) {
           return -1;
       }

       bool *palindrome =
           calloc(cell_count, sizeof(*palindrome));
       int *cuts = malloc(n_size * sizeof(*cuts));
       if (palindrome == NULL || cuts == NULL) {
           free(palindrome);
           free(cuts);
           return -1;
       }

       int n = (int)n_size;
       for (int end = 0; end < n; ++end) {
           cuts[end] = end;
           for (int start = end; start >= 0; --start) {
               bool inside = end - start <= 1 ||
                   palindrome[
                       (size_t)(start + 1) * n_size +
                       (size_t)(end - 1)
                   ];
               if (s[start] == s[end] && inside) {
                   palindrome[
                       (size_t)start * n_size + (size_t)end
                   ] = true;
                   int candidate = start == 0
                       ? 0
                       : cuts[start - 1] + 1;
                   if (candidate < cuts[end]) {
                       cuts[end] = candidate;
                   }
               }
           }
       }

       int answer = cuts[n - 1];
       free(palindrome);
       free(cuts);
       return answer;
   }

C++
~~~

代码以 C++17 为目标，显式使用 ``unsigned char`` 保存二维布尔状态，避免
``std::vector<bool>`` 的代理引用语义影响讲解。

.. code-block:: cpp

   #include <algorithm>
   #include <string>
   #include <vector>

   class Solution {
   public:
       int minCut(std::string s) {
           const int n = static_cast<int>(s.size());
           std::vector<std::vector<unsigned char>> palindrome(
               n,
               std::vector<unsigned char>(n, 0U)
           );
           std::vector<int> cuts(n, 0);

           for (int end = 0; end < n; ++end) {
               cuts[end] = end;
               for (int start = end; start >= 0; --start) {
                   const bool inside =
                       end - start <= 1 ||
                       palindrome[start + 1][end - 1] != 0U;
                   if (s[start] == s[end] && inside) {
                       palindrome[start][end] = 1U;
                       const int candidate = start == 0
                           ? 0
                           : cuts[start - 1] + 1;
                       cuts[end] = std::min(
                           cuts[end],
                           candidate
                       );
                   }
               }
           }
           return cuts[n - 1];
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def minCut(self, s: str) -> int:
           n = len(s)
           palindrome = [[False] * n for _ in range(n)]
           cuts = list(range(n))

           for end in range(n):
               for start in range(end, -1, -1):
                   inside = (
                       end - start <= 1
                       or palindrome[start + 1][end - 1]
                   )
                   if s[start] == s[end] and inside:
                       palindrome[start][end] = True
                       candidate = (
                           0
                           if start == 0
                           else cuts[start - 1] + 1
                       )
                       cuts[end] = min(cuts[end], candidate)

           return cuts[n - 1]

Java
~~~~

.. code-block:: java

   class Solution {
       public int minCut(String s) {
           int n = s.length();
           boolean[][] palindrome = new boolean[n][n];
           int[] cuts = new int[n];

           for (int end = 0; end < n; ++end) {
               cuts[end] = end;
               for (int start = end; start >= 0; --start) {
                   boolean inside =
                       end - start <= 1 ||
                       palindrome[start + 1][end - 1];
                   if (
                       s.charAt(start) == s.charAt(end) &&
                       inside
                   ) {
                       palindrome[start][end] = true;
                       int candidate = start == 0
                           ? 0
                           : cuts[start - 1] + 1;
                       cuts[end] = Math.min(cuts[end], candidate);
                   }
               }
           }
           return cuts[n - 1];
       }
   }

Rust
~~~~

Rust 消费平台传入的 ``String``，并在函数内部借用 ASCII 字节；不克隆输入载荷。

.. code-block:: rust

   impl Solution {
       pub fn min_cut(s: String) -> i32 {
           let bytes = s.as_bytes();
           let n = bytes.len();
           let mut palindrome = vec![vec![false; n]; n];
           let mut cuts: Vec<usize> = (0..n).collect();

           for end in 0..n {
               for start in (0..=end).rev() {
                   let inside =
                       end - start <= 1 ||
                       palindrome[start + 1][end - 1];
                   if bytes[start] == bytes[end] && inside {
                       palindrome[start][end] = true;
                       let candidate = if start == 0 {
                           0
                       } else {
                           cuts[start - 1] + 1
                       };
                       cuts[end] = cuts[end].min(candidate);
                   }
               }
           }
           cuts[n - 1] as i32
       }
   }

Go
~~

.. code-block:: go

   func minCut(s string) int {
       n := len(s)
       palindrome := make([][]bool, n)
       cuts := make([]int, n)
       for index := range palindrome {
           palindrome[index] = make([]bool, n)
       }

       for end := 0; end < n; end++ {
           cuts[end] = end
           for start := end; start >= 0; start-- {
               inside := end-start <= 1 ||
                   palindrome[start+1][end-1]
               if s[start] == s[end] && inside {
                   palindrome[start][end] = true
                   candidate := 0
                   if start > 0 {
                       candidate = cuts[start-1] + 1
                   }
                   if candidate < cuts[end] {
                       cuts[end] = candidate
                   }
               }
           }
       }
       return cuts[n-1]
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function minCut(s: string): number {
       const n = s.length;
       const palindrome = Array.from(
           { length: n },
           () => Array<boolean>(n).fill(false),
       );
       const cuts = Array.from(
           { length: n },
           (_, index) => index,
       );

       for (let end = 0; end < n; end++) {
           for (let start = end; start >= 0; start--) {
               const inside =
                   end - start <= 1 ||
                   palindrome[start + 1][end - 1];
               if (s[start] === s[end] && inside) {
                   palindrome[start][end] = true;
                   const candidate =
                       start === 0
                           ? 0
                           : cuts[start - 1] + 1;
                   cuts[end] = Math.min(
                       cuts[end],
                       candidate,
                   );
               }
           }
       }
       return cuts[n - 1];
   }

C#
~~

.. code-block:: csharp

   using System;

   public class Solution {
       public int MinCut(string s) {
           int n = s.Length;
           bool[,] palindrome = new bool[n, n];
           int[] cuts = new int[n];

           for (int end = 0; end < n; ++end) {
               cuts[end] = end;
               for (int start = end; start >= 0; --start) {
                   bool inside =
                       end - start <= 1 ||
                       palindrome[start + 1, end - 1];
                   if (s[start] == s[end] && inside) {
                       palindrome[start, end] = true;
                       int candidate = start == 0
                           ? 0
                           : cuts[start - 1] + 1;
                       cuts[end] = Math.Min(
                           cuts[end],
                           candidate
                       );
                   }
               }
           }
           return cuts[n - 1];
       }
   }

Julia
~~~~~

Julia 的算法坐标在正文中从零开始，数组槽位在代码中从一开始。
``last`` 对应 ``end + 1``，``first`` 对应 ``start + 1``。

.. code-block:: julia

   function min_cut(s::String)::Int
       bytes = codeunits(s)
       n = length(bytes)
       palindrome = falses(n, n)
       cuts = collect(0:n-1)

       for last in 1:n
           for first in last:-1:1
               inside =
                   last - first <= 1 ||
                   palindrome[first + 1, last - 1]
               if bytes[first] == bytes[last] && inside
                   palindrome[first, last] = true
                   candidate = first == 1
                       ? 0
                       : cuts[first - 1] + 1
                   cuts[last] = min(cuts[last], candidate)
               end
           end
       end
       return cuts[n]
   end

R
~

R 显式使用方向为负的 ``seq.int(last, 1L, by = -1L)``，不依赖 ``a:b`` 模拟 C 风格递减循环。

.. code-block:: r

   min_cut <- function(s) {
     chars <- strsplit(s, "", fixed = TRUE)[[1L]]
     n <- length(chars)
     palindrome <- matrix(FALSE, nrow = n, ncol = n)
     cuts <- seq.int(0L, n - 1L)

     for (last in seq_len(n)) {
       for (first in seq.int(last, 1L, by = -1L)) {
         inside <- last - first <= 1L ||
           palindrome[first + 1L, last - 1L]
         if (chars[[first]] == chars[[last]] && inside) {
           palindrome[first, last] <- TRUE
           candidate <- if (first == 1L) {
             0L
           } else {
             cuts[[first - 1L]] + 1L
           }
           cuts[[last]] <- min(cuts[[last]], candidate)
         }
       }
     }
     cuts[[n]]
   }

关键边界与易错点
----------------

* ``n = 1`` 时初始化 ``cuts[0] = 0``，返回零刀；
* 整串回文时，``start == 0`` 的候选必须直接是 ``0``，不能写成不存在的前缀状态加一；
* ``cuts[end]`` 的安全初值是 ``end``，因为 ``end + 1`` 个单字符片段只需 ``end`` 刀；
* 返回的是切割次数，不是片段数量；三个片段对应两刀；
* 回文转移的短区间分支必须先判断并短路，避免访问 ``start + 1, end - 1`` 的越界槽位；
* 处理 ``end`` 时只能读取已经最终确定的 ``cuts[start - 1]``，因此外层顺序不能随意改成从右向左；
* 只选择当前最长回文前缀或后缀没有全局最优保证；必须比较全部最后回文片段；
* C 的资源失败不能返回合法答案 ``0`` 冒充成功，当前防御性 ``-1`` 也只是平台签名受限下的约定；
* Julia 与 R 的一基槽位要和正文零基区间逐项对应，不能只把所有下标机械加一。

验证证据
--------

本次返工使用“枚举全部切点集合，只保留全为回文的方案，再取最少切点数”作为独立基准：

* Python 实际运行 ``"a"``、``"aab"``、``"abba"``、``"abc"``、``"abccbc"`` 和
  ``"ababbbabbababa"`` 六个固定案例，期望分别为 ``0, 1, 0, 2, 2, 3``；
* Python 使用固定随机种子生成 2,000 个长度 ``1`` 至 ``12``、字母表 ``{a,b,c}`` 的字符串，
  与独立切点枚举基准逐个对拍，结果全部一致；
* C++ 主实现以 ``-std=c++17 -Wall -Wextra -Wpedantic -Werror`` 编译，并运行代表案例；
* C 主实现以 C11 严格警告编译，运行代表案例，并通过 AddressSanitizer 与
  UndefinedBehaviorSanitizer；
* Java、Rust、Go、TypeScript、C#、Julia、R 完成接口、索引、短路求值、
  数值范围、输入物化和明显语法的静态检查；未宣称这些语言已经实际运行；
* 确认本题只有一个自包含 RST，包含十个语言代码块，不含外部 include 指令，
  且目录中不存在同题 ``.inc`` 分片。

知识更新
--------

``algorithm.palindrome_min_cut_prefix_dp``
   以最后一个回文片段为分界，把整串最优值转化为更短前缀最优值加一。

``proof.last_palindrome_segment_decomposition``
   任意分割都有唯一最后片段；最优方案的前缀也必须最优，否则可替换出更少切割的方案。

``boundary.cut_count_not_partition_count``
   ``k`` 个片段需要 ``k - 1`` 刀；整串回文是一个片段，因此答案为零。

本题再次强化 ``algorithm.palindrome_interval_dp``：同一回文表既能支撑 0131 的路径枚举，
也能支撑本题的前缀最优化。

关联题目
--------

* `0005. Longest Palindromic Substring
  <../0001-0100/0005-longest-palindromic-substring.rst>`_：选择一个最长回文区间，不涉及切分组合；
* `0115. Distinct Subsequences <0115-distinct-subsequences.rst>`_：
  同样要求先定义前缀 DP 的精确语义和合法更新顺序；
* `0131. Palindrome Partitioning <0131-palindrome-partitioning.rst>`_：
  返回全部回文分割；本题只保留最优前缀值，避免指数级枚举。

最小自检
--------

#. 为什么最优分割的最后片段足以建立完整转移？
#. 为什么 ``cuts[end]`` 初始化为 ``end`` 而不是 ``end + 1``？
#. 为什么 ``start == 0`` 时不能使用 ``cuts[start - 1] + 1``？
#. 外层 ``end`` 从左向右如何同时保证回文状态和前缀最优状态已经可用？

答案要点
~~~~~~~~

#. 最后片段必为某个 ``s[start..end]`` 回文；枚举其起点覆盖所有方案，前部只需保留最优值。
#. ``end + 1`` 个单字符片段之间只有 ``end`` 个间隙，所以最多切 ``end`` 刀。
#. 此时没有前缀，也没有连接最后片段的切口；整个前缀本身是回文，候选直接为零。
#. 内部回文的右端是 ``end - 1``，前缀状态下标是 ``start - 1 < end``，二者都已在早期外层迭代完成。
