C#
~~

.. code-block:: csharp

   public class Solution {
       private int Dfs(TreeNode node, int prefix) {
           if (node == null) return 0;
           int current = prefix * 10 + node.val;
           if (node.left == null && node.right == null) {
               return current;
           }
           return Dfs(node.left, current) +
                  Dfs(node.right, current);
       }

       public int SumNumbers(TreeNode root) {
           return Dfs(root, 0);
       }
   }

