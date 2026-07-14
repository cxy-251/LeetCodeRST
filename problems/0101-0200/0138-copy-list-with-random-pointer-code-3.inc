Java
~~~~

.. code-block:: java

   import java.util.IdentityHashMap;
   import java.util.Map;

   class Solution {
       public Node copyRandomList(Node head) {
           if (head == null) return null;

           Map<Node, Node> copies = new IdentityHashMap<>();
           for (Node node = head; node != null; node = node.next) {
               copies.put(node, new Node(node.val));
           }
           for (Node node = head; node != null; node = node.next) {
               Node copy = copies.get(node);
               copy.next = copies.get(node.next);
               copy.random = copies.get(node.random);
           }
           return copies.get(head);
       }
   }

Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::collections::HashMap;
   use std::rc::Rc;

   impl Solution {
       pub fn copy_random_list(
           head: Option<Rc<RefCell<Node>>>,
       ) -> Option<Rc<RefCell<Node>>> {
           let mut copies: HashMap<
               *const RefCell<Node>,
               Rc<RefCell<Node>>,
           > = HashMap::new();

           let mut current = head.clone();
           while let Some(node) = current {
               let key = Rc::as_ptr(&node);
               let value = node.borrow().val;
               copies.insert(
                   key,
                   Rc::new(RefCell::new(Node {
                       val: value,
                       next: None,
                       random: None,
                   })),
               );
               current = node.borrow().next.clone();
           }

           current = head.clone();
           while let Some(node) = current {
               let key = Rc::as_ptr(&node);
               let copy = copies.get(&key).unwrap().clone();
               let next = node.borrow().next.clone();
               let random = node.borrow().random.clone();

               copy.borrow_mut().next = next.as_ref().map(|target| {
                   copies.get(&Rc::as_ptr(target)).unwrap().clone()
               });
               copy.borrow_mut().random = random.as_ref().map(|target| {
                   copies.get(&Rc::as_ptr(target)).unwrap().clone()
               });
               current = next;
           }

           head.as_ref().map(|node| {
               copies.get(&Rc::as_ptr(node)).unwrap().clone()
           })
       }
   }
