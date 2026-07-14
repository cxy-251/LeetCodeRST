0115. Distinct Subsequences
===========================

题目信息
--------

:题号: 0115
:难度: Hard
:主题: 字符串、动态规划、组合计数、滚动数组
:原题: `LeetCode 0115 <https://leetcode.com/problems/distinct-subsequences/>`_
:访问状态: Available
:教学重点: 前缀计数状态、使用或跳过、逆序覆盖、单调饱和计数

题目重述
--------

给定两个只包含小写英文字母的字符串 ``s`` 和 ``t``。每次可以从 ``s`` 中删除任意字符，
但不能改变剩余字符的相对顺序。返回能够得到 ``t`` 的不同删除方案数量。

平台输入中两个字符串长度都在 1 到 1000 之间。两个方案只要保留的 ``s`` 下标集合不同，
就视为不同方案；即使被选中的字符值完全相同，它们仍然来自不同位置。题目保证最终答案
能够放入 32 位有符号整数。

设 ``n = len(s)``、``m = len(t)``。若 ``m > n``，任何方案都不可能保留足够多的字符，
可以立即返回 0。函数只读两个输入字符串。

自建示例
--------

重复字符产生多个下标选择
~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: text

   s = "rabbbit"
   t = "rabbit"
   输出：3

三个 ``b`` 中需要保留两个。不同方案对应删除第一个、第二个或第三个 ``b``。

多个阶段都存在选择
~~~~~~~~~~~~~~~~~~

.. code-block:: text

   s = "babgbag"
   t = "bag"
   输出：5

相同目标字符可以由不同来源位置提供，后续字符仍必须位于已选位置之后。

组合数边界
~~~~~~~~~~

.. code-block:: text

   s = "aaaaa"
   t = "aa"
   输出：10

答案等于从 5 个位置中选择 2 个位置。该用例能暴露把相同字符位置错误合并的实现。

目标更长
~~~~~~~~

.. code-block:: text

   s = "abc"
   t = "abcd"
   输出：0

问题抽象
--------

删除字符等价于从 ``s`` 中按下标递增顺序选择一组位置。需要统计多少个下标序列：

.. code-block:: text

   0 <= i1 < i2 < ... < im < n

满足：

.. code-block:: text

   s[i1] s[i2] ... s[im] == t

当观察 ``s`` 的最后一个已处理字符时，所有方案可以按“是否使用它”分成两类：

* 不使用当前字符，方案数沿用更短的 ``s`` 前缀；
* 当前字符与目标末尾字符相同，并把它作为目标末尾，前面的方案来自两个更短前缀。

这两个集合按是否包含当前下标划分，互不重叠，因此计数可以直接相加。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 定位
   * - 一行前缀计数 DP
     - ``O(nm)``
     - ``O(m)``
     - 主解法；逆序覆盖保留上一行状态
   * - 完整二维 DP
     - ``O(nm)``
     - ``O(nm)``
     - 状态最直观，保存了不再使用的历史行
   * - 记忆化递归
     - ``O(nm)``
     - ``O(nm)`` 加递归栈
     - 与二维状态等价，深字符串依赖调用栈
   * - 枚举全部下标组合
     - 指数级
     - ``O(m)`` 路径
     - 大量重复搜索相同前缀状态

主解法：一行前缀计数 DP
-----------------------

二维状态定义
~~~~~~~~~~~~

先定义完整状态：

.. code-block:: text

   count(i, j) =
       使用 s 的前 i 个字符形成 t 的前 j 个字符的方案数

边界为：

.. code-block:: text

   count(i, 0) = 1
   count(0, j) = 0，j > 0

空目标前缀只有一种形成方式：不选择任何来源位置。空来源无法形成非空目标。

对 ``i > 0``、``j > 0``：

.. code-block:: text

   count(i, j) = count(i - 1, j)

   若 s[i - 1] == t[j - 1]：
       count(i, j) += count(i - 1, j - 1)

第一项跳过 ``s[i - 1]``。第二项使用该字符作为目标前缀的最后一个字符。

最后字符划分为什么完整
~~~~~~~~~~~~~~~~~~~~~~

任意形成 ``t[:j]`` 的方案，对来源位置 ``i - 1`` 只有两种可能：

#. 该位置不在选择集合中，方案已经包含在 ``count(i - 1, j)``；
#. 该位置被选择为最后一个位置，此时字符必须匹配，之前的选择恰好形成
   ``t[:j - 1]``，包含在 ``count(i - 1, j - 1)``。

两类方案一个不含位置 ``i - 1``，另一个必含该位置，所以不会重复。

压缩为一行
~~~~~~~~~~

处理完 ``s`` 的前 ``i`` 个字符后，令：

.. code-block:: text

   dp[j] = count(i, j)

进入下一轮来源字符前，``dp[j]`` 仍保存 ``count(i - 1, j)``。字符匹配时需要读取
``count(i - 1, j - 1)``，因此目标长度必须从大到小更新：

.. code-block:: text

   for j from min(i, m) down to 1:
       if s[i - 1] == t[j - 1]:
           dp[j] += dp[j - 1]

逆序更新时，``dp[j - 1]`` 还没有被当前来源字符修改，仍属于上一行。

为什么正序会重复使用同一字符
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

考虑 ``s = "a"``、``t = "aa"``。初始 ``dp = [1, 0, 0]``。

若从左到右更新，先得到 ``dp[1] = 1``，随后 ``dp[2]`` 又读取这个刚写入的 1，
等价于把唯一的来源字符同时用于目标的两个位置，错误得到 1。

从右到左更新时，``dp[2]`` 先读取旧的 ``dp[1] = 0``，因此保持 0；
随后才更新 ``dp[1]``。每个来源下标在一轮中最多使用一次。

只更新可达前缀
~~~~~~~~~~~~~~

处理 ``i`` 个来源字符时，不可能形成长度超过 ``i`` 的目标前缀，所以循环上界使用：

.. code-block:: text

   upper = min(i, m)

这不是正确性必需条件，但减少无意义状态访问，并明确表达“目标前缀不能比来源前缀更长”。

32 位答案与中间计数
~~~~~~~~~~~~~~~~~~~

题目只保证最终答案适合 32 位有符号整数。较短目标前缀的方案数可能比最终答案大，
甚至在最终答案为 0 时仍可能非常大。直接使用 32 位整数并不安全。

十语言统一使用饱和值：

.. code-block:: text

   LIMIT = 2^31
   stored = min(exact_count, LIMIT)

每次相加后把结果限制到 ``LIMIT``。由于所有状态只进行非负加法：

.. code-block:: text

   min(a + b, LIMIT)
   =
   min(min(a, LIMIT) + min(b, LIMIT), LIMIT)

因此每个槽位始终精确等于真实计数与 ``LIMIT`` 的较小值。最终真实答案小于
``LIMIT``，所以最终槽位没有被截断，返回值仍然完全精确。

该方法不依赖任意精度整数，也不会让短目标前缀的巨大计数溢出固定宽类型。

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

处理完来源前缀 ``s[:i]`` 后：

* ``dp[j]`` 等于 ``min(count(i, j), LIMIT)``；
* ``dp[0]`` 始终为 1；
* ``j > i`` 的状态保持 0；
* 当前轮从右向左更新，尚未访问的 ``dp[j - 1]`` 仍属于上一行；
* 输入字符串保持不变。

正确性依据
~~~~~~~~~~

**初始化。** 尚未处理来源字符时，空目标有一种方案，非空目标没有方案，
所以 ``dp[0] = 1``、其余槽位为 0。

**转移完整。** 对当前来源字符，所有方案按是否使用当前下标分成两个互斥集合。
跳过集合由旧 ``dp[j]`` 表示；字符匹配时，使用集合由旧 ``dp[j - 1]`` 表示。
两者相加得到完整计数。

**覆盖顺序。** 逆序更新保证 ``dp[j - 1]`` 尚未包含当前来源字符，
所以同一下标不会在一个方案中被重复使用。

**饱和状态。** 非负加法与 ``min(_, LIMIT)`` 满足上述等式，归纳可得每个槽位
都等于真实计数的饱和值。最终答案受题目保证小于 ``LIMIT``，因此最终结果未被截断。

**终止性。** 两层循环范围有限，每个可达状态只进行常数次操作。

复杂度与语言边界
~~~~~~~~~~~~~~~~

* 时间复杂度为 ``O(nm)``；
* DP 数组长度为 ``m + 1``，算法额外空间为 ``O(m)``；
* 标量返回值不产生输出容器；
* C 使用 ``int64_t`` 保存不超过 ``2 * LIMIT`` 的加法中间值；
* C++ 使用只读字符串引用，不产生签名级字符串副本；
* Python 任意精度整数仍按同一饱和语义执行，便于十语言一致验证；
* Rust、Go、Java、C# 和 Julia 使用显式 64 位计数；
* TypeScript ``number`` 对不超过 ``2^32`` 的中间值保持精确整数；
* 输入仅含 ASCII 小写字母，字节、UTF-16 代码单元和题目字符位置等价；
* Julia 的 ``codeunits`` 返回只读包装，不物化两个新字节数组；
* R 的 ``charToRaw`` 为两个输入物化 ``O(n + m)`` 原始字节，
  因此 R 的适配器额外空间为 ``O(n + m)``，再加 ``O(m)`` DP。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdint.h>
   #include <stdlib.h>
   #include <string.h>

   int numDistinct(char *s, char *t) {
       const size_t source_length = strlen(s);
       const size_t target_length = strlen(t);
       if (target_length > source_length) {
           return 0;
       }

       int64_t *dp = calloc(target_length + 1, sizeof(*dp));
       if (dp == NULL) {
           return 0;
       }

       const int64_t limit = INT64_C(1) << 31;
       dp[0] = 1;

       for (size_t i = 1; i <= source_length; ++i) {
           const size_t upper =
               i < target_length ? i : target_length;

           for (size_t j = upper; j > 0; --j) {
               if (s[i - 1] == t[j - 1]) {
                   const int64_t sum = dp[j] + dp[j - 1];
                   dp[j] = sum < limit ? sum : limit;
               }
           }
       }

       const int result = (int)dp[target_length];
       free(dp);
       return result;
   }

``calloc`` 失败时平台 ``int`` 接口无法区分资源失败与合法答案 0，代码按失败返回 0。
官方保证最终答案小于 ``limit``，因此最终窄化安全。

C++
~~~

.. code-block:: cpp

   #include <algorithm>
   #include <cstdint>
   #include <string>
   #include <vector>

   class Solution {
   public:
       int numDistinct(
           const std::string& s,
           const std::string& t
       ) {
           if (t.size() > s.size()) {
               return 0;
           }

           const std::int64_t limit =
               std::int64_t{1} << 31;

           std::vector<std::int64_t> dp(t.size() + 1, 0);
           dp[0] = 1;

           for (std::size_t i = 1; i <= s.size(); ++i) {
               const std::size_t upper = std::min(i, t.size());

               for (std::size_t j = upper; j > 0; --j) {
                   if (s[i - 1] == t[j - 1]) {
                       dp[j] = std::min(limit, dp[j] + dp[j - 1]);
                   }
               }
           }

           return static_cast<int>(dp[t.size()]);
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def numDistinct(self, s: str, t: str) -> int:
           if len(t) > len(s):
               return 0

           limit = 1 << 31
           dp = [0] * (len(t) + 1)
           dp[0] = 1

           for source_count, source_char in enumerate(s, start=1):
               upper = min(source_count, len(t))

               for target_count in range(upper, 0, -1):
                   if source_char == t[target_count - 1]:
                       dp[target_count] = min(
                           limit,
                           dp[target_count] + dp[target_count - 1],
                       )

           return dp[len(t)]

Java
~~~~

.. code-block:: java

   class Solution {
       public int numDistinct(String s, String t) {
           if (t.length() > s.length()) {
               return 0;
           }

           long[] dp = new long[t.length() + 1];
           dp[0] = 1L;
           long limit = (long) Integer.MAX_VALUE + 1L;

           for (int i = 1; i <= s.length(); i++) {
               int upper = Math.min(i, t.length());

               for (int j = upper; j >= 1; j--) {
                   if (s.charAt(i - 1) == t.charAt(j - 1)) {
                       dp[j] = Math.min(limit, dp[j] + dp[j - 1]);
                   }
               }
           }

           return (int) dp[t.length()];
       }
   }

``long`` 只保存饱和后的计数。这里不需要 ``BigInteger``；最终窄化由题目保证支持。

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn num_distinct(s: String, t: String) -> i32 {
           let source = s.as_bytes();
           let target = t.as_bytes();

           if target.len() > source.len() {
               return 0;
           }

           const LIMIT: i64 = i32::MAX as i64 + 1;
           let mut dp = vec![0_i64; target.len() + 1];
           dp[0] = 1;

           for (source_index, &source_byte) in source.iter().enumerate() {
               let upper = (source_index + 1).min(target.len());

               for target_count in (1..=upper).rev() {
                   if source_byte == target[target_count - 1] {
                       dp[target_count] = (
                           dp[target_count] + dp[target_count - 1]
                       ).min(LIMIT);
                   }
               }
           }

           dp[target.len()] as i32
       }
   }

Go
~~

.. code-block:: go

   func numDistinct(s string, t string) int {
       if len(t) > len(s) {
           return 0
       }

       const limit int64 = 1 << 31
       dp := make([]int64, len(t)+1)
       dp[0] = 1

       for i := 1; i <= len(s); i++ {
           upper := i
           if upper > len(t) {
               upper = len(t)
           }

           for j := upper; j >= 1; j-- {
               if s[i-1] == t[j-1] {
                   sum := dp[j] + dp[j-1]
                   if sum > limit {
                       sum = limit
                   }
                   dp[j] = sum
               }
           }
       }

       return int(dp[len(t)])
   }

Go 的字符串按字节索引；题目字符域是 ASCII 小写字母，因此一个字节就是一个题目字符。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function numDistinct(s: string, t: string): number {
       if (t.length > s.length) {
           return 0;
       }

       const limit = 2 ** 31;
       const dp: number[] = new Array(t.length + 1).fill(0);
       dp[0] = 1;

       for (let i = 1; i <= s.length; i += 1) {
           const upper = Math.min(i, t.length);

           for (let j = upper; j >= 1; j -= 1) {
               if (s.charCodeAt(i - 1) === t.charCodeAt(j - 1)) {
                   dp[j] = Math.min(limit, dp[j] + dp[j - 1]);
               }
           }
       }

       return dp[t.length];
   }

所有存储值不超过 ``2^31``，单次加法不超过 ``2^32``，远低于
``number`` 的安全整数上限。

C#
~~

.. code-block:: csharp

   public class Solution {
       public int NumDistinct(string s, string t) {
           if (t.Length > s.Length) {
               return 0;
           }

           const long Limit = (long)int.MaxValue + 1L;
           long[] dp = new long[t.Length + 1];
           dp[0] = 1L;

           for (int i = 1; i <= s.Length; i++) {
               int upper = System.Math.Min(i, t.Length);

               for (int j = upper; j >= 1; j--) {
                   if (s[i - 1] == t[j - 1]) {
                       dp[j] = System.Math.Min(
                           Limit,
                           dp[j] + dp[j - 1]
                       );
                   }
               }
           }

           return (int)dp[t.Length];
       }
   }

Julia
~~~~~

.. code-block:: julia

   function num_distinct(s::String, t::String)::Int
       source = codeunits(s)
       target = codeunits(t)

       length(target) > length(source) && return 0

       limit = Int64(1) << 31
       dp = zeros(Int64, length(target) + 1)
       dp[1] = 1

       for source_count in eachindex(source)
           upper = min(source_count, length(target))

           if upper >= 1
               for target_count in upper:-1:1
                   if source[source_count] == target[target_count]
                       slot = target_count + 1
                       dp[slot] = min(
                           limit,
                           dp[slot] + dp[slot - 1],
                       )
                   end
               end
           end
       end

       return Int(dp[length(target) + 1])
   end

DP 的零基 ``dp[j]`` 映射到 Julia 槽位 ``dp[j + 1]``。只有证明 ``upper >= 1``
后才构造显式负步长范围 ``upper:-1:1``。``codeunits`` 是只读包装，不复制字符串。

R
~

.. code-block:: r

   num_distinct <- function(s, t) {
     source <- charToRaw(s)
     target <- charToRaw(t)

     if (length(target) > length(source)) {
       return(0L)
     }

     limit <- 2^31
     dp <- numeric(length(target) + 1L)
     dp[[1L]] <- 1

     for (source_count in seq_along(source)) {
       upper <- min(source_count, length(target))

       if (upper >= 1L) {
         for (target_count in seq.int(upper, 1L, by = -1L)) {
           if (source[[source_count]] == target[[target_count]]) {
             slot <- target_count + 1L
             dp[[slot]] <- min(
               limit,
               dp[[slot]] + dp[[slot - 1L]]
             )
           }
         }
       }
     }

     as.integer(dp[[length(target) + 1L]])
   }

R 的 ``numeric`` 使用双精度数；不超过 ``2^32`` 的整数加法可以精确表示。
``charToRaw`` 物化两个 ASCII 字节向量，必须计入适配器成本。

验证计划与证据
--------------

* 固定用例覆盖普通重复字符、组合数、无匹配、目标更长和单字符；
* 小规模随机字符串使用枚举所有来源下标子集的独立基准对拍；
* 中等规模随机字符串使用完整二维任意精度 DP 作为独立基准；
* 专门构造“短目标前缀计数超过 32 位、最终答案为 0”的输入，
  验证饱和计数不会溢出且最终结果仍精确；
* 检查正序更新的反例 ``s = "a"``、``t = "aa"``；
* 调用前后比较字符串，确认输入未修改；
* C/C++ 使用严格警告、ASan 和 UBSan；
* Python、Java、Go、TypeScript 执行固定与随机用例；
* Rust、C#、Julia、R 缺少运行时时，只记录接口、范围、索引和类型静态检查。

关键边界
--------

* ``t`` 比 ``s`` 长时立即返回 0；
* 相同字符的不同来源下标代表不同方案；
* ``dp[0]`` 必须始终为 1；
* 一行 DP 必须从右向左更新；
* 最终答案适合 32 位不代表所有中间前缀计数都适合 32 位；
* 饱和值必须大于最大合法答案，本文使用 ``2^31``；
* ASCII 字符域允许按字节或 UTF-16 代码单元比较。

易错点
------

* 把相同字符位置去重，错误地按字符值而不是下标计数；
* 从左到右覆盖一行 DP，导致同一来源字符重复使用；
* 把 ``dp[0]`` 初始化为 0；
* 只用 32 位整数保存中间计数；
* 直接使用有限宽大整数，却没有证明中间状态不会溢出；
* 忽略 R 输入字节物化或把 Julia ``codeunits`` 错写成 ``O(n)`` 副本。

本题新增知识
------------

* 用“跳过当前来源字符”和“使用当前来源字符”划分组合计数；
* 一行计数 DP 的逆序覆盖规则；
* 最终答案有界时，使用单调饱和状态安全控制中间计数；
* 复杂度需要区分 DP 状态、字符串适配器和标量返回值。

本题强化知识
------------

* 前缀动态规划的边界初始化；
* ASCII 字符域下跨语言字符单位等价；
* 固定宽语言在危险运算前选择足够宽的中间类型。

关联题目
--------

* `0097. Interleaving String
  <../0001-0100/0097-interleaving-string.rst>`_：一行前缀 DP 与覆盖方向；
* `0072. Edit Distance
  <../0001-0100/0072-edit-distance.rst>`_：二维字符串前缀状态与空间压缩；
* `0112. Path Sum <0112-path-sum.rst>`_：标量答案与状态压缩的不同形式。

最小自检
--------

#. ``count(i, j)`` 的两个方案集合为什么互不重叠？
#. 为什么一行 DP 必须从右向左更新？
#. 最终答案适合 32 位，为什么仍不能直接让所有槽位使用 32 位整数？
#. ``min(_, 2^31)`` 为什么不会改变最终合法答案？
#. R 与 Julia 的字符串适配器空间成本有什么不同？

答案要点
~~~~~~~~

定义 ``dp[j]`` 为已处理来源前缀形成目标前 ``j`` 个字符的方案数。
当前字符可以被跳过；匹配时也可以作为目标末尾，因此执行
``dp[j] += dp[j - 1]``。目标下标逆序更新，避免同一来源字符在一轮中被复用。
所有计数饱和到 ``2^31``，最终受保证的 32 位答案仍精确。时间 ``O(nm)``，
DP 空间 ``O(m)``。
