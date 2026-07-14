Java
~~~~

.. code-block:: java

   class Solution {
       public int canCompleteCircuit(int[] gas, int[] cost) {
           long total = 0;
           long tank = 0;
           int start = 0;
           for (int i = 0; i < gas.length; ++i) {
               long difference = (long) gas[i] - cost[i];
               total += difference;
               tank += difference;
               if (tank < 0) {
                   start = i + 1;
                   tank = 0;
               }
           }
           return total >= 0 ? start : -1;
       }
   }

Go
~~

.. code-block:: go

   func canCompleteCircuit(gas []int, cost []int) int {
       total := 0
       tank := 0
       start := 0
       for index := range gas {
           difference := gas[index] - cost[index]
           total += difference
           tank += difference
           if tank < 0 {
               start = index + 1
               tank = 0
           }
       }
       if total >= 0 {
           return start
       }
       return -1
   }
