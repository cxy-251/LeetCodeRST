TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function preorderTraversal(root: TreeNode | null): number[] {
       if (root === null) return [];

       const values: number[] = [];
       const stack: TreeNode[] = [root];

       while (stack.length > 0) {
           const node = stack.pop()!;
           values.push(node.val);

           if (node.right !== null) stack.push(node.right);
           if (node.left !== null) stack.push(node.left);
       }
       return values;
   }

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       public IList<int> PreorderTraversal(TreeNode root) {
           List<int> values = new();
           if (root == null) return values;

           Stack<TreeNode> stack = new();
           stack.Push(root);

           while (stack.Count > 0) {
               TreeNode node = stack.Pop();
               values.Add(node.val);

               if (node.right != null) stack.Push(node.right);
               if (node.left != null) stack.Push(node.left);
           }
           return values;
       }
   }
