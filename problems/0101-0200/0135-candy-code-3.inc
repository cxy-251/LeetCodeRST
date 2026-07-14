TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function candy(ratings: number[]): number {
       const candies = Array<number>(ratings.length).fill(1);
       for (let index = 1; index < ratings.length; index++) {
           if (ratings[index] > ratings[index - 1]) {
               candies[index] = candies[index - 1] + 1;
           }
       }
       for (let index = ratings.length - 2; index >= 0; index--) {
           if (ratings[index] > ratings[index + 1]) {
               candies[index] = Math.max(
                   candies[index],
                   candies[index + 1] + 1,
               );
           }
       }
       return candies.reduce((sum, value) => sum + value, 0);
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int Candy(int[] ratings) {
           int[] candies = new int[ratings.Length];
           Array.Fill(candies, 1);
           for (int index = 1; index < ratings.Length; ++index) {
               if (ratings[index] > ratings[index - 1]) {
                   candies[index] = candies[index - 1] + 1;
               }
           }
           for (int index = ratings.Length - 2; index >= 0; --index) {
               if (ratings[index] > ratings[index + 1]) {
                   candies[index] = Math.Max(
                       candies[index], candies[index + 1] + 1
                   );
               }
           }
           int total = 0;
           foreach (int value in candies) total += value;
           return total;
       }
   }
