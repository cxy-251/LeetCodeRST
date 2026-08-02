0316. Remove Duplicate Letters
==============================

题目信息
--------

:题号: 0316
:难度: Medium
:主题: 字符串、子序列、字符去重、字典序
:原题: `LeetCode 0316 <https://leetcode.com/problems/remove-duplicate-letters/>`_
:重点: 每种不同字符必须恰好保留一次、保留相对顺序、在全部合法子序列中字典序最小

题目重述
--------

给定只包含小写英文字母的字符串 ``s``，可以删除其中任意数量的字符，但不能改变保留下来的字符顺序。返回一个子序列，使 ``s`` 中出现过的每种不同字符在结果中恰好出现一次。

若存在多个满足字符集合要求的子序列，返回字典序最小的那个。``s`` 的长度位于 ``[1, 10^4]``。重复出现的同一字符只能保留一个位置，不能遗漏任何在原字符串中出现过的字符。

自建示例
--------

较小字符出现得较晚：

.. code-block:: text

   输入：s = "bbcaac"
   输出："bac"
   解释：结果必须包含 a、b、c 各一次。由于最后一个 b 位于所有 a 之前，只能先保留 b；之后选择 a 和末尾的 c 得到字典序最小结果 bac。

字符串只有一种字符：

.. code-block:: text

   输入：s = "mmmm"
   输出："m"
   解释：不同字符集合中只有 m，因此结果必须且只能保留一个 m。

单调栈保留“现在最小、以后仍能补齐”的前缀
------------------------------------------

从左到右扫描时，栈表示当前答案的前缀。若栈顶字符比当前字符大，并且栈顶字符在后面还会出现，就可以把栈顶移出，让更小的当前字符提前出现；因为后面仍有机会把被移出的字符补回来。若栈顶字符已经是它最后一次出现，则不能删除，否则最终无法包含该字符。

为此维护每个字符的剩余出现次数和是否已经在栈中。当前字符先消耗一次剩余次数；如果它已经在栈中，就不能再次加入。否则不断执行上述弹栈规则，再把当前字符压入。每个字符至多入栈、出栈一次，栈始终保持一个可补全的候选前缀。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::string removeDuplicateLetters(std::string s) {
           std::vector<int> remaining(26, 0);
           for (char c : s) ++remaining[c - 'a'];

           std::vector<bool> inStack(26, false);
           std::string stack;
           for (char current : s) {
               int id = current - 'a';
               --remaining[id];
               if (inStack[id]) continue;

               while (!stack.empty()) {
                   int top = stack.back() - 'a';
                   if (stack.back() <= current || remaining[top] == 0) {
                       break;
                   }
                   inStack[top] = false;
                   stack.pop_back();
               }

               stack.push_back(current);
               inStack[id] = true;
           }
           return stack;
       }
   };

代码分析
--------

弹出条件同时包含“栈顶更大”和“后面还有栈顶字符”两部分，前者改善字典序，后者保证字符集合不会丢失；仅按字符大小弹栈会在最后一次出现处产生错误。跳过已在栈中的字符保证每种字符只保留一次。扫描、入栈和出栈总成本为 ``O(n)``，字母表固定为 26，额外空间为 ``O(n)``。
