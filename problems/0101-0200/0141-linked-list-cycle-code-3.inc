Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;

   impl Solution {
       pub fn has_cycle(
           head: Option<Rc<RefCell<ListNode>>>,
       ) -> bool {
           fn next(
               node: &Option<Rc<RefCell<ListNode>>>,
           ) -> Option<Rc<RefCell<ListNode>>> {
               node.as_ref()
                   .and_then(|current| current.borrow().next.clone())
           }

           let mut slow = head.clone();
           let mut fast = head;

           loop {
               let fast_once = next(&fast);
               if fast_once.is_none() {
                   return false;
               }
               slow = next(&slow);
               fast = next(&fast_once);

               if let (Some(slow_node), Some(fast_node)) =
                   (&slow, &fast)
               {
                   if Rc::ptr_eq(slow_node, fast_node) {
                       return true;
                   }
               } else {
                   return false;
               }
           }
       }
   }

Go
~~

.. code-block:: go

   func hasCycle(head *ListNode) bool {
       slow := head
       fast := head

       for fast != nil && fast.Next != nil {
           slow = slow.Next
           fast = fast.Next.Next
           if slow == fast {
               return true
           }
       }
       return false
   }
