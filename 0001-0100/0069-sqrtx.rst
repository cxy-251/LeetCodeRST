0069. Sqrt(x)
=============

题目信息
--------

:题号: 0069
:题名: Sqrt(x)
:难度: Easy
:类型: Algorithms
:主题: 数学、二分查找、牛顿迭代、整数边界
:原题: `LeetCode 0069 <https://leetcode.com/problems/sqrtx/>`_
:教学重点: 下取整语义、最后真值、除法防溢出、区间不变量

题目重述
--------

给定非负 32 位整数 ``x``，返回 ``sqrt(x)`` 向下取整的整数，不使用平方根或幂函数。答案满足 ``answer² <= x < (answer+1)²``。

自建示例
--------

.. code-block:: text

   x = 144        -> 12
   x = 27         -> 5
   x = 0          -> 0
   x = 2147483647 -> 46340

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>

   class Solution {
   private:
       int linearSearch(int x) {
           if (x < 2) return x;
           int answer = 1;
           for (int candidate = 2; candidate <= x / candidate; ++candidate)
               answer = candidate;
           return answer;
       }

       int newtonIteration(int x) {
           if (x < 2) return x;
           long long estimate = x;
           while (estimate > x / estimate)
               estimate = (estimate + x / estimate) / 2;
           return static_cast<int>(estimate);
       }

       int binaryLastTrue(int x) {
           if (x < 2) return x;
           int left = 1, right = x / 2 + 1;
           int answer = 1;
           while (left <= right) {
               int mid = left + (right - left) / 2;
               if (mid <= x / mid) {
                   answer = mid;
                   left = mid + 1;
               } else {
                   right = mid - 1;
               }
           }
           return answer;
       }

   public:
       int mySqrt(int x) {
           return binaryLastTrue(x);
       }
   };

题解
----

向下取整意味着寻找什么
~~~~~~~~~~~~~~~~~~~~

目标不是判断某个整数是否恰好平方为 ``x``，而是寻找满足 ``candidate² <= x`` 的最大整数。谓词随候选增大只会从真变为假，因此是标准“最后一个真值”边界。

为什么不能直接比较 mid * mid
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``x`` 最大接近 ``2³¹``，而二分中间值的平方可能超过 32 位范围。对正数 ``mid``，以下比较完全等价：

.. code-block:: text

   mid * mid <= x
   mid <= x / mid

整数除法向下取整不会改变真假关系，并避免乘法溢出。

二分区间如何维护
~~~~~~~~~~~~~~~~

当 ``mid <= x/mid`` 时，``mid`` 是合法候选，但可能还有更大合法值，因此记录它并令 ``left=mid+1``。否则 ``mid`` 及更大值全部非法，令 ``right=mid-1``。

x = 27 的状态跟踪
~~~~~~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - ``left..right``
     - ``mid``
     - 判断
     - 动作
   * - ``1..14``
     - 7
     - ``7 > 27/7``
     - 右边界变 6
   * - ``1..6``
     - 3
     - ``3 <= 27/3``
     - 记录 3，左边界变 4
   * - ``4..6``
     - 5
     - ``5 <= 27/5``
     - 记录 5，左边界变 6
   * - ``6..6``
     - 6
     - ``6 > 27/6``
     - 右边界变 5，结束

最终记录的最后合法值为 5。

为什么初始右边界可以取 x/2+1
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

对 ``x >= 2``，平方根不会超过 ``x/2+1``。使用更紧右边界减少一次常数范围；即使直接使用 ``x``，二分复杂度仍为 ``O(log x)``。

answer 变量保存什么不变量
~~~~~~~~~~~~~~~~~~~~~~~~

``answer`` 始终是已经验证过的最大合法候选。搜索结束时 ``left > right``，所有比 ``answer`` 大的候选都已被排除，因此它正是向下取整平方根。

牛顿迭代为何收敛
~~~~~~~~~~~~~~~~

对方程 ``r²=x``，迭代 ``r=(r+x/r)/2`` 会把过大的估计快速拉向平方根。使用整数除法时，当 ``estimate <= x/estimate`` 就已不大于真实平方根；从上方开始迭代，停止值就是下取整结果。

线性试探为何仍可作为基准
~~~~~~~~~~~~~~~~~~~~~~~~

从 1 递增并保存最后合法值直接对应定义，但需要 ``O(sqrt(x))`` 次判断。它说明边界目标，再由单调性导出二分优化。

为什么结果满足两侧不等式
~~~~~~~~~~~~~~~~~~~~~~~~

算法返回最大的合法整数，所以 ``answer² <= x``。若 ``(answer+1)² <= x``，它也应被判为合法，与最大性矛盾，因此 ``x < (answer+1)²``。

复杂度来源
~~~~~~~~~~

线性方法时间 ``O(sqrt(x))``；二分为 ``O(log x)``；牛顿迭代通常为 ``O(log x)`` 轮且收敛更快。三者额外空间均为 ``O(1)``。

九语言实现
----------

C
~

.. code-block:: c

   int mySqrt(int x){if(x<2)return x;int left=1,right=x/2+1,answer=1;while(left<=right){int mid=left+(right-left)/2;if(mid<=x/mid){answer=mid;left=mid+1;}else right=mid-1;}return answer;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def mySqrt(self, x: int) -> int:
           if x < 2: return x
           left, right, answer = 1, x // 2 + 1, 1
           while left <= right:
               mid = left + (right - left) // 2
               if mid <= x // mid: answer, left = mid, mid + 1
               else: right = mid - 1
           return answer

Java
~~~~

.. code-block:: java

   class Solution {public int mySqrt(int x){if(x<2)return x;int left=1,right=x/2+1,answer=1;while(left<=right){int mid=left+(right-left)/2;if(mid<=x/mid){answer=mid;left=mid+1;}else right=mid-1;}return answer;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn my_sqrt(x:i32)->i32{if x<2{return x}let(mut left,mut right,mut answer)=(1,x/2+1,1);while left<=right{let mid=left+(right-left)/2;if mid<=x/mid{answer=mid;left=mid+1}else{right=mid-1}}answer}}

Go
~~

.. code-block:: go

   func mySqrt(x int)int{if x<2{return x};left,right,answer:=1,x/2+1,1;for left<=right{mid:=left+(right-left)/2;if mid<=x/mid{answer=mid;left=mid+1}else{right=mid-1}};return answer}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function mySqrt(x:number):number{if(x<2)return x;let left=1,right=Math.floor(x/2)+1,answer=1;while(left<=right){const mid=left+Math.floor((right-left)/2);if(mid<=Math.floor(x/mid)){answer=mid;left=mid+1;}else right=mid-1;}return answer;}

C#
~~

.. code-block:: csharp

   public class Solution {public int MySqrt(int x){if(x<2)return x;int left=1,right=x/2+1,answer=1;while(left<=right){int mid=left+(right-left)/2;if(mid<=x/mid){answer=mid;left=mid+1;}else right=mid-1;}return answer;}}

Julia
~~~~~

.. code-block:: julia

   function my_sqrt(x::Int)
       x<2&&return x;left=1;right=x÷2+1;answer=1
       while left<=right;mid=left+(right-left)÷2;if mid<=x÷mid;answer=mid;left=mid+1;else;right=mid-1;end;end
       answer
   end

R
~

.. code-block:: r

   my_sqrt <- function(x){if(x<2L)return(x);left<-1L;right<-x%/%2L+1L;answer<-1L;while(left<=right){mid<-left+(right-left)%/%2L;if(mid<=x%/%mid){answer<-mid;left<-mid+1L}else right<-mid-1L};answer}
