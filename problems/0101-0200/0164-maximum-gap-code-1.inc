C
~

.. code-block:: c

   #include <stdint.h>
   #include <stdlib.h>

   struct GapBucket {
       int minimum;
       int maximum;
       int used;
   };

   int maximumGap(int *nums, int numsSize) {
       if (numsSize < 2) {
           return 0;
       }

       int minimum = nums[0];
       int maximum = nums[0];
       for (int index = 1; index < numsSize; ++index) {
           if (nums[index] < minimum) {
               minimum = nums[index];
           }
           if (nums[index] > maximum) {
               maximum = nums[index];
           }
       }

       int64_t value_range = (int64_t)maximum - minimum;
       if (value_range == 0) {
           return 0;
       }

       int64_t bucket_width =
           (value_range + numsSize - 2) / (numsSize - 1);
       size_t bucket_count =
           (size_t)(value_range / bucket_width + 1);

       struct GapBucket *buckets =
           calloc(bucket_count, sizeof(*buckets));
       if (buckets == NULL) {
           return 0;
       }

       for (int index = 0; index < numsSize; ++index) {
           size_t bucket_index = (size_t)(
               ((int64_t)nums[index] - minimum) / bucket_width
           );
           struct GapBucket *bucket = &buckets[bucket_index];
           if (!bucket->used) {
               bucket->minimum = nums[index];
               bucket->maximum = nums[index];
               bucket->used = 1;
           } else {
               if (nums[index] < bucket->minimum) {
                   bucket->minimum = nums[index];
               }
               if (nums[index] > bucket->maximum) {
                   bucket->maximum = nums[index];
               }
           }
       }

       int64_t answer = 0;
       int previous_maximum = 0;
       int has_previous = 0;
       for (size_t index = 0; index < bucket_count; ++index) {
           if (!buckets[index].used) {
               continue;
           }
           if (has_previous) {
               int64_t gap =
                   (int64_t)buckets[index].minimum - previous_maximum;
               if (gap > answer) {
                   answer = gap;
               }
           }
           previous_maximum = buckets[index].maximum;
           has_previous = 1;
       }

       free(buckets);
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
       int maximumGap(std::vector<int>& nums) {
           const int count = static_cast<int>(nums.size());
           if (count < 2) {
               return 0;
           }

           const auto [minimum_it, maximum_it] =
               std::minmax_element(nums.begin(), nums.end());
           const int minimum = *minimum_it;
           const int maximum = *maximum_it;
           const std::int64_t value_range =
               static_cast<std::int64_t>(maximum) - minimum;
           if (value_range == 0) {
               return 0;
           }

           const std::int64_t bucket_width =
               (value_range + count - 2) / (count - 1);
           const int bucket_count = static_cast<int>(
               value_range / bucket_width + 1
           );

           struct Bucket {
               int minimum = 0;
               int maximum = 0;
               bool used = false;
           };
           std::vector<Bucket> buckets(bucket_count);

           for (int value : nums) {
               const int index = static_cast<int>(
                   (static_cast<std::int64_t>(value) - minimum) /
                   bucket_width
               );
               Bucket& bucket = buckets[index];
               if (!bucket.used) {
                   bucket.minimum = value;
                   bucket.maximum = value;
                   bucket.used = true;
               } else {
                   bucket.minimum = std::min(bucket.minimum, value);
                   bucket.maximum = std::max(bucket.maximum, value);
               }
           }

           std::int64_t answer = 0;
           int previous_maximum = 0;
           bool has_previous = false;
           for (const Bucket& bucket : buckets) {
               if (!bucket.used) {
                   continue;
               }
               if (has_previous) {
                   answer = std::max(
                       answer,
                       static_cast<std::int64_t>(bucket.minimum) -
                           previous_maximum
                   );
               }
               previous_maximum = bucket.maximum;
               has_previous = true;
           }

           return static_cast<int>(answer);
       }
   };
