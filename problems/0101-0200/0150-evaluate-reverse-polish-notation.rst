0150. Evaluate Reverse Polish Notation
======================================

题目信息
--------

:题号: 0150
:难度: Medium
:主题: 栈、表达式求值
:原题: `LeetCode 0150 <https://leetcode.com/problems/evaluate-reverse-polish-notation/>`_
:访问状态: Available
:教学重点: 操作数顺序、向零截断除法、栈不变量

题目重述
--------

给定一个合法的逆波兰表达式 token 序列。数字 token 可以是负数；运算符只有 ``+``、``-``、``*`` 和
``/``。计算整个表达式的整数结果，其中除法必须向零截断。输入保证表达式合法、除数不为零，并且最终结果
能够由题目接口返回。

算法
----

维护一个数值栈。遇到数字时把它压栈；遇到运算符时先弹出的值是右操作数，后弹出的值是左操作数，计算
``left op right`` 后把结果压回栈。全部 token 处理完成后，栈中唯一元素就是答案。

除法语义必须单独处理。C、C++、Java、Rust、Go 和 C# 的有符号整数除法已经向零截断；Python 与 R
实现通过绝对值整除和符号恢复得到相同语义，避免使用向负无穷取整的运算结果。

正确性
~~~~~~

处理任意 token 前缀后，栈从底到顶保存该前缀中已经完整求值、尚未被后续运算符消费的子表达式结果。
数字 token 新建一个完整子表达式，因此压栈后不变量保持。运算符 token 在合法逆波兰表达式中恰好消费
最近完成的两个子表达式；先弹出右值、再弹出左值并计算，所得结果正是这两个子表达式合成后的值，压回后
不变量仍保持。完整输入只对应一个表达式，所以结束时栈中恰好剩余其值。

复杂度
~~~~~~

设 token 数量为 ``t``。每个 token 只压栈或弹栈常数次，时间为 ``O(t)``，栈空间为 ``O(t)``。
固定宽整数语言使用 64 位中间栈，并在题目保证下转换为接口整数；解析数字 token 的成本计入其字符长度，
全部 token 字符总量记为 ``L`` 时完整解析时间为 ``O(L)``。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdint.h>
   #include <stdlib.h>
   #include <string.h>

   int evalRPN(char **tokens, int tokensSize) {
       int64_t *stack = malloc((size_t)tokensSize * sizeof(*stack));
       if (stack == NULL) {
           return 0;
       }

       int top = 0;
       for (int index = 0; index < tokensSize; ++index) {
           const char *token = tokens[index];
           if (strlen(token) == 1U && strchr("+-*/", token[0]) != NULL) {
               int64_t right = stack[--top];
               int64_t left = stack[--top];
               int64_t value = 0;

               switch (token[0]) {
                   case '+':
                       value = left + right;
                       break;
                   case '-':
                       value = left - right;
                       break;
                   case '*':
                       value = left * right;
                       break;
                   default:
                       value = left / right;
                       break;
               }
               stack[top++] = value;
           } else {
               stack[top++] = strtoll(token, NULL, 10);
           }
       }

       int answer = (int)stack[0];
       free(stack);
       return answer;
   }

C++
~~~

.. code-block:: cpp

   #include <cstdint>
   #include <string>
   #include <vector>

   class Solution {
   public:
       int evalRPN(std::vector<std::string>& tokens) {
           std::vector<std::int64_t> stack;
           stack.reserve(tokens.size());

           for (const std::string& token : tokens) {
               if (token.size() == 1U &&
                   std::string("+-*/").find(token[0]) != std::string::npos) {
                   std::int64_t right = stack.back();
                   stack.pop_back();
                   std::int64_t left = stack.back();
                   stack.pop_back();

                   switch (token[0]) {
                       case '+':
                           stack.push_back(left + right);
                           break;
                       case '-':
                           stack.push_back(left - right);
                           break;
                       case '*':
                           stack.push_back(left * right);
                           break;
                       default:
                           stack.push_back(left / right);
                           break;
                   }
               } else {
                   stack.push_back(std::stoll(token));
               }
           }

           return static_cast<int>(stack.back());
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def evalRPN(self, tokens: list[str]) -> int:
           stack: list[int] = []

           for token in tokens:
               if token not in {"+", "-", "*", "/"}:
                   stack.append(int(token))
                   continue

               right = stack.pop()
               left = stack.pop()
               if token == "+":
                   stack.append(left + right)
               elif token == "-":
                   stack.append(left - right)
               elif token == "*":
                   stack.append(left * right)
               else:
                   quotient = abs(left) // abs(right)
                   stack.append(-quotient if (left < 0) != (right < 0) else quotient)

           return stack[-1]

Java
~~~~

.. code-block:: java

   class Solution {
       public int evalRPN(String[] tokens) {
           long[] stack = new long[tokens.length];
           int top = 0;

           for (String token : tokens) {
               if (token.length() != 1 || "+-*/".indexOf(token.charAt(0)) < 0) {
                   stack[top++] = Long.parseLong(token);
                   continue;
               }

               long right = stack[--top];
               long left = stack[--top];
               switch (token.charAt(0)) {
                   case '+':
                       stack[top++] = left + right;
                       break;
                   case '-':
                       stack[top++] = left - right;
                       break;
                   case '*':
                       stack[top++] = left * right;
                       break;
                   default:
                       stack[top++] = left / right;
                       break;
               }
           }

           return (int) stack[0];
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn eval_rpn(tokens: Vec<String>) -> i32 {
           let mut stack: Vec<i64> = Vec::with_capacity(tokens.len());

           for token in tokens {
               match token.as_str() {
                   "+" | "-" | "*" | "/" => {
                       let right = stack.pop().unwrap();
                       let left = stack.pop().unwrap();
                       let value = match token.as_str() {
                           "+" => left + right,
                           "-" => left - right,
                           "*" => left * right,
                           _ => left / right,
                       };
                       stack.push(value);
                   }
                   _ => stack.push(token.parse::<i64>().unwrap()),
               }
           }

           stack[0] as i32
       }
   }

Go
~~

.. code-block:: go

   import "strconv"

   func evalRPN(tokens []string) int {
       stack := make([]int64, 0, len(tokens))

       for _, token := range tokens {
           if token != "+" && token != "-" && token != "*" && token != "/" {
               value, _ := strconv.ParseInt(token, 10, 64)
               stack = append(stack, value)
               continue
           }

           right := stack[len(stack)-1]
           left := stack[len(stack)-2]
           stack = stack[:len(stack)-2]

           var value int64
           switch token {
           case "+":
               value = left + right
           case "-":
               value = left - right
           case "*":
               value = left * right
           default:
               value = left / right
           }
           stack = append(stack, value)
       }

       return int(stack[0])
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function evalRPN(tokens: string[]): number {
       const stack: number[] = [];

       for (const token of tokens) {
           if (token !== "+" && token !== "-" && token !== "*" && token !== "/") {
               stack.push(Number(token));
               continue;
           }

           const right = stack.pop()!;
           const left = stack.pop()!;
           if (token === "+") {
               stack.push(left + right);
           } else if (token === "-") {
               stack.push(left - right);
           } else if (token === "*") {
               stack.push(left * right);
           } else {
               stack.push(Math.trunc(left / right));
           }
       }

       return stack[0];
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int EvalRPN(string[] tokens) {
           long[] stack = new long[tokens.Length];
           int top = 0;

           foreach (string token in tokens) {
               if (token.Length != 1 || "+-*/".IndexOf(token[0]) < 0) {
                   stack[top++] = long.Parse(token);
                   continue;
               }

               long right = stack[--top];
               long left = stack[--top];
               switch (token[0]) {
                   case '+':
                       stack[top++] = left + right;
                       break;
                   case '-':
                       stack[top++] = left - right;
                       break;
                   case '*':
                       stack[top++] = left * right;
                       break;
                   default:
                       stack[top++] = left / right;
                       break;
               }
           }

           return (int)stack[0];
       }
   }

Julia
~~~~~

.. code-block:: julia

   function eval_rpn(tokens::Vector{String})::Int
       stack = Int64[]

       for token in tokens
           if !(token in ("+", "-", "*", "/"))
               push!(stack, parse(Int64, token))
               continue
           end

           right = pop!(stack)
           left = pop!(stack)
           value = if token == "+"
               left + right
           elseif token == "-"
               left - right
           elseif token == "*"
               left * right
           else
               div(left, right, RoundToZero)
           end
           push!(stack, value)
       end

       return Int(stack[1])
   end

R
~

.. code-block:: r

   eval_rpn <- function(tokens) {
     stack <- numeric(length(tokens))
     top <- 0L

     for (token in tokens) {
       if (!(token %in% c("+", "-", "*", "/"))) {
         top <- top + 1L
         stack[top] <- as.numeric(token)
         next
       }

       right <- stack[top]
       left <- stack[top - 1L]
       top <- top - 2L

       value <- switch(
         token,
         "+" = left + right,
         "-" = left - right,
         "*" = left * right,
         "/" = {
           quotient <- abs(left) %/% abs(right)
           if (xor(left < 0, right < 0)) -quotient else quotient
         }
       )
       top <- top + 1L
       stack[top] <- value
     }

     stack[1L]
   }

关键边界
--------

* ``-`` 和 ``/`` 不满足交换律，弹栈顺序不能写反；
* ``-7 / 3`` 与 ``7 / -3`` 都应得到 ``-2``，不能得到 ``-3``；
* ``-11`` 是数字 token，不能因为包含 ``-`` 就被识别为运算符；
* 单个数字本身就是合法表达式；
* C 分配失败时只能返回接口可表示的兜底值，平台签名无法区分资源失败与合法结果 ``0``。

验证
----

运行三个官方示例，以及单数字、三种负数除法符号组合和非交换运算顺序。Python、C、C++、Go、Java 与
TypeScript 输出一致；Rust、C#、Julia 和 R 完成接口、向零截断语义与栈边界静态检查。

最小自检
--------

#. 为什么遇到运算符时第一次弹出的值必须作为右操作数？
#. Python 的 ``//`` 为什么不能直接实现本题除法？
#. 处理完整合法表达式后，为什么栈中一定只剩一个值？
