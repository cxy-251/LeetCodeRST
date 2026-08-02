0451. Sort Characters By Frequency
==================================

题目信息
--------

:题号: 0451
:难度: Medium
:主题: 字符串、字符频次、降序排列、并列顺序
:原题: `LeetCode 0451 <https://leetcode.com/problems/sort-characters-by-frequency/>`_
:重点: 相同字符必须集中出现、频次高者排在前面、频次相同时顺序任意、大小写字符不同

题目重述
--------

给定字符串 ``s``，重新排列其中全部字符，使字符按照出现频次从高到低排列，并返回重排后的字符串。

每个字符实例必须恰好使用一次，同一种字符在结果中会连续出现。若多个字符的频次相同，它们之间可以采用任意顺序。``s.length`` 位于 ``[1, 5 * 10^5]``，由大小写英文字母和数字组成；大小写视为不同字符。

自建示例
--------

存在频次并列：

.. code-block:: text

   输入：s = "cccAAbb"
   输出："cccAAbb"
   解释：c 出现 3 次，应排在最前；A 和 b 都出现 2 次，二者顺序可以交换，因此 cccbbAA 也合法。

所有字符频次相同：

.. code-block:: text

   输入：s = "2aB"
   输出：任意由 "2"、"a"、"B" 各一次组成的排列
   解释：三个字符频次均为 1，任何排列都满足降序频次要求。

统计频次后按块输出
------------------

结果只要求频次降序，并不要求同频字符的固定顺序，因此先统计每个字符出现次数，再把字符按照频次从高到低输出即可。字符总类数受输入字符集限制，题目中的大小写字母和数字可以直接用定长频次数组表示。

排序的是“字符种类”而不是每个字符实例；输出时一次追加该字符的完整频次，保证相同字符集中出现，同时避免对长度为 ``n`` 的字符串做逐字符比较排序。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::string frequencySort(std::string s) {
           std::array<int, 128> frequency{};
           for (unsigned char c : s) ++frequency[c];

           std::vector<std::pair<int, char>> groups;
           for (int c = 0; c < 128; ++c) {
               if (frequency[c] > 0) {
                   groups.push_back({frequency[c], static_cast<char>(c)});
               }
           }
           std::sort(groups.begin(), groups.end(),
                     [](const auto& left, const auto& right) {
                         return left.first > right.first;
                     });

           std::string result;
           result.reserve(s.size());
           for (const auto& [count, character] : groups) {
               result.append(count, character);
           }
           return result;
       }
   };

代码分析
--------

``groups`` 中每个元素代表一种字符，比较器只按频次降序，频次相同时保持任意顺序即可满足题意。统计、排序字符种类和生成结果分别耗时 ``O(n)``、``O(c log c)``、``O(n)``，其中 ``c`` 是不同字符数；额外空间为 ``O(c+n)``，后者来自返回字符串。
