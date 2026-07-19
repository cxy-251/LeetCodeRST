0020. Valid Parentheses
======================

题目信息
--------

:题号: 0020
:难度: Easy
:主题: 字符串、栈、括号匹配
:原题: `LeetCode 0020 <https://leetcode.com/problems/valid-parentheses/>`_
:访问状态: Available
:教学重点: 最近未闭合括号、栈顶约束、提前失败、ASCII 字符处理

题目重述
--------

给定一个只由 ``()[]{}`` 六种字符组成的字符串 ``s``，判断括号序列是否合法。

合法序列需要同时满足：

* 每个左括号都由同类型右括号闭合；
* 括号必须按正确嵌套顺序闭合；
* 不能出现没有对应左括号的右括号；
* 扫描结束后不能留下未闭合的左括号。

自建示例
--------

正确嵌套
~~~~~~~~

.. code-block:: text

   输入："{[()]}"
   输出：true

类型不匹配
~~~~~~~~~~

.. code-block:: text

   输入："([)]"
   扫描到 ')' 时，最近未闭合的是 '['。
   输出：false

右括号过早出现
~~~~~~~~~~~~~~

.. code-block:: text

   输入："]"
   栈为空，右括号没有匹配对象。
   输出：false

仍有左括号未闭合
~~~~~~~~~~~~~~~~

.. code-block:: text

   输入："(([]"
   扫描结束后栈中仍有两个 '('
   输出：false

问题抽象
--------

括号嵌套遵循后进先出：最后出现且尚未闭合的左括号，必须最先由当前右括号匹配。因此需要一个
栈保存“等待闭合的左括号”。

扫描每个字符：

* 左括号：压栈；
* 右括号：栈不能为空，且栈顶必须是对应左括号；匹配后弹栈；
* 任一检查失败：立即返回 ``false``；
* 扫描结束：仅当栈为空时返回 ``true``。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 空间复杂度
     - 取舍
   * - 栈保存未闭合左括号
     - ``O(n)``
     - ``O(n)``
     - 主解法；直接表达嵌套约束并支持提前失败
   * - 反复删除 ``()``、``[]``、``{}``
     - 最坏 ``O(n^2)``
     - 取决于字符串实现
     - 代码可能短，但反复创建字符串且掩盖嵌套状态
   * - 只统计三类括号数量
     - ``O(n)``
     - ``O(1)``
     - 无法区分 ``([)]`` 这类数量正确、顺序错误的输入

主解法：栈顶匹配
----------------

状态含义
~~~~~~~~

栈从底到顶保存已经读到、尚未闭合的左括号。栈顶是当前最内层括号，也是下一个右括号唯一
允许匹配的对象。

例如扫描 ``{[()]}``：

.. code-block:: text

   读 '{'：[{]
   读 '['：[{, []
   读 '('：[{, [, (]
   读 ')'：[{, []
   读 ']'：[{]
   读 '}'：[]

为什么只检查栈顶
~~~~~~~~~~~~~~~~

若当前右括号跳过栈顶去匹配更早的左括号，那么栈顶左括号会跨越当前闭合边界，产生交叉结构，
不再是合法嵌套。例如 ``([)]`` 中，``')'`` 不能越过 ``'['`` 去匹配 ``'('``。

因此当前右括号合法的充要条件是：栈非空，并且栈顶类型与它对应。

提前失败
~~~~~~~~

以下两类情况一旦出现，后续字符无法修复：

* 栈为空却读到右括号；
* 当前右括号与栈顶左括号类型不同。

可以立即返回 ``false``。扫描结束时栈非空同样失败，因为剩余左括号已经没有字符可闭合。

核心不变量
~~~~~~~~~~

处理前 ``i`` 个字符后：

* 栈按出现顺序保存该前缀中所有尚未闭合的左括号；
* 已弹出的左括号都与一个同类型右括号形成正确嵌套；
* 若前缀已经非法，算法已经提前返回；
* 栈顶是下一个右括号必须匹配的唯一左括号。

正确性依据
~~~~~~~~~~

初始前缀为空，栈为空，不变量成立。读到左括号时压栈，新增一个最内层未闭合括号，不变量
保持。读到右括号时，若栈空或类型不匹配，则当前前缀不可能属于任何合法括号串；算法正确
返回失败。若类型匹配，弹出栈顶正好闭合当前最内层括号，已完成部分仍保持正确嵌套。

扫描结束后，栈为空表示每个左括号都已按后进先出顺序被同类型右括号闭合；栈非空表示仍有
未闭合括号。因此算法返回 ``true`` 当且仅当输入合法。

复杂度
~~~~~~

* 每个字符只压栈或弹栈一次，时间复杂度为 ``O(n)``；
* 最坏情况下所有字符都是左括号，栈空间为 ``O(n)``。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stdlib.h>
   #include <string.h>

   bool isValid(char* s) {
       int length = (int)strlen(s);
       char* stack = malloc(length * sizeof(char));
       int size = 0;

       for (int i = 0; i < length; ++i) {
           char current = s[i];
           if (current == '(' || current == '[' || current == '{') {
               stack[size++] = current;
               continue;
           }

           if (size == 0) {
               free(stack);
               return false;
           }

           char expected =
               current == ')' ? '(' :
               current == ']' ? '[' : '{';
           if (stack[size - 1] != expected) {
               free(stack);
               return false;
           }
           --size;
       }

       bool valid = size == 0;
       free(stack);
       return valid;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       bool isValid(string s) {
           vector<char> stack;

           for (char current : s) {
               if (current == '(' || current == '[' || current == '{') {
                   stack.push_back(current);
                   continue;
               }

               if (stack.empty()) {
                   return false;
               }

               char expected =
                   current == ')' ? '(' :
                   current == ']' ? '[' : '{';
               if (stack.back() != expected) {
                   return false;
               }
               stack.pop_back();
           }

           return stack.empty();
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def isValid(self, s: str) -> bool:
           pairs = {")": "(", "]": "[", "}": "{"}
           stack: list[str] = []

           for current in s:
               if current in "([{":
                   stack.append(current)
                   continue

               if not stack or stack[-1] != pairs[current]:
                   return False
               stack.pop()

           return not stack

Java
~~~~

.. code-block:: java

   class Solution {
       public boolean isValid(String s) {
           Deque<Character> stack = new ArrayDeque<>();

           for (int i = 0; i < s.length(); ++i) {
               char current = s.charAt(i);
               if (current == '(' || current == '[' || current == '{') {
                   stack.push(current);
                   continue;
               }

               if (stack.isEmpty()) {
                   return false;
               }

               char expected =
                   current == ')' ? '(' :
                   current == ']' ? '[' : '{';
               if (stack.pop() != expected) {
                   return false;
               }
           }

           return stack.isEmpty();
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn is_valid(s: String) -> bool {
           let mut stack: Vec<u8> = Vec::new();

           for current in s.bytes() {
               match current {
                   b'(' | b'[' | b'{' => stack.push(current),
                   b')' | b']' | b'}' => {
                       let expected = match current {
                           b')' => b'(',
                           b']' => b'[',
                           _ => b'{',
                       };
                       if stack.pop() != Some(expected) {
                           return false;
                       }
                   }
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

       for i := 0; i < len(s); i++ {
           current := s[i]
           if current == '(' || current == '[' || current == '{' {
               stack = append(stack, current)
               continue
           }

           if len(stack) == 0 {
               return false
           }

           expected := byte('{')
           if current == ')' {
               expected = '('
           } else if current == ']' {
               expected = '['
           }

           if stack[len(stack)-1] != expected {
               return false
           }
           stack = stack[:len(stack)-1]
       }

       return len(stack) == 0
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function isValid(s: string): boolean {
       const pairs: Record<string, string> = {
           ")": "(",
           "]": "[",
           "}": "{",
       };
       const stack: string[] = [];

       for (const current of s) {
           if (current === "(" || current === "[" || current === "{") {
               stack.push(current);
               continue;
           }

           if (stack.length === 0 || stack.pop() !== pairs[current]) {
               return false;
           }
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
               if (current == '(' || current == '[' || current == '{') {
                   stack.Push(current);
                   continue;
               }

               if (stack.Count == 0) {
                   return false;
               }

               char expected =
                   current == ')' ? '(' :
                   current == ']' ? '[' : '{';
               if (stack.Pop() != expected) {
                   return false;
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

       for current in s
           if current == '(' || current == '[' || current == '{'
               push!(stack, current)
               continue
           end

           if isempty(stack)
               return false
           end

           expected = current == ')' ? '(' :
               current == ']' ? '[' : '{'
           if pop!(stack) != expected
               return false
           end
       end

       return isempty(stack)
   end

R
~

.. code-block:: r

   isValid <- function(s) {
       chars <- strsplit(s, "", fixed = TRUE)[[1]]
       stack <- character(length(chars))
       size <- 0L

       for (current in chars) {
           if (current %in% c("(", "[", "{")) {
               size <- size + 1L
               stack[size] <- current
               next
           }

           if (size == 0L) {
               return(FALSE)
           }

           expected <- switch(
               current,
               ")" = "(",
               "]" = "[",
               "}" = "{"
           )
           if (stack[size] != expected) {
               return(FALSE)
           }
           size <- size - 1L
       }

       size == 0L
   }

关键边界与易错点
----------------

* 只比较括号数量无法判断嵌套顺序；
* 右括号出现时必须先检查栈是否为空；
* 扫描结束后还必须检查栈为空，不能只依赖过程中没有失败；
* Java 应优先使用 ``ArrayDeque`` 作为栈，而不是旧的 ``Stack`` 类；
* Rust、Go 可安全按字节扫描，因为输入字符全部是单字节 ASCII；
* R 中预分配字符向量并维护 ``size``，避免反复增长和删除向量。

新增与强化知识
--------------

新增
~~~~

* **未闭合括号栈**：栈保存当前前缀仍等待闭合的嵌套链；
* **栈顶唯一匹配约束**：右括号只能闭合最近未闭合的同类型左括号；
* **不可修复前缀失败**：空栈右括号和类型冲突可立即终止。

强化
~~~~

* 0017 的递归路径使用后进先出撤销，本题显式使用栈保存嵌套状态；
* ASCII 字符扫描再次允许字节级实现；
* 不变量继续用于描述“已处理前缀”和最小必要状态。

关联题目
--------

* `0017. Letter Combinations of a Phone Number <0017-letter-combinations-of-a-phone-number.rst>`_：
  同样维护前缀状态，本题没有分支枚举，只维护嵌套栈；
* `0010. Regular Expression Matching <0010-regular-expression-matching.rst>`_：同样逐字符解释结构，
  该题需要二维状态，本题只需栈。

最小自检
--------

#. 为什么三个计数器不能判断 ``([)]`` 非法？
#. 当前右括号为什么只能匹配栈顶？
#. 栈为空时遇到右括号为什么可立即失败？
#. 扫描结束时栈非空代表什么？
#. 最坏情况下栈为什么需要 ``O(n)`` 空间？

答案要点
~~~~~~~~

#. 计数器不保存嵌套顺序；
#. 栈顶是最近未闭合括号，跳过它会形成交叉闭合；
#. 当前右括号已经没有任何位于它之前的可匹配左括号；
#. 仍有左括号未被闭合；
#. 输入可能全部是左括号，每个字符都要保存在栈中。
