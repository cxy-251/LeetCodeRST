TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function postorderTraversal(root: TreeNode | null): number[] {
       if (root === null) return [];

       const stack: TreeNode[] = [root];
       const values: number[] = [];
       while (stack.length > 0) {
           const node = stack.pop()!;
           values.push(node.val);
           if (node.left !== null) stack.push(node.left);
           if (node.right !== null) stack.push(node.right);
       }
       values.reverse();
       return values;
   }

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       public IList<int> PostorderTraversal(TreeNode root) {
           List<int> values = new();
           if (root == null) return values;

           Stack<TreeNode> stack = new();
           stack.Push(root);
           while (stack.Count > 0) {
               TreeNode node = stack.Pop();
               values.Add(node.val);
               if (node.left != null) stack.Push(node.left);
               if (node.right != null) stack.Push(node.right);
           }
           values.Reverse();
           return values;
       }
   }
