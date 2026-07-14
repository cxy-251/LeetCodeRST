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
