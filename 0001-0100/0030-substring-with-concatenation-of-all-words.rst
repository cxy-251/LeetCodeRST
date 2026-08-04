0030. Substring with Concatenation of All Words
===============================================

题目信息
--------

:题号: 0030
:难度: Hard
:主题: 字符串、哈希计数、滑动窗口
:原题: `LeetCode 0030 <https://leetcode.com/problems/substring-with-concatenation-of-all-words/>`_
:重点: 从逐起点重建词频，推导到按单词长度对齐的滑动窗口，并准确处理重复单词与重叠答案

题目重述
--------

给定字符串 ``s`` 和字符串数组 ``words``。``words`` 中所有单词长度相同，需要返回 ``s`` 中全部满足条件的
零基起始下标：从该位置开始的连续子串，能够由 ``words`` 中的所有单词各使用一次、按任意顺序首尾拼接而成。

设单词长度为 ``w``、单词数量为 ``k``，每个候选子串的长度固定为 ``w * k``。候选内部必须恰好切成 ``k``
个长度为 ``w`` 的块；单词顺序可以改变，但每个单词的出现次数必须与 ``words`` 完全相同。若 ``words`` 中同一
单词出现多次，候选中也必须保留相同的重复次数。

不同合法子串可以重叠，返回下标的顺序不限。``s`` 的长度位于 ``[1, 10^4]``，``words`` 的长度位于
``[1, 5000]``，每个单词长度位于 ``[1, 30]``；字符串只包含小写英文字母。

自建示例
--------

* 重复单词与重叠答案：``s = "barfoofoofoobar"``、``words = ["bar", "foo", "foo"]``，返回
  ``[0, 6]``；两个长度为 ``9`` 的合法子串分别是 ``"barfoofoo"`` 和 ``"foofoobar"``；
* 起点不与字符串开头对齐：``s = "xbarfooend"``、``words = ["bar", "foo"]``，返回 ``[1]``；
* 同一批单词采用不同顺序：``s = "catdogcat"``、``words = ["cat", "dog"]``，返回 ``[0, 3]``；
* 频次不满足：``s = "foofoobar"``、``words = ["foo", "bar", "bar"]``，返回 ``[]``，因为候选中缺少
  第二个 ``bar``；
* 目标总长度超过文本：``s = "abc"``、``words = ["ab", "cd"]``，返回 ``[]``。

C++ 实现
--------

.. code-block:: cpp

   #include <string>
   #include <unordered_map>
   #include <vector>

   class Solution {
   private:
       std::unordered_map<std::string, int> buildRequirement(
           const std::vector<std::string>& words
       ) {
           std::unordered_map<std::string, int> requirement;
           for (const std::string& word : words) {
               ++requirement[word];
           }
           return requirement;
       }

       std::vector<int> recountEveryStart(
           const std::string& s,
           const std::vector<std::string>& words
       ) {
           std::vector<int> result;
           if (words.empty()) {
               return result;
           }
           const int wordLength = static_cast<int>(words.front().size());
           const int wordCount = static_cast<int>(words.size());
           const int totalLength = wordLength * wordCount;
           if (totalLength > static_cast<int>(s.size())) {
               return result;
           }

           const auto requirement = buildRequirement(words);
           for (int start = 0; start + totalLength <= static_cast<int>(s.size()); ++start) {
               std::unordered_map<std::string, int> used;
               int block = 0;
               for (; block < wordCount; ++block) {
                   const int position = start + block * wordLength;
                   const std::string word = s.substr(position, wordLength);
                   const auto required = requirement.find(word);
                   if (required == requirement.end()) {
                       break;
                   }
                   if (++used[word] > required->second) {
                       break;
                   }
               }
               if (block == wordCount) {
                   result.push_back(start);
               }
           }
           return result;
       }

       std::vector<int> slidingByOffsets(
           const std::string& s,
           const std::vector<std::string>& words
       ) {
           std::vector<int> result;
           if (words.empty() || words.front().empty()) {
               return result;
           }
           const int wordLength = static_cast<int>(words.front().size());
           const int wordCount = static_cast<int>(words.size());
           const int totalLength = wordLength * wordCount;
           if (totalLength > static_cast<int>(s.size())) {
               return result;
           }

           const auto requirement = buildRequirement(words);
           for (int offset = 0; offset < wordLength; ++offset) {
               int left = offset;
               int windowWords = 0;
               std::unordered_map<std::string, int> seen;

               for (int right = offset;
                    right + wordLength <= static_cast<int>(s.size());
                    right += wordLength) {
                   const std::string word = s.substr(right, wordLength);
                   const auto required = requirement.find(word);
                   if (required == requirement.end()) {
                       seen.clear();
                       windowWords = 0;
                       left = right + wordLength;
                       continue;
                   }

                   ++seen[word];
                   ++windowWords;
                   while (seen[word] > required->second) {
                       const std::string removed = s.substr(left, wordLength);
                       --seen[removed];
                       --windowWords;
                       left += wordLength;
                   }

                   if (windowWords == wordCount) {
                       result.push_back(left);
                       const std::string removed = s.substr(left, wordLength);
                       --seen[removed];
                       --windowWords;
                       left += wordLength;
                   }
               }
           }
           return result;
       }

   public:
       std::vector<int> findSubstring(std::string s, std::vector<std::string>& words) {
           return slidingByOffsets(s, words);
       }
   };

题解
----

逐起点重新验证
~~~~~~~~~~~~~~

设单词长度为 ``w``、数量为 ``k``，目标子串长度为 ``L = w * k``。最直接的方法是枚举每个满足
``start + L <= s.size()`` 的字符起点，再把区间 ``[start, start + L)`` 切成 ``k`` 个长度为 ``w`` 的块。

``recountEveryStart`` 先建立需求词频 ``requirement``。验证一个起点时，从左到右读取各块，并在局部哈希表
``used`` 中累计次数：

* 当前块不在需求表中，候选立即失败；
* 当前单词使用次数超过需求，候选立即失败；
* 成功读取 ``k`` 个块，当前起点就是答案。

每个答案都具有唯一的固定切分方式，因此这套验证不会遗漏或误收候选。它的问题是相邻起点彼此独立：每次都重新
切片、重新建立 ``used``，即使两个候选包含大量相同块，也不会复用任何统计结果。

字符起点不能直接共用窗口
~~~~~~~~~~~~~~~~~~~~~~~~

普通滑动窗口通常每次移动一个字符。本题每个合法候选必须从某个长度为 ``w`` 的块边界开始，但答案起点不一定是
``w`` 的整数倍。例如 ``s = "xbarfooend"`` 中的答案从下标 ``1`` 开始。

按照起点除以 ``w`` 的余数，可以把所有字符位置拆成 ``w`` 条互不混合的扫描线：

.. code-block:: text

   偏移 0：0, w, 2w, 3w, ...
   偏移 1：1, 1+w, 1+2w, ...
   ...
   偏移 w-1：w-1, 2w-1, 3w-1, ...

同一候选中的全部单词块都位于同一条扫描线。分别扫描所有偏移，就能覆盖每个可能起点；每个完整块起点只属于
其中一条扫描线，因此不是把同一批块重复扫描 ``w`` 次。

窗口保存的最小状态
~~~~~~~~~~~~~~~~~~

在一条扫描线上，``right`` 每次前进 ``w`` 个字符并加入一个完整单词块。窗口使用四项状态：

* ``left``：窗口最左单词块的起点；
* ``right``：本轮新单词块的起点；
* ``seen[word]``：当前窗口内该单词的出现次数；
* ``windowWords``：窗口包含的单词块总数。

每轮修复完成后，窗口保持两个条件：其中只包含需求表中的单词，并且每种单词的次数都不超过需求次数。这两个
条件使窗口成为一个仍有可能扩展成完整答案的连续单词序列。

非需求单词切断窗口
~~~~~~~~~~~~~~~~~~

若新块不在 ``requirement`` 中，任何跨过该块的候选都必然包含一个多余单词，不可能合法。此时可以清空
``seen``，令 ``windowWords = 0``，并把 ``left`` 移到该块之后。

这个重置一次排除了所有跨越当前块的起点。逐起点方法会在这些起点上分别读到同一个错误块后失败，滑动窗口只处理
一次。

超量单词推动左边界
~~~~~~~~~~~~~~~~~~

加入需求单词后，只有这个新单词的次数可能超过需求。扩张前其他单词都满足上界，本轮没有增加它们；收缩时它们的
次数只会减少，因此无需遍历整张哈希表寻找超量项。

若 ``seen[word] > requirement[word]``，必须从左侧逐块移除，直到当前单词恢复到允许次数。继续保留更早的左边界
没有意义：任何以这些位置开始、并以当前 ``right`` 结尾的窗口都包含过多的 ``word``，必然不是答案。

每次移除都同步减少对应词频与 ``windowWords``，并令 ``left += w``。被移出的块不会再次进入这条扫描线的窗口，
所以左边界的累计移动仍为线性数量。

总数相等即可确认答案
~~~~~~~~~~~~~~~~~~~~

窗口修复后，每种单词次数都不超过需求，且窗口中没有需求表之外的单词。若此时
``windowWords == wordCount``，窗口总次数已经等于全部需求次数之和。

假设仍有某个单词出现次数小于需求，为保持相同总数，就必须存在另一个单词超过需求；这与窗口不变量矛盾。因此
所有单词频次必然逐项相等，``left`` 就是一个合法起点，不需要再次比较两张哈希表。

命中后不能清空窗口
~~~~~~~~~~~~~~~~~~

记录答案后，只移除最左单词块，而不是清空整个窗口。这样窗口保留当前答案的后缀，可以继续发现与它重叠的下一
答案。

以 ``s = "barfoofoofoobar"``、``words = ["bar", "foo", "foo"]`` 为例，单词长度为 ``3``：

.. list-table::
   :header-rows: 1

   * - ``right``
     - 新块
     - 处理
     - ``left``
     - 修复后的窗口
   * - 0
     - ``bar``
     - 加入
     - 0
     - ``bar``
   * - 3
     - ``foo``
     - 加入
     - 0
     - ``bar, foo``
   * - 6
     - ``foo``
     - 命中 0，随后移除 ``bar``
     - 3
     - ``foo, foo``
   * - 9
     - ``foo``
     - ``foo`` 超量，移除最左 ``foo``
     - 6
     - ``foo, foo``
   * - 12
     - ``bar``
     - 命中 6，随后移除最左 ``foo``
     - 9
     - ``foo, bar``

第一次命中后若清空窗口，下标 ``6`` 的答案仍可重新积累得到，但会丢弃本可复用的两个 ``foo``；只移除一个左块
恰好把完整窗口变回“长度少一块、频次仍合法”的可扩展状态。

代码演进
~~~~~~~~

``recountEveryStart`` 为每个字符起点创建新的 ``used``，并重新读取最多 ``k`` 个单词块。它的正确性直接，但
候选之间没有共享状态。

等长条件把任意起点的切分边界唯一确定，并允许按 ``start mod w`` 拆成独立扫描线。``slidingByOffsets`` 在每条
扫描线上复用上一个候选窗口：右端只加入一个新块，左端只在出现非法块、超量单词或完整命中后向前移动。

因此新实现删除了“为每个起点重建整张词频表”的工作。公开入口采用对齐滑动窗口，它既保留重复单词的精确频次，
也不会遗漏不同偏移或彼此重叠的答案。

复杂度分析
~~~~~~~~~~

设 ``n = s.size()``、单词长度为 ``w``、单词数量为 ``k``、不同单词数为 ``u``。

逐起点方法最多验证 ``n - wk + 1`` 个起点，每个起点检查至多 ``k`` 个块，因此需要
``O((n-wk+1)k)`` 次块处理。当前代码的 ``substr`` 和字符串哈希还会读取 ``w`` 个字符，字符级时间可写为
``O((n-wk+1)kw)``；局部计数表占 ``O(u)`` 工作空间。

对齐滑动窗口中，每个完整块最多从右端加入一次、从左端移除一次，所有偏移合计为 ``O(n)`` 次块处理。按当前
``std::string`` 切片实现，字符级时间为 ``O(nw)``；若用不复制的字符串视图并把固定长度比较视为一次块操作，
通常写作 ``O(n)``。需求表与窗口表最多保存 ``u`` 个单词，工作空间为 ``O(u)``，返回下标不计入其中。
