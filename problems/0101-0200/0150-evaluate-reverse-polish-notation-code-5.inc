Julia
~~~~~

.. code-block:: julia

   function eval_rpn(tokens::Vector{String})::Int
       stack = Int64[]

       for token in tokens
           if !(token in ("+", "-", "*", "/"))
               push!(stack, parse(Int64, token))
               continue
           end

           right = pop!(stack)
           left = pop!(stack)
           value = if token == "+"
               left + right
           elseif token == "-"
               left - right
           elseif token == "*"
               left * right
           else
               div(left, right, RoundToZero)
           end
           push!(stack, value)
       end

       return Int(stack[1])
   end

R
~

.. code-block:: r

   eval_rpn <- function(tokens) {
     stack <- numeric(length(tokens))
     top <- 0L

     for (token in tokens) {
       if (!(token %in% c("+", "-", "*", "/"))) {
         top <- top + 1L
         stack[top] <- as.numeric(token)
         next
       }

       right <- stack[top]
       left <- stack[top - 1L]
       top <- top - 2L

       value <- switch(
         token,
         "+" = left + right,
         "-" = left - right,
         "*" = left * right,
         "/" = {
           quotient <- abs(left) %/% abs(right)
           if (xor(left < 0, right < 0)) -quotient else quotient
         }
       )
       top <- top + 1L
       stack[top] <- value
     }

     stack[1L]
   }
