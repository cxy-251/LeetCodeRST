TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function findPeakElement(nums: number[]): number {
       let left = 0;
       let right = nums.length - 1;

       while (left < right) {
           const mid = left + Math.floor((right - left) / 2);
           if (nums[mid] < nums[mid + 1]) {
               left = mid + 1;
           } else {
               right = mid;
           }
       }
       return left;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int FindPeakElement(int[] nums) {
           int left = 0;
           int right = nums.Length - 1;

           while (left < right) {
               int mid = left + (right - left) / 2;
               if (nums[mid] < nums[mid + 1]) {
                   left = mid + 1;
               } else {
                   right = mid;
               }
           }
           return left;
       }
   }
