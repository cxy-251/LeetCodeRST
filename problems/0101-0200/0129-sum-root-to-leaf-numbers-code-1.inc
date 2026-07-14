C
~

.. code-block:: c

   struct TreeNode {
       int val;
       struct TreeNode *left;
       struct TreeNode *right;
   };

   static int dfs_sum(struct TreeNode *node, int prefix) {
       if (node == 0) {
           return 0;
       }
       int current = prefix * 10 + node->val;
       if (node->left == 0 && node->right == 0) {
           return current;
       }
       return dfs_sum(node->left, current) +
              dfs_sum(node->right, current);
   }

   int sumNumbers(struct TreeNode *root) {
       return dfs_sum(root, 0);
   }

C++
~~~

.. code-block:: cpp

   class Solution {
       int dfs(TreeNode* node, int prefix) {
           if (node == nullptr) {
               return 0;
           }
           int current = prefix * 10 + node->val;
           if (node->left == nullptr && node->right == nullptr) {
               return current;
           }
           return dfs(node->left, current) +
                  dfs(node->right, current);
       }

   public:
       int sumNumbers(TreeNode* root) {
           return dfs(root, 0);
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def sumNumbers(self, root: TreeNode | None) -> int:
           def dfs(node: TreeNode | None, prefix: int) -> int:
               if node is None:
                   return 0
               current = prefix * 10 + node.val
               if node.left is None and node.right is None:
                   return current
               return dfs(node.left, current) + dfs(node.right, current)

           return dfs(root, 0)

Java
~~~~

.. code-block:: java

   class Solution {
       private int dfs(TreeNode node, int prefix) {
           if (node == null) {
               return 0;
           }
           int current = prefix * 10 + node.val;
           if (node.left == null && node.right == null) {
               return current;
           }
           return dfs(node.left, current) +
                  dfs(node.right, current);
       }

       public int sumNumbers(TreeNode root) {
           return dfs(root, 0);
       }
   }

