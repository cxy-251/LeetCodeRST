0076. Minimum Window Substring
==============================

题目信息
--------

:题号: 0076. 最小覆盖子串
:难度: Hard
:主题: 字符串、滑动窗口、频次计数
:原题: `LeetCode 0076 <https://leetcode.com/problems/minimum-window-substring/>`_
:重点: 从枚举所有子串，推导到维护字符缺口的线性滑动窗口

题目重述
--------

给定字符串 ``s`` 和 ``t``，寻找 ``s`` 中最短的连续子串，使该子串包含 ``t`` 中的全部字符，
并且每个字符的出现次数不少于其在 ``t`` 中的出现次数。字符区分大小写。

若不存在满足条件的子串，返回空字符串。约束为 ``1 <= s.length, t.length <= 10^5``，两个字符串只包含英文字母。

自建示例
--------

.. code-block:: text

   输入：s = "CABAA", t = "AABC"
   输出："CABA"

``t`` 需要两个 ``A``、一个 ``B`` 和一个 ``C``。``"CABA"`` 恰好满足全部频次，长度已经等于 ``t`` 的长度，
因此不可能存在更短答案。

.. code-block:: text

   输入：s = "ADOBECODEBANC", t = "ABC"
   输出："BANC"

窗口第一次覆盖 ``ABC`` 时仍然较长；继续移动左右边界后，最短覆盖窗口缩小为 ``"BANC"``。

.. code-block:: text

   输入：s = "abc", t = "AA"
   输出：""

``s`` 中没有足够的 ``A``，任何窗口都无法满足重复次数要求。

C++ 实现
--------

.. code-block:: cpp

   #include <array>
   #include <climits>
   #include <string>

   class Solution {
   private:
       static constexpr int ALPHABET = 128;

       bool covers(const std::string& s,
                   int left,
                   int right,
                   const std::array<int, ALPHABET>& required) {
           std::array<int, ALPHABET> count{};

           for (int index = left; index <= right; ++index) {
               unsigned char ch = static_cast<unsigned char>(s[index]);
               ++count[ch];
           }

           for (int ch = 0; ch < ALPHABET; ++ch) {
               if (count[ch] < required[ch]) {
                   return false;
               }
           }
           return true;
       }

       std::string bruteForce(const std::string& s,
                              const std::string& t) {
           if (t.size() > s.size()) {
               return "";
           }

           std::array<int, ALPHABET> required{};
           for (char raw : t) {
               unsigned char ch = static_cast<unsigned char>(raw);
               ++required[ch];
           }

           int bestStart = 0;
           int bestLength = INT_MAX;

           for (int left = 0; left < static_cast<int>(s.size()); ++left) {
               for (int right = left;
                    right < static_cast<int>(s.size());
                    ++right) {
                   int length = right - left + 1;
                   if (length >= bestLength) {
                       break;
                   }
                   if (covers(s, left, right, required)) {
                       bestStart = left;
                       bestLength = length;
                       break;
                   }
               }
           }

           if (bestLength == INT_MAX) {
               return "";
           }
           return s.substr(bestStart, bestLength);
       }

       std::string formedKinds(const std::string& s,
                               const std::string& t) {
           if (t.size() > s.size()) {
               return "";
           }

           std::array<int, ALPHABET> required{};
           std::array<int, ALPHABET> window{};
           int requiredKinds = 0;

           for (char raw : t) {
               unsigned char ch = static_cast<unsigned char>(raw);
               if (++required[ch] == 1) {
                   ++requiredKinds;
               }
           }

           int formedKindsCount = 0;
           int left = 0;
           int bestStart = 0;
           int bestLength = INT_MAX;

           for (int right = 0;
                right < static_cast<int>(s.size());
                ++right) {
               unsigned char added = static_cast<unsigned char>(s[right]);
               ++window[added];

               if (required[added] > 0 &&
                   window[added] == required[added]) {
                   ++formedKindsCount;
               }

               while (formedKindsCount == requiredKinds) {
                   int length = right - left + 1;
                   if (length < bestLength) {
                       bestStart = left;
                       bestLength = length;
                   }

                   unsigned char removed =
                       static_cast<unsigned char>(s[left]);
                   ++left;

                   if (required[removed] > 0 &&
                       window[removed] == required[removed]) {
                       --formedKindsCount;
                   }
                   --window[removed];
               }
           }

           if (bestLength == INT_MAX) {
               return "";
           }
           return s.substr(bestStart, bestLength);
       }

       std::string missingCount(const std::string& s,
                                const std::string& t) {
           if (t.size() > s.size()) {
               return "";
           }

           std::array<int, ALPHABET> need{};
           for (char raw : t) {
               unsigned char ch = static_cast<unsigned char>(raw);
               ++need[ch];
           }

           int missing = static_cast<int>(t.size());
           int left = 0;
           int bestStart = 0;
           int bestLength = INT_MAX;

           for (int right = 0;
                right < static_cast<int>(s.size());
                ++right) {
               unsigned char added = static_cast<unsigned char>(s[right]);

               if (need[added] > 0) {
                   --missing;
               }
               --need[added];

               while (missing == 0) {
                   int length = right - left + 1;
                   if (length < bestLength) {
                       bestStart = left;
                       bestLength = length;
                   }

                   unsigned char removed =
                       static_cast<unsigned char>(s[left]);
                   ++left;
                   ++need[removed];

                   if (need[removed] > 0) {
                       ++missing;
                   }
               }
           }

           if (bestLength == INT_MAX) {
               return "";
           }
           return s.substr(bestStart, bestLength);
       }

   public:
       std::string minWindow(std::string s, std::string t) {
           return missingCount(s, t);
       }
   };

题解
----

暴力枚举
~~~~~~~~

直接方法枚举每个左端点和右端点，再重新统计当前子串的字符频次。固定左端点后，第一个满足要求的右端点
已经给出该左端点对应的最短窗口，因此找到后可以停止继续扩张。

不同候选窗口大量重叠，重复统计使该方法最坏达到立方级。优化的关键是让窗口边界单调移动，并在加入或移出一个字符时增量更新状态。

窗口状态
~~~~~~~~

窗口右端负责加入字符，左端负责移出字符。右端扩张到窗口可行后，继续扩张只会让窗口更长；此时应持续右移左端，
直到再移除一个字符就会破坏可行性。

这样，对于每个固定右端点，算法都会检查以该位置结尾的最短可行窗口。全局最短答案必然属于这些候选之一。

字符种类计数
~~~~~~~~~~~~

一种直接状态是分别维护 ``required`` 和 ``window``。当某种字符的窗口频次第一次达到需求频次时，
``formedKindsCount`` 增加；当左端移除字符使该频次低于需求时，计数减少。

窗口有效当且仅当：

.. code-block:: text

   formedKindsCount == requiredKinds

这种写法清楚地区分“有多少种字符已经达标”，但需要两张频次数组和两个种类计数变量。

字符缺口计数
~~~~~~~~~~~~

还可以让 ``need[ch]`` 同时表示需求与窗口余额。初始化时，它等于 ``t`` 中 ``ch`` 的数量；窗口加入字符后减一：

* ``need[ch] > 0``：窗口仍缺少该字符；
* ``need[ch] == 0``：窗口恰好满足该字符需求；
* ``need[ch] < 0``：窗口含有多余副本。

``missing`` 记录所有字符副本的总缺口，初始为 ``t.length``。加入字符前若 ``need[ch] > 0``，
该字符填补了一个真实缺口，所以 ``missing`` 减一；多余副本不改变 ``missing``。

窗口收缩
~~~~~~~~

当 ``missing == 0`` 时，当前窗口已经覆盖 ``t``。算法先提交当前长度，再移除左端字符：

.. code-block:: text

   ++need[removed]

若更新后的 ``need[removed] > 0``，窗口从满足需求变成缺少一个副本，``missing`` 增加，收缩结束。
若值仍不大于 0，移除的只是多余副本，窗口仍然可行，可以继续缩短。

状态跟踪
~~~~~~~~

以 ``s = "CABAA"``、``t = "AABC"`` 为例：

.. list-table::
   :header-rows: 1

   * - 加入字符
     - 关键余额
     - ``missing``
     - 窗口状态
   * - ``C``
     - ``C: 0``
     - 3
     - 缺两个 A 和一个 B
   * - ``A``
     - ``A: 1``
     - 2
     - 缺一个 A 和一个 B
   * - ``B``
     - ``B: 0``
     - 1
     - 只缺一个 A
   * - ``A``
     - ``A: 0``
     - 0
     - ``CABA`` 可行

此时移除左端 ``C`` 后，``need['C']`` 重新变为正数，窗口立即失效。因此 ``CABA`` 是该右端点对应的最短可行窗口。

复杂度
~~~~~~

暴力方法最坏时间为 ``O(|s|^3)``。两种滑动窗口方法中，左右指针都只单调经过 ``s`` 一次，
初始化需求需要 ``O(|t|)``，总时间为 ``O(|s| + |t|)``。

英文字母属于固定大小字符集，频次数组占用常量空间；除返回字符串外，额外空间为 ``O(1)``。
