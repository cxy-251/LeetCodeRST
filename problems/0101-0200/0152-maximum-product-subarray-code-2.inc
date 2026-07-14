Python
~~~~~~

.. code-block:: python

   class Solution:
       def maxProduct(self, nums: list[int]) -> int:
           current_max = nums[0]
           current_min = nums[0]
           answer = nums[0]

           for index in range(1, len(nums)):
               value = nums[index]
               if value < 0:
                   current_max, current_min = current_min, current_max

               current_max = max(value, current_max * value)
               current_min = min(value, current_min * value)
               answer = max(answer, current_max)

           return answer

Java
~~~~

.. code-block:: java

   class Solution {
       public int maxProduct(int[] nums) {
           long currentMax = nums[0];
           long currentMin = nums[0];
           long answer = nums[0];

           for (int index = 1; index < nums.length; index++) {
               long value = nums[index];
               if (value < 0) {
                   long temporary = currentMax;
                   currentMax = currentMin;
                   currentMin = temporary;
               }

               currentMax = Math.max(value, currentMax * value);
               currentMin = Math.min(value, currentMin * value);
               answer = Math.max(answer, currentMax);
           }

           return (int) answer;
       }
   }
