0301. Remove Invalid Parentheses
===============================

题目信息
--------

:题号: 0301
:难度: Hard
:主题: 字符串、括号合法性、结果去重、最少删除
:原题: `LeetCode 0301 <https://leetcode.com/problems/remove-invalid-parentheses/>`_
:重点: 只能删除圆括号、删除数量必须最少、普通字母保留原顺序、返回全部不同的最优结果

题目重述
--------

给定字符串 ``s``，其中只包含小写英文字母、左括号 ``(`` 和右括号 ``)``。可以从任意位置删除圆括号，字母不能删除。需要删除尽可能少的括号，使剩余字符串中的所有括号正确配对。

返回经过最少删除后能够得到的所有不同合法字符串，结果顺序不限。``s`` 的长度位于 ``[1, 25]``，其中圆括号总数不超过 ``20``。合法字符串允许没有任何括号；不同删除位置若产生相同字符串，结果中只能保留一次。

自建示例
--------

同时存在多余右括号和左括号：

.. code-block:: text

   输入：s = "a())("
   输出：["a()"]
   解释：必须删除一个多余的右括号和末尾无法配对的左括号，最少删除数为 2；删除两个相邻右括号中的任意一个都会得到同一个结果，因此只返回一次。

不同删除方式产生不同最优结果：

.. code-block:: text

   输入：s = "r(s)())"
   输出：["r(s())", "r(s)()"]
   解释：只需删除一个右括号即可合法；删除 ``s`` 后面的第一个右括号得到 ``r(s())``，删除末尾一组中的一个右括号得到 ``r(s)()``，二者都应返回，顺序不限。

先确定必须删除多少
--------------------

不能在搜索过程中只要得到一个合法字符串就停止，因为题目要求返回所有“删除数最少”的结果。先从左到右扫描括号：遇到 ``(`` 就增加当前未配对的左括号数；遇到 ``)`` 时，若有未配对的 ``(`` 就配掉一个，否则这个右括号必然需要删除。扫描结束后，剩下的未配对左括号数就是必须删除的左括号数，扫描途中积累的多余右括号数就是必须删除的右括号数。

这两个数量给出了全局最少删除数。原因是多余的右括号无法通过删除别处修复，多余的左括号也不可能在后面凭空找到右括号；而删除这些括号后，原字符串中其余括号可以保持配对关系。因此后续搜索只枚举恰好删除这两类数量的方案。

按删除预算回溯
--------------

回溯从左到右处理每个字符，状态包含当前位置、剩余的左右括号删除预算、当前括号余额以及已经保留的字符串。字母只能保留；左括号可以在有删除预算时删除，也可以保留并使余额加一；右括号可以在有删除预算时删除，也只有余额大于零时才能保留并使余额减一。余额变成负数时，当前分支已经不可能合法，立即剪枝。

到达字符串末尾时，只有删除预算全部用完且余额为零的路径才是答案。不同删除位置可能生成同一个字符串，使用集合去重；这不会改变“只枚举最少删除数”的性质。由于圆括号总数最多 20，按删除预算搜索的规模可接受。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       void dfs(const std::string& s, int pos, int leftRemove,
                int rightRemove, int balance, std::string& path,
                std::set<std::string>& answers) {
           if (balance < 0 || leftRemove < 0 || rightRemove < 0) {
               return;
           }
           if (pos == static_cast<int>(s.size())) {
               if (leftRemove == 0 && rightRemove == 0 && balance == 0) {
                   answers.insert(path);
               }
               return;
           }

           char current = s[pos];
           if (current == '(') {
               if (leftRemove > 0) {
                   dfs(s, pos + 1, leftRemove - 1, rightRemove,
                       balance, path, answers);
               }

               path.push_back(current);
               dfs(s, pos + 1, leftRemove, rightRemove,
                   balance + 1, path, answers);
               path.pop_back();
           } else if (current == ')') {
               if (rightRemove > 0) {
                   dfs(s, pos + 1, leftRemove, rightRemove - 1,
                       balance, path, answers);
               }
               if (balance > 0) {
                   path.push_back(current);
                   dfs(s, pos + 1, leftRemove, rightRemove,
                       balance - 1, path, answers);
                   path.pop_back();
               }
           } else {
               path.push_back(current);
               dfs(s, pos + 1, leftRemove, rightRemove,
                   balance, path, answers);
               path.pop_back();
           }
       }

   public:
       std::vector<std::string> removeInvalidParentheses(std::string s) {
           int leftRemove = 0;
           int rightRemove = 0;
           for (char current : s) {
               if (current == '(') {
                   ++leftRemove;
               } else if (current == ')') {
                   if (leftRemove > 0) {
                       --leftRemove;
                   } else {
                       ++rightRemove;
                   }
               }
           }

           std::set<std::string> answers;
           std::string path;
           dfs(s, 0, leftRemove, rightRemove, 0, path, answers);
           return std::vector<std::string>(answers.begin(), answers.end());
       }
   };

代码分析
--------

初次扫描把不可避免的删除量固定下来，回溯不会产生删除更多括号的“次优”结果；余额状态则保证保留下来的右括号始终有对应的左括号。字母分支只有保留这一种选择，所以字母顺序不会改变。设括号数为 ``p``、字符串长度为 ``n``，删除方案最多按 ``O(2^p)`` 级别枚举，构造和放入结果集合还要付出字符串及集合操作的开销；额外搜索空间为 ``O(n)``，不计输出集合本身。
