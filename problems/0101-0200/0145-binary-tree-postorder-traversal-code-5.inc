Julia
~~~~~

.. code-block:: julia

   function postorder_traversal(
       root::Union{Nothing,TreeNode},
   )::Vector{Int}
       root === nothing && return Int[]

       stack = TreeNode[root]
       values = Int[]
       while !isempty(stack)
           node = pop!(stack)
           push!(values, node.val)
           node.left !== nothing && push!(stack, node.left)
           node.right !== nothing && push!(stack, node.right)
       end
       reverse!(values)
       return values
   end

R
~

.. code-block:: r

   postorder_traversal <- function(root) {
     if (is.null(root)) return(integer())

     stack <- list(root)
     values <- integer()
     while (length(stack) > 0L) {
       last <- length(stack)
       node <- stack[[last]]
       stack[[last]] <- NULL
       values <- c(values, node$val)
       if (!is.null(node$left)) stack[[length(stack) + 1L]] <- node$left
       if (!is.null(node$right)) stack[[length(stack) + 1L]] <- node$right
     }
     rev(values)
   }
