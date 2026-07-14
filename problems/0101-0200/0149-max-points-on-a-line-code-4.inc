TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function maxPoints(points: number[][]): number {
       const n = points.length;
       if (n <= 2) {
           return n;
       }

       let answer = 2;
       for (let anchor = 0; anchor < n - 1; anchor += 1) {
           const counts = new Map<string, number>();
           let localBest = 0;

           for (let other = anchor + 1; other < n; other += 1) {
               let dx = points[other][0] - points[anchor][0];
               let dy = points[other][1] - points[anchor][1];
               const divisor = gcd(Math.abs(dx), Math.abs(dy));
               dx /= divisor;
               dy /= divisor;

               if (dx < 0 || (dx === 0 && dy < 0)) {
                   dx = -dx;
                   dy = -dy;
               }

               const key = `${dy},${dx}`;
               const count = (counts.get(key) ?? 0) + 1;
               counts.set(key, count);
               localBest = Math.max(localBest, count);
           }
           answer = Math.max(answer, localBest + 1);
       }
       return answer;
   }

   function gcd(first: number, second: number): number {
       while (second !== 0) {
           const remainder = first % second;
           first = second;
           second = remainder;
       }
       return first;
   }

C#
~~

.. code-block:: csharp

   using System;
   using System.Collections.Generic;

   public class Solution {
       public int MaxPoints(int[][] points) {
           int n = points.Length;
           if (n <= 2) {
               return n;
           }

           int answer = 2;
           for (int anchor = 0; anchor < n - 1; ++anchor) {
               var counts =
                   new Dictionary<(int dy, int dx), int>();
               int localBest = 0;

               for (int other = anchor + 1; other < n; ++other) {
                   int dx =
                       points[other][0] - points[anchor][0];
                   int dy =
                       points[other][1] - points[anchor][1];
                   int divisor = Gcd(Math.Abs(dx), Math.Abs(dy));
                   dx /= divisor;
                   dy /= divisor;

                   if (dx < 0 || (dx == 0 && dy < 0)) {
                       dx = -dx;
                       dy = -dy;
                   }

                   var key = (dy, dx);
                   counts.TryGetValue(key, out int count);
                   ++count;
                   counts[key] = count;
                   localBest = Math.Max(localBest, count);
               }
               answer = Math.Max(answer, localBest + 1);
           }
           return answer;
       }

       private static int Gcd(int first, int second) {
           while (second != 0) {
               int remainder = first % second;
               first = second;
               second = remainder;
           }
           return first;
       }
   }
