Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn can_complete_circuit(
           gas: Vec<i32>,
           cost: Vec<i32>,
       ) -> i32 {
           let mut total = 0_i64;
           let mut tank = 0_i64;
           let mut start = 0_usize;
           for index in 0..gas.len() {
               let difference =
                   i64::from(gas[index]) - i64::from(cost[index]);
               total += difference;
               tank += difference;
               if tank < 0 {
                   start = index + 1;
                   tank = 0;
               }
           }
           if total >= 0 { start as i32 } else { -1 }
       }
   }
