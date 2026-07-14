Julia
~~~~~

.. code-block:: julia

   function maximum_gap(nums::Vector{Int})::Int
       count = length(nums)
       count < 2 && return 0

       minimum_value = Base.minimum(nums)
       maximum_value = Base.maximum(nums)
       value_range = Int64(maximum_value) - Int64(minimum_value)
       value_range == 0 && return 0

       bucket_width =
           (value_range + count - 2) ÷ (count - 1)
       bucket_count = Int(value_range ÷ bucket_width + 1)

       bucket_minimums = zeros(Int, bucket_count)
       bucket_maximums = zeros(Int, bucket_count)
       used = falses(bucket_count)

       for value in nums
           index = Int(
               (Int64(value) - Int64(minimum_value)) ÷ bucket_width
           ) + 1
           if !used[index]
               bucket_minimums[index] = value
               bucket_maximums[index] = value
               used[index] = true
           else
               bucket_minimums[index] =
                   min(bucket_minimums[index], value)
               bucket_maximums[index] =
                   max(bucket_maximums[index], value)
           end
       end

       answer = Int64(0)
       previous_maximum = 0
       has_previous = false
       for index in eachindex(used)
           used[index] || continue
           if has_previous
               answer = max(
                   answer,
                   Int64(bucket_minimums[index]) - previous_maximum,
               )
           end
           previous_maximum = bucket_maximums[index]
           has_previous = true
       end

       return Int(answer)
   end

R
~

.. code-block:: r

   maximum_gap <- function(nums) {
     count <- length(nums)
     if (count < 2L) {
       return(0)
     }

     minimum <- min(nums)
     maximum <- max(nums)
     value_range <- maximum - minimum
     if (value_range == 0) {
       return(0)
     }

     bucket_width <- ceiling(value_range / (count - 1L))
     bucket_count <- as.integer(
       floor(value_range / bucket_width) + 1
     )
     bucket_minimums <- numeric(bucket_count)
     bucket_maximums <- numeric(bucket_count)
     used <- rep(FALSE, bucket_count)

     for (value in nums) {
       index <- as.integer(
         floor((value - minimum) / bucket_width)
       ) + 1L
       if (!used[index]) {
         bucket_minimums[index] <- value
         bucket_maximums[index] <- value
         used[index] <- TRUE
       } else {
         bucket_minimums[index] <- min(
           bucket_minimums[index],
           value
         )
         bucket_maximums[index] <- max(
           bucket_maximums[index],
           value
         )
       }
     }

     answer <- 0
     previous_maximum <- 0
     has_previous <- FALSE
     for (index in seq_len(bucket_count)) {
       if (!used[index]) {
         next
       }
       if (has_previous) {
         answer <- max(
           answer,
           bucket_minimums[index] - previous_maximum
         )
       }
       previous_maximum <- bucket_maximums[index]
       has_previous <- TRUE
     }

     answer
   }
