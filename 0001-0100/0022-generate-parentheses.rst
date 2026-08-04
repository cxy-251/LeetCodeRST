0022. Generate Parentheses
==========================

题目信息
--------

:题号: 0022
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

       void enumerateAll(int position, std::string& path, std::vector<std::string>& result) {
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

合法前缀的必要条件
~~~~~~~~~~~~~~~~~~

设当前还剩 ``openRemaining`` 个左括号和 ``closeRemaining`` 个右括号。已经使用的数量分别为
``n - openRemaining`` 和 ``n - closeRemaining``。

合法前缀要求已使用右括号数不超过已使用左括号数，等价于：

.. math::

   openRemaining \le closeRemaining

初始状态为 ``(n, n)``。追加左括号会减少 ``openRemaining``，永远不会破坏这个关系；追加右括号会减少
``closeRemaining``，只有在 ``closeRemaining > openRemaining`` 时才仍然合法。

两个分支条件
~~~~~~~~~~~~

回溯只保留两种仍可完成的选择：

* ``openRemaining > 0`` 时，可以追加左括号；
* ``closeRemaining > openRemaining`` 时，可以追加右括号。

第二个条件表示当前前缀中已经使用的左括号多于右括号，因此至少有一个尚未闭合的左括号可供当前右括号匹配。
当两种剩余数量都为零时，路径长度必为 ``2n``，并且整个构造过程从未产生非法前缀，可以直接记录答案。

为什么剪枝不会漏解
~~~~~~~~~~~~~~~~~~

任意有效括号串的每个前缀都满足右括号数不超过左括号数。沿着该字符串逐字符构造时，每次选择都满足上述两个
分支条件，因此它对应的根到叶路径不会被剪掉。

反过来，回溯只允许合法前缀继续生长，并且最终恰好用完 ``n`` 个左括号和 ``n`` 个右括号，所以每个到达叶子
的字符串都有效。不同答案至少在一个位置选择不同字符，对应不同搜索分支，因此不会重复。

路径复用
~~~~~~~~

``path`` 保存当前前缀。进入子分支前追加一个字符，递归返回后删除末尾字符，路径便恢复为父状态。所有递归层
共用同一个字符串缓冲区；只有到达完整答案时才复制到 ``result``，不会让不同分支互相污染。

复杂度分析
~~~~~~~~~~

有效答案数量为第 ``n`` 个 Catalan 数 ``C_n``。每个答案长度为 ``2n``，复制答案需要 ``O(n)`` 时间，因此
``prunedSearch`` 的时间复杂度为 ``O(C_n n)``，返回结果占 ``O(C_n n)`` 空间。不计输出，递归栈和工作路径
均为 ``O(n)``。

``bruteForce`` 生成 ``4^n`` 个候选，并对每个长度 ``2n`` 的字符串做验证，时间复杂度为 ``O(4^n n)``。
