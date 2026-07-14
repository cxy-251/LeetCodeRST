Julia
~~~~~

.. code-block:: julia

   function find_peak_element(nums::Vector{Int})::Int
       left = 1
       right = length(nums)

       while left < right
           mid = left + (right - left) ÷ 2
           if nums[mid] < nums[mid + 1]
               left = mid + 1
           else
               right = mid
           end
       end
       return left - 1
   end

R
~

.. code-block:: r

   find_peak_element <- function(nums) {
     left <- 1L
     right <- length(nums)

     while (left < right) {
       mid <- left + (right - left) %/% 2L
       if (nums[mid] < nums[mid + 1L]) {
         left <- mid + 1L
       } else {
         right <- mid
       }
     }
     left - 1L
   }
