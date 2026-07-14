Julia
~~~~~

.. code-block:: julia

   function find_min(nums::Vector{Int})::Int
       left = 1
       right = length(nums)

       while left < right
           mid = left + (right - left) ÷ 2
           if nums[mid] > nums[right]
               left = mid + 1
           elseif nums[mid] < nums[right]
               right = mid
           else
               right -= 1
           end
       end

       return nums[left]
   end

R
~

.. code-block:: r

   find_min <- function(nums) {
     left <- 1L
     right <- length(nums)

     while (left < right) {
       mid <- left + (right - left) %/% 2L
       if (nums[mid] > nums[right]) {
         left <- mid + 1L
       } else if (nums[mid] < nums[right]) {
         right <- mid
       } else {
         right <- right - 1L
       }
     }

     nums[left]
   }
