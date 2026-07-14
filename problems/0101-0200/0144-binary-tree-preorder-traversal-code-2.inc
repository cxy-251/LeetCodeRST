Python
~~~~~~

.. code-block:: python

   class Solution:
       def preorderTraversal(
           self,
           root: Optional[TreeNode],
       ) -> list[int]:
           if root is None:
               return []

           values: list[int] = []
           stack = [root]
           while stack:
               node = stack.pop()
               values.append(node.val)

               if node.right is not None:
                   stack.append(node.right)
               if node.left is not None:
                   stack.append(node.left)

           return values

Java
~~~~

.. code-block:: java

   import java.util.ArrayDeque;
   import java.util.ArrayList;
   import java.util.Deque;
   import java.util.List;

   class Solution {
       public List<Integer> preorderTraversal(TreeNode root) {
           List<Integer> values = new ArrayList<>();
           if (root == null) return values;

           Deque<TreeNode> stack = new ArrayDeque<>();
           stack.push(root);

           while (!stack.isEmpty()) {
               TreeNode node = stack.pop();
               values.add(node.val);

               if (node.right != null) stack.push(node.right);
               if (node.left != null) stack.push(node.left);
           }
           return values;
       }
   }
