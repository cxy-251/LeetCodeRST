TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function maxProduct(nums: number[]): number {
       let currentMax = nums[0];
       let currentMin = nums[0];
       let answer = nums[0];

       for (let index = 1; index < nums.length; index++) {
           const value = nums[index];
           if (value < 0) {
               [currentMax, currentMin] = [currentMin, currentMax];
           }

           currentMax = Math.max(value, currentMax * value);
           currentMin = Math.min(value, currentMin * value);
           answer = Math.max(answer, currentMax);
       }

       return answer;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int MaxProduct(int[] nums) {
           long currentMax = nums[0];
           long currentMin = nums[0];
           long answer = nums[0];

           for (int index = 1; index < nums.Length; index++) {
               long value = nums[index];
               if (value < 0) {
                   (currentMax, currentMin) = (currentMin, currentMax);
               }

               currentMax = System.Math.Max(value, currentMax * value);
               currentMin = System.Math.Min(value, currentMin * value);
               answer = System.Math.Max(answer, currentMax);
           }

           return (int)answer;
       }
   }
