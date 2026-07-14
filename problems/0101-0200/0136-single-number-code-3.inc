Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn single_number(nums: Vec<i32>) -> i32 {
           nums.into_iter().fold(0, |answer, value| answer ^ value)
       }
   }

Go
~~

.. code-block:: go

   func singleNumber(nums []int) int {
       answer := 0
       for _, value := range nums {
           answer ^= value
       }
       return answer
   }
