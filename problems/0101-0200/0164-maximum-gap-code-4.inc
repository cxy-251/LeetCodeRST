TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function maximumGap(nums: number[]): number {
       const count = nums.length;
       if (count < 2) {
           return 0;
       }

       let minimum = nums[0];
       let maximum = nums[0];
       for (const value of nums) {
           minimum = Math.min(minimum, value);
           maximum = Math.max(maximum, value);
       }

       const valueRange = maximum - minimum;
       if (valueRange === 0) {
           return 0;
       }

       const bucketWidth = Math.ceil(valueRange / (count - 1));
       const bucketCount = Math.floor(valueRange / bucketWidth) + 1;
       const buckets: Array<
           { minimum: number; maximum: number } | undefined
       > = new Array(bucketCount);

       for (const value of nums) {
           const index = Math.floor(
               (value - minimum) / bucketWidth,
           );
           const bucket = buckets[index];
           if (bucket === undefined) {
               buckets[index] = { minimum: value, maximum: value };
           } else {
               bucket.minimum = Math.min(bucket.minimum, value);
               bucket.maximum = Math.max(bucket.maximum, value);
           }
       }

       let answer = 0;
       let previousMaximum: number | undefined;
       for (const bucket of buckets) {
           if (bucket === undefined) {
               continue;
           }
           if (previousMaximum !== undefined) {
               answer = Math.max(
                   answer,
                   bucket.minimum - previousMaximum,
               );
           }
           previousMaximum = bucket.maximum;
       }

       return answer;
   }

C#
~~

.. code-block:: csharp

   using System;

   public class Solution {
       public int MaximumGap(int[] nums) {
           int count = nums.Length;
           if (count < 2) {
               return 0;
           }

           int minimum = nums[0];
           int maximum = nums[0];
           foreach (int value in nums) {
               minimum = Math.Min(minimum, value);
               maximum = Math.Max(maximum, value);
           }

           long valueRange = (long)maximum - minimum;
           if (valueRange == 0) {
               return 0;
           }

           long bucketWidth =
               (valueRange + count - 2L) / (count - 1L);
           int bucketCount =
               (int)(valueRange / bucketWidth + 1L);

           int[] bucketMinimums = new int[bucketCount];
           int[] bucketMaximums = new int[bucketCount];
           bool[] used = new bool[bucketCount];

           foreach (int value in nums) {
               int index = (int)(((long)value - minimum) / bucketWidth);
               if (!used[index]) {
                   bucketMinimums[index] = value;
                   bucketMaximums[index] = value;
                   used[index] = true;
               } else {
                   bucketMinimums[index] =
                       Math.Min(bucketMinimums[index], value);
                   bucketMaximums[index] =
                       Math.Max(bucketMaximums[index], value);
               }
           }

           long answer = 0;
           int previousMaximum = 0;
           bool hasPrevious = false;
           for (int index = 0; index < bucketCount; index++) {
               if (!used[index]) {
                   continue;
               }
               if (hasPrevious) {
                   answer = Math.Max(
                       answer,
                       (long)bucketMinimums[index] - previousMaximum
                   );
               }
               previousMaximum = bucketMaximums[index];
               hasPrevious = true;
           }

           return (int)answer;
       }
   }
