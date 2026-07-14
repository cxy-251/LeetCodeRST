Python
~~~~~~

.. code-block:: python

   class Solution:
       def postorderTraversal(
           self,
           root: Optional[TreeNode],
       ) -> list[int]:
           if root is None:
               return []

           stack = [root]
           values: list[int] = []
           while stack:
               node = stack.pop()
               values.append(node.val)
               if node.left is not None:
                   stack.append(node.left)
               if node.right is not None:
                   stack.append(node.right)
           values.reverse()
           return values

Java
~~~~

.. code-block:: java

   import java.util.ArrayDeque;
   import java.util.ArrayList;
   import java.util.Collections;
   import java.util.Deque;
   import java.util.List;

   class Solution {
       public List<Integer> postorderTraversal(TreeNode root) {
           List<Integer> values = new ArrayList<>();
           if (root == null) return values;

           Deque<TreeNode> stack = new ArrayDeque<>();
           stack.push(root);
           while (!stack.isEmpty()) {
               TreeNode node = stack.pop();
               values.add(node.val);
               if (node.left != null) stack.push(node.left);
               if (node.right != null) stack.push(node.right);
           }
           Collections.reverse(values);
           return values;
       }
   }
