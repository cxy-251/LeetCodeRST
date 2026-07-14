Julia
~~~~~

.. code-block:: julia

   function single_number(nums::Vector{Int})::Int
       answer = 0
       for value in nums
           answer = xor(answer, value)
       end
       return answer
   end

R
~

.. code-block:: r

   single_number <- function(nums) {
     answer <- 0L
     for (value in nums) {
       answer <- bitwXor(answer, as.integer(value))
     }
     answer
   }
