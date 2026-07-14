Julia
~~~~~

.. code-block:: julia

   function max_points(points::Vector{Vector{Int}})::Int
       n = length(points)
       n <= 2 && return n

       answer = 2
       for anchor in 1:(n - 1)
           counts = Dict{Tuple{Int,Int},Int}()
           local_best = 0

           for other in (anchor + 1):n
               dx = points[other][1] - points[anchor][1]
               dy = points[other][2] - points[anchor][2]
               divisor = gcd(abs(dx), abs(dy))
               dx ÷= divisor
               dy ÷= divisor

               if dx < 0 || (dx == 0 && dy < 0)
                   dx = -dx
                   dy = -dy
               end

               key = (dy, dx)
               count = get(counts, key, 0) + 1
               counts[key] = count
               local_best = max(local_best, count)
           end
           answer = max(answer, local_best + 1)
       end
       return answer
   end

R
~

.. code-block:: r

   max_points <- function(points) {
     n <- nrow(points)
     if (n <= 2L) return(n)

     gcd_int <- function(first, second) {
       first <- abs(first)
       second <- abs(second)
       while (second != 0L) {
         remainder <- first %% second
         first <- second
         second <- remainder
       }
       first
     }

     answer <- 2L
     for (anchor in seq_len(n - 1L)) {
       counts <- new.env(hash = TRUE, parent = emptyenv())
       local_best <- 0L

       for (other in seq.int(anchor + 1L, n)) {
         dx <- points[other, 1L] - points[anchor, 1L]
         dy <- points[other, 2L] - points[anchor, 2L]
         divisor <- gcd_int(dx, dy)
         dx <- dx %/% divisor
         dy <- dy %/% divisor

         if (dx < 0L || (dx == 0L && dy < 0L)) {
           dx <- -dx
           dy <- -dy
         }

         key <- paste0(dy, ",", dx)
         count <- if (exists(
           key,
           envir = counts,
           inherits = FALSE
         )) {
           get(key, envir = counts, inherits = FALSE) + 1L
         } else {
           1L
         }
         assign(key, count, envir = counts)
         local_best <- max(local_best, count)
       }
       answer <- max(answer, local_best + 1L)
     }
     answer
   }
