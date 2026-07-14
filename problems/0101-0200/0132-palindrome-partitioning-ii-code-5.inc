Julia
~~~~~

.. code-block:: julia

   function min_cut(s::String)::Int
       bytes = codeunits(s)
       n = length(bytes)
       pal = falses(n, n)
       cuts = collect(0:n-1)

       for last in 1:n
           for first in last:-1:1
               inner = last - first <= 1 ||
                       pal[first + 1, last - 1]
               if bytes[first] == bytes[last] && inner
                   pal[first, last] = true
                   candidate = first == 1 ? 0 : cuts[first - 1] + 1
                   cuts[last] = min(cuts[last], candidate)
               end
           end
       end
       return cuts[n]
   end

R
~

.. code-block:: r

   min_cut <- function(s) {
     chars <- strsplit(s, "", fixed = TRUE)[[1L]]
     n <- length(chars)
     pal <- matrix(FALSE, nrow = n, ncol = n)
     cuts <- seq.int(0L, n - 1L)

     for (last in seq_len(n)) {
       for (first in seq.int(last, 1L, by = -1L)) {
         inner <- last - first <= 1L ||
           pal[first + 1L, last - 1L]
         if (chars[[first]] == chars[[last]] && inner) {
           pal[first, last] <- TRUE
           candidate <- if (first == 1L) {
             0L
           } else {
             cuts[[first - 1L]] + 1L
           }
           cuts[[last]] <- min(cuts[[last]], candidate)
         }
       }
     }
     cuts[[n]]
   }
