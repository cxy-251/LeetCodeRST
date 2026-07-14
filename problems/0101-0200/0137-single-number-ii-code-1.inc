C
~

.. code-block:: c

   int singleNumber(int *nums, int numsSize) {
       int ones = 0;
       int twos = 0;
       for (int i = 0; i < numsSize; ++i) {
           ones = (ones ^ nums[i]) & ~twos;
           twos = (twos ^ nums[i]) & ~ones;
       }
       return ones;
   }

C++
~~~

.. code-block:: cpp

   #include <vector>

   class Solution {
   public:
       int singleNumber(std::vector<int>& nums) {
           int ones = 0;
           int twos = 0;
           for (int value : nums) {
               ones = (ones ^ value) & ~twos;
               twos = (twos ^ value) & ~ones;
           }
           return ones;
       }
   };
