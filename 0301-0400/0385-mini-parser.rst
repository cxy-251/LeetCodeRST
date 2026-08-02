0385. Mini Parser
=================

题目信息
--------

:题号: 0385
:难度: Medium
:主题: 序列化字符串、嵌套列表、有符号整数、结构恢复
:原题: `LeetCode 0385 <https://leetcode.com/problems/mini-parser/>`_
:重点: 输入可能是单个整数或列表、括号层级和元素顺序必须保留、允许负数与空嵌套列表

题目重述
--------

给定一个合法字符串 ``s``，它序列化表示一个 ``NestedInteger``：字符串可能直接是一个有符号整数，也可能是由方括号包围、逗号分隔的嵌套整数列表。需要把字符串反序列化为具有相同整数值、嵌套层级和元素顺序的 ``NestedInteger`` 对象。

``s`` 的长度位于 ``[1, 5 * 10^4]``，只包含数字、负号、方括号和逗号，不包含空格。所有整数位于 ``[-10^6, 10^6]``，输入保证语法有效。单独的整数应得到整数对象，而不是包含一个元素的列表。

自建示例
--------

单独的负整数：

.. code-block:: text

   输入：s = "-12"
   输出：表示整数 -12 的 NestedInteger
   解释：输入没有外层方括号，因此结果本身是整数，不是列表。

包含空列表的多层结构：

.. code-block:: text

   输入：s = "[7,[-2,3],[]]"
   输出：表示 [7,[-2,3],[]] 的 NestedInteger
   解释：三个顶层元素的顺序保持不变，第二个元素是嵌套列表，第三个元素是空列表。

栈表示当前尚未闭合的列表
--------------------------

若输入不以 ``[`` 开头，它就是一个完整整数，直接解析即可。遇到左括号时压入一个空列表；读到整数时加入栈顶列表；读到右括号时弹出完整的当前列表，并把它作为一个元素加入外层列表。逗号只负责分隔，不改变结构。

栈顶始终对应当前最内层未闭合的 ``[``，所以嵌套层级和元素顺序由读取顺序自然保留；``[]`` 在压栈后立即弹出，得到空列表。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       NestedInteger deserialize(std::string s) {
           if (s[0] != '[') return NestedInteger(std::stoi(s));

           std::stack<NestedInteger> lists;
           lists.push(NestedInteger());
           int i = 1;
           while (i < static_cast<int>(s.size())) {
               if (s[i] == '[') {
                   lists.push(NestedInteger());
                   ++i;
               } else if (s[i] == ']') {
                   NestedInteger current = lists.top();
                   lists.pop();
                   ++i;
                   if (lists.empty()) return current;
                   lists.top().add(current);
               } else if (s[i] == ',') {
                   ++i;
               } else {
                   int sign = 1;
                   if (s[i] == '-') {
                       sign = -1;
                       ++i;
                   }
                   int value = 0;
                   while (i < static_cast<int>(s.size())
                          && std::isdigit(
                               static_cast<unsigned char>(s[i]))) {
                       value = value * 10 + (s[i] - '0');
                       ++i;
                   }
                   lists.top().add(NestedInteger(sign * value));
               }
           }
           return NestedInteger();
       }
   };

代码分析
--------

每个数字只解析一次，每个左括号入栈一次、右括号出栈一次；遇到顶层右括号时返回完整对象，单整数分支避免错误地包上一层列表。时间复杂度为 ``O(|s|)``，额外空间为 ``O(h)``，其中 ``h`` 为最大嵌套深度。
