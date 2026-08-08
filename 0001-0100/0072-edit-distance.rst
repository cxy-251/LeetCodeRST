0072. Edit Distance
===================

题目信息
--------

:题号: 0072. 编辑距离
:难度: Medium
:主题: 字符串、动态规划、状态压缩
:原题: `LeetCode 0072 <https://leetcode.com/problems/edit-distance/>`_
:重点: 从枚举编辑序列，推导到前缀最优状态，再压缩为一行

题目重述
--------

给定两个字符串 ``word1`` 和 ``word2``，允许对 ``word1`` 重复执行以下操作：

* 插入一个字符；
* 删除一个字符；
* 替换一个字符。

返回把 ``word1`` 转换成 ``word2`` 所需的最少操作次数。

字符串长度可以为 0，最大为 500；字符串只包含小写英文字母。

自建示例
--------

.. code-block:: text

   输入：word1 = "abc", word2 = "yabd"
   输出：2

先在开头插入 ``y``，再把 ``c`` 替换为 ``d``。

.. code-block:: text

   输入：word1 = "stone", word2 = "money"
   输出：4

可以删除 ``s`` 和 ``t`` 得到 ``one``，再在首尾分别插入 ``m`` 和 ``y``。

.. code-block:: text

   输入：word1 = "", word2 = "code"
   输出：4

空串只能连续插入四个字符才能得到目标字符串。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <string>
   #include <vector>

   class Solution {
   private:
       int plainRecursion(
           const std::string& source,
           const std::string& target,
           int sourceLength,
           int targetLength
       ) {
           if (sourceLength == 0) {
               return targetLength;
           }
           if (targetLength == 0) {
               return sourceLength;
           }

           if (source[sourceLength - 1] == target[targetLength - 1]) {
               return plainRecursion(
                   source,
                   target,
                   sourceLength - 1,
                   targetLength - 1
               );
           }

           int replaceCost = plainRecursion(
               source,
               target,
               sourceLength - 1,
               targetLength - 1
           );
           int deleteCost = plainRecursion(
               source,
               target,
               sourceLength - 1,
               targetLength
           );
           int insertCost = plainRecursion(
               source,
               target,
               sourceLength,
               targetLength - 1
           );

           return 1 + std::min({replaceCost, deleteCost, insertCost});
       }

       int memoDfs(
           const std::string& source,
           const std::string& target,
           int sourceLength,
           int targetLength,
           std::vector<std::vector<int>>& memo
       ) {
           if (sourceLength == 0) {
               return targetLength;
           }
           if (targetLength == 0) {
               return sourceLength;
           }

           int& cached = memo[sourceLength][targetLength];
           if (cached != -1) {
               return cached;
           }

           if (source[sourceLength - 1] == target[targetLength - 1]) {
               cached = memoDfs(
                   source,
                   target,
                   sourceLength - 1,
                   targetLength - 1,
                   memo
               );
               return cached;
           }

           int replaceCost = memoDfs(
               source,
               target,
               sourceLength - 1,
               targetLength - 1,
               memo
           );
           int deleteCost = memoDfs(
               source,
               target,
               sourceLength - 1,
               targetLength,
               memo
           );
           int insertCost = memoDfs(
               source,
               target,
               sourceLength,
               targetLength - 1,
               memo
           );

           cached = 1 + std::min({replaceCost, deleteCost, insertCost});
           return cached;
       }

       int memoizedDistance(
           const std::string& source,
           const std::string& target
       ) {
           int sourceLength = static_cast<int>(source.size());
           int targetLength = static_cast<int>(target.size());
           std::vector<std::vector<int>> memo(
               sourceLength + 1,
               std::vector<int>(targetLength + 1, -1)
           );
           return memoDfs(
               source,
               target,
               sourceLength,
               targetLength,
               memo
           );
       }

       int tableDp(
           const std::string& source,
           const std::string& target
       ) {
           int sourceLength = static_cast<int>(source.size());
           int targetLength = static_cast<int>(target.size());
           std::vector<std::vector<int>> dp(
               sourceLength + 1,
               std::vector<int>(targetLength + 1)
           );

           for (int i = 0; i <= sourceLength; ++i) {
               dp[i][0] = i;
           }
           for (int j = 0; j <= targetLength; ++j) {
               dp[0][j] = j;
           }

           for (int i = 1; i <= sourceLength; ++i) {
               for (int j = 1; j <= targetLength; ++j) {
                   if (source[i - 1] == target[j - 1]) {
                       dp[i][j] = dp[i - 1][j - 1];
                       continue;
                   }

                   int replaceCost = dp[i - 1][j - 1];
                   int deleteCost = dp[i - 1][j];
                   int insertCost = dp[i][j - 1];
                   dp[i][j] = 1 + std::min({
                       replaceCost,
                       deleteCost,
                       insertCost
                   });
               }
           }

           return dp[sourceLength][targetLength];
       }

       int rollingDp(
           const std::string& source,
           const std::string& target
       ) {
           if (target.size() > source.size()) {
               return rollingDp(target, source);
           }

           int sourceLength = static_cast<int>(source.size());
           int targetLength = static_cast<int>(target.size());
           std::vector<int> dp(targetLength + 1);

           for (int j = 0; j <= targetLength; ++j) {
               dp[j] = j;
           }

           for (int i = 1; i <= sourceLength; ++i) {
               int diagonal = dp[0];
               dp[0] = i;

               for (int j = 1; j <= targetLength; ++j) {
                   int up = dp[j];

                   if (source[i - 1] == target[j - 1]) {
                       dp[j] = diagonal;
                   } else {
                       int replaceCost = diagonal;
                       int deleteCost = up;
                       int insertCost = dp[j - 1];
                       dp[j] = 1 + std::min({
                           replaceCost,
                           deleteCost,
                           insertCost
                       });
                   }

                   diagonal = up;
               }
           }

           return dp[targetLength];
       }

   public:
       int minDistance(std::string word1, std::string word2) {
           return rollingDp(word1, word2);
       }
   };

题解
----

枚举编辑序列
~~~~~~~~~~~~

从两个字符串的末尾观察。若末字符相同，可以直接匹配它们，继续处理两侧更短的前缀。
末字符不同时，最后一次操作只有三种可能：替换、删除或插入。

朴素递归会分别尝试三种操作。多个操作序列会反复到达相同的前缀长度对，因而产生大量重复计算。

前缀状态
~~~~~~~~

定义 ``dp[i][j]`` 为把 ``word1`` 的前 ``i`` 个字符转换成 ``word2`` 的前 ``j`` 个字符所需的最少操作数。
具体操作历史不会影响剩余问题，前缀长度已经包含转移所需的全部信息。

当一侧前缀为空时，操作数由另一侧长度唯一确定：

.. code-block:: text

   dp[i][0] = i    删除 i 个字符
   dp[0][j] = j    插入 j 个字符

末操作分类
~~~~~~~~~~

若 ``word1[i-1]`` 与 ``word2[j-1]`` 相同，末字符无需编辑：

.. code-block:: text

   dp[i][j] = dp[i-1][j-1]

若末字符不同，三种操作与旧状态一一对应：

.. code-block:: text

   replace: dp[i-1][j-1]
   delete:  dp[i-1][j]
   insert:  dp[i][j-1]

   dp[i][j] = 1 + min(replace, delete, insert)

替换同时消耗两个末字符；删除只消耗源字符串末字符；插入目标末字符后，只需继续完成当前源前缀到更短目标前缀的转换。

记忆化消除重复
~~~~~~~~~~~~~~

递归状态只由 ``(i,j)`` 决定，共有 ``(m+1)(n+1)`` 个。为每个状态缓存第一次计算的结果后，后续递归直接复用，指数级搜索被压缩为有限状态图。

二维表格
~~~~~~~~

每个状态只依赖左上、上方和左方，因此可以按行从左到右填表。计算 ``dp[i][j]`` 时，这三个前驱状态都已经完成。

以 ``"abc"`` 转换为 ``"yabd"`` 为例，状态表为：

.. code-block:: text

       ""  y  a  b  d
   ""   0  1  2  3  4
   a    1  1  1  2  3
   b    2  2  2  1  2
   c    3  3  3  2  2

右下角的 2 对应一次插入和一次替换。

一维滚动
~~~~~~~~

逐行更新时，一维数组中的三个值分别表示：

* 覆盖前的 ``dp[j]`` 是二维表中的上方状态；
* 更新后的 ``dp[j-1]`` 是当前行左方状态；
* ``diagonal`` 保存覆盖前的左上状态。

当前格计算完成后，把旧上方值交给 ``diagonal``，供下一列使用。完整二维表因此压缩为一行。

较短字符串作为列
~~~~~~~~~~~~~~~~

滚动数组长度由列数决定。编辑距离在交换两个字符串后不变，因此先让较短字符串作为列，可把空间降为
``O(min(m,n))``。

正确性
~~~~~~

任意编辑序列的最后一步必然属于匹配、替换、删除或插入之一。删除最后一步后，剩余操作对应一个严格更小的前缀状态；若该前缀不是最优解，就能替换成更短序列并改进原方案。

状态转移枚举了所有可能的最后一步，并对每类取最优值，因此每个 ``dp[i][j]`` 都是对应前缀的最少编辑次数。最终状态 ``dp[m][n]`` 即为完整字符串的编辑距离。

复杂度
~~~~~~

设两个字符串长度分别为 ``m`` 和 ``n``：

* 朴素递归为指数级时间，递归深度为 ``O(m+n)``；
* 记忆化与二维 DP 的时间、空间均为 ``O(mn)``；
* 一维滚动 DP 的时间为 ``O(mn)``，空间为 ``O(min(m,n))``。
