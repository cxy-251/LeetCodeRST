0135. Candy
===========

题目信息
--------

:题号: 0135
:难度: Hard
:主题: 贪心、双向扫描、局部约束
:原题: `LeetCode 0135 <https://leetcode.com/problems/candy/>`_
:访问状态: Available
:教学重点: 左右邻约束拆分、下界合并、最小总量

题目重述
--------

一排孩子各有一个评分。每个孩子至少得到一颗糖；评分高于相邻孩子时，糖果数也必须更多。
返回满足全部相邻约束所需的最少糖果总数。输入数组非空。

算法
----

先令每个位置的糖果数为 ``1``。

第一次从左向右扫描：若 ``ratings[i] > ratings[i-1]``，则令
``candies[i] = candies[i-1] + 1``，满足来自左邻居的递增约束。

第二次从右向左扫描：若 ``ratings[i] > ratings[i+1]``，则令
``candies[i] = max(candies[i], candies[i+1] + 1)``。``max`` 保留第一次扫描已经建立的左侧下界，
同时满足右侧下界。最后求和。

正确性
~~~~~~

左扫结束后，每个评分高于左邻居的位置都严格多一颗糖；右扫结束后，每个评分高于右邻居的位置也严格
更多。未触发比较的位置仍至少有一颗，因此分配满足全部条件。

对每个位置，左扫值是满足左侧递增链所需的最小下界，右侧关系给出另一个最小下界。
任何合法分配都不能低于这两个下界中的较大值。算法逐点取它们的最大值，因此每个位置都达到合法最小值，
总和也最小。

复杂度
~~~~~~

两次线性扫描，时间 ``O(n)``。糖果数组占 ``O(n)`` 额外空间。

核心语言实现
------------

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

Julia
~~~~~

.. code-block:: julia

   function candy(ratings::Vector{Int})::Int
       candies = ones(Int, length(ratings))
       for index in 2:length(ratings)
           if ratings[index] > ratings[index - 1]
               candies[index] = candies[index - 1] + 1
           end
       end
       for index in length(ratings)-1:-1:1
           if ratings[index] > ratings[index + 1]
               candies[index] = max(
                   candies[index],
                   candies[index + 1] + 1,
               )
           end
       end
       return sum(candies)
   end

R
~

.. code-block:: r

   candy <- function(ratings) {
     n <- length(ratings)
     candies <- rep.int(1L, n)
     if (n >= 2L) {
       for (index in 2L:n) {
         if (ratings[[index]] > ratings[[index - 1L]]) {
           candies[[index]] <- candies[[index - 1L]] + 1L
         }
       }
       for (index in seq.int(n - 1L, 1L, by = -1L)) {
         if (ratings[[index]] > ratings[[index + 1L]]) {
           candies[[index]] <- max(
             candies[[index]],
             candies[[index + 1L]] + 1L
           )
         }
       }
     }
     sum(candies)
   }

关键边界
--------

* 单个孩子返回 ``1``；
* 相等评分之间没有严格大小要求；
* 严格递增和严格递减序列都需要形成阶梯；
* 右扫必须取 ``max``，否则会破坏左扫已经满足的约束。

验证
----

运行两个官方示例，并补充单元素、严格递增和严格递减边界；Python 与 C++ 结果一致。
未执行随机对拍。

最小自检
--------

#. 为什么一次从左到右扫描不够？
#. 右扫时为什么不能直接覆盖 ``candies[i]``？
#. 为什么逐点取两个必要下界的最大值能够保证总和最小？
