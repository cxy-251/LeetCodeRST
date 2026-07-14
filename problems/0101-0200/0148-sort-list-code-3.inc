Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn sort_list(
           head: Option<Box<ListNode>>,
       ) -> Option<Box<ListNode>> {
           fn length(head: &Option<Box<ListNode>>) -> usize {
               let mut count = 0;
               let mut current = head.as_ref();
               while let Some(node) = current {
                   count += 1;
                   current = node.next.as_ref();
               }
               count
           }

           fn split(
               mut head: Option<Box<ListNode>>,
               left_length: usize,
           ) -> (
               Option<Box<ListNode>>,
               Option<Box<ListNode>>,
           ) {
               let mut cursor = &mut head;
               for _ in 1..left_length {
                   cursor = &mut cursor.as_mut().unwrap().next;
               }
               let right = cursor.as_mut().unwrap().next.take();
               (head, right)
           }

           fn merge(
               mut left: Option<Box<ListNode>>,
               mut right: Option<Box<ListNode>>,
           ) -> Option<Box<ListNode>> {
               let mut dummy = Box::new(ListNode::new(0));
               let mut tail = &mut dummy;

               while left.is_some() && right.is_some() {
                   let take_left =
                       left.as_ref().unwrap().val
                           <= right.as_ref().unwrap().val;
                   let node = if take_left {
                       let mut current = left.take().unwrap();
                       left = current.next.take();
                       current
                   } else {
                       let mut current = right.take().unwrap();
                       right = current.next.take();
                       current
                   };

                   tail.next = Some(node);
                   tail = tail.next.as_mut().unwrap();
               }

               tail.next = if left.is_some() { left } else { right };
               dummy.next
           }

           fn sort(
               head: Option<Box<ListNode>>,
           ) -> Option<Box<ListNode>> {
               let n = length(&head);
               if n <= 1 {
                   return head;
               }

               let (left, right) = split(head, n / 2);
               merge(sort(left), sort(right))
           }

           sort(head)
       }
   }

Go
~~

.. code-block:: go

   func sortList(head *ListNode) *ListNode {
       if head == nil || head.Next == nil {
           return head
       }

       slow := head
       fast := head.Next
       for fast != nil && fast.Next != nil {
           slow = slow.Next
           fast = fast.Next.Next
       }

       right := slow.Next
       slow.Next = nil
       return mergeSorted(sortList(head), sortList(right))
   }

   func mergeSorted(left *ListNode, right *ListNode) *ListNode {
       dummy := &ListNode{}
       tail := dummy

       for left != nil && right != nil {
           if left.Val <= right.Val {
               tail.Next = left
               left = left.Next
           } else {
               tail.Next = right
               right = right.Next
           }
           tail = tail.Next
       }

       if left != nil {
           tail.Next = left
       } else {
           tail.Next = right
       }
       return dummy.Next
   }
