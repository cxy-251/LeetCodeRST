Java
~~~~

.. code-block:: java

   import java.util.Arrays;

   class Solution {
       public int candy(int[] ratings) {
           int[] candies = new int[ratings.length];
           Arrays.fill(candies, 1);
           for (int i = 1; i < ratings.length; ++i) {
               if (ratings[i] > ratings[i - 1]) {
                   candies[i] = candies[i - 1] + 1;
               }
           }
           for (int i = ratings.length - 2; i >= 0; --i) {
               if (ratings[i] > ratings[i + 1]) {
                   candies[i] = Math.max(
                       candies[i], candies[i + 1] + 1
                   );
               }
           }
           int total = 0;
           for (int value : candies) total += value;
           return total;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn candy(ratings: Vec<i32>) -> i32 {
           let n = ratings.len();
           let mut candies = vec![1_i32; n];
           for index in 1..n {
               if ratings[index] > ratings[index - 1] {
                   candies[index] = candies[index - 1] + 1;
               }
           }
           for index in (0..n - 1).rev() {
               if ratings[index] > ratings[index + 1] {
                   candies[index] = candies[index].max(
                       candies[index + 1] + 1,
                   );
               }
           }
           candies.into_iter().sum()
       }
   }

Go
~~

.. code-block:: go

   func candy(ratings []int) int {
       candies := make([]int, len(ratings))
       for index := range candies {
           candies[index] = 1
       }
       for index := 1; index < len(ratings); index++ {
           if ratings[index] > ratings[index-1] {
               candies[index] = candies[index-1] + 1
           }
       }
       for index := len(ratings) - 2; index >= 0; index-- {
           if ratings[index] > ratings[index+1] &&
               candies[index] <= candies[index+1] {
               candies[index] = candies[index+1] + 1
           }
       }
       total := 0
       for _, value := range candies {
           total += value
       }
       return total
   }
