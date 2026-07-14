Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;

   impl Solution {
       pub fn postorder_traversal(
           root: Option<Rc<RefCell<TreeNode>>>,
       ) -> Vec<i32> {
           let Some(root) = root else {
               return Vec::new();
           };

           let mut stack = vec![root];
           let mut values = Vec::new();
           while let Some(node) = stack.pop() {
               let borrowed = node.borrow();
               values.push(borrowed.val);
               if let Some(left) = borrowed.left.clone() {
                   stack.push(left);
               }
               if let Some(right) = borrowed.right.clone() {
                   stack.push(right);
               }
           }
           values.reverse();
           values
       }
   }

Go
~~

.. code-block:: go

   func postorderTraversal(root *TreeNode) []int {
       if root == nil {
           return []int{}
       }

       stack := []*TreeNode{root}
       values := make([]int, 0)
       for len(stack) > 0 {
           last := len(stack) - 1
           node := stack[last]
           stack = stack[:last]
           values = append(values, node.Val)
           if node.Left != nil {
               stack = append(stack, node.Left)
           }
           if node.Right != nil {
               stack = append(stack, node.Right)
           }
       }
       for left, right := 0, len(values)-1; left < right; left, right = left+1, right-1 {
           values[left], values[right] = values[right], values[left]
       }
       return values
   }
