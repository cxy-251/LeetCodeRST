Julia
~~~~~

.. code-block:: julia

   function insertion_sort_list!(
       head::Union{Nothing,ListNode},
   )::Union{Nothing,ListNode}
       head === nothing && return nothing
       dummy = ListNode(0, head)
       last_sorted = head

       while last_sorted.next !== nothing
           current = last_sorted.next
           if last_sorted.val <= current.val
               last_sorted = current
               continue
           end

           position = dummy
           while position.next.val <= current.val
               position = position.next
           end
           last_sorted.next = current.next
           current.next = position.next
           position.next = current
       end
       return dummy.next
   end

R
~

.. code-block:: r

   insertion_sort_list <- function(head) {
     if (is.null(head)) return(NULL)
     dummy <- new_list_node(0L, head)
     last_sorted <- head

     while (!is.null(last_sorted$next)) {
       current <- last_sorted$next
       if (last_sorted$val <= current$val) {
         last_sorted <- current
         next
       }

       position <- dummy
       while (position$next$val <= current$val) {
         position <- position$next
       }
       last_sorted$next <- current$next
       current$next <- position$next
       position$next <- current
     }
     dummy$next
   }
