Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn single_number(nums: Vec<i32>) -> i32 {
           let mut ones = 0_i32;
           let mut twos = 0_i32;
           for value in nums {
               ones = (ones ^ value) & !twos;
               twos = (twos ^ value) & !ones;
           }
           ones
       }
   }

Go
~~

.. code-block:: go

   func singleNumber(nums []int) int {
       ones, twos := 0, 0
       for _, value := range nums {
           ones = (ones ^ value) & ^twos
           twos = (twos ^ value) & ^ones
       }
       return ones
   }
