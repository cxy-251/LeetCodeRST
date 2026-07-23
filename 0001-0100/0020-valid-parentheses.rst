0020. Valid Parentheses
=======================

题目信息
--------

:题号: 0020
:难度: Easy
:主题: 字符串、栈、嵌套结构
:原题: `LeetCode 0020 <https://leetcode.com/problems/valid-parentheses/>`_
:重点: 最近未闭合左括号、类型匹配、提前失败、最终空栈

题目重述
--------

给定只包含 ``()[]{}`` 的字符串，判断括号是否有效。有效字符串同时满足：每个闭括号与同类型左括号配对；
闭合顺序符合嵌套关系；所有左括号最终都被关闭。

自建示例
--------

.. code-block:: text

   s = "{[()()]}"
   每个闭括号都匹配栈顶左括号，最终栈为空，输出 true。

类型正确但顺序错误：

.. code-block:: text

   s = "([)]"
   读到 ')' 时栈顶是 '['，不能越过它去匹配更早的 '('，输出 false。

C++ 实现
--------

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
   private:
       bool repeatedlyErase(std::string s) {
           bool changed = true;
           while (changed) {
               changed = false;
               const std::string pairs[] = {"()", "[]", "{}"};
               for (const std::string& pair : pairs) {
                   std::size_t position;
                   while ((position = s.find(pair)) != std::string::npos) {
                       s.erase(position, 2);
                       changed = true;
                   }
               }
           }
           return s.empty();
       }

       bool stackScan(const std::string& s) {
           std::vector<char> stack;
           stack.reserve(s.size());

           for (char current : s) {
               if (current == '(' || current == '[' || current == '{') {
                   stack.push_back(current);
                   continue;
               }

               if (stack.empty()) return false;
               const char opening = stack.back();
               stack.pop_back();

               if ((current == ')' && opening != '(') ||
                   (current == ']' && opening != '[') ||
                   (current == '}' && opening != '{')) {
                   return false;
               }
           }

           return stack.empty();
       }

   public:
       bool isValid(std::string s) {
           return stackScan(s);
       }
   };

题解
----

反复删除相邻配对为什么能够作为基准
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

任意合法嵌套结构都至少包含一个相邻的最内层括号对。不断删除 ``()``、``[]``、``{}`` 后，合法字符串最终变空；
非法字符串会留下无法删除的字符。这种方法直观，但每次查找和删除都可能移动大量字符，最坏达到 ``O(n^2)``。

为什么闭括号必须匹配最近的未闭合左括号
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

嵌套结构遵循后进先出。读到闭括号时，最后出现且尚未关闭的左括号位于最内层，必须先被关闭；更早的左括号在
外层，不能越过内层括号提前配对。栈顶正好保存这个唯一合法候选。

栈扫描维护什么状态
~~~~~~~~~~~~~~~~~~

遇到左括号就入栈。遇到闭括号时：

#. 栈为空说明没有可匹配左括号，立即失败；
#. 弹出栈顶；
#. 检查类型是否对应，不对应立即失败。

扫描过程中，栈从底到顶保存所有尚未关闭的左括号，顺序与它们在字符串中的嵌套层级一致。

状态演化
~~~~~~~~

对 ``{[()()]}``：

.. list-table::
   :header-rows: 1

   * - 字符
     - 扫描前栈
     - 动作
     - 扫描后栈
   * - ``{``
     - 空
     - 入栈
     - ``{``
   * - ``[``
     - ``{``
     - 入栈
     - ``{[``
   * - ``(``
     - ``{[``
     - 入栈
     - ``{[(``
   * - ``)``
     - ``{[(``
     - 匹配 ``(``
     - ``{[``
   * - ``(``
     - ``{[``
     - 入栈
     - ``{[(``
   * - ``)``
     - ``{[(``
     - 匹配 ``(``
     - ``{[``
   * - ``]``
     - ``{[``
     - 匹配 ``[``
     - ``{``
   * - ``}``
     - ``{``
     - 匹配 ``{``
     - 空

为什么出现空栈或类型不符可以立即失败
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

闭括号之前没有未闭合左括号时，任何后续字符都无法在它左侧补入配对。栈顶类型不符时，该闭括号也不能跳过
最近左括号去匹配更外层节点，否则最近左括号将跨越配对，破坏嵌套顺序。因此两种失败都不可恢复。

为什么扫描结束后栈必须为空
~~~~~~~~~~~~~~~~~~~~~~~~~~

扫描期间所有闭括号已正确匹配，只能说明不存在多余或错序闭括号。若栈仍有左括号，它们没有对应闭括号，字符串
仍不完整。只有扫描结束且栈为空，三项有效条件才同时满足。

复杂度来源
~~~~~~~~~~

栈方法每个字符入栈或出栈至多一次，时间 ``O(n)``，最坏全是左括号时栈空间 ``O(n)``。反复删除方法因字符串
查找与移动最坏为 ``O(n^2)``。

九语言实现
----------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stdlib.h>
   #include <string.h>

   bool isValid(char* s) {
       int length = (int)strlen(s), top = 0;
       char* stack = malloc((size_t)length);
       for (int i = 0; i < length; ++i) {
           char current = s[i];
           if (current == '(' || current == '[' || current == '{') {
               stack[top++] = current;
           } else {
               if (top == 0) { free(stack); return false; }
               char opening = stack[--top];
               if ((current == ')' && opening != '(') ||
                   (current == ']' && opening != '[') ||
                   (current == '}' && opening != '{')) {
                   free(stack); return false;
               }
           }
       }
       bool answer = top == 0;
       free(stack);
       return answer;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def isValid(self, s: str) -> bool:
           pairs = {")": "(", "]": "[", "}": "{"}
           stack = []
           for current in s:
               if current in "([{":
                   stack.append(current)
               elif not stack or stack.pop() != pairs[current]:
                   return False
           return not stack

Java
~~~~

.. code-block:: java

   class Solution {
       public boolean isValid(String s) {
           char[] stack = new char[s.length()];
           int top = 0;
           for (char current : s.toCharArray()) {
               if (current == '(' || current == '[' || current == '{') {
                   stack[top++] = current;
               } else {
                   if (top == 0) return false;
                   char opening = stack[--top];
                   if ((current == ')' && opening != '(') ||
                       (current == ']' && opening != '[') ||
                       (current == '}' && opening != '{')) return false;
               }
           }
           return top == 0;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn is_valid(s: String) -> bool {
           let mut stack = Vec::with_capacity(s.len());
           for current in s.bytes() {
               match current {
                   b'(' | b'[' | b'{' => stack.push(current),
                   b')' => if stack.pop() != Some(b'(') { return false; },
                   b']' => if stack.pop() != Some(b'[') { return false; },
                   b'}' => if stack.pop() != Some(b'{') { return false; },
                   _ => unreachable!(),
               }
           }
           stack.is_empty()
       }
   }

Go
~~

.. code-block:: go

   func isValid(s string) bool {
       stack := make([]byte, 0, len(s))
       pairs := map[byte]byte{')':'(', ']':'[', '}':'{'}
       for i := 0; i < len(s); i++ {
           current := s[i]
           if current == '(' || current == '[' || current == '{' {
               stack = append(stack, current)
           } else {
               if len(stack) == 0 || stack[len(stack)-1] != pairs[current] { return false }
               stack = stack[:len(stack)-1]
           }
       }
       return len(stack) == 0
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function isValid(s: string): boolean {
       const stack: string[] = [];
       const pairs: Record<string,string> = {")":"(", "]":"[", "}":"{"};
       for (const current of s) {
           if (current === "(" || current === "[" || current === "{") stack.push(current);
           else if (!stack.length || stack.pop() !== pairs[current]) return false;
       }
       return stack.length === 0;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public bool IsValid(string s) {
           var stack = new Stack<char>();
           foreach (char current in s) {
               if (current == '(' || current == '[' || current == '{') stack.Push(current);
               else {
                   if (stack.Count == 0) return false;
                   char opening = stack.Pop();
                   if ((current == ')' && opening != '(') ||
                       (current == ']' && opening != '[') ||
                       (current == '}' && opening != '{')) return false;
               }
           }
           return stack.Count == 0;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function is_valid(s::String)::Bool
       stack = Char[]
       pairs = Dict(')'=>'(', ']'=>'[', '}'=>'{')
       for current in s
           if current in ('(', '[', '{')
               push!(stack, current)
           elseif isempty(stack) || pop!(stack) != pairs[current]
               return false
           end
       end
       isempty(stack)
   end

R
~

.. code-block:: r

   isValid <- function(s) {
       chars <- strsplit(s, "", fixed = TRUE)[[1]]
       stack <- character(); pairs <- c(")"="(", "]"="[", "}"="{")
       for (current in chars) {
           if (current %in% c("(", "[", "{")) {
               stack <- c(stack, current)
           } else {
               if (length(stack) == 0L || tail(stack, 1L) != pairs[[current]]) return(FALSE)
               stack <- head(stack, -1L)
           }
       }
       length(stack) == 0L
   }
