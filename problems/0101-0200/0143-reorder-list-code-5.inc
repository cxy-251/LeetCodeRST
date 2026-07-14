Julia
~~~~~

.. code-block:: julia

   function reorder_list!(head::Union{Nothing,ListNode})::Nothing
       if head === nothing || head.next === nothing
           return nothing
       end

       slow = head
       fast = head.next
       while fast !== nothing && fast.next !== nothing
           slow = slow.next
           fast = fast.next.next
       end

       second = slow.next
       slow.next = nothing

       previous = nothing
       while second !== nothing
           following = second.next
           second.next = previous
           previous = second
           second = following
       end

       first = head
       second = previous
       while second !== nothing
           first_next = first.next
           second_next = second.next
           first.next = second
           second.next = first_next
           first = first_next
           second = second_next
       end
       return nothing
   end

R
~

.. code-block:: r

   reorder_list <- function(head) {
     if (is.null(head) || is.null(head$next)) return(invisible(head))

     slow <- head
     fast <- head$next
     while (!is.null(fast) && !is.null(fast$next)) {
       slow <- slow$next
       fast <- fast$next$next
     }

     second <- slow$next
     slow$next <- NULL

     previous <- NULL
     while (!is.null(second)) {
       following <- second$next
       second$next <- previous
       previous <- second
       second <- following
     }

     first <- head
     second <- previous
     while (!is.null(second)) {
       first_next <- first$next
       second_next <- second$next
       first$next <- second
       second$next <- first_next
       first <- first_next
       second <- second_next
     }
     invisible(head)
   }
