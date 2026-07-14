Julia
~~~~~

.. code-block:: julia

   function single_number(nums::Vector{Int})::Int
       ones = 0
       twos = 0
       for value in nums
           ones = xor(ones, value) & ~twos
           twos = xor(twos, value) & ~ones
       end
       return ones
   end

R
~

.. code-block:: r

   single_number <- function(nums) {
     ones <- 0L
     twos <- 0L
     for (value in nums) {
       value <- as.integer(value)
       ones <- bitwAnd(bitwXor(ones, value), bitwNot(twos))
       twos <- bitwAnd(bitwXor(twos, value), bitwNot(ones))
     }
     ones
   }
