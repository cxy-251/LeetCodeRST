C
~

.. code-block:: c

   int singleNumber(int *nums, int numsSize) {
       int answer = 0;
       for (int i = 0; i < numsSize; ++i) {
           answer ^= nums[i];
       }
       return answer;
   }

C++
~~~

.. code-block:: cpp

   #include <vector>

   class Solution {
   public:
       int singleNumber(std::vector<int>& nums) {
           int answer = 0;
           for (int value : nums) {
               answer ^= value;
           }
           return answer;
       }
   };
