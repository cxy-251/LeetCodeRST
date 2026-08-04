0032. Longest Valid Parentheses
===============================

题目信息
--------

:题号: 0032
:难度: Hard
:主题: 字符串、栈、动态规划、双向扫描
:原题: `LeetCode 0032 <https://leetcode.com/problems/longest-valid-parentheses/>`_
:重点: 从逐起点验证推导到维护未匹配边界，并复用以当前位置结束的最长有效段

题目重述
--------

给定一个只包含 ``(`` 和 ``)`` 的字符串 ``s``，返回其中最长有效括号连续子串的长度。

一个连续子串有效，当且仅当其中每个左括号都能由后面的右括号闭合，并且扫描该子串的任意前缀时，右括号数量
都不超过左括号数量。答案必须来自原字符串中的连续区间，不能跳过字符重新拼接。

字符串长度位于 ``[0, 3 * 10^4]``。空字符串、全为左括号或全为右括号时，答案均为 ``0``。

自建示例
--------

* 多段连接：``s = "()(())"``，返回 ``6``；末尾的 ``(())`` 不仅自身有效，还能与前面的 ``()`` 连成一段；
* 多余右括号形成边界：``s = ")(()())"``，返回 ``6``；下标 ``0`` 的右括号不能参与任何跨过它的有效子串；
* 多余左括号截断结尾：``s = "(()(()"``，返回 ``2``；虽然左括号数量更多，但只有中间的 ``()`` 完整闭合；
* 相邻有效段：``s = "()(()())"``，返回 ``8``；局部配对完成后仍要连接左侧紧邻的有效段；
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
                   if (balance < 0) {
                       break;
                   }
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
               if (s[index] == '(') {
                   continue;
               }

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

逐起点验证建立正确基线
~~~~~~~~~~~~~~~~~~~~~~

固定起点 ``start`` 后，可以向右维护余额：读到左括号加一，读到右括号减一。余额为零时，区间
``[start, end]`` 中左右括号数量相等；扫描过程中余额从未为负，因此该区间有效。

若余额首次变为负数，说明当前前缀出现了无法匹配的右括号。继续延长只能保留这个错误前缀，任何从同一
``start`` 出发的更长区间都不可能有效，可以立即停止。

``enumerateStarts`` 因此能够正确检查每个可能起点。不过不同起点会反复读取相同后缀。例如一长段左括号之后跟着
右括号时，多个起点都会重新经历几乎相同的余额变化，最坏需要 ``O(n²)`` 次字符处理。

从重新扫描到保存失效边界
~~~~~~~~~~~~~~~~~~~~~~~~

枚举方法真正需要知道的，不是当前区间内每个字符，而是当前右端之前最近一个不能被有效子串跨越的位置。

有两类位置会成为边界：

* 尚未匹配的左括号；若有效后缀跨过它，区间内部会多出左括号；
* 无法匹配的右括号；若有效子串跨过它，某个前缀会出现右括号过多。

``indexStack`` 用下标栈保存这些边界。初始压入 ``-1``，表示字符串开头之前的虚拟边界。遇到左括号时把其下标
压栈；遇到右括号时先弹出一个位置，尝试让它匹配最近的未匹配左括号。

右括号后的两种状态
~~~~~~~~~~~~~~~~~~

弹栈后若栈为空，刚读到的右括号没有左括号可匹配。它会阻断所有跨过当前位置的有效子串，因此把当前下标重新
压栈，作为新的失效边界。

弹栈后若栈非空，当前右括号成功关闭了最近一层。此时栈顶要么是更早尚未匹配的左括号，要么是最近一个失效右括号。
栈顶之后到当前下标之间没有未匹配括号，因此以当前位置结束的最长有效后缀为：

.. code-block:: text

   current_index - boundaries.back()

不能再向左扩展：跨过未匹配左括号会使左括号多余，跨过失效右括号会使某个前缀右括号过多。栈把每个字符只处理
一次，从而删除了逐起点的重复扫描。

动态规划改为复用已完成区间
~~~~~~~~~~~~~~~~~~~~~~~~~~

栈保存所有未匹配边界；另一种思路是只研究“以当前位置结束”的答案。定义：

``dp[i]`` 表示以 ``s[i]`` 结尾的最长有效括号子串长度。

左括号不能作为有效子串的末尾，所以 ``s[i] == '('`` 时 ``dp[i] = 0``。只有右括号需要转移，并分成两种结构。

第一种：末尾直接形成一对
~~~~~~~~~~~~~~~~~~~~~~~~

若 ``s[i - 1] == '('``，末尾两个字符形成 ``()``。它们左侧若紧邻一个以 ``i - 2`` 结束的有效段，可以直接连接：

.. code-block:: text

   dp[i] = 2 + dp[i - 2]

例如 ``()()`` 的最后一对闭合时，不能只得到长度 ``2``，还应连接前面的 ``()`` 得到 ``4``。

第二种：包住前一段有效串
~~~~~~~~~~~~~~~~~~~~~~~~

若 ``s[i - 1] == ')'``，前一位置可能已经结束一段长度为 ``dp[i - 1]`` 的有效串。当前右括号要想继续扩展，唯一
可能与它配对的位置是跳过该有效段后的前一个字符：

.. code-block:: text

   opening = i - dp[i - 1] - 1

若 ``opening`` 越界或 ``s[opening]`` 不是左括号，当前右括号无法形成更长有效后缀，``dp[i]`` 保持零。

若该位置确实是左括号，它与当前右括号包住 ``dp[i - 1]`` 描述的整段内容，先得到
``dp[i - 1] + 2``。这个新段左侧还可能紧邻另一段有效括号，因此还要连接 ``dp[opening - 1]``。

为什么必须连接左侧有效段
~~~~~~~~~~~~~~~~~~~~~~~~

以 ``s = "()(())"`` 为例：

.. list-table::
   :header-rows: 1

   * - ``i``
     - 字符
     - ``dp[i]``
     - 推导
   * - 0
     - ``(``
     - 0
     - 左括号不能结束有效串
   * - 1
     - ``)``
     - 2
     - 直接形成 ``()``
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
     - 下标 3 与 4 形成 ``()``
   * - 5
     - ``)``
     - 6
     - 跳过 ``dp[4]=2``，与下标 2 配对，再连接 ``dp[1]=2``

若最后一步只计算 ``dp[4] + 2``，只能得到 ``(())`` 的长度 ``4``，会遗漏它前面紧邻的 ``()``。因此
``dp[opening - 1]`` 不是附加技巧，而是保证相邻有效段合并所必需的状态。

转移为什么不会跨过非法字符
~~~~~~~~~~~~~~~~~~~~~~~~~~

``dp[i - 1]`` 只覆盖紧贴 ``i - 1`` 结束的有效段。跳过它以后，``opening`` 是当前右括号唯一可能使用的相邻左边界；
若这个位置不合法，算法不会继续向更左搜索，因此不会跨过失效字符强行拼接。

连接 ``dp[opening - 1]`` 时，也只吸收紧贴 ``opening`` 左侧结束的有效段。整个转移始终由相邻区间组成，符合连续
子串要求。

计数法如何进一步删除辅助数组
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若只需要最长长度，不需要知道具体边界，可以只维护左右括号数量。

从左向右扫描时：

* ``right > left`` 表示出现无法匹配的右括号，当前位置之前的候选不能再延伸，计数清零；
* ``left == right`` 表示当前重置点之后形成有效区间，可以用 ``2 * right`` 更新答案。

一次正向扫描无法处理末尾多余左括号，例如 ``(()``：扫描结束时始终 ``left > right``，但末尾仍可能包含有效段。
因此再从右向左对称扫描；此时 ``left > right`` 表示无法匹配的左括号，计数清零。两次扫描合并后覆盖所有情况。

代码演进
~~~~~~~~

``enumerateStarts`` 为每个起点重新计算余额，直接对应有效括号定义，但重复读取相同后缀。

``indexStack`` 发现决定最长有效后缀的只有未匹配边界，于是用下标栈复用之前的配对结果，把时间降为线性。

``dynamicProgramming`` 进一步把问题改写为“以每个位置结束的最长有效段”，通过 ``dp[i - 1]``、配对左括号位置和
``dp[opening - 1]`` 复用嵌套段与相邻段。公开入口采用该方法，因为每个状态都直接表示一个确定的子问题答案。

``bidirectionalCounters`` 放弃恢复具体边界，只保留左右括号数量，并用两个扫描方向消除单侧计数的盲区，将工作空间
压缩为常数。

复杂度分析
~~~~~~~~~~

设字符串长度为 ``n``。

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 状态来源
   * - 枚举起点
     - ``O(n²)``
     - ``O(1)``
     - 每个起点重新维护余额
   * - 下标栈
     - ``O(n)``
     - ``O(n)``
     - 未匹配左括号与最近失效右括号
   * - 动态规划
     - ``O(n)``
     - ``O(n)``
     - 每个结束位置的最长有效段
   * - 双向计数
     - ``O(n)``
     - ``O(1)``
     - 两个方向的左右括号数量

栈方法中每个下标最多入栈、出栈一次；动态规划只计算每个 ``dp[i]`` 一次；双向计数各扫描字符串一次。