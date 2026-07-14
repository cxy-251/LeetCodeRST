Julia
~~~~~

.. code-block:: julia

   function detect_cycle(
       head::Union{Nothing,ListNode},
   )::Union{Nothing,ListNode}
       slow = head
       fast = head

       while true
           if fast === nothing || fast.next === nothing
               return nothing
           end
           slow = slow.next
           fast = fast.next.next
           slow === fast && break
       end

       seeker = head
       while seeker !== slow
           seeker = seeker.next
           slow = slow.next
       end
       return seeker
   end

R
~

.. code-block:: r

   detect_cycle <- function(head) {
     slow <- head
     fast <- head

     repeat {
       if (is.null(fast) || is.null(fast$next)) return(NULL)
       slow <- slow$next
       fast <- fast$next$next
       if (identical(slow, fast)) break
     }

     seeker <- head
     while (!identical(seeker, slow)) {
       seeker <- seeker$next
       slow <- slow$next
     }
     seeker
   }
