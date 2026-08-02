0438. Find All Anagrams in a String
===================================

题目信息
--------

:题号: 0438
:难度: Medium
:主题: 小写字符串、异位词、固定长度子串、起始下标
:原题: `LeetCode 0438 <https://leetcode.com/problems/find-all-anagrams-in-a-string/>`_
:重点: 子串长度必须等于 ``p``、字符频次完全相同、返回所有零基起点、重叠结果也要保留

题目重述
--------

给定两个只包含小写英文字母的字符串 ``s`` 和 ``p``，找出 ``s`` 中所有与 ``p`` 互为字母异位词的连续子串，并返回这些子串在 ``s`` 中的零基起始下标。

异位词必须与 ``p`` 长度相同，并且每种字符的出现次数完全一致，只允许排列顺序不同。``s.length`` 和 ``p.length`` 均位于 ``[1, 3 * 10^4]``。合法子串可以彼此重叠；若 ``p`` 比 ``s`` 长，返回空数组。结果按扫描顺序自然递增。

自建示例
--------

唯一异位词位于末尾：

.. code-block:: text

   输入：s = "baaacb"，p = "abc"
   输出：[3]
   解释：从下标 3 开始的子串 acb 与 abc 的字符频次相同；其他长度为 3 的子串均不匹配。

重叠的异位词：

.. code-block:: text

   输入：s = "aaaa"，p = "aa"
   输出：[0,1,2]
   解释：三个长度为 2 的窗口都由两个 a 组成，即使它们互相重叠，也必须分别返回起点。

固定窗口维护字符频次差
------------------------

异位词窗口长度必须等于 ``p``。先记录 ``p`` 的需求频次，右指针加入字符，窗口超过长度时左指针移出字符；维护尚未满足的字符实例数 ``missing``，当它变为 0 时当前窗口频次恰好与 ``p`` 相同，记录左端下标。窗口每次只移动一格，因此重叠结果不会被跳过。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::vector<int> findAnagrams(std::string s, std::string p) {
           if (p.size() > s.size()) return {};
           std::array<int, 26> need{};
           std::array<int, 26> window{};
           for (char c : p) ++need[c - 'a'];
           int missing = static_cast<int>(p.size());
           std::vector<int> result;

           for (int right = 0;
                right < static_cast<int>(s.size()); ++right) {
               int id = s[right] - 'a';
               if (window[id] < need[id]) --missing;
               ++window[id];

               if (right >= static_cast<int>(p.size())) {
                   int leftId = s[right - p.size()] - 'a';
                   if (window[leftId] <= need[leftId]) ++missing;
                   --window[leftId];
               }
               if (missing == 0) {
                   result.push_back(right
                       - static_cast<int>(p.size()) + 1);
               }
           }
           return result;
       }
   };

代码分析
--------

加入字符只在它尚未超过需求时减少 ``missing``，移出字符只在它原本满足需求时恢复 ``missing``；窗口长度固定后，``missing == 0`` 等价于两组频次完全相同。时间复杂度为 ``O(|s| + |p|)``，额外空间为固定的 ``O(1)``。
