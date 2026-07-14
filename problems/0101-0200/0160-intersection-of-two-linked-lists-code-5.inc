Julia
~~~~~

.. code-block:: julia

   function get_intersection_node(
       head_a::Union{Nothing, ListNode},
       head_b::Union{Nothing, ListNode},
   )::Union{Nothing, ListNode}
       first = head_a
       second = head_b

       while first !== second
           first = first === nothing ? head_b : first.next
           second = second === nothing ? head_a : second.next
       end
       return first
   end

R
~

.. code-block:: r

   get_intersection_node <- function(head_a, head_b) {
     first <- head_a
     second <- head_b

     while (!identical(first, second)) {
       first <- if (is.null(first)) head_b else first$next_node
       second <- if (is.null(second)) head_a else second$next_node
     }
     first
   }
