Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;

   impl Solution {
       pub fn reorder_list(
           head: &mut Option<Rc<RefCell<ListNode>>>,
       ) {
           fn next(
               node: &Option<Rc<RefCell<ListNode>>>,
           ) -> Option<Rc<RefCell<ListNode>>> {
               node.as_ref()
                   .and_then(|current| current.borrow().next.clone())
           }

           if next(head).is_none() {
               return;
           }

           let mut slow = head.clone();
           let mut fast = next(head);
           while fast.is_some() {
               let fast_once = next(&fast);
               if fast_once.is_none() {
                   break;
               }
               slow = next(&slow);
               fast = next(&fast_once);
           }

           let mut second = slow
               .as_ref()
               .and_then(|node| node.borrow_mut().next.take());
           let mut previous = None;
           while let Some(node) = second {
               let following = node.borrow_mut().next.take();
               node.borrow_mut().next = previous;
               previous = Some(node);
               second = following;
           }

           let mut first = head.clone();
           second = previous;
           while let Some(second_node) = second {
               let first_node = first.expect(
                   "the first half is never shorter",
               );
               let first_next = first_node.borrow_mut().next.take();
               let second_next = second_node.borrow_mut().next.take();

               first_node.borrow_mut().next =
                   Some(second_node.clone());
               second_node.borrow_mut().next = first_next.clone();

               first = first_next;
               second = second_next;
           }
       }
   }

Go
~~

.. code-block:: go

   func reorderList(head *ListNode) {
       if head == nil || head.Next == nil {
           return
       }

       slow := head
       fast := head.Next
       for fast != nil && fast.Next != nil {
           slow = slow.Next
           fast = fast.Next.Next
       }

       second := slow.Next
       slow.Next = nil

       var previous *ListNode
       for second != nil {
           next := second.Next
           second.Next = previous
           previous = second
           second = next
       }

       first := head
       second = previous
       for second != nil {
           firstNext := first.Next
           secondNext := second.Next
           first.Next = second
           second.Next = firstNext
           first = firstNext
           second = secondNext
       }
   }
