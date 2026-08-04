0020. Valid Parentheses
=======================

题目信息
--------

:题号: 0020
:难度: Easy
:主题: 字符串、栈、括号匹配
:原题: `LeetCode 0020 <https://leetcode.com/problems/valid-parentheses/>`_
:重点: 用栈保存尚未完成的闭合顺序，让每个右括号只匹配最近的未闭合左括号

题目重述
--------

给定一个只包含 ``(``、``)``、``[``、``]``、``{``、``}`` 的字符串 ``s``，判断其中的括号是否有效。

有效字符串必须满足：

* 每个左括号都有同类型的右括号；
* 每个右括号都有对应的左括号；
* 内层括号必须先于外层括号闭合。

字符串长度位于 ``[1, 10^4]``。只需要判断整体是否合法，不需要返回配对位置。

自建示例
--------

* 正确嵌套：``s = "([]{})"``，返回 ``true``；
* 正确并列：``s = "()[]{}"``，返回 ``true``；
* 类型交叉：``s = "([)]"``，读到 ``)`` 时最近未闭合的是 ``[``，返回 ``false``；
* 多余右括号：``s = "())"``，最后一个 ``)`` 没有可匹配的左括号，返回 ``false``；
* 左括号未闭合：``s = "(([]"``，扫描结束后仍有两个外层括号未关闭，返回 ``false``。

C++ 实现
--------

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
   private:
       void eraseAll(std::string& s, const std::string& pair) {
           for (std::size_t position = s.find(pair); position != std::string::npos; position = s.find(pair)) {
               s.erase(position, pair.size());
           }
       }

       bool repeatedlyErase(std::string s) {
           std::size_t previousSize = 0;
           while (s.size() != previousSize) {
               previousSize = s.size();
               eraseAll(s, "()");
               eraseAll(s, "[]");
               eraseAll(s, "{}");
           }
           return s.empty();
       }

       bool stackScan(const std::string& s) {
           if (s.size() % 2 != 0) {
               return false;
           }
           std::vector<char> expectedClosings;
           expectedClosings.reserve(s.size() / 2);
           for (char current : s) {
               if (current == '(') {
                   expectedClosings.push_back(')');
               } else if (current == '[') {
                   expectedClosings.push_back(']');
               } else if (current == '{') {
                   expectedClosings.push_back('}');
               } else {
                   if (expectedClosings.empty() || expectedClosings.back() != current) {
                       return false;
                   }
                   expectedClosings.pop_back();
               }
           }
           return expectedClosings.empty();
       }

   public:
       bool isValid(std::string s) {
           return stackScan(s);
       }
   };

题解
----

最内层配对
~~~~~~~~~~

合法括号结构只要还不为空，就一定存在一个没有包围其他括号的最内层配对。这个配对在字符串中必然相邻，形式
只能是 ``()``、``[]`` 或 ``{}``。

``repeatedlyErase`` 不断删除这三种相邻配对。合法字符串会从内到外逐层消失；非法字符串最终会留下无法继续
删除的字符。这个方法说明了问题的递归结构，但字符串查找和删除会反复扫描、搬移字符。

未闭合层级
~~~~~~~~~~

从左向右扫描时，已经闭合的部分无需继续保存，真正影响后续判断的只有尚未闭合的左括号。

遇到左括号后，代码不保存左括号本身，而是压入它将来需要的右括号：

* 读到 ``(``，压入 ``)``；
* 读到 ``[``，压入 ``]``；
* 读到 ``{``，压入 ``}``。

因此栈从底到顶保存了所有未完成层级的闭合顺序，栈顶就是下一个右括号唯一允许匹配的字符。

最近优先
~~~~~~~~

假设先读到外层左括号 ``A``，随后又读到内层左括号 ``B``。在 ``B`` 尚未闭合时，右括号不能越过它去关闭
``A``，否则两组括号会交叉。因此最后进入的左括号必须最先闭合，括号匹配天然服从后进先出。

读到右括号时只需检查栈顶：

* 栈为空，说明右括号左侧没有尚未闭合的对象；
* 栈顶与当前字符不同，说明当前右括号试图跳过内层结构或关闭错误类型；
* 栈顶相同，弹出它，表示最内层结构已经完整闭合。

前两种错误都无法由后续字符修复，可以立即返回 ``false``。

结束条件
~~~~~~~~

扫描任意前缀后，栈始终精确保存该前缀中尚未闭合的层级。所有右括号都通过栈顶检查，只能保证没有多余、
错序或类型错误的右括号；扫描结束时还必须要求栈为空，才能保证不存在缺少右括号的左括号。

奇数长度不可能被分成若干括号对，``stackScan`` 在扫描前直接排除。公开入口采用该方法，每个字符只参与一次
入栈或出栈。

复杂度分析
~~~~~~~~~~

``repeatedlyErase`` 的字符串查找与删除可能反复移动剩余字符，最坏时间复杂度为 ``O(n²)``，字符串副本占
``O(n)`` 空间。

``stackScan`` 的时间复杂度为 ``O(n)``。最坏情况下前半段全部是左括号，栈需要 ``O(n)`` 工作空间。
