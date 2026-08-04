0049. Group Anagrams
====================

题目信息
--------

:题号: 0049
:难度: Medium
:主题: 字符串、哈希表、规范键、字符频次
:原题: `LeetCode 0049 <https://leetcode.com/problems/group-anagrams/>`_
:重点: 从反复比较是否为异位词，推导到为每个字符串计算唯一组签名并一次归组

题目重述
--------

给定一个字符串数组 ``strs``，其中每个字符串只包含小写英文字母。请把互为字母异位词的字符串放入同一组，
并返回所有分组。

两个字符串互为字母异位词，当且仅当它们包含完全相同的字母，并且每种字母的出现次数也完全相同。
字符串内部字母的排列顺序不影响所属分组。每个输入字符串都必须保留一次；若相同字符串在输入中出现多次，
结果中也必须保留相同次数。分组之间以及同一组内部的顺序均不限。

约束为 ``1 <= strs.length <= 10^4``、``0 <= strs[i].length <= 100``。

自建示例
--------

.. code-block:: text

   输入：strs = ["arc", "car", "rat", "tar", "elbow", "below", "arc", ""]
   输出：[["arc", "car", "arc"], ["rat", "tar"], ["elbow", "below"], [""]]

``"arc"`` 与 ``"car"`` 的三个字母及次数相同，因此属于同一组；输入中的第二个 ``"arc"`` 仍须保留。
空字符串的 26 种字母次数全为零，也有唯一签名。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <array>
   #include <string>
   #include <unordered_map>
   #include <utility>
   #include <vector>

   class Solution {
   private:
       bool haveSameFrequency(const std::string& first, const std::string& second) {
           if (first.size() != second.size()) return false;

           std::array<int, 26> count{};
           for (char ch : first) ++count[ch - 'a'];
           for (char ch : second) {
               if (--count[ch - 'a'] < 0) return false;
           }
           return true;
       }

       std::vector<std::vector<std::string>> pairwiseGrouping(
           const std::vector<std::string>& words
       ) {
           std::vector<std::vector<std::string>> groups;

           for (const std::string& word : words) {
               bool placed = false;
               for (auto& group : groups) {
                   if (!haveSameFrequency(word, group.front())) continue;
                   group.push_back(word);
                   placed = true;
                   break;
               }
               if (!placed) groups.push_back({word});
           }
           return groups;
       }

       std::vector<std::vector<std::string>> sortedSignatureGrouping(
           const std::vector<std::string>& words
       ) {
           std::unordered_map<std::string, int> groupIndex;
           std::vector<std::vector<std::string>> groups;

           for (const std::string& word : words) {
               std::string signature = word;
               std::sort(signature.begin(), signature.end());

               auto [it, inserted] = groupIndex.emplace(
                   signature,
                   static_cast<int>(groups.size())
               );
               if (inserted) groups.push_back({});
               groups[it->second].push_back(word);
           }
           return groups;
       }

       std::string buildFrequencySignature(const std::string& word) {
           std::array<int, 26> count{};
           for (char ch : word) ++count[ch - 'a'];

           std::string signature;
           for (int frequency : count) {
               signature.push_back('#');
               signature += std::to_string(frequency);
           }
           return signature;
       }

       std::vector<std::vector<std::string>> frequencySignatureGrouping(
           const std::vector<std::string>& words
       ) {
           std::unordered_map<std::string, int> groupIndex;
           std::vector<std::vector<std::string>> groups;

           for (const std::string& word : words) {
               std::string signature = buildFrequencySignature(word);
               auto [it, inserted] = groupIndex.emplace(
                   std::move(signature),
                   static_cast<int>(groups.size())
               );
               if (inserted) groups.push_back({});
               groups[it->second].push_back(word);
           }
           return groups;
       }

   public:
       std::vector<std::vector<std::string>> groupAnagrams(
           std::vector<std::string>& strs
       ) {
           return frequencySignatureGrouping(strs);
       }
   };

题解
----

直接方法：逐组询问是否属于同一类
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

最直接的做法是维护已经建立的分组。处理新字符串时，把它依次与每组的一个代表字符串比较：若字符频次相同，
就追加到该组；所有组都不匹配时再新建一组。

代表字符串足以判断组别，因为“互为异位词”是等价关系。同一组中的字符串都与代表具有相同的 26 维频次，
因此彼此也具有相同频次。

这个方法的问题不是判断错误，而是重复计算。若前面已经形成 ``g`` 个组，新字符串最坏要执行 ``g`` 次频次比较；
当大部分字符串互不相同时，组数会接近字符串数量，整体退化为平方级。

从比较关系改成计算组身份
~~~~~~~~~~~~~~~~~~~~~~~~

两两比较每次都在回答：

.. code-block:: text

   当前字符串与这个代表是否属于同一组？

更有效的方向是为每个字符串直接计算一个 ``signature``：

.. code-block:: text

   两个字符串互为异位词  <=>  两个 signature 完全相同

这样每个字符串只需计算一次签名，再通过哈希表直接找到所属分组，无需逐个尝试已有代表。

方法一：排序后的字符串作为签名
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

把字符串中的字符排序，所有排列差异都会被消除。例如：

.. code-block:: text

   arc -> acr
   car -> acr
   rat -> art

若两个字符串互为异位词，它们拥有相同的字符及次数，排序结果必然相同。反过来，排序结果相同意味着每个位置的字符
完全一致，因此原字符串的字符多重集合也一致。排序字符串由此成为充要的规范表示。

该方法简单且适用于字符集合不固定的情况。长度为 ``k`` 的字符串需要 ``O(k log k)`` 时间生成签名。

方法二：字符频次向量作为签名
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

本题只包含 26 个小写英文字母，可以直接建立固定长度频次数组：

.. code-block:: text

   count[0] 记录 a 的数量
   count[1] 记录 b 的数量
   ...
   count[25] 记录 z 的数量

两个字符串互为异位词，当且仅当这 26 个分量逐项相等。生成频次只需顺序扫描字符串，不需要排序。

C++ 的 ``unordered_map`` 默认不能直接把 ``std::array<int, 26>`` 作为键，因此代码把频次数组序列化成字符串。
每个分量前都加入 ``#`` 分隔符：

.. code-block:: text

   [1, 11, 0, ...] -> #1#11#0...
   [11, 1, 0, ...] -> #11#1#0...

不能直接把十进制数字无分隔地拼接，否则 ``[1,11]`` 与 ``[11,1]`` 都可能变成 ``111``，从而错误合组。

哈希表为什么只保存组下标
~~~~~~~~~~~~~~~~~~~~~~~~

``groupIndex[signature]`` 保存该签名对应的结果组下标。首次看到某个签名时，先在 ``groups`` 末尾建立空组，
再把新下标登记到哈希表；以后相同签名直接追加到原组。

也可以让哈希表直接保存 ``vector<string>``，最后再遍历哈希表搬运结果。保存组下标可以在读取输入时直接构造最终
二维数组，并且不会依赖哈希表的遍历顺序。

状态演化
~~~~~~~~

处理 ``["eat", "tea", "tan", "ate", ""]`` 时：

.. list-table::
   :header-rows: 1

   * - 字符串
     - 频次签名关系
     - 操作
   * - ``eat``
     - 首次出现
     - 建立组 0，加入 ``eat``
   * - ``tea``
     - 与 ``eat`` 相同
     - 加入组 0
   * - ``tan``
     - 首次出现
     - 建立组 1，加入 ``tan``
   * - ``ate``
     - 与 ``eat`` 相同
     - 加入组 0
   * - 空字符串
     - 26 项全为 0
     - 建立组 2

为什么分组不重不漏
~~~~~~~~~~~~~~~~~~

每个输入字符串在外层循环中恰好处理一次，并且只追加到一个签名对应的组，所以不会遗漏，也不会被额外复制。
相同字符串重复出现时，每次循环都会再次追加，因此输入中的重复次数完整保留。

同组字符串具有相同签名，也就具有相同的 26 项频次，必然互为异位词。不同组的签名至少有一个频次分量不同，
不可能互为异位词。因此哈希键建立的分区与题目要求的异位词分区完全一致。

复杂度来源
~~~~~~~~~~

设字符串数量为 ``n``，总字符数为 ``C``，最长字符串长度为 ``k``。

逐组比较在组数接近 ``n`` 时需要 ``O(n²k)`` 时间。排序签名方法需要
``O(sum(len(word) * log len(word)))`` 时间，可粗略写成 ``O(nk log k)``。

频次签名扫描全部字符需要 ``O(C)``，每个字符串还要序列化固定的 26 个计数，因此总时间为 ``O(C + n)``。
不计返回结果中的字符串存储，哈希键、分组索引和临时频次数组使用 ``O(n)`` 额外空间；26 维计数属于常量空间。
