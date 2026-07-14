Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;

   impl Solution {
       pub fn detect_cycle(
           head: Option<Rc<RefCell<ListNode>>>,
       ) -> Option<Rc<RefCell<ListNode>>> {
           fn next(
               node: &Option<Rc<RefCell<ListNode>>>,
           ) -> Option<Rc<RefCell<ListNode>>> {
               node.as_ref()
                   .and_then(|current| current.borrow().next.clone())
           }

           let mut slow = head.clone();
           let mut fast = head.clone();

           loop {
               let fast_once = next(&fast);
               if fast_once.is_none() {
                   return None;
               }
               slow = next(&slow);
               fast = next(&fast_once);

               match (&slow, &fast) {
                   (Some(slow_node), Some(fast_node))
                       if Rc::ptr_eq(slow_node, fast_node) =>
                   {
                       break;
                   }
                   (_, None) => return None,
                   _ => {}
               }
           }

           let mut seeker = head;
           while let (Some(seeker_node), Some(slow_node)) =
               (&seeker, &slow)
           {
               if Rc::ptr_eq(seeker_node, slow_node) {
                   return seeker;
               }
               seeker = next(&seeker);
               slow = next(&slow);
           }
           None
       }
   }

Go
~~

.. code-block:: go

   func detectCycle(head *ListNode) *ListNode {
       slow := head
       fast := head

       for {
           if fast == nil || fast.Next == nil {
               return nil
           }
           slow = slow.Next
           fast = fast.Next.Next
           if slow == fast {
               break
           }
       }

       seeker := head
       for seeker != slow {
           seeker = seeker.Next
           slow = slow.Next
       }
       return seeker
   }
