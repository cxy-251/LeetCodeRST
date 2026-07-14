Julia
~~~~~

.. code-block:: julia

   function max_product(nums::Vector{Int})::Int
       current_max = nums[1]
       current_min = nums[1]
       answer = nums[1]

       for index in 2:length(nums)
           value = nums[index]
           if value < 0
               current_max, current_min = current_min, current_max
           end

           current_max = max(value, current_max * value)
           current_min = min(value, current_min * value)
           answer = max(answer, current_max)
       end

       return answer
   end

R
~

.. code-block:: r

   max_product <- function(nums) {
     current_max <- nums[1L]
     current_min <- nums[1L]
     answer <- nums[1L]

     if (length(nums) >= 2L) {
       for (index in 2L:length(nums)) {
         value <- nums[index]
         if (value < 0) {
           temporary <- current_max
           current_max <- current_min
           current_min <- temporary
         }

         current_max <- max(value, current_max * value)
         current_min <- min(value, current_min * value)
         answer <- max(answer, current_max)
       }
     }

     answer
   }
