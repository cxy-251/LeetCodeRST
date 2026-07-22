0135. Candy
===========

题目信息
--------

:题号: 0135
:难度: Hard
:主题: 贪心、双向扫描、局部约束
:原题: `LeetCode 0135 <https://leetcode.com/problems/candy/>`_
:教学重点: 左右下界拆分、逐点最大值、相等评分边界

题目重述
--------

一列孩子各有评分。每人至少一颗糖；若某人的评分严格高于相邻孩子，则糖果也必须更多。返回满足条件的最少糖果总数。相等评分之间没有大小要求。

自建示例
--------

.. code-block:: text

   ratings = [4,1,2,5,3]
   最优 candies = [2,1,2,3,1]，总数 9

   ratings = [2,2,3,2,2]
   最优 candies = [1,1,2,1,1]，总数 6

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <numeric>
   #include <vector>

   class Solution {
   private:
       int repeatedRelaxation(const std::vector<int>& ratings) {
           int n = ratings.size();
           std::vector<int> candies(n, 1);
           bool changed = true;
           while (changed) {
               changed = false;
               for (int i = 0; i + 1 < n; ++i) {
                   if (ratings[i] > ratings[i + 1] && candies[i] <= candies[i + 1]) {
                       candies[i] = candies[i + 1] + 1; changed = true;
                   }
                   if (ratings[i] < ratings[i + 1] && candies[i] >= candies[i + 1]) {
                       candies[i + 1] = candies[i] + 1; changed = true;
                   }
               }
           }
           return std::accumulate(candies.begin(), candies.end(), 0);
       }

       int twoArrays(const std::vector<int>& ratings) {
           int n = ratings.size();
           std::vector<int> left(n, 1), right(n, 1);
           for (int i = 1; i < n; ++i)
               if (ratings[i] > ratings[i - 1]) left[i] = left[i - 1] + 1;
           for (int i = n - 2; i >= 0; --i)
               if (ratings[i] > ratings[i + 1]) right[i] = right[i + 1] + 1;
           int total = 0;
           for (int i = 0; i < n; ++i) total += std::max(left[i], right[i]);
           return total;
       }

       int oneArray(const std::vector<int>& ratings) {
           int n = ratings.size();
           std::vector<int> candies(n, 1);
           for (int i = 1; i < n; ++i)
               if (ratings[i] > ratings[i - 1]) candies[i] = candies[i - 1] + 1;
           int right = 1, total = candies[n - 1];
           for (int i = n - 2; i >= 0; --i) {
               right = ratings[i] > ratings[i + 1] ? right + 1 : 1;
               total += std::max(candies[i], right);
           }
           return total;
       }

   public:
       int candy(std::vector<int>& ratings) {
           return oneArray(ratings);
       }
   };

题解
----

为何拆成两个方向
~~~~~~~~~~~~~~

从左向右只能处理 ``ratings[i] > ratings[i-1]`` 的约束；从右向左只能处理 ``ratings[i] > ratings[i+1]``。两个方向分别给出每个位置必须达到的最小糖果下界。

左侧与右侧下界
~~~~~~~~~~~~~~

.. code-block:: text

   left[i]  = rating 向左严格上升时的最小长度
   right[i] = rating 向右严格上升时的最小长度
   answer[i] = max(left[i], right[i])

逐点最大值为何足够
~~~~~~~~~~~~~~~~

任意合法分配都必须同时不小于左右下界，所以必须至少达到两者最大值。取最大值后，左向约束由 ``left`` 保证，右向约束由 ``right`` 保证，因此该逐点下界本身可行，也就是全局最小。

.. list-table::
   :header-rows: 1

   * - 评分
     - 左下界
     - 右下界
     - 最终
   * - 4
     - 1
     - 2
     - 2
   * - 1
     - 1
     - 1
     - 1
   * - 2
     - 2
     - 1
     - 2
   * - 5
     - 3
     - 2
     - 3
   * - 3
     - 1
     - 1
     - 1

相等评分为何重置为 1
~~~~~~~~~~~~~~~~~~

相等评分之间没有约束，不能把前一段上升或下降长度传播过去。每个方向遇到不严格上升时，下界回到最小值 1。

复杂度来源
~~~~~~~~~~

双向扫描为 ``O(n)`` 时间。双数组使用 ``O(n)`` 空间；主实现复用左下界数组并滚动维护右下界，仍为 ``O(n)`` 空间，但状态更少。

九语言实现
----------

C
~

.. code-block:: c

   int candy(int*r,int n){int*c=malloc((size_t)n*sizeof(int));c[0]=1;for(int i=1;i<n;i++)c[i]=r[i]>r[i-1]?c[i-1]+1:1;int right=1,total=c[n-1];for(int i=n-2;i>=0;i--){right=r[i]>r[i+1]?right+1:1;total+=c[i]>right?c[i]:right;}free(c);return total;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def candy(self, ratings: list[int]) -> int:
           n=len(ratings); c=[1]*n
           for i in range(1,n):
               if ratings[i]>ratings[i-1]: c[i]=c[i-1]+1
           right=1; total=c[-1]
           for i in range(n-2,-1,-1):
               right=right+1 if ratings[i]>ratings[i+1] else 1
               total+=max(c[i],right)
           return total

Java
~~~~

.. code-block:: java

   class Solution {public int candy(int[]r){int n=r.length;int[]c=new int[n];Arrays.fill(c,1);for(int i=1;i<n;i++)if(r[i]>r[i-1])c[i]=c[i-1]+1;int right=1,total=c[n-1];for(int i=n-2;i>=0;i--){right=r[i]>r[i+1]?right+1:1;total+=Math.max(c[i],right);}return total;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn candy(r:Vec<i32>)->i32{let n=r.len();let mut c=vec![1;n];for i in 1..n{if r[i]>r[i-1]{c[i]=c[i-1]+1;}}let(mut right,mut total)=(1,c[n-1]);for i in(0..n-1).rev(){right=if r[i]>r[i+1]{right+1}else{1};total+=c[i].max(right);}total}}

Go
~~

.. code-block:: go

   func candy(r []int)int{n:=len(r);c:=make([]int,n);c[0]=1;for i:=1;i<n;i++{c[i]=1;if r[i]>r[i-1]{c[i]=c[i-1]+1}};right,total:=1,c[n-1];for i:=n-2;i>=0;i--{if r[i]>r[i+1]{right++}else{right=1};if c[i]>right{total+=c[i]}else{total+=right}};return total}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function candy(r:number[]):number{const n=r.length,c=Array(n).fill(1);for(let i=1;i<n;i++)if(r[i]>r[i-1])c[i]=c[i-1]+1;let right=1,total=c[n-1];for(let i=n-2;i>=0;i--){right=r[i]>r[i+1]?right+1:1;total+=Math.max(c[i],right);}return total;}

C#
~~

.. code-block:: csharp

   public class Solution {public int Candy(int[]r){int n=r.Length;var c=Enumerable.Repeat(1,n).ToArray();for(int i=1;i<n;i++)if(r[i]>r[i-1])c[i]=c[i-1]+1;int right=1,total=c[n-1];for(int i=n-2;i>=0;i--){right=r[i]>r[i+1]?right+1:1;total+=Math.Max(c[i],right);}return total;}}

Julia
~~~~~

.. code-block:: julia

   function candy(r)
       n=length(r);c=ones(Int,n)
       for i in 2:n;if r[i]>r[i-1];c[i]=c[i-1]+1;end;end
       right=1;total=c[n]
       for i in n-1:-1:1;right=r[i]>r[i+1] ? right+1 : 1;total+=max(c[i],right);end;total
   end

R
~

.. code-block:: r

   candy <- function(r){n<-length(r);c<-rep(1L,n);if(n>1L)for(i in 2:n)if(r[[i]]>r[[i-1L]])c[[i]]<-c[[i-1L]]+1L;right<-1L;total<-c[[n]];if(n>1L)for(i in (n-1L):1L){right<-if(r[[i]]>r[[i+1L]])right+1L else 1L;total<-total+max(c[[i]],right)};total}
