Julia
~~~~~

.. code-block:: julia

   mutable struct GraphNode
       val::Int
       neighbors::Vector{GraphNode}
   end

   GraphNode(val::Int) = GraphNode(val, GraphNode[])

   function clone_graph(
       node::Union{Nothing,GraphNode},
   )::Union{Nothing,GraphNode}
       seen = IdDict{GraphNode,GraphNode}()

       function clone(
           current::Union{Nothing,GraphNode},
       )::Union{Nothing,GraphNode}
           current === nothing && return nothing
           haskey(seen, current) && return seen[current]

           copy = GraphNode(current.val)
           seen[current] = copy
           for neighbor in current.neighbors
               push!(copy.neighbors, clone(neighbor))
           end
           return copy
       end

       return clone(node)
   end

R
~

.. code-block:: r

   new_graph_node <- function(val) {
     node <- new.env(parent = emptyenv())
     node$val <- val
     node$neighbors <- list()
     node
   }

   clone_graph <- function(node) {
     seen <- new.env(hash = TRUE, parent = emptyenv())

     clone <- function(current) {
       if (is.null(current)) return(NULL)
       key <- as.character(current$val)
       if (exists(key, envir = seen, inherits = FALSE)) {
         return(get(key, envir = seen, inherits = FALSE))
       }

       copy <- new_graph_node(current$val)
       assign(key, copy, envir = seen)
       copy$neighbors <- lapply(current$neighbors, clone)
       copy
     }

     clone(node)
   }
