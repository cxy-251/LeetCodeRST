Julia
~~~~~

.. code-block:: julia

   function can_complete_circuit(
       gas::Vector{Int},
       cost::Vector{Int},
   )::Int
       total = 0
       tank = 0
       start = 1
       for index in eachindex(gas)
           difference = gas[index] - cost[index]
           total += difference
           tank += difference
           if tank < 0
               start = index + 1
               tank = 0
           end
       end
       return total >= 0 ? start - 1 : -1
   end
