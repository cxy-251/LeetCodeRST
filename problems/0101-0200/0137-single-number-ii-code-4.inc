TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function singleNumber(nums: number[]): number {
       let ones = 0;
       let twos = 0;
       for (const value of nums) {
           ones = (ones ^ value) & ~twos;
           twos = (twos ^ value) & ~ones;
       }
       return ones;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int SingleNumber(int[] nums) {
           int ones = 0;
           int twos = 0;
           foreach (int value in nums) {
               ones = (ones ^ value) & ~twos;
               twos = (twos ^ value) & ~ones;
           }
           return ones;
       }
   }
