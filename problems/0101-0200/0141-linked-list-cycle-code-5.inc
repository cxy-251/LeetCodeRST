Julia
~~~~~

.. code-block:: julia

   function has_cycle(
       head::Union{Nothing,ListNode},
   )::Bool
       slow = head
       fast = head

       while fast !== nothing && fast.next !== nothing
           slow = slow.next
           fast = fast.next.next
           slow === fast && return true
       end
       return false
   end

R
~

.. code-block:: r

   has_cycle <- function(head) {
     slow <- head
     fast <- head

     while (!is.null(fast) && !is.null(fast$next)) {
       slow <- slow$next
       fast <- fast$next$next
       if (identical(slow, fast)) return(TRUE)
     }
     FALSE
   }
