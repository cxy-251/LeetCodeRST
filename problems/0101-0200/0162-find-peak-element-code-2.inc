Python
~~~~~~

.. code-block:: python

   class Solution:
       def findPeakElement(self, nums: list[int]) -> int:
           left = 0
           right = len(nums) - 1

           while left < right:
               mid = left + (right - left) // 2
               if nums[mid] < nums[mid + 1]:
                   left = mid + 1
               else:
                   right = mid
           return left

Java
~~~~

.. code-block:: java

   class Solution {
       public int findPeakElement(int[] nums) {
           int left = 0;
           int right = nums.length - 1;

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
