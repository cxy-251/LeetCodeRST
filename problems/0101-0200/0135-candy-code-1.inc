C
~

.. code-block:: c

   #include <stdlib.h>

   int candy(int *ratings, int ratingsSize) {
       int *candies = malloc((size_t)ratingsSize * sizeof(*candies));
       if (candies == NULL) {
           return 0;
       }
       for (int i = 0; i < ratingsSize; ++i) {
           candies[i] = 1;
       }
       for (int i = 1; i < ratingsSize; ++i) {
           if (ratings[i] > ratings[i - 1]) {
               candies[i] = candies[i - 1] + 1;
           }
       }
       for (int i = ratingsSize - 2; i >= 0; --i) {
           if (ratings[i] > ratings[i + 1] &&
               candies[i] <= candies[i + 1]) {
               candies[i] = candies[i + 1] + 1;
           }
       }
       int total = 0;
       for (int i = 0; i < ratingsSize; ++i) {
           total += candies[i];
       }
       free(candies);
       return total;
   }

C++
~~~

.. code-block:: cpp

   #include <algorithm>
   #include <numeric>
   #include <vector>

   class Solution {
   public:
       int candy(std::vector<int>& ratings) {
           int n = static_cast<int>(ratings.size());
           std::vector<int> candies(n, 1);
           for (int i = 1; i < n; ++i) {
               if (ratings[i] > ratings[i - 1]) {
                   candies[i] = candies[i - 1] + 1;
               }
           }
           for (int i = n - 2; i >= 0; --i) {
               if (ratings[i] > ratings[i + 1]) {
                   candies[i] = std::max(
                       candies[i], candies[i + 1] + 1
                   );
               }
           }
           return std::accumulate(candies.begin(), candies.end(), 0);
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def candy(self, ratings: list[int]) -> int:
           candies = [1] * len(ratings)
           for index in range(1, len(ratings)):
               if ratings[index] > ratings[index - 1]:
                   candies[index] = candies[index - 1] + 1
           for index in range(len(ratings) - 2, -1, -1):
               if ratings[index] > ratings[index + 1]:
                   candies[index] = max(
                       candies[index],
                       candies[index + 1] + 1,
                   )
           return sum(candies)
