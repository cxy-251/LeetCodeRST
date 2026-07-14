C
~

.. code-block:: c

   #include <stddef.h>
   #include <stdlib.h>

   int *postorderTraversal(
       struct TreeNode *root,
       int *returnSize
   ) {
       *returnSize = 0;
       if (root == NULL) {
           return NULL;
       }

       size_t stack_capacity = 16;
       size_t stack_size = 0;
       struct TreeNode **stack = malloc(
           stack_capacity * sizeof(*stack)
       );
       size_t values_capacity = 16;
       int *values = malloc(values_capacity * sizeof(*values));
       if (stack == NULL || values == NULL) {
           free(stack);
           free(values);
           return NULL;
       }

       stack[stack_size++] = root;
       while (stack_size > 0) {
           struct TreeNode *node = stack[--stack_size];
           if ((size_t)*returnSize == values_capacity) {
               values_capacity *= 2;
               int *grown = realloc(
                   values,
                   values_capacity * sizeof(*values)
               );
               if (grown == NULL) {
                   free(stack);
                   free(values);
                   *returnSize = 0;
                   return NULL;
               }
               values = grown;
           }
           values[(*returnSize)++] = node->val;

           if (node->left != NULL) {
               if (stack_size == stack_capacity) {
                   stack_capacity *= 2;
                   struct TreeNode **grown = realloc(
                       stack,
                       stack_capacity * sizeof(*stack)
                   );
                   if (grown == NULL) {
                       free(stack);
                       free(values);
                       *returnSize = 0;
                       return NULL;
                   }
                   stack = grown;
               }
               stack[stack_size++] = node->left;
           }
           if (node->right != NULL) {
               if (stack_size == stack_capacity) {
                   stack_capacity *= 2;
                   struct TreeNode **grown = realloc(
                       stack,
                       stack_capacity * sizeof(*stack)
                   );
                   if (grown == NULL) {
                       free(stack);
                       free(values);
                       *returnSize = 0;
                       return NULL;
                   }
                   stack = grown;
               }
               stack[stack_size++] = node->right;
           }
       }
       free(stack);

       for (int left = 0, right = *returnSize - 1;
            left < right;
            ++left, --right) {
           int temporary = values[left];
           values[left] = values[right];
           values[right] = temporary;
       }
       return values;
   }

C++
~~~

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   public:
       std::vector<int> postorderTraversal(TreeNode *root) {
           if (root == nullptr) return {};

           std::vector<TreeNode *> stack{root};
           std::vector<int> values;
           while (!stack.empty()) {
               TreeNode *node = stack.back();
               stack.pop_back();
               values.push_back(node->val);
               if (node->left != nullptr) stack.push_back(node->left);
               if (node->right != nullptr) stack.push_back(node->right);
           }
           std::reverse(values.begin(), values.end());
           return values;
       }
   };
