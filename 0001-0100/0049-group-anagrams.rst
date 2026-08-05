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

逐组比较基线
~~~~~~~~~~~~

最直接的做法是维护已经建立的分组。处理新字符串时，把它依次与每组的代表字符串比较；字符频次相同就加入该组，
所有组都不匹配时再新建一组。

代表字符串足以判断组别。异位词关系只取决于 26 种字符的出现次数，同一组中的字符串都与代表具有相同频次，
因此彼此也具有相同频次。

``pairwiseGrouping`` 正确地保留了每个输入元素，但会反复计算频次。若已经形成 ``g`` 个组，新字符串最坏需要执行
``g`` 次比较；当大部分字符串互不相同时，组数接近字符串数量，整体退化为平方级。

从比较到签名
~~~~~~~~~~~~

逐组比较反复询问“当前字符串与这个代表是否同组”。可以改为给每个字符串计算一次规范签名，并要求：

.. code-block:: text

   两个字符串互为异位词  <=>  两个签名完全相同

签名相同的字符串直接进入同一哈希桶，不再逐个尝试已有代表。算法的核心因此从两两判定变成构造能够完整表示字符
多重集合的键。

排序签名
~~~~~~~~

把字符串中的字符排序，排列顺序被消除。例如：

.. code-block:: text

   arc -> acr
   car -> acr
   rat -> art

异位词拥有相同字符及次数，排序结果必然相同；排序结果相同也说明每个字符及其次数完全一致。因此排序后的字符串是
异位词类别的充要签名。

``sortedSignatureGrouping`` 对每个字符串生成排序副本，再通过哈希表找到对应组。该方法简单，并且适用于字符集合不固定
的情况；长度为 ``k`` 的字符串需要 ``O(k log k)`` 时间生成签名。

频次签名
~~~~~~~~

本题字符集合固定为 26 个小写字母，可以直接使用频次数组：

.. code-block:: text

   count[0] 记录 a 的数量
   count[1] 记录 b 的数量
   ...
   count[25] 记录 z 的数量

两个字符串互为异位词，当且仅当 26 个分量逐项相等。生成频次只需扫描字符串，不再需要排序。

代码把频次数组序列化为字符串键。每个分量前加入 ``#`` 分隔符：

.. code-block:: text

   [1, 11, 0, ...] -> #1#11#0...
   [11, 1, 0, ...] -> #11#1#0...

分隔符保留了每个计数的边界；若直接连接十进制数字，``[1, 11]`` 与 ``[11, 1]`` 都可能变成 ``111``，从而把
不同频次向量错误地放入同一组。

签名分桶不变量
~~~~~~~~~~~~~~

``groupIndex[signature]`` 保存该签名对应的结果组下标。处理每个字符串时保持以下状态：

* ``groups`` 已经包含所有处理过的字符串，并且每个字符串恰好出现一次；
* ``groupIndex`` 中每个签名只对应一个组；
* 同一组中的字符串具有相同签名，不同组的签名不同。

首次看到某个签名时，在 ``groups`` 末尾建立新组，并登记它的下标；以后相同签名直接追加到原组。由于签名与字符
频次一一对应，同组字符串必然互为异位词，不同组至少有一个频次分量不同。

外层循环对每个输入字符串执行一次追加，因此不会遗漏或额外复制。相同字符串在输入中重复出现时，每次都会再次追加，
原有重复次数也被完整保留。空字符串的 26 项计数全为零，同样拥有唯一签名。

状态演化
~~~~~~~~

处理 ``["eat", "tea", "tan", "ate", ""]`` 时：

.. list-table::
   :header-rows: 1

   * - 字符串
     - 签名关系
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

哈希表只保存组下标，结果数组可以在读取输入时直接构造，也不依赖哈希表最终的遍历顺序。

代码演进
~~~~~~~~

``pairwiseGrouping`` 逐组寻找代表，逻辑直接，但相同频次被重复计算。

``sortedSignatureGrouping`` 为每个字符串建立排序规范键，把逐组搜索改为一次哈希查询。

``frequencySignatureGrouping`` 利用固定字符集合，以线性扫描生成频次签名。公开入口采用该方法，因为它避免了每个字符串
内部的排序。

复杂度分析
~~~~~~~~~~

设字符串数量为 ``n``，总字符数为 ``C``，最长字符串长度为 ``k``。

逐组比较在组数接近 ``n`` 时需要 ``O(n^2 k)`` 时间。排序签名方法需要
``O(sum(len(word) log len(word)))`` 时间，可粗略写成 ``O(nk log k)``。

频次签名扫描全部字符需要 ``O(C)``，每个字符串还要序列化固定的 26 个计数，因此总时间为 ``O(C + n)``。
不计返回结果中的字符串存储，哈希键和组索引使用 ``O(n)`` 额外空间；26 维计数属于常量空间。
