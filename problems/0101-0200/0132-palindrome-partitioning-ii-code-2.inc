Python
~~~~~~

.. code-block:: python

   class Solution:
       def minCut(self, s: str) -> int:
           n = len(s)
           pal = [[False] * n for _ in range(n)]
           cuts = list(range(n))

           for end in range(n):
               for start in range(end, -1, -1):
                   inner = (
                       end - start <= 1
                       or pal[start + 1][end - 1]
                   )
                   if s[start] == s[end] and inner:
                       pal[start][end] = True
                       candidate = (
                           0 if start == 0 else cuts[start - 1] + 1
                       )
                       cuts[end] = min(cuts[end], candidate)
           return cuts[-1]

Java
~~~~

.. code-block:: java

   class Solution {
       public int minCut(String s) {
           int n = s.length();
           boolean[][] pal = new boolean[n][n];
           int[] cuts = new int[n];

           for (int end = 0; end < n; ++end) {
               cuts[end] = end;
               for (int start = end; start >= 0; --start) {
                   boolean inner = end - start <= 1 ||
                       pal[start + 1][end - 1];
                   if (s.charAt(start) == s.charAt(end) && inner) {
                       pal[start][end] = true;
                       int candidate =
                           start == 0 ? 0 : cuts[start - 1] + 1;
                       cuts[end] = Math.min(cuts[end], candidate);
                   }
               }
           }
           return cuts[n - 1];
       }
   }
