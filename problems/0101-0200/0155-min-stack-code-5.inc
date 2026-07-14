Julia
~~~~~

.. code-block:: julia

   mutable struct MinStack
       entries::Vector{Tuple{Int, Int}}
   end

   MinStack() = MinStack(Tuple{Int, Int}[])

   function push_value!(stack::MinStack, value::Int)::Nothing
       minimum = isempty(stack.entries) ? value :
           min(value, stack.entries[end][2])
       push!(stack.entries, (value, minimum))
       return nothing
   end

   function pop_value!(stack::MinStack)::Nothing
       pop!(stack.entries)
       return nothing
   end

   top_value(stack::MinStack)::Int = stack.entries[end][1]
   get_min(stack::MinStack)::Int = stack.entries[end][2]

R
~

.. code-block:: r

   new_min_stack <- function() {
     stack <- new.env(parent = emptyenv())
     stack$head <- NULL
     stack
   }

   push_value <- function(stack, value) {
     node <- new.env(parent = emptyenv())
     node$value <- value
     node$minimum <- if (is.null(stack$head)) {
       value
     } else {
       min(value, stack$head$minimum)
     }
     node$next_node <- stack$head
     stack$head <- node
     invisible(NULL)
   }

   pop_value <- function(stack) {
     stack$head <- stack$head$next_node
     invisible(NULL)
   }

   top_value <- function(stack) {
     stack$head$value
   }

   get_min <- function(stack) {
     stack$head$minimum
   }
