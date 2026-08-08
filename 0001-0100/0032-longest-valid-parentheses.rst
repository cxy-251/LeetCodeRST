0032. Longest Valid Parentheses
===============================

题目信息
--------

:题号: 0032. 最长有效括号
:难度: Hard
:主题: 字符串、栈、动态规划、双向扫描
:原题: `LeetCode 0032 <https://leetcode.com/problems/longest-valid-parentheses/>`_
:重点: 从逐起点验证推导到维护失效边界，并复用以当前位置结束的最长有效段

题目重述
--------

给定一个只包含 ``(`` 和 ``)`` 的字符串 ``s``，返回其中最长有效括号连续子串的长度。

一个连续子串有效，当且仅当其中每个左括号都由后面的右括号闭合，并且从子串左端开始扫描时，任意前缀中的
右括号数量都不超过左括号数量。答案必须来自原字符串中的连续区间，不能跳过字符重新拼接。

字符串长度位于 ``[0, 3 * 10^4]``。空字符串、全为左括号或全为右括号时，答案均为 ``0``。

自建示例
--------

* 多段连接：``s = "()(())"``，返回 ``6``；末尾的 ``(())`` 与前面的 ``()`` 连成完整区间；
* 多余右括号：``s = ")(()())"``，返回 ``6``；下标 ``0`` 是任何有效区间都不能跨越的边界；
* 多余左括号：``s = "(()(()"``，返回 ``2``；只有中间的 ``()`` 完整闭合；
* 相邻有效段：``s = "()(()())"``，返回 ``8``；局部配对完成后还要连接左侧有效段；
* 无法形成配对：``s = "((("``，返回 ``0``。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <string>
   #include <vector>

   class Solution {
   private:
       int enumerateStarts(const std::string& s) {
           int best = 0;
           for (int start = 0; start < static_cast<int>(s.size()); ++start) {
               int balance = 0;
               for (int end = start; end < static_cast<int>(s.size()); ++end) {
                   balance += s[end] == '(' ? 1 : -1;
                   if (balance < 0) break;
                   if (balance == 0) {
                       best = std::max(best, end - start + 1);
                   }
               }
           }
           return best;
       }

       int indexStack(const std::string& s) {
           std::vector<int> boundaries{-1};
           int best = 0;

           for (int index = 0; index < static_cast<int>(s.size()); ++index) {
               if (s[index] == '(') {
                   boundaries.push_back(index);
                   continue;
               }

               boundaries.pop_back();
               if (boundaries.empty()) {
                   boundaries.push_back(index);
               } else {
                   best = std::max(best, index - boundaries.back());
               }
           }
           return best;
       }

       int dynamicProgramming(const std::string& s) {
           std::vector<int> dp(s.size(), 0);
           int best = 0;

           for (int index = 1; index < static_cast<int>(s.size()); ++index) {
               if (s[index] == '(') continue;

               if (s[index - 1] == '(') {
                   dp[index] = 2;
                   if (index >= 2) {
                       dp[index] += dp[index - 2];
                   }
               } else {
                   const int opening = index - dp[index - 1] - 1;
                   if (opening >= 0 && s[opening] == '(') {
                       dp[index] = dp[index - 1] + 2;
                       if (opening >= 1) {
                           dp[index] += dp[opening - 1];
                       }
                   }
               }
               best = std::max(best, dp[index]);
           }
           return best;
       }

       int bidirectionalCounters(const std::string& s) {
           int best = 0;
           int left = 0;
           int right = 0;

           for (char current : s) {
               current == '(' ? ++left : ++right;
               if (left == right) {
                   best = std::max(best, 2 * right);
               } else if (right > left) {
                   left = 0;
                   right = 0;
               }
           }

           left = 0;
           right = 0;
           for (int index = static_cast<int>(s.size()) - 1; index >= 0; --index) {
               s[index] == '(' ? ++left : ++right;
               if (left == right) {
                   best = std::max(best, 2 * left);
               } else if (left > right) {
                   left = 0;
                   right = 0;
               }
           }
           return best;
       }

   public:
       int longestValidParentheses(std::string s) {
           return dynamicProgramming(s);
       }
   };

题解
----

逐起点余额
~~~~~~~~~~

固定起点 ``start`` 后，向右扫描并维护余额：左括号使余额加一，右括号使余额减一。余额为零时，左右括号数量
相等；此前余额从未为负，因此区间 ``[start,end]`` 有效。

余额首次变为负数时，当前前缀已经包含无法匹配的右括号。继续延长仍会保留这个非法前缀，所以同一起点不可能
再产生有效区间，可以立即停止。

``enumerateStarts`` 按定义检查每个起点，正确性直接，但不同起点会反复读取相同后缀，最坏时间为
``O(n²)``。继续优化需要保存已经发现的非法边界或有效区间，而不是重新计算余额。

失效边界与下标栈
~~~~~~~~~~~~~~~~

对一个以当前位置结束的有效后缀，真正决定其左边界的是最近一个不能跨越的位置：

* 尚未匹配的左括号；跨过它会使区间内左括号过多；
* 无法匹配的右括号；跨过它会使某个前缀右括号过多。

``indexStack`` 用下标栈保存这些边界，初始放入 ``-1``，表示字符串开头之前的虚拟边界。遇到左括号时压入
下标；遇到右括号时先弹出一个位置，尝试匹配最近的未匹配左括号。

若弹出后栈为空，当前右括号无法匹配，它成为新的失效边界。若栈仍非空，当前右括号成功完成一层配对，栈顶
就是当前有效后缀左侧最近的不可跨越位置，因此长度为：

.. code-block:: text

   index - boundaries.back()

栈顶之后不存在未匹配括号，跨过栈顶又必然破坏合法性，所以该长度恰好是以 ``index`` 结束的最长有效后缀。
每个下标最多入栈、出栈一次，时间降为 ``O(n)``。

结束位置状态
~~~~~~~~~~~~

下标栈保存全部未匹配边界。动态规划改为只保存每个结束位置的最优结果：

.. code-block:: text

   dp[i] = 以 s[i] 结尾的最长有效括号子串长度

左括号不能结束有效括号串，因此 ``s[i] == '('`` 时 ``dp[i] = 0``。当 ``s[i] == ')'`` 时，只需处理两种
末尾结构。

直接配对
~~~~~~~~

若 ``s[i - 1] == '('``，末尾两个字符直接形成 ``()``。它们左侧若紧邻一个以 ``i - 2`` 结束的有效段，两个
区间可以连接：

.. code-block:: text

   dp[i] = 2 + dp[i - 2]

下标越界时把前段长度视为零。例如 ``()()`` 的最后一对闭合后，需要连接前面的 ``()``，得到长度 ``4``。

包裹前段
~~~~~~~~

若 ``s[i - 1] == ')'``，前一位置可能已经结束一段长度为 ``dp[i - 1]`` 的有效区间。当前右括号若要继续向左
扩展，只能跳过这段完整区间，再检查其前一个字符：

.. code-block:: text

   opening = i - dp[i - 1] - 1

若 ``opening`` 越界或 ``s[opening]`` 不是左括号，当前右括号不能形成更长有效后缀。若该位置是左括号，它与
当前右括号包住前一段有效区间，先得到：

.. code-block:: text

   dp[i - 1] + 2

新形成的区间左侧还可能紧邻另一段有效括号，因此继续连接 ``dp[opening - 1]``：

.. code-block:: text

   dp[i] = dp[i - 1] + 2 + dp[opening - 1]

这里没有跨过非法字符。``dp[i - 1]`` 只覆盖紧贴 ``i - 1`` 的有效段，``opening`` 是跳过该段后的相邻字符；
``dp[opening - 1]`` 也只吸收紧贴 ``opening`` 左侧的有效段。整个转移始终由连续相邻区间组成。

状态演化
~~~~~~~~

以 ``s = "()(())"`` 为例：

.. list-table::
   :header-rows: 1

   * - ``i``
     - 字符
     - ``dp[i]``
     - 状态来源
   * - 0
     - ``(``
     - 0
     - 左括号不能结束有效串
   * - 1
     - ``)``
     - 2
     - 下标 0 与 1 直接配对
   * - 2
     - ``(``
     - 0
     - 左括号不能结束有效串
   * - 3
     - ``(``
     - 0
     - 左括号不能结束有效串
   * - 4
     - ``)``
     - 2
     - 下标 3 与 4 直接配对
   * - 5
     - ``)``
     - 6
     - 跳过 ``dp[4]=2``，与下标 2 配对，再连接 ``dp[1]=2``

最后一步若只计算 ``dp[4] + 2``，只能得到 ``(())`` 的长度 ``4``。连接 ``dp[1]`` 后，才得到完整连续区间
``()(())`` 的长度 ``6``。

双向计数
~~~~~~~~

若只需要最长长度，不需要恢复区间边界，还可以只维护左右括号数量。

从左向右扫描时，``right > left`` 表示出现无法匹配的右括号，当前段不能再延伸，计数清零；
``left == right`` 表示当前重置点之后形成有效区间，用 ``2 * right`` 更新答案。

单次正向扫描无法处理末尾多余左括号，例如 ``(()``。因此再从右向左对称扫描：此时 ``left > right`` 表示
无法匹配的左括号，需要清零；两者相等时用 ``2 * left`` 更新答案。两个方向共同覆盖多余右括号和多余左括号
形成的边界，额外空间降为 ``O(1)``。

方法演进
~~~~~~~~

``enumerateStarts`` 为每个起点重新计算余额。``indexStack`` 把重复扫描压缩为未匹配边界，使每个字符只处理一次。

``dynamicProgramming`` 将问题改写为“以每个位置结束的最长有效段”，通过前一有效段、配对左括号和左侧相邻段
复用已经完成的区间。公开入口采用该方法，因为状态与转移都直接对应连续区间。

``bidirectionalCounters`` 进一步放弃具体边界，只保存两类括号数量，以两个扫描方向换取常数空间。

复杂度分析
~~~~~~~~~~

设字符串长度为 ``n``。

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
   * - 逐起点余额
     - ``O(n²)``
     - ``O(1)``
   * - 下标栈
     - ``O(n)``
     - ``O(n)``
   * - 动态规划
     - ``O(n)``
     - ``O(n)``
   * - 双向计数
     - ``O(n)``
     - ``O(1)``

动态规划只计算每个 ``dp[i]`` 一次；双向计数各扫描字符串一次。返回值只保存长度，不计入额外空间。
