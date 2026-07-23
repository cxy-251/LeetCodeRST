0070. Climbing Stairs
=====================

题目信息
--------

:题号: 0070
:难度: Easy
:主题: 动态规划、计数、斐波那契、矩阵快速幂
:原题: `LeetCode 0070 <https://leetcode.com/problems/climbing-stairs/>`_
:重点: 最后一步分类、重复子问题、两状态滚动、更新顺序

题目重述
--------

共有 ``n`` 级楼梯，每次只能走 1 级或 2 级，返回恰好到达第 ``n`` 级的不同步长序列数量。题目保证 ``1 <= n <= 45``，答案在 32 位有符号整数范围内。

自建示例
--------

.. code-block:: text

   n = 3 -> 3
   [1,1,1], [1,2], [2,1]

.. code-block:: text

   n = 5 -> 8
   n = 1 -> 1

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       int plainRecursion(int step) {
           if (step <= 2) return step;
           return plainRecursion(step - 1) + plainRecursion(step - 2);
       }

       int memoDfs(int step, std::vector<int>& memo) {
           if (step <= 2) return step;
           if (memo[step] != 0) return memo[step];
           return memo[step] = memoDfs(step - 1, memo) + memoDfs(step - 2, memo);
       }

       int rollingDp(int n) {
           if (n <= 2) return n;
           int previous_two = 1;
           int previous_one = 2;
           for (int step = 3; step <= n; ++step) {
               int current = previous_one + previous_two;
               previous_two = previous_one;
               previous_one = current;
           }
           return previous_one;
       }

       struct Matrix {
           long long a00, a01, a10, a11;
       };

       Matrix multiply(const Matrix& a, const Matrix& b) {
           return {
               a.a00*b.a00 + a.a01*b.a10,
               a.a00*b.a01 + a.a01*b.a11,
               a.a10*b.a00 + a.a11*b.a10,
               a.a10*b.a01 + a.a11*b.a11
           };
       }

       Matrix power(Matrix base, int exponent) {
           Matrix result{1,0,0,1};
           while (exponent > 0) {
               if (exponent & 1) result = multiply(result, base);
               base = multiply(base, base);
               exponent >>= 1;
           }
           return result;
       }

       int matrixPower(int n) {
           if (n <= 2) return n;
           Matrix transition{1,1,1,0};
           Matrix factor = power(transition, n - 2);
           return static_cast<int>(factor.a00 * 2 + factor.a01);
       }

   public:
       int climbStairs(int n) {
           return rollingDp(n);
       }
   };

题解
----

递归选择树为什么重复
~~~~~~~~~~~~~~~~~~

从剩余级数分别尝试走 1 或 2，会反复计算相同的 ``climb(step)``。例如求第 5 级时，第 3 级子问题同时出现在第 4 级和第 3 级分支中，朴素递归形成指数级树。

最后一步如何完整分类
~~~~~~~~~~~~~~~~~~~~

任何恰好到达第 ``step`` 级的走法，最后一步只能是：

* 从 ``step-1`` 走 1 级；
* 从 ``step-2`` 走 2 级。

两类由最后步长区分，互不重叠且覆盖全部走法：

.. code-block:: text

   ways(step) = ways(step-1) + ways(step-2)

基础状态为何是 1 和 2
~~~~~~~~~~~~~~~~~~~~

到第 1 级只有 ``[1]``；到第 2 级有 ``[1,1]`` 和 ``[2]``。也可定义 ``ways(0)=1`` 表示空步长序列，此时同一转移从第 2 级开始成立。

n = 5 的状态滚动
~~~~~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 目标级数
     - ``previous_two``
     - ``previous_one``
     - ``current``
   * - 初始对应 1、2
     - 1
     - 2
     - —
   * - 3
     - 1
     - 2
     - 3
   * - 4
     - 2
     - 3
     - 5
   * - 5
     - 3
     - 5
     - 8

为什么只需要两个变量
~~~~~~~~~~~~~~~~~~~~

当前状态只依赖前两个状态。算出 ``current`` 后，更早状态再不会参与后续转移，可以令 ``previous_two=previous_one``、``previous_one=current``，无需保存完整数组。

更新顺序为什么不能直接覆盖
~~~~~~~~~~~~~~~~~~~~~~~~~~

若先把 ``previous_one`` 覆盖为新值，再计算或更新 ``previous_two``，会丢失旧的第 ``step-1`` 状态。先保存 ``current``，再按从旧到新的顺序平移，能保持两个变量语义一致。

记忆化与迭代的关系
~~~~~~~~~~~~~~~~~~

记忆化递归保留“最后一步”的递归结构，并确保每个级数只计算一次；迭代 DP 按级数从小到大主动填充相同状态。两者转移完全一致，迭代省去缓存和调用栈。

为什么是斐波那契型序列
~~~~~~~~~~~~~~~~~~~~

转移与斐波那契相同，但初值为 ``ways(1)=1``、``ways(2)=2``，因此 ``ways(n)=F(n+1)``。矩阵 ``[[1,1],[1,0]]`` 可用快速幂在 ``O(log n)`` 时间推进状态。

为什么不会遗漏或重复走法
~~~~~~~~~~~~~~~~~~~~~~~~

按最后一步分类，每条走法唯一属于 1 级结尾或 2 级结尾集合。删除最后一步后分别与到达 ``step-1``、``step-2`` 的走法一一对应，所以求和既不重复也不遗漏。

复杂度来源
~~~~~~~~~~

朴素递归为 ``O(2^n)``。记忆化与滚动 DP 时间 ``O(n)``；前者空间 ``O(n)``，后者 ``O(1)``。矩阵快速幂时间 ``O(log n)``、额外空间 ``O(1)``。

九语言实现
----------

C
~

.. code-block:: c

   int climbStairs(int n){if(n<=2)return n;int two=1,one=2;for(int step=3;step<=n;step++){int current=one+two;two=one;one=current;}return one;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def climbStairs(self, n: int) -> int:
           if n <= 2: return n
           previous_two, previous_one = 1, 2
           for _ in range(3, n + 1): previous_two, previous_one = previous_one, previous_one + previous_two
           return previous_one

Java
~~~~

.. code-block:: java

   class Solution {public int climbStairs(int n){if(n<=2)return n;int two=1,one=2;for(int step=3;step<=n;step++){int current=one+two;two=one;one=current;}return one;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn climb_stairs(n:i32)->i32{if n<=2{return n}let(mut two,mut one)=(1,2);for _ in 3..=n{(two,one)=(one,one+two)}one}}

Go
~~

.. code-block:: go

   func climbStairs(n int)int{if n<=2{return n};two,one:=1,2;for step:=3;step<=n;step++{two,one=one,one+two};return one}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function climbStairs(n:number):number{if(n<=2)return n;let two=1,one=2;for(let step=3;step<=n;step++)[two,one]=[one,one+two];return one;}

C#
~~

.. code-block:: csharp

   public class Solution {public int ClimbStairs(int n){if(n<=2)return n;int two=1,one=2;for(int step=3;step<=n;step++){int current=one+two;two=one;one=current;}return one;}}

Julia
~~~~~

.. code-block:: julia

   function climb_stairs(n::Int)
       n<=2&&return n;two=1;one=2
       for _ in 3:n;two,one=one,one+two;end
       one
   end

R
~

.. code-block:: r

   climb_stairs <- function(n){if(n<=2L)return(n);two<-1L;one<-2L;for(step in 3:n){current<-one+two;two<-one;one<-current};one}
