R
~

.. code-block:: r

   palindrome_partitions <- function(s) {
     chars <- strsplit(s, "", fixed = TRUE)[[1L]]
     n <- length(chars)
     palindrome <- matrix(FALSE, n, n)
     for (start in n:1L) {
       for (stop in start:n) {
         inside <- stop - start < 2L ||
           palindrome[start + 1L, stop - 1L]
         palindrome[start, stop] <- chars[[start]] == chars[[stop]] &&
           inside
       }
     }

     answers <- list()
     path <- character(0)
     dfs <- function(start) {
       if (start == n + 1L) {
         answers[[length(answers) + 1L]] <<- path
         return(invisible(NULL))
       }
       for (stop in start:n) {
         if (!palindrome[start, stop]) next
         path <<- c(path, paste0(chars[start:stop], collapse = ""))
         dfs(stop + 1L)
         path <<- path[-length(path)]
       }
       invisible(NULL)
     }
     dfs(1L)
     answers
   }
