TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function findMin(nums: number[]): number {
       let left = 0;
       let right = nums.length - 1;

       while (left < right) {
           const mid = left + Math.floor((right - left) / 2);
           if (nums[mid] > nums[right]) {
               left = mid + 1;
           } else if (nums[mid] < nums[right]) {
               right = mid;
           } else {
               right -= 1;
           }
       }

       return nums[left];
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int FindMin(int[] nums) {
           int left = 0;
           int right = nums.Length - 1;

           while (left < right) {
               int mid = left + (right - left) / 2;
               if (nums[mid] > nums[right]) {
                   left = mid + 1;
               } else if (nums[mid] < nums[right]) {
                   right = mid;
               } else {
                   --right;
               }
           }

           return nums[left];
       }
   }
