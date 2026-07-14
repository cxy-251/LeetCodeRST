Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn compare_version(version1: String, version2: String) -> i32 {
           let left = version1.as_bytes();
           let right = version2.as_bytes();
           let mut position1 = 0usize;
           let mut position2 = 0usize;

           while position1 < left.len() || position2 < right.len() {
               let (start1, digits1, next1) =
                   Self::read_segment(left, position1);
               let (start2, digits2, next2) =
                   Self::read_segment(right, position2);

               if digits1 != digits2 {
                   return if digits1 < digits2 { -1 } else { 1 };
               }

               for offset in 0..digits1 {
                   let first = left[start1 + offset];
                   let second = right[start2 + offset];
                   if first != second {
                       return if first < second { -1 } else { 1 };
                   }
               }

               position1 = next1;
               position2 = next2;
           }

           0
       }

       fn read_segment(
           version: &[u8],
           position: usize,
       ) -> (usize, usize, usize) {
           let mut end = position;
           while end < version.len() && version[end] != b'.' {
               end += 1;
           }

           let mut significant = position;
           while significant < end && version[significant] == b'0' {
               significant += 1;
           }

           let next = if end < version.len() {
               end + 1
           } else {
               version.len()
           };
           (significant, end - significant, next)
       }
   }

Go
~~

.. code-block:: go

   func compareVersion(version1 string, version2 string) int {
       position1 := 0
       position2 := 0

       for position1 < len(version1) || position2 < len(version2) {
           start1, digits1, next1 :=
               readVersionSegment(version1, position1)
           start2, digits2, next2 :=
               readVersionSegment(version2, position2)

           if digits1 < digits2 {
               return -1
           }
           if digits1 > digits2 {
               return 1
           }

           for offset := 0; offset < digits1; offset++ {
               first := version1[start1+offset]
               second := version2[start2+offset]
               if first < second {
                   return -1
               }
               if first > second {
                   return 1
               }
           }

           position1 = next1
           position2 = next2
       }

       return 0
   }

   func readVersionSegment(
       version string,
       position int,
   ) (int, int, int) {
       end := position
       for end < len(version) && version[end] != '.' {
           end++
       }

       significant := position
       for significant < end && version[significant] == '0' {
           significant++
       }

       next := len(version)
       if end < len(version) {
           next = end + 1
       }
       return significant, end - significant, next
   }
