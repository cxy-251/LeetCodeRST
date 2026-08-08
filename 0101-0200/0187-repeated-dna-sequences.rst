0187. Repeated DNA Sequences
============================

题目信息
--------

:题号: 0187. 重复的 DNA 序列
:难度: Medium
:主题: 字符串、滑动窗口、位编码、三态去重
:原题: `LeetCode 0187 <https://leetcode.com/problems/repeated-dna-sequences/>`_
:重点: 将固定四字符窗口编码为 20 位状态，并在第二次出现时恰好提交一次结果

题目重述
--------

给定只包含 ``A、C、G、T`` 的 DNA 字符串 ``s``，找出所有出现至少两次、长度恰为 10
的连续片段。每种重复片段只返回一次，结果顺序任意。

若字符串长度小于 10，不存在合法窗口，返回空数组。

自建示例
--------

.. code-block:: text

   输入：s = "AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT"
   输出：["AAAAACCCCC", "CCCCCAAAAA"]

.. code-block:: text

   输入：s = "AAAAAAAAAAAAA"
   输出：["AAAAAAAAAA"]

   四个长度 10 的窗口内容相同；第二次出现时输出，第三、第四次不能重复追加。

.. code-block:: text

   输入：s = "ACGTACGTA"
   输出：[]

   长度只有 9，没有完整窗口。

C++ 实现
--------

.. code-block:: cpp

   #include <string>
   #include <unordered_map>
   #include <vector>

   class Solution {
   private:
       std::vector<std::string> hashStringWindows(
           const std::string& s) {
           std::unordered_map<std::string, int> occurrences;
           std::vector<std::string> repeated;

           for (int start = 0;
                start + 10 <= static_cast<int>(s.size());
                ++start) {
               std::string window = s.substr(start, 10);
               if (++occurrences[window] == 2) {
                   repeated.push_back(window);
               }
           }
           return repeated;
       }

       unsigned int encode(char nucleotide) {
           switch (nucleotide) {
               case 'A':
                   return 0U;
               case 'C':
                   return 1U;
               case 'G':
                   return 2U;
               default:
                   return 3U;
           }
       }

       std::vector<std::string> encodedWindows(
           const std::string& s) {
           if (s.size() < 10U) {
               return {};
           }

           constexpr unsigned int state_count = 1U << 20U;
           constexpr unsigned int window_mask = state_count - 1U;
           std::vector<unsigned char> state(state_count, 0U);
           std::vector<std::string> repeated;
           unsigned int code = 0U;

           for (std::size_t index = 0; index < s.size(); ++index) {
               code = ((code << 2U) | encode(s[index])) & window_mask;
               if (index < 9U) {
                   continue;
               }

               if (state[code] == 0U) {
                   state[code] = 1U;
               } else if (state[code] == 1U) {
                   repeated.push_back(s.substr(index - 9U, 10U));
                   state[code] = 2U;
               }
           }
           return repeated;
       }

   public:
       std::vector<std::string> findRepeatedDnaSequences(
           std::string s) {
           return encodedWindows(s);
       }
   };

题解
----

原始搜索重复扫描后缀
~~~~~~~~~~~~~~~~~~~~

字符串长度为 ``n`` 时共有 ``n-9`` 个候选窗口。最直接的方法是对每个窗口向后搜索相同
片段；许多后缀会被不同起点反复比较，最坏达到 ``O(n²)``。

``hashStringWindows`` 保存每种十字符子串的出现次数。每个窗口只查询一次哈希表，并在计数
刚变成 2 时输出，因此期望时间降为 ``O(n)``。这个基线已经正确，但每前进一步都要构造
一个新子串，并对十个字符计算哈希；哈希表还保存字符串键。

题目给出了可进一步利用的固定结构：字符只有四种，窗口长度永远是 10。窗口无需以字符串
作为状态，可以无碰撞地装进一个整数。

四字符如何变成 20 位编码
~~~~~~~~~~~~~~~~~~~~~~~~

为每个字符分配两位：

.. code-block:: text

   A -> 00
   C -> 01
   G -> 10
   T -> 11

十个字符正好占 20 位，也可看成十位四进制数。固定长度保证表示唯一：即使开头的 ``A``
编码为零，也不会与较短字符串混淆，因为状态表只在形成完整十字符窗口后查询。

处理新字符时执行：

.. code-block:: text

   code = ((code << 2) | newValue) & ((1 << 20) - 1)

左移为新字符腾出最低两位，按位或写入其编码；20 位掩码删除已经滑出窗口的最高两位。
因此处理下标 ``index`` 后，``code`` 始终表示最近至多 10 个字符；当 ``index >= 9`` 时，
它恰好对应窗口 ``s[index-9..index]``。

滚动状态删除了哪些工作
~~~~~~~~~~~~~~~~~~~~~~

相邻十字符窗口共享九个字符。字符串基线每次重新复制和哈希这九个公共字符；滚动编码只做
一次左移、写入和掩码，就从旧窗口状态得到新窗口状态。总共只有 ``2^20`` 种编码，可以
直接用数组索引，不存在哈希冲突，也不需要存字符串键。

只有在某片段确定需要返回时，代码才调用 ``substr`` 复制一份十字符结果。中间所有窗口都
保持整数形式。

为什么需要三种出现状态
~~~~~~~~~~~~~~~~~~~~~~

仅记录“见过/没见过”的布尔值，可以识别第二次出现，却无法区分“刚刚重复、应该输出”和
“以前已经输出、不能再次加入”。``state[code]`` 使用三种值：

* ``0``：此前没有完整窗口使用该编码；
* ``1``：此前出现一次，尚未输出；
* ``2``：此前至少出现两次，结果中已经有一个副本。

当前窗口到来时，``0 -> 1`` 不输出；``1 -> 2`` 并输出；状态 2 不再变化。于是输出动作
与“第二次出现”这一唯一状态转移绑定，不需要第二个结果集合做去重。

具体状态走读
~~~~~~~~~~~~

``"AAAAAAAAAAAAA"`` 产生四个相同编码 0：

.. code-block:: text

   窗口序号  到来前状态  动作                 到来后状态
   1         0           只记录首次出现       1
   2         1           输出 AAAAAAAAAA      2
   3         2           已输出，跳过         2
   4         2           已输出，跳过         2

如果只有九个字符，循环虽会逐字符更新部分编码，但 ``index < 9`` 时不会访问状态表；
函数还提前返回空结果，完整避免不存在的窗口。

代码对应关系与正确性
~~~~~~~~~~~~~~~~~~~~

``encode`` 把题目保证合法的四种字符映射到 ``0..3``，``default`` 因而只代表 ``T``。
掩码不变量保证每个候选窗口都恰好查询一次；定长四进制表示保证相同编码当且仅当十字符
片段相同；三态转移保证每个至少出现两次的编码在第二次命中时输出一次，之后不再输出。
所以结果没有假重复、没有遗漏，也没有多份副本。

方案选择与复杂度
~~~~~~~~~~~~~~~~

字符串哈希基线期望时间 ``O(n)``，保存至多 ``O(n)`` 个字符串键，并为窗口创建短子串；
位编码主解严格线性扫描，时间 ``O(n)``。状态表固定为 ``2^20`` 个字节，约 1 MiB；相对
本题固定窗口和字符域可记为 ``O(1)``，结果字符串空间另计。位方案利用固定结构删除了窗口
复制、字符串哈希和碰撞处理，因此 ``encodedWindows`` 作为主解。
