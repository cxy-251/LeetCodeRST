Julia
~~~~~

.. code-block:: julia

   function reverse_words(s::String)::String
       bytes = codeunits(s)
       words = String[]
       stop = length(bytes)

       while stop > 0
           while stop > 0 && bytes[stop] == UInt8(' ')
               stop -= 1
           end
           stop == 0 && break

           start = stop
           while start > 1 && bytes[start - 1] != UInt8(' ')
               start -= 1
           end
           push!(words, String(Vector{UInt8}(bytes[start:stop])))
           stop = start - 1
       end

       return join(words, " ")
   end

R
~

.. code-block:: r

   reverse_words <- function(s) {
     chars <- strsplit(s, "", fixed = TRUE)[[1L]]
     words <- vector("list", length(chars))
     count <- 0L
     stop <- length(chars)

     while (stop > 0L) {
       while (stop > 0L && chars[stop] == " ") {
         stop <- stop - 1L
       }
       if (stop == 0L) {
         break
       }

       start <- stop
       while (start > 1L && chars[start - 1L] != " ") {
         start <- start - 1L
       }
       count <- count + 1L
       words[[count]] <- paste0(chars[start:stop], collapse = "")
       stop <- start - 1L
     }

     if (count == 0L) "" else paste(unlist(words[seq_len(count)]), collapse = " ")
   }
