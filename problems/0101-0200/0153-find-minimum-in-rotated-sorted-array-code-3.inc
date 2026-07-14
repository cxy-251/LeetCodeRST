Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn find_min(nums: Vec<i32>) -> i32 {
           let mut left = 0usize;
           let mut right = nums.len() - 1;

           while left < right {
               let mid = left + (right - left) / 2;
               if nums[mid] > nums[right] {
                   left = mid + 1;
               } else {
                   right = mid;
               }
           }

           nums[left]
       }
   }

Go
~~

.. code-block:: go

   func findMin(nums []int) int {
       left := 0
       right := len(nums) - 1

       for left < right {
           mid := left + (right-left)/2
           if nums[mid] > nums[right] {
               left = mid + 1
           } else {
               right = mid
           }
       }

       return nums[left]
   }
