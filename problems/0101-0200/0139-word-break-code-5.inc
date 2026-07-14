Julia
~~~~~

.. code-block:: julia

   function word_break(
       s::String,
       word_dict::Vector{String},
   )::Bool
       source = codeunits(s)
       words = [codeunits(word) for word in word_dict]
       n = length(source)
       reachable = falses(n + 1)
       reachable[1] = true

       for start0 in 0:(n - 1)
           reachable[start0 + 1] || continue
           for word in words
               length_word = length(word)
               end0 = start0 + length_word
               end0 <= n || continue

               same = true
               for offset in 1:length_word
                   if source[start0 + offset] != word[offset]
                       same = false
                       break
                   end
               end
               same && (reachable[end0 + 1] = true)
           end
       end
       return reachable[n + 1]
   end

R
~

.. code-block:: r

   word_break <- function(s, word_dict) {
     n <- nchar(s, type = "bytes")
     reachable <- rep(FALSE, n + 1L)
     reachable[1L] <- TRUE

     for (start0 in seq.int(0L, n - 1L)) {
       if (!reachable[start0 + 1L]) next
       for (word in word_dict) {
         word_length <- nchar(word, type = "bytes")
         end0 <- start0 + word_length
         if (end0 <= n &&
             substr(s, start0 + 1L, end0) == word) {
           reachable[end0 + 1L] <- TRUE
         }
       }
     }
     reachable[n + 1L]
   }
