Python
~~~~~~

.. code-block:: python

   class Solution:
       def maximumGap(self, nums: list[int]) -> int:
           count = len(nums)
           if count < 2:
               return 0

           minimum = min(nums)
           maximum = max(nums)
           value_range = maximum - minimum
           if value_range == 0:
               return 0

           bucket_width = (value_range + count - 2) // (count - 1)
           bucket_count = value_range // bucket_width + 1
           buckets: list[tuple[int, int] | None] = [None] * bucket_count

           for value in nums:
               index = (value - minimum) // bucket_width
               bucket = buckets[index]
               if bucket is None:
                   buckets[index] = (value, value)
               else:
                   buckets[index] = (
                       min(bucket[0], value),
                       max(bucket[1], value),
                   )

           answer = 0
           previous_maximum: int | None = None
           for bucket in buckets:
               if bucket is None:
                   continue
               if previous_maximum is not None:
                   answer = max(answer, bucket[0] - previous_maximum)
               previous_maximum = bucket[1]

           return answer

Java
~~~~

.. code-block:: java

   class Solution {
       public int maximumGap(int[] nums) {
           int count = nums.length;
           if (count < 2) {
               return 0;
           }

           int minimum = nums[0];
           int maximum = nums[0];
           for (int value : nums) {
               minimum = Math.min(minimum, value);
               maximum = Math.max(maximum, value);
           }

           long valueRange = (long) maximum - minimum;
           if (valueRange == 0) {
               return 0;
           }

           long bucketWidth =
               (valueRange + count - 2L) / (count - 1L);
           int bucketCount =
               (int) (valueRange / bucketWidth + 1L);

           int[] bucketMinimums = new int[bucketCount];
           int[] bucketMaximums = new int[bucketCount];
           boolean[] used = new boolean[bucketCount];

           for (int value : nums) {
               int index = (int) (((long) value - minimum) / bucketWidth);
               if (!used[index]) {
                   bucketMinimums[index] = value;
                   bucketMaximums[index] = value;
                   used[index] = true;
               } else {
                   bucketMinimums[index] =
                       Math.min(bucketMinimums[index], value);
                   bucketMaximums[index] =
                       Math.max(bucketMaximums[index], value);
               }
           }

           long answer = 0;
           int previousMaximum = 0;
           boolean hasPrevious = false;
           for (int index = 0; index < bucketCount; index++) {
               if (!used[index]) {
                   continue;
               }
               if (hasPrevious) {
                   answer = Math.max(
                       answer,
                       (long) bucketMinimums[index] - previousMaximum
                   );
               }
               previousMaximum = bucketMaximums[index];
               hasPrevious = true;
           }

           return (int) answer;
       }
   }
