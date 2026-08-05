0044. Wildcard Matching
=======================

题目信息
--------

:题号: 0044
:难度: Hard
:主题: 字符串、递归、记忆化搜索、动态规划
:原题: `LeetCode 0044 <https://leetcode.com/problems/wildcard-matching/>`_
:重点: 从星号长度枚举产生的重复状态，推导到二维前缀状态，并按依赖方向压缩为一维数组

题目重述
--------

给定字符串 ``s`` 和模式 ``p``，判断模式能否匹配整个字符串。

模式中的字符具有以下含义：

* 普通小写字母只能匹配相同字母；
* ``?`` 恰好匹配任意一个字符；
* ``*`` 可以匹配任意长度的字符序列，包括空序列。

只有字符串和模式都被完整消费时才算匹配成功，不能只匹配字符串中的某个子串。

``s`` 和 ``p`` 的长度均位于 ``[0, 2000]``。``s`` 只含小写英文字母，``p`` 只含小写英文字母、``?``
和 ``*``。

自建示例
--------

星号匹配多个字符：

.. code-block:: text

   输入：s = "cabxy", p = "c*?y"
   输出：true
   解释：c 匹配 c，* 匹配 "ab"，? 匹配 x，y 匹配 y。

星号匹配空串：

.. code-block:: text

   输入：s = "ab", p = "a*b"
   输出：true
   解释：* 可以不消费任何字符。

模式仍有字符未消费：

.. code-block:: text

   输入：s = "abcd", p = "a*d?"
   输出：false
   解释：d 匹配字符串末位后，模式中的 ? 已经没有字符可以匹配。

空字符串边界：

.. code-block:: text

   输入：s = "", p = "***"
   输出：true
   解释：每个 * 都取空串；若模式中含普通字符或 ?，结果则为 false。

C++ 实现
--------

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
   private:
       bool backtrack(
           const std::string& s,
           const std::string& p,
           int stringIndex,
           int patternIndex
       ) {
           if (patternIndex == static_cast<int>(p.size())) {
               return stringIndex == static_cast<int>(s.size());
           }

           if (p[patternIndex] == '*') {
               const bool matchEmpty = backtrack(
                   s,
                   p,
                   stringIndex,
                   patternIndex + 1
               );
               const bool matchOneMore =
                   stringIndex < static_cast<int>(s.size()) &&
                   backtrack(s, p, stringIndex + 1, patternIndex);
               return matchEmpty || matchOneMore;
           }

           if (stringIndex == static_cast<int>(s.size())) {
               return false;
           }
           if (p[patternIndex] != '?' && p[patternIndex] != s[stringIndex]) {
               return false;
           }
           return backtrack(s, p, stringIndex + 1, patternIndex + 1);
       }

       bool plainRecursive(const std::string& s, const std::string& p) {
           return backtrack(s, p, 0, 0);
       }

       bool memoDfs(
           const std::string& s,
           const std::string& p,
           int stringIndex,
           int patternIndex,
           std::vector<std::vector<int>>& memo
       ) {
           int& cached = memo[stringIndex][patternIndex];
           if (cached != -1) {
               return cached == 1;
           }

           bool answer = false;
           if (patternIndex == static_cast<int>(p.size())) {
               answer = stringIndex == static_cast<int>(s.size());
           } else if (p[patternIndex] == '*') {
               answer = memoDfs(
                   s,
                   p,
                   stringIndex,
                   patternIndex + 1,
                   memo
               );
               if (!answer && stringIndex < static_cast<int>(s.size())) {
                   answer = memoDfs(
                       s,
                       p,
                       stringIndex + 1,
                       patternIndex,
                       memo
                   );
               }
           } else if (
               stringIndex < static_cast<int>(s.size()) &&
               (p[patternIndex] == '?' || p[patternIndex] == s[stringIndex])
           ) {
               answer = memoDfs(
                   s,
                   p,
                   stringIndex + 1,
                   patternIndex + 1,
                   memo
               );
           }

           cached = answer ? 1 : 0;
           return answer;
       }

       bool memoizedSearch(const std::string& s, const std::string& p) {
           std::vector<std::vector<int>> memo(
               s.size() + 1,
               std::vector<int>(p.size() + 1, -1)
           );
           return memoDfs(s, p, 0, 0, memo);
       }

       bool twoDimensionalDp(const std::string& s, const std::string& p) {
           const int stringLength = static_cast<int>(s.size());
           const int patternLength = static_cast<int>(p.size());
           std::vector<std::vector<char>> dp(
               stringLength + 1,
               std::vector<char>(patternLength + 1, false)
           );

           dp[0][0] = true;
           for (int patternSize = 1; patternSize <= patternLength; ++patternSize) {
               if (p[patternSize - 1] == '*') {
                   dp[0][patternSize] = dp[0][patternSize - 1];
               }
           }

           for (int stringSize = 1; stringSize <= stringLength; ++stringSize) {
               for (int patternSize = 1;
                    patternSize <= patternLength;
                    ++patternSize) {
                   const char patternChar = p[patternSize - 1];
                   if (patternChar == '*') {
                       dp[stringSize][patternSize] =
                           dp[stringSize][patternSize - 1] ||
                           dp[stringSize - 1][patternSize];
                   } else if (
                       patternChar == '?' ||
                       patternChar == s[stringSize - 1]
                   ) {
                       dp[stringSize][patternSize] =
                           dp[stringSize - 1][patternSize - 1];
                   }
               }
           }
           return dp[stringLength][patternLength];
       }

       bool oneDimensionalDp(const std::string& s, const std::string& p) {
           const int patternLength = static_cast<int>(p.size());
           std::vector<char> dp(patternLength + 1, false);
           dp[0] = true;

           for (int patternSize = 1; patternSize <= patternLength; ++patternSize) {
               dp[patternSize] =
                   p[patternSize - 1] == '*' && dp[patternSize - 1];
           }

           for (char stringChar : s) {
               char diagonal = dp[0];
               dp[0] = false;

               for (int patternSize = 1;
                    patternSize <= patternLength;
                    ++patternSize) {
                   const char above = dp[patternSize];
                   const char patternChar = p[patternSize - 1];

                   if (patternChar == '*') {
                       dp[patternSize] =
                           dp[patternSize] || dp[patternSize - 1];
                   } else {
                       dp[patternSize] =
                           diagonal &&
                           (patternChar == '?' || patternChar == stringChar);
                   }
                   diagonal = above;
               }
           }
           return dp[patternLength];
       }

   public:
       bool isMatch(std::string s, std::string p) {
           return oneDimensionalDp(s, p);
       }
   };

题解
----

后缀递归状态
~~~~~~~~~~~~

令 ``match(i, j)`` 表示字符串后缀 ``s[i:]`` 能否与模式后缀 ``p[j:]`` 完整匹配。模式已经结束时，只有字符串也
恰好结束才能返回真。

普通字符和 ``?`` 都必须消费一个字符串字符，并把两个下标同时加一。普通字符还要求两者相等；若字符串已经结束，
这两类模式字符都无法继续匹配。

星号分支
~~~~~~~~

``*`` 的匹配长度未知，但所有长度都能由两个动作组成：

.. code-block:: text

   match(i, j + 1)      当前 * 匹配空串
   match(i + 1, j)      当前 * 再匹配一个字符

第二个动作保留模式下标 ``j``，因此可以连续发生，覆盖 ``*`` 匹配一个、两个或更多字符。任意合法匹配中的当前
``*`` 要么长度为零，要么至少消费一个字符，所以两个分支覆盖全部可能；每个动作也都严格遵守通配符语义。

重复状态
~~~~~~~~

不同星号之间可以用多种方式分配字符，却重新到达同一对下标 ``(i, j)``。直接递归会重复展开相同后缀搜索树，最坏
呈指数增长。

状态只由两个下标决定，总数至多为 ``(m + 1)(n + 1)``。``memoizedSearch`` 缓存每个状态的真假结果，使每个
``match(i, j)`` 至多求解一次，将时间降为 ``O(mn)``。

前缀动态规划
~~~~~~~~~~~~

把同一状态图改为自底向上计算：

.. code-block:: text

   dp[i][j] = s 的前 i 个字符能否与 p 的前 j 个字符完整匹配

``dp[0][0]`` 为真。普通字符或 ``?`` 匹配当前字符后，剩余问题就是两个前缀都去掉末位：

.. code-block:: text

   dp[i][j] = dp[i - 1][j - 1]

前提是 ``p[j - 1]`` 为 ``?``，或它等于 ``s[i - 1]``。

对于 ``*``，递归中的两个动作直接变为两个前缀状态：

.. code-block:: text

   dp[i][j - 1]     * 匹配空串
   dp[i - 1][j]     * 匹配当前字符，并继续保留使用权

因此：

.. code-block:: text

   dp[i][j] = dp[i][j - 1] || dp[i - 1][j]

第二项可以沿同一列向下传播，使一个星号匹配任意多个字符。最终答案是 ``dp[m][n]``，因为只有该状态同时消费完整
字符串与完整模式。

边界初始化
~~~~~~~~~~

空模式只能匹配空字符串，所以 ``dp[i][0]`` 在 ``i > 0`` 时均为假。空字符串只能由模式前缀中的全部星号匹配：

.. code-block:: text

   dp[0][j] = dp[0][j - 1] && p[j - 1] == '*'

连续星号无需合并，真值会在第一行逐个向右传播。若模式前缀中出现普通字符或 ``?``，后续状态都保持为假。

这组初始化也自然覆盖两个边界：``s`` 为空时直接读取第一行末端；``p`` 为空而 ``s`` 非空时，第一列始终为假。

一维压缩
~~~~~~~~

二维转移只依赖三个方向：当前行左侧、上一行同列和上一行左上角。用一维数组从左向右更新时：

* 更新前的 ``dp[j]`` 是上一行同列；
* 更新后的 ``dp[j - 1]`` 是当前行左侧；
* ``diagonal`` 保存上一行左上角。

于是星号使用 ``dp[j] || dp[j - 1]``，普通字符与 ``?`` 使用 ``diagonal``。更新当前格之前先保存原
``dp[j]``，再把它交给下一列作为新的 ``diagonal``。

从左向右的顺序不能颠倒：星号转移需要当前行已经计算出的左侧状态；若从右向左更新，``dp[j - 1]`` 仍属于上一行。
每处理一个字符串字符，还要把 ``dp[0]`` 设为假，因为非空字符串不能由空模式匹配。

状态演化
~~~~~~~~

对 ``s = "ab"``、``p = "*?b"``，数组下标表示模式前缀长度：

.. list-table::
   :header-rows: 1

   * - 已处理字符串前缀
     - ``dp[0]``
     - ``dp[1]``：``*``
     - ``dp[2]``：``*?``
     - ``dp[3]``：``*?b``
   * - ``""``
     - 真
     - 真
     - 假
     - 假
   * - ``"a"``
     - 假
     - 真
     - 真
     - 假
   * - ``"ab"``
     - 假
     - 真
     - 真
     - 真

第一行中星号匹配空串。处理 ``a`` 后，``?`` 从左上角真值转移；处理 ``b`` 后，末尾普通字符再次从左上角转移，
最终右下角为真。

代码演进
~~~~~~~~

``plainRecursive`` 直接枚举星号匹配空串或继续吞字符，完整表达匹配语义，但反复计算相同下标状态。

``memoizedSearch`` 保存后缀状态，将搜索树压缩为有限状态图。``twoDimensionalDp`` 改用前缀状态，自底向上计算同一组
依赖关系。``oneDimensionalDp`` 再利用每格只依赖三个方向，将表格压缩为一行；公开入口采用该方法。

复杂度分析
~~~~~~~~~~

设字符串长度为 ``m``，模式长度为 ``n``。

* 直接递归最坏会反复分配星号长度，时间呈指数增长，递归深度为 ``O(m + n)``；
* 记忆化搜索访问至多 ``(m + 1)(n + 1)`` 个状态，时间和缓存空间均为 ``O(mn)``；
* 二维动态规划时间为 ``O(mn)``，表格空间为 ``O(mn)``；
* 一维动态规划仍执行相同数量的转移，时间为 ``O(mn)``，额外空间降为 ``O(n)``。
