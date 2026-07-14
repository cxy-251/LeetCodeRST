Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn maximum_gap(nums: Vec<i32>) -> i32 {
           let count = nums.len();
           if count < 2 {
               return 0;
           }

           let minimum = *nums.iter().min().unwrap();
           let maximum = *nums.iter().max().unwrap();
           let value_range = i64::from(maximum) - i64::from(minimum);
           if value_range == 0 {
               return 0;
           }

           let bucket_width =
               (value_range + count as i64 - 2) / (count as i64 - 1);
           let bucket_count =
               (value_range / bucket_width + 1) as usize;
           let mut buckets: Vec<Option<(i32, i32)>> =
               vec![None; bucket_count];

           for value in nums {
               let index = (
                   (i64::from(value) - i64::from(minimum)) / bucket_width
               ) as usize;
               buckets[index] = match buckets[index] {
                   None => Some((value, value)),
                   Some((bucket_minimum, bucket_maximum)) => Some((
                       bucket_minimum.min(value),
                       bucket_maximum.max(value),
                   )),
               };
           }

           let mut answer = 0i64;
           let mut previous_maximum: Option<i32> = None;
           for bucket in buckets.into_iter().flatten() {
               if let Some(previous) = previous_maximum {
                   answer = answer.max(i64::from(bucket.0) - i64::from(previous));
               }
               previous_maximum = Some(bucket.1);
           }

           answer as i32
       }
   }

Go
~~

.. code-block:: go

   type gapBucket struct {
       minimum int
       maximum int
       used    bool
   }

   func maximumGap(nums []int) int {
       count := len(nums)
       if count < 2 {
           return 0
       }

       minimum := nums[0]
       maximum := nums[0]
       for _, value := range nums {
           if value < minimum {
               minimum = value
           }
           if value > maximum {
               maximum = value
           }
       }

       valueRange := int64(maximum) - int64(minimum)
       if valueRange == 0 {
           return 0
       }

       bucketWidth :=
           (valueRange + int64(count) - 2) / (int64(count) - 1)
       bucketCount := int(valueRange/bucketWidth + 1)
       buckets := make([]gapBucket, bucketCount)

       for _, value := range nums {
           index := int(
               (int64(value) - int64(minimum)) / bucketWidth,
           )
           bucket := &buckets[index]
           if !bucket.used {
               bucket.minimum = value
               bucket.maximum = value
               bucket.used = true
           } else {
               if value < bucket.minimum {
                   bucket.minimum = value
               }
               if value > bucket.maximum {
                   bucket.maximum = value
               }
           }
       }

       answer := int64(0)
       previousMaximum := 0
       hasPrevious := false
       for _, bucket := range buckets {
           if !bucket.used {
               continue
           }
           if hasPrevious {
               gap := int64(bucket.minimum) - int64(previousMaximum)
               if gap > answer {
                   answer = gap
               }
           }
           previousMaximum = bucket.maximum
           hasPrevious = true
       }

       return int(answer)
   }
