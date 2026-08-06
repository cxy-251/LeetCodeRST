0097. Interleaving String
=========================

题目信息
--------

:题号: 0097
:难度: Medium
:主题: 字符串、记忆化搜索、二维动态规划、滚动数组
:原题: `LeetCode 0097 <https://leetcode.com/problems/interleaving-string/>`_
:重点: 从两个来源的递归选择，推导到以较短字符串为列的一维前缀状态

题目重述
--------

给定字符串 ``s1``、``s2`` 和 ``s3``，判断 ``s3`` 能否由 ``s1`` 与 ``s2`` 交错形成。

构造过程中必须满足：

* ``s1`` 中的字符全部使用一次，且相对顺序不变；
* ``s2`` 中的字符全部使用一次，且相对顺序不变；
* 每次从某个字符串的当前未使用字符中取一个，可以连续多次从同一字符串取字符；
* 最终得到的字符串必须恰好等于 ``s3``。

约束为 ``0 <= s1.length, s2.length <= 100``、``0 <= s3.length <= 200``，字符串只包含小写英文字母。

自建示例
--------

.. code-block:: text

   输入：s1 = "ab", s2 = "cd", s3 = "acbd"
   输出：true

可以依次取 ``a(s1), c(s2), b(s1), d(s2)``，两个来源内部的顺序都没有改变。

.. code-block:: text

   输入：s1 = "ab", s2 = "cd", s3 = "adcb"
   输出：false

目标中的 ``d`` 出现在 ``c`` 前面，但它们都来自 ``s2``，无法保持 ``s2`` 的原顺序。

.. code-block:: text

   输入：s1 = "", s2 = "xyz", s3 = "xyz"
   输出：true

一个来源为空时，另一个来源必须与目标完全相同。

C++ 实现
--------

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
   private:
       bool plainDfs(const std::string& first,
                     const std::string& second,
                     const std::string& target,
                     int i,
                     int j) {
           if (i == static_cast<int>(first.size()) &&
               j == static_cast<int>(second.size())) {
               return true;
           }

           int targetIndex = i + j;
           bool takeFirst =
               i < static_cast<int>(first.size()) &&
               first[i] == target[targetIndex] &&
               plainDfs(first, second, target, i + 1, j);

           bool takeSecond =
               j < static_cast<int>(second.size()) &&
               second[j] == target[targetIndex] &&
               plainDfs(first, second, target, i, j + 1);

           return takeFirst || takeSecond;
       }

       bool memoDfs(const std::string& first,
                    const std::string& second,
                    const std::string& target,
                    int i,
                    int j,
                    std::vector<std::vector<int>>& memo) {
           if (i == static_cast<int>(first.size()) &&
               j == static_cast<int>(second.size())) {
               return true;
           }

           int& cached = memo[i][j];
           if (cached != -1) return cached == 1;

           int targetIndex = i + j;
           bool possible = false;

           if (i < static_cast<int>(first.size()) &&
               first[i] == target[targetIndex]) {
               possible = memoDfs(first, second, target, i + 1, j, memo);
           }

           if (!possible &&
               j < static_cast<int>(second.size()) &&
               second[j] == target[targetIndex]) {
               possible = memoDfs(first, second, target, i, j + 1, memo);
           }

           cached = possible ? 1 : 0;
           return possible;
       }

       bool memoizedSearch(const std::string& first,
                           const std::string& second,
                           const std::string& target) {
           std::vector<std::vector<int>> memo(
               first.size() + 1,
               std::vector<int>(second.size() + 1, -1));
           return memoDfs(first, second, target, 0, 0, memo);
       }

       bool twoDimensionalDp(const std::string& first,
                             const std::string& second,
                             const std::string& target) {
           int m = static_cast<int>(first.size());
           int n = static_cast<int>(second.size());
           std::vector<std::vector<char>> dp(
               m + 1,
               std::vector<char>(n + 1, false));
           dp[0][0] = true;

           for (int i = 0; i <= m; ++i) {
               for (int j = 0; j <= n; ++j) {
                   if (i == 0 && j == 0) continue;

                   int targetIndex = i + j - 1;
                   bool fromFirst =
                       i > 0 &&
                       dp[i - 1][j] &&
                       first[i - 1] == target[targetIndex];
                   bool fromSecond =
                       j > 0 &&
                       dp[i][j - 1] &&
                       second[j - 1] == target[targetIndex];

                   dp[i][j] = fromFirst || fromSecond;
               }
           }

           return dp[m][n];
       }

       bool oneDimensionalDp(const std::string& first,
                             const std::string& second,
                             const std::string& target) {
           const std::string* rows = &first;
           const std::string* columns = &second;
           if (columns->size() > rows->size()) {
               const std::string* temporary = rows;
               rows = columns;
               columns = temporary;
           }

           int rowCount = static_cast<int>(rows->size());
           int columnCount = static_cast<int>(columns->size());
           std::vector<char> dp(columnCount + 1, false);
           dp[0] = true;

           for (int j = 1; j <= columnCount; ++j) {
               dp[j] = dp[j - 1] &&
                       (*columns)[j - 1] == target[j - 1];
           }

           for (int i = 1; i <= rowCount; ++i) {
               dp[0] = dp[0] &&
                       (*rows)[i - 1] == target[i - 1];

               for (int j = 1; j <= columnCount; ++j) {
                   int targetIndex = i + j - 1;
                   bool fromRows =
                       dp[j] &&
                       (*rows)[i - 1] == target[targetIndex];
                   bool fromColumns =
                       dp[j - 1] &&
                       (*columns)[j - 1] == target[targetIndex];
                   dp[j] = fromRows || fromColumns;
               }
           }

           return dp[columnCount];
       }

   public:
       bool isInterleave(std::string s1,
                         std::string s2,
                         std::string s3) {
           if (s1.size() + s2.size() != s3.size()) return false;
           return oneDimensionalDp(s1, s2, s3);
       }
   };

题解
----

长度守恒
~~~~~~~~

交错过程不会删除或复制字符，所以目标长度必须满足：

.. code-block:: text

   len(s3) = len(s1) + len(s2)

该条件不满足时可以立即返回 ``false``，也避免后续递归读取越界的目标下标。

递归选择
~~~~~~~~

设已经使用 ``s1`` 的前 ``i`` 个字符和 ``s2`` 的前 ``j`` 个字符。已生成目标前缀的长度必为
``i+j``，所以下一个目标字符是 ``s3[i+j]``。

当前只有两种合法动作：

.. code-block:: text

   s1[i] == s3[i+j] 时，从 s1 取一个字符，进入 (i+1, j)
   s2[j] == s3[i+j] 时，从 s2 取一个字符，进入 (i, j+1)

任一分支最终同时耗尽两个来源，就找到一种合法交错。两个当前字符都匹配时必须保留两条分支，不能贪心固定选择某一侧。

重复状态
~~~~~~~~

不同的取字符顺序可能到达相同的 ``(i,j)``。到达后，两个来源剩余后缀和目标剩余后缀完全相同，后续答案也相同。
裸递归会重复求解这些状态，最坏呈指数增长。

记忆化数组为每个 ``(i,j)`` 保存未知、失败、成功三种结果，使每个状态至多展开一次。状态数为
``(m+1)(n+1)``。

前缀动态规划
~~~~~~~~~~~~

把递归状态反向解释，定义：

.. code-block:: text

   dp[i][j] = s1 的前 i 个字符与 s2 的前 j 个字符
              能否组成 s3 的前 i+j 个字符

最后一个目标字符只可能来自两个位置之一：

.. code-block:: text

   从 s1 到达：dp[i-1][j] 且 s1[i-1] == s3[i+j-1]
   从 s2 到达：dp[i][j-1] 且 s2[j-1] == s3[i+j-1]

两个条件取逻辑或。``dp[0][0]=true`` 表示两个空前缀可以组成空目标；第一行只能连续使用 ``s2``，第一列只能连续使用
``s1``。

一维压缩
~~~~~~~~

二维状态的当前格只依赖上方和左侧：

* 更新前的 ``dp[j]`` 保存上一行的 ``dp[i-1][j]``；
* 从左向右更新后，``dp[j-1]`` 已保存当前行的 ``dp[i][j-1]``。

因此可以把表压缩成一行。遍历方向必须从左向右；若从右向左，``dp[j-1]`` 仍是上一行状态，便不再代表当前格的左侧来源。

令较短字符串作为列，可以把额外空间降到 ``O(min(m,n))``。交换两个来源不会改变问题，因为只要求分别保持各自内部顺序。

完整性
~~~~~~

从 ``dp[0][0]`` 出发，每次转移只追加一个与目标当前位置相同的来源字符，所以所有可达状态都对应合法交错前缀。

反过来，任意合法交错前缀的最后一个字符必来自 ``s1`` 或 ``s2``。删除这个字符后，必落到上方或左侧的前驱状态，因此转移不会遗漏任何方案。最终
``dp[m][n]`` 恰好表示两个来源全部使用后是否得到完整目标。

复杂度
~~~~~~

裸递归最坏为指数时间。记忆化搜索、二维 DP 和一维 DP 都处理 ``O(mn)`` 个状态，时间 ``O(mn)``。
记忆化与二维 DP 使用 ``O(mn)`` 空间；一维 DP 使用 ``O(min(m,n))`` 额外空间。
