R
~

.. code-block:: r

   sum_numbers <- function(root) {
     dfs <- function(node, prefix) {
       if (is.null(node)) return(0)
       current <- prefix * 10 + node$val
       if (is.null(node$left) && is.null(node$right)) {
         return(current)
       }
       dfs(node$left, current) + dfs(node$right, current)
     }
     dfs(root, 0)
   }
