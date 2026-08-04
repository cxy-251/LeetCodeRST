0010. Regular Expression Matching
=================================

题目信息
--------

:题号: 0010
:难度: Hard
:主题: 字符串、递归、记忆化、动态规划
:原题: `LeetCode 0010 <https://leetcode.com/problems/regular-expression-matching/>`_
:重点: 从枚举星号重复次数，推导到后缀状态转移，再压缩动态规划的行状态

题目重述
--------

给定字符串 ``s`` 和模式 ``p``，判断模式能否匹配字符串的全部字符。

模式只包含小写英文字母、``.`` 和 ``*``：

* 小写字母只匹配与自身相同的一个字符；
* ``.`` 匹配任意一个字符；
* ``*`` 修饰它前面的模式元素，表示该元素可以连续出现零次或多次。

``*`` 不是独立通配符。匹配必须覆盖整个字符串，不能只匹配其中一段。字符串和模式长度都位于
``[1, 20]``，字符串只包含小写英文字母；题目保证每个 ``*`` 前都有可修饰的有效元素。

自建示例
--------

* 普通字符不足：``s = "aa"``、``p = "a"``，模式只消费一个字符，返回 ``false``；
* 星号重复多次：``s = "miss"``、``p = "mis*"``，``s*`` 消费两个 ``s``，返回 ``true``；
* 星号选择零次：``s = "b"``、``p = "a*b"``，``a*`` 不消费字符，返回 ``true``；
* 点号与星号组合：``s = "ab"``、``p = ".*"``，``.*`` 可以消费全部字符，返回 ``true``；
* 多组星号分配：``s = "aab"``、``p = "c*a*b"``，``c*`` 取零次、``a*`` 取两次，返回 ``true``；
* 完整匹配失败：``s = "cab"``、``p = "c.*d"``，末尾 ``d`` 无法匹配，返回 ``false``。

C++ 实现
--------

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
   private:
       bool firstMatches(const std::string& s, const std::string& p, int i, int j) {
           return i < static_cast<int>(s.size()) && (p[j] == s[i] || p[j] == '.');
       }

       bool directDfs(const std::string& s, const std::string& p, int i, int j) {
           if (j == static_cast<int>(p.size())) {
               return i == static_cast<int>(s.size());
           }
           const bool first = firstMatches(s, p, i, j);
           if (j + 1 < static_cast<int>(p.size()) && p[j + 1] == '*') {
               return directDfs(s, p, i, j + 2) || (first && directDfs(s, p, i + 1, j));
           }
           return first && directDfs(s, p, i + 1, j + 1);
       }

       bool memoDfs(const std::string& s, const std::string& p, int i, int j,
                    std::vector<std::vector<int>>& memo) {
           int& cached = memo[i][j];
           if (cached != -1) {
               return cached == 1;
           }
           bool answer = false;
           if (j == static_cast<int>(p.size())) {
               answer = i == static_cast<int>(s.size());
           } else {
               const bool first = firstMatches(s, p, i, j);
               if (j + 1 < static_cast<int>(p.size()) && p[j + 1] == '*') {
                   answer = memoDfs(s, p, i, j + 2, memo) ||
                       (first && memoDfs(s, p, i + 1, j, memo));
               } else {
                   answer = first && memoDfs(s, p, i + 1, j + 1, memo);
               }
           }
           cached = answer ? 1 : 0;
           return answer;
       }

       bool memoizedDfs(const std::string& s, const std::string& p) {
           std::vector<std::vector<int>> memo(s.size() + 1, std::vector<int>(p.size() + 1, -1));
           return memoDfs(s, p, 0, 0, memo);
       }

       bool bottomUp(const std::string& s, const std::string& p) {
           const int m = static_cast<int>(s.size());
           const int n = static_cast<int>(p.size());
           std::vector<std::vector<char>> dp(m + 1, std::vector<char>(n + 1, false));
           dp[m][n] = true;
           for (int i = m; i >= 0; --i) {
               for (int j = n - 1; j >= 0; --j) {
                   const bool first = i < m && (p[j] == s[i] || p[j] == '.');
                   if (j + 1 < n && p[j + 1] == '*') {
                       dp[i][j] = dp[i][j + 2] || (first && dp[i + 1][j]);
                   } else {
                       dp[i][j] = first && dp[i + 1][j + 1];
                   }
               }
           }
           return dp[0][0];
       }

       bool compressedDp(const std::string& s, const std::string& p) {
           const int m = static_cast<int>(s.size());
           const int n = static_cast<int>(p.size());
           std::vector<char> next(n + 1, false);
           next[n] = true;
           for (int j = n - 2; j >= 0; --j) {
               if (p[j + 1] == '*') {
                   next[j] = next[j + 2];
               }
           }
           for (int i = m - 1; i >= 0; --i) {
               std::vector<char> current(n + 1, false);
               for (int j = n - 1; j >= 0; --j) {
                   const bool first = p[j] == s[i] || p[j] == '.';
                   if (j + 1 < n && p[j + 1] == '*') {
                       current[j] = current[j + 2] || (first && next[j]);
                   } else {
                       current[j] = first && next[j + 1];
                   }
               }
               next.swap(current);
           }
           return next[0];
       }

   public:
       bool isMatch(std::string s, std::string p) {
           return compressedDp(s, p);
       }
   };

题解
----

原始分支
~~~~~~~~

没有 ``*`` 时，匹配过程只有一条路径：当前模式元素与当前字符匹配后，两边同时前进一步。
``*`` 使一个模式元素可以消费零个、一个或多个字符，算法必须决定每一组星号实际消费多少字符。

最直接的方法是从字符串下标 ``i`` 和模式下标 ``j`` 开始递归尝试。真正影响后续结果的不是此前采用了
哪些分支，而只是两个尚未处理的后缀，因此定义：

``match(i, j)`` 表示 ``s[i:]`` 能否被 ``p[j:]`` 完整匹配。

当 ``j`` 到达模式末尾时，只有 ``i`` 也到达字符串末尾才成功。字符串先耗尽时不能立即失败，因为剩余
模式可能由 ``a*b*c*`` 这类可以全部取零次的分组组成。

普通元素
~~~~~~~~

当前位置能够消费一个字符的条件为
``first = i < s.size() && (p[j] == s[i] || p[j] == '.')``。

若当前模式元素后面没有 ``*``，它必须恰好消费一个字符。只有 ``first`` 为真时，状态才能同时移动到
``(i + 1, j + 1)``。字母和 ``.`` 的差异只体现在 ``first`` 的计算中，后续转移完全相同。

星号转移
~~~~~~~~

若 ``p[j + 1] == '*'``，当前分组只有两种本质不同的选择：

* 出现零次：不消费字符串，跳过模式中的 ``元素 + *``，进入 ``(i, j + 2)``；
* 出现至少一次：先消费一个匹配字符，模式仍停在当前元素，进入 ``(i + 1, j)``。

第二条分支保留 ``j``，所以下一状态仍可继续消费或改选零次退出。它由此覆盖一次、两次以及更多次，
不需要单独枚举具体重复次数。转移统一为
``match(i, j) = match(i, j + 2) || (first && match(i + 1, j))``。

``directDfs`` 完整实现了这棵选择树。连续星号会产生大量不同的消费分配，例如 ``s = "aaaa"``、
``p = "a*a*"`` 中，多条路径会到达同一个 ``(i, j)``，因此朴素递归可能产生指数级重复计算。

后缀记忆
~~~~~~~~

``memoizedDfs`` 为每个 ``(i, j)`` 保存未计算、失败和成功三种状态。第一次进入一个后缀问题时展开递归，
之后再次到达同一状态时直接返回缓存结果。

字符串共有 ``m + 1`` 个后缀起点，模式共有 ``n + 1`` 个后缀起点，所以最多只有
``(m + 1)(n + 1)`` 个不同状态。记忆化没有改变递归转移，只删除了不同匹配路径对同一后缀的重复展开。

自底向上
~~~~~~~~

二维动态规划使用相同定义：``dp[i][j]`` 表示 ``s[i:]`` 与 ``p[j:]`` 是否完整匹配。基础状态
``dp[m][n] = true`` 表示两个后缀同时为空。

当前状态依赖 ``dp[i][j + 2]``、``dp[i + 1][j]`` 或 ``dp[i + 1][j + 1]``，所以 ``i`` 和 ``j``
都从大到小遍历。计算一个格子时，它右侧、下一行和右下方的状态已经得到结果。

当 ``i == m`` 时，``first`` 必定为假，普通模式元素不能再消费字符；星号分组仍可通过
``dp[m][j + 2]`` 选择零次。因此空字符串后缀无需单独写一套转移规则。

空间压缩
~~~~~~~~

计算第 ``i`` 行时只会读取当前行右侧的 ``dp[i][j + 2]``，以及下一行的 ``dp[i + 1][j]`` 和
``dp[i + 1][j + 1]``。更早的行不会再被使用，因此二维表可以压缩为两个一维数组：

* ``next[j]`` 保存下一行 ``dp[i + 1][j]``；
* ``current[j]`` 保存正在计算的 ``dp[i][j]``。

模式下标仍从右向左扫描，使 ``current[j + 2]`` 在使用前已经计算。完成一行后交换两个数组，旧的
``current`` 不再需要。

开始处理真实字符前，``next`` 先表示空字符串后缀 ``dp[m][j]``。只有形如 ``元素*`` 的连续分组可以
取零次并最终到达 ``dp[m][n]``，所以初始化同样从右向左传播 ``next[j + 2]``。

状态推演
~~~~~~~~

以 ``s = "aab"``、``p = "c*a*b"`` 为例：

.. list-table::
   :header-rows: 1

   * - 状态
     - 模式起点
     - 选择
     - 后继状态
   * - ``(0, 0)``
     - ``c*``
     - ``c`` 不匹配 ``a``，只能取零次
     - ``(0, 2)``
   * - ``(0, 2)``
     - ``a*``
     - 消费第一个 ``a``
     - ``(1, 2)``
   * - ``(1, 2)``
     - ``a*``
     - 再消费一个 ``a``
     - ``(2, 2)``
   * - ``(2, 2)``
     - ``a*``
     - ``b`` 不匹配 ``a``，结束重复
     - ``(2, 4)``
   * - ``(2, 4)``
     - ``b``
     - 同时消费字符和模式
     - ``(3, 5)``

最终状态 ``(3, 5)`` 的两个后缀都为空，因此整条匹配路径成功。星号每一步只做“退出分组”或“消费一个
并保留分组”两种选择，已经覆盖所有重复次数。

代码演进
~~~~~~~~

``directDfs`` 直接枚举星号分支，代码最接近匹配语义，瓶颈是不同路径反复计算相同后缀。

``memoizedDfs`` 增加二维缓存，每个 ``(i, j)`` 只展开一次，指数级搜索被压缩为有限状态图。

``bottomUp`` 删除递归调用和递归栈，按依赖方向显式填充全部后缀状态。

``compressedDp`` 观察到当前行只依赖自身右侧与下一行，删除完整二维表，只保留两个模式长度的一维数组。
公开入口采用这一方案。

复杂度分析
~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 主要代价
   * - 朴素递归
     - 最坏指数级
     - ``O(m + n)``
     - 重复展开相同后缀状态
   * - 记忆化递归
     - ``O(mn)``
     - ``O(mn)``
     - 保存全部状态，并使用递归栈
   * - 二维动态规划
     - ``O(mn)``
     - ``O(mn)``
     - 填充完整后缀状态表
   * - 一维动态规划
     - ``O(mn)``
     - ``O(n)``
     - 每次只保存当前行和下一行

其中 ``m`` 和 ``n`` 分别是字符串与模式长度。每个动态规划状态只执行常数次比较和布尔运算。

边界处理
~~~~~~~~

* 模式耗尽时，字符串也必须耗尽，体现完整匹配而非子串匹配；
* 字符串后缀为空时，剩余模式只有全部由可取零次的星号分组组成才可能成功；
* ``.`` 仍然必须消费一个真实字符，不能匹配空字符串；
* ``*`` 的零次分支跳过两个模式字符，重复分支只推进字符串位置；
* 模式由题目保证合法，代码不负责修复缺少前置元素的 ``*``。