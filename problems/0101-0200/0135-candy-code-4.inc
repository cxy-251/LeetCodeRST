Julia
~~~~~

.. code-block:: julia

   function candy(ratings::Vector{Int})::Int
       candies = ones(Int, length(ratings))
       for index in 2:length(ratings)
           if ratings[index] > ratings[index - 1]
               candies[index] = candies[index - 1] + 1
           end
       end
       for index in length(ratings)-1:-1:1
           if ratings[index] > ratings[index + 1]
               candies[index] = max(
                   candies[index],
                   candies[index + 1] + 1,
               )
           end
       end
       return sum(candies)
   end
