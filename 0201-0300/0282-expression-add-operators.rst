0282. Expression Add Operators
==============================

题目信息
--------

:题号: 0282
:难度: Hard
:主题: 数字字符串、表达式、运算符插入、结果枚举
:原题: `LeetCode 0282 <https://leetcode.com/problems/expression-add-operators/>`_
:重点: 数字顺序不能改变、可插入 ``+`` ``-`` ``*`` 或直接拼接、乘法优先级、操作数前导零限制

题目重述
--------

给定只包含十进制数字的字符串 ``num`` 和整数 ``target``，在相邻数字之间选择插入 ``+``、``-``、``*``，或者不插入运算符以把数字拼成同一个操作数。返回所有计算结果恰好等于 ``target`` 的表达式字符串。

``num`` 的长度位于 ``[1, 10]``，``target`` 位于 32 位有符号整数范围。表达式必须保持原数字的顺序，并使用通常的运算优先级：乘法先于加减法，不使用括号。多位操作数不能以 ``0`` 开头，单独的 ``0`` 合法；例如可以使用 ``0``，不能使用 ``04``。结果顺序不限，所有满足条件的表达式都应返回。

自建示例
--------

同一输入存在多种合法表达式：

.. code-block:: text

   输入：num = "222"，target = 6
   输出：["2+2+2", "2*2+2", "2+2*2"]
   解释：三种表达式都保持数字顺序并得到 6；乘法按照标准优先级先计算。输出顺序可以不同。

前导零限制会排除某些分段：

.. code-block:: text

   输入：num = "204"，target = 2
   输出：["2+0*4", "2-0*4"]
   解释：两式的结果都是 2。把后两位组成操作数 04 不合法，因为多位操作数不能以 0 开头。

回溯并维护乘法最后一项
----------------------

从左到右决定每一段数字的结束位置。每次可以把当前数字片段接在已有表达式后，
并选择 ``+``、``-`` 或 ``*``；首个片段不添加运算符。若片段以 0 开头且长度超过 1，
立即停止继续延长，保留单独的 ``0`` 仍然合法。

为了在没有括号的表达式中正确处理乘法，递归状态除了当前值 ``value``，还保存最后一项 ``last``：

* 加法后的新值为 ``value + operand``，最后一项变为 ``operand``；
* 减法后的新值为 ``value - operand``，最后一项变为 ``-operand``；
* 乘法要撤销旧的最后一项，再加入乘积：``value - last + last * operand``。

例如当前表达式值为 ``2+3`` 时，``value=5,last=3``；追加 ``*4`` 后改成
``5-3+12=14``，等价于按乘法优先级计算 ``2+3*4``。

正确性说明
----------

回溯枚举每个可能的数字分段，前导零剪枝只排除题目禁止的操作数。状态中的 ``value`` 是当前表达式按通常优先级
求值后的结果，``last`` 是仍可能被下一个乘法吸收的最后加减项；三种转移分别保持这一语义。
当游标到达字符串末尾时，若 ``value==target``，当前表达式合法且应加入答案；所有合法分段和运算符选择都被枚举，
所以没有遗漏或伪结果。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       void search(const std::string& num, long long target, int position,
                   long long value, long long last, std::string& expression,
                   std::vector<std::string>& answer) {
           if (position == static_cast<int>(num.size())) {
               if (value == target) answer.push_back(expression);
               return;
           }

           const std::size_t old_size = expression.size();
           long long operand = 0;
           for (int end = position; end < static_cast<int>(num.size()); ++end) {
               if (end > position && num[position] == '0') break;
               operand = operand * 10 + (num[end] - '0');
               const std::string token = num.substr(position, end - position + 1);

               if (position == 0) {
                   expression += token;
                   search(num, target, end + 1, operand, operand,
                          expression, answer);
                   expression.resize(old_size);
                   continue;
               }

               expression += '+';
               expression += token;
               search(num, target, end + 1, value + operand, operand,
                      expression, answer);
               expression.resize(old_size);

               expression += '-';
               expression += token;
               search(num, target, end + 1, value - operand, -operand,
                      expression, answer);
               expression.resize(old_size);

               expression += '*';
               expression += token;
               search(num, target, end + 1,
                      value - last + last * operand, last * operand,
                      expression, answer);
               expression.resize(old_size);
           }
       }

   public:
       std::vector<std::string> addOperators(const std::string& num,
                                             int target) {
           std::vector<std::string> answer;
           std::string expression;
           search(num, target, 0, 0, 0, expression, answer);
           return answer;
       }
   };

代码分析
--------

``num`` 长度最多为 10，回溯的主要规模来自切分点和三种运算符组合；结果数量本身也可能指数级，
因此不能把枚举问题声称为线性。表达式字符串使用回溯复用一份缓冲区，递归深度最多为 ``O(|num|)``；
数值状态使用 ``long long`` 保存中间乘积，避免窄整数在比较目标前溢出。
