0087. Scramble String
=====================

题目信息
--------

:题号: 0087
:难度: Hard
:主题: 字符串、记忆化搜索、区间动态规划
:原题: `LeetCode 0087 <https://leetcode.com/problems/scramble-string/>`_
:重点: 从递归枚举切分，推导到三维状态缓存与区间动态规划

题目重述
--------

给定两个字符串 ``s1`` 和 ``s2``。对一个长度大于 1 的字符串，可以在任意位置把它切成两个非空子串，
然后选择保持左右顺序或交换左右子串，再对两个子串递归执行相同操作。

判断 ``s2`` 能否由 ``s1`` 经过上述操作得到。两个字符串只包含小写英文字母，长度均不超过 30。

自建示例
--------

.. code-block:: text

   输入：s1 = "abc", s2 = "bca"
   输出：true

把 ``abc`` 切为 ``a | bc``，交换两个部分后得到 ``bc | a``，即 ``bca``。

.. code-block:: text

   输入：s1 = "abcd", s2 = "bdac"
   输出：false

两个字符串字符频次相同，但不存在一棵递归切分树，使每个节点都能通过保持或交换两个孩子完成对应。

.. code-block:: text

   输入：s1 = "great", s2 = "rgeat"
   输出：true

可以把 ``great`` 切为 ``gr | eat``。左侧 ``gr`` 交换为 ``rg``，右侧 ``eat`` 保持不变。

C++ 实现
--------

.. code-block:: cpp

   #include <array>
   #include <string>
   #include <vector>

   class Solution {
   private:
       std::string first;
       std::string second;
       std::vector<std::array<int, 26>> first_prefix;
       std::vector<std::array<int, 26>> second_prefix;
       std::vector<std::vector<std::vector<int>>> memo;

       void buildPrefixCounts() {
           int n = static_cast<int>(first.size());
           first_prefix.assign(n + 1, {});
           second_prefix.assign(n + 1, {});

           for (int index = 0; index < n; ++index) {
               first_prefix[index + 1] = first_prefix[index];
               second_prefix[index + 1] = second_prefix[index];
               ++first_prefix[index + 1][first[index] - 'a'];
               ++second_prefix[index + 1][second[index] - 'a'];
           }
       }

       bool sameCharacters(int first_start, int second_start, int length) const {
           for (int letter = 0; letter < 26; ++letter) {
               int first_count = first_prefix[first_start + length][letter] -
                                 first_prefix[first_start][letter];
               int second_count = second_prefix[second_start + length][letter] -
                                  second_prefix[second_start][letter];
               if (first_count != second_count) {
                   return false;
               }
           }
           return true;
       }

       bool equalRange(int first_start, int second_start, int length) const {
           for (int offset = 0; offset < length; ++offset) {
               if (first[first_start + offset] != second[second_start + offset]) {
                   return false;
               }
           }
           return true;
       }

       bool plainRecursion(int first_start, int second_start, int length) {
           if (equalRange(first_start, second_start, length)) {
               return true;
           }
           if (!sameCharacters(first_start, second_start, length)) {
               return false;
           }

           for (int split = 1; split < length; ++split) {
               bool keep_order =
                   plainRecursion(first_start, second_start, split) &&
                   plainRecursion(first_start + split,
                                  second_start + split,
                                  length - split);

               bool swap_order =
                   plainRecursion(first_start,
                                  second_start + length - split,
                                  split) &&
                   plainRecursion(first_start + split,
                                  second_start,
                                  length - split);

               if (keep_order || swap_order) {
                   return true;
               }
           }
           return false;
       }

       bool memoizedRecursion(int first_start, int second_start, int length) {
           int& cached = memo[first_start][second_start][length];
           if (cached != -1) {
               return cached == 1;
           }

           if (equalRange(first_start, second_start, length)) {
               cached = 1;
               return true;
           }
           if (!sameCharacters(first_start, second_start, length)) {
               cached = 0;
               return false;
           }

           for (int split = 1; split < length; ++split) {
               bool keep_order =
                   memoizedRecursion(first_start, second_start, split) &&
                   memoizedRecursion(first_start + split,
                                     second_start + split,
                                     length - split);

               bool swap_order =
                   memoizedRecursion(first_start,
                                     second_start + length - split,
                                     split) &&
                   memoizedRecursion(first_start + split,
                                     second_start,
                                     length - split);

               if (keep_order || swap_order) {
                   cached = 1;
                   return true;
               }
           }

           cached = 0;
           return false;
       }

       bool intervalDp(const std::string& s1, const std::string& s2) {
           int n = static_cast<int>(s1.size());
           std::vector<std::vector<std::vector<char>>> dp(
               n,
               std::vector<std::vector<char>>(
                   n,
                   std::vector<char>(n + 1, false)));

           for (int first_start = 0; first_start < n; ++first_start) {
               for (int second_start = 0; second_start < n; ++second_start) {
                   dp[first_start][second_start][1] =
                       s1[first_start] == s2[second_start];
               }
           }

           for (int length = 2; length <= n; ++length) {
               for (int first_start = 0; first_start + length <= n; ++first_start) {
                   for (int second_start = 0;
                        second_start + length <= n;
                        ++second_start) {
                       for (int split = 1; split < length; ++split) {
                           bool keep_order =
                               dp[first_start][second_start][split] &&
                               dp[first_start + split]
                                 [second_start + split]
                                 [length - split];

                           bool swap_order =
                               dp[first_start]
                                 [second_start + length - split]
                                 [split] &&
                               dp[first_start + split]
                                 [second_start]
                                 [length - split];

                           if (keep_order || swap_order) {
                               dp[first_start][second_start][length] = true;
                               break;
                           }
                       }
                   }
               }
           }

           return dp[0][0][n];
       }

   public:
       bool isScramble(std::string s1, std::string s2) {
           if (s1.size() != s2.size()) {
               return false;
           }

           first = s1;
           second = s2;
           int n = static_cast<int>(first.size());

           buildPrefixCounts();
           memo.assign(
               n,
               std::vector<std::vector<int>>(
                   n,
                   std::vector<int>(n + 1, -1)));

           return memoizedRecursion(0, 0, n);
       }
   };

题解
----

递归切分
~~~~~~~~

一个扰乱过程可以看成一棵二叉树。树中每个节点保存一段字符串，并在某个位置切成左右两个非空部分。
根节点对子节点只有两种安排：保持左右顺序，或交换左右顺序。

令状态 ``solve(i, j, length)`` 表示：

.. code-block:: text

   s1[i : i + length]

能否扰乱成：

.. code-block:: text

   s2[j : j + length]

在 ``split`` 处分割第一个区间后，保持顺序时需要同时满足：

.. code-block:: text

   solve(i,         j,         split)
   solve(i + split, j + split, length - split)

交换顺序时，第一个区间左侧应对应第二个区间末尾同样长的部分：

.. code-block:: text

   solve(i,         j + length - split, split)
   solve(i + split, j,                  length - split)

只要某个切分点的一种安排中两个子状态都成立，当前状态就成立。

必要条件剪枝
~~~~~~~~~~~~

扰乱操作只改变子串位置，不会改变字符多重集。两个对应区间的字符频次不同，当前状态必定失败。

逐状态重新扫描区间会产生额外重复。前缀频次数组保存每个字符在任意前缀中的出现次数，区间频次可由两次前缀相减得到，
每次剪枝只需比较 26 个字符。

两个区间内容完全相同时，可以直接返回成功，不必继续枚举切分点。剪枝顺序因此是：

.. code-block:: text

   区间完全相等 -> 成功
   字符频次不同 -> 失败
   其余情况     -> 枚举切分点

重复状态
~~~~~~~~

不同的上层切分可能到达相同的 ``(i, j, length)``。朴素递归会反复求解这些区间，搜索树随长度快速膨胀。

三维缓存为每个状态保存未知、失败、成功三种结果。失败状态同样必须缓存，否则大量无法匹配的区间仍会被重复搜索。

区间动态规划
~~~~~~~~~~~~

记忆化搜索按需要访问状态。自底向上的写法使用同一个三维定义：

.. code-block:: text

   dp[i][j][length]

长度为 1 时，只需比较两个字符。长度大于 1 的状态只依赖两个更短区间，因此按 ``length`` 从小到大填表即可。

两种写法拥有相同的状态和转移。记忆化搜索能利用频次剪枝跳过大量不可达状态，通常更直接；区间 DP 没有递归调用，遍历顺序更固定。

正确性
~~~~~~

任意合法扰乱树的根节点必有一个切分点，并且根节点只可能保持或交换两个孩子。算法枚举全部切分点和这两种安排，
因此合法扰乱不会遗漏。

反过来，算法只有在某个切分点的两个子状态都成立时才返回成功。把两个子状态对应的合法扰乱树连接到当前根节点，
即可构造当前区间的合法扰乱树，因此不会产生错误的成功结果。

复杂度
~~~~~~

状态数为 ``O(n^3)``，每个状态最多枚举 ``O(n)`` 个切分点，记忆化搜索和区间 DP 的时间上界均为 ``O(n^4)``。
前缀频次剪枝每次比较固定 26 个字符，不改变渐进复杂度。

三维缓存或 DP 表使用 ``O(n^3)`` 空间；记忆化搜索的递归深度为 ``O(n)``。朴素递归没有缓存，最坏呈指数增长。
