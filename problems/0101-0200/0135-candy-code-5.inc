R
~

.. code-block:: r

   candy <- function(ratings) {
     n <- length(ratings)
     candies <- rep.int(1L, n)
     if (n >= 2L) {
       for (index in 2L:n) {
         if (ratings[[index]] > ratings[[index - 1L]]) {
           candies[[index]] <- candies[[index - 1L]] + 1L
         }
       }
       for (index in seq.int(n - 1L, 1L, by = -1L)) {
         if (ratings[[index]] > ratings[[index + 1L]]) {
           candies[[index]] <- max(
             candies[[index]],
             candies[[index + 1L]] + 1L
           )
         }
       }
     }
     sum(candies)
   }
