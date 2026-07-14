Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn insertion_sort_list(
           mut head: Option<Box<ListNode>>,
       ) -> Option<Box<ListNode>> {
           fn insert(
               sorted: Option<Box<ListNode>>,
               mut node: Box<ListNode>,
           ) -> Option<Box<ListNode>> {
               if sorted.as_ref().map_or(true, |head| head.val > node.val) {
                   node.next = sorted;
                   return Some(node);
               }

               let mut sorted = sorted;
               let mut cursor = sorted.as_mut().unwrap();
               while cursor
                   .next
                   .as_ref()
                   .map_or(false, |next| next.val <= node.val)
               {
                   cursor = cursor.next.as_mut().unwrap();
               }
               node.next = cursor.next.take();
               cursor.next = Some(node);
               sorted
           }

           let mut sorted = None;
           while let Some(mut node) = head {
               head = node.next.take();
               sorted = insert(sorted, node);
           }
           sorted
       }
   }

Go
~~

.. code-block:: go

   func insertionSortList(head *ListNode) *ListNode {
       if head == nil {
           return nil
       }
       dummy := &ListNode{Next: head}
       lastSorted := head

       for lastSorted.Next != nil {
           current := lastSorted.Next
           if lastSorted.Val <= current.Val {
               lastSorted = current
               continue
           }

           position := dummy
           for position.Next.Val <= current.Val {
               position = position.Next
           }
           lastSorted.Next = current.Next
           current.Next = position.Next
           position.Next = current
       }
       return dummy.Next
   }
