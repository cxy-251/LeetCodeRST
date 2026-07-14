C
~

.. code-block:: c

   int findMin(int *nums, int numsSize) {
       int left = 0;
       int right = numsSize - 1;

       while (left < right) {
           int mid = left + (right - left) / 2;
           if (nums[mid] > nums[right]) {
               left = mid + 1;
           } else {
               right = mid;
           }
       }

       return nums[left];
   }

C++
~~~

.. code-block:: cpp

   #include <vector>

   class Solution {
   public:
       int findMin(std::vector<int>& nums) {
           int left = 0;
           int right = static_cast<int>(nums.size()) - 1;

           while (left < right) {
               int mid = left + (right - left) / 2;
               if (nums[mid] > nums[right]) {
                   left = mid + 1;
               } else {
                   right = mid;
               }
           }

           return nums[left];
       }
   };
