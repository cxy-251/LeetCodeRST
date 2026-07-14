Rust
~~~~

.. code-block:: rust

   struct MinStack {
       entries: Vec<(i32, i32)>,
   }

   impl MinStack {
       fn new() -> Self {
           Self { entries: Vec::new() }
       }

       fn push(&mut self, value: i32) {
           let minimum = self.entries.last()
               .map_or(value, |entry| value.min(entry.1));
           self.entries.push((value, minimum));
       }

       fn pop(&mut self) {
           self.entries.pop();
       }

       fn top(&self) -> i32 {
           self.entries.last().unwrap().0
       }

       fn get_min(&self) -> i32 {
           self.entries.last().unwrap().1
       }
   }

Go
~~

.. code-block:: go

   type MinStack struct {
       entries [][2]int
   }

   func Constructor() MinStack {
       return MinStack{entries: make([][2]int, 0)}
   }

   func (stack *MinStack) Push(value int) {
       minimum := value
       if len(stack.entries) > 0 {
           previous := stack.entries[len(stack.entries)-1][1]
           if previous < minimum {
               minimum = previous
           }
       }
       stack.entries = append(stack.entries, [2]int{value, minimum})
   }

   func (stack *MinStack) Pop() {
       stack.entries = stack.entries[:len(stack.entries)-1]
   }

   func (stack *MinStack) Top() int {
       return stack.entries[len(stack.entries)-1][0]
   }

   func (stack *MinStack) GetMin() int {
       return stack.entries[len(stack.entries)-1][1]
   }
