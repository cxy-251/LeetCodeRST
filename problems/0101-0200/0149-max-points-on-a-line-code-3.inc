Rust
~~~~

.. code-block:: rust

   use std::collections::HashMap;

   impl Solution {
       pub fn max_points(points: Vec<Vec<i32>>) -> i32 {
           fn gcd(mut first: i32, mut second: i32) -> i32 {
               first = first.abs();
               second = second.abs();
               while second != 0 {
                   let remainder = first % second;
                   first = second;
                   second = remainder;
               }
               first
           }

           let n = points.len();
           if n <= 2 {
               return n as i32;
           }

           let mut answer = 2;
           for anchor in 0..(n - 1) {
               let mut counts: HashMap<(i32, i32), i32> =
                   HashMap::new();
               let mut local_best = 0;

               for other in (anchor + 1)..n {
                   let mut dx =
                       points[other][0] - points[anchor][0];
                   let mut dy =
                       points[other][1] - points[anchor][1];
                   let divisor = gcd(dx, dy);
                   dx /= divisor;
                   dy /= divisor;

                   if dx < 0 || (dx == 0 && dy < 0) {
                       dx = -dx;
                       dy = -dy;
                   }

                   let count = counts.entry((dy, dx)).or_insert(0);
                   *count += 1;
                   local_best = local_best.max(*count);
               }
               answer = answer.max(local_best + 1);
           }
           answer
       }
   }

Go
~~

.. code-block:: go

   type direction struct {
       dy int
       dx int
   }

   func maxPoints(points [][]int) int {
       n := len(points)
       if n <= 2 {
           return n
       }

       answer := 2
       for anchor := 0; anchor < n-1; anchor++ {
           counts := make(map[direction]int)
           localBest := 0

           for other := anchor + 1; other < n; other++ {
               dx := points[other][0] - points[anchor][0]
               dy := points[other][1] - points[anchor][1]
               divisor := gcd(abs(dx), abs(dy))
               dx /= divisor
               dy /= divisor

               if dx < 0 || (dx == 0 && dy < 0) {
                   dx = -dx
                   dy = -dy
               }

               key := direction{dy: dy, dx: dx}
               counts[key]++
               if counts[key] > localBest {
                   localBest = counts[key]
               }
           }
           if localBest+1 > answer {
               answer = localBest + 1
           }
       }
       return answer
   }

   func gcd(first int, second int) int {
       for second != 0 {
           first, second = second, first%second
       }
       return first
   }

   func abs(value int) int {
       if value < 0 {
           return -value
       }
       return value
   }
