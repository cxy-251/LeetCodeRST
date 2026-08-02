0567. Permutation in String
===========================

题目信息
--------

:题号: 0567
:难度: Medium
:主题: 小写字符串、排列、连续子串、字符频次
:原题: `LeetCode 0567 <https://leetcode.com/problems/permutation-in-string/>`_
:重点: s2 必须包含一个长度等于 s1 的连续窗口、窗口字符频次与 s1 完全相同、字符顺序可以不同

题目重述
--------

给定两个只含小写英文字母的字符串 ``s1`` 和 ``s2``，判断 ``s2`` 是否包含 ``s1`` 的某个排列作为连续子串。

也就是说，需要在 ``s2`` 中找到一个长度恰好等于 ``s1.length`` 的连续区间，使其中每个字符的出现次数与 ``s1`` 完全相同。不能从 ``s2`` 中跳过字符来组成非连续子序列。

自建示例
--------

存在乱序连续窗口：

.. code-block:: text

   输入：s1 = "abc"，s2 = "zzcabx"
   输出：true
   解释：s2 中的连续子串 "cab" 与 s1 含有相同字符及次数，是 s1 的一个排列。

字符存在但不连续：

.. code-block:: text

   输入：s1 = "xy"，s2 = "axby"
   输出：false
   解释：x 和 y 都存在，但没有长度为 2 的连续子串同时包含它们。

固定窗口比较字符频次
--------------------

排列只改变顺序，不改变字符频次，因此在 ``s2`` 上维护长度为 ``s1.size()`` 的滑动窗口。右端加入一个字符、窗口超长时移出左端，并维护两组 26 个字母的频次数组；当所有频次差为零时，窗口就是一个排列。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       bool checkInclusion(std::string s1, std::string s2) {
           if (s1.size() > s2.size()) return false;
           std::array<int, 26> need{};
           std::array<int, 26> window{};
           for (char character : s1) ++need[character - 'a'];

           int different = 0;
           for (int i = 0; i < 26; ++i) {
               if (need[i] != window[i]) ++different;
           }
           auto change = [&](int id, int delta) {
               if (window[id] == need[id]) ++different;
               window[id] += delta;
               if (window[id] == need[id]) --different;
           };

           for (int right = 0; right < static_cast<int>(s2.size()); ++right) {
               change(s2[right] - 'a', 1);
               if (right >= static_cast<int>(s1.size())) {
                   int left = right - static_cast<int>(s1.size());
                   change(s2[left] - 'a', -1);
               }
               if (different == 0) return true;
           }
           return false;
       }
   };

代码分析
--------

``different`` 只在某个字母频次从相等变为不等或反向变化时更新，窗口长度达到目标后，所有频次相等与存在排列完全等价。时间复杂度为 ``O(|s1|+|s2|)``，额外空间复杂度为 ``O(1)``。
