Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn max_product(nums: Vec<i32>) -> i32 {
           let mut current_max = i64::from(nums[0]);
           let mut current_min = i64::from(nums[0]);
           let mut answer = i64::from(nums[0]);

           for &number in nums.iter().skip(1) {
               let value = i64::from(number);
               if value < 0 {
                   std::mem::swap(&mut current_max, &mut current_min);
               }

               current_max = value.max(current_max * value);
               current_min = value.min(current_min * value);
               answer = answer.max(current_max);
           }

           answer as i32
       }
   }

Go
~~

.. code-block:: go

   func maxProduct(nums []int) int {
       currentMax := int64(nums[0])
       currentMin := int64(nums[0])
       answer := int64(nums[0])

       for _, number := range nums[1:] {
           value := int64(number)
           if value < 0 {
               currentMax, currentMin = currentMin, currentMax
           }

           currentMax = max64(value, currentMax*value)
           currentMin = min64(value, currentMin*value)
           answer = max64(answer, currentMax)
       }

       return int(answer)
   }

   func max64(first int64, second int64) int64 {
       if first > second {
           return first
       }
       return second
   }

   func min64(first int64, second int64) int64 {
       if first < second {
           return first
       }
       return second
   }
