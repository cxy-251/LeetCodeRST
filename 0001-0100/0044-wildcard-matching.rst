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

先把星号的选择完整写出来
~~~~~~~~~~~~~~~~~~~~~~~~

令 ``match(i, j)`` 表示字符串后缀 ``s[i:]`` 能否与模式后缀 ``p[j:]`` 完整匹配。

普通字符和 ``?`` 都只能消费一个字符串字符，并把两个下标同时加一。``*`` 的长度未知，可以把所有可能长度拆成
两个递归动作：

.. code-block:: text

   match(i, j + 1)      * 匹配空串，模式前进
   match(i + 1, j)      * 再吞一个字符，模式仍停在当前星号

第二个动作可以反复发生，所以已经覆盖 ``*`` 匹配一个、两个或更多字符的全部情况。两个分支都失败时，当前状态才
失败。

这个递归不会遗漏答案，因为任意合法匹配中的当前 ``*`` 要么长度为零，要么至少匹配一个字符；也不会接受错误答案，
因为每个递归动作都严格遵守通配符语义，并且模式结束时要求字符串也恰好结束。

指数级来自重复状态
~~~~~~~~~~~~~~~~~~

不同的星号长度分配可能重新到达同一对下标。例如前一个星号多吞一个字符、后一个星号少吞一个字符，后续仍可能进入
相同的 ``match(i, j)``。直接递归会再次计算整个后续搜索树。

状态只由两个下标决定，共有至多 ``(m + 1)(n + 1)`` 种。``memoizedSearch`` 为每个状态保存真假结果，第一次
求解后再次访问便直接返回。这样保留了递归推理，却把指数级重复压缩为 ``O(mn)`` 个状态。

把后缀递归改写成前缀动态规划
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

定义：

.. code-block:: text

   dp[i][j] = s 的前 i 个字符能否与 p 的前 j 个字符完整匹配

``dp[0][0]`` 为真。非空字符串不能由空模式匹配，所以 ``dp[i][0]`` 在 ``i > 0`` 时为假。空字符串只能由若干
连续 ``*`` 匹配，因此：

.. code-block:: text

   dp[0][j] = dp[0][j - 1] && p[j - 1] == '*'

普通字符或 ``?`` 若能匹配当前字符，只需检查左上角状态：

.. code-block:: text

   dp[i][j] = dp[i - 1][j - 1]

``*`` 仍对应两种互斥解释：

.. code-block:: text

   dp[i][j - 1]     当前 * 匹配空串
   dp[i - 1][j]     当前 * 至少匹配 s[i - 1]，并继续保留使用权

所以：

.. code-block:: text

   dp[i][j] = dp[i][j - 1] || dp[i - 1][j]

第二项不断从上一行传递，正是星号吞掉任意多个字符的表格形式。

为何整串匹配落在右下角
~~~~~~~~~~~~~~~~~~~~~~

状态中的 ``i`` 和 ``j`` 都表示已经消费的前缀长度。只有 ``dp[m][n]`` 同时消费完整字符串与完整模式，因此它才是
最终答案。中途某个 ``dp[i][j]`` 为真，只说明两个前缀匹配，不能据此接受剩余字符。

一维压缩必须保留三个方向
~~~~~~~~~~~~~~~~~~~~~~~~

二维转移只依赖：

* 当前行左侧 ``dp[i][j - 1]``；
* 上一行同列 ``dp[i - 1][j]``；
* 上一行左上角 ``dp[i - 1][j - 1]``。

用一维数组从左向右更新时：

* 更新前的 ``dp[j]`` 是上一行同列；
* 已更新的 ``dp[j - 1]`` 是当前行左侧；
* 变量 ``diagonal`` 保存被覆盖前的上一行左上角。

因此 ``*`` 可以直接使用 ``dp[j] || dp[j - 1]``，普通字符和 ``?`` 使用 ``diagonal``。每轮更新后，把原来的
``dp[j]`` 保存到 ``diagonal``，供下一列使用。若从右向左更新，当前行左侧尚未计算，星号转移就会失效。

一维状态演化
~~~~~~~~~~~~

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

初始时 ``*`` 可匹配空串。处理 ``a`` 后，``?`` 继承左上角真值；处理 ``b`` 后，末尾普通字符从左上角状态转移，
右下角最终为真。

连续星号与空字符串
~~~~~~~~~~~~~~~~~~

连续多个 ``*`` 不需要特殊合并。对空字符串初始化时，真值会沿着星号向右传播；对非空字符串，每个星号都遵循同一
转移。它们在语义上等价于一个星号，但保留原模式不会影响正确性。

``s`` 为空时不会进入外层更新，初始化后的 ``dp[n]`` 直接给出答案。``p`` 为空而 ``s`` 非空时，每处理一个字符
都会把 ``dp[0]`` 设为假，最终正确返回假。

复杂度分析
~~~~~~~~~~

设字符串长度为 ``m``，模式长度为 ``n``。

* 直接递归最坏会反复分配星号长度，时间呈指数增长，递归深度为 ``O(m + n)``；
* 记忆化搜索访问至多 ``(m + 1)(n + 1)`` 个状态，时间和缓存空间均为 ``O(mn)``；
* 二维动态规划时间 ``O(mn)``，表格空间 ``O(mn)``；
* 一维动态规划仍执行相同数量的转移，时间 ``O(mn)``，额外空间降为 ``O(n)``。
