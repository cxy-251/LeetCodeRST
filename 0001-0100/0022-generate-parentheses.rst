0022. Generate Parentheses
==========================

题目信息
--------

:题号: 0022. 括号生成
:难度: Medium
:主题: 字符串、回溯、剪枝
:原题: `LeetCode 0022 <https://leetcode.com/problems/generate-parentheses/>`_
:重点: 在构造过程中维护合法前缀，只扩展仍可能完成为有效括号串的分支

题目重述
--------

给定整数 ``n``，返回所有由恰好 ``n`` 对圆括号组成的有效字符串。

每个答案长度为 ``2n``，必须包含 ``n`` 个左括号和 ``n`` 个右括号。任意前缀中的右括号数量都不能超过
左括号数量，否则其中至少有一个右括号无法在左侧找到配对。``n`` 位于 ``[1, 8]``，答案顺序不限。

自建示例
--------

* 一对括号：``n = 1``，返回 ``["()"]``；
* 两对括号：``n = 2``，返回 ``["(())", "()()"]``；
* 三对括号：``n = 3``，共有 ``5`` 个答案：``((()))``、``(()())``、``(())()``、``()(())``、
  ``()()()``；
* 前缀 ``")"`` 非法，因为第一个右括号没有左侧配对；
* 前缀 ``"(()"`` 合法且仍可完成，例如补成 ``"(())"``。

C++ 实现
--------

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
   private:
       bool isValid(const std::string& text) {
           int balance = 0;
           for (char current : text) {
               balance += current == '(' ? 1 : -1;
               if (balance < 0) {
                   return false;
               }
           }
           return balance == 0;
       }

       void enumerateAll(
           int position,
           std::string& path,
           std::vector<std::string>& result
       ) {
           if (position == static_cast<int>(path.size())) {
               if (isValid(path)) {
                   result.push_back(path);
               }
               return;
           }
           path[position] = '(';
           enumerateAll(position + 1, path, result);
           path[position] = ')';
           enumerateAll(position + 1, path, result);
       }

       std::vector<std::string> bruteForce(int n) {
           std::vector<std::string> result;
           std::string path(2 * n, '(');
           enumerateAll(0, path, result);
           return result;
       }

       void backtrack(
           int openRemaining,
           int closeRemaining,
           std::string& path,
           std::vector<std::string>& result
       ) {
           if (openRemaining == 0 && closeRemaining == 0) {
               result.push_back(path);
               return;
           }
           if (openRemaining > 0) {
               path.push_back('(');
               backtrack(openRemaining - 1, closeRemaining, path, result);
               path.pop_back();
           }
           if (closeRemaining > openRemaining) {
               path.push_back(')');
               backtrack(openRemaining, closeRemaining - 1, path, result);
               path.pop_back();
           }
       }

       std::vector<std::string> prunedSearch(int n) {
           std::vector<std::string> result;
           std::string path;
           path.reserve(2 * n);
           backtrack(n, n, path, result);
           return result;
       }

   public:
       std::vector<std::string> generateParenthesis(int n) {
           return prunedSearch(n);
       }
   };

题解
----

全量枚举的浪费
~~~~~~~~~~~~~~

长度 ``2n`` 的每个位置都可以填 ``(`` 或 ``)``，所以 ``bruteForce`` 会生成 ``2^(2n) = 4^n`` 个字符串，
再逐个检查括号数量和前缀是否合法。

问题在于，许多分支很早就已经不可能成为答案。例如前缀 ``")("`` 在第一个字符处已经出现未配对右括号，
后续追加任何字符都无法在它左侧补入左括号。继续枚举这棵子树没有意义。

合法前缀状态
~~~~~~~~~~~~

设当前还剩 ``openRemaining`` 个左括号和 ``closeRemaining`` 个右括号。已经使用的数量分别为
``n - openRemaining`` 和 ``n - closeRemaining``。

合法前缀要求已使用右括号数不超过已使用左括号数，等价于：

.. math::

   openRemaining \le closeRemaining

初始状态为 ``(n, n)``。追加左括号会减少 ``openRemaining``，只会增加未闭合左括号数量；追加右括号会减少
``closeRemaining``，必须确认当前确实存在尚未闭合的左括号。

受约束的分支扩展
~~~~~~~~~~~~~~~~

回溯只保留两种仍可能完成的选择：

* ``openRemaining > 0`` 时，可以追加左括号；
* ``closeRemaining > openRemaining`` 时，可以追加右括号。

第二个条件表示当前前缀中已经使用的左括号多于右括号，因此至少有一个尚未闭合的左括号可供当前右括号匹配。
若两种剩余数量相等，继续添加右括号会立即令前缀非法，只能先添加左括号。

当 ``openRemaining == 0`` 时，剩余字符只能全部为右括号；此时
``closeRemaining > openRemaining`` 持续成立，算法会依次闭合全部左括号。当两种剩余数量都为零时，路径长度
恰为 ``2n``，可以直接记录答案，无需再次调用完整验证函数。

搜索覆盖与去重
~~~~~~~~~~~~~~

任意有效括号串的每个前缀都满足右括号数不超过左括号数。沿着该字符串逐字符构造时，左括号选择不会受到错误
限制；每个右括号出现前也必然存在尚未闭合的左括号，所以对应路径不会被剪掉。

回溯保留下来的每个前缀都合法，叶节点又恰好用完 ``n`` 个左括号和 ``n`` 个右括号，因此记录的字符串一定有效。
不同有效字符串至少在一个位置使用不同字符，会在该位置进入不同分支，所以每个答案只生成一次。

剪枝删除的仅是已经违反前缀条件的子树。这类前缀中的未配对右括号不可能由未来字符修复，因此被删除的分支中不存在
合法答案。

路径复用
~~~~~~~~

``path`` 保存当前前缀。进入子分支前追加一个字符，递归返回后删除末尾字符，路径便恢复为父状态。所有递归层
共用同一个字符串缓冲区；只有到达完整答案时才复制到 ``result``，不会让不同分支互相污染。

两个分支都从相同父路径出发。左括号分支撤销后，右括号分支看到的仍是进入本层时的原始前缀，这正是回溯中
“选择、递归、撤销”的状态边界。

复杂度分析
~~~~~~~~~~

有效答案数量为第 ``n`` 个 Catalan 数 ``C_n``。每个答案长度为 ``2n``，复制答案需要 ``O(n)`` 时间，因此
``prunedSearch`` 的时间复杂度为 ``O(C_n n)``，返回结果占 ``O(C_n n)`` 空间。不计输出，递归栈和工作路径
均为 ``O(n)``。

``bruteForce`` 生成 ``4^n`` 个候选，并对每个长度 ``2n`` 的字符串做验证，时间复杂度为 ``O(4^n n)``。
