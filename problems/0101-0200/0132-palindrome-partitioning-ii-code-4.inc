TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function minCut(s: string): number {
       const n = s.length;
       const pal = Array.from(
           { length: n },
           () => Array<boolean>(n).fill(false),
       );
       const cuts = Array.from({ length: n }, (_, i) => i);

       for (let end = 0; end < n; end++) {
           for (let start = end; start >= 0; start--) {
               const inner =
                   end - start <= 1 || pal[start + 1][end - 1];
               if (s[start] === s[end] && inner) {
                   pal[start][end] = true;
                   const candidate =
                       start === 0 ? 0 : cuts[start - 1] + 1;
                   cuts[end] = Math.min(cuts[end], candidate);
               }
           }
       }
       return cuts[n - 1];
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int MinCut(string s) {
           int n = s.Length;
           bool[,] pal = new bool[n, n];
           int[] cuts = new int[n];

           for (int end = 0; end < n; ++end) {
               cuts[end] = end;
               for (int start = end; start >= 0; --start) {
                   bool inner = end - start <= 1 ||
                       pal[start + 1, end - 1];
                   if (s[start] == s[end] && inner) {
                       pal[start, end] = true;
                       int candidate =
                           start == 0 ? 0 : cuts[start - 1] + 1;
                       cuts[end] = Math.Min(cuts[end], candidate);
                   }
               }
           }
           return cuts[n - 1];
       }
   }
