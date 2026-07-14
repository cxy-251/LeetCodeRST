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
