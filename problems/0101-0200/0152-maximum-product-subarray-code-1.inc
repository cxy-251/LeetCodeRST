C
~

.. code-block:: c

   #include <stdint.h>

   static int64_t max_i64(int64_t first, int64_t second) {
       return first > second ? first : second;
   }

   static int64_t min_i64(int64_t first, int64_t second) {
       return first < second ? first : second;
   }

   int maxProduct(int *nums, int numsSize) {
       int64_t current_max = nums[0];
       int64_t current_min = nums[0];
       int64_t answer = nums[0];

       for (int index = 1; index < numsSize; ++index) {
           int64_t value = nums[index];
           if (value < 0) {
               int64_t temporary = current_max;
               current_max = current_min;
               current_min = temporary;
           }

           current_max = max_i64(value, current_max * value);
           current_min = min_i64(value, current_min * value);
           answer = max_i64(answer, current_max);
       }

       return (int)answer;
   }

C++
~~~

.. code-block:: cpp

   #include <algorithm>
   #include <cstdint>
   #include <vector>

   class Solution {
   public:
       int maxProduct(std::vector<int>& nums) {
           std::int64_t current_max = nums[0];
           std::int64_t current_min = nums[0];
           std::int64_t answer = nums[0];

           for (std::size_t index = 1; index < nums.size(); ++index) {
               std::int64_t value = nums[index];
               if (value < 0) {
                   std::swap(current_max, current_min);
               }

               current_max = std::max(value, current_max * value);
               current_min = std::min(value, current_min * value);
               answer = std::max(answer, current_max);
           }

           return static_cast<int>(answer);
       }
   };
