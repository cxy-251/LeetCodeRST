C
~

.. code-block:: c

   #include <stdint.h>
   #include <stdlib.h>
   #include <string.h>

   struct SlopeEntry {
       int dy;
       int dx;
       int count;
       int used;
   };

   static int gcd_abs(int first, int second) {
       first = abs(first);
       second = abs(second);
       while (second != 0) {
           int remainder = first % second;
           first = second;
           second = remainder;
       }
       return first;
   }

   static size_t slope_hash(int dy, int dx) {
       uint64_t first = (uint32_t)dy;
       uint64_t second = (uint32_t)dx;
       uint64_t mixed =
           first * UINT64_C(0x9e3779b185ebca87) ^
           second * UINT64_C(0xc2b2ae3d27d4eb4f);
       return (size_t)(mixed ^ (mixed >> 33));
   }

   int maxPoints(
       int **points,
       int pointsSize,
       int *pointsColSize
   ) {
       (void)pointsColSize;
       if (pointsSize <= 2) {
           return pointsSize;
       }

       size_t capacity = 1;
       while (capacity < (size_t)pointsSize * 4U) {
           capacity <<= 1U;
       }

       struct SlopeEntry *table =
           calloc(capacity, sizeof(*table));
       if (table == NULL) {
           return 0;
       }

       int answer = 2;
       for (int anchor = 0; anchor < pointsSize - 1; ++anchor) {
           memset(table, 0, capacity * sizeof(*table));
           int local_best = 0;

           for (int other = anchor + 1;
                other < pointsSize;
                ++other) {
               int dx = points[other][0] - points[anchor][0];
               int dy = points[other][1] - points[anchor][1];
               int divisor = gcd_abs(dx, dy);
               dx /= divisor;
               dy /= divisor;

               if (dx < 0 || (dx == 0 && dy < 0)) {
                   dx = -dx;
                   dy = -dy;
               }

               size_t index =
                   slope_hash(dy, dx) & (capacity - 1U);
               while (table[index].used &&
                      (table[index].dy != dy ||
                       table[index].dx != dx)) {
                   index = (index + 1U) & (capacity - 1U);
               }

               if (!table[index].used) {
                   table[index].used = 1;
                   table[index].dy = dy;
                   table[index].dx = dx;
                   table[index].count = 1;
               } else {
                   ++table[index].count;
               }

               if (table[index].count > local_best) {
                   local_best = table[index].count;
               }
           }

           if (local_best + 1 > answer) {
               answer = local_best + 1;
           }
       }

       free(table);
       return answer;
   }

C++
~~~

.. code-block:: cpp

   #include <cstdint>
   #include <numeric>
   #include <unordered_map>
   #include <vector>

   class Solution {
   public:
       int maxPoints(std::vector<std::vector<int>>& points) {
           int n = static_cast<int>(points.size());
           if (n <= 2) {
               return n;
           }

           int answer = 2;
           for (int anchor = 0; anchor < n - 1; ++anchor) {
               std::unordered_map<std::uint64_t, int> counts;
               int localBest = 0;

               for (int other = anchor + 1; other < n; ++other) {
                   int dx =
                       points[other][0] - points[anchor][0];
                   int dy =
                       points[other][1] - points[anchor][1];
                   int divisor = std::gcd(
                       dx < 0 ? -dx : dx,
                       dy < 0 ? -dy : dy
                   );
                   dx /= divisor;
                   dy /= divisor;

                   if (dx < 0 || (dx == 0 && dy < 0)) {
                       dx = -dx;
                       dy = -dy;
                   }

                   std::uint64_t key =
                       (std::uint64_t(
                           static_cast<std::uint32_t>(dy)
                        ) << 32U) |
                       static_cast<std::uint32_t>(dx);
                   int count = ++counts[key];
                   if (count > localBest) {
                       localBest = count;
                   }
               }
               if (localBest + 1 > answer) {
                   answer = localBest + 1;
               }
           }
           return answer;
       }
   };
