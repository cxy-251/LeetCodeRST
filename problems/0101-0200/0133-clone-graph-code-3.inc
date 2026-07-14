Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::collections::HashMap;
   use std::rc::Rc;

   impl Solution {
       pub fn clone_graph(
           node: Option<Rc<RefCell<Node>>>,
       ) -> Option<Rc<RefCell<Node>>> {
           fn clone_node(
               node: &Rc<RefCell<Node>>,
               seen: &mut HashMap<
                   *const RefCell<Node>,
                   Rc<RefCell<Node>>,
               >,
           ) -> Rc<RefCell<Node>> {
               let key = Rc::as_ptr(node);
               if let Some(copy) = seen.get(&key) {
                   return copy.clone();
               }

               let value = node.borrow().val;
               let copy = Rc::new(RefCell::new(Node {
                   val: value,
                   neighbors: Vec::new(),
               }));
               seen.insert(key, copy.clone());

               let neighbors = node.borrow().neighbors.clone();
               for neighbor in neighbors {
                   let next = clone_node(&neighbor, seen);
                   copy.borrow_mut().neighbors.push(next);
               }
               copy
           }

           node.map(|root| {
               clone_node(&root, &mut HashMap::new())
           })
       }
   }
