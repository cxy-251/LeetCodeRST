C
~

.. code-block:: c

   int canCompleteCircuit(
       int *gas,
       int gasSize,
       int *cost,
       int costSize
   ) {
       (void)costSize;
       long long total = 0;
       long long tank = 0;
       int start = 0;

       for (int i = 0; i < gasSize; ++i) {
           long long diff = (long long)gas[i] - cost[i];
           total += diff;
           tank += diff;
           if (tank < 0) {
               start = i + 1;
               tank = 0;
           }
       }
       return total >= 0 ? start : -1;
   }

C++
~~~

.. code-block:: cpp

   #include <vector>

   class Solution {
   public:
       int canCompleteCircuit(
           std::vector<int>& gas,
           std::vector<int>& cost
       ) {
           long long total = 0;
           long long tank = 0;
           int start = 0;

           for (int i = 0; i < static_cast<int>(gas.size()); ++i) {
               long long diff =
                   static_cast<long long>(gas[i]) - cost[i];
               total += diff;
               tank += diff;
               if (tank < 0) {
                   start = i + 1;
                   tank = 0;
               }
           }
           return total >= 0 ? start : -1;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def canCompleteCircuit(
           self,
           gas: list[int],
           cost: list[int],
       ) -> int:
           total = 0
           tank = 0
           start = 0

           for index, (gain, spend) in enumerate(zip(gas, cost)):
               difference = gain - spend
               total += difference
               tank += difference
               if tank < 0:
                   start = index + 1
                   tank = 0

           return start if total >= 0 else -1
