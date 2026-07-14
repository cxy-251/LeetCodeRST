TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function canCompleteCircuit(
       gas: number[],
       cost: number[],
   ): number {
       let total = 0;
       let tank = 0;
       let start = 0;
       for (let index = 0; index < gas.length; index++) {
           const difference = gas[index] - cost[index];
           total += difference;
           tank += difference;
           if (tank < 0) {
               start = index + 1;
               tank = 0;
           }
       }
       return total >= 0 ? start : -1;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int CanCompleteCircuit(int[] gas, int[] cost) {
           long total = 0;
           long tank = 0;
           int start = 0;
           for (int index = 0; index < gas.Length; ++index) {
               long difference = (long)gas[index] - cost[index];
               total += difference;
               tank += difference;
               if (tank < 0) {
                   start = index + 1;
                   tank = 0;
               }
           }
           return total >= 0 ? start : -1;
       }
   }
