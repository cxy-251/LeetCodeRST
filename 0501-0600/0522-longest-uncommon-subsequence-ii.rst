0522. Longest Uncommon Subsequence II
=====================================

题目信息
--------

:题号: 0522
:难度: Medium
:主题: 字符串数组、子序列、候选排除、重复字符串
:原题: `LeetCode 0522 <https://leetcode.com/problems/longest-uncommon-subsequence-ii/>`_
:重点: 候选必须是某个字符串的子序列且不是其他任何字符串的子序列、重复字符串会互相排除、返回最大长度

题目重述
--------

给定字符串数组 ``strs``。寻找一个字符串，使它是数组中某一个字符串的子序列，同时不是数组中其他任何字符串的子序列；返回所有这类不公共子序列中的最大长度。

若不存在符合条件的子序列，返回 ``-1``。同一个文本若在数组中出现多次，则它作为完整字符串时会是另一份相同字符串的子序列，不能直接成为不公共候选。只需返回长度，不返回具体字符串。

自建示例
--------

最长字符串不属于其他字符串：

.. code-block:: text

   输入：strs = ["abcd","abc","ab","xy"]
   输出：4
   解释："abcd" 是自身的子序列，但不是其他任一字符串的子序列，因此答案为其长度 4。

重复字符串使所有候选失效：

.. code-block:: text

   输入：strs = ["aa","aa","a"]
   输出：-1
   解释：每个 "aa" 都是另一份 "aa" 的子序列，而 "a" 又是 "aa" 的子序列，因此没有不公共子序列。

只需检验每个原字符串本身
------------------------

若某个字符串存在不公共子序列，取它的完整字符串本身即可得到不短于该候选的结果；因此只需把每个 ``strs[i]`` 当作候选，检查它是否是其他任何字符串的子序列。候选按长度降序检查，第一枚通过者就是最大长度。

检查时必须跳过自身，但不能跳过内容相同的另一项；重复字符串会互相包含，因而都不能通过。用双指针判断一个字符串是否为另一个字符串的子序列。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       bool isSubsequence(const std::string& candidate,
                          const std::string& source) {
           int i = 0;
           for (char character : source) {
               if (i < static_cast<int>(candidate.size()) &&
                   candidate[i] == character) {
                   ++i;
               }
           }
           return i == static_cast<int>(candidate.size());
       }

   public:
       int findLUSlength(std::vector<std::string>& strs) {
           std::vector<int> order(strs.size());
           std::iota(order.begin(), order.end(), 0);
           std::sort(order.begin(), order.end(),
                     [&](int left, int right) {
                         return strs[left].size() > strs[right].size();
                     });

           for (int i : order) {
               bool uncommon = true;
               for (int j = 0; j < static_cast<int>(strs.size()); ++j) {
                   if (i != j && isSubsequence(strs[i], strs[j])) {
                       uncommon = false;
                       break;
                   }
               }
               if (uncommon) return strs[i].size();
           }
           return -1;
       }
   };

代码分析
--------

完整字符串是其自身所有子序列中最长的一个，所以检验原字符串不会错过最优答案；跳过自身且保留重复项检查，准确表达“其他字符串”的约束。设字符串数为 ``m``、最大长度为 ``L``，排序后判断时间复杂度为 ``O(m^2 L)``，额外空间为 ``O(m)``。
