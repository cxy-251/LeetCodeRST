Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;

   impl Solution {
       pub fn preorder_traversal(
           root: Option<Rc<RefCell<TreeNode>>>,
       ) -> Vec<i32> {
           let mut values = Vec::new();
           let Some(root_node) = root else {
               return values;
           };

           let mut stack = vec![root_node];
           while let Some(node) = stack.pop() {
               let borrowed = node.borrow();
               values.push(borrowed.val);

               if let Some(right) = borrowed.right.clone() {
                   stack.push(right);
               }
               if let Some(left) = borrowed.left.clone() {
                   stack.push(left);
               }
           }
           values
       }
   }

Go
~~

.. code-block:: go

   func preorderTraversal(root *TreeNode) []int {
       if root == nil {
           return []int{}
       }

       values := make([]int, 0)
       stack := []*TreeNode{root}

       for len(stack) > 0 {
           last := len(stack) - 1
           node := stack[last]
           stack = stack[:last]
           values = append(values, node.Val)

           if node.Right != nil {
               stack = append(stack, node.Right)
           }
           if node.Left != nil {
               stack = append(stack, node.Left)
           }
       }
       return values
   }
