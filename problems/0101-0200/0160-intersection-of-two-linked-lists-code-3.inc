Rust
~~~~

.. code-block:: rust

   use std::rc::Rc;

   #[derive(Debug)]
   struct ListNode {
       val: i32,
       next: Option<Rc<ListNode>>,
   }

   fn same_node(
       first: &Option<Rc<ListNode>>,
       second: &Option<Rc<ListNode>>,
   ) -> bool {
       match (first, second) {
           (Some(a), Some(b)) => Rc::ptr_eq(a, b),
           (None, None) => true,
           _ => false,
       }
   }

   fn get_intersection_node(
       head_a: Option<Rc<ListNode>>,
       head_b: Option<Rc<ListNode>>,
   ) -> Option<Rc<ListNode>> {
       let mut first = head_a.clone();
       let mut second = head_b.clone();

       while !same_node(&first, &second) {
           first = match first {
               Some(node) => node.next.clone(),
               None => head_b.clone(),
           };
           second = match second {
               Some(node) => node.next.clone(),
               None => head_a.clone(),
           };
       }
       first
   }

Go
~~

.. code-block:: go

   func getIntersectionNode(headA, headB *ListNode) *ListNode {
       first := headA
       second := headB

       for first != second {
           if first == nil {
               first = headB
           } else {
               first = first.Next
           }

           if second == nil {
               second = headA
           } else {
               second = second.Next
           }
       }
       return first
   }
