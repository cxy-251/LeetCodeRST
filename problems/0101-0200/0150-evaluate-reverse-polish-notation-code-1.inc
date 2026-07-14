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
