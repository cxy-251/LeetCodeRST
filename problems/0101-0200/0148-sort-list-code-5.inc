Julia
~~~~~

.. code-block:: julia

   function sort_list(
       head::Union{Nothing,ListNode},
   )::Union{Nothing,ListNode}
       if head === nothing || head.next === nothing
           return head
       end

       slow = head
       fast = head.next
       while fast !== nothing && fast.next !== nothing
           slow = slow.next
           fast = fast.next.next
       end

       right = slow.next
       slow.next = nothing
       return merge_sorted(
           sort_list(head),
           sort_list(right),
       )
   end

   function merge_sorted(
       left::Union{Nothing,ListNode},
       right::Union{Nothing,ListNode},
   )::Union{Nothing,ListNode}
       dummy = ListNode(0)
       tail = dummy

       while left !== nothing && right !== nothing
           if left.val <= right.val
               tail.next = left
               left = left.next
           else
               tail.next = right
               right = right.next
           end
           tail = tail.next
       end

       tail.next = left === nothing ? right : left
       return dummy.next
   end

R
~

.. code-block:: r

   sort_list <- function(head) {
     if (is.null(head) || is.null(head$next)) return(head)

     slow <- head
     fast <- head$next
     while (!is.null(fast) && !is.null(fast$next)) {
       slow <- slow$next
       fast <- fast$next$next
     }

     right <- slow$next
     slow$next <- NULL
     merge_sorted(sort_list(head), sort_list(right))
   }

   merge_sorted <- function(left, right) {
     dummy <- new.env(parent = emptyenv())
     dummy$next <- NULL
     tail <- dummy

     while (!is.null(left) && !is.null(right)) {
       if (left$val <= right$val) {
         tail$next <- left
         left <- left$next
       } else {
         tail$next <- right
         right <- right$next
       }
       tail <- tail$next
     }

     tail$next <- if (!is.null(left)) left else right
     dummy$next
   }
