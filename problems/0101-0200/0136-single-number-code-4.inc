TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function singleNumber(nums: number[]): number {
       let answer = 0;
       for (const value of nums) {
           answer ^= value;
       }
       return answer;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int SingleNumber(int[] nums) {
           int answer = 0;
           foreach (int value in nums) {
               answer ^= value;
           }
           return answer;
       }
   }
