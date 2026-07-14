C
~

.. code-block:: c

   #include <stddef.h>
   #include <stdlib.h>

   static int grow_buffer(
       void **buffer,
       size_t *capacity,
       size_t element_size
   ) {
       size_t next_capacity = *capacity == 0 ? 16 : *capacity * 2;
       void *next = realloc(
           *buffer,
           next_capacity * element_size
       );
       if (next == NULL) {
           return 0;
       }
       *buffer = next;
       *capacity = next_capacity;
       return 1;
   }

   int *preorderTraversal(
       struct TreeNode *root,
       int *returnSize
   ) {
       *returnSize = 0;
       if (root == NULL) {
           return NULL;
       }

       struct TreeNode **stack = NULL;
       size_t stack_size = 0;
       size_t stack_capacity = 0;
       int *values = NULL;
       size_t values_capacity = 0;

       if (!grow_buffer(
               (void **)&stack,
               &stack_capacity,
               sizeof(*stack)
           )) {
           return NULL;
       }
       stack[stack_size++] = root;

       while (stack_size > 0) {
           struct TreeNode *node = stack[--stack_size];

           if ((size_t)*returnSize == values_capacity &&
               !grow_buffer(
                   (void **)&values,
                   &values_capacity,
                   sizeof(*values)
               )) {
               free(stack);
               free(values);
               *returnSize = 0;
               return NULL;
           }
           values[(*returnSize)++] = node->val;

           if (node->right != NULL) {
               if (stack_size == stack_capacity &&
                   !grow_buffer(
                       (void **)&stack,
                       &stack_capacity,
                       sizeof(*stack)
                   )) {
                   free(stack);
                   free(values);
                   *returnSize = 0;
                   return NULL;
               }
               stack[stack_size++] = node->right;
           }
           if (node->left != NULL) {
               if (stack_size == stack_capacity &&
                   !grow_buffer(
                       (void **)&stack,
                       &stack_capacity,
                       sizeof(*stack)
                   )) {
                   free(stack);
                   free(values);
                   *returnSize = 0;
                   return NULL;
               }
               stack[stack_size++] = node->left;
           }
       }

       free(stack);
       return values;
   }

C++
~~~

.. code-block:: cpp

   #include <vector>

   class Solution {
   public:
       std::vector<int> preorderTraversal(TreeNode *root) {
           std::vector<int> values;
           if (root == nullptr) {
               return values;
           }

           std::vector<TreeNode *> stack{root};
           while (!stack.empty()) {
               TreeNode *node = stack.back();
               stack.pop_back();
               values.push_back(node->val);

               if (node->right != nullptr) {
                   stack.push_back(node->right);
               }
               if (node->left != nullptr) {
                   stack.push_back(node->left);
               }
           }
           return values;
       }
   };
