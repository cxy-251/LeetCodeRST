0140. Word Break II
===================

题目信息
--------

:题号: 0140. 单词拆分 II
:难度: Hard
:主题: 字符串、记忆化搜索、可行性剪枝、DAG 路径枚举
:原题: `LeetCode 0140 <https://leetcode.com/problems/word-break-ii/>`_
:重点: 区分“后缀能否完成”与“后缀有哪些句子”，缓存共享后缀的全部结果并用空句子作为组合单位元

题目重述
--------

给定非空字符串 ``s`` 和字典 ``wordDict``，在字符之间插入空格，使每个非空片段都是字典词。返回所有能
按原顺序完整覆盖 ``s`` 的句子，顺序不限；同一个字典词可以重复使用。若不存在合法切分，返回空数组。

自建示例
--------

* ``s = "pinepine"``、字典为 ``["pine", "pin", "e"]``：答案为 ``"pine pine"``、
  ``"pine pin e"``、``"pin e pine"``、``"pin e pin e"``；
* ``s = "catsx"``、字典为 ``["cat", "cats"]``：两个可行前缀最终都停在 ``x``，返回空数组；
* ``s = "aaaa"``、字典为 ``["a", "aa"]``：不同切点会产生多条句子，且两个词都可重复使用。

C++ 实现
--------

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
   private:
       bool matchesAt(
           const std::string& s,
           int start,
           const std::string& word
       ) {
           const int wordLength = static_cast<int>(word.size());
           return start + wordLength <= static_cast<int>(s.size()) &&
                  s.compare(start, wordLength, word) == 0;
       }

       void enumerateCompletePaths(
           const std::string& s,
           int start,
           const std::vector<std::string>& words,
           std::vector<std::string>& path,
           std::vector<std::string>& answer
       ) {
           if (start == static_cast<int>(s.size())) {
               std::string sentence;
               for (int index = 0;
                    index < static_cast<int>(path.size());
                    ++index) {
                   if (index > 0) {
                       sentence += ' ';
                   }
                   sentence += path[index];
               }
               answer.push_back(sentence);
               return;
           }

           for (const std::string& word : words) {
               if (!matchesAt(s, start, word)) {
                   continue;
               }
               path.push_back(word);
               enumerateCompletePaths(
                   s,
                   start + static_cast<int>(word.size()),
                   words,
                   path,
                   answer
               );
               path.pop_back();
           }
       }

       std::vector<bool> buildCanFinish(
           const std::string& s,
           const std::vector<std::string>& words
       ) {
           const int length = static_cast<int>(s.size());
           std::vector<bool> canFinish(length + 1, false);
           canFinish[length] = true;

           for (int start = length - 1; start >= 0; --start) {
               for (const std::string& word : words) {
                   const int end = start + static_cast<int>(word.size());
                   if (matchesAt(s, start, word) && canFinish[end]) {
                       canFinish[start] = true;
                       break;
                   }
               }
           }
           return canFinish;
       }

       const std::vector<std::string>& sentencesFrom(
           const std::string& s,
           int start,
           const std::vector<std::string>& words,
           const std::vector<bool>& canFinish,
           std::vector<std::vector<std::string>>& memo,
           std::vector<bool>& computed
       ) {
           if (computed[start]) {
               return memo[start];
           }
           computed[start] = true;

           if (start == static_cast<int>(s.size())) {
               memo[start].push_back("");
               return memo[start];
           }

           for (const std::string& word : words) {
               const int end = start + static_cast<int>(word.size());
               if (!matchesAt(s, start, word) || !canFinish[end]) {
                   continue;
               }
               for (const std::string& tail :
                    sentencesFrom(s, end, words, canFinish, memo, computed)) {
                   if (tail.empty()) {
                       memo[start].push_back(word);
                   } else {
                       memo[start].push_back(word + " " + tail);
                   }
               }
           }
           return memo[start];
       }

       std::vector<std::string> memoizedSentences(
           const std::string& s,
           const std::vector<std::string>& words
       ) {
           const std::vector<bool> canFinish = buildCanFinish(s, words);
           if (!canFinish[0]) {
               return {};
           }
           std::vector<std::vector<std::string>> memo(s.size() + 1);
           std::vector<bool> computed(s.size() + 1, false);
           return sentencesFrom(s, 0, words, canFinish, memo, computed);
       }

   public:
       std::vector<std::string> wordBreak(
           std::string s,
           std::vector<std::string>& wordDict
       ) {
           return memoizedSentences(s, wordDict);
       }
   };

题解
----

本题为什么不能只缓存一个布尔值
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

字符边界仍构成一张 DAG：字典词在 ``start`` 匹配时，产生一条到词尾 ``end`` 的边。上一题只问终点是否
可达，每个位置保存一个真假值即可；本题必须输出所有从 ``0`` 到 ``n`` 的路径及边标签。把同一位置压成
``true`` 会丢失它之后有多少种词序列，也无法与不同前缀组合成完整句子。

原始方案 ``enumerateCompletePaths`` 用 ``path`` 保存已选单词。到达末尾才插入空格构造句子，返回后撤销
末词并尝试兄弟分支。它不重不漏，但多个前缀可能到达同一后缀位置，并反复搜索完全相同的后缀树；更糟的
是，像 ``catsx`` 这样的输入会从多个可行前缀重复深入一个注定失败的尾部。

先用布尔状态删除死后缀
~~~~~~~~~~~~~~~~~~~~~~

``canFinish[start]`` 表示 ``s[start..]`` 是否至少存在一种完整拆分。终点设为真；从右向左计算时，只要有
一个词在当前位置匹配且其结尾 ``canFinish[end]`` 为真，当前位置就为真。

这张表不负责保存答案，只充当必要剪枝。枚举时若某个匹配词落到 ``canFinish[end] == false``，以该词开头
的所有路径都无法到达终点，可以整棵删除。若 ``canFinish[0]`` 为假，主过程甚至无需创建任何句子状态。

后缀状态必须保存什么
~~~~~~~~~~~~~~~~~~~~

定义 ``sentencesFrom(start)`` 为能完整覆盖 ``s[start..n-1]`` 的全部句子。若 ``word`` 在 ``start`` 匹配，
就把它与 ``sentencesFrom(end)`` 中每个尾句组合：

.. code-block:: text

   tail 为空：word
   tail 非空：word + " " + tail

同一 ``start`` 的结果只由后缀和字典决定，与到达这里的前缀无关。``computed`` 区分“尚未计算”与“已经
计算但答案为空”；后者非常重要，空列表本身也是一个需要缓存的失败结果，不能因 ``memo[start].empty()``
就反复计算。

为什么终点状态是只含空串的列表
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``sentencesFrom(n) = [""]``，不是空列表。空串不是公开答案，而是字符串组合的单位元：最后一个字典词
正好到达末尾时，需要有一个尾句与它组合，才能产生该词本身。若终点状态为 ``[]``，组合循环执行零次，
所有末词都会消失；若直接把空串拼接，又会多出尾部空格，所以代码用 ``tail.empty()`` 分支。

具体走读共享后缀
~~~~~~~~~~~~~~~~

对 ``pinepine``，后半段从位置 ``4`` 开始的结果先算成：

.. code-block:: text

   sentencesFrom(4) = ["pine", "pin e"]

根位置既可选 ``pine`` 到达 ``4``，也可选 ``pin``、``e`` 后到达同一位置。缓存让后半段只展开一次，但
每个不同前缀仍会与这两条尾句分别组合，所以得到四个完整句子，而不是把共享后缀错误合并成一条。

.. list-table::
   :header-rows: 1

   * - 根前缀
     - 复用的尾句
     - 完整句子
   * - ``pine``
     - ``pine``、``pin e``
     - ``pine pine``、``pine pin e``
   * - ``pin e``
     - ``pine``、``pin e``
     - ``pin e pine``、``pin e pin e``

代码顺序与主解选择
~~~~~~~~~~~~~~~~~~

``matchesAt`` 先做长度边界检查，再定长比较，不构造临时子串。递归边总去往更大下标，所以把
``computed[start]`` 在展开前置真不会遇到图环；子状态完成后再逐句组合。字典词每到一个位置都会重新尝试，
因此重复使用自然成立，不需要资源计数。

公开入口采用“可行性表 + 后缀句子记忆化”。相较直接回溯，它增加布尔表和各后缀句子缓存，收益是删除死
后缀并复用共享后缀；代价是中间位置的句子也会占内存。在输出很少、共享后缀不多时，带 ``canFinish``
剪枝的路径回溯可能更省缓存空间，因此记忆化并非没有代价。

复杂度分析
~~~~~~~~~~

设字符串长度 ``n``、字典词数 ``D``、最大词长 ``L``。可行性预处理最多做 ``O(nDL)`` 字符比较。合法
句子数可能指数增长，生成与复制字符串的时间至少与全部输出字符总量成正比；后缀缓存还可能保存这些答案
的共享尾部版本。递归深度最多 ``O(n)``，布尔表为 ``O(n)``，其余空间由记忆化句子和最终输出主导。
