C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       public Node CopyRandomList(Node head) {
           if (head == null) return null;

           var copies = new Dictionary<Node, Node>();
           for (Node node = head; node != null; node = node.next) {
               copies[node] = new Node(node.val);
           }
           for (Node node = head; node != null; node = node.next) {
               Node copy = copies[node];
               copy.next = node.next == null ? null : copies[node.next];
               copy.random =
                   node.random == null ? null : copies[node.random];
           }
           return copies[head];
       }
   }

Julia
~~~~~

.. code-block:: julia

   mutable struct RandomNode
       val::Int
       next::Union{Nothing,RandomNode}
       random::Union{Nothing,RandomNode}
   end

   RandomNode(val::Int) = RandomNode(val, nothing, nothing)

   function copy_random_list(
       head::Union{Nothing,RandomNode},
   )::Union{Nothing,RandomNode}
       head === nothing && return nothing

       copies = IdDict{RandomNode,RandomNode}()
       node = head
       while node !== nothing
           copies[node] = RandomNode(node.val)
           node = node.next
       end

       node = head
       while node !== nothing
           copy = copies[node]
           copy.next = node.next === nothing ? nothing : copies[node.next]
           copy.random =
               node.random === nothing ? nothing : copies[node.random]
           node = node.next
       end
       return copies[head]
   end

R
~

.. code-block:: r

   new_random_node <- function(val) {
     node <- new.env(parent = emptyenv())
     node$val <- val
     node$next <- NULL
     node$random <- NULL
     node
   }

   copy_random_list <- function(head) {
     if (is.null(head)) return(NULL)

     originals <- list()
     copies <- list()
     node <- head
     while (!is.null(node)) {
       originals[[length(originals) + 1L]] <- node
       copies[[length(copies) + 1L]] <- new_random_node(node$val)
       node <- node$next
     }

     find_index <- function(target) {
       if (is.null(target)) return(NA_integer_)
       for (index in seq_along(originals)) {
         if (identical(originals[[index]], target)) return(index)
       }
       stop("random must reference a node in the input list")
     }

     for (index in seq_along(originals)) {
       if (index < length(copies)) {
         copies[[index]]$next <- copies[[index + 1L]]
       }
       random_index <- find_index(originals[[index]]$random)
       if (!is.na(random_index)) {
         copies[[index]]$random <- copies[[random_index]]
       }
     }
     copies[[1L]]
   }
