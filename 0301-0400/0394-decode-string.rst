0394. Decode String
===================

题目信息
--------

:题号: 0394
:难度: Medium
:主题: 编码字符串、重复次数、嵌套括号、解码结果
:原题: `LeetCode 0394 <https://leetcode.com/problems/decode-string/>`_
:重点: ``k[片段]`` 表示重复 ``k`` 次、编码可以嵌套、普通字母保持原顺序、数字只作为重复次数

题目重述
--------

给定合法编码字符串 ``s``，其中 ``k[encoded_string]`` 表示把方括号内解码后的字符串连续重复 ``k`` 次。括号结构可以多层嵌套，方括号外也可以出现普通小写英文字母。返回完整解码后的字符串。

``s`` 的长度位于 ``[1, 30]``，只包含小写英文字母、正整数字符和方括号。所有重复次数位于 ``[1, 300]``，输入保证括号匹配且格式有效；数字只用于表示重复次数，不会作为普通文本出现。最终解码字符串长度不超过 ``10^5``。

自建示例
--------

嵌套重复：

.. code-block:: text

   输入：s = "2[ab3[c]]"
   输出："abcccabccc"
   解释：内层 3[c] 先解码为 ccc，外层片段 abccc 再重复两次。

括号外含普通字母：

.. code-block:: text

   输入：s = "x3[yz]"
   输出："xyzyzyz"
   解释：开头的 x 原样保留，yz 连续重复三次。

遇到左括号保存外层上下文
--------------------------

当前层维护已经解码的字符串 ``current`` 和正在读取的重复次数 ``repeat``。读数字时累积多位数；读左括号时把当前字符串与重复次数压栈并开始一个空的内层字符串；读右括号时弹出外层字符串，将当前层重复 ``repeat`` 次后接回外层。普通字母直接加入当前层。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::string decodeString(std::string s) {
           std::stack<std::pair<std::string, int>> contexts;
           std::string current;
           int repeat = 0;

           for (char c : s) {
               if (std::isdigit(static_cast<unsigned char>(c))) {
                   repeat = repeat * 10 + (c - '0');
               } else if (c == '[') {
                   contexts.push({current, repeat});
                   current.clear();
                   repeat = 0;
               } else if (c == ']') {
                   auto [previous, times] = contexts.top();
                   contexts.pop();
                   std::string expanded = previous;
                   for (int i = 0; i < times; ++i) {
                       expanded += current;
                   }
                   current = expanded;
               } else {
                   current.push_back(c);
               }
           }
           return current;
       }
   };

代码分析
--------

栈帧保存左括号之前的外层前缀和重复次数，右括号只需把已经完成的内层结果合并回去；嵌套结构因此按后进先出正确闭合。解析时间至少为 ``O(|s|)``，加上生成结果所需的字符复制；额外栈空间为最大嵌套深度和中间字符串。
