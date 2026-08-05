0030. Substring with Concatenation of All Words
===============================================

题目信息
--------

:题号: 0030
:难度: Hard
:主题: 字符串、哈希计数、滑动窗口
:原题: `LeetCode 0030 <https://leetcode.com/problems/substring-with-concatenation-of-all-words/>`_
:重点: 从逐起点重建词频，推导到按单词长度分组的滑动窗口，并处理重复单词与重叠答案

题目重述
--------

给定字符串 ``s`` 和字符串数组 ``words``。``words`` 中所有单词长度相同。返回 ``s`` 中所有满足条件的零基起始
下标：从该位置开始的连续子串，可以由 ``words`` 中的全部单词各使用一次、按任意顺序首尾拼接而成。

设单词长度为 ``w``、单词数量为 ``k``，目标子串长度固定为 ``w * k``。候选子串必须切成 ``k`` 个长度为
``w`` 的块，每个单词的出现次数必须与 ``words`` 完全相同。不同答案允许重叠，返回顺序不限。

约束为 ``1 <= s.length <= 10^4``、``1 <= words.length <= 5000``、
``1 <= words[i].length <= 30``，字符串只包含小写英文字母。

自建示例
--------

* ``s = "barfoofoofoobar"``、``words = ["bar", "foo", "foo"]``，返回 ``[0, 6]``；
* ``s = "xbarfooend"``、``words = ["bar", "foo"]``，返回 ``[1]``；
* ``s = "catdogcat"``、``words = ["cat", "dog"]``，返回 ``[0, 3]``；
* ``s = "foofoobar"``、``words = ["foo", "bar", "bar"]``，返回 ``[]``；
* ``s = "abc"``、``words = ["ab", "cd"]``，目标总长度超过文本，返回 ``[]``。

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
           for (int start = 0;
                start + totalLength <= static_cast<int>(s.size());
                ++start) {
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
       std::vector<int> findSubstring(
           std::string s,
           std::vector<std::string>& words
       ) {
           return slidingByOffsets(s, words);
       }
   };

题解
----

逐起点验证
~~~~~~~~~~

目标子串长度固定为 ``L = w * k``。最直接的方法枚举每个满足 ``start + L <= s.size()`` 的字符起点，再把
区间 ``[start, start + L)`` 按长度 ``w`` 切成 ``k`` 个块。

``recountEveryStart`` 先建立需求词频 ``requirement``。验证一个起点时，从左到右读取各块：当前块不在需求表中，
或使用次数超过需求时，候选立即失败；成功读取 ``k`` 个块时，当前起点就是答案。

每个候选的切分方式唯一，因此该方法不会漏解。瓶颈是每个起点都重新创建 ``used``，并再次统计与相邻候选重叠的
单词块。

等长分块
~~~~~~~~

窗口不能任意移动一个字符后直接复用词频，因为单词必须保持完整。答案起点又不一定是 ``w`` 的整数倍，例如
``"xbarfooend"`` 中的答案从下标 ``1`` 开始。

按照起点除以 ``w`` 的余数，可以把所有块起点拆成 ``w`` 条扫描线：

.. code-block:: text

   偏移 0：0, w, 2w, ...
   偏移 1：1, 1+w, 1+2w, ...
   ...
   偏移 w-1：w-1, 2w-1, ...

同一候选中的全部单词块必定位于同一条扫描线。依次扫描所有偏移可以覆盖全部字符起点，每个完整块起点又只属于
其中一条扫描线。

窗口不变量
~~~~~~~~~~

在一条扫描线上，``right`` 每次前进 ``w`` 个字符，窗口维护：

* ``left``：窗口首块起点；
* ``seen[word]``：窗口内各单词次数；
* ``windowWords``：窗口块数。

每轮调整结束后保持两个条件：窗口只包含需求表中的单词，并且每种单词的次数都不超过需求。这样的窗口仍可能继续
扩展成完整答案。

非法块重置
~~~~~~~~~~

若新块不在 ``requirement`` 中，任何跨过该块的候选都会包含一个多余单词。此时清空 ``seen``，把
``windowWords`` 设为零，并令 ``left`` 移到该块之后。

这一次重置同时排除了所有跨越该非法块的起点，避免逐起点方法反复遇到同一个失败原因。

超量收缩
~~~~~~~~

加入一个需求单词后，只有该单词的次数可能超出上限。若 ``seen[word] > requirement[word]``，从左侧逐块移除，
直到它恢复到允许次数。

被删除的更早起点都不可能与当前右端组成答案，因为相应窗口包含过多的 ``word``。其他单词在收缩时只会减少，
无需检查新的超量项。左边界始终单向前进，所以每个块最多被移出一次。

完整窗口
~~~~~~~~

窗口调整后，各单词次数均不超过需求。若 ``windowWords == wordCount``，窗口总次数已经等于需求总次数。

此时若某个单词次数仍小于需求，就必须有另一个单词次数大于需求才能补足总数，与窗口不变量矛盾。因此所有词频
必然逐项相等，``left`` 就是合法起点，不需要再次比较整张哈希表。

重叠答案
~~~~~~~~

记录答案后只移除最左单词块，不清空窗口。这样可以保留当前答案的后缀，继续发现与它重叠的下一答案。

对 ``s = "barfoofoofoobar"``、``words = ["bar", "foo", "foo"]``：

.. code-block:: text

   bar, foo, foo   -> 命中下标 0，移除 bar
   foo, foo, foo   -> foo 超量，移除最左 foo
   foo, foo, bar   -> 命中下标 6

若首次命中后清空窗口，后续仍可能重新找到下标 ``6``，却会丢弃本来可以复用的两个 ``foo``。

代码演进
~~~~~~~~

``recountEveryStart`` 对每个字符起点重新统计最多 ``k`` 个单词块。

等长条件把候选拆成按 ``start mod w`` 对齐的扫描线。``slidingByOffsets`` 在每条扫描线上复用窗口：右端只加入
一个新块，左端只在非法块、超量单词或完整命中后向前移动。

公开入口采用对齐滑动窗口。它保留重复单词的精确频次，也不会遗漏不同偏移或彼此重叠的答案。

复杂度分析
~~~~~~~~~~

设 ``n = s.size()``、单词长度为 ``w``、单词数量为 ``k``、不同单词数为 ``u``。

逐起点方法最多验证 ``n - wk + 1`` 个起点，每个起点检查至多 ``k`` 个块。按当前 ``substr`` 与字符串哈希实现，
字符级时间为 ``O((n - wk + 1)kw)``，局部计数表使用 ``O(u)`` 空间。

滑动窗口中，每个完整块最多从右端加入一次、从左端移除一次。所有偏移合计为 ``O(n)`` 次块处理；按当前字符串
切片实现，字符级时间为 ``O(nw)``。需求表与窗口表最多保存 ``u`` 个单词，工作空间为 ``O(u)``。