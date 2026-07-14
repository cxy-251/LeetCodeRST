Julia
~~~~~

.. code-block:: julia

   function word_break_ii(
       s::String,
       word_dict::Vector{String},
   )::Vector{String}
       source = codeunits(s)
       words = [(word, codeunits(word)) for word in word_dict]
       n = length(source)
       sentences = [String[] for _ in 1:(n + 1)]
       push!(sentences[n + 1], "")

       for start0 in (n - 1):-1:0
           current = String[]
           for (word, bytes) in words
               end0 = start0 + length(bytes)
               end0 <= n || continue

               same = true
               for offset in 1:length(bytes)
                   if source[start0 + offset] != bytes[offset]
                       same = false
                       break
                   end
               end
               same || continue

               for tail in sentences[end0 + 1]
                   push!(
                       current,
                       isempty(tail)
                           ? word
                           : string(word, " ", tail),
                   )
               end
           end
           sentences[start0 + 1] = current
       end
       return sentences[1]
   end

R
~

.. code-block:: r

   word_break_ii <- function(s, word_dict) {
     n <- nchar(s, type = "bytes")
     sentences <- vector("list", n + 1L)
     for (index in seq_len(n + 1L)) {
       sentences[[index]] <- character(0)
     }
     sentences[[n + 1L]] <- ""

     for (start0 in seq.int(n - 1L, 0L, by = -1L)) {
       current <- list()
       count <- 0L
       for (word in word_dict) {
         word_length <- nchar(word, type = "bytes")
         end0 <- start0 + word_length
         if (end0 > n ||
             substr(s, start0 + 1L, end0) != word) {
           next
         }
         for (tail in sentences[[end0 + 1L]]) {
           count <- count + 1L
           current[[count]] <- if (tail == "") {
             word
           } else {
             paste(word, tail)
           }
         }
       }
       sentences[[start0 + 1L]] <- if (count == 0L) {
         character(0)
       } else {
         unlist(current, use.names = FALSE)
       }
     }
     sentences[[1L]]
   }
