C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stdlib.h>
   #include <string.h>

   int minCut(char *s) {
       int n = (int)strlen(s);
       bool *pal = calloc((size_t)n * (size_t)n, sizeof(*pal));
       int *cuts = malloc((size_t)n * sizeof(*cuts));
       if (pal == NULL || cuts == NULL) {
           free(pal);
           free(cuts);
           return 0;
       }

       for (int end = 0; end < n; ++end) {
           cuts[end] = end;
           for (int start = end; start >= 0; --start) {
               bool inner = end - start <= 1 ||
                   pal[(size_t)(start + 1) * (size_t)n + end - 1];
               if (s[start] == s[end] && inner) {
                   pal[(size_t)start * (size_t)n + end] = true;
                   int candidate = start == 0 ? 0 : cuts[start - 1] + 1;
                   if (candidate < cuts[end]) cuts[end] = candidate;
               }
           }
       }

       int answer = cuts[n - 1];
       free(pal);
       free(cuts);
       return answer;
   }

C++
~~~

.. code-block:: cpp

   #include <algorithm>
   #include <string>
   #include <vector>

   class Solution {
   public:
       int minCut(std::string s) {
           int n = static_cast<int>(s.size());
           std::vector<std::vector<char>> pal(
               n, std::vector<char>(n, false)
           );
           std::vector<int> cuts(n);

           for (int end = 0; end < n; ++end) {
               cuts[end] = end;
               for (int start = end; start >= 0; --start) {
                   bool inner = end - start <= 1 ||
                       pal[start + 1][end - 1];
                   if (s[start] == s[end] && inner) {
                       pal[start][end] = true;
                       int candidate =
                           start == 0 ? 0 : cuts[start - 1] + 1;
                       cuts[end] = std::min(cuts[end], candidate);
                   }
               }
           }
           return cuts[n - 1];
       }
   };
