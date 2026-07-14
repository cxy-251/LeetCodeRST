Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;

   impl Solution {
       fn dfs(
           node: &Option<Rc<RefCell<TreeNode>>>,
           prefix: i32,
       ) -> i32 {
           match node {
               None => 0,
               Some(handle) => {
                   let node = handle.borrow();
                   let current = prefix * 10 + node.val;
                   if node.left.is_none() && node.right.is_none() {
                       current
                   } else {
                       Self::dfs(&node.left, current) +
                           Self::dfs(&node.right, current)
                   }
               }
           }
       }

       pub fn sum_numbers(
           root: Option<Rc<RefCell<TreeNode>>>,
       ) -> i32 {
           Self::dfs(&root, 0)
       }
   }

