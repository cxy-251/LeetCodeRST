R
~

.. code-block:: r

   can_complete_circuit <- function(gas, cost) {
     total <- 0
     tank <- 0
     start <- 1L
     for (index in seq_along(gas)) {
       difference <- gas[[index]] - cost[[index]]
       total <- total + difference
       tank <- tank + difference
       if (tank < 0) {
         start <- index + 1L
         tank <- 0
       }
     }
     if (total >= 0) start - 1L else -1L
   }
