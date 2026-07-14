Julia
~~~~~

.. code-block:: julia

   function preorder_traversal(
       root::Union{Nothing,TreeNode},
   )::Vector{Int}
       root === nothing && return Int[]

       values = Int[]
       stack = TreeNode[root]

       while !isempty(stack)
           node = pop!(stack)
           push!(values, node.val)

           node.right !== nothing && push!(stack, node.right)
           node.left !== nothing && push!(stack, node.left)
       end
       return values
   end

R
~

.. code-block:: r

   preorder_traversal <- function(root) {
     if (is.null(root)) return(integer())

     stack <- new.env(hash = TRUE, parent = emptyenv())
     values <- new.env(hash = TRUE, parent = emptyenv())
     top <- 1L
     count <- 0L
     assign("1", root, envir = stack)

     while (top > 0L) {
       key <- as.character(top)
       node <- get(key, envir = stack, inherits = FALSE)
       rm(list = key, envir = stack)
       top <- top - 1L

       count <- count + 1L
       assign(as.character(count), node$val, envir = values)

       if (!is.null(node$right)) {
         top <- top + 1L
         assign(as.character(top), node$right, envir = stack)
       }
       if (!is.null(node$left)) {
         top <- top + 1L
         assign(as.character(top), node$left, envir = stack)
       }
     }

     vapply(
       seq_len(count),
       function(index) {
         get(as.character(index), envir = values, inherits = FALSE)
       },
       integer(1L)
     )
   }
