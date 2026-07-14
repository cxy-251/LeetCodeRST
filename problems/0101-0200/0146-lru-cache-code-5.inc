Julia
~~~~~

.. code-block:: julia

   mutable struct LRUNode
       key::Int
       value::Int
       prev::Union{Nothing,LRUNode}
       next::Union{Nothing,LRUNode}
   end

   mutable struct LRUCache
       capacity::Int
       nodes::Dict{Int,LRUNode}
       head::LRUNode
       tail::LRUNode
   end

   function LRUCache(capacity::Int)
       head = LRUNode(0, 0, nothing, nothing)
       tail = LRUNode(0, 0, head, nothing)
       head.next = tail
       return LRUCache(capacity, Dict{Int,LRUNode}(), head, tail)
   end

   function detach!(node::LRUNode)
       node.prev.next = node.next
       node.next.prev = node.prev
   end

   function push_front!(cache::LRUCache, node::LRUNode)
       node.next = cache.head.next
       node.prev = cache.head
       cache.head.next.prev = node
       cache.head.next = node
   end

   function get!(cache::LRUCache, key::Int)::Int
       haskey(cache.nodes, key) || return -1
       node = cache.nodes[key]
       detach!(node)
       push_front!(cache, node)
       return node.value
   end

   function put!(cache::LRUCache, key::Int, value::Int)::Nothing
       if haskey(cache.nodes, key)
           node = cache.nodes[key]
           node.value = value
           detach!(node)
           push_front!(cache, node)
           return nothing
       end

       if length(cache.nodes) == cache.capacity
           victim = cache.tail.prev
           detach!(victim)
           delete!(cache.nodes, victim.key)
       end
       node = LRUNode(key, value, nothing, nothing)
       cache.nodes[key] = node
       push_front!(cache, node)
       return nothing
   end

R
~

.. code-block:: r

   new_lru_node <- function(key = 0L, value = 0L) {
     node <- new.env(parent = emptyenv())
     node$key <- key
     node$value <- value
     node$prev <- NULL
     node$next <- NULL
     node
   }

   new_lru_cache <- function(capacity) {
     cache <- new.env(parent = emptyenv())
     cache$capacity <- capacity
     cache$nodes <- new.env(hash = TRUE, parent = emptyenv())
     cache$size <- 0L
     cache$head <- new_lru_node()
     cache$tail <- new_lru_node()
     cache$head$next <- cache$tail
     cache$tail$prev <- cache$head
     cache
   }

   lru_detach <- function(node) {
     node$prev$next <- node$next
     node$next$prev <- node$prev
   }

   lru_push_front <- function(cache, node) {
     node$next <- cache$head$next
     node$prev <- cache$head
     cache$head$next$prev <- node
     cache$head$next <- node
   }

   lru_get <- function(cache, key) {
     name <- as.character(key)
     if (!exists(name, envir = cache$nodes, inherits = FALSE)) return(-1L)
     node <- get(name, envir = cache$nodes, inherits = FALSE)
     lru_detach(node)
     lru_push_front(cache, node)
     node$value
   }

   lru_put <- function(cache, key, value) {
     name <- as.character(key)
     if (exists(name, envir = cache$nodes, inherits = FALSE)) {
       node <- get(name, envir = cache$nodes, inherits = FALSE)
       node$value <- value
       lru_detach(node)
       lru_push_front(cache, node)
       return(invisible(NULL))
     }

     if (cache$size == cache$capacity) {
       victim <- cache$tail$prev
       lru_detach(victim)
       rm(list = as.character(victim$key), envir = cache$nodes)
       cache$size <- cache$size - 1L
     }
     node <- new_lru_node(key, value)
     assign(name, node, envir = cache$nodes)
     lru_push_front(cache, node)
     cache$size <- cache$size + 1L
     invisible(NULL)
   }
