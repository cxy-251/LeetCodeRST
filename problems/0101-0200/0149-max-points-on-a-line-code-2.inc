Python
~~~~~~

.. code-block:: python

   from collections import defaultdict
   from math import gcd

   class Solution:
       def maxPoints(self, points: list[list[int]]) -> int:
           n = len(points)
           if n <= 2:
               return n

           answer = 2
           for anchor in range(n - 1):
               counts: dict[tuple[int, int], int] = defaultdict(int)
               local_best = 0

               for other in range(anchor + 1, n):
                   dx = points[other][0] - points[anchor][0]
                   dy = points[other][1] - points[anchor][1]
                   divisor = gcd(abs(dx), abs(dy))
                   dx //= divisor
                   dy //= divisor

                   if dx < 0 or (dx == 0 and dy < 0):
                       dx = -dx
                       dy = -dy

                   direction = (dy, dx)
                   counts[direction] += 1
                   local_best = max(
                       local_best,
                       counts[direction],
                   )

               answer = max(answer, local_best + 1)

           return answer

Java
~~~~

.. code-block:: java

   import java.util.HashMap;
   import java.util.Map;

   class Solution {
       public int maxPoints(int[][] points) {
           int n = points.length;
           if (n <= 2) {
               return n;
           }

           int answer = 2;
           for (int anchor = 0; anchor < n - 1; ++anchor) {
               Map<Long, Integer> counts = new HashMap<>();
               int localBest = 0;

               for (int other = anchor + 1; other < n; ++other) {
                   int dx =
                       points[other][0] - points[anchor][0];
                   int dy =
                       points[other][1] - points[anchor][1];
                   int divisor = gcd(Math.abs(dx), Math.abs(dy));
                   dx /= divisor;
                   dy /= divisor;

                   if (dx < 0 || (dx == 0 && dy < 0)) {
                       dx = -dx;
                       dy = -dy;
                   }

                   long key =
                       ((long)dy << 32) ^
                       (dx & 0xffffffffL);
                   int count = counts.getOrDefault(key, 0) + 1;
                   counts.put(key, count);
                   localBest = Math.max(localBest, count);
               }
               answer = Math.max(answer, localBest + 1);
           }
           return answer;
       }

       private static int gcd(int first, int second) {
           while (second != 0) {
               int remainder = first % second;
               first = second;
               second = remainder;
           }
           return first;
       }
   }
