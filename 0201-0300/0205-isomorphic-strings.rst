0205. Isomorphic Strings
========================

题目信息
--------

:题号: 0205
:难度: Easy
:主题: 字符串、双向映射、双射
:原题: `LeetCode 0205 <https://leetcode.com/problems/isomorphic-strings/>`_
:重点: 同一源字符映射一致、不同源字符不能共享目标、字符可映射自身、位置模式

题目重述
--------

给定两个等长字符串 ``s`` 和 ``t``，判断能否把 ``s`` 中的每一种字符统一替换成某个字符，使替换后的字符串恰好等于 ``t``。同一个源字符在所有出现位置必须始终映射到同一个目标字符；两个不同源字符不能映射到同一个目标字符；字符允许映射到自身。

两个字符串长度均位于 ``[1, 5 * 10^4]``，并由有效 ASCII 字符组成。判断依据是对应位置形成的字符模式，而不是字符频次或字典序。函数只返回布尔值，不修改输入字符串。

自建示例
--------

重复位置模式一致：

.. code-block:: text

   输入：s = "noon"，t = "peep"
   输出：true
   解释：n 始终映射到 p，o 始终映射到 e；两个源字符对应两个不同目标字符，因此映射合法。

目标字符被两个来源占用：

.. code-block:: text

   输入：s = "abca"，t = "xyyx"
   输出：false
   解释：a 始终对应 x，但 b 和 c 都试图映射到 y，违反不同源字符不能共享同一目标字符的要求。

问题抽象与解法选择
------------------

逐位置扫描 ``(s[i], t[i])``。需要同时维护两个方向：

.. code-block:: text

   forward[source] = target
   reverse[target] = source

遇到一对 ``source, target`` 时：

#. 若 ``source`` 已在 ``forward`` 中，它的既有目标必须等于 ``target``；
#. 若 ``target`` 已在 ``reverse`` 中，它的既有来源必须等于 ``source``；
#. 两个方向都未登记时，同时建立两条对应关系；
#. 任何方向冲突都立即返回 ``false``。

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 取舍
   * - 双向映射
     - ``O(n)``
     - ``O(k)``
     - 主解法；直接表达函数一致性与目标唯一性
   * - 两字符串首次出现位置签名
     - ``O(n)``
     - ``O(k)``
     - 同样正确，但证明依赖签名相等
   * - 只维护 ``s -> t``
     - ``O(n)``
     - ``O(k)``
     - 错误；不能阻止两个源字符占用同一目标
   * - 枚举所有可能替换
     - 指数级
     - 至少 ``O(k)``
     - 完全没有必要

这里 ``n`` 是扫描的字符单位数，``k`` 是出现过的不同字符单位数；固定 ASCII 表实现
可视为 ``O(1)`` 映射空间。

状态与核心不变量
----------------

扫描到位置 ``i`` 之前，已经处理前缀 ``[0,i)``。维护：

* ``forward``：已出现源字符到唯一目标字符的映射；
* ``reverse``：已出现目标字符到唯一源字符的映射；
* 两张表记录的是同一组配对的两个方向。

循环开始时保持：

#. 对所有 ``j<i``，``forward[s[j]] = t[j]``；
#. 对所有 ``j<i``，``reverse[t[j]] = s[j]``；
#. ``forward`` 是函数：一个源字符至多对应一个目标字符；
#. ``reverse`` 是函数：一个目标字符至多对应一个源字符；
#. 两表互为逆关系，因此已登记配对构成双射；
#. 输入前缀之外的位置尚未影响映射，输入字符串没有被修改。

处理新位置
~~~~~~~~~~

设 ``a=s[i]``、``b=t[i]``。

* 若 ``a`` 已登记且 ``forward[a] != b``，同一源字符要求两个目标，返回 ``false``；
* 若 ``b`` 已登记且 ``reverse[b] != a``，两个源字符要求同一目标，返回 ``false``；
* 若没有冲突，令 ``forward[a]=b``、``reverse[b]=a``。重复写入相同配对不改变状态，
  新配对则同时扩展两个方向。

为什么两个方向缺一不可
~~~~~~~~~~~~~~~~~~~~~~

单向映射只能保证“相同源字符映射一致”，不能保证“不同源字符映射不同”。例如 ``ab`` 与 ``aa``：

.. code-block:: text

   forward[a] = a
   forward[b] = a

单向表没有冲突，但目标 ``a`` 被两个来源占用。反向表在处理第二个位置时发现
``reverse[a]`` 已是源字符 ``a``，从而正确拒绝。

正确性证明
----------

引理一：算法不返回失败时，已处理前缀的每个位置都满足映射
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

对位置数归纳。空前缀没有约束，结论成立。假设处理位置 ``i`` 前结论成立。若已有
配对，两个方向的检查保证它恰好是 ``a <-> b``；若是新配对，算法同时登记
``a -> b`` 与 ``b -> a``。因此位置 ``i`` 也满足映射，归纳成立。

引理二：算法维护的 forward 始终是函数
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

某源字符第一次出现时至多登记一个目标。以后再次出现时，只有目标与既有值相同才
继续；不同则立即失败。因此任何继续执行的状态中，一个源字符至多对应一个目标字符。

引理三：算法维护的 forward 始终是单射
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

假设两个不同源字符 ``a1`` 与 ``a2`` 试图映射到同一目标 ``b``。第一个配对建立时，
``reverse[b]`` 被登记为其来源。第二个配对到来时，反向检查发现既有来源与当前来源
不同并返回失败。因此继续执行的状态中，不同源字符不会共享目标，``forward`` 是单射。

引理四：算法返回 true 时存在满足契约的双射
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

扫描结束且没有失败时，由引理一，每个位置满足 ``forward[s[i]]=t[i]``；由引理二，
``forward`` 是函数；由引理三，它对实际出现的源字符是单射。每个实际出现的目标字符
都来自某个位置，因此也是某个源字符的像，映射对出现字符集合满射。有限集合上的
单射加满射构成双射，所以字符串同构。

引理五：算法返回 false 时不存在满足契约的双射
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

失败只有两种情况。第一种是同一源字符在两个位置对应不同目标，任何函数都无法同时
满足；第二种是同一目标字符在两个位置对应不同源字符，任何单射都无法同时满足。
两种冲突都违反双射必要条件，因此不存在合法映射。

定理：算法当且仅当两个字符串同构时返回 true
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

由引理四，返回 ``true`` 一定同构；由引理五，返回 ``false`` 一定不同构。两种方向合并得到充要性。

终止性
~~~~~~

长度不同在扫描前结束。长度相同时，循环每轮处理一个新位置，最多执行 ``n`` 轮；
没有递归或状态回退，因此必然终止。

人工状态推演
------------

``egg`` 与 ``add``
~~~~~~~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 位置
     - 字符对
     - ``forward`` 新状态
     - ``reverse`` 新状态
   * - 0
     - ``e,a``
     - ``e->a``
     - ``a->e``
   * - 1
     - ``g,d``
     - 加入 ``g->d``
     - 加入 ``d->g``
   * - 2
     - ``g,d``
     - 既有配对一致
     - 既有配对一致

扫描结束返回 ``true``。

``foo`` 与 ``bar``
~~~~~~~~~~~~~~~~~~

位置 0 建立 ``f<->b``，位置 1 建立 ``o<->a``。位置 2 再遇 ``o``，目标却是
``r``，与 ``forward[o]=a`` 冲突，返回 ``false``。

``badc`` 与 ``baba``
~~~~~~~~~~~~~~~~~~~~

前两位建立 ``b<->b``、``a<->a``。位置 2 的字符对是 ``d,b``；源 ``d`` 尚未登记，
但目标 ``b`` 已由源 ``b`` 占用，反向检查失败。

复杂度与语言成本
----------------

* 扫描每个字符单位一次，平均哈希查询或固定表查询为常数，时间复杂度 ``O(n)``；
* 哈希映射最多保存 ``k`` 个不同字符，空间 ``O(k)``；ASCII 固定表大小 256，渐近上是 ``O(1)``；
* C、C++、Rust 和 Go 使用 256 项字节映射表，不物化输入；
* Python 使用两个字典，键是 Python Unicode 字符；按字符串迭代产生码点级字符对象引用；
* Java 使用 ``HashMap<Character,Character>``，按 UTF-16 ``char`` 单元扫描；官方 ASCII
  输入不会遇到代理对差异；
* TypeScript 与 C# 使用长度 65536 的整型表，按 UTF-16 代码单元扫描，固定占用约 ``O(65536)``；
* Julia 的 ``collect`` 把两个字符串物化为 ``Vector{Char}``，适配器额外空间 ``O(n)``，
  映射另占 ``O(k)``；
* R 的 ``utf8ToInt`` 把两个字符串物化为 Unicode 码点整数向量，适配器额外空间
  ``O(n)``，两个环境保存 ``O(k)`` 键；
* 所有实现都只读输入，返回单个布尔值，没有与 ``n`` 同阶的输出载荷。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       bool isIsomorphic(std::string s, std::string t) {
           if (s.size() != t.size()) return false;

           std::array<int, 256> forward;
           std::array<int, 256> reverse;
           forward.fill(-1);
           reverse.fill(-1);

           for (std::size_t i = 0; i < s.size(); ++i) {
               unsigned char source = static_cast<unsigned char>(s[i]);
               unsigned char target = static_cast<unsigned char>(t[i]);
               if ((forward[source] != -1 && forward[source] != target) ||
                   (reverse[target] != -1 && reverse[target] != source)) {
                   return false;
               }
               forward[source] = target;
               reverse[target] = source;
           }
           return true;
       }
   };

代码分析
--------

同构要求源字符到目标字符是函数，同时目标字符不能被两个不同源字符复用，所以只维护单向映射会漏掉冲突。``forward`` 检查“同一个源是否总映射到同一个目标”，``reverse`` 检查“同一个目标是否已经被另一个源占用”；两张表在每一对位置上同步更新，正好维护了双射不变量。

例如 ``s = "egg"``、``t = "add"`` 时，``e -> a``、``g -> d`` 且反向映射无冲突，返回真；``s = "ab"``、``t = "cc"`` 时，第二个源 ``b`` 试图再次映射到已被 ``a`` 占用的 ``c``，反向表立即拒绝。输入按 ASCII 字符处理，表大小固定为 256；每个位置只检查和更新常数项，时间复杂度为 ``O(n)``，额外空间复杂度为 ``O(1)``。

十语言实现
----------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stddef.h>

   bool isIsomorphic(char *s, char *t) {
       int forward[256];
       int reverse[256];
       for (int i = 0; i < 256; ++i) {
           forward[i] = -1;
           reverse[i] = -1;
       }

       size_t index = 0;
       while (s[index] != '\0' && t[index] != '\0') {
           unsigned char source = (unsigned char)s[index];
           unsigned char target = (unsigned char)t[index];

           if (forward[source] != -1 &&
               forward[source] != (int)target) {
               return false;
           }
           if (reverse[target] != -1 &&
               reverse[target] != (int)source) {
               return false;
           }

           forward[source] = (int)target;
           reverse[target] = (int)source;
           ++index;
       }

       return s[index] == '\0' && t[index] == '\0';
   }

C++
~~~

.. code-block:: cpp

   #include <array>
   #include <cstddef>
   #include <string>

   class Solution {
   public:
       bool isIsomorphic(const std::string& s, const std::string& t) {
           if (s.size() != t.size()) {
               return false;
           }

           std::array<int, 256> forward{};
           std::array<int, 256> reverse{};
           forward.fill(-1);
           reverse.fill(-1);

           for (std::size_t i = 0; i < s.size(); ++i) {
               unsigned char source =
                   static_cast<unsigned char>(s[i]);
               unsigned char target =
                   static_cast<unsigned char>(t[i]);

               if (forward[source] != -1 &&
                   forward[source] != target) {
                   return false;
               }
               if (reverse[target] != -1 &&
                   reverse[target] != source) {
                   return false;
               }

               forward[source] = target;
               reverse[target] = source;
           }
           return true;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def isIsomorphic(self, s: str, t: str) -> bool:
           if len(s) != len(t):
               return False

           forward: dict[str, str] = {}
           reverse: dict[str, str] = {}

           for source, target in zip(s, t):
               if source in forward and forward[source] != target:
                   return False
               if target in reverse and reverse[target] != source:
                   return False
               forward[source] = target
               reverse[target] = source

           return True

Java
~~~~

.. code-block:: java

   import java.util.HashMap;
   import java.util.Map;

   class Solution {
       public boolean isIsomorphic(String s, String t) {
           if (s.length() != t.length()) {
               return false;
           }

           Map<Character, Character> forward = new HashMap<>();
           Map<Character, Character> reverse = new HashMap<>();

           for (int i = 0; i < s.length(); ++i) {
               char source = s.charAt(i);
               char target = t.charAt(i);

               Character mappedTarget = forward.get(source);
               if (mappedTarget != null && mappedTarget != target) {
                   return false;
               }

               Character mappedSource = reverse.get(target);
               if (mappedSource != null && mappedSource != source) {
                   return false;
               }

               forward.put(source, target);
               reverse.put(target, source);
           }
           return true;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn is_isomorphic(s: String, t: String) -> bool {
           let source = s.as_bytes();
           let target = t.as_bytes();
           if source.len() != target.len() {
               return false;
           }

           let mut forward = [-1_i16; 256];
           let mut reverse = [-1_i16; 256];

           for index in 0..source.len() {
               let a = source[index] as usize;
               let b = target[index] as usize;

               if forward[a] != -1 && forward[a] != b as i16 {
                   return false;
               }
               if reverse[b] != -1 && reverse[b] != a as i16 {
                   return false;
               }

               forward[a] = b as i16;
               reverse[b] = a as i16;
           }
           true
       }
   }

Go
~~

.. code-block:: go

   func isIsomorphic(s string, t string) bool {
       if len(s) != len(t) {
           return false
       }

       var forward [256]int
       var reverse [256]int

       for i := 0; i < len(s); i++ {
           source := int(s[i])
           target := int(t[i])

           if forward[source] != 0 &&
               forward[source] != target+1 {
               return false
           }
           if reverse[target] != 0 &&
               reverse[target] != source+1 {
               return false
           }

           forward[source] = target + 1
           reverse[target] = source + 1
       }
       return true
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function isIsomorphic(s: string, t: string): boolean {
       if (s.length !== t.length) {
           return false;
       }

       const forward = new Int32Array(65536);
       const reverse = new Int32Array(65536);

       for (let i = 0; i < s.length; i += 1) {
           const source = s.charCodeAt(i);
           const target = t.charCodeAt(i);

           if (
               forward[source] !== 0 &&
               forward[source] !== target + 1
           ) {
               return false;
           }
           if (
               reverse[target] !== 0 &&
               reverse[target] !== source + 1
           ) {
               return false;
           }

           forward[source] = target + 1;
           reverse[target] = source + 1;
       }
       return true;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public bool IsIsomorphic(string s, string t) {
           if (s.Length != t.Length) {
               return false;
           }

           int[] forward = new int[char.MaxValue + 1];
           int[] reverse = new int[char.MaxValue + 1];

           for (int i = 0; i < s.Length; ++i) {
               int source = s[i];
               int target = t[i];

               if (forward[source] != 0 &&
                   forward[source] != target + 1) {
                   return false;
               }
               if (reverse[target] != 0 &&
                   reverse[target] != source + 1) {
                   return false;
               }

               forward[source] = target + 1;
               reverse[target] = source + 1;
           }
           return true;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function is_isomorphic(s::String, t::String)::Bool
       source = collect(s)
       target = collect(t)
       length(source) == length(target) || return false

       forward = Dict{Char, Char}()
       reverse = Dict{Char, Char}()

       for index in eachindex(source)
           a = source[index]
           b = target[index]

           if haskey(forward, a) && forward[a] != b
               return false
           end
           if haskey(reverse, b) && reverse[b] != a
               return false
           end

           forward[a] = b
           reverse[b] = a
       end
       return true
   end

R
~

.. code-block:: r

   is_isomorphic <- function(s, t) {
     source <- utf8ToInt(s)
     target <- utf8ToInt(t)
     if (length(source) != length(target)) {
       return(FALSE)
     }

     forward <- new.env(hash = TRUE, parent = emptyenv())
     reverse <- new.env(hash = TRUE, parent = emptyenv())

     for (index in seq_along(source)) {
       source_key <- as.character(source[[index]])
       target_key <- as.character(target[[index]])

       if (exists(source_key, forward, inherits = FALSE) &&
           get(source_key, forward, inherits = FALSE) != target[[index]]) {
         return(FALSE)
       }
       if (exists(target_key, reverse, inherits = FALSE) &&
           get(target_key, reverse, inherits = FALSE) != source[[index]]) {
         return(FALSE)
       }

       assign(source_key, target[[index]], forward)
       assign(target_key, source[[index]], reverse)
     }
     TRUE
   }

静态审查记录
------------

本章没有运行、编译或测试上述代码。完成的静态审查包括：

* 人工推演 ``egg/add``、``foo/bar``、``paper/title``、``ab/aa``、``badc/baba``、
  空字符串、单字符和长度不同输入；
* 对照代码确认两个方向都在冲突检查后同步写入；
* C/C++/Rust/Go 的表索引都先转换为无符号字节；
* Java 的 ``Character`` 比较会自动拆箱为 ``char``，映射缺失由 ``null`` 区分；
* TypeScript/C# 使用 ``target+1`` 作为非零登记值，避免字符代码 0 与空槽混淆；
* Julia 使用 ``collect`` 后按同一 ``Char`` 索引遍历，不使用字符串字节下标；
* R 使用 ``seq_along``，空向量时产生空循环；环境键由码点十进制字符串构造；
* 所有函数在长度不等时返回 ``false``，且没有修改输入。

剩余风险是题解代码未经过目标平台编译器或运行时验证；非 ASCII 输入在字节、UTF-16
代码单元和 Unicode 码点适配器之间可能产生不同分段。官方 ASCII 字符域不触发该差异。

易错点
------

* 只维护单向 ``source -> target`` 映射；
* 看到映射冲突后覆盖旧值，而不是返回 ``false``；
* 用字符出现次数相同代替位置对应关系；
* 忘记先检查长度，导致 ``zip`` 或较短循环静默忽略尾部；
* 用 ``0`` 作为空槽，却又直接存储可能为 0 的字符代码；
* 把 UTF-8 字节、UTF-16 单元、Unicode 码点和用户可见字素簇混为同一概念。

知识更新与关联
--------------

* 双射可以拆成“函数一致性 + 单射”；反向表直接维护单射条件；
* ``0202`` 的函数图只有单一后继，本题则构造两个互逆的有限映射；
* ``0242`` Valid Anagram 关注字符多重集合，不要求位置模式相同；
* ``0290`` Word Pattern 是字符到单词的同一种双射模型；
* 首次出现位置签名也是判断同构的等价表达，但本章选择双向映射以便直接证明。

自检题
------

#. 为什么 ``ab`` 与 ``aa`` 能通过单向映射检查，却不满足题意？
#. 扫描结束时，为什么 ``forward`` 对实际出现目标集合自动满射？
#. TypeScript 为什么把字符代码加一后存入表？
#. Julia 与 R 的实现为什么额外出现 ``O(n)`` 输入物化成本？
#. 非 ASCII 输入时，为什么不同语言适配器可能对“一个字符”产生不同划分？

答案要点
--------

#. ``a->a``、``b->a`` 在单向函数中不冲突，但两个源字符共享目标，违反单射。
#. 每个目标字符都出现在某个位置 ``t[i]``，该位置的 ``s[i]`` 在 ``forward`` 中映射到它。
#. ``Int32Array`` 初始值为 0；加一后 0 可以唯一表示未登记。
#. Julia ``collect`` 和 R ``utf8ToInt`` 都物化与字符数同阶的向量。
#. UTF-8 字节、UTF-16 代码单元、Unicode 码点和字素簇的边界定义不同；官方 ASCII 输入没有这个问题。
